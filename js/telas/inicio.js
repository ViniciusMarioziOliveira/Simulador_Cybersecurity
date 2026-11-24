/* =========================================================
   TELA: INÍCIO
   ========================================================= */
window.CD = window.CD || {};
CD.telas = CD.telas || {};

CD.telas.inicio = (function () {
  const I = CD.icone, esc = CD.ui.esc;

  /* Ilustração da casa com a cúpula de proteção e os dispositivos */
  function arteCasa() {
    const rotulos = [
      { x: 14,  y: 176, w: 112, ic: 'cctv',      t: 'Câmera',               ax: 162, ay: 246, lx: 126, ly: 192 },
      { x: 40,  y: 92,  w: 180, ic: 'lightbulb', t: 'Lâmpadas inteligentes', ax: 296, ay: 178, lx: 220, ly: 108 },
      { x: 92,  y: 398, w: 176, ic: 'lock',      t: 'Fechadura inteligente', ax: 350, ay: 324, lx: 268, ly: 414 },
      { x: 470, y: 62,  w: 156, ic: 'router',    t: 'Roteador Wi-Fi',        ax: 432, ay: 128, lx: 470, ly: 78 },
      { x: 492, y: 168, w: 140, ic: 'speaker',   t: 'Assistente virtual',    ax: 438, ay: 194, lx: 492, ly: 184 },
      { x: 456, y: 398, w: 150, ic: 'sensor',    t: 'Sensor de porta',       ax: 316, ay: 290, lx: 456, ly: 414 },
    ];
    const estrelas = [[60, 40], [120, 70], [210, 30], [300, 58], [380, 24], [520, 30], [590, 110], [30, 300], [610, 260], [250, 92], [560, 340], [90, 250]];

    let linhas = '', ancoras = '', caixas = '';
    rotulos.forEach(function (r, i) {
      linhas += '<path class="h-linha" d="M' + r.ax + ' ' + r.ay + ' L' + r.lx + ' ' + r.ly + '"/>';
      ancoras += '<circle class="h-ancora" style="animation-delay:' + (i * 0.35) + 's" cx="' + r.ax + '" cy="' + r.ay + '" r="5"/>';
      caixas += '<g class="h-rotulo" transform="translate(' + r.x + ' ' + r.y + ')">' +
        '<rect width="' + r.w + '" height="32" rx="9"/>' +
        '<circle cx="17" cy="16" r="11" class="h-rotulo-ic"/>' +
        '<svg x="9" y="8" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' + CD.iconePaths(r.ic) + '</svg>' +
        '<text x="34" y="21">' + esc(r.t) + '</text></g>';
    });

    return '<svg class="arte-casa" viewBox="0 0 640 440" role="img" aria-label="Casa inteligente protegida por uma cúpula de segurança, com câmera, roteador, lâmpadas, assistente virtual, fechadura e sensor de porta.">' +
      '<defs>' +
        '<radialGradient id="h-brilho" cx="50%" cy="62%" r="50%"><stop offset="0" stop-color="#22d3ee" stop-opacity=".28"/><stop offset="1" stop-color="#22d3ee" stop-opacity="0"/></radialGradient>' +
        '<linearGradient id="h-cupula" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#22d3ee" stop-opacity=".22"/><stop offset=".75" stop-color="#22c55e" stop-opacity=".06"/><stop offset="1" stop-color="#22c55e" stop-opacity="0"/></linearGradient>' +
        '<linearGradient id="h-janela" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fde68a"/><stop offset="1" stop-color="#f59e0b" stop-opacity=".75"/></linearGradient>' +
        '<linearGradient id="h-vidro" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#67e8f9" stop-opacity=".9"/><stop offset="1" stop-color="#0e7490" stop-opacity=".7"/></linearGradient>' +
        '<linearGradient id="h-parede" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#16294b"/><stop offset="1" stop-color="#0b1730"/></linearGradient>' +
        '<radialGradient id="h-chao" cx="50%" cy="50%" r="50%"><stop offset="0" stop-color="#22d3ee" stop-opacity=".35"/><stop offset="1" stop-color="#22d3ee" stop-opacity="0"/></radialGradient>' +
      '</defs>' +
      '<circle cx="320" cy="250" r="240" fill="url(#h-brilho)"/>' +
      estrelas.map(function (e, i) { return '<circle class="h-estrela" style="animation-delay:' + (i * 0.4) + 's" cx="' + e[0] + '" cy="' + e[1] + '" r="1.6"/>'; }).join('') +
      '<ellipse cx="320" cy="374" rx="290" ry="28" fill="url(#h-chao)"/>' +
      '<path class="h-cupula" d="M72 374 A248 272 0 0 1 568 374 Z"/>' +
      '<path class="h-cupula-anel" d="M104 374 A216 238 0 0 1 536 374"/>' +
      // casa
      '<g class="h-casa">' +
        '<rect x="150" y="232" width="340" height="140" rx="4" fill="url(#h-parede)" class="h-contorno"/>' +
        '<rect x="232" y="152" width="226" height="84" rx="3" fill="url(#h-parede)" class="h-contorno"/>' +
        '<rect x="218" y="142" width="254" height="12" rx="3" class="h-laje"/>' +
        '<rect x="136" y="224" width="368" height="12" rx="3" class="h-laje"/>' +
        '<rect x="250" y="168" width="96" height="52" rx="2" fill="url(#h-janela)"/>' +
        '<path class="h-caixilho" d="M298 168v52M250 194h96"/>' +
        '<rect x="362" y="168" width="80" height="52" rx="2" fill="url(#h-vidro)"/>' +
        '<path class="h-caixilho" d="M402 168v52"/>' +
        '<rect x="168" y="254" width="124" height="98" rx="2" fill="url(#h-janela)" opacity=".92"/>' +
        '<path class="h-caixilho" d="M209 254v98M250 254v98M168 300h124"/>' +
        '<rect x="312" y="282" width="46" height="90" rx="2" class="h-porta"/>' +
        '<circle cx="349" cy="328" r="2.6" class="h-macaneta"/>' +
        '<rect x="380" y="272" width="96" height="100" rx="2" class="h-garagem"/>' +
        '<path class="h-caixilho fino" d="M380 290h96M380 308h96M380 326h96M380 344h96M380 362h96"/>' +
        '<path class="h-wifi" d="M418 124a20 20 0 0 1 28 0M411 117a30 30 0 0 1 42 0"/>' +
        '<rect x="424" y="128" width="16" height="8" rx="2" class="h-laje"/>' +
        '<circle cx="138" cy="356" r="17" class="h-arbusto"/><circle cx="118" cy="364" r="11" class="h-arbusto"/>' +
        '<circle cx="506" cy="358" r="15" class="h-arbusto"/><circle cx="524" cy="366" r="10" class="h-arbusto"/>' +
      '</g>' +
      linhas + ancoras + caixas +
      '<g class="h-escudo" transform="translate(298 384)">' +
        '<svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">' + CD.iconePaths('shield-check') + '</svg>' +
      '</g>' +
    '</svg>';
  }

  function totais() {
    let disp = 0, vulns = 0, alertas = 0;
    CD.NIVEIS.forEach(function (n) {
      disp += n.dispositivos.length;
      alertas += n.alertas.length;
      n.dispositivos.forEach(function (d) { vulns += d.itens.filter(function (i) { return i.vuln; }).length; });
    });
    return { disp: disp, vulns: vulns, alertas: alertas };
  }

  function montar(view) {
    const t = totais();
    const emAndamento = CD.jogo.ativo() && CD.jogo.estado.iniciado;
    const banner = emAndamento
      ? '<div class="faixa-andamento">' + I('timer') + '<div><strong>Missão em andamento:</strong> ' + esc(CD.jogo.nivel.nome) +
        '</div><a class="btn btn-acento btn-sm" href="#/missao">Continuar ' + I('arrow-right') + '</a></div>'
      : '';

    view.innerHTML = banner +
      '<section class="hero">' +
        '<div class="hero-texto">' +
          '<span class="kicker">' + I('shield') + 'Cibersegurança em Internet das Coisas</span>' +
          '<h1 class="hero-titulo"><span class="ht-1">CYBER</span><span class="ht-2">DEFENSE</span></h1>' +
          '<div class="hero-faixa">Proteja sua Smart Home</div>' +
          '<p class="hero-desc">Descubra vulnerabilidades, enfrente ameaças e proteja sua casa conectada. Explore os cômodos, investigue cada dispositivo e tome as decisões certas antes que os criminosos aproveitem as brechas.</p>' +
          '<div class="hero-acoes">' +
            '<a class="btn btn-primario btn-lg" href="#/jogar">' + I('play') + 'Jogar' + I('chevron-right') + '</a>' +
            '<a class="btn btn-fantasma btn-lg" href="#/como-jogar">' + I('book') + 'Como jogar</a>' +
          '</div>' +
          '<ul class="hero-numeros">' +
            '<li><strong>' + CD.NIVEIS.length + '</strong> missões</li>' +
            '<li><strong>' + t.disp + '</strong> dispositivos</li>' +
            '<li><strong>' + t.vulns + '</strong> vulnerabilidades</li>' +
            '<li><strong>' + t.alertas + '</strong> ameaças</li>' +
          '</ul>' +
        '</div>' +
        '<div class="hero-arte">' + arteCasa() + '</div>' +
      '</section>' +

      '<section class="secao">' +
        '<h2 class="secao-titulo">Os três desafios de cada missão</h2>' +
        '<div class="grade-3">' +
          cartaoReq('search', 'Identificar vulnerabilidades', 'Analise as configurações de cada dispositivo e marque o que é perigoso: senhas de fábrica, firmware desatualizado, portas abertas, falta de criptografia…', 'req-1') +
          cartaoReq('alert', 'Reconhecer ameaças', 'Alertas chegam durante a missão. Leia as evidências e descubra o que está acontecendo: força bruta, phishing, botnet, rede falsa… ou só um falso alarme.', 'req-2') +
          cartaoReq('shield-check', 'Selecionar medidas de proteção', 'Para cada problema, escolha a melhor medida. Cada decisão aumenta (ou não) o nível de segurança da casa.', 'req-3') +
        '</div>' +
      '</section>' +

      '<section class="secao">' +
        '<h2 class="secao-titulo">Como funciona</h2>' +
        '<ol class="passos">' +
          passo(1, 'map', 'Explore a casa', 'Escaneie os cômodos e identifique os dispositivos inteligentes instalados.') +
          passo(2, 'bell', 'Receba alertas', 'Senhas padrão, atualizações pendentes, acessos suspeitos e ataques em andamento.') +
          passo(3, 'gauge', 'Tome decisões', 'Escolha medidas de proteção. As decisões mudam a segurança da residência.') +
          passo(4, 'file-text', 'Veja o relatório', 'Problemas encontrados, escolhas feitas e o nível final de proteção.') +
        '</ol>' +
      '</section>';
  }

  function cartaoReq(icone, titulo, texto, cls) {
    return '<article class="card cartao-req ' + cls + '"><div class="req-ic">' + I(icone) + '</div><h3>' + titulo + '</h3><p>' + texto + '</p></article>';
  }

  function passo(n, icone, titulo, texto) {
    return '<li class="passo"><div class="passo-num">' + n + '</div><div class="passo-ic">' + I(icone) + '</div><h3>' + titulo + '</h3><p>' + texto + '</p></li>';
  }

  return { titulo: 'Início', montar: montar };
})();
