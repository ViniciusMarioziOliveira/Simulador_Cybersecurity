/* =========================================================
   EFEITOS SONOROS — gerados na hora com a Web Audio API
   (não precisa de nenhum arquivo de áudio).
   ========================================================= */
window.CD = window.CD || {};

CD.audio = (function () {
  let ctx = null;

  function contexto() {
    if (!ctx) {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return null;
      ctx = new AC();
    }
    if (ctx.state === 'suspended') ctx.resume();
    return ctx;
  }

  function volumeGeral() {
    return Math.max(0, Math.min(100, CD.store.config.volume)) / 100;
  }

  /** Toca uma nota simples. */
  function nota(freq, inicio, dur, tipo, vol) {
    const c = contexto();
    if (!c) return;
    const t0 = c.currentTime + inicio;
    const osc = c.createOscillator();
    const g = c.createGain();
    osc.type = tipo || 'sine';
    osc.frequency.setValueAtTime(freq, t0);
    const v = (vol || 0.12) * volumeGeral();
    g.gain.setValueAtTime(0.0001, t0);
    g.gain.exponentialRampToValueAtTime(Math.max(v, 0.0002), t0 + 0.015);
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
    osc.connect(g).connect(c.destination);
    osc.start(t0);
    osc.stop(t0 + dur + 0.05);
  }

  /** Varredura de frequência (efeito de "scanner"). */
  function varredura(de, ate, dur, vol) {
    const c = contexto();
    if (!c) return;
    const t0 = c.currentTime;
    const osc = c.createOscillator();
    const g = c.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(de, t0);
    osc.frequency.exponentialRampToValueAtTime(ate, t0 + dur);
    const v = (vol || 0.06) * volumeGeral();
    g.gain.setValueAtTime(0.0001, t0);
    g.gain.exponentialRampToValueAtTime(Math.max(v, 0.0002), t0 + 0.05);
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
    osc.connect(g).connect(c.destination);
    osc.start(t0);
    osc.stop(t0 + dur + 0.05);
  }

  function sequencia(freqs, passo, tipo, vol) {
    freqs.forEach(function (f, i) { nota(f, i * passo, passo * 1.6, tipo, vol); });
  }

  const SONS = {
    clique:      function () { nota(880, 0, 0.06, 'triangle', 0.05); },
    scanner:     function () { varredura(260, 1400, 0.9, 0.05); },
    identificar: function () { sequencia([660, 990], 0.07, 'triangle', 0.08); },
    sucesso:     function () { sequencia([523, 659, 784], 0.08, 'triangle', 0.1); },
    parcial:     function () { sequencia([523, 587], 0.1, 'triangle', 0.08); },
    erro:        function () { sequencia([233, 175], 0.13, 'sawtooth', 0.06); },
    alerta:      function () { sequencia([880, 660, 880, 660], 0.11, 'square', 0.045); },
    conquista:   function () { sequencia([523, 659, 784, 1047, 1319], 0.08, 'triangle', 0.1); },
    fim:         function () { sequencia([392, 523, 659, 784, 1047], 0.11, 'triangle', 0.1); },
  };

  return {
    tocar(nome) {
      if (!CD.store.config.som) return;
      try { if (SONS[nome]) SONS[nome](); } catch (e) { /* áudio indisponível */ }
    },
  };
})();
