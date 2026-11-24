/* =========================================================
   MOTOR DO JOGO — guarda o estado da missão, aplica as regras
   de pontuação, calcula o nível de segurança, dispara os
   alertas de ameaça e monta o relatório final.
   As telas "escutam" o motor por meio de CD.jogo.on(fn).
   ========================================================= */
window.CD = window.CD || {};

CD.jogo = (function () {
  let estado = null;
  let nivel = null;
  let relogio = null;
  let ultimo = 0;
  const ouvintes = [];

  const STATUS = {
    desconhecido: { nome: 'Não identificado',       status: 'neutro',   icone: 'help' },
    identificado: { nome: 'Aguardando análise',     status: 'info',     icone: 'search' },
    vulneravel:   { nome: 'Vulnerável',             status: 'critical', icone: 'shield-alert' },
    comprometido: { nome: 'Ainda vulnerável',       status: 'critical', icone: 'shield-x' },
    parcial:      { nome: 'Parcialmente protegido', status: 'warning',  icone: 'shield' },
    protegido:    { nome: 'Protegido',              status: 'good',     icone: 'shield-check' },
    seguro:       { nome: 'Seguro',                 status: 'good',     icone: 'shield-check' },
  };

  /* ---------------- Eventos ---------------- */
  function on(fn) { ouvintes.push(fn); }
  function emitir(tipo, dados) {
    ouvintes.forEach(function (fn) {
      try { fn(tipo || 'mudou', dados || {}); } catch (e) { console.error(e); }
    });
  }

  /* ---------------- Consultas ---------------- */
  function dispositivo(id) { return nivel.dispositivos.find(function (d) { return d.id === id; }); }
  function comodo(id) { return nivel.planta.comodos.find(function (c) { return c.id === id; }); }
  function alertaDef(id) { return nivel.alertas.find(function (a) { return a.id === id; }); }
  function vulnPorChave(chave) { return estado.vulns.find(function (v) { return v.chave === chave; }); }
  function vulnsDo(dispId) { return estado.vulns.filter(function (v) { return v.disp === dispId; }); }
  function contarDisp(fn) {
    return nivel.dispositivos.filter(function (d) { return fn(estado.disp[d.id]); }).length;
  }

  function statusDispositivo(id) {
    const d = estado.disp[id];
    if (!d.identificado) return 'desconhecido';
    if (!d.analisado) return 'identificado';
    const vs = vulnsDo(id);
    if (vs.length === 0) return 'seguro';
    if (vs.some(function (v) { return !v.q; })) return 'vulneravel';
    if (vs.some(function (v) { return v.q === 'ruim'; })) return 'comprometido';
    if (vs.some(function (v) { return v.q === 'parcial'; })) return 'parcial';
    return 'protegido';
  }

  /** Nível de segurança (%): itens seguros + riscos neutralizados, ponderados pela severidade. */
  function seguranca() {
    if (!estado) return 0;
    let total = 0, protegido = 0;
    nivel.dispositivos.forEach(function (d) {
      d.itens.forEach(function (it) { if (!it.vuln) { total += 1; protegido += 1; } });
    });
    estado.vulns.forEach(function (v) {
      const w = CD.SEVERIDADES[v.sev].peso;
      total += w;
      protegido += w * (v.q ? CD.QUALIDADES[v.q].mitiga : 0);
    });
    nivel.alertas.forEach(function (def) {
      const a = estado.alertas[def.id];
      if (a.status === 'aguardando') return;
      const w = CD.SEVERIDADES[def.sev].peso;
      total += w;
      protegido += w * (a.status === 'resolvido' ? CD.QUALIDADES[a.q].mitiga : 0);
    });
    return total ? Math.floor((100 * protegido) / total + 1e-9) : 100;
  }

  function objetivos() {
    const nd = nivel.dispositivos.length;
    const alertasFeitos = nivel.alertas.filter(function (def) {
      const s = estado.alertas[def.id].status;
      return s === 'resolvido' || s === 'expirado';
    }).length;
    return [
      { id: 'identificar', nome: 'Identificar os dispositivos', feito: contarDisp(function (d) { return d.identificado; }), total: nd, icone: 'radar' },
      { id: 'analisar', nome: 'Encontrar as vulnerabilidades', feito: contarDisp(function (d) { return d.analisado; }), total: nd, icone: 'search' },
      { id: 'responder', nome: 'Reconhecer as ameaças', feito: alertasFeitos, total: nivel.alertas.length, icone: 'alert' },
      { id: 'proteger', nome: 'Aplicar medidas de proteção', feito: estado.vulns.filter(function (v) { return v.q; }).length, total: estado.vulns.length, icone: 'shield-check' },
    ];
  }

  function alertasAtivos() {
    return nivel.alertas.filter(function (def) { return estado.alertas[def.id].status === 'ativo'; });
  }

  function comTempo() { return nivel.tempoAlerta > 0 && CD.store.config.tempoAlertas; }

  function pontuacaoMaxima() {
    const P = CD.PONTOS;
    let t = 0;
    nivel.dispositivos.forEach(function (d) {
      const nv = d.itens.filter(function (i) { return i.vuln; }).length;
      t += P.identificar + (nv ? nv * P.acerto : P.dispositivoSeguro);
    });
    t += estado.vulns.length * CD.QUALIDADES.otima.pontos;
    t += nivel.alertas.length * (P.classificacaoCerta + CD.QUALIDADES.otima.pontos);
    return t;
  }

  /* ---------------- Ciclo da missão ---------------- */
  function nova(nivelId) {
    parar();
    nivel = CD.NIVEIS.find(function (n) { return n.id === nivelId; });
    if (!nivel) return;
    const emb = CD.ui.embaralhar;
    estado = {
      id: Date.now() + '-' + Math.random().toString(36).slice(2, 7),
      nivelId: nivelId, iniciado: false, pausado: true, finalizado: false, concluidaAvisada: false,
      tempo: 0, pontos: 0, delta: null,
      comodos: {}, disp: {}, vulns: [], alertas: {},
      dicas: 0, falsosAlarmes: 0, lendo: null, conquistasNaMissao: [],
    };
    nivel.planta.comodos.forEach(function (c) { estado.comodos[c.id] = { explorado: false, escaneando: false }; });
    nivel.dispositivos.forEach(function (d) {
      estado.disp[d.id] = { identificado: false, identificando: false, analisado: false, marcados: [], dica: false, resultado: null };
      d.itens.forEach(function (it, idx) {
        if (!it.vuln) return;
        const v = CD.VULNS[it.vuln];
        estado.vulns.push({
          chave: d.id + '-' + idx, disp: d.id, item: idx, tipo: it.vuln, sev: it.sev || v.sev,
          detectada: null, medida: null, q: null, selecao: null,
          ordem: emb(v.medidas.map(function (_, i) { return i; })),
        });
      });
    });
    nivel.alertas.forEach(function (a) {
      estado.alertas[a.id] = {
        status: 'aguardando', gatilhoEm: null, surgiuEm: null, restante: 0, resolvidoEm: null,
        classificacao: null, classOk: null, resposta: null, q: null, selClass: null, selResp: null,
        opcoes: emb([a.ameaca].concat(a.distratores)),
        ordem: emb(a.respostas.map(function (_, i) { return i; })),
      };
    });
    relogio = setInterval(tick, 250);
    emitir('nova');
  }

  function comecar() {
    if (!estado) return;
    estado.iniciado = true;
    estado.pausado = false;
    ultimo = performance.now();
    emitir('comecou');
  }

  function pausar() { if (estado) estado.pausado = true; }
  function retomar() {
    if (estado && estado.iniciado && !estado.finalizado) {
      estado.pausado = false;
      ultimo = performance.now();
    }
  }

  function parar() {
    if (relogio) clearInterval(relogio);
    relogio = null;
  }

  function abandonar() {
    parar();
    estado = null;
    nivel = null;
    emitir('abandonou');
  }

  function pontuar(delta) {
    estado.pontos += delta;
    estado.delta = { v: delta, t: Date.now() };
  }

  /** Executa fn depois de ms, apenas se ainda for a mesma missão. */
  function depois(ms, fn) {
    const id = estado.id;
    setTimeout(function () { if (estado && estado.id === id) fn(); }, ms);
  }

  function conquistar(id) {
    if (CD.store.desbloquear(id)) {
      estado.conquistasNaMissao.push(id);
      const c = CD.CONQUISTAS.find(function (x) { return x.id === id; });
      CD.audio.tocar('conquista');
      CD.ui.toast({ tipo: 'conquista', titulo: 'Conquista desbloqueada!', texto: c ? c.nome : id, icone: c ? c.icone : 'trophy' });
    }
  }

  /* ---------------- Exploração ---------------- */
  function explorar(comodoId) {
    const c = estado && estado.comodos[comodoId];
    if (!c || c.explorado || c.escaneando || estado.finalizado) return;
    c.escaneando = true;
    CD.audio.tocar('scanner');
    emitir();
    depois(1100, function () {
      c.escaneando = false;
      c.explorado = true;
      const qtd = nivel.dispositivos.filter(function (d) { return d.comodo === comodoId; }).length;
      CD.ui.toast({
        tipo: qtd ? 'info' : 'sucesso',
        icone: 'radar',
        duracao: 3500,
        titulo: 'Cômodo explorado: ' + comodo(comodoId).nome,
        texto: qtd ? qtd + (qtd > 1 ? ' sinais detectados. Clique nos ícones “?” para identificar.' : ' sinal detectado. Clique no ícone “?” para identificar.')
                   : 'Nenhum dispositivo conectado neste cômodo.',
      });
      emitir('explorou', { id: comodoId });
    });
  }

  function identificar(dispId) {
    const d = estado.disp[dispId];
    if (!d || d.identificado || d.identificando || estado.finalizado) return;
    d.identificando = true;
    CD.audio.tocar('clique');
    emitir();
    depois(750, function () {
      d.identificando = false;
      d.identificado = true;
      pontuar(CD.PONTOS.identificar);
      CD.audio.tocar('identificar');
      emitir('identificou', { id: dispId });
    });
  }

  /* ---------------- Análise (identificar vulnerabilidades) ---------------- */
  function alternarMarca(dispId, idx) {
    const d = estado.disp[dispId];
    if (!d || d.analisado) return;
    const i = d.marcados.indexOf(idx);
    if (i >= 0) d.marcados.splice(i, 1); else d.marcados.push(idx);
    CD.audio.tocar('clique');
    emitir();
  }

  function usarDica(dispId) {
    const d = estado.disp[dispId];
    if (!d || d.dica || d.analisado) return;
    d.dica = true;
    estado.dicas++;
    pontuar(CD.PONTOS.dica);
    emitir();
  }

  function confirmarAnalise(dispId) {
    const d = estado.disp[dispId];
    if (!d || d.analisado) return;
    const def = dispositivo(dispId);
    let acertos = 0, falsos = 0, perdidos = 0, total = 0;
    def.itens.forEach(function (it, idx) {
      const marcado = d.marcados.indexOf(idx) >= 0;
      if (it.vuln) {
        total++;
        const v = estado.vulns.find(function (x) { return x.disp === dispId && x.item === idx; });
        v.detectada = marcado;
        if (marcado) acertos++; else perdidos++;
      } else if (marcado) {
        falsos++;
      }
    });
    const P = CD.PONTOS;
    let pts = acertos * P.acerto + falsos * P.falsoAlarme;
    if (total === 0 && falsos === 0) pts += P.dispositivoSeguro;
    estado.falsosAlarmes += falsos;
    d.analisado = true;
    d.resultado = { acertos: acertos, falsos: falsos, perdidos: perdidos, total: total, pontos: pts };
    pontuar(pts);
    CD.audio.tocar(perdidos === 0 && falsos === 0 ? 'sucesso' : (acertos > 0 ? 'parcial' : 'erro'));
    emitir('analisou', { id: dispId });
    verificarConclusao();
  }

  /* ---------------- Medidas de proteção ---------------- */
  function selecionarMedida(chave, idx) {
    const v = vulnPorChave(chave);
    if (!v || v.q) return;
    v.selecao = idx;
    emitir();
  }

  function aplicarMedida(chave) {
    const v = vulnPorChave(chave);
    if (!v || v.q || v.selecao === null) return;
    const m = CD.VULNS[v.tipo].medidas[v.selecao];
    v.medida = v.selecao;
    v.q = m.q;
    pontuar(CD.QUALIDADES[m.q].pontos);
    CD.audio.tocar(m.q === 'otima' ? 'sucesso' : (m.q === 'parcial' ? 'parcial' : 'erro'));
    emitir('aplicou', { chave: chave });
    verificarConclusao();
  }

  /* ---------------- Alertas (reconhecer ameaças) ---------------- */
  function lendo(id) { if (estado) estado.lendo = id; }

  function selecionarClassificacao(id, ameaca) {
    const a = estado.alertas[id];
    if (!a || a.classificacao || a.status !== 'ativo') return;
    a.selClass = ameaca;
    emitir();
  }

  function confirmarClassificacao(id) {
    const a = estado.alertas[id];
    if (!a || a.classificacao || !a.selClass || a.status !== 'ativo') return;
    const def = alertaDef(id);
    a.classificacao = a.selClass;
    a.classOk = a.selClass === def.ameaca;
    pontuar(a.classOk ? CD.PONTOS.classificacaoCerta : CD.PONTOS.classificacaoErrada);
    CD.audio.tocar(a.classOk ? 'sucesso' : 'erro');
    if (a.classOk && def.ameaca === 'legitimo') conquistar('nem_tudo_ataque');
    emitir();
  }

  function selecionarResposta(id, idx) {
    const a = estado.alertas[id];
    if (!a || a.q || !a.classificacao || a.status !== 'ativo') return;
    a.selResp = idx;
    emitir();
  }

  function confirmarResposta(id) {
    const a = estado.alertas[id];
    if (!a || a.q || !a.classificacao || a.selResp === null || a.status !== 'ativo') return;
    const r = alertaDef(id).respostas[a.selResp];
    a.resposta = a.selResp;
    a.q = r.q;
    a.status = 'resolvido';
    a.resolvidoEm = estado.tempo;
    pontuar(CD.QUALIDADES[r.q].pontos);
    CD.audio.tocar(r.q === 'otima' ? 'sucesso' : (r.q === 'parcial' ? 'parcial' : 'erro'));
    if (a.resolvidoEm - a.surgiuEm < 20000 && a.classOk && r.q === 'otima') conquistar('resposta_rapida');
    emitir('respondeu', { id: id });
    verificarConclusao();
  }

  function condicao(g) {
    if (!g) return true;
    if (g.tipo === 'identificado') return !!(estado.disp[g.alvo] && estado.disp[g.alvo].identificado);
    if (g.tipo === 'analisados') return contarDisp(function (d) { return d.analisado; }) >= g.n;
    if (g.tipo === 'tempo') return estado.tempo >= g.s * 1000;
    return true;
  }

  function ativarAlerta(def) {
    const a = estado.alertas[def.id];
    a.status = 'ativo';
    a.surgiuEm = estado.tempo;
    a.restante = nivel.tempoAlerta * 1000;
    CD.audio.tocar('alerta');
    emitir('alerta', { id: def.id });
  }

  function expirar(def) {
    const a = estado.alertas[def.id];
    a.status = 'expirado';
    a.restante = 0;
    a.resolvidoEm = estado.tempo;
    pontuar(CD.PONTOS.alertaExpirado);
    CD.audio.tocar('erro');
    emitir('expirou', { id: def.id });
    verificarConclusao();
  }

  /* ---------------- Relógio (4x por segundo) ---------------- */
  function tick() {
    const agora = performance.now();
    if (!estado || !estado.iniciado || estado.pausado || estado.finalizado || document.hidden) {
      ultimo = agora;
      return;
    }
    const dt = Math.min(1000, agora - ultimo);
    ultimo = agora;
    estado.tempo += dt;

    // Quando todo o trabalho acabou, os alertas que faltam chegam logo.
    const tudoFeito = nivel.dispositivos.every(function (d) { return estado.disp[d.id].analisado; }) &&
      estado.vulns.every(function (v) { return v.q; });

    nivel.alertas.forEach(function (def) {
      const a = estado.alertas[def.id];
      if (a.status !== 'aguardando') return;
      if (a.gatilhoEm === null && (tudoFeito || condicao(def.gatilho))) a.gatilhoEm = estado.tempo;
      if (a.gatilhoEm !== null) {
        const atraso = (def.gatilho && def.gatilho.atraso) || 0;
        const espera = (tudoFeito ? Math.min(atraso, 3) : atraso) * 1000;
        if (estado.tempo - a.gatilhoEm >= espera) ativarAlerta(def);
      }
    });

    if (comTempo()) {
      nivel.alertas.forEach(function (def) {
        const a = estado.alertas[def.id];
        if (a.status !== 'ativo' || estado.lendo === def.id) return; // pausa enquanto o jogador lê o alerta
        a.restante -= dt;
        if (a.restante <= 0) expirar(def);
      });
    }
    emitir('tick');
  }

  function verificarConclusao() {
    if (!estado || estado.concluidaAvisada) return;
    const ok = objetivos().every(function (o) { return o.feito >= o.total; });
    if (ok) {
      estado.concluidaAvisada = true;
      depois(900, function () {
        CD.audio.tocar('fim');
        emitir('concluida');
      });
    }
  }

  /* ---------------- Relatório final ---------------- */
  function montarRelatorio() {
    const seg = seguranca();
    const max = pontuacaoMaxima();
    const pontos = Math.max(0, estado.pontos);
    const pct = max ? pontos / max : 0;
    const estrelas = pct >= 0.85 ? 3 : pct >= 0.6 ? 2 : pct >= 0.35 ? 1 : 0;
    const prot = CD.nivelProtecao(seg);

    const vulns = estado.vulns.map(function (v) {
      const def = CD.VULNS[v.tipo];
      const d = dispositivo(v.disp);
      const it = d.itens[v.item];
      return {
        disp: d.nome, comodo: comodo(d.comodo).nome, item: it.r, valor: it.v,
        nome: def.nome, sev: v.sev, cat: def.cat, detectada: v.detectada,
        medida: v.medida !== null ? def.medidas[v.medida].t : null, q: v.q,
        melhor: def.medidas.find(function (m) { return m.q === 'otima'; }).t,
      };
    });

    const ameacas = nivel.alertas.map(function (def) {
      const a = estado.alertas[def.id];
      return {
        titulo: def.titulo, disp: def.dispositivo ? dispositivo(def.dispositivo).nome : 'Caixa de e-mail',
        sev: def.sev, status: a.status, correta: CD.AMEACAS[def.ameaca].nome,
        classificacao: a.classificacao ? CD.AMEACAS[a.classificacao].nome : null, classOk: a.classOk,
        resposta: a.resposta !== null ? def.respostas[a.resposta].t : null, q: a.q,
        melhor: def.respostas.find(function (r) { return r.q === 'otima'; }).t,
        tempoResposta: (a.resolvidoEm !== null && a.surgiuEm !== null && a.status === 'resolvido') ? a.resolvidoEm - a.surgiuEm : null,
      };
    });

    // Desempenho por tema
    const cats = {};
    vulns.forEach(function (v) {
      cats[v.cat] = cats[v.cat] || { otimas: 0, total: 0 };
      cats[v.cat].total++;
      if (v.q === 'otima') cats[v.cat].otimas++;
    });
    const surgidas = ameacas.filter(function (a) { return a.status !== 'aguardando'; });
    if (surgidas.length) {
      cats.ameacas = {
        otimas: surgidas.filter(function (a) { return a.classOk && a.q === 'otima'; }).length,
        total: surgidas.length,
      };
    }

    const recomendacoes = Object.keys(cats)
      .filter(function (c) { return cats[c].otimas < cats[c].total; })
      .sort(function (a, b) { return (cats[a].otimas / cats[a].total) - (cats[b].otimas / cats[b].total); })
      .map(function (c) { return { cat: c, texto: CD.RECOMENDACOES[c] }; });

    const conta = function (lista, fn) { return lista.filter(fn).length; };

    return {
      id: 'r' + Date.now().toString(36),
      nivelId: nivel.id, nivelNome: nivel.nome, local: nivel.local, dificuldade: nivel.dificuldade,
      data: new Date().toISOString(), nome: CD.store.config.nome || '',
      duracao: estado.tempo, pontos: pontos, pontosMax: max, estrelas: estrelas, seguranca: seg,
      protecao: { nome: prot.nome, status: prot.status, icone: prot.icone, desc: prot.desc },
      comTempo: comTempo(),
      comodos: {
        total: nivel.planta.comodos.length,
        explorados: nivel.planta.comodos.filter(function (c) { return estado.comodos[c.id].explorado; }).length,
      },
      dispositivos: {
        total: nivel.dispositivos.length,
        identificados: contarDisp(function (d) { return d.identificado; }),
        analisados: contarDisp(function (d) { return d.analisado; }),
      },
      vulnsResumo: {
        total: vulns.length,
        detectadas: conta(vulns, function (v) { return v.detectada === true; }),
        perdidas: conta(vulns, function (v) { return v.detectada === false; }),
        otimas: conta(vulns, function (v) { return v.q === 'otima'; }),
        parciais: conta(vulns, function (v) { return v.q === 'parcial'; }),
        ruins: conta(vulns, function (v) { return v.q === 'ruim'; }),
        pendentes: conta(vulns, function (v) { return !v.q; }),
      },
      ameacasResumo: {
        total: ameacas.length,
        surgiram: surgidas.length,
        reconhecidas: conta(ameacas, function (a) { return a.classOk === true; }),
        otimas: conta(ameacas, function (a) { return a.q === 'otima'; }),
        resolvidas: conta(ameacas, function (a) { return a.status === 'resolvido'; }),
        expiradas: conta(ameacas, function (a) { return a.status === 'expirado'; }),
      },
      falsosAlarmes: estado.falsosAlarmes,
      dicas: estado.dicas,
      vulns: vulns, ameacas: ameacas, categorias: cats, recomendacoes: recomendacoes,
      conquistas: [],
    };
  }

  function avaliarConquistas(rel) {
    const novas = [];
    function tenta(id) { if (CD.store.desbloquear(id)) novas.push(id); }
    const v = rel.vulnsResumo, a = rel.ameacasResumo, d = rel.dispositivos;
    const tudoAnalisado = d.analisados === d.total;
    if (rel.estrelas >= 1) tenta('primeiro_escudo');
    if (v.total > 0 && v.detectadas === v.total) tenta('detetive');
    if (tudoAnalisado && rel.falsosAlarmes === 0) tenta('olhar_clinico');
    if (a.total > 0 && a.reconhecidas === a.total) tenta('cacador');
    if (rel.seguranca >= 100) tenta('fortaleza');
    if (rel.comodos.explorados === rel.comodos.total) tenta('explorador');
    if (tudoAnalisado && rel.dicas === 0) tenta('autodidata');
    if (rel.comTempo && a.total > 0 && a.resolvidas === a.total) tenta('nenhum_esquecido');
    if (rel.estrelas === 3) tenta('tres_estrelas');
    const todas = CD.NIVEIS.every(function (n) {
      return n.id === rel.nivelId ? rel.estrelas >= 1 : CD.store.progressoNivel(n.id).concluido;
    });
    if (todas) tenta('cyber_defensor');
    const mestre = CD.NIVEIS.every(function (n) {
      return n.id === rel.nivelId ? rel.estrelas === 3 : CD.store.progressoNivel(n.id).melhorEstrelas === 3;
    });
    if (mestre) tenta('mestre');
    return novas;
  }

  /** Encerra a missão, salva o relatório e o devolve. */
  function finalizar() {
    if (!estado || estado.finalizado) return null;
    estado.finalizado = true;
    estado.pausado = true;
    // Alertas que estavam abertos ficam como "sem resposta".
    nivel.alertas.forEach(function (def) {
      const a = estado.alertas[def.id];
      if (a.status === 'ativo') a.status = 'sem-resposta';
    });
    const rel = montarRelatorio();
    const novas = avaliarConquistas(rel);
    rel.conquistas = estado.conquistasNaMissao.concat(novas);
    CD.store.registrarRelatorio(rel);
    parar();
    return rel;
  }

  return {
    STATUS: STATUS,
    on: on,
    get estado() { return estado; },
    get nivel() { return nivel; },
    ativo: function () { return !!(estado && !estado.finalizado); },
    dispositivo: dispositivo, comodo: comodo, alertaDef: alertaDef, vulnsDo: vulnsDo, vulnPorChave: vulnPorChave,
    statusDispositivo: statusDispositivo, seguranca: seguranca, objetivos: objetivos, alertasAtivos: alertasAtivos,
    comTempo: comTempo, pontuacaoMaxima: pontuacaoMaxima,
    nova: nova, comecar: comecar, pausar: pausar, retomar: retomar, abandonar: abandonar, finalizar: finalizar,
    explorar: explorar, identificar: identificar, alternarMarca: alternarMarca, usarDica: usarDica,
    confirmarAnalise: confirmarAnalise, selecionarMedida: selecionarMedida, aplicarMedida: aplicarMedida,
    lendo: lendo, selecionarClassificacao: selecionarClassificacao, confirmarClassificacao: confirmarClassificacao,
    selecionarResposta: selecionarResposta, confirmarResposta: confirmarResposta,
  };
})();
