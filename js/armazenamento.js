/* =========================================================
   ARMAZENAMENTO — progresso salvo no navegador (localStorage).
   Se o navegador bloquear o armazenamento, o jogo continua
   funcionando normalmente, só não guarda o progresso.
   ========================================================= */
window.CD = window.CD || {};

CD.store = (function () {
  const CHAVE = 'cyberdefense-smart-home-v1';
  const MAX_HISTORICO = 20;

  function padrao() {
    return {
      config: {
        nome: '',
        som: true,
        volume: 70,
        tempoAlertas: true,
        dicas: true,
        reduzirAnimacoes: false,
        modoProfessor: false,
      },
      niveis: {},      // { 1: { concluido, melhorPontos, melhorEstrelas, melhorSeguranca, jogadas } }
      conquistas: {},  // { id: dataISO }
      historico: [],   // relatórios (mais recente primeiro)
      lidos: [],       // conteúdos lidos
    };
  }

  function carregar() {
    const base = padrao();
    try {
      const bruto = localStorage.getItem(CHAVE);
      if (!bruto) return base;
      const d = JSON.parse(bruto);
      return {
        config: Object.assign(base.config, d.config || {}),
        niveis: d.niveis || {},
        conquistas: d.conquistas || {},
        historico: Array.isArray(d.historico) ? d.historico : [],
        lidos: Array.isArray(d.lidos) ? d.lidos : [],
      };
    } catch (e) {
      return base;
    }
  }

  let dados = carregar();

  function salvar() {
    try { localStorage.setItem(CHAVE, JSON.stringify(dados)); } catch (e) { /* sem armazenamento */ }
  }

  return {
    get dados() { return dados; },
    get config() { return dados.config; },

    setConfig(chave, valor) {
      dados.config[chave] = valor;
      salvar();
    },

    progressoNivel(id) {
      return dados.niveis[id] || { concluido: false, melhorPontos: 0, melhorEstrelas: 0, melhorSeguranca: 0, jogadas: 0 };
    },

    nivelDesbloqueado(id) {
      if (id === 1 || dados.config.modoProfessor) return true;
      return !!(dados.niveis[id - 1] && dados.niveis[id - 1].concluido);
    },

    /** Registra o relatório de uma missão e atualiza os recordes. */
    registrarRelatorio(rel) {
      const p = this.progressoNivel(rel.nivelId);
      dados.niveis[rel.nivelId] = {
        concluido: p.concluido || rel.estrelas >= 1,
        melhorPontos: Math.max(p.melhorPontos, rel.pontos),
        melhorEstrelas: Math.max(p.melhorEstrelas, rel.estrelas),
        melhorSeguranca: Math.max(p.melhorSeguranca, rel.seguranca),
        jogadas: p.jogadas + 1,
      };
      dados.historico.unshift(rel);
      dados.historico = dados.historico.slice(0, MAX_HISTORICO);
      salvar();
    },

    relatorio(id) {
      return dados.historico.find(function (r) { return r.id === id; }) || null;
    },

    temConquista(id) { return !!dados.conquistas[id]; },

    /** Desbloqueia e retorna true se for nova. */
    desbloquear(id) {
      if (dados.conquistas[id]) return false;
      dados.conquistas[id] = new Date().toISOString();
      salvar();
      return true;
    },

    marcarLido(id) {
      if (dados.lidos.indexOf(id) === -1) {
        dados.lidos.push(id);
        salvar();
      }
    },

    resetar() {
      const cfg = dados.config;
      dados = padrao();
      dados.config = Object.assign(dados.config, { nome: cfg.nome, som: cfg.som, volume: cfg.volume });
      salvar();
    },
  };
})();
