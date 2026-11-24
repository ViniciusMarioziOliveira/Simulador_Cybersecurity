/* =========================================================
   TELA: MISSÃO (a partida em si)
   - Planta da casa (explorar e identificar)
   - Janela do dispositivo (identificar vulnerabilidades e
     selecionar medidas de proteção)
   - Janela do alerta (reconhecer ameaças e responder)
   ========================================================= */
window.CD = window.CD || {};
CD.telas = CD.telas || {};

CD.telas.missao = (function () {
  const I = CD.icone, U = CD.ui, esc = CD.ui.esc, J = CD.jogo;
  let montada = false;
  let svg = null;
  let concluidaPendente = false;

  /* ================= Montagem da tela ================= */
  function montar(view) {
    if (!J.ativo()) { location.hash = '#/jogar'; return; }
    montada = true;
    concluidaPendente = false;
    const n = J.nivel;
    view.innerHTML = `
      <div class="missao">
        <section class="card painel-mapa">
          <div class="mapa-cab">
            <div class="mapa-tit">
              <span class="eyebrow">Missão ${n.id} · ${esc(n.dificuldade)} · ${esc(n.nome)}</span>
              <h1>${esc(n.local)}</h1>
            </div>
            <div class="mapa-cab-dir">
              <span class="pilula" id="ms-comodos"></span>
              <button class="btn btn-fantasma btn-sm" data-acao="sair-missao" title="Pausar e voltar às missões">${I('pause')}Pausar</button>
            </div>
          </div>
          <div class="mapa-wrap">${CD.planta.render(n)}</div>
          <div class="mapa-rodape">
            <div class="coach" id="ms-coach" aria-live="polite"></div>
            <ul class="legenda" aria-label="Legenda dos dispositivos">
              <li><span class="lg-dot st-desconhecido">?</span>Sinal não identificado</li>
              <li><span class="lg-dot st-identificado"></span>Aguardando análise</li>
              <li><span class="lg-dot st-vulneravel">!</span>Vulnerável</li>
              <li><span class="lg-dot st-parcial">–</span>Parcial</li>
              <li><span class="lg-dot st-protegido">✓</span>Protegido / seguro</li>
            </ul>
          </div>
        </section>
        <aside class="painel-lateral">
          <section class="card" id="ms-objetivos"></section>
          <section class="card" id="ms-alertas"></section>
          <section class="card" id="ms-disp"></section>
          <button class="btn btn-primario btn-bloco" id="ms-finalizar" data-acao="finalizar-missao">${I('file-text')}Finalizar e gerar relatório</button>
        </aside>
      </div>`;
    svg = view.querySelector('svg.planta');
    atualizar();
    if (!J.estado.iniciado) abrirBriefing(); else J.retomar();
  }

  function desmontar() {
    montada = false;
    svg = null;
    if (J.ativo()) J.pausar();
  }

  /* ================= Atualizações ================= */
  function atualizar() {
    if (!montada || !J.ativo()) return;
    CD.planta.atualizar(svg, J.nivel, J.estado);
    renderObjetivos();
    renderAlertas();
    renderDispositivos();
    renderCoach();
    const e = J.estado, n = J.nivel;
    const exp = n.planta.comodos.filter(function (c) { return e.comodos[c.id].explorado; }).length;
    const el = document.getElementById('ms-comodos');
    if (el) el.innerHTML = I('map') + 'Cômodos explorados: <strong>' + exp + '/' + n.planta.comodos.length + '</strong>';
    const fim = document.getElementById('ms-finalizar');
    if (fim) fim.classList.toggle('pronto', J.objetivos().every(function (o) { return o.feito >= o.total; }));
  }

  /** Atualiza só os cronômetros dos alertas (chamado 4x por segundo). */
  function atualizarContagens() {
    if (!montada || !J.ativo()) return;
    const e = J.estado, total = J.nivel.tempoAlerta * 1000;
    document.querySelectorAll('[data-contagem]').forEach(function (el) {
      const a = e.alertas[el.dataset.contagem];
      if (a) el.textContent = U.tempo(a.restante);
    });
    document.querySelectorAll('[data-barra]').forEach(function (el) {
      const a = e.alertas[el.dataset.barra];
      if (!a) return;
      el.style.width = Math.max(0, (a.restante / total) * 100) + '%';
      el.parentNode.classList.toggle('urgente', a.restante < 15000);
    });
  }

  function renderObjetivos() {
    const el = document.getElementById('ms-objetivos');
    if (!el) return;
    el.innerHTML = '<h2 class="card-tit">' + I('list-checks') + 'Objetivos da missão</h2><ul class="objetivos">' +
      J.objetivos().map(function (o) {
        const ok = o.feito >= o.total;
        const pct = o.total ? (o.feito / o.total) * 100 : 100;
        return '<li class="obj' + (ok ? ' ok' : '') + '"><span class="obj-ic">' + I(ok ? 'check' : o.icone) + '</span>' +
          '<div class="obj-txt"><div class="obj-linha"><span>' + o.nome + '</span><span class="obj-num">' + o.feito + '/' + o.total + '</span></div>' +
          U.meter(pct, ok ? 'good' : 'info', o.nome) + '</div></li>';
      }).join('') + '</ul>';
  }

  function renderAlertas() {
    const el = document.getElementById('ms-alertas');
    if (!el) return;
    const e = J.estado, n = J.nivel, comTempo = J.comTempo();
    const ativos = n.alertas.filter(function (a) { return e.alertas[a.id].status === 'ativo'; });
    const feitos = n.alertas.filter(function (a) { const s = e.alertas[a.id].status; return s === 'resolvido' || s === 'expirado'; });
    let h = '<h2 class="card-tit">' + I('bell') + 'Alertas de ameaça <span class="contador' + (ativos.length ? ' quente' : '') + '">' + ativos.length + '</span></h2>';
    if (!ativos.length && !feitos.length) {
      h += '<p class="vazio">' + I('radar') + 'Monitoramento ativo. Nenhum alerta por enquanto.</p>';
    }
    h += '<ul class="lista-alertas">';
    ativos.forEach(function (def) {
      const a = e.alertas[def.id];
      const pct = comTempo ? Math.max(0, (a.restante / (n.tempoAlerta * 1000)) * 100) : 100;
      h += '<li><button class="alerta-item ativo" data-acao="abrir-alerta" data-alerta="' + def.id + '">' +
        '<span class="ai-ic">' + I('alert') + '</span>' +
        '<span class="ai-txt"><span class="ai-tit">' + esc(def.titulo) + '</span>' +
          '<span class="ai-sub">' + U.chipSev(def.sev) +
            (comTempo ? '<span class="ai-tempo">' + I('timer') + '<span data-contagem="' + def.id + '">' + U.tempo(a.restante) + '</span></span>' : '<span class="ai-tempo">Aguardando resposta</span>') +
          '</span>' +
          (comTempo ? '<span class="ai-barra' + (a.restante < 15000 ? ' urgente' : '') + '"><span data-barra="' + def.id + '" style="width:' + pct + '%"></span></span>' : '') +
        '</span><span class="ai-cta">Responder' + I('chevron-right') + '</span></button></li>';
    });
    feitos.forEach(function (def) {
      const a = e.alertas[def.id];
      let chip;
      if (a.status === 'expirado') chip = U.chipStatus('critical', 'Expirado', 'timer');
      else {
        const Q = CD.QUALIDADES[a.q];
        chip = U.chipStatus(Q.status, Q.curto, a.q === 'otima' ? 'check' : (a.q === 'parcial' ? 'minus' : 'x'));
      }
      h += '<li><button class="alerta-item feito" data-acao="abrir-alerta" data-alerta="' + def.id + '">' +
        '<span class="ai-ic">' + I(a.status === 'expirado' ? 'timer' : 'shield-check') + '</span>' +
        '<span class="ai-txt"><span class="ai-tit">' + esc(def.titulo) + '</span></span>' + chip + '</button></li>';
    });
    h += '</ul>';
    el.innerHTML = h;
  }

  function renderDispositivos() {
    const el = document.getElementById('ms-disp');
    if (!el) return;
    const e = J.estado, n = J.nivel;
    const ident = n.dispositivos.filter(function (d) { return e.disp[d.id].identificado; });
    const faltam = n.dispositivos.length - ident.length;
    let h = '<h2 class="card-tit">' + I('cpu') + 'Dispositivos <span class="contador">' + ident.length + '/' + n.dispositivos.length + '</span></h2>';
    if (ident.length) {
      h += '<ul class="lista-disp">' + ident.map(function (d) {
        const st = J.statusDispositivo(d.id), S = J.STATUS[st];
        return '<li><button class="disp-item" data-acao="abrir-dispositivo" data-disp="' + d.id + '">' +
          '<span class="di-ic st-' + S.status + '">' + I(CD.TIPOS_DISPOSITIVO[d.tipo].icone) + '</span>' +
          '<span class="di-txt"><span class="di-nome">' + esc(d.nome) + '</span>' +
            '<span class="di-sub"><span class="di-st st-' + S.status + '">' + I(S.icone) + esc(S.nome) + '</span> · ' + esc(J.comodo(d.comodo).nome) + '</span></span>' +
          I('chevron-right') + '</button></li>';
      }).join('') + '</ul>';
    }
    if (faltam) {
      h += '<p class="vazio">' + I('radar') + (faltam === 1 ? '1 dispositivo ainda não foi encontrado.' : faltam + ' dispositivos ainda não foram encontrados.') + ' Explore a casa!</p>';
    }
    el.innerHTML = h;
  }

  /** Mensagem do instrutor: sugere o próximo passo. */
  function textoCoach() {
    const e = J.estado, n = J.nivel;
    if (J.alertasAtivos().length) return { ic: 'alert', cls: 'coach-alerta', t: 'Há um alerta de ameaça esperando resposta! Abra-o no painel “Alertas de ameaça”.' };
    const explorados = n.planta.comodos.filter(function (c) { return e.comodos[c.id].explorado; });
    if (!explorados.length) return { ic: 'radar', t: 'Comece explorando: clique em um cômodo coberto da planta para escaneá-lo.' };
    const sinal = n.dispositivos.find(function (d) { return e.comodos[d.comodo].explorado && !e.disp[d.id].identificado; });
    if (sinal) return { ic: 'radar', t: 'Sinal detectado em ' + J.comodo(sinal.comodo).nome + '! Clique no ícone “?” para identificar o dispositivo.' };
    const analisar = n.dispositivos.find(function (d) { return e.disp[d.id].identificado && !e.disp[d.id].analisado; });
    if (analisar) return { ic: 'search', t: 'Abra “' + analisar.nome + '” e marque as configurações que parecem perigosas.' };
    const pend = e.vulns.find(function (v) { return e.disp[v.disp].analisado && !v.q; });
    if (pend) return { ic: 'shield-check', t: 'Escolha uma medida de proteção para cada vulnerabilidade de “' + J.dispositivo(pend.disp).nome + '”.' };
    const falta = n.planta.comodos.length - explorados.length;
    if (falta) return { ic: 'map', t: (falta === 1 ? 'Ainda há 1 cômodo' : 'Ainda há ' + falta + ' cômodos') + ' sem explorar.' };
    if (n.alertas.some(function (a) { return e.alertas[a.id].status === 'aguardando'; })) return { ic: 'bell', t: 'Fique atento: novas ameaças podem surgir a qualquer momento.' };
    return { ic: 'check', cls: 'coach-ok', t: 'Tudo pronto! Clique em “Finalizar e gerar relatório”.' };
  }

  function renderCoach() {
    const el = document.getElementById('ms-coach');
    if (!el) return;
    if (!CD.store.config.dicas) { el.hidden = true; return; }
    const c = textoCoach();
    el.hidden = false;
    el.className = 'coach ' + (c.cls || '');
    el.innerHTML = '<span class="coach-ic">' + I(c.ic) + '</span><span><strong>Instrutor:</strong> ' + esc(c.t) + '</span>';
  }

  /* ================= Partes reutilizáveis ================= */
  function etapa(num, titulo, texto) {
    return '<div class="etapa"><span class="etapa-num">' + num + '</span><div><h3>' + titulo + '</h3>' + (texto ? '<p>' + texto + '</p>' : '') + '</div></div>';
  }

  function sinal(v) { return (v > 0 ? '+' : '') + v; }

  function iconeQualidade(q) { return q === 'otima' ? 'check' : (q === 'parcial' ? 'minus' : 'x'); }

  /* ================= Janela do dispositivo ================= */
  function abrirDispositivo(id, novo) {
    U.modal.abrir({
      id: 'disp:' + id, tamanho: 'lg',
      render: function () { return renderDispositivo(id, novo); },
      aoFechar: aoFecharJanela,
    });
  }

  function renderDispositivo(id, novo) {
    const d = J.dispositivo(id), ed = J.estado.disp[id], tipo = CD.TIPOS_DISPOSITIVO[d.tipo];
    const S = J.STATUS[J.statusDispositivo(id)];
    let corpo = '';

    if (novo && !ed.analisado) {
      corpo += '<div class="aviso aviso-sucesso">' + I('radar') + '<div><strong>Dispositivo identificado!</strong> ' + sinal(CD.PONTOS.identificar) + ' pontos. Agora analise as configurações dele.</div></div>';
    }
    corpo += '<div class="ficha"><dl>' +
      '<div><dt>Tipo</dt><dd>' + esc(tipo.nome) + '</dd></div>' +
      '<div><dt>Cômodo</dt><dd>' + esc(J.comodo(d.comodo).nome) + '</dd></div>' +
      '<div><dt>Modelo</dt><dd>' + esc(d.modelo) + '</dd></div>' +
      '<div><dt>Endereço</dt><dd>' + esc(d.ip) + '</dd></div>' +
      '</dl>' + U.chipStatus(S.status, S.nome, S.icone) + '</div>';

    if (!ed.analisado) {
      corpo += etapa(1, 'Identifique as vulnerabilidades', 'Leia cada configuração e marque as que representam risco. Cuidado: marcar algo seguro conta como falso alarme.');
      corpo += '<div class="cfg-lista">' + d.itens.map(function (it, idx) {
        const m = ed.marcados.indexOf(idx) >= 0;
        return '<button class="cfg' + (m ? ' marcado' : '') + '" data-acao="marcar-item" data-disp="' + id + '" data-idx="' + idx + '" data-foco="cfg-' + idx + '" aria-pressed="' + m + '">' +
          '<span class="cfg-rot">' + esc(it.r) + '</span><span class="cfg-val">' + esc(it.v) + '</span>' +
          '<span class="cfg-marca">' + I('flag') + (m ? 'Marcado como risco' : 'Marcar como risco') + '</span></button>';
      }).join('') + '</div>';
      if (ed.dica) {
        const nv = d.itens.filter(function (i) { return i.vuln; }).length;
        corpo += '<div class="aviso aviso-dica">' + I('tip') + '<div><strong>Dica do instrutor:</strong> ' +
          (nv === 0 ? 'este dispositivo não tem nenhuma configuração vulnerável.' : 'este dispositivo tem ' + nv + (nv > 1 ? ' configurações vulneráveis.' : ' configuração vulnerável.')) + '</div></div>';
      }
    } else {
      const r = ed.resultado;
      corpo += '<div class="resumo-analise">' +
        '<div><span>Encontradas</span><strong>' + r.acertos + '/' + r.total + '</strong></div>' +
        '<div><span>Deixou passar</span><strong>' + r.perdidos + '</strong></div>' +
        '<div><span>Falsos alarmes</span><strong>' + r.falsos + '</strong></div>' +
        '<div><span>Pontos da análise</span><strong>' + sinal(r.pontos) + '</strong></div></div>';
      corpo += '<div class="cfg-lista revisada">' + d.itens.map(function (it, idx) { return linhaRevisada(id, ed, it, idx); }).join('') + '</div>';
      const vs = J.vulnsDo(id);
      if (vs.length) {
        corpo += etapa(2, 'Selecione as medidas de proteção', 'Para cada vulnerabilidade, escolha a medida mais adequada. A decisão é definitiva e muda o nível de segurança da casa.');
        corpo += vs.map(cartaoVuln).join('');
      } else {
        corpo += '<div class="aviso aviso-sucesso">' + I('shield-check') + '<div><strong>Dispositivo seguro.</strong> Nenhuma configuração deste aparelho precisa de correção' +
          (r.falsos === 0 ? ' — e você não gerou nenhum falso alarme (' + sinal(CD.PONTOS.dispositivoSeguro) + ' pts).' : '.') + '</div></div>';
      }
    }

    let rodape;
    if (!ed.analisado) {
      const qtd = ed.marcados.length;
      rodape = '<button class="btn btn-fantasma" data-acao="usar-dica" data-disp="' + id + '"' + (ed.dica ? ' disabled' : '') + '>' + I('tip') +
          (ed.dica ? 'Dica usada' : 'Usar dica (' + CD.PONTOS.dica + ' pts)') + '</button>' +
        '<button class="btn btn-acento" data-acao="confirmar-analise" data-disp="' + id + '">' + I('check') +
          (qtd ? 'Confirmar análise (' + qtd + (qtd > 1 ? ' marcadas)' : ' marcada)') : 'Confirmar: nenhum risco') + '</button>';
    } else {
      const prox = proximoPendente(id);
      rodape = '<button class="btn btn-fantasma" data-acao="modal-fechar">' + I('map') + 'Voltar à planta</button>' +
        (prox ? '<button class="btn btn-acento" data-acao="abrir-dispositivo" data-disp="' + prox.id + '">Próximo: ' + esc(prox.nome) + I('arrow-right') + '</button>' : '');
    }

    return {
      titulo: esc(d.nome),
      subtitulo: esc(tipo.nome) + ' · ' + esc(J.comodo(d.comodo).nome),
      icone: tipo.icone, iconeClasse: 'ic-' + S.status,
      corpo: corpo, rodape: rodape,
    };
  }

  function linhaRevisada(dispId, ed, it, idx) {
    const marcado = ed.marcados.indexOf(idx) >= 0;
    let cls, res, exp = '';
    if (it.vuln) {
      const v = J.estado.vulns.find(function (x) { return x.disp === dispId && x.item === idx; });
      exp = CD.VULNS[it.vuln].nome;
      if (v.detectada) { cls = 'acerto'; res = U.chipStatus('good', 'Vulnerabilidade encontrada (' + sinal(CD.PONTOS.acerto) + ')', 'check'); }
      else { cls = 'perdida'; res = U.chipStatus('serious', 'Você deixou passar', 'alert'); }
    } else if (marcado) {
      cls = 'falso'; res = U.chipStatus('critical', 'Falso alarme (' + CD.PONTOS.falsoAlarme + ')', 'x'); exp = it.ok;
    } else {
      cls = 'ok'; res = '<span class="cfg-ok">' + I('check') + 'Seguro</span>';
    }
    return '<div class="cfg ' + cls + '"><span class="cfg-rot">' + esc(it.r) + '</span><span class="cfg-val">' + esc(it.v) + '</span>' +
      '<span class="cfg-res">' + res + '</span>' + (exp ? '<p class="cfg-exp">' + esc(exp) + '</p>' : '') + '</div>';
  }

  function cartaoVuln(v) {
    const def = CD.VULNS[v.tipo];
    const d = J.dispositivo(v.disp);
    const it = d.itens[v.item];
    let h = '<article class="vuln' + (v.q ? ' q-' + v.q : '') + '">' +
      '<header class="vuln-cab"><div><h3>' + I(CD.CATEGORIAS[def.cat].icone) + esc(def.nome) + '</h3>' +
        '<p class="vuln-ref">' + esc(it.r) + ': <code>' + esc(it.v) + '</code>' +
        (v.detectada === false ? ' <span class="tag-revelada">revelada pelo instrutor</span>' : '') + '</p></div>' +
        U.chipSev(v.sev) + '</header>' +
      '<p class="vuln-desc"><strong>Por que é perigoso:</strong> ' + esc(it.desc || def.desc) + '</p>';

    if (!v.q) {
      h += '<div class="opcoes" role="group" aria-label="Medidas de proteção">' + v.ordem.map(function (i, k) {
        const m = def.medidas[i], sel = v.selecao === i;
        return '<button class="opcao' + (sel ? ' sel' : '') + '" data-acao="sel-medida" data-chave="' + v.chave + '" data-idx="' + i + '" data-foco="m-' + v.chave + '-' + i + '" aria-pressed="' + sel + '">' +
          '<span class="opcao-letra">' + 'ABCD'[k] + '</span><span>' + esc(m.t) + '</span></button>';
      }).join('') + '</div>' +
      '<div class="vuln-acao"><button class="btn btn-acento" data-acao="aplicar-medida" data-chave="' + v.chave + '"' + (v.selecao === null ? ' disabled' : '') + '>' +
        I('shield-check') + 'Aplicar medida</button></div>';
    } else {
      const m = def.medidas[v.medida], Q = CD.QUALIDADES[v.q];
      const melhor = def.medidas.find(function (x) { return x.q === 'otima'; });
      h += '<div class="escolha q-' + v.q + '"><div class="escolha-cab">' + U.chipStatus(Q.status, Q.nome, iconeQualidade(v.q)) +
        '<span class="pts">' + sinal(Q.pontos) + ' pts</span></div>' +
        '<p><strong>Sua escolha:</strong> ' + esc(m.t) + '</p><p class="escolha-fb">' + esc(m.f) + '</p>' +
        (v.q !== 'otima' ? '<p class="escolha-melhor">' + I('tip') + '<span><strong>Melhor medida:</strong> ' + esc(melhor.t) + '</span></p>' : '') +
      '</div>';
    }
    return h + '</article>';
  }

  function proximoPendente(atual) {
    const e = J.estado;
    return J.nivel.dispositivos.find(function (d) {
      if (d.id === atual || !e.disp[d.id].identificado) return false;
      if (!e.disp[d.id].analisado) return true;
      return J.vulnsDo(d.id).some(function (v) { return !v.q; });
    });
  }

  /* ================= Janela do alerta ================= */
  function abrirAlerta(id) {
    U.modal.abrir({
      id: 'alerta:' + id, tamanho: 'lg',
      render: function () { return renderAlerta(id); },
      aoFechar: function () { J.lendo(null); aoFecharJanela(); },
    });
    J.lendo(id);
    removerToastsDeAlerta(id);
  }

  /** Some com as notificações de alerta (de um alerta específico ou de todos). */
  function removerToastsDeAlerta(id) {
    const sel = id ? '.toast [data-alerta="' + id + '"]' : '.toast [data-acao="abrir-alerta"]';
    document.querySelectorAll(sel).forEach(function (b) { U.removerToast(b.closest('.toast')); });
  }

  function renderAlerta(id) {
    const def = J.alertaDef(id), a = J.estado.alertas[id];
    const disp = def.dispositivo ? J.dispositivo(def.dispositivo) : null;
    const ativo = a.status === 'ativo';
    const classificado = !!a.classificacao;
    let corpo = '';

    if (ativo && J.comTempo()) {
      corpo += '<div class="aviso aviso-tempo">' + I('pause') + '<div>O cronômetro deste alerta fica <strong>pausado</strong> enquanto esta janela estiver aberta. Tempo restante: <strong>' + U.tempo(a.restante) + '</strong>.</div></div>';
    }
    if (a.status === 'expirado') {
      corpo += '<div class="aviso aviso-perigo">' + I('timer') + '<div><strong>Tempo esgotado.</strong> O alerta ficou sem resposta e a ameaça causou danos (' + CD.PONTOS.alertaExpirado + ' pts). Veja abaixo como ele deveria ter sido tratado.</div></div>';
    }

    corpo += '<div class="evidencias"><div class="ev-cab">' + I('terminal') + esc(def.evidencias[0]) + '</div>' +
      '<pre class="ev-corpo">' + def.evidencias.slice(1).map(esc).join('\n') + '</pre></div>';

    corpo += etapa(1, 'Que tipo de ameaça é esta?', 'Leia as evidências com atenção e escolha a classificação correta.');
    corpo += '<div class="opcoes-grade">' + a.opcoes.map(function (t) {
      const T = CD.AMEACAS[t];
      let cls = '';
      if (classificado || !ativo) cls = t === def.ameaca ? 'certa' : (t === a.classificacao ? 'errada' : 'apagada');
      else if (a.selClass === t) cls = 'sel';
      return '<button class="opcao-ameaca ' + cls + '" data-acao="sel-ameaca" data-alerta="' + id + '" data-ameaca="' + t + '" data-foco="am-' + t + '"' +
        (classificado || !ativo ? ' disabled' : '') + ' aria-pressed="' + (a.selClass === t) + '">' + I(T.icone) + '<span>' + esc(T.nome) + '</span></button>';
    }).join('') + '</div>';

    if (classificado || !ativo) {
      const certa = CD.AMEACAS[def.ameaca];
      let txt;
      if (!classificado) txt = '<strong>Classificação correta:</strong> ' + esc(certa.nome) + '. ';
      else if (a.classOk) txt = '<strong>Correto! ' + sinal(CD.PONTOS.classificacaoCerta) + ' pts.</strong> ';
      else txt = '<strong>Não é bem isso (' + CD.PONTOS.classificacaoErrada + ' pts).</strong> A classificação correta é <em>' + esc(certa.nome) + '</em>. ';
      corpo += '<div class="feedback ' + (a.classOk ? 'fb-bom' : 'fb-ruim') + '">' + I(a.classOk ? 'check' : 'info') + '<div>' + txt + esc(def.explicacao) + '</div></div>';

      corpo += etapa(2, 'Qual é a melhor resposta?', 'Escolha a ação que resolve o problema.');
      if (ativo) {
        corpo += '<div class="opcoes" role="group" aria-label="Respostas possíveis">' + a.ordem.map(function (i, k) {
          const r = def.respostas[i], sel = a.selResp === i;
          return '<button class="opcao' + (sel ? ' sel' : '') + '" data-acao="sel-resposta" data-alerta="' + id + '" data-idx="' + i + '" data-foco="r-' + i + '" aria-pressed="' + sel + '">' +
            '<span class="opcao-letra">' + 'ABCD'[k] + '</span><span>' + esc(r.t) + '</span></button>';
        }).join('') + '</div>';
      } else {
        const melhor = def.respostas.find(function (r) { return r.q === 'otima'; });
        if (a.status === 'resolvido') {
          const r = def.respostas[a.resposta], Q = CD.QUALIDADES[a.q];
          corpo += '<div class="escolha q-' + a.q + '"><div class="escolha-cab">' + U.chipStatus(Q.status, Q.nome, iconeQualidade(a.q)) +
            '<span class="pts">' + sinal(Q.pontos) + ' pts</span></div>' +
            '<p><strong>Sua resposta:</strong> ' + esc(r.t) + '</p><p class="escolha-fb">' + esc(r.f) + '</p>' +
            (a.q !== 'otima' ? '<p class="escolha-melhor">' + I('tip') + '<span><strong>Melhor resposta:</strong> ' + esc(melhor.t) + '</span></p>' : '') + '</div>';
        } else {
          corpo += '<div class="escolha q-ruim"><p class="escolha-melhor">' + I('tip') + '<span><strong>Melhor resposta:</strong> ' + esc(melhor.t) + '</span></p></div>';
        }
      }
    }

    let rodape;
    if (ativo && !classificado) {
      rodape = '<button class="btn btn-fantasma" data-acao="modal-fechar">Responder depois</button>' +
        '<button class="btn btn-acento" data-acao="confirmar-classificacao" data-alerta="' + id + '"' + (a.selClass ? '' : ' disabled') + '>' + I('target') + 'Confirmar classificação</button>';
    } else if (ativo) {
      rodape = '<button class="btn btn-fantasma" data-acao="modal-fechar">Responder depois</button>' +
        '<button class="btn btn-acento" data-acao="confirmar-resposta" data-alerta="' + id + '"' + (a.selResp === null ? ' disabled' : '') + '>' + I('shield-check') + 'Aplicar resposta</button>';
    } else {
      rodape = '<button class="btn btn-acento" data-acao="modal-fechar">' + I('map') + 'Voltar à planta</button>';
    }

    let ic = 'ic-critical';
    if (a.status === 'resolvido') ic = 'ic-' + CD.QUALIDADES[a.q].status;
    return {
      titulo: esc(def.titulo),
      subtitulo: (disp ? esc(disp.nome) : 'Caixa de e-mail') + ' · Severidade ' + U.chipSev(def.sev),
      icone: 'alert', iconeClasse: ic, corpo: corpo, rodape: rodape,
    };
  }

  /* ================= Briefing e conclusão ================= */
  function abrirBriefing() {
    const n = J.nivel;
    let vulns = 0;
    n.dispositivos.forEach(function (d) { vulns += d.itens.filter(function (i) { return i.vuln; }).length; });
    const tempoTxt = n.tempoAlerta
      ? (CD.store.config.tempoAlertas ? n.tempoAlerta + ' s por alerta' : 'tempo limite desativado')
      : 'sem tempo limite';
    U.modal.abrir({
      id: 'briefing', tamanho: 'md', fechavel: false,
      render: function () {
        return {
          titulo: 'Missão ' + n.id + ': ' + esc(n.nome),
          subtitulo: esc(n.local) + ' · ' + esc(n.dificuldade),
          icone: 'shield', iconeClasse: 'ic-info',
          corpo:
            '<p class="historia">' + esc(n.historia) + '</p>' +
            '<ul class="brief-numeros">' +
              '<li>' + I('map') + '<strong>' + n.planta.comodos.length + '</strong> cômodos</li>' +
              '<li>' + I('cpu') + '<strong>' + n.dispositivos.length + '</strong> dispositivos</li>' +
              '<li>' + I('bell') + '<strong>' + n.alertas.length + '</strong> alertas</li>' +
              '<li>' + I('timer') + '<span>' + tempoTxt + '</span></li>' +
            '</ul>' +
            '<h3 class="brief-sub">Seus objetivos</h3>' +
            '<ol class="brief-objs">' +
              '<li>' + I('radar') + '<div><strong>Explore</strong> os cômodos e identifique os dispositivos inteligentes.</div></li>' +
              '<li>' + I('search') + '<div><strong>Identifique as vulnerabilidades</strong> nas configurações de cada aparelho (há ' + vulns + ' nesta casa).</div></li>' +
              '<li>' + I('alert') + '<div><strong>Reconheça as ameaças</strong> nos alertas que vão chegar durante a missão.</div></li>' +
              '<li>' + I('shield-check') + '<div><strong>Selecione medidas de proteção</strong> para elevar a segurança da casa.</div></li>' +
            '</ol>',
          rodape:
            '<button class="btn btn-fantasma" data-acao="cancelar-briefing">' + I('arrow-left') + 'Voltar</button>' +
            '<button class="btn btn-primario" data-acao="comecar-missao">' + I('play') + 'Iniciar missão</button>',
        };
      },
    });
  }

  function abrirConcluida() {
    const seg = J.seguranca(), pts = Math.max(0, J.estado.pontos);
    const prot = CD.nivelProtecao(seg);
    U.modal.abrir({
      id: 'concluida', tamanho: 'sm',
      render: function () {
        return {
          titulo: 'Missão cumprida!', icone: 'trophy', iconeClasse: 'ic-good',
          corpo: '<p>Você concluiu todos os objetivos desta casa.</p>' +
            '<div class="conc-num"><div><span>Segurança</span><strong>' + seg + '%</strong>' + U.chipStatus(prot.status, prot.nome, prot.icone) + '</div>' +
            '<div><span>Pontuação</span><strong>' + U.numero(pts) + '</strong></div></div>' +
            '<p>Gere o relatório para ver os problemas identificados, as escolhas feitas e o nível final de proteção.</p>',
          rodape: '<button class="btn btn-fantasma" data-acao="modal-fechar">Revisar a casa</button>' +
            '<button class="btn btn-primario" data-acao="gerar-relatorio">' + I('file-text') + 'Gerar relatório</button>',
        };
      },
    });
  }

  function aoFecharJanela() {
    if (concluidaPendente && montada) {
      concluidaPendente = false;
      setTimeout(abrirConcluida, 250);
    }
  }

  function gerarRelatorio() {
    const jaAvisadas = J.estado ? J.estado.conquistasNaMissao.slice() : [];
    U.modal.fechar();
    const rel = J.finalizar();
    if (!rel) return;
    removerToastsDeAlerta(null);
    const novas = rel.conquistas
      .filter(function (c) { return jaAvisadas.indexOf(c) === -1; })
      .map(function (cid) { return CD.CONQUISTAS.find(function (x) { return x.id === cid; }); })
      .filter(Boolean);
    if (novas.length) {
      setTimeout(function () {
        CD.audio.tocar('conquista');
        U.toast({
          tipo: 'conquista', icone: 'trophy', duracao: 6000,
          titulo: novas.length === 1 ? 'Conquista desbloqueada!' : novas.length + ' conquistas desbloqueadas!',
          texto: novas.map(function (c) { return c.nome; }).join(' · '),
        });
      }, 700);
    }
    J.abandonar();
    location.hash = '#/relatorio/' + rel.id;
  }

  /* ================= Eventos do motor ================= */
  J.on(function (tipo, dados) {
    if (tipo === 'tick') {
      atualizarContagens();
      return;
    }
    if (!montada) return;
    atualizar();

    if (tipo === 'identificou') {
      if (!U.modal.aberto()) abrirDispositivo(dados.id, true);
      else U.toast({ tipo: 'sucesso', icone: 'radar', titulo: 'Dispositivo identificado', texto: J.dispositivo(dados.id).nome });
      return;
    }
    if (tipo === 'alerta') {
      const def = J.alertaDef(dados.id);
      U.toast({
        tipo: 'perigo', titulo: 'Novo alerta: ' + def.titulo, texto: def.resumo, icone: 'alert', duracao: 9000,
        acao: { rotulo: 'Analisar', nome: 'abrir-alerta', dados: { alerta: def.id } },
      });
    }
    if (tipo === 'expirou') {
      const def = J.alertaDef(dados.id);
      U.toast({ tipo: 'perigo', icone: 'timer', titulo: 'Tempo esgotado: ' + def.titulo, texto: 'A ameaça não foi tratada a tempo e causou danos à casa.' });
    }
    if (tipo === 'concluida') {
      if (U.modal.aberto()) {
        concluidaPendente = true;
        U.toast({ tipo: 'sucesso', icone: 'trophy', titulo: 'Todos os objetivos concluídos!', texto: 'Feche esta janela para gerar o relatório.' });
      } else {
        abrirConcluida();
      }
      return;
    }
    if (U.modal.aberto() && /^(disp|alerta):/.test(U.modal.atual.id)) U.modal.atualizar();
  });

  /* ================= Ações ================= */
  const A = CD.acoes;
  A['explorar'] = function (el) { J.explorar(el.dataset.comodo); };
  A['dispositivo'] = function (el) {
    const id = el.dataset.disp;
    if (!J.ativo()) return;
    if (J.estado.disp[id].identificado) abrirDispositivo(id); else J.identificar(id);
  };
  A['abrir-dispositivo'] = function (el) { abrirDispositivo(el.dataset.disp); };
  A['marcar-item'] = function (el) { J.alternarMarca(el.dataset.disp, Number(el.dataset.idx)); };
  A['usar-dica'] = function (el) { J.usarDica(el.dataset.disp); };
  A['confirmar-analise'] = function (el) { J.confirmarAnalise(el.dataset.disp); };
  A['sel-medida'] = function (el) { J.selecionarMedida(el.dataset.chave, Number(el.dataset.idx)); };
  A['aplicar-medida'] = function (el) { J.aplicarMedida(el.dataset.chave); };
  A['abrir-alerta'] = function (el) {
    const id = el.dataset.alerta;
    if (!J.ativo()) return;
    if (!montada) {
      location.hash = '#/missao';
      setTimeout(function () { if (montada) abrirAlerta(id); }, 80);
    } else {
      abrirAlerta(id);
    }
  };
  A['sel-ameaca'] = function (el) { J.selecionarClassificacao(el.dataset.alerta, el.dataset.ameaca); };
  A['confirmar-classificacao'] = function (el) { J.confirmarClassificacao(el.dataset.alerta); };
  A['sel-resposta'] = function (el) { J.selecionarResposta(el.dataset.alerta, Number(el.dataset.idx)); };
  A['confirmar-resposta'] = function (el) { J.confirmarResposta(el.dataset.alerta); };
  A['comecar-missao'] = function () {
    U.modal.fechar();
    J.comecar();
  };
  A['cancelar-briefing'] = function () {
    U.modal.fechar();
    J.abandonar();
    location.hash = '#/jogar';
  };
  A['sair-missao'] = function () { location.hash = '#/jogar'; };
  A['gerar-relatorio'] = gerarRelatorio;
  A['finalizar-missao'] = function () {
    if (!J.ativo()) return;
    const pend = J.objetivos().filter(function (o) { return o.feito < o.total; });
    if (!pend.length) { gerarRelatorio(); return; }
    U.confirmar({
      titulo: 'Finalizar a missão agora?',
      texto: 'Ainda há tarefas pendentes: ' + pend.map(function (o) { return o.nome.toLowerCase() + ' (' + o.feito + '/' + o.total + ')'; }).join('; ') +
        '. O que não foi tratado conta como risco aberto no relatório.',
      sim: 'Finalizar e gerar relatório', nao: 'Continuar jogando', icone: 'file-text',
    }).then(function (ok) { if (ok) gerarRelatorio(); });
  };

  return { titulo: 'Missão', montar: montar, desmontar: desmontar, abrirAlerta: abrirAlerta };
})();
