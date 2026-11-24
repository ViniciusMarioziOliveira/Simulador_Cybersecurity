/* =========================================================
   MISSÃO 1 — Apartamento Conectado (fácil)
   Planta em coordenadas de um SVG 1000 x 620.
   Itens de configuração:
     r = rótulo | v = valor | vuln = id da vulnerabilidade (CD.VULNS)
     ok = explicação mostrada quando o item é seguro
   ========================================================= */
window.CD = window.CD || {};
CD.NIVEIS = CD.NIVEIS || [];

CD.NIVEIS.push({
  id: 1,
  nome: 'Apartamento Conectado',
  local: 'Apartamento da Júlia',
  dificuldade: 'Fácil',
  tempoAlerta: 0, // 0 = alertas sem tempo limite (missão de treinamento)
  resumo: 'Um apartamento pequeno com os primeiros dispositivos inteligentes. Ideal para aprender o básico.',
  historia: 'A Júlia acabou de se mudar para o primeiro apartamento e instalou vários dispositivos inteligentes por conta própria. Ela pediu a sua ajuda para descobrir quais aparelhos estão seguros, quais têm falhas e o que fazer para proteger a casa.',

  planta: {
    comodos: [
      { id: 'sala', nome: 'Sala de Estar', x: 60, y: 40, w: 480, h: 300, moveis: [
        { t: 'tapete', x: 170, y: 110, w: 260, h: 150 },
        { t: 'rack', x: 200, y: 50, w: 200, h: 26 },
        { t: 'mesaCentro', x: 250, y: 150, w: 100, h: 55 },
        { t: 'sofa', x: 170, y: 252, w: 260, h: 70, r: 180 },
        { t: 'poltrona', x: 82, y: 130, w: 70, h: 70, r: 270 },
        { t: 'planta', x: 488, y: 284, w: 38, h: 38 },
        { t: 'planta', x: 76, y: 270, w: 34, h: 34 },
      ] },
      { id: 'cozinha', nome: 'Cozinha', x: 540, y: 40, w: 400, h: 220, moveis: [
        { t: 'bancada', x: 600, y: 48, w: 250, h: 46, fogao: 0.25, pia: 0.72 },
        { t: 'geladeira', x: 866, y: 48, w: 64, h: 62 },
        { t: 'mesa', x: 630, y: 135, w: 180, h: 100 },
      ] },
      { id: 'quarto', nome: 'Quarto', x: 540, y: 260, w: 400, h: 320, moveis: [
        { t: 'tapete', x: 630, y: 360, w: 110, h: 140 },
        { t: 'cama', x: 750, y: 335, w: 180, h: 150, r: 90 },
        { t: 'criado', x: 884, y: 296, w: 40, h: 32 },
        { t: 'criado', x: 884, y: 492, w: 40, h: 32 },
        { t: 'guarda', x: 580, y: 528, w: 160, h: 42, r: 180 },
        { t: 'escrivaninha', x: 556, y: 270, w: 120, h: 70 },
      ] },
      { id: 'banheiro', nome: 'Banheiro', x: 60, y: 340, w: 200, h: 240, moveis: [
        { t: 'chuveiro', x: 70, y: 350, w: 82, h: 82 },
        { t: 'vaso', x: 192, y: 352, w: 44, h: 58 },
        { t: 'pia', x: 72, y: 516, w: 72, h: 50, r: 180 },
      ] },
      { id: 'entrada', nome: 'Hall de Entrada', x: 260, y: 340, w: 280, h: 240, moveis: [
        { t: 'estante', x: 276, y: 470, w: 42, h: 96 },
        { t: 'tapete', x: 362, y: 522, w: 66, h: 34 },
        { t: 'planta', x: 486, y: 520, w: 38, h: 38 },
      ] },
    ],
    portas: [
      { x: 360, y: 580, l: 70, o: 'h', s: -1, ext: true },  // porta principal
      { x: 440, y: 340, l: 70, o: 'h', s: -1 },             // hall → sala
      { x: 260, y: 430, l: 60, o: 'v', s: -1 },             // hall → banheiro
      { x: 540, y: 440, l: 70, o: 'v', s: 1 },              // hall → quarto
      { x: 540, y: 120, l: 80, o: 'v', aberta: true },      // sala ↔ cozinha (passagem)
    ],
    janelas: [
      { x: 90, y: 40, l: 90, o: 'h' },
      { x: 60, y: 160, l: 90, o: 'v' },
      { x: 700, y: 40, l: 80, o: 'h' },
      { x: 940, y: 140, l: 80, o: 'v' },
      { x: 770, y: 580, l: 110, o: 'h' },
      { x: 60, y: 440, l: 44, o: 'v' },
    ],
  },

  dispositivos: [
    {
      id: 'roteador', tipo: 'roteador', nome: 'Roteador Wi-Fi', comodo: 'sala', x: 444, y: 66,
      modelo: 'NetHome AX1500', ip: '192.168.0.1',
      itens: [
        { r: 'Usuário e senha do painel', v: 'admin / admin', vuln: 'senha_padrao' },
        { r: 'Criptografia do Wi-Fi', v: 'WPA2-AES · senha com 16 caracteres', ok: 'WPA2 com AES e senha longa é uma configuração segura.' },
        { r: 'Firmware', v: '3.1.8 — versão mais recente', ok: 'O roteador está atualizado.' },
        { r: 'Acesso ao painel pela internet', v: 'Desativado', ok: 'Ótimo: o painel só pode ser aberto de dentro de casa.' },
      ],
    },
    {
      id: 'camera', tipo: 'camera', nome: 'Câmera da Entrada', comodo: 'entrada', x: 506, y: 374,
      modelo: 'VisionCam HD-200', ip: '192.168.0.23',
      itens: [
        { r: 'Usuário e senha', v: 'admin / 123456', vuln: 'senha_fraca', sev: 'critica' },
        { r: 'Firmware', v: '1.0.4 (instalado em 2022) · versão 2.6.0 disponível', vuln: 'firmware_desatualizado' },
        { r: 'Transmissão de vídeo', v: 'Criptografada (HTTPS / TLS 1.3)', ok: 'O vídeo trafega criptografado: está correto.' },
        { r: 'Armazenamento', v: 'Cartão microSD local · 64 GB', ok: 'Informação neutra: o local de armazenamento não é, por si só, uma falha.' },
        { r: 'Visão noturna', v: 'Ativada', ok: 'Recurso de imagem, sem relação com segurança digital.' },
      ],
    },
    {
      id: 'lampadas', tipo: 'lampada', nome: 'Lâmpadas Inteligentes', comodo: 'quarto', x: 686, y: 432,
      modelo: 'LuzSmart Color (3 lâmpadas)', ip: '192.168.0.31',
      itens: [
        { r: 'Comunicação', v: 'Zigbee 3.0 com criptografia AES-128', ok: 'Protocolo com criptografia: está correto.' },
        { r: 'Senha do aplicativo', v: 'Frase-senha com 20 caracteres', ok: 'Senha longa e exclusiva.' },
        { r: 'Firmware', v: '2.4.0 · atualizações automáticas ativadas', ok: 'Atualizado e com atualização automática.' },
        { r: 'Cor da luz', v: 'Branco quente (2700 K)', ok: 'Só uma preferência de iluminação — não tem relação com segurança.' },
        { r: 'Rotina programada', v: 'Acender às 18h30 todos os dias', ok: 'A rotina fica salva na conta protegida; não é uma vulnerabilidade.' },
      ],
    },
    {
      id: 'assistente', tipo: 'assistente', nome: 'Assistente Virtual', comodo: 'cozinha', x: 720, y: 186,
      modelo: 'Íris Mini', ip: '192.168.0.40',
      itens: [
        { r: 'Compras por voz', v: 'Ativadas, sem PIN de confirmação', vuln: 'compras_voz' },
        { r: 'Conta vinculada', v: 'Protegida com verificação em duas etapas', ok: 'A conta tem 2FA: está correta.' },
        { r: 'Botão físico de mudo', v: 'Disponível', ok: 'É um recurso de privacidade, não uma falha.' },
        { r: 'Firmware', v: 'Atualizado automaticamente', ok: 'Atualizações em dia.' },
      ],
    },
    {
      id: 'sensor', tipo: 'sensor', nome: 'Sensor da Porta', comodo: 'entrada', x: 452, y: 552,
      modelo: 'AbreFecha S2', ip: 'via hub Zigbee',
      itens: [
        { r: 'Comunicação', v: 'Zigbee com criptografia', ok: 'Comunicação criptografada.' },
        { r: 'Bateria', v: '87%', ok: 'Informação de funcionamento, sem risco de segurança.' },
        { r: 'Notificações', v: 'Ativadas no celular da Júlia', ok: 'Ela é avisada sempre que a porta abre.' },
        { r: 'Firmware', v: '1.9.2 — mais recente', ok: 'Atualizado.' },
      ],
    },
  ],

  alertas: [
    {
      id: 'forca-bruta', dispositivo: 'camera', sev: 'alta',
      titulo: 'Tentativas de login em massa',
      resumo: 'Câmera da Entrada: centenas de logins falhos vindos da internet.',
      evidencias: [
        'Câmera da Entrada › Registro de acessos',
        '03:12:01  LOGIN FALHOU  usuário=admin  origem=203.0.113.45',
        '03:12:01  LOGIN FALHOU  usuário=root   origem=203.0.113.45',
        '03:12:02  LOGIN FALHOU  usuário=user   origem=203.0.113.45',
        '03:12:02  LOGIN FALHOU  usuário=admin  origem=203.0.113.45',
        '…         +308 tentativas em 10 minutos',
      ],
      ameaca: 'forca_bruta', distratores: ['legitimo', 'phishing', 'replay'],
      explicacao: 'Um robô está testando milhares de combinações de usuário e senha até acertar — um ataque de força bruta (ou de dicionário). Senhas fracas como “123456” caem em segundos.',
      respostas: [
        { q: 'otima', t: 'Bloquear o endereço de origem, trocar a senha por uma forte e ativar o bloqueio após tentativas erradas.', f: 'Resposta completa: você parou o ataque agora e impediu que ele funcione no futuro.' },
        { q: 'parcial', t: 'Apenas bloquear o endereço IP de origem.', f: 'Ajuda por alguns minutos, mas o atacante troca de IP facilmente. O essencial é senha forte e limite de tentativas.' },
        { q: 'ruim', t: 'Desligar as notificações da câmera para parar os avisos.', f: 'Desligar o alarme não interrompe o ataque — só deixa você sem saber dele.' },
      ],
      gatilho: { tipo: 'identificado', alvo: 'camera', atraso: 12 },
    },
    {
      id: 'phishing', sev: 'media',
      titulo: 'E-mail urgente do “suporte”',
      resumo: 'A Júlia recebeu um e-mail pedindo para confirmar a senha da câmera.',
      evidencias: [
        'Caixa de entrada › 1 nova mensagem',
        'De: Suporte VisionCam <seguranca@visioncam-suporte.net>',
        'Assunto: URGENTE: sua câmera será BLOQUEADA em 24h!',
        '“Detectamos acesso irregular. Confirme sua senha agora para',
        ' evitar o bloqueio: http://visioncam-suporte.net/login”',
      ],
      ameaca: 'phishing', distratores: ['forca_bruta', 'legitimo', 'vazamento'],
      explicacao: 'Urgência, ameaça de bloqueio, remetente com domínio estranho e link para “confirmar a senha” são sinais clássicos de phishing. Empresas sérias não pedem sua senha por e-mail.',
      respostas: [
        { q: 'otima', t: 'Não clicar; abrir o app oficial por conta própria para conferir e denunciar o e-mail como phishing.', f: 'Exatamente! Verificar pelo canal oficial é a forma segura de checar qualquer aviso.' },
        { q: 'parcial', t: 'Abrir o link só para ver a página, sem digitar nada.', f: 'Mesmo sem digitar, abrir links suspeitos pode instalar malware ou confirmar ao golpista que o e-mail está ativo.' },
        { q: 'ruim', t: 'Clicar no link e confirmar a senha para evitar o bloqueio.', f: 'Esse é o objetivo do golpe: a senha iria direto para os criminosos.' },
      ],
      gatilho: { tipo: 'analisados', n: 3, atraso: 6 },
    },
  ],
});
