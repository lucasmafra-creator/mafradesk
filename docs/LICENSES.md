# Inventário de licenças (inicial)

Este inventário cobre candidatos arquiteturais pesquisados em 14/10/2026. Não é parecer jurídico nem substitui a auditoria do lockfile e dos binários exatos. O Claude deve atualizar este arquivo antes de adicionar ou distribuir cada pacote.

| Componente candidato | Uso | Licença consultada | Decisão |
|---|---|---|---|
| Electron | Shell desktop declarado em package.json como ^44.0.0; desktopCapturer e Chromium WebRTC | MIT no repositório Electron; builds também distribuem avisos de terceiros do Chromium | Dependência ativa declarada; package-lock.json e avisos da versão empacotada ainda pendentes. v44.7.1 era a versão estável observada em 14/10/2026. |
| Node.js | Runtime do processo principal e servidor | MIT | Recomendado. |
| TypeScript | Linguagem e compilador | Apache-2.0 | Recomendado. |
| ws | WebSocket do serviço de sinalização | MIT | Candidato; revalidar versão e dependências. |
| coturn | Relay TURN/STUN | BSD-3-Clause | Candidato para infra; não embutir segredo TURN no cliente. |
| Tauri | Alternativa desktop | MIT OR Apache-2.0 | Avaliado; não selecionado para o primeiro MVP. |
| Pion WebRTC | Alternativa Go/WebRTC | MIT | Avaliado; exigiria integrar captura/codec e UI. |
| SIPSorcery | Alternativa C#/.NET para WebRTC | BSD-3-Clause com restrição adicional BDS BY-NC-SA declarada no upstream atual | Não selecionado por restrição incompatível com a política desejada. |
| SIPSorceryMedia.FFmpeg | Codec/mídia opcional da alternativa acima | LGPL-2.1 no pacote citado | Não selecionado; LGPL exige análise de distribuição. |
| PAKE/autenticação de fingerprint | Vincular código temporário à identidade WebRTC | Ainda sem biblioteca escolhida | Gate bloqueante; pesquisar implementação mantida/auditável e licença antes de codificar. |

## Dependências efetivamente declaradas

- electron: ^44.0.0 em package.json; licença MIT no projeto principal. O lockfile ainda não foi gerado, portanto a versão transitiva exata e os avisos Chromium do artefato precisam ser confirmados pelo Claude no Windows.
- APIs node:crypto e node:test: módulos nativos do Node.js, sem pacote npm adicional.

## Regras

- Registrar nome, versão resolvida, URL oficial, licença SPDX, dependências transitivas relevantes e avisos do artefato.
- O lockfile e o binário release definem a auditoria real, não apenas esta lista.
- Não introduzir GPL, AGPL, LGPL, SSPL ou licenças com restrição comercial/uso sem avisar Lucas e avaliar impacto antes.
- Um pacote marcado MIT/BSD/Apache ainda pode carregar subdependências com licenças diferentes.
- Não adicionar um arquivo LICENSE do MafraDesk até Lucas decidir a licença do próprio projeto.

## Fontes consultadas

- Electron: https://github.com/electron/electron/blob/main/LICENSE
- Node.js: https://github.com/nodejs/node
- TypeScript: https://github.com/microsoft/TypeScript
- ws: https://github.com/websockets/ws/blob/master/LICENSE
- coturn: https://github.com/coturn/coturn/blob/master/LICENSE
- Tauri: https://github.com/tauri-apps/tauri
- Pion WebRTC: https://github.com/pion/webrtc
- SIPSorcery: https://github.com/sipsorcery-org/sipsorcery
- SIPSorcery FFmpeg adapter: https://github.com/sipsorcery-org/sipsorcery/tree/master/src/SIPSorceryMedia.FFmpeg