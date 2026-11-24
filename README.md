# Cyber Defense: Proteja sua Smart Home

Simulador interativo de segurança residencial desenvolvido para o desafio da Unidade Curricular **Internet das Coisas — Cibersegurança em IoT**.

O jogador recebe uma casa com vários dispositivos conectados. Alguns estão protegidos; outros têm vulnerabilidades que precisam ser **identificadas** e **corrigidas**. Durante a missão chegam **alertas de ameaça** que precisam ser reconhecidos e respondidos. No fim, um **relatório** mostra os problemas encontrados, as escolhas feitas e o nível final de proteção.

## Como executar

Não precisa instalar nada.

1. Abra a pasta do projeto.
2. Dê dois cliques em **`index.html`** (abre no navegador).

Também funciona com a extensão *Live Server* do VS Code. Recomendado: Chrome ou Edge atualizados. Com internet, os títulos usam a fonte *Exo 2*; sem internet, o navegador usa a fonte do sistema.

> Dica para apresentação: em **Configurações → Modo professor** todas as missões ficam liberadas. O botão de tela cheia fica no canto superior direito.

## Os três requisitos obrigatórios

| Requisito | Como aparece no jogo |
|---|---|
| **Identificar vulnerabilidades** | Na janela de cada dispositivo, o jogador lê as configurações (senha, firmware, portas, criptografia…) e marca as que são perigosas. Acertos dão pontos; marcar algo seguro conta como *falso alarme*. |
| **Reconhecer ameaças** | Alertas chegam durante a missão com evidências (registros, e-mails, tráfego de rede). O jogador classifica a ameaça: força bruta, phishing, botnet, rede falsa, replay, jamming, vazamento… ou um falso alarme. |
| **Selecionar medidas de proteção** | Para cada vulnerabilidade e cada ameaça, o jogador escolhe uma medida. Ótima = resolve, parcial = ajuda pouco, inadequada = não resolve. Cada escolha muda o **nível de segurança** da casa. |

## Como se joga

1. **Explore** — clique nos cômodos cobertos da planta para escaneá-los.
2. **Identifique** — clique nos sinais **?** para descobrir qual é o dispositivo.
3. **Analise** — marque as configurações de risco e confirme a análise.
4. **Proteja** — escolha a melhor medida para cada vulnerabilidade.
5. **Responda aos alertas** — classifique a ameaça e escolha a resposta. Nas missões 2 e 3 há tempo limite (o cronômetro pausa enquanto a janela do alerta está aberta).
6. **Gere o relatório** — pode ser impresso ou salvo em PDF.

### Missões

| Missão | Casa | Dificuldade | Dispositivos | Vulnerabilidades | Alertas | Tempo por alerta |
|---|---|---|---|---|---|---|
| 1 | Apartamento Conectado | Fácil | 5 | 4 | 2 | sem limite |
| 2 | Casa da Família | Médio | 8 | 11 | 4 | 90 s |
| 3 | Smart Home sob Ataque | Difícil | 12 | 13 | 6 | 60 s |

### Pontuação e segurança

- **Segurança (%)**: cada configuração segura vale 1; cada vulnerabilidade e cada ameaça pesam pela severidade (Crítica 5, Alta 4, Média 3, Baixa 2). Medida ótima neutraliza 100% do risco, parcial 50%, inadequada 0%.
- **Nível final de proteção**: Fortaleza Digital (90%+), Protegida com ressalvas (70–89%), Parcialmente protegida (50–69%), Vulnerável (abaixo de 50%).
- **Estrelas**: 3 com 85% dos pontos possíveis, 2 com 60%, 1 com 35%. É preciso 1 estrela para liberar a próxima missão.

## Recursos extras

- **Conteúdos**: biblioteca com 12 textos curtos (senhas, firmware, Wi-Fi, 2FA, phishing, botnet Mirai, LGPD…) e glossários de ameaças e vulnerabilidades.
- **Conquistas**: 14 medalhas (ex.: *Detetive Digital*, *Nem Tudo É Ataque*, *Fortaleza Digital*).
- **Progresso**: recordes, desempenho por tema e histórico de relatórios.
- **Configurações**: nome da dupla (sai no relatório), som, tempo limite dos alertas, mensagens do instrutor, animações reduzidas e modo professor.
- Funciona no computador, tablet e celular, e também pode ser jogado só com o teclado (Tab + Enter).
- O progresso fica salvo no navegador (localStorage).

## Estrutura do projeto

```
index.html              página única do jogo
css/
  base.css              cores, layout, menu, barra superior, botões, janelas
  telas.css             início, missões, relatório, conteúdos, configurações, impressão
  jogo.css              planta da casa e janelas de dispositivo/alerta
js/
  icones.js             ícones em SVG
  dados/catalogo.js     vulnerabilidades, medidas de proteção e tipos de ameaça
  dados/nivel1.js       missão 1 (planta, dispositivos e alertas)
  dados/nivel2.js       missão 2
  dados/nivel3.js       missão 3
  dados/conteudos.js    conquistas, níveis de proteção e textos educativos
  armazenamento.js      salva progresso e configurações
  audio.js              efeitos sonoros gerados pelo navegador
  ui.js                 janelas, notificações e funções de apoio
  planta.js             desenha a casa em SVG
  jogo.js               regras: pontuação, segurança, alertas e relatório
  telas/*.js            cada tela do jogo
  app.js                navegação, menu e barra superior
```

## Como adicionar conteúdo

**Nova vulnerabilidade** — em `js/dados/catalogo.js`, dentro de `CD.VULNS`:

```js
minha_falha: {
  nome: 'Nome da falha', sev: 'alta', cat: 'rede',
  desc: 'Por que é perigoso…',
  dica: 'Boa prática resumida…',
  medidas: [
    { q: 'otima',   t: 'Medida certa',        f: 'Explicação' },
    { q: 'parcial', t: 'Medida que ajuda pouco', f: 'Explicação' },
    { q: 'ruim',    t: 'Medida errada',       f: 'Explicação' },
  ],
},
```

**Novo dispositivo** — no arquivo da missão (`nivelX.js`), dentro de `dispositivos`. `x` e `y` são a posição na planta (0–1000 × 0–620); `tipo` deve existir em `CD.TIPOS_DISPOSITIVO` (`catalogo.js`), que define o ícone:

```js
{
  id: 'tomada', tipo: 'tomada', nome: 'Tomada Inteligente', comodo: 'sala', x: 300, y: 250,
  modelo: 'Plug Pro', ip: '192.168.0.80',
  itens: [
    { r: 'Senha', v: 'admin / admin', vuln: 'senha_padrao' },
    { r: 'Firmware', v: '2.0 — mais recente', ok: 'Atualizado.' },
  ],
},
```

**Novo alerta** — em `alertas`, com as evidências, o tipo de ameaça correto (`ameaca`), três distratores, as respostas e o gatilho (`identificado`, `analisados` ou `tempo`).

## Créditos

Desenvolvido por **Vinícius Mariozi Oliveira** e **Julio Aurélio Souza**, estudantes do SENAI, com auxílio de inteligência artificial, como proposto no desafio. A tela **Créditos** fica no menu lateral do jogo.

## Observações

- Marcas, modelos e pessoas das missões são fictícios.
- Os IPs “atacantes” usam faixas reservadas para documentação (203.0.113.x, 198.51.100.x).
