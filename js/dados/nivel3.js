/* =========================================================
   MISSÃO 3 — Smart Home sob Ataque (difícil)
   ========================================================= */
window.CD = window.CD || {};
CD.NIVEIS = CD.NIVEIS || [];

CD.NIVEIS.push({
  id: 3,
  nome: 'Smart Home sob Ataque',
  local: 'Casa da família Martins',
  dificuldade: 'Difícil',
  tempoAlerta: 60,
  resumo: 'Uma casa totalmente automatizada, ataques em sequência e menos tempo para reagir.',
  historia: 'A família Martins mora em uma casa grande e totalmente automatizada e acredita que ela é “à prova de invasões”. Mas há sinais de que alguém está estudando a casa. Nesta missão os ataques acontecem em sequência e o tempo para responder é menor. Proteja a família antes que seja tarde.',

  planta: {
    comodos: [
      { id: 'garagem', nome: 'Garagem', x: 40, y: 40, w: 240, h: 260, moveis: [
        { t: 'carro', x: 102, y: 94, w: 112, h: 194 },
      ] },
      { id: 'sala', nome: 'Sala de Estar', x: 280, y: 40, w: 400, h: 260, moveis: [
        { t: 'tapete', x: 350, y: 108, w: 130, h: 160 },
        { t: 'rack', x: 290, y: 110, w: 28, h: 150, r: 270 },
        { t: 'mesaCentro', x: 380, y: 150, w: 70, h: 80 },
        { t: 'sofa', x: 500, y: 100, w: 70, h: 170, r: 90 },
        { t: 'planta', x: 636, y: 256, w: 34, h: 34 },
      ] },
      { id: 'cozinha', nome: 'Cozinha', x: 680, y: 40, w: 280, h: 260, moveis: [
        { t: 'bancada', x: 716, y: 48, w: 174, h: 46, fogao: 0.3, pia: 0.76 },
        { t: 'geladeira', x: 896, y: 48, w: 56, h: 64 },
        { t: 'mesa', x: 730, y: 168, w: 160, h: 98 },
      ] },
      { id: 'jardim', nome: 'Jardim', externo: true, x: 40, y: 300, w: 240, h: 280, moveis: [
        { t: 'arvore', x: 58, y: 326, w: 74, h: 74 },
        { t: 'arvore', x: 66, y: 478, w: 84, h: 84 },
        { t: 'piscina', x: 158, y: 380, w: 98, h: 168 },
      ] },
      { id: 'escritorio', nome: 'Escritório', x: 280, y: 300, w: 200, h: 280, moveis: [
        { t: 'escrivaninha', x: 358, y: 308, w: 112, h: 72 },
        { t: 'estante', x: 288, y: 420, w: 30, h: 140, r: 270 },
        { t: 'planta', x: 438, y: 538, w: 32, h: 32 },
      ] },
      { id: 'bebe', nome: 'Quarto do Bebê', x: 480, y: 300, w: 200, h: 280, moveis: [
        { t: 'berco', x: 606, y: 392, w: 64, h: 110 },
        { t: 'tapete', x: 516, y: 392, w: 74, h: 74 },
        { t: 'poltrona', x: 498, y: 482, w: 62, h: 62 },
        { t: 'caixa', x: 604, y: 530, w: 62, h: 40 },
      ] },
      { id: 'suite', nome: 'Suíte', x: 680, y: 300, w: 280, h: 280, moveis: [
        { t: 'cama', x: 788, y: 362, w: 160, h: 160, r: 90 },
        { t: 'criado', x: 914, y: 318, w: 38, h: 30 },
        { t: 'criado', x: 914, y: 532, w: 38, h: 30 },
        { t: 'guarda', x: 712, y: 540, w: 140, h: 32, r: 180 },
      ] },
    ],
    portas: [
      { x: 460, y: 40, l: 70, o: 'h', s: 1, ext: true },      // porta da frente
      { x: 70, y: 40, l: 180, o: 'h', garagem: true },        // portão eletrônico
      { x: 290, y: 300, l: 50, o: 'h', s: 1 },                // sala → escritório
      { x: 492, y: 300, l: 50, o: 'h', s: 1 },                // sala → bebê
      { x: 680, y: 330, l: 50, o: 'v', s: 1 },                // bebê → suíte
      { x: 680, y: 120, l: 80, o: 'v', aberta: true },        // sala ↔ cozinha
      { x: 280, y: 496, l: 60, o: 'v', aberta: true },        // escritório ↔ jardim
      { x: 120, y: 300, l: 70, o: 'h', aberta: true },        // garagem ↔ jardim
    ],
    janelas: [
      { x: 40, y: 120, l: 80, o: 'v' },
      { x: 320, y: 40, l: 90, o: 'h' },
      { x: 580, y: 40, l: 80, o: 'h' },
      { x: 960, y: 130, l: 90, o: 'v' },
      { x: 330, y: 580, l: 80, o: 'h' },
      { x: 520, y: 580, l: 60, o: 'h' },
      { x: 860, y: 580, l: 80, o: 'h' },
      { x: 960, y: 400, l: 80, o: 'v' },
    ],
  },

  dispositivos: [
    {
      id: 'roteador', tipo: 'roteador', nome: 'Roteador Wi-Fi 6', comodo: 'escritorio', x: 386, y: 334,
      modelo: 'NetHome AX6000', ip: '192.168.10.1',
      itens: [
        { r: 'Criptografia do Wi-Fi', v: 'WPA3-Personal', ok: 'WPA3 é o padrão mais atual de criptografia Wi-Fi.' },
        { r: 'WPS', v: 'Ativado · PIN 12345670', vuln: 'wps_ativo' },
        { r: 'Rede para IoT', v: 'Rede separada “Martins_IoT” (VLAN 20)', ok: 'Aparelhos inteligentes isolados dos computadores: excelente.' },
        { r: 'Firmware', v: 'Atualizações automáticas ativadas', ok: 'Atualizado.' },
      ],
    },
    {
      id: 'nas', tipo: 'nas', nome: 'Servidor de Arquivos', comodo: 'escritorio', x: 414, y: 468,
      modelo: 'DataBox 2 (NAS)', ip: '192.168.10.5',
      itens: [
        { r: 'Compartilhamento de arquivos', v: 'SMBv1 · porta 445 aberta para a internet', vuln: 'nas_exposto' },
        { r: 'Backup', v: 'Nenhuma cópia fora do servidor', vuln: 'sem_backup' },
        { r: 'Senha do administrador', v: 'Frase-senha longa + verificação em duas etapas', ok: 'Acesso administrativo bem protegido.' },
        { r: 'Discos', v: '2 × 4 TB espelhados (RAID 1)', ok: 'Espelhar discos protege contra a falha de um disco, mas não substitui o backup (veja o item “Backup”).' },
      ],
    },
    {
      id: 'camera', tipo: 'camera', nome: 'Câmera do Jardim', comodo: 'jardim', x: 256, y: 330,
      modelo: 'VisionCam Outdoor 4K', ip: '192.168.20.24',
      itens: [
        { r: 'Conta na nuvem', v: 'Senha reutilizada de outros sites · sem verificação em duas etapas', vuln: 'sem_2fa',
          desc: 'A conta usa a mesma senha de outros sites e não tem verificação em duas etapas. Se qualquer um desses sites vazar, a câmera fica exposta.' },
        { r: 'Firmware', v: '5.4.1 — mais recente', ok: 'Atualizado.' },
        { r: 'Transmissão', v: 'Criptografada (TLS 1.3)', ok: 'Vídeo criptografado.' },
        { r: 'Visão noturna', v: 'Infravermelho ativado', ok: 'Recurso de imagem, sem relação com segurança digital.' },
      ],
    },
    {
      id: 'portao', tipo: 'portao', nome: 'Portão Eletrônico', comodo: 'garagem', x: 160, y: 66,
      modelo: 'GatePlus 433', ip: 'Rádio 433 MHz + Wi-Fi',
      itens: [
        { r: 'Controle remoto', v: 'Código fixo (433 MHz)', vuln: 'codigo_fixo' },
        { r: 'Abertura pelo aplicativo', v: 'Com verificação em duas etapas e registro de acessos', ok: 'Abertura pelo app bem protegida.' },
        { r: 'Sensor de obstáculo', v: 'Ativado', ok: 'Recurso de segurança física contra acidentes.' },
      ],
    },
    {
      id: 'fechadura', tipo: 'fechadura', nome: 'Fechadura da Porta', comodo: 'sala', x: 442, y: 66,
      modelo: 'SafeLock Pro 2', ip: 'Bluetooth + ponte Wi-Fi',
      itens: [
        { r: 'Conta do aplicativo', v: 'Verificação em duas etapas ativada', ok: 'Conta protegida com 2FA.' },
        { r: 'Limite de tentativas', v: 'Bloqueio de 5 min após 3 erros', ok: 'Protege contra quem tenta adivinhar o PIN.' },
        { r: 'Comunicação', v: 'Bluetooth LE criptografado (AES-128)', ok: 'Comunicação criptografada.' },
        { r: 'Registro de acessos', v: 'Ativado, com notificações', ok: 'A família é avisada de cada abertura.' },
      ],
    },
    {
      id: 'sensor', tipo: 'sensor', nome: 'Sensor da Porta', comodo: 'sala', x: 550, y: 66,
      modelo: 'AbreFecha S3', ip: '192.168.20.33',
      itens: [
        { r: 'Conexão', v: 'Somente Wi-Fi 2,4 GHz · sem conexão de reserva', vuln: 'sem_redundancia' },
        { r: 'Comunicação', v: 'Criptografada (WPA3)', ok: 'Comunicação criptografada.' },
        { r: 'Bateria', v: '64%', ok: 'Informação de funcionamento.' },
      ],
    },
    {
      id: 'baba', tipo: 'baba', nome: 'Babá Eletrônica', comodo: 'bebe', x: 640, y: 342,
      modelo: 'NinaCam Baby', ip: '192.168.20.14',
      itens: [
        { r: 'Compartilhamento', v: 'Link público de visualização ativado', vuln: 'link_publico' },
        { r: 'Transmissão', v: 'HTTP sem criptografia', vuln: 'http_sem_cripto' },
        { r: 'Sensor de choro', v: 'Ativado', ok: 'Função do aparelho, sem risco de segurança.' },
        { r: 'Firmware', v: '3.3.0 — mais recente', ok: 'Atualizado.' },
      ],
    },
    {
      id: 'geladeira', tipo: 'geladeira', nome: 'Geladeira Inteligente', comodo: 'cozinha', x: 924, y: 82,
      modelo: 'FrostLink (2016)', ip: '192.168.10.48',
      itens: [
        { r: 'Suporte do fabricante', v: 'Encerrado em 2021 · sem atualizações de segurança', vuln: 'fim_suporte' },
        { r: 'Rede', v: 'Wi-Fi principal da casa', vuln: 'rede_unica',
          desc: 'A geladeira está na rede principal, junto com notebooks e celulares — mesmo existindo uma rede separada para IoT nesta casa.' },
        { r: 'Tela', v: 'Calendário e lista de compras da família', ok: 'Função do aparelho.' },
      ],
    },
    {
      id: 'assistente', tipo: 'assistente', nome: 'Assistente Virtual', comodo: 'cozinha', x: 810, y: 218,
      modelo: 'Íris Max', ip: '192.168.20.41',
      itens: [
        { r: 'Compras por voz', v: 'Exigem PIN de voz', ok: 'Compras protegidas por PIN.' },
        { r: 'Reconhecimento de voz', v: 'Ativado para os 4 moradores', ok: 'O assistente diferencia as vozes da família.' },
        { r: 'Gravações de voz', v: 'Excluídas automaticamente a cada 3 meses', ok: 'Boa prática de privacidade.' },
        { r: 'Compartilhamento com terceiros', v: 'Desativado', ok: 'Dados não são repassados a parceiros.' },
      ],
    },
    {
      id: 'tv', tipo: 'tv', nome: 'Smart TV', comodo: 'sala', x: 306, y: 185,
      modelo: 'LumaTV 65" 8K', ip: '192.168.20.70',
      itens: [
        { r: 'Instalação de aplicativos', v: 'Fontes desconhecidas permitidas', vuln: 'fontes_desconhecidas' },
        { r: 'Atualizações', v: 'Automáticas', ok: 'Atualizado.' },
        { r: 'Microfone de comando de voz', v: 'Só ativa ao apertar o botão do controle', ok: 'Microfone sob controle do usuário.' },
      ],
    },
    {
      id: 'aspirador', tipo: 'aspirador', nome: 'Aspirador Robô', comodo: 'sala', x: 622, y: 162,
      modelo: 'CleanBot X', ip: '192.168.20.52',
      itens: [
        { r: 'Mapa da casa', v: 'Compartilhado com “parceiros de publicidade”', vuln: 'privacidade_dados',
          desc: 'O aspirador envia a planta da casa (tamanho dos cômodos, móveis e horários de limpeza) para parceiros de publicidade. Esses dados revelam muito sobre a família e sua rotina.' },
        { r: 'Câmera de navegação', v: 'Imagens processadas no próprio aparelho, sem envio', ok: 'As imagens não saem do aparelho.' },
        { r: 'Firmware', v: 'Atualizações automáticas', ok: 'Atualizado.' },
      ],
    },
    {
      id: 'termostato', tipo: 'termostato', nome: 'Termostato da Suíte', comodo: 'suite', x: 704, y: 440,
      modelo: 'Termo+ T7', ip: '192.168.20.60',
      itens: [
        { r: 'Registro de acessos', v: 'Desativado', vuln: 'logs_desativados' },
        { r: 'Senha', v: 'Frase-senha exclusiva', ok: 'Senha forte.' },
        { r: 'Rede', v: 'Rede IoT separada', ok: 'Isolado dos computadores: correto.' },
        { r: 'Firmware', v: '7.1.0 — mais recente', ok: 'Atualizado.' },
      ],
    },
  ],

  alertas: [
    {
      id: 'replay', dispositivo: 'portao', sev: 'alta',
      titulo: 'Portão aberto sem comando',
      resumo: 'O portão abriu às 02h14 sem ninguém usar o controle.',
      evidencias: [
        'Portão › Registro de rádio (433 MHz)',
        '18:30:12  Sinal recebido  código=0xA4F19C  → ABRIR  (controle do morador)',
        '02:14:51  Sinal recebido  código=0xA4F19C  → ABRIR',
        'Nenhum morador usou o controle · câmera: vulto na calçada',
      ],
      ameaca: 'replay', distratores: ['jamming', 'forca_bruta', 'legitimo'],
      explicacao: 'O mesmo código exato foi repetido de madrugada: alguém gravou o sinal do controle e o retransmitiu. É um ataque de repetição (replay), possível porque o controle usa código fixo.',
      respostas: [
        { q: 'otima', t: 'Bloquear a abertura por rádio, travar o portão manualmente e trocar o sistema por um com código rotativo.', f: 'Excelente: você fechou o acesso agora e eliminou a causa do problema.' },
        { q: 'parcial', t: 'Colocar um cadeado no portão à noite, mantendo o mesmo sistema.', f: 'A barreira física ajuda, mas durante o dia o sinal gravado continua abrindo o portão.' },
        { q: 'ruim', t: 'Ignorar: deve ter sido alguma interferência.', f: 'O código idêntico mostra que não foi acaso. Ignorar deixa a casa aberta para o invasor.' },
      ],
      gatilho: { tipo: 'identificado', alvo: 'portao', atraso: 15 },
    },
    {
      id: 'evil-twin', dispositivo: 'roteador', sev: 'alta',
      titulo: 'Rede Wi-Fi gêmea detectada',
      resumo: 'Apareceu uma rede aberta com o mesmo nome do Wi-Fi da casa.',
      evidencias: [
        'Roteador › Varredura de redes próximas',
        'Martins_5G   WPA3    canal 36   (rede da casa)',
        'Martins_5G   ABERTA  canal 6    sinal muito forte ⚠',
        'O celular do Lucas conectou na rede ABERTA às 20:41',
      ],
      ameaca: 'mitm', distratores: ['intruso', 'legitimo', 'jamming'],
      explicacao: 'Uma “rede gêmea” (evil twin) imita o Wi-Fi da casa para que os aparelhos se conectem a ela. O criminoso fica no meio da comunicação (man-in-the-middle) e pode capturar senhas e dados.',
      respostas: [
        { q: 'otima', t: 'Desconectar o celular, “esquecer” a rede aberta e configurar os aparelhos para não entrar em redes abertas automaticamente.', f: 'Correto! Sem vítimas conectadas, a rede falsa não consegue capturar nada.' },
        { q: 'parcial', t: 'Trocar o nome da rede Wi-Fi da casa.', f: 'O atacante pode copiar o novo nome em segundos. O essencial é não conectar em redes abertas desconhecidas.' },
        { q: 'ruim', t: 'Usar a rede aberta, já que o sinal dela é mais forte.', f: 'Sinal forte e rede aberta com nome copiado é justamente a isca do golpe.' },
      ],
      gatilho: { tipo: 'analisados', n: 3, atraso: 8 },
    },
    {
      id: 'senha-vazada', dispositivo: 'camera', sev: 'critica',
      titulo: 'Login de um local desconhecido',
      resumo: 'Alguém entrou na conta da Câmera do Jardim a partir de outro estado.',
      evidencias: [
        'Conta da câmera › Atividade recente',
        '04:02  Login OK · novo dispositivo: Android · Manaus/AM',
        '04:03  Visualização ao vivo iniciada · Câmera do Jardim',
        'Aviso: este e-mail e senha aparecem em um vazamento de dados de 2025',
      ],
      ameaca: 'credenciais', distratores: ['forca_bruta', 'phishing', 'legitimo'],
      explicacao: 'A senha da conta vazou em outro site e foi reutilizada aqui (credential stuffing). Por isso o login deu certo de primeira, sem várias tentativas — diferente de um ataque de força bruta.',
      respostas: [
        { q: 'otima', t: 'Encerrar todas as sessões, trocar a senha por uma exclusiva e ativar a verificação em duas etapas.', f: 'Perfeito: o invasor foi desconectado e não consegue entrar de novo, mesmo com outra senha vazada.' },
        { q: 'parcial', t: 'Trocar apenas a senha.', f: 'Bom passo, mas sessões já abertas podem continuar ativas e, sem 2FA, um novo vazamento repete o problema.' },
        { q: 'ruim', t: 'Esperar para ver se acontece de novo.', f: 'Enquanto você espera, o invasor continua assistindo às câmeras da casa.' },
      ],
      gatilho: { tipo: 'identificado', alvo: 'camera', atraso: 20 },
    },
    {
      id: 'jamming', dispositivo: 'sensor', sev: 'critica',
      titulo: 'Sensores offline ao mesmo tempo',
      resumo: 'O Sensor da Porta e a Câmera do Jardim perderam a conexão no mesmo segundo.',
      evidencias: [
        'Central › Status dos dispositivos',
        '01:30:02  Sensor da Porta   → OFFLINE',
        '01:30:02  Câmera do Jardim  → OFFLINE',
        'Roteador: ruído extremo na faixa de 2,4 GHz · energia da casa: normal',
      ],
      ameaca: 'jamming', distratores: ['legitimo', 'botnet', 'replay'],
      explicacao: 'Dois aparelhos caíram no mesmo segundo, com energia normal e muito ruído no rádio: alguém está bloqueando o sinal sem fio (jamming) para desativar o alarme. É uma forma de negação de serviço.',
      respostas: [
        { q: 'otima', t: 'Tratar como possível invasão: acionar o alarme sonoro e o contato de emergência, verificar com segurança e depois instalar sensores com conexão de reserva.', f: 'Resposta correta: segurança das pessoas primeiro e, depois, um sistema que não depende de um único sinal.' },
        { q: 'parcial', t: 'Reiniciar o roteador e esperar os aparelhos voltarem.', f: 'Reiniciar não resolve interferência proposital — e o alarme ficaria desligado no momento mais crítico.' },
        { q: 'ruim', t: 'Ignorar: deve ser instabilidade da internet.', f: 'A queda simultânea com ruído no rádio é o sinal típico de bloqueio proposital.' },
      ],
      gatilho: { tipo: 'identificado', alvo: 'sensor', atraso: 25 },
    },
    {
      id: 'vazamento', dispositivo: 'baba', sev: 'critica',
      titulo: 'Vídeo enviado a servidor estranho',
      resumo: 'A Babá Eletrônica está transmitindo vídeo para um servidor desconhecido.',
      evidencias: [
        'Roteador › Conexões ativas',
        'baba-eletronica (192.168.20.14) → 198.51.100.23:8554',
        'Fluxo contínuo de vídeo · 2,1 Mbps · há 3 horas',
        'O servidor não pertence ao fabricante · país de destino: desconhecido',
      ],
      ameaca: 'vazamento', distratores: ['legitimo', 'botnet', 'mitm'],
      explicacao: 'As imagens do quarto estão indo para um destino que não é o fabricante: é vazamento de dados (espionagem), facilitado pelo link público e pela transmissão sem criptografia.',
      respostas: [
        { q: 'otima', t: 'Desconectar a câmera, restaurar o padrão de fábrica, desativar o link público, ativar a criptografia e trocar as senhas.', f: 'Excelente: o vazamento parou e as brechas que o permitiram foram fechadas.' },
        { q: 'parcial', t: 'Virar a câmera para a parede até ter tempo de resolver.', f: 'Impede a imagem, mas o áudio e o controle do aparelho continuam com o invasor.' },
        { q: 'ruim', t: 'Manter: o servidor deve ser de algum parceiro do fabricante.', f: 'As evidências mostram que o servidor não pertence ao fabricante. Imagens de uma criança estão sendo expostas.' },
      ],
      gatilho: { tipo: 'identificado', alvo: 'baba', atraso: 15 },
    },
    {
      id: 'pin-errado', dispositivo: 'fechadura', sev: 'baixa',
      titulo: 'Tentativas erradas na fechadura',
      resumo: 'A fechadura registrou 3 PINs incorretos às 19h10.',
      evidencias: [
        'Fechadura › Registro de acessos',
        '19:10:02  PIN incorreto (teclado)',
        '19:10:09  PIN incorreto (teclado)',
        '19:10:15  PIN incorreto (teclado) · teclado bloqueado por 5 min',
        '19:11:30  Aberta pelo app · usuária: Sofia (filha) · celular autorizado',
        'Mensagem da Sofia no grupo da família: “esqueci o PIN novo 😅”',
      ],
      ameaca: 'legitimo', distratores: ['forca_bruta', 'credenciais', 'replay'],
      explicacao: 'Poucas tentativas, seguidas da abertura pelo app de uma usuária autorizada e da confirmação da própria moradora: é um falso alarme. A fechadura fez o certo ao bloquear, registrar e avisar.',
      respostas: [
        { q: 'otima', t: 'Registrar como falso alarme e ajudar a Sofia a guardar o PIN com segurança (por exemplo, em um gerenciador de senhas).', f: 'Ótima leitura das evidências: nada de pânico, só um ajuste de rotina.' },
        { q: 'parcial', t: 'Trocar o PIN de toda a família por precaução.', f: 'Não faz mal, mas era desnecessário: as evidências mostram que foi a própria moradora.' },
        { q: 'ruim', t: 'Desativar o limite de tentativas para isso não acontecer de novo.', f: 'O limite de tentativas protege contra força bruta. Removê-lo enfraqueceria a fechadura.' },
      ],
      gatilho: { tipo: 'identificado', alvo: 'fechadura', atraso: 30 },
    },
  ],
});
