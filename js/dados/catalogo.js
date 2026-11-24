/* =========================================================
   CATÁLOGO DE SEGURANÇA
   - Severidades, categorias e tipos de dispositivo
   - Vulnerabilidades (com as medidas de proteção possíveis)
   - Tipos de ameaça (usados para classificar os alertas)
   Qualidade das medidas:  otima = resolve | parcial = ajuda pouco | ruim = não resolve
   ========================================================= */
window.CD = window.CD || {};

CD.SEVERIDADES = {
  critica: { nome: 'Crítica', peso: 5 },
  alta:    { nome: 'Alta',    peso: 4 },
  media:   { nome: 'Média',   peso: 3 },
  baixa:   { nome: 'Baixa',   peso: 2 },
};

/* Pontos e mitigação de cada tipo de decisão */
CD.QUALIDADES = {
  otima:   { nome: 'Excelente escolha', curto: 'Ótima',      mitiga: 1,   pontos: 100, status: 'good' },
  parcial: { nome: 'Proteção parcial',  curto: 'Parcial',    mitiga: 0.5, pontos: 40,  status: 'warning' },
  ruim:    { nome: 'Escolha inadequada', curto: 'Inadequada', mitiga: 0,   pontos: -30, status: 'critical' },
};

CD.PONTOS = {
  identificar: 10,        // identificar um dispositivo
  acerto: 50,             // marcar corretamente uma configuração vulnerável
  falsoAlarme: -25,       // marcar como vulnerável algo que era seguro
  dispositivoSeguro: 30,  // concluir que um dispositivo seguro está seguro
  dica: -15,              // usar a dica do instrutor
  classificacaoCerta: 60, // reconhecer corretamente o tipo de ameaça
  classificacaoErrada: -20,
  alertaExpirado: -50,    // deixar um alerta sem resposta até o tempo acabar
};

CD.CATEGORIAS = {
  senhas:       { nome: 'Senhas',          icone: 'key' },
  atualizacoes: { nome: 'Atualizações',    icone: 'refresh' },
  rede:         { nome: 'Rede',            icone: 'network' },
  criptografia: { nome: 'Criptografia',    icone: 'lock' },
  autenticacao: { nome: 'Autenticação',    icone: 'shield-check' },
  privacidade:  { nome: 'Privacidade',     icone: 'eye' },
  configuracao: { nome: 'Configuração',    icone: 'settings' },
  ameacas:      { nome: 'Resposta a ameaças', icone: 'alert' },
};

CD.TIPOS_DISPOSITIVO = {
  roteador:   { nome: 'Roteador Wi-Fi',          icone: 'router' },
  camera:     { nome: 'Câmera de segurança',     icone: 'cctv' },
  lampada:    { nome: 'Lâmpadas inteligentes',   icone: 'lightbulb' },
  assistente: { nome: 'Assistente virtual',      icone: 'speaker' },
  sensor:     { nome: 'Sensor de porta',         icone: 'sensor' },
  fechadura:  { nome: 'Fechadura inteligente',   icone: 'lock' },
  termostato: { nome: 'Termostato inteligente',  icone: 'thermometer' },
  tv:         { nome: 'Smart TV',                icone: 'tv' },
  brinquedo:  { nome: 'Brinquedo conectado',     icone: 'bot' },
  baba:       { nome: 'Babá eletrônica',         icone: 'baby' },
  portao:     { nome: 'Portão eletrônico',       icone: 'gate' },
  geladeira:  { nome: 'Geladeira inteligente',   icone: 'fridge' },
  aspirador:  { nome: 'Aspirador robô',          icone: 'vacuum' },
  nas:        { nome: 'Servidor de arquivos',    icone: 'server' },
  tomada:     { nome: 'Tomada inteligente',      icone: 'plug' },
};

/* ---------------------------------------------------------
   VULNERABILIDADES
   --------------------------------------------------------- */
CD.VULNS = {
  senha_padrao: {
    nome: 'Senha padrão de fábrica', sev: 'critica', cat: 'senhas',
    desc: 'O aparelho ainda usa o usuário e a senha que vêm de fábrica. Essas combinações são públicas (estão em manuais e listas na internet) e são as primeiras testadas por robôs de ataque.',
    dica: 'Troque sempre a senha de fábrica por uma senha longa e exclusiva logo na instalação.',
    medidas: [
      { q: 'otima', t: 'Criar uma senha longa e única (12+ caracteres ou uma frase-senha) e guardá-la em um gerenciador de senhas.', f: 'Perfeito! Uma senha longa e exclusiva impede que robôs entrem usando listas de senhas conhecidas.' },
      { q: 'parcial', t: 'Trocar por uma senha curta e fácil de lembrar, como “casa2026”.', f: 'Melhorou, mas senhas curtas e previsíveis são quebradas rapidamente por ataques de dicionário.' },
      { q: 'ruim', t: 'Manter a senha de fábrica, já que o aparelho fica dentro de casa.', f: 'Arriscado! O aparelho fica acessível pela rede e, muitas vezes, pela internet. A botnet Mirai infectou centenas de milhares de aparelhos exatamente assim.' },
    ],
  },
  senha_fraca: {
    nome: 'Senha fraca', sev: 'alta', cat: 'senhas',
    desc: 'A senha é curta ou muito comum (como 123456). Ela está no topo das listas usadas em ataques de força bruta e pode ser descoberta em segundos.',
    dica: 'Use frases-senha longas e diferentes para cada serviço, e ative o bloqueio após tentativas erradas.',
    medidas: [
      { q: 'otima', t: 'Trocar por uma frase-senha longa e exclusiva e ativar o bloqueio após várias tentativas erradas.', f: 'Excelente! Senha forte + limite de tentativas torna a força bruta praticamente inviável.' },
      { q: 'parcial', t: 'Acrescentar um número no final da senha atual (123456 → 1234567).', f: 'Pequenas variações de senhas comuns também estão nas listas de ataque. Ajuda muito pouco.' },
      { q: 'ruim', t: 'Usar a mesma senha do e-mail, que é mais “forte”.', f: 'Reutilizar senhas é perigoso: se um serviço vazar, todos os outros ficam expostos.' },
    ],
  },
  firmware_desatualizado: {
    nome: 'Firmware desatualizado', sev: 'alta', cat: 'atualizacoes',
    desc: 'O software interno (firmware) está várias versões atrás. As versões novas corrigem falhas de segurança já conhecidas — e públicas — que os criminosos sabem explorar.',
    dica: 'Mantenha as atualizações automáticas ligadas e atualize só por fontes oficiais.',
    medidas: [
      { q: 'otima', t: 'Atualizar pelo aplicativo ou site oficial do fabricante e ativar as atualizações automáticas.', f: 'Ótimo! As falhas conhecidas foram corrigidas e as próximas correções chegarão sozinhas.' },
      { q: 'parcial', t: 'Atualizar agora, mas deixar as atualizações automáticas desligadas.', f: 'Resolve hoje, mas novas falhas surgem o tempo todo. Sem atualização automática, o aparelho volta a ficar desatualizado.' },
      { q: 'ruim', t: 'Baixar um firmware “turbinado” de um fórum, que promete mais recursos.', f: 'Firmware não oficial pode conter malware. Use sempre a fonte oficial do fabricante.' },
    ],
  },
  telnet_aberto: {
    nome: 'Serviço Telnet exposto', sev: 'critica', cat: 'rede',
    desc: 'O Telnet é um serviço antigo de acesso remoto que envia tudo sem criptografia, inclusive a senha. Robôs varrem a internet procurando a porta 23 aberta para invadir aparelhos.',
    dica: 'Desative serviços e portas que você não usa: cada porta aberta é uma porta de entrada.',
    medidas: [
      { q: 'otima', t: 'Desativar o Telnet e todos os serviços que não são usados; acessar só pelo app oficial.', f: 'Correto! Menos serviços expostos significa menos portas de entrada para invasores.' },
      { q: 'parcial', t: 'Mudar o Telnet da porta 23 para a porta 2323.', f: 'Isso é “segurança por obscuridade”: scanners verificam todas as portas — a própria Mirai testava a 2323.' },
      { q: 'ruim', t: 'Deixar o Telnet aberto para o técnico poder acessar quando precisar.', f: 'Se o técnico consegue entrar, qualquer robô na internet também tenta — e sem criptografia.' },
    ],
  },
  upnp: {
    nome: 'UPnP ativado no roteador', sev: 'media', cat: 'rede',
    desc: 'Com o UPnP ligado, qualquer aparelho da rede pode abrir portas no roteador sozinho, expondo serviços internos à internet sem você perceber.',
    dica: 'Desative o UPnP e libere portas manualmente somente quando for realmente necessário.',
    medidas: [
      { q: 'otima', t: 'Desativar o UPnP e liberar manualmente apenas o que for realmente necessário.', f: 'Isso mesmo! Agora nenhum aparelho abre portas para a internet sem a sua autorização.' },
      { q: 'parcial', t: 'Deixar ativado, mas conferir a lista de portas abertas uma vez por ano.', f: 'Conferir ajuda, mas um aparelho infectado pode abrir portas a qualquer momento entre uma verificação e outra.' },
      { q: 'ruim', t: 'Ativar também a DMZ, para os dispositivos “funcionarem melhor”.', f: 'A DMZ expõe totalmente um aparelho à internet — é o oposto de proteger.' },
    ],
  },
  wifi_wep: {
    nome: 'Criptografia Wi-Fi obsoleta (WEP)', sev: 'critica', cat: 'criptografia',
    desc: 'O WEP é um padrão de 1999 que pode ser quebrado em minutos com ferramentas gratuitas. Quem quebrar a criptografia entra na rede e enxerga todos os dispositivos.',
    dica: 'Use WPA3 (ou WPA2-AES, se algum aparelho não suportar) com uma senha longa.',
    medidas: [
      { q: 'otima', t: 'Configurar o Wi-Fi com WPA3 (ou WPA2-AES, se algum aparelho não suportar) e uma senha longa.', f: 'Excelente! WPA3/WPA2-AES com senha longa protege a rede contra a quebra de criptografia.' },
      { q: 'parcial', t: 'Ocultar o nome da rede (SSID).', f: 'Redes ocultas continuam visíveis para ferramentas de análise. Não substitui uma criptografia forte.' },
      { q: 'ruim', t: 'Manter o WEP, pois todos os aparelhos já estão conectados.', f: 'O WEP é quebrado em minutos. Manter a rede assim deixa a casa inteira exposta.' },
    ],
  },
  wps_ativo: {
    nome: 'WPS ativado', sev: 'media', cat: 'rede',
    desc: 'O WPS permite entrar no Wi-Fi digitando um PIN de 8 dígitos. Por uma falha do próprio protocolo, esse PIN pode ser descoberto por força bruta em poucas horas — e muitos roteadores usam PINs padrão.',
    dica: 'Desative o WPS e conecte novos aparelhos digitando a senha do Wi-Fi.',
    medidas: [
      { q: 'otima', t: 'Desativar o WPS e conectar novos aparelhos digitando a senha do Wi-Fi.', f: 'Certo! Sem WPS, o atalho vulnerável deixa de existir.' },
      { q: 'parcial', t: 'Deixar o WPS ligado apenas nos fins de semana.', f: 'Reduz o tempo de exposição, mas o PIN continua podendo ser quebrado enquanto estiver ligado.' },
      { q: 'ruim', t: 'Colar o PIN do WPS do lado de fora do roteador para as visitas.', f: 'Isso entrega a chave da rede para qualquer pessoa que passar pelo roteador.' },
    ],
  },
  rede_unica: {
    nome: 'Sem separação de rede', sev: 'media', cat: 'rede',
    desc: 'O dispositivo inteligente está na mesma rede dos computadores e celulares. Se ele for invadido, o criminoso pode “pular” para os aparelhos com dados pessoais.',
    dica: 'Crie uma rede só para IoT (rede de convidados ou VLAN), separada dos computadores e celulares.',
    medidas: [
      { q: 'otima', t: 'Criar uma rede separada para IoT (rede de convidados ou VLAN) e mover os dispositivos inteligentes para ela.', f: 'Ótima decisão! Mesmo que um aparelho IoT seja invadido, o ataque fica isolado da rede principal.' },
      { q: 'parcial', t: 'Desligar o aparelho da tomada quando ele não estiver em uso.', f: 'Reduz o tempo de exposição, mas, quando ligado, ele continua na mesma rede dos seus dados pessoais.' },
      { q: 'ruim', t: 'Passar a senha do Wi-Fi principal para visitas, para facilitar.', f: 'Isso só aumenta o número de aparelhos desconhecidos na rede principal.' },
    ],
  },
  sem_2fa: {
    nome: 'Conta sem verificação em duas etapas', sev: 'alta', cat: 'autenticacao',
    desc: 'A conta do aplicativo que controla o dispositivo depende só da senha. Se ela vazar, qualquer pessoa pode controlar o aparelho de qualquer lugar do mundo.',
    dica: 'Ative a verificação em duas etapas (2FA) em todas as contas de dispositivos inteligentes.',
    medidas: [
      { q: 'otima', t: 'Ativar a verificação em duas etapas (2FA) com um aplicativo autenticador.', f: 'Perfeito! Mesmo que a senha vaze, o invasor não terá o segundo fator.' },
      { q: 'parcial', t: 'Trocar a senha toda semana.', f: 'Trocas frequentes ajudam pouco se a senha vazar; o segundo fator é o que impede o acesso.' },
      { q: 'ruim', t: 'Compartilhar o mesmo login com toda a família e amigos.', f: 'Quanto mais pessoas usam a mesma senha, maior a chance de ela vazar — e não dá para saber quem fez o quê.' },
    ],
  },
  compras_voz: {
    nome: 'Compras por voz sem confirmação', sev: 'media', cat: 'configuracao',
    desc: 'O assistente aceita compras por comando de voz sem pedir um código. Qualquer voz — de uma visita, de uma criança ou até da TV — pode fazer pedidos.',
    dica: 'Exija PIN de voz para compras e ative o reconhecimento de voz dos moradores.',
    medidas: [
      { q: 'otima', t: 'Exigir um PIN de voz para compras e ativar o reconhecimento de voz dos moradores.', f: 'Isso mesmo! Agora só quem sabe o PIN consegue comprar.' },
      { q: 'parcial', t: 'Diminuir a sensibilidade do microfone.', f: 'Reduz ativações acidentais, mas não impede que alguém faça um pedido falando perto do aparelho.' },
      { q: 'ruim', t: 'Deixar como está — é mais prático comprar sem senha.', f: 'Praticidade sem controle: qualquer voz (ou gravação) pode gastar o seu dinheiro.' },
    ],
  },
  privacidade_dados: {
    nome: 'Compartilhamento de dados com terceiros', sev: 'baixa', cat: 'privacidade',
    desc: 'O dispositivo envia gravações ou dados de uso para “parceiros comerciais”, expondo a rotina da família. A LGPD garante o direito de saber e de recusar esse compartilhamento.',
    dica: 'Revise as permissões de privacidade e recuse o compartilhamento de dados com terceiros.',
    medidas: [
      { q: 'otima', t: 'Desativar o compartilhamento com terceiros e revisar as permissões de privacidade no app.', f: 'Correto! Você reduziu os dados pessoais expostos e exerceu um direito garantido pela LGPD.' },
      { q: 'parcial', t: 'Apagar o histórico uma vez por mês, mas manter o compartilhamento ligado.', f: 'Apagar o histórico local não recupera o que já foi enviado aos parceiros.' },
      { q: 'ruim', t: 'Aceitar tudo — quem não deve, não teme.', f: 'Privacidade não é esconder algo errado: dados da rotina da casa podem ser usados por criminosos (por exemplo, para saber quando ela fica vazia).' },
    ],
  },
  http_sem_cripto: {
    nome: 'Comunicação sem criptografia (HTTP)', sev: 'alta', cat: 'criptografia',
    desc: 'O aparelho transmite dados por HTTP, sem criptografia. Quem estiver na mesma rede consegue capturar senhas, imagens e comandos em texto puro.',
    dica: 'Prefira sempre conexões criptografadas (HTTPS/TLS) e apps oficiais.',
    medidas: [
      { q: 'otima', t: 'Ativar a transmissão criptografada (HTTPS/TLS) nas configurações e trocar a senha.', f: 'Excelente! Com criptografia, quem interceptar o tráfego vê apenas dados embaralhados.' },
      { q: 'parcial', t: 'Acessar o aparelho apenas pelo celular.', f: 'O tipo de aparelho usado não importa: sem criptografia, os dados continuam trafegando em texto puro.' },
      { q: 'ruim', t: 'Trocar o nome do dispositivo para algo discreto.', f: 'O nome não protege o conteúdo transmitido. Os dados continuam legíveis para quem interceptar.' },
    ],
  },
  bluetooth_aberto: {
    nome: 'Bluetooth aberto sem PIN', sev: 'alta', cat: 'configuracao',
    desc: 'O aparelho fica sempre visível no Bluetooth e aceita conexão sem PIN. Qualquer pessoa por perto pode se conectar, ouvir pelo microfone ou enviar áudio.',
    dica: 'Exija PIN no pareamento Bluetooth e desligue a visibilidade depois de configurar.',
    medidas: [
      { q: 'otima', t: 'Exigir PIN no pareamento e desligar a visibilidade do Bluetooth depois de configurar.', f: 'Ótimo! Agora só aparelhos autorizados conseguem se conectar.' },
      { q: 'parcial', t: 'Mudar o nome do brinquedo no Bluetooth.', f: 'Um nome diferente não impede a conexão: sem PIN, qualquer pessoa próxima ainda consegue parear.' },
      { q: 'ruim', t: 'Deixar o Bluetooth sempre visível, para facilitar a conexão de novos celulares.', f: 'Facilita para você e para qualquer estranho que esteja perto da casa.' },
    ],
  },
  codigo_fixo: {
    nome: 'Controle remoto com código fixo', sev: 'alta', cat: 'criptografia',
    desc: 'O controle envia sempre o mesmo código de rádio. Um criminoso pode gravar o sinal com um equipamento barato e repeti-lo depois para abrir o portão.',
    dica: 'Use controles com código rotativo (rolling code) e criptografia.',
    medidas: [
      { q: 'otima', t: 'Trocar o receptor e os controles por um sistema com código rotativo (rolling code) criptografado.', f: 'Correto! Com código rotativo, cada sinal só vale uma vez — gravar e repetir não funciona.' },
      { q: 'parcial', t: 'Usar o controle só quando estiver bem perto do portão.', f: 'Diminui o alcance, mas o sinal ainda pode ser gravado por alguém por perto.' },
      { q: 'ruim', t: 'Manter como está, porque ninguém sabe a frequência do portão.', f: 'As frequências usadas são padronizadas e fáceis de descobrir. Isso não é proteção.' },
    ],
  },
  fim_suporte: {
    nome: 'Aparelho sem suporte do fabricante', sev: 'alta', cat: 'atualizacoes',
    desc: 'O fabricante encerrou o suporte deste modelo: ele não recebe mais correções de segurança. Toda falha nova que for descoberta ficará aberta para sempre.',
    dica: 'Isole aparelhos sem suporte em uma rede separada e planeje a substituição.',
    medidas: [
      { q: 'otima', t: 'Isolar o aparelho em uma rede separada agora e planejar a troca por um modelo com suporte.', f: 'Decisão madura! O isolamento reduz o risco até a substituição.' },
      { q: 'parcial', t: 'Desligar o Wi-Fi do aparelho só quando viajar.', f: 'Ajuda em alguns dias, mas no resto do tempo o aparelho segue vulnerável e na rede principal.' },
      { q: 'ruim', t: 'Continuar usando normalmente: se funciona, está seguro.', f: 'Funcionar não é o mesmo que estar seguro. Sem correções, as falhas se acumulam.' },
    ],
  },
  link_publico: {
    nome: 'Transmissão com link público', sev: 'critica', cat: 'privacidade',
    desc: 'A câmera tem um link de visualização pública ativado: qualquer pessoa com o endereço pode assistir às imagens ao vivo — e esses links acabam repassados ou indexados na internet.',
    dica: 'Nunca deixe câmeras com link público; compartilhe só com contas convidadas.',
    medidas: [
      { q: 'otima', t: 'Desativar o link público e compartilhar o acesso apenas com contas convidadas (com 2FA).', f: 'Perfeito! Agora só pessoas autorizadas, com login, podem ver as imagens.' },
      { q: 'parcial', t: 'Gerar um novo link público a cada mês.', f: 'Trocar o link reduz o tempo de exposição, mas durante o mês qualquer pessoa com o link continua vendo tudo.' },
      { q: 'ruim', t: 'Mandar o link no grupo da família, para todos poderem ver o bebê.', f: 'Mensagens são encaminhadas e o link pode chegar a estranhos. Imagens de crianças exigem cuidado redobrado.' },
    ],
  },
  nas_exposto: {
    nome: 'Arquivos expostos na internet (SMBv1)', sev: 'critica', cat: 'rede',
    desc: 'O servidor de arquivos usa o protocolo SMBv1 — explorado pelo ransomware WannaCry em 2017 — e está acessível pela internet. Fotos e documentos da família podem ser sequestrados.',
    dica: 'Não exponha compartilhamentos de arquivos na internet; use VPN e protocolos atualizados.',
    medidas: [
      { q: 'otima', t: 'Desativar o SMBv1, fechar a porta 445 para a internet e usar VPN para acessar de fora.', f: 'Excelente! O servidor deixou de ser alcançável por ataques automatizados da internet.' },
      { q: 'parcial', t: 'Trocar a senha do servidor, mas manter o acesso pela internet.', f: 'Ajuda contra adivinhação de senha, mas o SMBv1 tem falhas que não dependem da senha.' },
      { q: 'ruim', t: 'Deixar como está, porque o antivírus do notebook protege a rede toda.', f: 'O antivírus do notebook não protege outro aparelho da rede.' },
    ],
  },
  sem_backup: {
    nome: 'Sem cópia de segurança (backup)', sev: 'media', cat: 'configuracao',
    desc: 'Não existe nenhuma cópia dos arquivos fora do servidor. Se um ransomware criptografar os dados ou o disco falhar, as fotos e documentos da família serão perdidos.',
    dica: 'Siga a regra 3-2-1: 3 cópias, em 2 mídias diferentes, 1 delas fora de casa ou desconectada.',
    medidas: [
      { q: 'otima', t: 'Configurar backup automático na regra 3-2-1 (3 cópias, 2 mídias, 1 fora de casa ou offline).', f: 'Ótimo! Mesmo com um ransomware, a família consegue recuperar os arquivos.' },
      { q: 'parcial', t: 'Copiar as fotos para um pen drive quando lembrar.', f: 'Melhor do que nada, mas backups manuais e esporádicos quase sempre estão desatualizados.' },
      { q: 'ruim', t: 'Confiar que o servidor nunca vai falhar.', f: 'Todo disco um dia falha — e o ransomware não avisa antes.' },
    ],
  },
  fontes_desconhecidas: {
    nome: 'Apps de fontes desconhecidas', sev: 'media', cat: 'configuracao',
    desc: 'A TV permite instalar aplicativos baixados fora da loja oficial. Apps piratas são uma forma muito comum de espalhar malware.',
    dica: 'Instale aplicativos apenas pela loja oficial do fabricante.',
    medidas: [
      { q: 'otima', t: 'Desativar as fontes desconhecidas e instalar apps só pela loja oficial.', f: 'Correto! A loja oficial verifica os aplicativos antes de publicá-los.' },
      { q: 'parcial', t: 'Instalar apps de fora só se tiverem boas avaliações em fóruns.', f: 'Avaliações em fóruns podem ser falsas. O risco de malware continua.' },
      { q: 'ruim', t: 'Baixar um app “premium grátis” para assistir a filmes pagos.', f: 'Apps piratas são a isca preferida para instalar malware.' },
    ],
  },
  logs_desativados: {
    nome: 'Registro de eventos desativado', sev: 'baixa', cat: 'configuracao',
    desc: 'Sem registros (logs) e notificações de acesso, é impossível saber se alguém entrou no dispositivo ou quando isso aconteceu.',
    dica: 'Ative registros de acesso e notificações de login nos dispositivos.',
    medidas: [
      { q: 'otima', t: 'Ativar os registros de acesso e as notificações de login no app.', f: 'Isso mesmo! Agora qualquer acesso estranho gera um aviso.' },
      { q: 'parcial', t: 'Conferir o aparelho manualmente uma vez por mês.', f: 'Uma invasão pode durar semanas até ser percebida dessa forma.' },
      { q: 'ruim', t: 'Manter desativado para economizar memória.', f: 'Os registros ocupam pouco espaço e são essenciais para detectar invasões.' },
    ],
  },
  sem_redundancia: {
    nome: 'Sem conexão de reserva', sev: 'media', cat: 'rede',
    desc: 'O sensor depende só do Wi-Fi de 2,4 GHz. Se o sinal for bloqueado de propósito (jamming) ou cair, ele fica mudo e o alarme não dispara.',
    dica: 'Use centrais com conexão de reserva e alerta de perda de comunicação.',
    medidas: [
      { q: 'otima', t: 'Usar uma central com conexão de reserva (cabo ou rede celular) e alarme de “perda de comunicação”.', f: 'Excelente! Se o sinal cair, você será avisado e o sistema continua funcionando.' },
      { q: 'parcial', t: 'Colocar o roteador mais perto do sensor.', f: 'Melhora o sinal, mas não resolve um bloqueio proposital nem uma queda do roteador.' },
      { q: 'ruim', t: 'Desligar o aviso de “sensor offline”, porque ele dispara à toa.', f: 'Esse aviso é justamente o que denuncia uma tentativa de bloquear o alarme.' },
    ],
  },
  painel_sem_senha: {
    nome: 'Painel de controle sem senha', sev: 'critica', cat: 'autenticacao',
    desc: 'Qualquer pessoa conectada à rede consegue abrir o painel do aparelho e mudar as configurações, sem precisar de senha.',
    dica: 'Todo painel de administração deve exigir senha forte.',
    medidas: [
      { q: 'otima', t: 'Ativar a autenticação no painel com uma senha forte e exclusiva.', f: 'Correto! Agora só quem tem a senha pode alterar as configurações.' },
      { q: 'parcial', t: 'Esconder o painel mudando a porta de acesso.', f: 'Mudar a porta não impede o acesso: ferramentas simples encontram o painel em segundos.' },
      { q: 'ruim', t: 'Manter sem senha, porque só a família usa o Wi-Fi.', f: 'Visitas, aparelhos infectados ou invasores do Wi-Fi também estariam “dentro de casa”.' },
    ],
  },
};

/* ---------------------------------------------------------
   TIPOS DE AMEAÇA (para reconhecer nos alertas)
   --------------------------------------------------------- */
CD.AMEACAS = {
  forca_bruta: { nome: 'Ataque de força bruta', icone: 'key', desc: 'Robôs testam automaticamente milhares de combinações de usuário e senha até acertar.' },
  botnet:      { nome: 'Infecção por malware (botnet)', icone: 'bug', desc: 'O aparelho foi infectado e passou a obedecer criminosos, sendo usado para atacar outros sistemas (DDoS) ou procurar novas vítimas.' },
  phishing:    { nome: 'Phishing (engenharia social)', icone: 'mail', desc: 'Mensagens falsas, geralmente com urgência ou ameaça, que tentam enganar a pessoa para roubar senhas ou instalar malware.' },
  mitm:        { nome: 'Interceptação (rede falsa / man-in-the-middle)', icone: 'wifi', desc: 'O criminoso se coloca no meio da comunicação — por exemplo, com uma rede Wi-Fi falsa — para espionar ou alterar dados.' },
  replay:      { nome: 'Ataque de repetição (replay)', icone: 'radio', desc: 'Um sinal legítimo é gravado e retransmitido depois para repetir a ação, como abrir um portão.' },
  credenciais: { nome: 'Acesso com senha vazada', icone: 'user', desc: 'Alguém entra na conta usando uma senha que vazou de outro site (credential stuffing). O login funciona de primeira.' },
  intruso:     { nome: 'Dispositivo intruso na rede', icone: 'network', desc: 'Um aparelho desconhecido conseguiu entrar na rede da casa e pode espionar ou atacar outros dispositivos.' },
  voz:         { nome: 'Comando de voz não autorizado', icone: 'mic', desc: 'O assistente obedeceu a uma voz que não é de um morador — de uma visita, de uma gravação ou da TV.' },
  jamming:     { nome: 'Bloqueio de sinal (jamming)', icone: 'zap', desc: 'Interferência proposital nas frequências sem fio para derrubar sensores e câmeras, uma forma de negação de serviço.' },
  vazamento:   { nome: 'Vazamento de dados (espionagem)', icone: 'eye', desc: 'Dados pessoais, imagens ou áudios estão sendo enviados para quem não deveria ter acesso a eles.' },
  legitimo:    { nome: 'Atividade legítima (falso alarme)', icone: 'shield-check', desc: 'O evento parece suspeito, mas as evidências mostram que é uma ação normal e autorizada. Nem todo alerta é um ataque!' },
};
