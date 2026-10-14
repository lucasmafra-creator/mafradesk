# Segurança e limites de uso do MafraDesk

MafraDesk é um protótipo de acesso remoto para computadores autorizados. A sessão sempre exige ação consciente da pessoa diante do computador anfitrião. O MVP não pode esconder a conexão nem aceitar acesso remoto sem consentimento.

## Ameaças e controles mínimos

| Risco | Controle no MVP |
|---|---|
| Pedido não autorizado ou engenharia social | Tela local identifica solicitante e mostra pedido claro; usuário precisa aceitar; recusa é padrão. |
| Adivinhação de ID | ID é roteamento, nunca autenticação; códigos aleatórios; rate limit por IP e ID, atraso progressivo e bloqueio temporário; monitorar abuso sem registrar segredo. |
| Roubo/reuso do código temporário | 128 bits aleatórios, uso único, expiração curta, invalidação após sessão/falha limite; não enviar em claro ao servidor nem salvar em log. |
| MITM pelo sinalizador | WSS protege transporte; a prova secreta deve autenticar os fingerprints DTLS e o transcript via implementação PAKE/protocolo revisado. Falhar fechado se verificação não completar. |
| Escuta do relay TURN | WebRTC DTLS-SRTP protege mídia; DTLS protege DataChannel; credenciais TURN temporárias; nunca assumir que TURN oferece criptografia de ponta a ponta. |
| Injeção maliciosa de input | Canal de dados fechado por schema, limite de taxa/tamanho/teclas, helper local mínimo, input permitido somente após consentimento e autenticação. |
| Sessão esquecida/oculta | Faixa/janela sempre visível com peer e duração; Stop local e remoto; encerramento fecha captura e libera teclas/botões pressionados. |
| Renderer Electron comprometido | nodeIntegration=false, contextIsolation=true, sandbox=true, CSP sem conteúdo remoto, preload mínimo, validação de origem e schema em todo IPC. |
| Captura de conteúdo sensível | Indicador de captura, solicitação de consentimento por sessão, sem gravação, sem clipboard/arquivos no MVP, opção local de pausar/parar. |
| Segredos expostos em logs/telemetria | Nunca registrar código, conteúdo de tela, keys, SDP completo ou mensagens de input; redigir IDs e limitar retenção. |

## Limites explícitos

- O protocolo não contorna UAC, secure desktop, políticas corporativas ou permissões do Windows.
- Não instalar serviço em segundo plano, não iniciar com Windows, não ocultar tray/indicador e não reabrir sessões após reiniciar.
- Não incluir execução remota de comandos, shell, automação de tarefas, coleta de arquivos, clipboard nem gravação.
- Uma sessão perdida ou reiniciada exige nova solicitação e novo aceite.
- O projeto só é para máquinas próprias ou com autorização clara do proprietário.

## Gate para uso fora de rede local

Não conectar usuários externos enquanto identidade do peer não estiver autenticada contra MITM, rate limits estiverem testados, TURN tiver credenciais curtas e o teste em duas redes tiver passado. TLS por si só entre cliente e sinalização não basta para provar criptografia de ponta a ponta autenticada.

## Reportar vulnerabilidade

Até existir um canal público dedicado, não publicar detalhes exploráveis em issues. Envie ao mantenedor por canal privado.