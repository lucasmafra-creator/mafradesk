# Roadmap do MVP

Trabalhar em marcos pequenos. Um marco só fica concluído quando o critério de aceite foi executado e o resultado foi registrado. Não pular gates de segurança para chegar mais rápido à conexão remota.

## Estado atual (14/10/2026)

- Marco 0: parcial. Estrutura Electron inicial e scripts do npm publicados; instalação limpa/build do Electron ainda não executados e package-lock.json ainda precisa ser gerado no ambiente Windows.
- Marco 1: parcial. UI local, ID de 12 dígitos e código aleatório de 128 bits com expiração de 10 minutos implementados; código não é consumido por uma sessão enquanto a rede não existir.
- Verificações executadas neste ambiente: npm test (3/3 passando) e npm run check (sintaxe JavaScript aprovada).
- Não verificado: abrir a janela Electron e instalar/empacotar no Windows. Não há conexão remota nesta versão.

## Marco 0 — Base do projeto e ambiente

Arquivos candidatos: estrutura inicial, package.json, configuração TypeScript/Electron, README e CI de lint/teste/build.

Aceite:
- Instalação limpa e build reproduzível em Windows 10/11.
- Janela original do MafraDesk abre sem erro.
- Nenhum segredo no repositório.
- Dependências fixadas por lockfile e inventariadas em docs/LICENSES.md.

## Marco 1 — UI local e identidade efêmera

Arquivos candidatos: apps/desktop/src/main, preload, renderer; packages/protocol/src/session.ts; testes unitários de geração/expiração.

Aceite:
- UI própria mostra ID de teste e código temporário gerados por CSPRNG.
- ID não é tratado como autenticação.
- Código expira e é invalidado no encerramento.
- Testes cobrem colisão, formato, expiração e segredo ausente dos logs.
- Sem rede, captura ou controle nesta etapa.

## Marco 2 — Sinalização e consentimento, sem mídia

Arquivos candidatos: apps/signaling/src/server.ts, sessionStore.ts, rateLimiter.ts; packages/protocol/src/messages.ts e schemas; testes unitários e integração local.

Aceite:
- Duas instâncias registram anfitrião/controlador e trocam pedido/aceite/recusa via WSS.
- Anfitrião recebe pedido visível e pode recusar; recusa não inicia captura.
- Sessões expiram; limite de tentativas funciona por IP e ID.
- ID não permite acesso sem prova do segredo.
- WSS e mensagens/schema têm testes positivos e negativos.

## Marco 3 — Autenticação de peer e canal WebRTC

Antes de codificar: documentar PAKE/biblioteca aprovada, licença e desenho de binding de fingerprint/SDP. Protocolo próprio de troca de chave é proibido.

Aceite:
- Duas máquinas concluem conexão com segredo correto.
- Segredo errado, fingerprint adulterado, replay e tentativa de MITM falham fechados.
- DataChannel transporta apenas mensagens de teste permitidas.
- Sinalização e TURN não recebem plaintext de controle.
- TLS/WSS em rede; registros sem código temporário.

## Marco 4 — Vídeo e captura de tela

Arquivos candidatos: screenCapture.ts, peerConnection.ts, viewer component e testes de estado/permissão.

Aceite:
- Só iniciar captura depois do aceite local e autenticação.
- Encerrar captura ao recusar, perder sessão, desconectar ou clicar em parar.
- Duas máquinas Windows visualizam tela a 720p/30fps em rede de teste; medir atraso, FPS, bitrate e CPU.
- Tratar mudança de monitor/resolução e captura indisponível.
- Imagem não é persistida nem gravada.

## Marco 5 — Mouse e teclado

Arquivos candidatos: apps/input-bridge (helper C#), inputController.ts, schema e testes de validação.

Aceite:
- Controle só habilita após aceite explícito e autenticação do peer.
- Eventos aceitos são apenas movimento/clique/teclas normais; schema rejeita campos extras e payloads malformados.
- Coordenadas, frequência e teclas são validadas; limites e tecla de escape para revogar funcionam.
- Encerramento libera botões/teclas pressionados.
- Sem elevação, bypass de UAC, comandos ou acesso ao secure desktop.

## Marco 6 — TURN e resiliência

Arquivos candidatos: configuração de ICE e infra/coturn; testes de rede documentados.

Aceite:
- Teste P2P direto e teste forçado por TURN.
- Credenciais TURN curtas, geradas pelo backend e não embutidas no app.
- Queda de rede fecha sessão de forma segura; reconexão exige consentimento novo se o estado de autorização se perdeu.
- Métricas limitadas a conectividade e latência, sem conteúdo de tela/entrada.

## Marco 7 — Segurança, empacotamento e teste com usuários

Arquivos candidatos: workflow CI, script de build Windows, docs de instalação e avisos de terceiros.

Aceite:
- Duas máquinas Windows 10/11 em redes diferentes executam o fluxo completo.
- Testes de recusa, encerramento dos dois lados, segredo errado, força bruta/rate limit, desconexão e manipulação de mensagens.
- Dependências transitivas e avisos de licenças revisados; bloqueio de GPL/AGPL/LGPL/restritivas sem aprovação do Lucas.
- Renderer sandbox/contextIsolation/nodeIntegration=false, CSP, validação IPC, atualização segura e logs sem segredos.
- Gerar instalador e SHA-256; testar instalação e desinstalação em máquina limpa.
- Só então declarar MVP testável. Ainda não inclui chat, clipboard, arquivos, gravação ou modo desacompanhado.

## Não fazer agora

Não adicionar modo desacompanhado, auto-run, serviço invisível, controle de UAC, shell remoto, terminal, transferência de arquivos, gravação ou persistência de credenciais. Esses recursos mudam o modelo de risco e exigem etapa de segurança separada.