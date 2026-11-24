/* =========================================================
   CONQUISTAS, NÍVEIS DE PROTEÇÃO E CONTEÚDOS EDUCATIVOS
   ========================================================= */
window.CD = window.CD || {};

/* Faixas do nível de proteção final (pela % de segurança) */
CD.NIVEIS_PROTECAO = [
  { min: 90, nome: 'Fortaleza Digital', status: 'good', icone: 'shield-check',
    desc: 'A casa está muito bem protegida. Os riscos que sobraram são mínimos.' },
  { min: 70, nome: 'Protegida, com ressalvas', status: 'warning', icone: 'shield',
    desc: 'A maior parte dos riscos foi tratada, mas ainda há pontos de atenção.' },
  { min: 50, nome: 'Parcialmente protegida', status: 'serious', icone: 'shield-alert',
    desc: 'Vários riscos continuam abertos. Um invasor ainda teria caminhos para entrar.' },
  { min: 0, nome: 'Vulnerável', status: 'critical', icone: 'shield-x',
    desc: 'A casa continua exposta a ataques. Revise as recomendações e tente de novo.' },
];

CD.nivelProtecao = function (pct) {
  return CD.NIVEIS_PROTECAO.find(function (n) { return pct >= n.min; });
};

CD.CONQUISTAS = [
  { id: 'primeiro_escudo', nome: 'Primeiro Escudo', icone: 'shield', desc: 'Conclua a sua primeira missão.' },
  { id: 'detetive', nome: 'Detetive Digital', icone: 'search', desc: 'Encontre todas as vulnerabilidades de uma missão sem deixar passar nenhuma.' },
  { id: 'olhar_clinico', nome: 'Olhar Clínico', icone: 'eye', desc: 'Conclua uma missão sem nenhum falso alarme (sem marcar itens seguros como vulneráveis).' },
  { id: 'cacador', nome: 'Caçador de Ameaças', icone: 'target', desc: 'Reconheça corretamente todas as ameaças de uma missão.' },
  { id: 'resposta_rapida', nome: 'Resposta Rápida', icone: 'zap', desc: 'Resolva um alerta em menos de 20 segundos depois que ele aparecer.' },
  { id: 'nem_tudo_ataque', nome: 'Nem Tudo É Ataque', icone: 'info', desc: 'Reconheça corretamente um falso alarme.' },
  { id: 'fortaleza', nome: 'Fortaleza Digital', icone: 'shield-check', desc: 'Termine uma missão com 100% de segurança.' },
  { id: 'explorador', nome: 'Explorador', icone: 'map', desc: 'Explore todos os cômodos de uma casa, inclusive os que não têm dispositivos.' },
  { id: 'autodidata', nome: 'Autodidata', icone: 'graduation', desc: 'Conclua uma missão sem usar nenhuma dica.' },
  { id: 'nenhum_esquecido', nome: 'Nenhum Alerta Esquecido', icone: 'timer', desc: 'Conclua uma missão com tempo limite sem deixar nenhum alerta expirar.' },
  { id: 'tres_estrelas', nome: 'Três Estrelas', icone: 'star', desc: 'Conquiste 3 estrelas em uma missão.' },
  { id: 'cyber_defensor', nome: 'Cyber Defensor', icone: 'trophy', desc: 'Conclua as três missões.' },
  { id: 'mestre', nome: 'Mestre da Cibersegurança', icone: 'award', desc: 'Conquiste 3 estrelas em todas as missões.' },
  { id: 'estudioso', nome: 'Estudioso', icone: 'book', desc: 'Leia todos os conteúdos da biblioteca.' },
];

/* Recomendações gerais por categoria (usadas no relatório) */
CD.RECOMENDACOES = {
  senhas: 'Revise as senhas da casa: nenhuma senha de fábrica, frases-senha longas e diferentes para cada aparelho, guardadas em um gerenciador de senhas.',
  atualizacoes: 'Ative as atualizações automáticas, atualize só por fontes oficiais e substitua aparelhos que não recebem mais suporte.',
  rede: 'Feche portas e serviços que não usa (Telnet, UPnP, WPS) e coloque os aparelhos inteligentes em uma rede separada.',
  criptografia: 'Prefira sempre comunicação criptografada: WPA3 ou WPA2-AES no Wi-Fi, HTTPS/TLS nos aparelhos e controles com código rotativo.',
  autenticacao: 'Ative a verificação em duas etapas em todas as contas que controlam dispositivos e exija senha em todos os painéis.',
  privacidade: 'Revise as permissões de privacidade, desative o compartilhamento de dados com terceiros e nunca deixe câmeras com link público.',
  configuracao: 'Revise as configurações de fábrica: elas costumam priorizar a praticidade, e não a segurança.',
  ameacas: 'Diante de um alerta, leia as evidências com calma, classifique a ameaça e trate a causa — nunca desligue os avisos para “resolver”.',
};

/* Biblioteca de conteúdos */
CD.CONTEUDOS = [
  {
    id: 'iot', titulo: 'O que é IoT e por que ela vira alvo', icone: 'cpu',
    resumo: 'Entenda o que são os dispositivos conectados e por que atraem criminosos.',
    corpo: `
      <p><strong>Internet das Coisas</strong> (IoT, do inglês <em>Internet of Things</em>) é o nome dado aos objetos do dia a dia que se conectam à internet: câmeras, lâmpadas, fechaduras, assistentes de voz, TVs, sensores e até geladeiras.</p>
      <h4>Por que esses aparelhos viram alvo?</h4>
      <ul>
        <li>Ficam ligados 24 horas por dia e quase nunca são verificados.</li>
        <li>Muitos saem de fábrica com senhas padrão e serviços desnecessários ativados.</li>
        <li>Recebem poucas atualizações — e alguns deixam de recebê-las depois de poucos anos.</li>
        <li>Têm sensores (câmera, microfone, localização) que revelam a rotina da família.</li>
        <li>Um aparelho invadido pode ser a porta de entrada para o resto da rede.</li>
      </ul>
      <p class="curiosidade"><strong>Você sabia?</strong> Em um caso relatado em 2018 pela empresa de segurança Darktrace, criminosos acessaram a rede de um cassino por meio do termômetro inteligente de um aquário.</p>`,
  },
  {
    id: 'senhas', titulo: 'Senhas fortes e o perigo das senhas de fábrica', icone: 'key',
    resumo: 'Como criar senhas seguras e a diferença entre força bruta e senha vazada.',
    corpo: `
      <p>Senhas de fábrica (como <code>admin/admin</code>) são públicas: estão nos manuais e em listas na internet. Robôs testam essas combinações em milhões de aparelhos todos os dias.</p>
      <h4>Como criar uma senha forte</h4>
      <ul>
        <li>Use <strong>frases-senha</strong> longas, como <code>girassol-trem-azul-pipoca-42</code>.</li>
        <li>Pelo menos 12 caracteres: quanto mais longa, melhor.</li>
        <li>Uma senha <strong>diferente</strong> para cada serviço ou aparelho.</li>
        <li>Guarde tudo em um <strong>gerenciador de senhas</strong>.</li>
        <li>Ative o bloqueio após várias tentativas erradas.</li>
      </ul>
      <h4>Força bruta × senha vazada</h4>
      <p>Na <strong>força bruta</strong>, o robô tenta milhares de senhas até acertar — o registro mostra muitas falhas de login. No uso de <strong>senha vazada</strong> (<em>credential stuffing</em>), o criminoso já tem a senha certa, vazada de outro site: o login funciona de primeira.</p>`,
  },
  {
    id: 'atualizacoes', titulo: 'Atualizações de firmware', icone: 'refresh',
    resumo: 'Por que atualizar é uma das proteções mais importantes.',
    corpo: `
      <p>O <strong>firmware</strong> é o software interno do aparelho. Quando uma falha é descoberta, o fabricante publica uma correção. A partir daí a falha fica conhecida — inclusive pelos criminosos — e quem não atualiza continua vulnerável.</p>
      <h4>Boas práticas</h4>
      <ul>
        <li>Ative as atualizações automáticas.</li>
        <li>Atualize só por fontes oficiais (app ou site do fabricante).</li>
        <li>Antes de comprar, verifique por quanto tempo o fabricante promete atualizações.</li>
        <li>Aparelhos sem suporte devem ser isolados em outra rede e substituídos.</li>
      </ul>
      <p class="curiosidade"><strong>Atenção:</strong> firmwares “modificados” ou “turbinados” baixados de fóruns podem conter malware.</p>`,
  },
  {
    id: 'wifi', titulo: 'Wi-Fi seguro e criptografia', icone: 'wifi',
    resumo: 'WEP, WPA2, WPA3, HTTPS: o que cada sigla significa na prática.',
    corpo: `
      <p>A <strong>criptografia</strong> embaralha os dados para que só quem tem a chave consiga lê-los.</p>
      <h4>Padrões de Wi-Fi</h4>
      <ul>
        <li><strong>WEP</strong> (1999): quebrado em minutos. Não use.</li>
        <li><strong>WPA/TKIP</strong>: obsoleto.</li>
        <li><strong>WPA2-AES</strong>: seguro, desde que a senha seja longa.</li>
        <li><strong>WPA3</strong>: o mais atual e recomendado.</li>
      </ul>
      <p>No roteador, também desative o <strong>WPS</strong> e o <strong>UPnP</strong>, troque a senha do painel e mantenha o firmware em dia. Ocultar o nome da rede (SSID) não protege de verdade.</p>
      <h4>HTTP × HTTPS</h4>
      <p>Em <strong>HTTP</strong>, os dados viajam em texto puro: quem estiver na mesma rede pode ler senhas e imagens. Em <strong>HTTPS/TLS</strong>, tudo vai criptografado.</p>`,
  },
  {
    id: '2fa', titulo: 'Verificação em duas etapas (2FA)', icone: 'smartphone',
    resumo: 'A camada extra que protege a conta mesmo quando a senha vaza.',
    corpo: `
      <p>A verificação em duas etapas pede <strong>algo que você sabe</strong> (a senha) e <strong>algo que você tem</strong> (um código no celular, um app autenticador ou uma chave de segurança).</p>
      <ul>
        <li>Mesmo que a senha vaze, o invasor não entra sem o segundo fator.</li>
        <li>Prefira apps autenticadores ou chaves físicas: o SMS pode ser desviado em golpes de troca de chip (<em>SIM swap</em>).</li>
        <li>Ative o 2FA nas contas de câmeras, fechaduras e alarmes — e no e-mail, que é a chave para recuperar todas as outras contas.</li>
      </ul>`,
  },
  {
    id: 'segmentacao', titulo: 'Separar a rede: IoT de um lado, computadores do outro', icone: 'network',
    resumo: 'Como isolar os aparelhos inteligentes para conter um ataque.',
    corpo: `
      <p>Separar a rede é como ter cômodos com portas trancadas: se um aparelho IoT for invadido, o criminoso não alcança os computadores e celulares com dados pessoais.</p>
      <h4>Como fazer em casa</h4>
      <ul>
        <li>Use a <strong>rede de convidados</strong> do roteador para os aparelhos inteligentes.</li>
        <li>Em roteadores avançados, crie uma <strong>VLAN</strong> só para IoT.</li>
        <li>Mantenha computadores e celulares na rede principal.</li>
        <li>Aparelhos antigos ou sem suporte devem ficar sempre na rede isolada.</li>
      </ul>`,
  },
  {
    id: 'phishing', titulo: 'Phishing e engenharia social', icone: 'mail',
    resumo: 'Como reconhecer mensagens falsas que tentam roubar seus dados.',
    corpo: `
      <p><strong>Phishing</strong> é uma mensagem falsa (e-mail, SMS, WhatsApp ou ligação) que tenta enganar você para entregar senhas e dados ou instalar um programa malicioso.</p>
      <h4>Sinais de alerta</h4>
      <ul>
        <li>Urgência ou ameaça: “sua conta será bloqueada em 24h”.</li>
        <li>Remetente ou link com endereço estranho.</li>
        <li>Pedido de senha, código ou pagamento.</li>
        <li>Erros de português e ofertas boas demais.</li>
      </ul>
      <h4>O que fazer</h4>
      <p>Não clique. Acesse o serviço pelo app oficial ou digitando o endereço. Denuncie a mensagem. Se já clicou, troque a senha e ative o 2FA.</p>`,
  },
  {
    id: 'radio', titulo: 'Ataques por rádio: replay e jamming', icone: 'radio',
    resumo: 'Controles de portão, sensores sem fio e Bluetooth também podem ser atacados.',
    corpo: `
      <p>Muitos aparelhos se comunicam por rádio: controles de portão (433 MHz), sensores, Wi-Fi, Bluetooth e Zigbee.</p>
      <h4>Ataque de repetição (replay)</h4>
      <p>O criminoso grava o sinal de um controle com <strong>código fixo</strong> e o reproduz depois. Proteção: <strong>código rotativo</strong> (<em>rolling code</em>) e criptografia — cada sinal só vale uma vez.</p>
      <h4>Bloqueio de sinal (jamming)</h4>
      <p>Interferência proposital para derrubar sensores e câmeras sem fio. Proteção: alarmes com aviso de “perda de comunicação” e conexão de reserva (cabo ou rede celular).</p>
      <h4>Bluetooth</h4>
      <p>Exija PIN no pareamento e desligue a visibilidade quando não estiver pareando um aparelho novo.</p>`,
  },
  {
    id: 'privacidade', titulo: 'Privacidade e LGPD na casa conectada', icone: 'eye',
    resumo: 'Quais dados os aparelhos coletam e quais são os seus direitos.',
    corpo: `
      <p>Aparelhos inteligentes coletam muitos dados: imagens, voz, localização, horários e até a planta da casa.</p>
      <p>A <strong>Lei Geral de Proteção de Dados</strong> (LGPD — Lei nº 13.709/2018) garante, entre outros direitos:</p>
      <ul>
        <li>saber quais dados são coletados e para quê;</li>
        <li>pedir acesso, correção e exclusão dos dados;</li>
        <li>revogar o consentimento;</li>
        <li>ser informado sobre o compartilhamento com terceiros.</li>
      </ul>
      <h4>Na prática</h4>
      <p>Revise as permissões dos apps, desative o compartilhamento com “parceiros”, apague gravações periodicamente, desligue câmeras e microfones que não usa e nunca deixe câmeras com link público.</p>`,
  },
  {
    id: 'botnet', titulo: 'Botnets e o caso Mirai', icone: 'bug',
    resumo: 'Como aparelhos domésticos viram um exército de ataque.',
    corpo: `
      <p>Uma <strong>botnet</strong> é uma rede de aparelhos infectados, controlados à distância por criminosos. Os donos geralmente nem percebem — no máximo notam a internet mais lenta.</p>
      <h4>O caso Mirai</h4>
      <p>Em 2016, o malware Mirai infectou centenas de milhares de câmeras e roteadores testando, pelo Telnet, uma lista de cerca de 60 combinações de usuário e senha de fábrica. Em outubro daquele ano, essa botnet participou de um enorme ataque de negação de serviço (DDoS) contra a empresa Dyn, que deixou grandes sites fora do ar em várias partes do mundo.</p>
      <h4>Sinais de infecção</h4>
      <ul>
        <li>Tráfego de saída muito acima do normal.</li>
        <li>Aparelho lento ou travando.</li>
        <li>Conexões com milhares de endereços diferentes.</li>
      </ul>
      <p><strong>Resposta:</strong> isolar o aparelho, restaurar o padrão de fábrica, atualizar o firmware e trocar a senha. Só reiniciar não basta.</p>`,
  },
  {
    id: 'resposta', titulo: 'Como responder a um incidente', icone: 'list-checks',
    resumo: 'Um passo a passo para agir diante de um alerta de segurança.',
    corpo: `
      <ol>
        <li><strong>Mantenha a calma e leia as evidências:</strong> horário, origem, aparelhos envolvidos, o que é normal na casa.</li>
        <li><strong>Classifique:</strong> é um ataque ou uma atividade legítima? Que tipo de ameaça?</li>
        <li><strong>Contenha:</strong> isole o aparelho, bloqueie o acesso, encerre sessões abertas.</li>
        <li><strong>Corrija a causa:</strong> senha, atualização ou configuração.</li>
        <li><strong>Recupere e acompanhe:</strong> restaure backups e monitore os registros.</li>
        <li><strong>Aprenda:</strong> registre o que aconteceu para não se repetir.</li>
      </ol>
      <p>Desligar alertas ou ignorar avisos nunca é uma resposta.</p>`,
  },
  {
    id: 'checklist', titulo: 'Checklist da casa conectada segura', icone: 'shield-check',
    resumo: 'Dez hábitos que protegem qualquer casa inteligente.',
    corpo: `
      <ul class="checklist">
        <li>Trocar todas as senhas de fábrica por senhas longas e únicas.</li>
        <li>Ativar a verificação em duas etapas nas contas.</li>
        <li>Manter as atualizações automáticas ligadas.</li>
        <li>Usar WPA3 ou WPA2-AES no Wi-Fi.</li>
        <li>Desativar WPS, UPnP, Telnet e serviços que não usa.</li>
        <li>Colocar os aparelhos inteligentes em uma rede separada.</li>
        <li>Revisar permissões e o compartilhamento de dados.</li>
        <li>Ativar registros e notificações de acesso.</li>
        <li>Ter backup na regra 3-2-1.</li>
        <li>Desconfiar de mensagens urgentes e links suspeitos.</li>
      </ul>`,
  },
];
