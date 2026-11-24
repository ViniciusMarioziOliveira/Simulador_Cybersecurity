/* =========================================================
   MISSÃO 2 — Casa da Família (médio)
   ========================================================= */
window.CD = window.CD || {};
CD.NIVEIS = CD.NIVEIS || [];

CD.NIVEIS.push({
  id: 2,
  nome: 'Casa da Família',
  local: 'Casa da família Souza',
  dificuldade: 'Médio',
  tempoAlerta: 90, // segundos para responder a cada alerta
  resumo: 'Uma casa com aparelhos antigos e novos, alertas com tempo limite e um falso alarme escondido.',
  historia: 'A família Souza tem uma casa cheia de aparelhos conectados — alguns comprados há quase dez anos. Nas últimas semanas a internet ficou lenta e coisas estranhas começaram a acontecer. Investigue a casa, responda aos alertas antes que o tempo acabe e deixe tudo protegido.',

  planta: {
    comodos: [
      { id: 'garagem', nome: 'Garagem', x: 40, y: 40, w: 230, h: 290, moveis: [
        { t: 'carro', x: 92, y: 92, w: 116, h: 206 },
        { t: 'estante', x: 230, y: 120, w: 32, h: 150, r: 90 },
      ] },
      { id: 'sala', nome: 'Sala de Estar', x: 270, y: 40, w: 370, h: 290, moveis: [
        { t: 'tapete', x: 340, y: 118, w: 130, h: 184 },
        { t: 'rack', x: 280, y: 120, w: 28, h: 160, r: 270 },
        { t: 'mesaCentro', x: 372, y: 170, w: 60, h: 90 },
        { t: 'sofa', x: 476, y: 118, w: 70, h: 184, r: 90 },
        { t: 'planta', x: 596, y: 286, w: 34, h: 34 },
      ] },
      { id: 'cozinha', nome: 'Cozinha', x: 640, y: 40, w: 320, h: 290, moveis: [
        { t: 'bancada', x: 690, y: 48, w: 206, h: 46, fogao: 0.28, pia: 0.74 },
        { t: 'geladeira', x: 900, y: 48, w: 52, h: 62 },
        { t: 'mesa', x: 716, y: 168, w: 178, h: 104 },
      ] },
      { id: 'escritorio', nome: 'Escritório', x: 40, y: 330, w: 230, h: 250, moveis: [
        { t: 'escrivaninha', x: 50, y: 380, w: 76, h: 140, r: 270 },
        { t: 'estante', x: 140, y: 540, w: 112, h: 32, r: 180 },
        { t: 'planta', x: 220, y: 492, w: 32, h: 32 },
      ] },
      { id: 'criancas', nome: 'Quarto das Crianças', x: 270, y: 330, w: 250, h: 250, moveis: [
        { t: 'cama', x: 428, y: 342, w: 82, h: 150 },
        { t: 'tapete', x: 306, y: 418, w: 104, h: 92 },
        { t: 'caixa', x: 284, y: 526, w: 70, h: 44 },
        { t: 'estante', x: 380, y: 544, w: 100, h: 28, r: 180 },
      ] },
      { id: 'banheiro', nome: 'Banheiro', x: 520, y: 330, w: 120, h: 250, moveis: [
        { t: 'pia', x: 528, y: 398, w: 40, h: 62, r: 270 },
        { t: 'chuveiro', x: 528, y: 504, w: 60, h: 68 },
        { t: 'vaso', x: 594, y: 518, w: 38, h: 54, r: 180 },
      ] },
      { id: 'casal', nome: 'Quarto do Casal', x: 640, y: 330, w: 320, h: 250, moveis: [
        { t: 'cama', x: 772, y: 372, w: 174, h: 160, r: 90 },
        { t: 'criado', x: 902, y: 338, w: 40, h: 30 },
        { t: 'criado', x: 902, y: 540, w: 40, h: 30 },
        { t: 'guarda', x: 660, y: 538, w: 150, h: 34, r: 180 },
      ] },
    ],
    portas: [
      { x: 430, y: 40, l: 70, o: 'h', s: 1, ext: true },     // porta da frente
      { x: 70, y: 40, l: 170, o: 'h', garagem: true },       // portão da garagem
      { x: 170, y: 330, l: 60, o: 'h', s: 1 },               // garagem → escritório
      { x: 290, y: 330, l: 60, o: 'h', s: 1 },               // sala → crianças
      { x: 572, y: 330, l: 50, o: 'h', s: 1 },               // sala → banheiro
      { x: 660, y: 330, l: 60, o: 'h', s: 1 },               // cozinha → casal
      { x: 640, y: 90, l: 90, o: 'v', aberta: true },        // sala ↔ cozinha
    ],
    janelas: [
      { x: 40, y: 150, l: 80, o: 'v' },
      { x: 300, y: 40, l: 90, o: 'h' },
      { x: 548, y: 40, l: 66, o: 'h' },
      { x: 960, y: 140, l: 90, o: 'v' },
      { x: 40, y: 400, l: 80, o: 'v' },
      { x: 300, y: 580, l: 60, o: 'h' },
      { x: 830, y: 580, l: 90, o: 'h' },
      { x: 960, y: 410, l: 80, o: 'v' },
    ],
  },

  dispositivos: [
    {
      id: 'roteador', tipo: 'roteador', nome: 'Roteador Wi-Fi', comodo: 'escritorio', x: 88, y: 452,
      modelo: 'NetHome N300 (comprado em 2014)', ip: '192.168.0.1',
      itens: [
        { r: 'Criptografia do Wi-Fi', v: 'WEP (64 bits)', vuln: 'wifi_wep' },
        { r: 'UPnP', v: 'Ativado', vuln: 'upnp' },
        { r: 'Senha do painel', v: 'Personalizada · 14 caracteres', ok: 'Senha do painel já foi trocada por uma senha forte.' },
        { r: 'Firmware', v: '1.4.2 — mais recente para o modelo', ok: 'Está na versão mais recente disponível.' },
        { r: 'Rede de convidados', v: 'Ativada, com senha própria', ok: 'Visitas usam uma rede separada: boa prática.' },
      ],
    },
    {
      id: 'camera', tipo: 'camera', nome: 'Câmera da Garagem', comodo: 'garagem', x: 66, y: 96,
      modelo: 'VisionCam Outdoor 4K', ip: '192.168.0.24',
      itens: [
        { r: 'Usuário e senha', v: 'admin / admin', vuln: 'senha_padrao' },
        { r: 'Portas abertas', v: '554 (vídeo RTSP) · 23 (Telnet)', vuln: 'telnet_aberto' },
        { r: 'Firmware', v: '5.2.0 — mais recente', ok: 'Atualizado.' },
        { r: 'Gravações', v: 'Na nuvem do fabricante, criptografadas', ok: 'Armazenamento com criptografia.' },
      ],
    },
    {
      id: 'fechadura', tipo: 'fechadura', nome: 'Fechadura da Porta', comodo: 'sala', x: 516, y: 66,
      modelo: 'SafeLock Pro', ip: 'Bluetooth + ponte Wi-Fi',
      itens: [
        { r: 'Conta do aplicativo', v: 'Somente senha · verificação em duas etapas desativada', vuln: 'sem_2fa' },
        { r: 'Comunicação', v: 'Bluetooth LE com criptografia AES-128', ok: 'Comunicação criptografada.' },
        { r: 'Registro de acessos', v: 'Ativado, com notificação no celular', ok: 'A família sabe quem entrou e quando.' },
        { r: 'Limite de tentativas no teclado', v: 'Bloqueio de 5 min após 5 erros', ok: 'Protege contra quem tenta adivinhar o PIN.' },
      ],
    },
    {
      id: 'termostato', tipo: 'termostato', nome: 'Termostato', comodo: 'sala', x: 616, y: 236,
      modelo: 'Termo+ T5', ip: '192.168.0.60',
      itens: [
        { r: 'Rede', v: 'Wi-Fi principal (junto com notebooks e celulares)', vuln: 'rede_unica' },
        { r: 'Firmware', v: '3.0.1 · atualizações automáticas', ok: 'Atualizado e com atualização automática.' },
        { r: 'Senha do aplicativo', v: 'Frase-senha exclusiva', ok: 'Senha forte.' },
        { r: 'Temperatura programada', v: '22 °C', ok: 'Só uma preferência de conforto.' },
      ],
    },
    {
      id: 'tv', tipo: 'tv', nome: 'Smart TV', comodo: 'sala', x: 296, y: 200,
      modelo: 'LumaTV 55" 4K', ip: '192.168.0.70',
      itens: [
        { r: 'Atualizações', v: 'Automáticas · instalação às 03h00', ok: 'Atualizações automáticas em horário de pouco uso: correto.' },
        { r: 'Instalação de aplicativos', v: 'Somente pela loja oficial', ok: 'Boa prática contra apps maliciosos.' },
        { r: 'Conta do usuário', v: 'Senha exclusiva + verificação em duas etapas', ok: 'Conta bem protegida.' },
        { r: 'Câmera e microfone da TV', v: 'Desativados nas configurações', ok: 'Menos sensores ligados, menos riscos à privacidade.' },
      ],
    },
    {
      id: 'assistente', tipo: 'assistente', nome: 'Assistente Virtual', comodo: 'cozinha', x: 805, y: 220,
      modelo: 'Íris Max', ip: '192.168.0.41',
      itens: [
        { r: 'Compras por voz', v: 'Ativadas, sem PIN', vuln: 'compras_voz' },
        { r: 'Gravações de voz', v: 'Compartilhadas com “parceiros para melhoria de serviços”', vuln: 'privacidade_dados' },
        { r: 'Conta vinculada', v: 'Verificação em duas etapas ativada', ok: 'Conta protegida com 2FA.' },
        { r: 'Firmware', v: 'Atualizado automaticamente', ok: 'Atualizado.' },
      ],
    },
    {
      id: 'hub', tipo: 'lampada', nome: 'Hub das Lâmpadas', comodo: 'casal', x: 922, y: 353,
      modelo: 'LuzSmart Hub v1', ip: '192.168.0.31',
      itens: [
        { r: 'Usuário e senha do hub', v: 'admin / 1234', vuln: 'senha_padrao' },
        { r: 'Firmware', v: '1.0.0 (de 2020) · versão 1.8.3 disponível', vuln: 'firmware_desatualizado' },
        { r: 'Comunicação com as lâmpadas', v: 'Zigbee criptografado', ok: 'Comunicação criptografada.' },
        { r: 'Cenas programadas', v: '“Cinema”, “Acordar” e “Jantar”', ok: 'Só preferências de iluminação.' },
      ],
    },
    {
      id: 'brinquedo', tipo: 'brinquedo', nome: 'Robô de Brinquedo', comodo: 'criancas', x: 358, y: 464,
      modelo: 'Robozinho Bento', ip: 'Bluetooth',
      itens: [
        { r: 'Bluetooth', v: 'Sempre visível · pareamento sem PIN', vuln: 'bluetooth_aberto' },
        { r: 'Microfone', v: 'Ativo para conversar com a criança', ok: 'É a função do brinquedo; o risco está em quem consegue se conectar a ele.' },
        { r: 'App dos pais', v: 'Senha exclusiva com verificação em duas etapas', ok: 'Conta protegida.' },
        { r: 'Firmware', v: '2.1.0 — mais recente', ok: 'Atualizado.' },
      ],
    },
  ],

  alertas: [
    {
      id: 'botnet', dispositivo: 'hub', sev: 'critica',
      titulo: 'Tráfego anormal saindo da casa',
      resumo: 'O Hub das Lâmpadas está abrindo milhares de conexões com a internet.',
      evidencias: [
        'Roteador › Monitor de tráfego',
        'hub-lampadas (192.168.0.31) → 14.832 conexões por minuto',
        'Destinos: 9.421 endereços diferentes · porta 23/TCP',
        'Uso de upload: 98% (normal: 1%)',
        'Internet da casa: lenta desde terça-feira',
      ],
      ameaca: 'botnet', distratores: ['legitimo', 'jamming', 'intruso'],
      explicacao: 'O hub foi infectado (a senha de fábrica facilitou!) e virou parte de uma botnet: ele procura outros aparelhos vulneráveis na porta 23 e pode ser usado em ataques de negação de serviço (DDoS).',
      respostas: [
        { q: 'otima', t: 'Isolar o hub da rede, restaurar o padrão de fábrica, atualizar o firmware e criar uma senha forte.', f: 'Resposta completa: você removeu a infecção e fechou a porta por onde ela entrou.' },
        { q: 'parcial', t: 'Apenas reiniciar o hub.', f: 'Alguns malwares (como a Mirai) somem ao reiniciar — mas, com a mesma senha fraca, o aparelho é reinfectado em minutos.' },
        { q: 'ruim', t: 'Contratar uma internet mais rápida para compensar a lentidão.', f: 'A lentidão é sintoma. O aparelho continuaria infectado e atacando outras pessoas.' },
      ],
      gatilho: { tipo: 'identificado', alvo: 'hub', atraso: 15 },
    },
    {
      id: 'intruso', dispositivo: 'roteador', sev: 'alta',
      titulo: 'Aparelho desconhecido na rede',
      resumo: 'Um dispositivo que ninguém reconhece se conectou ao Wi-Fi.',
      evidencias: [
        'Roteador › Dispositivos conectados',
        '+ NOVO  ESP_3F2A1C  MAC 5C:CF:7F:3F:2A:1C  IP 192.168.0.77',
        'Conectado às 23:47 · sinal forte (dentro ou perto da casa)',
        'Não corresponde a nenhum aparelho da família.',
      ],
      ameaca: 'intruso', distratores: ['legitimo', 'phishing', 'replay'],
      explicacao: 'Um aparelho desconhecido entrou na rede — provavelmente alguém quebrou a criptografia WEP. Dentro da rede, ele pode espionar o tráfego e atacar os outros dispositivos.',
      respostas: [
        { q: 'otima', t: 'Bloquear o aparelho, trocar a senha do Wi-Fi (usando WPA2/WPA3) e revisar a lista de conectados.', f: 'Perfeito: o intruso foi expulso e não consegue voltar com a senha antiga.' },
        { q: 'parcial', t: 'Bloquear apenas o endereço MAC do aparelho.', f: 'O invasor pode trocar o MAC facilmente e voltar, porque ainda conhece (ou quebra) a senha do Wi-Fi.' },
        { q: 'ruim', t: 'Deixar conectado — deve ser algum vizinho usando a internet.', f: 'Mesmo que fosse um vizinho, um estranho dentro da rede enxerga todos os seus dispositivos.' },
      ],
      gatilho: { tipo: 'identificado', alvo: 'roteador', atraso: 25 },
    },
    {
      id: 'tv-update', dispositivo: 'tv', sev: 'baixa',
      titulo: 'Download grande de madrugada',
      resumo: 'A Smart TV baixou 1,8 GB às 03h00.',
      evidencias: [
        'Smart TV › Registro do sistema',
        '03:00:00  Atualização automática agendada iniciada',
        '03:00:04  Origem: servidor oficial do fabricante (certificado válido)',
        '03:12:40  Pacote de 1,8 GB · assinatura digital verificada ✔',
        '03:14:02  Firmware 7.4.2 instalado · reinicialização concluída',
      ],
      ameaca: 'legitimo', distratores: ['botnet', 'vazamento', 'intruso'],
      explicacao: 'É uma atualização oficial: horário agendado, servidor do fabricante, certificado válido e assinatura digital verificada. Nem todo alerta é um ataque — saber distinguir evita pânico e decisões ruins.',
      respostas: [
        { q: 'otima', t: 'Confirmar no app oficial que a atualização foi instalada e manter as atualizações automáticas.', f: 'Isso mesmo: verificar com calma e manter o que está funcionando bem.' },
        { q: 'parcial', t: 'Adiar as próximas atualizações para revisar tudo manualmente.', f: 'Atrasar atualizações mantém falhas abertas por mais tempo. Não havia motivo para isso.' },
        { q: 'ruim', t: 'Bloquear os servidores do fabricante no roteador.', f: 'Isso impediria as próximas correções de segurança da TV.' },
      ],
      gatilho: { tipo: 'identificado', alvo: 'tv', atraso: 10 },
    },
    {
      id: 'compra-voz', dispositivo: 'assistente', sev: 'media',
      titulo: 'Compra feita pelo assistente',
      resumo: 'O assistente virtual fez um pedido de R$ 1.299,00.',
      evidencias: [
        'Assistente › Histórico de comandos',
        '21:15:07  [Sala] “…peça já o seu fone ProSound, é só pedir!”',
        '21:15:09  Compra confirmada: Fone ProSound — R$ 1.299,00',
        'Voz não reconhecida como de um morador · origem provável: áudio da TV',
      ],
      ameaca: 'voz', distratores: ['phishing', 'legitimo', 'intruso'],
      explicacao: 'O comercial da TV ativou o assistente, que aceitou a compra sem confirmação. Assistentes sem PIN obedecem a qualquer voz — inclusive gravações.',
      respostas: [
        { q: 'otima', t: 'Cancelar o pedido, exigir PIN de voz para compras e ativar o reconhecimento de voz dos moradores.', f: 'Ótimo: o prejuízo foi evitado e o problema não se repete.' },
        { q: 'parcial', t: 'Cancelar o pedido e mudar o assistente para longe da TV.', f: 'Ajuda, mas qualquer outra pessoa (ou gravação) ainda pode fazer compras sem PIN.' },
        { q: 'ruim', t: 'Manter o pedido para não ter o trabalho de devolver.', f: 'O dinheiro seria perdido e o assistente continuaria aceitando compras de qualquer voz.' },
      ],
      gatilho: { tipo: 'identificado', alvo: 'assistente', atraso: 20 },
    },
  ],
});
