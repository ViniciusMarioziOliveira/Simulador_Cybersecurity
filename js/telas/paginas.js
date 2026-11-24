/* =========================================================
   TELAS: COMO JOGAR · PROGRESSO · CONQUISTAS · CONTEÚDOS ·
          CONFIGURAÇÕES
   ========================================================= */
window.CD = window.CD || {};
CD.telas = CD.telas || {};

(function () {
  const I = CD.icone, U = CD.ui, esc = CD.ui.esc;

  function cab(icone, titulo, texto) {
    return '<header class="cab-pagina"><h1>' + I(icone) + titulo + '</h1>' + (texto ? '<p>' + texto + '</p>' : '') + '</header>';
  }

  /* ======================= COMO JOGAR ======================= */
  CD.telas.comoJogar = {
    titulo: 'Como jogar',
    montar: function (view) {
      const P = CD.PONTOS, Q = CD.QUALIDADES;
      const linhaPts = function (acao, pts) {
        return '<tr><td>' + acao + '</td><td class="num ' + (pts >= 0 ? 'pos' : 'neg') + '">' + (pts > 0 ? '+' : '') + pts + '</td></tr>';
      };
      view.innerHTML = cab('help', 'Como jogar', 'Você é o(a) especialista em segurança chamado(a) para proteger casas conectadas. Em cada missão, siga os passos abaixo.') +
        '<ol class="passos-detalhe">' +
          '<li class="card"><span class="pd-num">1</span><div><h3>' + I('radar') + 'Explore a casa</h3><p>Clique nos cômodos cobertos da planta para escaneá-los. Os dispositivos aparecem como sinais <strong>“?”</strong>. Clique em cada sinal para <strong>identificar</strong> o aparelho.</p></div></li>' +
          '<li class="card"><span class="pd-num">2</span><div><h3>' + I('search') + 'Identifique as vulnerabilidades</h3><p>Na janela do dispositivo, leia as configurações e marque as que representam risco (senha de fábrica, firmware antigo, porta aberta…). Depois clique em <strong>Confirmar análise</strong>. Marcar algo seguro conta como <strong>falso alarme</strong>.</p></div></li>' +
          '<li class="card"><span class="pd-num">3</span><div><h3>' + I('shield-check') + 'Selecione as medidas de proteção</h3><p>Para cada vulnerabilidade, escolha uma medida. Algumas resolvem o problema, outras ajudam só um pouco e outras pioram. A decisão é definitiva!</p></div></li>' +
          '<li class="card"><span class="pd-num">4</span><div><h3>' + I('alert') + 'Reconheça as ameaças</h3><p>Alertas chegam durante a missão. Leia as evidências, <strong>classifique a ameaça</strong> e escolha a melhor resposta. Nas missões 2 e 3 os alertas têm <strong>tempo limite</strong> — o cronômetro pausa enquanto a janela do alerta estiver aberta. Atenção: alguns alertas são falsos alarmes!</p></div></li>' +
          '<li class="card"><span class="pd-num">5</span><div><h3>' + I('file-text') + 'Gere o relatório</h3><p>Ao final, o relatório mostra os problemas identificados, as escolhas feitas, o nível final de proteção e recomendações. Ele pode ser impresso ou salvo em PDF.</p></div></li>' +
        '</ol>' +

        '<div class="grade-2">' +
          '<section class="card"><h2 class="card-tit">' + I('star') + 'Pontuação</h2><table class="tabela tabela-simples"><tbody>' +
            linhaPts('Identificar um dispositivo', P.identificar) +
            linhaPts('Marcar corretamente uma vulnerabilidade', P.acerto) +
            linhaPts('Concluir que um dispositivo seguro está seguro', P.dispositivoSeguro) +
            linhaPts('Falso alarme (marcar algo seguro)', P.falsoAlarme) +
            linhaPts('Usar a dica do instrutor', P.dica) +
            linhaPts('Medida ou resposta ótima', Q.otima.pontos) +
            linhaPts('Medida ou resposta parcial', Q.parcial.pontos) +
            linhaPts('Medida ou resposta inadequada', Q.ruim.pontos) +
            linhaPts('Classificar a ameaça corretamente', P.classificacaoCerta) +
            linhaPts('Classificar a ameaça errado', P.classificacaoErrada) +
            linhaPts('Deixar um alerta expirar', P.alertaExpirado) +
          '</tbody></table>' +
          '<p class="nota">Estrelas: ' + U.estrelas(3) + ' 85% ou mais dos pontos possíveis · 2 estrelas: 60% · 1 estrela: 35%. É preciso ao menos 1 estrela para liberar a próxima missão.</p></section>' +

          '<section class="card"><h2 class="card-tit">' + I('gauge') + 'Nível de segurança</h2>' +
            '<p>O medidor <strong>Segurança</strong> mostra quanto da casa está protegida. Cada configuração segura conta 1 ponto; cada vulnerabilidade e cada ameaça pesam conforme a severidade:</p>' +
            '<ul class="lista-sev">' + Object.keys(CD.SEVERIDADES).map(function (s) {
              return '<li>' + U.chipSev(s) + '<span>peso ' + CD.SEVERIDADES[s].peso + '</span></li>';
            }).join('') + '</ul>' +
            '<p>Uma medida ótima neutraliza 100% do risco, uma parcial 50% e uma inadequada 0%. Quando um alerta aparece, a segurança cai até que ele seja respondido.</p>' +
            '<h3 class="sub">Nível final de proteção</h3><ul class="lista-prot">' +
            CD.NIVEIS_PROTECAO.map(function (n, i) {
              const max = i === 0 ? 100 : CD.NIVEIS_PROTECAO[i - 1].min - 1;
              return '<li>' + U.chipStatus(n.status, n.nome, n.icone) + '<span>' + n.min + '% a ' + max + '%</span></li>';
            }).join('') + '</ul></section>' +
        '</div>' +

        '<section class="card"><h2 class="card-tit">' + I('cpu') + 'Situação dos dispositivos</h2><ul class="lista-status">' +
          Object.keys(CD.jogo.STATUS).map(function (k) {
            const S = CD.jogo.STATUS[k];
            return '<li>' + U.chipStatus(S.status, S.nome, S.icone) + '</li>';
          }).join('') + '</ul>' +
          '<p class="nota">' + I('info') + 'Também dá para jogar só com o teclado: use <kbd>Tab</kbd> para navegar pela planta e <kbd>Enter</kbd> para escolher.</p></section>' +
        '<div class="centro"><a class="btn btn-primario btn-lg" href="#/jogar">' + I('play') + 'Começar a jogar</a></div>';
    },
  };

  /* ======================= PROGRESSO ======================= */
  CD.telas.progresso = {
    titulo: 'Progresso',
    montar: function (view) {
      const st = CD.store, h = st.dados.historico;
      const concluidas = CD.NIVEIS.filter(function (n) { return st.progressoNivel(n.id).concluido; }).length;
      const estrelas = CD.NIVEIS.reduce(function (s, n) { return s + st.progressoNivel(n.id).melhorEstrelas; }, 0);
      const pontos = CD.NIVEIS.reduce(function (s, n) { return s + st.progressoNivel(n.id).melhorPontos; }, 0);
      const conq = Object.keys(st.dados.conquistas).length;

      // Desempenho acumulado por tema
      const cats = {};
      h.forEach(function (r) {
        Object.keys(r.categorias || {}).forEach(function (c) {
          cats[c] = cats[c] || { otimas: 0, total: 0 };
          cats[c].otimas += r.categorias[c].otimas;
          cats[c].total += r.categorias[c].total;
        });
      });
      const temas = Object.keys(CD.CATEGORIAS).filter(function (c) { return cats[c] && cats[c].total; });

      const tile = function (rot, val, sub) {
        return '<div class="tile"><span class="tile-rot">' + rot + '</span><span class="tile-valor">' + val + '</span>' + (sub ? '<span class="tile-sub">' + sub + '</span>' : '') + '</div>';
      };

      view.innerHTML = cab('chart', 'Progresso', 'Acompanhe sua evolução nas missões e descubra em quais temas você precisa praticar mais.') +
        '<section class="tiles">' +
          tile('Missões concluídas', concluidas + '/' + CD.NIVEIS.length) +
          tile('Estrelas', estrelas + '/' + CD.NIVEIS.length * 3) +
          tile('Soma dos recordes', U.numero(pontos), 'pontos') +
          tile('Conquistas', conq + '/' + CD.CONQUISTAS.length) +
        '</section>' +

        '<section class="card"><h2 class="card-tit">' + I('gamepad') + 'Missões</h2><ul class="lista-medidor lista-missoes-prog">' +
          CD.NIVEIS.map(function (n) {
            const p = st.progressoNivel(n.id);
            const prot = CD.nivelProtecao(p.melhorSeguranca);
            return '<li><span class="lm-nome"><strong>' + n.id + '. ' + esc(n.nome) + '</strong>' +
                (st.nivelDesbloqueado(n.id) ? '' : ' ' + I('lock')) + '</span>' +
              '<span class="lm-barra">' + U.meter(p.melhorSeguranca, p.jogadas ? prot.status : 'neutro', 'Melhor segurança em ' + n.nome) + '</span>' +
              '<span class="lm-num">' + (p.jogadas ? p.melhorSeguranca + '% · ' + U.estrelas(p.melhorEstrelas) : '<small>não jogada</small>') + '</span></li>';
          }).join('') + '</ul><p class="nota">A barra mostra a melhor segurança final alcançada em cada missão.</p></section>' +

        '<section class="card"><h2 class="card-tit">' + I('target') + 'Desempenho por tema</h2>' +
          (temas.length
            ? '<p class="nota">Percentual de decisões ótimas somando todas as partidas registradas.</p><ul class="lista-medidor">' + temas.map(function (c) {
                const v = cats[c], pct = Math.round((v.otimas / v.total) * 100);
                return '<li title="' + v.otimas + ' de ' + v.total + ' decisões ótimas"><span class="lm-nome">' + I(CD.CATEGORIAS[c].icone) + esc(CD.CATEGORIAS[c].nome) + '</span>' +
                  '<span class="lm-barra">' + U.meter(pct, 'info', CD.CATEGORIAS[c].nome) + '</span>' +
                  '<span class="lm-num">' + pct + '% <small>(' + v.otimas + '/' + v.total + ')</small></span></li>';
              }).join('') + '</ul>'
            : '<p class="vazio">' + I('info') + 'Jogue uma missão para ver seu desempenho por tema.</p>') +
        '</section>' +

        '<section class="card"><h2 class="card-tit">' + I('file-text') + 'Histórico de relatórios</h2>' +
          (h.length
            ? '<table class="tabela"><thead><tr><th>Data</th><th>Missão</th><th class="num">Pontos</th><th class="num">Segurança</th><th>Estrelas</th><th></th></tr></thead><tbody>' +
              h.map(function (r) {
                return '<tr><td data-rot="Data">' + U.data(r.data) + '</td><td data-rot="Missão">' + esc(r.nivelNome) + '</td>' +
                  '<td data-rot="Pontos" class="num">' + U.numero(r.pontos) + '</td><td data-rot="Segurança" class="num">' + r.seguranca + '%</td>' +
                  '<td data-rot="Estrelas">' + U.estrelas(r.estrelas) + '</td>' +
                  '<td><a class="btn btn-fantasma btn-sm" href="#/relatorio/' + esc(r.id) + '">' + I('eye') + 'Ver relatório</a></td></tr>';
              }).join('') + '</tbody></table>'
            : '<p class="vazio">' + I('info') + 'Nenhum relatório ainda. <a href="#/jogar">Jogue sua primeira missão!</a></p>') +
        '</section>';
    },
  };

  /* ======================= CONQUISTAS ======================= */
  CD.telas.conquistas = {
    titulo: 'Conquistas',
    montar: function (view) {
      const st = CD.store;
      const qtd = CD.CONQUISTAS.filter(function (c) { return st.temConquista(c.id); }).length;
      view.innerHTML = cab('trophy', 'Conquistas', 'Você desbloqueou <strong>' + qtd + ' de ' + CD.CONQUISTAS.length + '</strong> conquistas.') +
        '<div class="card barra-conquistas">' + U.meter((qtd / CD.CONQUISTAS.length) * 100, 'info', 'Conquistas desbloqueadas') + '</div>' +
        '<div class="grade-conquistas">' + CD.CONQUISTAS.map(function (c) {
          const data = st.dados.conquistas[c.id];
          return '<div class="conquista' + (data ? ' on' : '') + '"><span class="cq-ic">' + I(data ? c.icone : 'lock') + '</span><div><strong>' + esc(c.nome) + '</strong><p>' + esc(c.desc) + '</p>' +
            (data ? '<span class="cq-data">' + I('check') + 'Desbloqueada em ' + U.data(data) + '</span>' : '<span class="cq-data">Bloqueada</span>') + '</div></div>';
        }).join('') + '</div>';
    },
  };

  /* ======================= CONTEÚDOS ======================= */
  CD.telas.conteudos = {
    titulo: 'Conteúdos',
    montar: function (view) {
      const lidos = CD.store.dados.lidos;
      view.innerHTML = cab('book', 'Conteúdos', 'Uma biblioteca rápida sobre segurança em Internet das Coisas. Leia antes de jogar ou consulte quando tiver dúvidas.') +
        '<div class="grade-conteudos">' + CD.CONTEUDOS.map(function (c) {
          const lido = lidos.indexOf(c.id) >= 0;
          return '<button class="card cartao-conteudo' + (lido ? ' lido' : '') + '" data-acao="abrir-conteudo" data-id="' + c.id + '">' +
            '<span class="cc-ic">' + I(c.icone) + '</span><span class="cc-tit">' + esc(c.titulo) + '</span><span class="cc-txt">' + esc(c.resumo) + '</span>' +
            '<span class="cc-rodape">' + (lido ? U.chipStatus('good', 'Lido', 'check') : '<span class="cc-ler">Ler' + I('arrow-right') + '</span>') + '</span></button>';
        }).join('') + '</div>' +

        '<section class="card"><h2 class="card-tit">' + I('alert') + 'Glossário de ameaças</h2><dl class="glossario">' +
          Object.keys(CD.AMEACAS).map(function (k) {
            const a = CD.AMEACAS[k];
            return '<div><dt>' + I(a.icone) + esc(a.nome) + '</dt><dd>' + esc(a.desc) + '</dd></div>';
          }).join('') + '</dl></section>' +

        '<section class="card"><h2 class="card-tit">' + I('shield-alert') + 'Glossário de vulnerabilidades</h2><dl class="glossario">' +
          Object.keys(CD.VULNS).map(function (k) {
            const v = CD.VULNS[k];
            return '<div><dt>' + I(CD.CATEGORIAS[v.cat].icone) + esc(v.nome) + ' ' + U.chipSev(v.sev) + '</dt><dd>' + esc(v.desc) + ' <em>' + esc(v.dica) + '</em></dd></div>';
          }).join('') + '</dl></section>';
    },
  };

  CD.acoes['abrir-conteudo'] = function (el) {
    const c = CD.CONTEUDOS.find(function (x) { return x.id === el.dataset.id; });
    if (!c) return;
    CD.store.marcarLido(c.id);
    el.classList.add('lido');
    const rod = el.querySelector('.cc-rodape');
    if (rod) rod.innerHTML = U.chipStatus('good', 'Lido', 'check');
    if (CD.CONTEUDOS.every(function (x) { return CD.store.dados.lidos.indexOf(x.id) >= 0; }) && CD.store.desbloquear('estudioso')) {
      CD.audio.tocar('conquista');
      U.toast({ tipo: 'conquista', titulo: 'Conquista desbloqueada!', texto: 'Estudioso', icone: 'book' });
    }
    const idx = CD.CONTEUDOS.indexOf(c);
    const prox = CD.CONTEUDOS[idx + 1];
    U.modal.abrir({
      id: 'conteudo:' + c.id, tamanho: 'md',
      render: function () {
        return {
          titulo: esc(c.titulo), icone: c.icone, iconeClasse: 'ic-info',
          corpo: '<div class="artigo">' + c.corpo + '</div>',
          rodape: '<button class="btn btn-fantasma" data-acao="modal-fechar">Fechar</button>' +
            (prox ? '<button class="btn btn-acento" data-acao="abrir-conteudo-id" data-id="' + prox.id + '">Próximo: ' + esc(prox.titulo) + I('arrow-right') + '</button>' : ''),
        };
      },
    });
  };

  CD.acoes['abrir-conteudo-id'] = function (el) {
    const alvo = document.querySelector('.cartao-conteudo[data-id="' + el.dataset.id + '"]');
    CD.acoes['abrir-conteudo'](alvo || el);
  };

  /* ======================= CONFIGURAÇÕES ======================= */
  function chave(nome, rotulo, desc) {
    const v = CD.store.config[nome];
    return '<div class="conf-linha"><div class="conf-txt"><label for="cfg-' + nome + '">' + rotulo + '</label><p>' + desc + '</p></div>' +
      '<label class="chave"><input type="checkbox" id="cfg-' + nome + '" data-config="' + nome + '"' + (v ? ' checked' : '') + '><span class="chave-trilho" aria-hidden="true"></span></label></div>';
  }

  CD.telas.configuracoes = {
    titulo: 'Configurações',
    montar: function (view) {
      const c = CD.store.config;
      view.innerHTML = cab('settings', 'Configurações', 'Ajuste o jogo do seu jeito. As preferências ficam salvas neste navegador.') +
        '<section class="card conf">' +
          '<div class="conf-linha"><div class="conf-txt"><label for="cfg-nome">Nome do jogador ou da dupla</label><p>Aparece nos relatórios das missões.</p></div>' +
            '<input type="text" class="campo" id="cfg-nome" data-config-texto="nome" maxlength="60" placeholder="Ex.: Ana e Bruno" value="' + esc(c.nome) + '"></div>' +
          chave('som', 'Efeitos sonoros', 'Sons de alerta, acerto e erro.') +
          '<div class="conf-linha"><div class="conf-txt"><label for="cfg-volume">Volume</label><p>Intensidade dos efeitos sonoros.</p></div>' +
            '<input type="range" class="faixa" id="cfg-volume" min="0" max="100" step="5" data-config-num="volume" value="' + c.volume + '"></div>' +
          chave('tempoAlertas', 'Tempo limite nos alertas', 'Nas missões 2 e 3, os alertas expiram se não forem respondidos a tempo. Desative para jogar com calma.') +
          chave('dicas', 'Mensagens do instrutor', 'Mostra abaixo da planta uma sugestão do próximo passo.') +
          chave('reduzirAnimacoes', 'Reduzir animações', 'Diminui pulsos e movimentos na tela.') +
          chave('modoProfessor', 'Modo professor', 'Libera todas as missões sem precisar concluir as anteriores (útil para apresentações).') +
        '</section>' +
        '<section class="card conf"><div class="conf-linha"><div class="conf-txt"><label>Apagar progresso</label><p>Remove recordes, conquistas, relatórios e conteúdos lidos deste navegador.</p></div>' +
          '<button class="btn btn-perigo" data-acao="apagar-progresso">' + I('trash') + 'Apagar progresso</button></div></section>' +
        '<section class="card sobre"><h2 class="card-tit">' + I('info') + 'Sobre</h2>' +
          '<p><strong>Cyber Defense: Proteja sua Smart Home</strong> — simulador interativo de segurança residencial desenvolvido para o desafio da Unidade Curricular <em>Internet das Coisas</em> (Cibersegurança em IoT).</p>' +
          '<p>Os nomes de marcas, modelos e pessoas usados nas missões são fictícios. Os endereços IP de “atacantes” usam faixas reservadas para documentação.</p></section>';
    },
  };

  CD.acoes['apagar-progresso'] = function () {
    U.confirmar({
      titulo: 'Apagar todo o progresso?', texto: 'Recordes, conquistas, relatórios e conteúdos lidos serão removidos. Essa ação não pode ser desfeita.',
      sim: 'Apagar tudo', nao: 'Cancelar', perigo: true, icone: 'trash',
    }).then(function (ok) {
      if (!ok) return;
      CD.store.resetar();
      CD.app.aplicarConfig();
      CD.app.rota();
      U.toast({ tipo: 'sucesso', titulo: 'Progresso apagado', texto: 'Você pode começar do zero.' });
    });
  };
})();
