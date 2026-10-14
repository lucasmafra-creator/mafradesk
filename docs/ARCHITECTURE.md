# Arquitetura proposta

Status: especificação inicial para Windows 10/11. Nenhum fluxo de controle remoto está implementado ainda.

## Diagrama

Anfitrião Windows
- UI MafraDesk + processo principal Electron
- desktopCapturer fornece a tela como MediaStream
- Chromium WebRTC codifica e transmite vídeo
- helper local C#/.NET usa Win32 SendInput

Fluxo de controle:
Anfitrião ⇄ serviço de sinalização via HTTPS/WSS
A sinalização roteia ID, pedido, consentimento, SDP, candidatos ICE e mensagens de autenticação PAKE; não transporta mídia nem eventos de teclado/mouse.

Fluxo de mídia e dados:
Anfitrião ⇄ WebRTC ⇄ Controlador
ICE tenta conexão direta; STUN auxilia a descoberta de caminho; TURN/coturn retransmite se a rede bloquear P2P. O relay recebe tráfego criptografado e metadados de rede, não conteúdo de tela/controle em claro.

## Componentes

### 1. App Windows

Stack inicial recomendada: Electron + TypeScript. O renderer apresenta ID, código temporário, pedido de acesso, consentimento, visualizador e indicador de sessão. O processo principal controla permissões nativas e cria janelas. O renderer não recebe APIs Node arbitrárias.

Captura inicial: API Electron desktopCapturer integrada a MediaStream/WebRTC do Chromium. Essa opção entrega o vídeo ao pipeline WebRTC sem uma ponte própria de frames. Se a medição mostrar latência/cópias excessivas, avaliar captura nativa em C++ usando DXGI Desktop Duplication API (D3D11). A implementação nativa deve lidar com rotação, múltiplos monitores, mudança de resolução e recriar a duplicação quando DXGI perder acesso. Conteúdo protegido e secure desktop podem aparecer em preto; não tentar contornar essas limitações.

Codificação: deixar o pipeline WebRTC/Chromium negociar e codificar o vídeo. Começar com VP8 e resolução/FPS configuráveis (alvo inicial de teste: 1280×720 a 30 fps; reduzir dinamicamente para priorizar resposta e largura de banda). Medir latência, CPU e bitrate; não presumir que hardware encoding está ativo. H.264 só entra após verificação da distribuição, codecs disponíveis e obrigações de patentes/licenças.

Entrada remota: um helper pequeno em C#/.NET chama a API documentada Win32 SendInput. A app conversa com o helper por named pipe local restrito ao usuário, com mensagens tipadas e validadas. Não enviar texto arbitrário, comandos de shell ou chamadas nativas pelo renderer. Aceitar apenas movimento/clique/tecla enquanto a sessão está aceita e ativa; limitar taxa, validar coordenadas e sempre liberar teclas/botões pressionados no encerramento. SendInput está sujeito a UIPI e não deve ser elevado para contornar a fronteira de integridade do Windows.

### 2. Serviço de sinalização

Serviço Node.js com WebSocket sobre TLS (WSS), publicado apenas por HTTPS/WSS. Responsabilidades: alocar/reservar IDs numéricos, encaminhar pedidos e consentimento, encaminhar SDP/candidatos ICE e mensagens PAKE, encerrar/expirar estado efêmero e aplicar limites por IP/ID/sessão. Não persistir senha, SDP completo, teclas, tela ou conteúdo de clipboard. Logs não incluem segredos nem dados de controle.

Para a primeira prova local, o registro de IDs pode ser em memória e efêmero; isso não é alta disponibilidade. Antes de usuários externos, definir armazenamento/coordenação com expiração, autenticação operacional, métricas e resposta a abuso.

### 3. NAT e transporte

WebRTC RTCPeerConnection usa ICE. Configurar STUN e TURN próprios ou de provedor confiável. STUN não é relay. TURN é fallback e pode consumir banda/custo; emitir credenciais TURN de curta duração no servidor, nunca publicar credencial estática no cliente. Testar caminho direto e relay em redes diferentes.

A mídia usa SRTP com chaves estabelecidas por DTLS-SRTP; o canal de dados usa DTLS. A negociação usa SDP enviado pelo serviço de sinalização. TLS protege o trecho até o serviço, mas não autentica por si só a identidade do outro peer.

### 4. IDs, código temporário e pedido de sessão

- ID numérico é identificador público de roteamento, não segredo nem fator de autenticação. Gerar aleatoriamente com CSPRNG e detectar colisões no servidor.
- Código temporário deve ter alta entropia (recomendação inicial: 128 bits aleatórios, apresentado em forma digitável), uso único e expiração curta; não usar código de seis dígitos como única proteção.
- O código não trafega em texto claro para a sinalização e não aparece em logs. A prova de posse do código deve autenticar os fingerprints DTLS e os papéis da negociação com PAKE/protocolo revisado. O serviço apenas retransmite as mensagens do protocolo.
- Não implementar algoritmo criptográfico/PAKE próprio. A seleção da biblioteca de PAKE é um gate: conferir manutenção, auditorias disponíveis, suporte a Electron/Node e licença antes de codificar. Sem autenticação de fingerprint resistente a MITM, o MVP não pode ser apresentado como criptografia ponta a ponta autenticada nem liberar uso externo.
- Após autenticação, o anfitrião exibe nome/identificador do solicitante, horário, tipo de acesso e botões aceitar/recusar. Captura e input ficam desligados até aceite.

### 5. Interfaces de protocolo iniciais

Contratos devem ser versionados e validados com schema estrito (por exemplo, Zod, licença MIT; confirmar versão e licença antes de adicionar). Mensagens de sinalização:

- host.register: anfitrião registra ID e estado efêmero disponível; nenhuma senha.
- session.request: controlador envia ID e início da autenticação PAKE.
- session.consent: anfitrião aceita ou recusa, depois de validar e mostrar o pedido.
- webrtc.offer, webrtc.answer, webrtc.ice: roteamento limitado à sessão autorizada.
- session.end: qualquer lado encerra e revoga o token da sessão.
- heartbeat: presença efêmera, sem segredo.

Dados WebRTC para controle usam envelope versionado e lista de mensagens fechada: pointer (x/y normalizados 0..1), button (botão permitido + down/up), key (código permitido + down/up). Rejeitar payload excessivo, repetido, fora de ordem ou fora dos limites. Não aceitar mensagens genéricas que possam virar execução remota de comandos.

## Stack comparada

| Stack | Vantagens | Custos/riscos | Licenças principais consultadas |
|---|---|---|---|
| Electron + TypeScript (recomendada) | Electron fornece desktopCapturer; Chromium inclui RTCPeerConnection, codecs e DataChannel; UI e fluxo do MVP ficam na mesma linguagem. | Mais memória; processo Node privilegiado aumenta impacto de falhas; precisa isolamento rigoroso e helper pequeno para SendInput. Chromium/Electron distribuído tem avisos de terceiros a inventariar. | Electron MIT; Node.js MIT; ws MIT; TypeScript Apache-2.0; coturn BSD-3-Clause. Chromium inclui inventário de terceiros por versão. |
| C#/.NET + WPF/WinUI | Acesso direto às APIs Windows, SendInput e bom encaixe para app nativo. | Integração WebRTC/captura/codificação exige componentes adicionais. SIPSorcery hoje declara BSD-3-Clause com restrição adicional BDS BY-NC-SA; não foi selecionado. Adaptador opcional FFmpeg do projeto é LGPL-2.1. | .NET MIT; revisar separadamente cada biblioteca WebRTC e codecs. |
| Rust + Tauri | App leve; Tauri é MIT/Apache-2.0; Rust ajuda a reduzir certas classes de erro de memória. | Captura nativa, WebRTC, codec, UI e injeção exigem mais integração nativa; maior risco de alongar o primeiro MVP. | Tauri MIT/Apache-2.0; revisar crates individualmente. |

Recomendação: começar com Electron para validar o fluxo WebRTC e compartilhar a tela rápido; isolar as ações privilegiadas no processo principal/helper. Se o consumo medido for inaceitável, reavaliar UI nativa depois do MVP, sem reescrever antes de ter métricas.

## Referências técnicas

- Electron desktopCapturer: https://electronjs.org/docs/latest/api/desktop-capturer
- Segurança Electron: https://electronjs.org/docs/latest/tutorial/security
- Desktop Duplication API: https://learn.microsoft.com/windows/win32/direct3ddxgi/desktop-dup-api
- SendInput: https://learn.microsoft.com/windows/win32/api/winuser/nf-winuser-sendinput
- RFC 8827, arquitetura de segurança WebRTC: https://datatracker.ietf.org/doc/html/rfc8827
- RFC 8831, Data Channels: https://datatracker.ietf.org/doc/html/rfc8831
- Visão geral ICE/STUN/TURN: https://developer.mozilla.org/docs/Web/API/WebRTC_API/Protocols
- Licenças e links verificados: docs/LICENSES.md