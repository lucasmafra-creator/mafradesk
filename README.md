# MafraDesk

Aplicativo original e educacional de acesso remoto para Windows 10/11, com consentimento explícito em cada sessão. A proposta é aprender e implementar captura, transporte em tempo real e controle remoto usando protocolos e APIs públicos, sem copiar código, marca ou interface de outros produtos.

## Escopo do MVP

- ID numérico e código temporário de uso único.
- Pedido de sessão visível no computador anfitrião, com aceitar/recusar.
- Compartilhamento de tela e controle de mouse/teclado somente após aceite.
- Indicador permanente de sessão ativa e botão para encerrar em qualquer lado.
- Sem modo desacompanhado, execução de comandos, instalação silenciosa ou persistência oculta.

## Stack recomendada para validar

Electron + TypeScript para o app; WebRTC do Chromium para vídeo e canal de dados; serviço próprio de sinalização por WSS; STUN/TURN com coturn; pequeno helper .NET/C# usando SendInput, se o protótipo confirmar que a ponte nativa é necessária.

A proposta é um ponto de partida, não uma declaração de que o MVP já está implementado. Dependências e licenças devem ser conferidas antes de adicionar ou distribuir cada pacote.

## Comece por aqui

- Arquitetura e interfaces: [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md)
- Etapas e critérios de aceite: [docs/ROADMAP.md](docs/ROADMAP.md)
- Inventário e política de licenças: [docs/LICENSES.md](docs/LICENSES.md)
- Modelo de ameaças: [SECURITY.md](SECURITY.md)
- Instruções para implementação no Claude: [CLAUDE.md](CLAUDE.md)

## Estado do repositório

Protótipo local 0.1.0: janela desktop, ID numérico e código de 128 bits com expiração de dez minutos. A conexão remota ainda não está ativa e o código ainda não é consumido por uma sessão. A implementação seguirá os marcos do roadmap e precisa ser validada em duas máquinas Windows antes de qualquer release funcional.

Para iniciar no Windows após clonar: npm install, npm start. Para os testes locais da identidade temporária: npm test. O primeiro npm install deve gerar e versionar o package-lock.json.