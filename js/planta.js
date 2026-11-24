/* =========================================================
   PLANTA DA CASA — desenha a casa em SVG (vista de cima):
   cômodos, móveis, portas, janelas, dispositivos e a "névoa"
   que esconde os cômodos ainda não explorados.
   ========================================================= */
window.CD = window.CD || {};

CD.planta = (function () {
  const W = 1000, H = 620;
  const R = 20; // raio do marcador de dispositivo
  const esc = function (s) { return CD.ui.esc(s); };
  const n = function (v) { return Math.round(v * 10) / 10; };

  function ret(x, y, w, h, rx, cls) {
    return '<rect x="' + n(x) + '" y="' + n(y) + '" width="' + n(Math.max(w, 0)) + '" height="' + n(Math.max(h, 0)) +
      '" rx="' + n(rx || 0) + '" class="' + (cls || 'm') + '"/>';
  }
  function lin(x1, y1, x2, y2, cls) {
    return '<line x1="' + n(x1) + '" y1="' + n(y1) + '" x2="' + n(x2) + '" y2="' + n(y2) + '" class="' + (cls || 'm-linha') + '"/>';
  }
  function circ(cx, cy, r, cls) {
    return '<circle cx="' + n(cx) + '" cy="' + n(cy) + '" r="' + n(r) + '" class="' + (cls || 'm') + '"/>';
  }
  function elip(cx, cy, rx, ry, cls) {
    return '<ellipse cx="' + n(cx) + '" cy="' + n(cy) + '" rx="' + n(rx) + '" ry="' + n(ry) + '" class="' + (cls || 'm') + '"/>';
  }

  /* ---------------------------------------------------------
     MÓVEIS — todos desenhados com a "parte de trás" virada
     para cima (y menor). A rotação é aplicada depois.
     --------------------------------------------------------- */
  const FORMAS = {
    sofa: function (x, y, w, h) {
      const enc = h * 0.32, braco = Math.min(w * 0.12, 16);
      let s = ret(x, y, w, h, 9);
      s += ret(x + 2, y + 2, w - 4, enc, 7, 'm2');
      s += ret(x + 2, y + enc, braco, h - enc - 2, 6, 'm2');
      s += ret(x + w - braco - 2, y + enc, braco, h - enc - 2, 6, 'm2');
      const lugares = w > 150 ? 3 : 2;
      const sx = x + braco + 2, sw = w - 2 * braco - 4;
      for (let i = 1; i < lugares; i++) s += lin(sx + sw * i / lugares, y + enc + 5, sx + sw * i / lugares, y + h - 7);
      return s;
    },
    poltrona: function (x, y, w, h) {
      return ret(x, y, w, h, 10) + ret(x + 2, y + 2, w - 4, h * 0.3, 7, 'm2') +
        ret(x + 2, y + h * 0.3, w * 0.18, h * 0.68, 6, 'm2') + ret(x + w * 0.82 - 2, y + h * 0.3, w * 0.18, h * 0.68, 6, 'm2');
    },
    cama: function (x, y, w, h) {
      let s = ret(x, y, w, h, 6);
      s += ret(x, y, w, 9, 3, 'm2');
      if (w >= 110) {
        s += ret(x + 9, y + 15, w / 2 - 14, h * 0.15, 6, 'm2');
        s += ret(x + w / 2 + 5, y + 15, w / 2 - 14, h * 0.15, 6, 'm2');
      } else {
        s += ret(x + 9, y + 15, w - 18, h * 0.15, 6, 'm2');
      }
      s += ret(x + 3, y + h * 0.38, w - 6, h * 0.62 - 3, 5, 'm3');
      s += lin(x + 4, y + h * 0.47, x + w - 4, y + h * 0.47);
      return s;
    },
    mesa: function (x, y, w, h) {
      const m = 16;
      let s = '';
      const cadeiras = w > 150 ? 3 : 2;
      for (let i = 0; i < cadeiras; i++) {
        const cx = x + m + (w - 2 * m) * (i + 0.5) / cadeiras - 12;
        s += ret(cx, y, 24, 14, 4, 'm2') + ret(cx, y + h - 14, 24, 14, 4, 'm2');
      }
      s += ret(x, y + h / 2 - 12, 14, 24, 4, 'm2') + ret(x + w - 14, y + h / 2 - 12, 14, 24, 4, 'm2');
      s += ret(x + m, y + m - 3, w - 2 * m, h - 2 * m + 6, 8);
      return s;
    },
    mesaCentro: function (x, y, w, h) {
      return ret(x, y, w, h, 8) + ret(x + 6, y + 6, w - 12, h - 12, 5, 'm2');
    },
    rack: function (x, y, w, h) {
      return ret(x, y + h * 0.38, w, h * 0.62, 4) + ret(x + w * 0.08, y, w * 0.84, h * 0.3, 2, 'tv-tela');
    },
    tapete: function (x, y, w, h) {
      return ret(x, y, w, h, 10, 'tapete') + ret(x + 8, y + 8, w - 16, h - 16, 6, 'tapete-borda');
    },
    planta: function (x, y, w, h) {
      const cx = x + w / 2, cy = y + h / 2, r = Math.min(w, h) / 2;
      let s = '';
      for (let i = 0; i < 5; i++) {
        const a = (Math.PI * 2 * i) / 5 - Math.PI / 2;
        s += circ(cx + Math.cos(a) * r * 0.45, cy + Math.sin(a) * r * 0.45, r * 0.5, 'folha');
      }
      return s + circ(cx, cy, r * 0.28, 'm2');
    },
    bancada: function (x, y, w, h, m) {
      let s = ret(x, y, w, h, 3);
      const fx = x + w * (m.fogao || 0.25), px = x + w * (m.pia || 0.72);
      s += ret(fx - h * 0.42, y + h * 0.1, h * 0.84, h * 0.8, 3, 'm2');
      [[-1, -1], [1, -1], [-1, 1], [1, 1]].forEach(function (d) {
        s += circ(fx + d[0] * h * 0.2, y + h / 2 + d[1] * h * 0.2, h * 0.13, 'm3');
      });
      s += ret(px - h * 0.6, y + h * 0.15, h * 1.2, h * 0.7, 6, 'm2') + circ(px, y + h * 0.5, 3, 'm3');
      return s;
    },
    geladeira: function (x, y, w, h) {
      return ret(x, y, w, h, 4) + lin(x + 3, y + h - 8, x + w - 3, y + h - 8) +
        ret(x + w * 0.2, y + h - 14, w * 0.22, 3, 1.5, 'm3') + ret(x + w * 0.58, y + h - 14, w * 0.22, 3, 1.5, 'm3');
    },
    escrivaninha: function (x, y, w, h) {
      return ret(x, y, w, h * 0.56, 4) + ret(x + w * 0.3, y + 4, w * 0.4, 5, 2, 'm3') +
        ret(x + w * 0.36, y + h * 0.3, w * 0.28, h * 0.12, 2, 'm2') +
        ret(x + w / 2 - h * 0.2, y + h * 0.64, h * 0.4, h * 0.33, 8, 'm2');
    },
    guarda: function (x, y, w, h) {
      return ret(x, y, w, h, 3) + lin(x + w / 2, y + 3, x + w / 2, y + h - 3) +
        circ(x + w / 2 - 6, y + h - 9, 1.8, 'm3') + circ(x + w / 2 + 6, y + h - 9, 1.8, 'm3');
    },
    criado: function (x, y, w, h) {
      return ret(x, y, w, h, 4) + circ(x + w / 2, y + h / 2, Math.min(w, h) * 0.28, 'm3');
    },
    estante: function (x, y, w, h) {
      let s = ret(x, y, w, h, 2);
      const partes = Math.max(2, Math.round(w / 26));
      for (let i = 1; i < partes; i++) s += lin(x + (w * i) / partes, y + 2, x + (w * i) / partes, y + h - 2);
      return s;
    },
    chuveiro: function (x, y, w, h) {
      return ret(x, y, w, h, 3) + lin(x + 4, y + 4, x + w - 4, y + h - 4, 'm-fina') +
        lin(x + w - 4, y + 4, x + 4, y + h - 4, 'm-fina') + circ(x + w / 2, y + h / 2, 4, 'm3');
    },
    vaso: function (x, y, w, h) {
      return ret(x + w * 0.1, y, w * 0.8, h * 0.28, 3) + elip(x + w / 2, y + h * 0.63, w * 0.42, h * 0.35) +
        elip(x + w / 2, y + h * 0.65, w * 0.26, h * 0.22, 'm2');
    },
    pia: function (x, y, w, h) {
      return ret(x, y, w, h, 4) + elip(x + w / 2, y + h * 0.56, w * 0.32, h * 0.3, 'm2') +
        ret(x + w / 2 - 2, y + 3, 4, h * 0.2, 1, 'm3');
    },
    carro: function (x, y, w, h) {
      let s = ret(x, y, w, h, w * 0.28, 'carro');
      s += '<path class="m2" d="M' + n(x + w * 0.16) + ' ' + n(y + h * 0.36) + ' L' + n(x + w * 0.22) + ' ' + n(y + h * 0.22) +
        ' L' + n(x + w * 0.78) + ' ' + n(y + h * 0.22) + ' L' + n(x + w * 0.84) + ' ' + n(y + h * 0.36) + ' Z"/>';
      s += ret(x + w * 0.16, y + h * 0.38, w * 0.68, h * 0.32, 6, 'm3');
      s += ret(x + w * 0.2, y + h * 0.73, w * 0.6, h * 0.09, 4, 'm2');
      s += ret(x - 6, y + h * 0.27, 8, 12, 3, 'm2') + ret(x + w - 2, y + h * 0.27, 8, 12, 3, 'm2');
      s += ret(x + w * 0.12, y + 5, w * 0.2, 6, 3, 'farol') + ret(x + w * 0.68, y + 5, w * 0.2, 6, 3, 'farol');
      return s;
    },
    caixa: function (x, y, w, h) {
      return ret(x, y, w, h, 4) + circ(x + w * 0.3, y + h * 0.5, h * 0.22, 'm2') +
        ret(x + w * 0.55, y + h * 0.28, h * 0.44, h * 0.44, 2, 'm2');
    },
    berco: function (x, y, w, h) {
      return ret(x, y, w, h, 5) + ret(x + 5, y + 5, w - 10, h - 10, 3, 'm-fina-ret') +
        ret(x + 10, y + 10, w - 20, h * 0.16, 5, 'm2') + ret(x + 9, y + h * 0.4, w - 18, h * 0.5, 5, 'm3');
    },
    arvore: function (x, y, w, h) {
      const cx = x + w / 2, cy = y + h / 2, r = Math.min(w, h) / 2;
      return circ(cx, cy, r, 'arvore') + circ(cx - r * 0.3, cy - r * 0.25, r * 0.45, 'arvore2') +
        circ(cx + r * 0.32, cy + r * 0.2, r * 0.4, 'arvore2') + circ(cx, cy, r * 0.1, 'm3');
    },
    piscina: function (x, y, w, h) {
      let s = ret(x, y, w, h, 14, 'agua');
      for (let i = 1; i <= 3; i++) {
        const yy = y + (h * i) / 4;
        let d = 'M' + n(x + 12) + ' ' + n(yy);
        for (let xx = x + 12; xx < x + w - 24; xx += 20) d += ' q5 -5 10 0 t10 0';
        s += '<path class="onda" d="' + d + '"/>';
      }
      return s;
    },
  };

  /** Desenha um móvel aplicando a rotação (0, 90, 180 ou 270 graus). */
  function movel(m) {
    const forma = FORMAS[m.t];
    if (!forma) return '';
    const cx = m.x + m.w / 2, cy = m.y + m.h / 2;
    const rot = m.r || 0;
    const deitado = rot % 180 !== 0;
    const w = deitado ? m.h : m.w, h = deitado ? m.w : m.h;
    const s = forma(cx - w / 2, cy - h / 2, w, h, m);
    return rot ? '<g transform="rotate(' + rot + ' ' + n(cx) + ' ' + n(cy) + ')">' + s + '</g>' : s;
  }

  /* ---------------- Portas e janelas ---------------- */
  function porta(p) {
    let s = '';
    if (p.garagem) {
      s += lin(p.x, p.y, p.x + p.l, p.y, 'vao-linha');
      s += lin(p.x + 4, p.y, p.x + p.l - 4, p.y, 'portao-garagem');
      return s;
    }
    const ext = p.ext ? ' porta-ext' : '';
    if (p.o === 'h') {
      s += lin(p.x, p.y, p.x + p.l, p.y, 'vao-linha');
      if (!p.aberta) {
        const sg = p.s || 1;
        s += lin(p.x, p.y, p.x, p.y + sg * p.l, 'folha-porta' + ext);
        s += '<path class="arco-porta' + ext + '" d="M' + p.x + ' ' + (p.y + sg * p.l) + ' A' + p.l + ' ' + p.l + ' 0 0 ' +
          (sg > 0 ? 0 : 1) + ' ' + (p.x + p.l) + ' ' + p.y + '"/>';
      }
    } else {
      s += lin(p.x, p.y, p.x, p.y + p.l, 'vao-linha');
      if (!p.aberta) {
        const sg = p.s || 1;
        s += lin(p.x, p.y, p.x + sg * p.l, p.y, 'folha-porta' + ext);
        s += '<path class="arco-porta' + ext + '" d="M' + (p.x + sg * p.l) + ' ' + p.y + ' A' + p.l + ' ' + p.l + ' 0 0 ' +
          (sg > 0 ? 1 : 0) + ' ' + p.x + ' ' + (p.y + p.l) + '"/>';
      }
    }
    return s;
  }

  function janela(j) {
    const x2 = j.o === 'h' ? j.x + j.l : j.x;
    const y2 = j.o === 'h' ? j.y : j.y + j.l;
    return lin(j.x, j.y, x2, y2, 'janela') + lin(j.x, j.y, x2, y2, 'janela-vidro');
  }

  /* ---------------- Dispositivos ---------------- */
  function marcador(d) {
    const tipo = CD.TIPOS_DISPOSITIVO[d.tipo];
    return '<g class="disp oculto" id="dp-' + d.id + '" data-acao="dispositivo" data-disp="' + d.id + '" transform="translate(' + d.x + ' ' + d.y + ')" role="button" tabindex="-1" aria-hidden="true">' +
      '<circle class="disp-alvo" r="' + (R + 8) + '"/>' +
      '<circle class="disp-pulso" r="' + R + '"/>' +
      '<circle class="disp-fundo" r="' + R + '"/>' +
      '<text class="disp-q" y="7">?</text>' +
      '<svg class="disp-ic" x="-11" y="-11" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' + CD.iconePaths(tipo.icone) + '</svg>' +
      '<g class="disp-badge" transform="translate(15 -15)"><circle r="8.5"/><svg x="-6" y="-6" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round" class="badge-ic"></svg></g>' +
      '<text class="disp-nome" y="' + (R + 17) + '">' + esc(d.nome) + '</text>' +
    '</g>';
  }

  /* ---------------- Planta completa ---------------- */
  function render(nivel) {
    const pl = nivel.planta;
    const roteador = nivel.dispositivos.find(function (d) { return d.tipo === 'roteador'; });
    let pisos = '', paredes = '', nevoas = '', rotulos = '';

    pl.comodos.forEach(function (c) {
      pisos += '<g class="comodo' + (c.externo ? ' externo' : '') + '" id="cm-' + c.id + '">' +
        ret(c.x, c.y, c.w, c.h, 0, c.externo ? 'piso piso-externo' : 'piso') +
        '<g class="moveis">' + c.moveis.map(movel).join('') + '</g></g>';
      paredes += ret(c.x, c.y, c.w, c.h, 0, c.externo ? 'cerca' : 'parede');
      const cx = c.x + c.w / 2, cy = c.y + c.h / 2;
      nevoas += '<g class="nevoa" id="nv-' + c.id + '" data-acao="explorar" data-comodo="' + c.id + '" role="button" tabindex="0" aria-label="Explorar ' + esc(c.nome) + '">' +
        ret(c.x + 3, c.y + 3, c.w - 6, c.h - 6, 2, 'nevoa-fundo') +
        ret(c.x + 3, c.y + 3, c.w - 6, c.h - 6, 2, 'nevoa-trama') +
        '<g class="nevoa-cta" transform="translate(' + n(cx) + ' ' + n(cy) + ')">' +
          '<circle r="24" class="nevoa-cta-fundo"/>' +
          '<svg x="-13" y="-13" width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' + CD.iconePaths('radar') + '</svg>' +
          '<text y="44" class="nevoa-txt">Explorar</text>' +
        '</g>' +
        '<circle class="scan-anel" cx="' + n(cx) + '" cy="' + n(cy) + '" r="' + n(Math.max(c.w, c.h) * 0.62) + '"/>' +
      '</g>';
      rotulos += '<text class="rotulo-comodo" id="rt-' + c.id + '" x="' + (c.x + 12) + '" y="' + (c.y + 24) + '">' + esc(c.nome.toUpperCase()) + '</text>' +
        '<text class="rotulo-sub" id="rs-' + c.id + '" x="' + (c.x + 12) + '" y="' + (c.y + 40) + '"></text>';
    });

    let redes = '';
    if (roteador) {
      nivel.dispositivos.forEach(function (d) {
        if (d.id === roteador.id) return;
        redes += '<line class="rede oculto" id="rd-' + d.id + '" x1="' + roteador.x + '" y1="' + roteador.y + '" x2="' + d.x + '" y2="' + d.y + '"/>';
      });
    }

    return '<svg class="planta" viewBox="0 0 ' + W + ' ' + H + '" role="group" aria-label="Planta da casa: ' + esc(nivel.local) + '">' +
      '<defs>' +
        '<pattern id="pl-grade" width="20" height="20" patternUnits="userSpaceOnUse"><path d="M20 0H0V20" class="grade-linha"/></pattern>' +
        '<pattern id="pl-trama" width="10" height="10" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><line x1="0" y1="0" x2="0" y2="10" class="trama-linha"/></pattern>' +
        '<pattern id="pl-grama" width="18" height="18" patternUnits="userSpaceOnUse"><rect width="18" height="18" class="grama-fundo"/><path d="M4 13l2-5 2 5M11 7l2-4 2 4" class="grama-linha"/></pattern>' +
      '</defs>' +
      '<rect class="fundo-planta" width="' + W + '" height="' + H + '"/>' +
      pisos + paredes +
      pl.janelas.map(janela).join('') +
      pl.portas.map(porta).join('') +
      '<g class="redes">' + redes + '</g>' +
      nevoas +
      // os dispositivos ficam acima da névoa (nos cômodos não explorados eles estão ocultos)
      '<g class="dispositivos">' + nivel.dispositivos.map(marcador).join('') + '</g>' +
      rotulos +
    '</svg>';
  }

  /* ---------------- Atualização (sem redesenhar tudo) ---------------- */
  const BADGES = {
    identificado: '<circle cx="6" cy="12" r="1"/><circle cx="12" cy="12" r="1"/><circle cx="18" cy="12" r="1"/>',
    vulneravel: '<path d="M12 6v7"/><path d="M12 18h.01"/>',
    comprometido: '<path d="M18 6 6 18"/><path d="m6 6 12 12"/>',
    parcial: '<path d="M6 12h12"/>',
    protegido: '<path d="M20 6 9 17l-5-5"/>',
    seguro: '<path d="M20 6 9 17l-5-5"/>',
  };

  function atualizar(svg, nivel, estado) {
    if (!svg) return;
    const jogo = CD.jogo;
    nivel.planta.comodos.forEach(function (c) {
      const ec = estado.comodos[c.id];
      const nv = svg.querySelector('#nv-' + c.id);
      if (nv) {
        nv.classList.toggle('limpa', !!ec.explorado);
        nv.classList.toggle('escaneando', !!ec.escaneando);
        nv.setAttribute('tabindex', ec.explorado || ec.escaneando ? '-1' : '0');
        nv.setAttribute('aria-hidden', ec.explorado ? 'true' : 'false');
      }
      const rt = svg.querySelector('#rt-' + c.id);
      if (rt) rt.classList.toggle('explorado', !!ec.explorado);
      const rs = svg.querySelector('#rs-' + c.id);
      if (rs) {
        const qtd = nivel.dispositivos.filter(function (d) { return d.comodo === c.id; }).length;
        rs.textContent = ec.explorado && qtd === 0 ? 'sem dispositivos' : '';
      }
    });

    const roteador = nivel.dispositivos.find(function (d) { return d.tipo === 'roteador'; });
    const roteadorOk = roteador && estado.disp[roteador.id].identificado;

    nivel.dispositivos.forEach(function (d) {
      const g = svg.querySelector('#dp-' + d.id);
      if (!g) return;
      const ed = estado.disp[d.id];
      const visivel = estado.comodos[d.comodo].explorado;
      const st = jogo.statusDispositivo(d.id);
      g.setAttribute('class', 'disp st-' + st + (visivel ? '' : ' oculto') + (ed.identificando ? ' identificando' : ''));
      g.setAttribute('tabindex', visivel ? '0' : '-1');
      g.setAttribute('aria-hidden', visivel ? 'false' : 'true');
      g.setAttribute('aria-label', ed.identificado
        ? d.nome + ' — ' + jogo.STATUS[st].nome
        : 'Sinal desconhecido — clique para identificar');
      const badge = g.querySelector('.badge-ic');
      if (badge) badge.innerHTML = BADGES[st] || '';

      const linha = svg.querySelector('#rd-' + d.id);
      if (linha) {
        const mostra = roteadorOk && ed.identificado;
        linha.setAttribute('class', 'rede st-' + st + (mostra ? '' : ' oculto'));
      }
    });
  }

  /** Miniatura da planta para os cartões de missão. */
  function miniatura(nivel) {
    let s = '';
    nivel.planta.comodos.forEach(function (c) {
      s += ret(c.x, c.y, c.w, c.h, 0, c.externo ? 'mini-externo' : 'mini-comodo');
    });
    nivel.dispositivos.forEach(function (d) { s += circ(d.x, d.y, 12, 'mini-disp'); });
    return '<svg class="mini-planta" viewBox="0 0 ' + W + ' ' + H + '" aria-hidden="true">' + s + '</svg>';
  }

  return { render: render, atualizar: atualizar, miniatura: miniatura };
})();
