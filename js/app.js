/* =========================================================
   APLICAÇÃO — navegação entre telas (rotas com #), menu
   lateral, barra superior e eventos globais.
   ========================================================= */
window.CD = window.CD || {};

CD.app = (function () {
  const I = CD.icone, U = CD.ui, esc = CD.ui.esc;
  const view = document.getElementById('view');
  const sidebar = document.getElementById('sidebar');
  const topbar = document.getElementById('topbar');
  let telaAtual = null;
  let sinoAberto = false;
  let ultimoDelta = 0;

  const ROTAS = {
    inicio: 'inicio', jogar: 'jogar', missao: 'missao', relatorio: 'relatorio',
    'como-jogar': 'comoJogar', progresso: 'progresso', conquistas: 'conquistas',
    conteudos: 'conteudos', configuracoes: 'configuracoes',
  };

  const NAV = [
    { rota: 'inicio', nome: 'Início', icone: 'home' },
    { rota: 'jogar', nome: 'Jogar', icone: 'gamepad' },
    { rota: 'como-jogar', nome: 'Como jogar', icone: 'help' },
    { rota: 'progresso', nome: 'Progresso', icone: 'chart' },
    { rota: 'conquistas', nome: 'Conquistas', icone: 'trophy' },
    { rota: 'conteudos', nome: 'Conteúdos', icone: 'book' },
    { rota: 'configuracoes', nome: 'Configurações', icone: 'settings' },
  ];

  /* ---------------- Menu lateral ---------------- */
  function logo() {
    return '<svg class="marca-logo" viewBox="0 0 40 40" aria-hidden="true" fill="none" stroke-linecap="round" stroke-linejoin="round">' +
      '<path d="M5 19 20 6l15 13" class="lg-casa"/><path d="M9.5 15.5V33h21V15.5" class="lg-casa"/>' +
      '<path d="M20 15.5c2.6 1.8 5.2 2.4 6.8 2.4v4.6c0 4.6-3.1 7.1-6.8 8.4-3.7-1.3-6.8-3.8-6.8-8.4v-4.6c1.6 0 4.2-.6 6.8-2.4z" class="lg-escudo"/>' +
      '<path d="m17.2 23.2 2 2 3.8-3.8" class="lg-check"/>' +
      '<path d="M2 27h4M34 27h4M2 31h3M35 31h3" class="lg-circ"/>' +
    '</svg>';
  }

  function renderSidebar() {
    sidebar.innerHTML =
      '<a class="marca" href="#/inicio" aria-label="Cyber Defense — início">' + logo() +
        '<span class="marca-txt"><span class="marca-1">CYBER</span><span class="marca-2">DEFENSE</span></span></a>' +
      '<nav class="nav">' + NAV.map(function (n) {
        return '<a class="nav-item" href="#/' + n.rota + '" data-rota="' + n.rota + '">' + I(n.icone) + '<span>' + n.nome + '</span>' +
          (n.rota === 'jogar' ? '<span class="nav-ponto" hidden title="Missão em andamento"></span>' : '') + '</a>';
      }).join('') + '</nav>' +
      '<div class="side-rodape"><div class="side-jogador">' + I('user') + '<span id="side-nome"></span></div>' +
      '<small>Cibersegurança em IoT</small></div>';
    atualizarSidebar();
  }

  function atualizarSidebar() {
    const nome = document.getElementById('side-nome');
    if (nome) nome.textContent = CD.store.config.nome || 'Defensor(a)';
    const ponto = sidebar.querySelector('.nav-ponto');
    if (ponto) ponto.hidden = !(CD.jogo.ativo() && CD.jogo.estado.iniciado);
  }

  function marcarNav(rota) {
    sidebar.querySelectorAll('.nav-item').forEach(function (a) {
      const ativo = a.dataset.rota === rota;
      a.classList.toggle('ativo', ativo);
      if (ativo) a.setAttribute('aria-current', 'page'); else a.removeAttribute('aria-current');
    });
  }

  /* ---------------- Barra superior ---------------- */
  function renderTopbar() {
    topbar.innerHTML =
      '<button class="btn-icone tb-menu" data-acao="abrir-menu" aria-label="Abrir menu">' + I('menu') + '</button>' +
      '<div class="tb-nivel" id="tb-nivel"></div>' +
      '<div class="tb-missao" id="tb-missao"></div>' +
      '<div class="tb-espaco"></div>' +
      '<div class="tb-seg" id="tb-seg"></div>' +
      '<div class="tb-sino-wrap">' +
        '<button class="btn-icone tb-sino" data-acao="sino" aria-label="Alertas" aria-expanded="false" aria-controls="sino-menu">' + I('bell') + '<span class="badge" id="tb-badge" hidden>0</span></button>' +
        '<div class="sino-menu" id="sino-menu" hidden></div>' +
      '</div>' +
      '<button class="btn-icone" id="tb-som" data-acao="som"></button>' +
      '<button class="btn-icone tb-tela" id="tb-tela" data-acao="tela-cheia"></button>';
    atualizarTopbar();
  }

  function atualizarTopbar() {
    const J = CD.jogo;
    const ativo = J.ativo();

    // Nível + progresso (pontinhos)
    const nivelEl = document.getElementById('tb-nivel');
    if (nivelEl) {
      let rot, pontos, aria;
      if (ativo) {
        const objs = J.objetivos();
        const feitos = objs.filter(function (o) { return o.feito >= o.total; }).length;
        rot = 'Nível ' + J.nivel.id;
        aria = feitos + ' de ' + objs.length + ' objetivos concluídos';
        pontos = objs.map(function (o) { return '<span class="pp' + (o.feito >= o.total ? ' on' : '') + '" title="' + esc(o.nome) + '"></span>'; });
      } else {
        const concl = CD.NIVEIS.filter(function (n) { return CD.store.progressoNivel(n.id).concluido; }).length;
        rot = 'Nível ' + Math.min(concl + 1, CD.NIVEIS.length);
        aria = concl + ' de ' + CD.NIVEIS.length + ' missões concluídas';
        pontos = CD.NIVEIS.map(function (n) { return '<span class="pp' + (CD.store.progressoNivel(n.id).concluido ? ' on' : '') + '" title="Missão ' + n.id + '"></span>'; });
      }
      nivelEl.innerHTML = '<span class="tb-nivel-rot">' + I('chart') + rot + '</span><span class="tb-pp" role="img" aria-label="' + aria + '">' +
        pontos.join('<span class="pp-linha"></span>') + '</span>';
    }

    // Tempo e pontos (só durante a missão)
    const missaoEl = document.getElementById('tb-missao');
    if (missaoEl) {
      if (ativo && J.estado.iniciado) {
        missaoEl.hidden = false;
        if (!document.getElementById('tb-tempo')) {
          missaoEl.innerHTML = '<span class="tb-chip" title="Tempo de missão">' + I('clock') + '<span id="tb-tempo">00:00</span></span>' +
            '<span class="tb-chip tb-pontos" id="tb-pontos-wrap" title="Pontuação">' + I('star') + '<span id="tb-pontos">0</span>&nbsp;pts</span>';
        }
        document.getElementById('tb-tempo').textContent = U.tempo(J.estado.tempo);
        document.getElementById('tb-pontos').textContent = U.numero(J.estado.pontos);
        const d = J.estado.delta;
        if (d && d.t > ultimoDelta) {
          ultimoDelta = d.t;
          if (d.v !== 0) {
            const f = document.createElement('span');
            f.className = 'flutua ' + (d.v > 0 ? 'pos' : 'neg');
            f.textContent = (d.v > 0 ? '+' : '') + d.v;
            document.getElementById('tb-pontos-wrap').appendChild(f);
            setTimeout(function () { f.remove(); }, 1300);
          }
        }
      } else {
        missaoEl.hidden = true;
        missaoEl.innerHTML = '';
      }
    }

    // Segurança
    const segEl = document.getElementById('tb-seg');
    if (segEl) {
      let pct = null, titulo;
      if (ativo) { pct = J.seguranca(); titulo = 'Nível de segurança da casa nesta missão'; }
      else if (CD.store.dados.historico.length) { pct = CD.store.dados.historico[0].seguranca; titulo = 'Segurança final da última missão'; }
      else { titulo = 'Inicie uma missão para medir a segurança'; }
      if (pct === null) {
        segEl.className = 'tb-seg st-neutro';
        segEl.innerHTML = I('shield') + '<span class="tb-seg-rot">Segurança</span><strong>—</strong>';
      } else {
        const p = CD.nivelProtecao(pct);
        segEl.className = 'tb-seg st-' + p.status;
        segEl.innerHTML = I(p.icone) + '<span class="tb-seg-rot">Segurança</span><strong>' + pct + '%</strong>' + U.meter(pct, p.status, 'Segurança');
      }
      segEl.title = titulo + (pct !== null ? ': ' + CD.nivelProtecao(pct).nome : '');
    }

    // Sino
    const badge = document.getElementById('tb-badge');
    if (badge) {
      const n = ativo ? J.alertasAtivos().length : 0;
      badge.hidden = n === 0;
      badge.textContent = n;
    }
    if (sinoAberto) renderSino();

    // Som e tela cheia
    const som = document.getElementById('tb-som');
    if (som) {
      const on = CD.store.config.som;
      som.innerHTML = I(on ? 'volume' : 'volume-x');
      som.setAttribute('aria-label', on ? 'Desligar som' : 'Ligar som');
      som.title = on ? 'Som ligado' : 'Som desligado';
    }
    const tela = document.getElementById('tb-tela');
    if (tela) {
      const cheia = !!document.fullscreenElement;
      tela.innerHTML = I(cheia ? 'minimize' : 'maximize');
      tela.setAttribute('aria-label', cheia ? 'Sair da tela cheia' : 'Tela cheia');
      tela.title = cheia ? 'Sair da tela cheia' : 'Tela cheia';
    }
    atualizarSidebar();
  }

  function atualizarRelogio() {
    const t = document.getElementById('tb-tempo');
    if (t && CD.jogo.ativo()) t.textContent = U.tempo(CD.jogo.estado.tempo);
  }

  function renderSino() {
    const menu = document.getElementById('sino-menu');
    if (!menu) return;
    const J = CD.jogo;
    let h = '<div class="sino-tit">' + I('bell') + 'Alertas da missão</div>';
    if (!J.ativo()) {
      h += '<p class="vazio">Nenhuma missão em andamento.</p>';
    } else {
      const e = J.estado;
      const lista = J.nivel.alertas.filter(function (a) { return e.alertas[a.id].status !== 'aguardando'; })
        .sort(function (a, b) { return (e.alertas[a.id].status === 'ativo' ? 0 : 1) - (e.alertas[b.id].status === 'ativo' ? 0 : 1); });
      if (!lista.length) h += '<p class="vazio">Nenhum alerta até agora. O monitoramento está ativo.</p>';
      lista.forEach(function (def) {
        const a = e.alertas[def.id];
        const st = a.status === 'ativo' ? U.chipStatus('critical', 'Aguardando', 'alert')
          : a.status === 'expirado' ? U.chipStatus('critical', 'Expirado', 'timer')
          : U.chipStatus(CD.QUALIDADES[a.q].status, CD.QUALIDADES[a.q].curto, 'check');
        h += '<button class="sino-item" data-acao="abrir-alerta" data-alerta="' + def.id + '"><span class="sino-item-tit">' + esc(def.titulo) + '</span>' + st + '</button>';
      });
    }
    menu.innerHTML = h;
  }

  function abrirSino() {
    sinoAberto = true;
    renderSino();
    document.getElementById('sino-menu').hidden = false;
    topbar.querySelector('.tb-sino').setAttribute('aria-expanded', 'true');
  }
  function fecharSino() {
    sinoAberto = false;
    const m = document.getElementById('sino-menu');
    if (m) m.hidden = true;
    const b = topbar.querySelector('.tb-sino');
    if (b) b.setAttribute('aria-expanded', 'false');
  }

  /* ---------------- Rotas ---------------- */
  function rota() {
    const partes = location.hash.replace(/^#\/?/, '').split('/').filter(Boolean);
    const nome = ROTAS[partes[0]] ? partes[0] : 'inicio';
    const tela = CD.telas[ROTAS[nome]];
    if (telaAtual && telaAtual.desmontar) telaAtual.desmontar();
    if (U.modal.aberto()) U.modal.fechar();
    fecharSino();
    document.body.classList.remove('menu-aberto');
    telaAtual = tela;
    document.body.dataset.tela = nome;
    view.innerHTML = '';
    tela.montar(view, partes.slice(1));
    document.title = tela.titulo + ' · Cyber Defense';
    marcarNav(nome === 'missao' || nome === 'relatorio' ? 'jogar' : nome);
    window.scrollTo(0, 0);
    atualizarTopbar();
  }

  function aplicarConfig() {
    document.body.classList.toggle('sem-animacao', !!CD.store.config.reduzirAnimacoes);
    atualizarTopbar();
  }

  /* ---------------- Ações globais ---------------- */
  CD.acoes['abrir-menu'] = function () { document.body.classList.add('menu-aberto'); };
  CD.acoes['fechar-menu'] = function () { document.body.classList.remove('menu-aberto'); };
  CD.acoes['sino'] = function () { if (sinoAberto) fecharSino(); else abrirSino(); };
  CD.acoes['som'] = function () {
    CD.store.setConfig('som', !CD.store.config.som);
    CD.audio.tocar('clique');
    atualizarTopbar();
    const chk = document.querySelector('[data-config="som"]');
    if (chk) chk.checked = CD.store.config.som;
  };
  CD.acoes['tela-cheia'] = function () {
    const doc = document.documentElement;
    if (!document.fullscreenElement) {
      if (doc.requestFullscreen) doc.requestFullscreen().catch(function () {});
    } else if (document.exitFullscreen) {
      document.exitFullscreen().catch(function () {});
    }
  };

  /* ---------------- Eventos globais ---------------- */
  document.addEventListener('click', function (e) {
    const el = e.target.closest('[data-acao]');
    if (el) {
      if (el.disabled || el.getAttribute('aria-disabled') === 'true') return;
      const fn = CD.acoes[el.dataset.acao];
      if (fn) { e.preventDefault(); fn(el, e); }
      if (el.dataset.fechaToast) U.removerToast(el.closest('.toast'));
    } else {
      const x = e.target.closest('[data-fecha-toast]');
      if (x) U.removerToast(x.closest('.toast'));
    }
    if (sinoAberto && !e.target.closest('.tb-sino-wrap')) fecharSino();
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
      if (sinoAberto) { fecharSino(); return; }
      if (U.modal.aberto() && U.modal.atual.fechavel) { U.modal.fechar(); return; }
      document.body.classList.remove('menu-aberto');
      return;
    }
    const t = e.target;
    if ((e.key === 'Enter' || e.key === ' ') && t.getAttribute && t.getAttribute('role') === 'button' && t.dataset && t.dataset.acao &&
        t.tagName !== 'BUTTON' && t.tagName !== 'A') {
      e.preventDefault();
      const fn = CD.acoes[t.dataset.acao];
      if (fn) fn(t, e);
    }
  });

  // Mantém o foco dentro da janela aberta (acessibilidade)
  document.addEventListener('focusin', function (e) {
    if (!U.modal.aberto()) return;
    const raiz = document.getElementById('modal-root');
    const toasts = document.getElementById('toasts');
    if (!raiz.contains(e.target) && !toasts.contains(e.target)) {
      const m = raiz.querySelector('.modal');
      if (m) m.focus({ preventScroll: true });
    }
  });

  document.addEventListener('change', function (e) {
    const t = e.target;
    if (t.dataset.config) {
      CD.store.setConfig(t.dataset.config, t.checked);
      aplicarConfig();
      if (t.dataset.config === 'som' && t.checked) CD.audio.tocar('clique');
    }
    if (t.dataset.configNum) {
      CD.store.setConfig(t.dataset.configNum, Number(t.value));
      CD.audio.tocar('clique');
    }
  });

  document.addEventListener('input', function (e) {
    const t = e.target;
    if (t.dataset && t.dataset.configTexto) {
      CD.store.setConfig(t.dataset.configTexto, t.value.trim());
      atualizarSidebar();
    }
  });

  document.addEventListener('fullscreenchange', atualizarTopbar);

  CD.jogo.on(function (tipo) {
    if (tipo === 'tick') { atualizarRelogio(); return; }
    atualizarTopbar();
  });

  /* ---------------- Início ---------------- */
  renderSidebar();
  renderTopbar();
  aplicarConfig();
  window.addEventListener('hashchange', rota);
  rota();

  return { rota: rota, atualizarTopbar: atualizarTopbar, aplicarConfig: aplicarConfig };
})();
