/* =========================================================
   TELA: RELATÓRIO DA MISSÃO
   Problemas identificados, escolhas feitas e nível final
   de proteção. Pode ser impresso ou salvo em PDF.
   ========================================================= */
window.CD = window.CD || {};
CD.telas = CD.telas || {};

CD.telas.relatorio = (function () {
  const I = CD.icone, U = CD.ui, esc = CD.ui.esc;

  function chipQ(q) {
    if (!q) return U.chipStatus('critical', 'Não corrigida', 'x');
    const Q = CD.QUALIDADES[q];
    return U.chipStatus(Q.status, Q.curto, q === 'otima' ? 'check' : (q === 'parcial' ? 'minus' : 'x'));
  }

  function chipIdent(d) {
    if (d === true) return U.chipStatus('good', 'Encontrada', 'check');
    if (d === false) return U.chipStatus('serious', 'Deixou passar', 'alert');
    return U.chipStatus('neutro', 'Não analisada', 'minus');
  }

  function tile(rotulo, valor, sub) {
    return '<div class="tile"><span class="tile-rot">' + rotulo + '</span><span class="tile-valor">' + valor + '</span>' +
      (sub ? '<span class="tile-sub">' + sub + '</span>' : '') + '</div>';
  }

  function tabelaVulns(rel) {
    if (!rel.vulns.length) return '<p class="vazio">Esta casa não tinha vulnerabilidades.</p>';
    return '<table class="tabela"><thead><tr><th>Dispositivo</th><th>Vulnerabilidade</th><th>Severidade</th><th>Identificação</th><th>Medida escolhida</th><th>Resultado</th></tr></thead><tbody>' +
      rel.vulns.map(function (v) {
        return '<tr>' +
          '<td data-rot="Dispositivo"><strong>' + esc(v.disp) + '</strong><span class="td-sub">' + esc(v.comodo) + '</span></td>' +
          '<td data-rot="Vulnerabilidade">' + esc(v.nome) + '<span class="td-sub">' + esc(v.item) + ': ' + esc(v.valor) + '</span></td>' +
          '<td data-rot="Severidade">' + U.chipSev(v.sev) + '</td>' +
          '<td data-rot="Identificação">' + chipIdent(v.detectada) + '</td>' +
          '<td data-rot="Medida escolhida">' + (v.medida ? esc(v.medida) : '<span class="td-vazio">Nenhuma medida aplicada</span>') +
            (v.q !== 'otima' ? '<span class="td-rec">' + I('tip') + '<span><strong>Recomendado:</strong> ' + esc(v.melhor) + '</span></span>' : '') + '</td>' +
          '<td data-rot="Resultado">' + chipQ(v.q) + '</td>' +
        '</tr>';
      }).join('') + '</tbody></table>';
  }

  function tabelaAmeacas(rel) {
    if (!rel.ameacas.length) return '<p class="vazio">Nenhum alerta nesta missão.</p>';
    return '<table class="tabela"><thead><tr><th>Alerta</th><th>Ameaça real</th><th>Sua classificação</th><th>Resposta escolhida</th><th>Resultado</th></tr></thead><tbody>' +
      rel.ameacas.map(function (a) {
        let classif, resultado, resposta;
        if (a.status === 'aguardando') {
          classif = '<span class="td-vazio">—</span>';
          resposta = '<span class="td-vazio">O alerta não chegou a aparecer (missão finalizada antes).</span>';
          resultado = U.chipStatus('neutro', 'Não ocorreu', 'minus');
        } else {
          classif = a.classificacao
            ? U.chipStatus(a.classOk ? 'good' : 'critical', a.classificacao, a.classOk ? 'check' : 'x')
            : '<span class="td-vazio">Não classificada</span>';
          if (a.status === 'resolvido') {
            resposta = esc(a.resposta);
            resultado = chipQ(a.q);
          } else {
            resposta = '<span class="td-vazio">' + (a.status === 'expirado' ? 'Tempo esgotado sem resposta.' : 'Ficou sem resposta.') + '</span>';
            resultado = U.chipStatus('critical', a.status === 'expirado' ? 'Expirado' : 'Sem resposta', 'timer');
          }
          if (a.q !== 'otima') resposta += '<span class="td-rec">' + I('tip') + '<span><strong>Recomendado:</strong> ' + esc(a.melhor) + '</span></span>';
        }
        return '<tr>' +
          '<td data-rot="Alerta"><strong>' + esc(a.titulo) + '</strong><span class="td-sub">' + esc(a.disp) + '</span></td>' +
          '<td data-rot="Ameaça real">' + esc(a.correta) + '</td>' +
          '<td data-rot="Sua classificação">' + classif + '</td>' +
          '<td data-rot="Resposta escolhida">' + resposta + '</td>' +
          '<td data-rot="Resultado">' + resultado + '</td>' +
        '</tr>';
      }).join('') + '</tbody></table>';
  }

  /** Lista de medidores: uma linha por tema (nome · barra · número). */
  function listaTemas(cats) {
    const chaves = Object.keys(CD.CATEGORIAS).filter(function (c) { return cats[c] && cats[c].total; });
    if (!chaves.length) return '<p class="vazio">Sem dados suficientes.</p>';
    return '<ul class="lista-medidor">' + chaves.map(function (c) {
      const v = cats[c], pct = Math.round((v.otimas / v.total) * 100);
      return '<li title="' + esc(CD.CATEGORIAS[c].nome) + ': ' + v.otimas + ' de ' + v.total + ' decisões ótimas">' +
        '<span class="lm-nome">' + I(CD.CATEGORIAS[c].icone) + esc(CD.CATEGORIAS[c].nome) + '</span>' +
        '<span class="lm-barra">' + U.meter(pct, 'info', CD.CATEGORIAS[c].nome) + '</span>' +
        '<span class="lm-num">' + v.otimas + '/' + v.total + ' <small>(' + pct + '%)</small></span></li>';
    }).join('') + '</ul>';
  }

  function montar(view, params) {
    const id = params && params[0];
    const rel = id ? CD.store.relatorio(id) : CD.store.dados.historico[0];
    if (!rel) {
      view.innerHTML = '<div class="card vazio-grande">' + I('file-text') + '<h1>Relatório não encontrado</h1>' +
        '<p>Conclua uma missão para gerar um relatório de segurança.</p><a class="btn btn-primario" href="#/jogar">' + I('play') + 'Ir para as missões</a></div>';
      return;
    }

    const v = rel.vulnsResumo, a = rel.ameacasResumo, d = rel.dispositivos;
    const proximo = CD.NIVEIS.find(function (n) { return n.id === rel.nivelId + 1; });
    const podeProximo = proximo && CD.store.nivelDesbloqueado(proximo.id);
    const conquistas = (rel.conquistas || []).map(function (cid) { return CD.CONQUISTAS.find(function (c) { return c.id === cid; }); }).filter(Boolean);

    view.innerHTML =
      '<article class="relatorio">' +
      '<header class="rel-cab">' +
        '<div><span class="eyebrow">Relatório de segurança · Missão ' + rel.nivelId + ' · ' + esc(rel.dificuldade || '') + '</span>' +
          '<h1>' + esc(rel.local) + '</h1>' +
          '<p class="rel-meta">' + esc(rel.nivelNome) + ' · ' + U.data(rel.data) + ' · Duração: ' + U.tempo(rel.duracao) +
            (rel.nome ? ' · Defensor(es): <strong>' + esc(rel.nome) + '</strong>' : '') + '</p></div>' +
        '<div class="rel-acoes sem-impressao">' +
          '<button class="btn btn-fantasma" data-acao="imprimir">' + I('printer') + 'Imprimir / PDF</button>' +
          '<button class="btn btn-fantasma" data-acao="iniciar-missao" data-nivel="' + rel.nivelId + '">' + I('refresh') + 'Jogar novamente</button>' +
          (podeProximo ? '<button class="btn btn-primario" data-acao="iniciar-missao" data-nivel="' + proximo.id + '">Próxima missão' + I('arrow-right') + '</button>' : '') +
        '</div>' +
      '</header>' +

      '<section class="card rel-heroi">' +
        '<div class="rel-seg">' +
          '<span class="tile-rot">Nível final de proteção</span>' +
          '<div class="numero-heroi">' + rel.seguranca + '%</div>' +
          U.meter(rel.seguranca, rel.protecao.status, 'Nível final de proteção') +
          '<div class="rel-prot">' + U.chipStatus(rel.protecao.status, rel.protecao.nome, rel.protecao.icone) + '</div>' +
          '<p>' + esc(rel.protecao.desc) + '</p>' +
        '</div>' +
        '<div class="rel-pontos">' +
          '<span class="tile-rot">Pontuação</span>' +
          '<div class="rel-pts">' + U.numero(rel.pontos) + '<small> de ' + U.numero(rel.pontosMax) + '</small></div>' +
          U.estrelas(rel.estrelas) +
          '<p>' + (rel.estrelas === 3 ? 'Desempenho excelente!' : rel.estrelas === 2 ? 'Bom trabalho! Dá para chegar às 3 estrelas.' : rel.estrelas === 1 ? 'Missão concluída. Revise as recomendações para melhorar.' : 'Missão não concluída: é preciso pelo menos 1 estrela.') + '</p>' +
        '</div>' +
      '</section>' +

      '<section class="tiles">' +
        tile('Dispositivos identificados', d.identificados + '/' + d.total, d.analisados + ' analisados') +
        tile('Vulnerabilidades encontradas', v.detectadas + '/' + v.total, v.perdidas ? v.perdidas + ' deixadas passar' : 'nenhuma deixada passar') +
        tile('Falsos alarmes', rel.falsosAlarmes, rel.dicas + (rel.dicas === 1 ? ' dica usada' : ' dicas usadas')) +
        tile('Ameaças reconhecidas', a.reconhecidas + '/' + a.total, a.expiradas ? a.expiradas + ' alerta(s) expirado(s)' : 'nenhum alerta expirado') +
        tile('Medidas ótimas', (v.otimas + a.otimas) + '/' + (v.total + a.total), (v.parciais) + ' parciais · ' + (v.ruins) + ' inadequadas') +
      '</section>' +

      '<section class="card rel-secao"><h2>' + I('shield-alert') + 'Vulnerabilidades e medidas aplicadas</h2>' + tabelaVulns(rel) + '</section>' +
      '<section class="card rel-secao"><h2>' + I('alert') + 'Ameaças reconhecidas e respostas</h2>' + tabelaAmeacas(rel) + '</section>' +

      '<div class="grade-2">' +
        '<section class="card rel-secao"><h2>' + I('chart') + 'Desempenho por tema</h2>' +
          '<p class="nota">Percentual de decisões ótimas em cada tema.</p>' + listaTemas(rel.categorias) + '</section>' +
        '<section class="card rel-secao"><h2>' + I('tip') + 'Recomendações</h2>' +
          (rel.recomendacoes.length
            ? '<ul class="recs">' + rel.recomendacoes.map(function (r) { return '<li>' + I(CD.CATEGORIAS[r.cat].icone) + '<span><strong>' + esc(CD.CATEGORIAS[r.cat].nome) + ':</strong> ' + esc(r.texto) + '</span></li>'; }).join('') + '</ul>'
            : '<p class="parabens">' + I('sparkles') + 'Todas as decisões foram as melhores possíveis. Continue aplicando esses hábitos na sua casa de verdade!</p>') +
        '</section>' +
      '</div>' +

      (conquistas.length
        ? '<section class="card rel-secao"><h2>' + I('trophy') + 'Conquistas desbloqueadas nesta missão</h2><div class="grade-conquistas mini">' +
          conquistas.map(function (c) { return '<div class="conquista on"><span class="cq-ic">' + I(c.icone) + '</span><div><strong>' + esc(c.nome) + '</strong><p>' + esc(c.desc) + '</p></div></div>'; }).join('') +
          '</div></section>'
        : '') +
      '<p class="rodape-rel">Cyber Defense: Proteja sua Smart Home · Simulador de segurança residencial · Unidade Curricular Internet das Coisas</p>' +
      '</article>';
  }

  CD.acoes['imprimir'] = function () { window.print(); };

  return { titulo: 'Relatório', montar: montar };
})();
