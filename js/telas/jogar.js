/* =========================================================
   TELA: JOGAR (escolha da missão)
   ========================================================= */
window.CD = window.CD || {};
CD.telas = CD.telas || {};

CD.telas.jogar = (function () {
  const I = CD.icone, esc = CD.ui.esc;

  function contar(n) {
    let vulns = 0;
    n.dispositivos.forEach(function (d) { vulns += d.itens.filter(function (i) { return i.vuln; }).length; });
    return { comodos: n.planta.comodos.length, disp: n.dispositivos.length, vulns: vulns, alertas: n.alertas.length };
  }

  function cartao(n) {
    const c = contar(n);
    const p = CD.store.progressoNivel(n.id);
    const liberado = CD.store.nivelDesbloqueado(n.id);
    const atual = CD.jogo.ativo() && CD.jogo.nivel.id === n.id && CD.jogo.estado.iniciado;
    const classeDif = { 'Fácil': 'dif-facil', 'Médio': 'dif-medio', 'Difícil': 'dif-dificil' }[n.dificuldade] || '';

    let acao;
    if (!liberado) {
      acao = '<div class="bloqueado-msg">' + I('lock') + 'Conclua a missão ' + (n.id - 1) + ' para desbloquear</div>';
    } else if (atual) {
      acao = '<a class="btn btn-acento" href="#/missao">' + I('play') + 'Continuar missão</a>';
    } else {
      acao = '<button class="btn btn-primario" data-acao="iniciar-missao" data-nivel="' + n.id + '">' + I('play') +
        (p.jogadas ? 'Jogar novamente' : 'Iniciar missão') + '</button>';
    }

    const recorde = p.jogadas
      ? '<div class="recorde">' + CD.ui.estrelas(p.melhorEstrelas) +
        '<span>Recorde: <strong>' + CD.ui.numero(p.melhorPontos) + '</strong> pts</span>' +
        '<span>Segurança máx.: <strong>' + p.melhorSeguranca + '%</strong></span></div>'
      : '<div class="recorde recorde-vazio">' + CD.ui.estrelas(0) + '<span>Ainda não jogada</span></div>';

    return '<article class="card cartao-missao' + (liberado ? '' : ' bloqueado') + (atual ? ' atual' : '') + '">' +
      '<div class="missao-mini">' + CD.planta.miniatura(n) +
        (liberado ? '' : '<div class="mini-cadeado">' + I('lock') + '</div>') + '</div>' +
      '<div class="missao-info">' +
        '<div class="missao-topo"><span class="eyebrow">Missão ' + n.id + '</span><span class="dif ' + classeDif + '">' + esc(n.dificuldade) + '</span>' +
          (atual ? '<span class="dif dif-andamento">Em andamento</span>' : '') + '</div>' +
        '<h2>' + esc(n.nome) + '</h2>' +
        '<p class="missao-local">' + I('home') + esc(n.local) + '</p>' +
        '<p>' + esc(n.resumo) + '</p>' +
        '<ul class="missao-meta">' +
          '<li>' + I('map') + c.comodos + ' cômodos</li>' +
          '<li>' + I('cpu') + c.disp + ' dispositivos</li>' +
          '<li>' + I('shield-alert') + c.vulns + ' vulnerabilidades</li>' +
          '<li>' + I('bell') + c.alertas + ' alertas</li>' +
          '<li>' + I('timer') + (n.tempoAlerta ? n.tempoAlerta + ' s por alerta' : 'Sem tempo limite') + '</li>' +
        '</ul>' +
        recorde +
        '<div class="missao-acao">' + acao + '</div>' +
      '</div>' +
    '</article>';
  }

  function montar(view) {
    view.innerHTML =
      '<header class="cab-pagina"><h1>' + I('gamepad') + 'Escolha a sua missão</h1>' +
      '<p>Cada missão é uma casa diferente, com mais dispositivos, vulnerabilidades mais difíceis e ameaças mais rápidas. Conclua uma missão (com pelo menos 1 estrela) para liberar a próxima.</p></header>' +
      '<div class="lista-missoes">' + CD.NIVEIS.map(cartao).join('') + '</div>';
  }

  /* Iniciar uma missão (pede confirmação se houver outra em andamento) */
  CD.acoes['iniciar-missao'] = function (el) {
    const id = Number(el.dataset.nivel);
    if (!CD.store.nivelDesbloqueado(id)) return;
    const iniciar = function () {
      CD.jogo.nova(id);
      if (location.hash === '#/missao') CD.app.rota(); else location.hash = '#/missao';
    };
    if (CD.jogo.ativo() && CD.jogo.estado.iniciado && CD.jogo.nivel.id !== id) {
      CD.ui.confirmar({
        titulo: 'Abandonar a missão atual?',
        texto: 'Você tem uma missão em andamento (' + CD.jogo.nivel.nome + '). Se começar outra, o progresso dela será perdido.',
        sim: 'Começar nova missão', nao: 'Voltar', perigo: true, icone: 'alert',
      }).then(function (ok) { if (ok) iniciar(); });
    } else {
      iniciar();
    }
  };

  return { titulo: 'Jogar', montar: montar };
})();
