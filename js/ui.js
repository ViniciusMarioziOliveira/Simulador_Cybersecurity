/* =========================================================
   UI — funções de apoio: escape de HTML, formatação,
   janelas (modal), notificações (toast) e confirmação.
   ========================================================= */
window.CD = window.CD || {};

/* Registro de ações: qualquer elemento com data-acao="nome"
   chama CD.acoes.nome(elemento, evento) ao ser clicado. */
CD.acoes = CD.acoes || {};

CD.ui = (function () {
  const MAPA_ESC = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };

  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return MAPA_ESC[c]; });
  }

  function tempo(ms) {
    const s = Math.max(0, Math.floor(ms / 1000));
    return String(Math.floor(s / 60)).padStart(2, '0') + ':' + String(s % 60).padStart(2, '0');
  }

  function numero(n) { return Number(n || 0).toLocaleString('pt-BR'); }

  function data(iso) {
    try {
      return new Date(iso).toLocaleString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });
    } catch (e) { return iso; }
  }

  function embaralhar(lista) {
    const a = lista.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      const t = a[i]; a[i] = a[j]; a[j] = t;
    }
    return a;
  }

  function estrelas(n, total) {
    total = total || 3;
    let h = '';
    for (let i = 0; i < total; i++) h += CD.icone('star', i < n ? 'estrela on' : 'estrela');
    return '<span class="estrelas" role="img" aria-label="' + n + ' de ' + total + ' estrelas">' + h + '</span>';
  }

  /** Chip de severidade (sempre com texto, nunca só a cor). */
  function chipSev(sev) {
    const s = CD.SEVERIDADES[sev] || CD.SEVERIDADES.media;
    return '<span class="sev sev-' + sev + '">' + esc(s.nome) + '</span>';
  }

  /** Chip de status com ícone + texto. */
  function chipStatus(status, texto, icone) {
    return '<span class="status st-' + status + '">' + CD.icone(icone || 'info') + esc(texto) + '</span>';
  }

  /** Barra de medição (meter) — a cor vem do status. */
  function meter(pct, status, rotulo) {
    const v = Math.max(0, Math.min(100, Math.round(pct)));
    return '<div class="meter st-' + status + '" role="meter" aria-valuemin="0" aria-valuemax="100" aria-valuenow="' + v + '"' +
      (rotulo ? ' aria-label="' + esc(rotulo) + '"' : '') + '><div class="meter-fill" style="width:' + v + '%"></div></div>';
  }

  /* ---------------- Modal ---------------- */
  const raiz = function () { return document.getElementById('modal-root'); };

  const modal = {
    atual: null,
    focoAnterior: null,

    /**
     * opts: { id, tamanho: 'md'|'lg', fechavel (padrão true), aoFechar(),
     *         render: () => ({ titulo, subtitulo, icone, iconeClasse, corpo, rodape }) }
     */
    abrir(opts) {
      if (this.atual && this.atual.aoFechar) this.atual.aoFechar();
      if (!this.atual) this.focoAnterior = document.activeElement;
      this.atual = Object.assign({ fechavel: true, tamanho: 'md' }, opts);
      this.montar();
    },

    montar() {
      const a = this.atual;
      const c = a.render();
      const r = raiz();
      r.innerHTML =
        '<div class="modal-fundo"' + (a.fechavel ? ' data-acao="modal-fechar"' : '') + '></div>' +
        '<div class="modal modal-' + a.tamanho + '" role="dialog" aria-modal="true" aria-labelledby="modal-titulo" tabindex="-1">' +
          '<div class="modal-cab">' +
            (c.icone ? '<div class="modal-ic ' + (c.iconeClasse || '') + '">' + CD.icone(c.icone) + '</div>' : '') +
            '<div class="modal-tit"><h2 id="modal-titulo">' + c.titulo + '</h2>' +
              (c.subtitulo ? '<div class="modal-sub">' + c.subtitulo + '</div>' : '') + '</div>' +
            (a.fechavel ? '<button class="btn-icone modal-x" data-acao="modal-fechar" aria-label="Fechar">' + CD.icone('x') + '</button>' : '') +
          '</div>' +
          '<div class="modal-corpo">' + c.corpo + '</div>' +
          (c.rodape ? '<div class="modal-rodape">' + c.rodape + '</div>' : '') +
        '</div>';
      r.classList.add('aberto');
      document.body.classList.add('modal-aberto');
      const m = r.querySelector('.modal');
      if (m) m.focus({ preventScroll: true });
    },

    /** Redesenha o conteúdo mantendo a posição de rolagem. */
    atualizar() {
      if (!this.atual) return;
      const corpo = raiz().querySelector('.modal-corpo');
      const rolagem = corpo ? corpo.scrollTop : 0;
      const ativo = document.activeElement;
      const idAtivo = ativo && ativo.dataset ? ativo.dataset.foco : null;
      this.montar();
      const novo = raiz().querySelector('.modal-corpo');
      if (novo) novo.scrollTop = rolagem;
      if (idAtivo) {
        const el = raiz().querySelector('[data-foco="' + idAtivo + '"]');
        if (el) el.focus({ preventScroll: true });
      }
    },

    fechar() {
      if (!this.atual) return;
      const a = this.atual;
      this.atual = null;
      const r = raiz();
      r.classList.remove('aberto');
      r.innerHTML = '';
      document.body.classList.remove('modal-aberto');
      if (a.aoFechar) a.aoFechar();
      if (this.focoAnterior && document.contains(this.focoAnterior)) {
        try { this.focoAnterior.focus({ preventScroll: true }); } catch (e) { /* ignora */ }
      }
      this.focoAnterior = null;
    },

    aberto(id) { return !!(this.atual && (id === undefined || this.atual.id === id)); },
  };

  CD.acoes['modal-fechar'] = function () { modal.fechar(); };

  /* ---------------- Notificações (toast) ---------------- */
  const ICONES_TOAST = { info: 'info', sucesso: 'check', aviso: 'alert', perigo: 'shield-alert', conquista: 'trophy' };

  /**
   * opts: { tipo: 'info'|'sucesso'|'aviso'|'perigo'|'conquista', titulo, texto, icone,
   *         acao: { rotulo, nome, dados: { chave: valor } }, duracao }
   */
  function toast(opts) {
    const box = document.getElementById('toasts');
    if (!box) return;
    const tipo = opts.tipo || 'info';
    const el = document.createElement('div');
    el.className = 'toast toast-' + tipo;
    el.setAttribute('role', tipo === 'perigo' ? 'alert' : 'status');
    let acaoHtml = '';
    if (opts.acao) {
      let attrs = ' data-acao="' + esc(opts.acao.nome) + '" data-fecha-toast="1"';
      Object.keys(opts.acao.dados || {}).forEach(function (k) {
        attrs += ' data-' + k + '="' + esc(opts.acao.dados[k]) + '"';
      });
      acaoHtml = '<button class="btn btn-sm btn-acento"' + attrs + '>' + esc(opts.acao.rotulo) + '</button>';
    }
    el.innerHTML =
      '<div class="toast-ic">' + CD.icone(opts.icone || ICONES_TOAST[tipo] || 'info') + '</div>' +
      '<div class="toast-corpo"><div class="toast-titulo">' + esc(opts.titulo || '') + '</div>' +
      (opts.texto ? '<div class="toast-texto">' + esc(opts.texto) + '</div>' : '') + acaoHtml + '</div>' +
      '<button class="toast-x" aria-label="Fechar notificação" data-fecha-toast="1">' + CD.icone('x') + '</button>';
    box.appendChild(el);
    while (box.children.length > 3) box.removeChild(box.firstChild);
    const dur = opts.duracao || (opts.acao ? 7000 : 4500);
    setTimeout(function () { removerToast(el); }, dur);
  }

  function removerToast(el) {
    if (!el || !el.parentNode) return;
    el.classList.add('saindo');
    setTimeout(function () { if (el.parentNode) el.parentNode.removeChild(el); }, 250);
  }

  /* ---------------- Confirmação ---------------- */
  function confirmar(opts) {
    return new Promise(function (resolve) {
      let respondido = false;
      CD.acoes['confirmar-sim'] = function () { respondido = true; modal.fechar(); resolve(true); };
      CD.acoes['confirmar-nao'] = function () { respondido = true; modal.fechar(); resolve(false); };
      modal.abrir({
        id: 'confirmar',
        tamanho: 'sm',
        aoFechar: function () { if (!respondido) resolve(false); },
        render: function () {
          return {
            titulo: esc(opts.titulo || 'Confirmar'),
            icone: opts.icone || 'help',
            iconeClasse: opts.perigo ? 'ic-perigo' : '',
            corpo: '<p>' + esc(opts.texto || '') + '</p>',
            rodape:
              '<button class="btn btn-fantasma" data-acao="confirmar-nao">' + esc(opts.nao || 'Cancelar') + '</button>' +
              '<button class="btn ' + (opts.perigo ? 'btn-perigo' : 'btn-acento') + '" data-acao="confirmar-sim">' + esc(opts.sim || 'Confirmar') + '</button>',
          };
        },
      });
    });
  }

  return {
    esc: esc, tempo: tempo, numero: numero, data: data, embaralhar: embaralhar,
    estrelas: estrelas, chipSev: chipSev, chipStatus: chipStatus, meter: meter,
    modal: modal, toast: toast, removerToast: removerToast, confirmar: confirmar,
  };
})();
