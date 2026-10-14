# Instruções do projeto MafraDesk

Leia README.md, docs/ARCHITECTURE.md, docs/ROADMAP.md, docs/LICENSES.md e SECURITY.md antes de alterar código.

## Regras de implementação

1. Escreva código original. Não copie código, marca, identidade visual ou recursos de engenharia reversa de AnyDesk ou de outro produto.
2. Implemente uma etapa do roadmap por vez. Faça testes automatizados e uma prova manual apropriada antes de avançar; não marque como pronto se o critério de aceite não foi executado.
3. Exija consentimento local explícito antes de iniciar captura ou aceitar entrada remota. Mantenha indicador visível enquanto a sessão estiver ativa. Qualquer lado pode encerrar a sessão.
4. Não implemente modo desacompanhado, acesso oculto, inicialização persistente, bypass de UAC/secure desktop ou execução de comandos. Eles estão fora do MVP.
5. Use WebRTC e APIs documentadas. Não implemente criptografia, troca de chaves, PAKE ou protocolo de autenticação próprio. Se a autenticação de pares não puder ser feita com biblioteca/protocolo revisado e licença aprovada, pare a parte de rede externa e registre a pendência de segurança.
6. Antes de instalar ou atualizar uma dependência, confira a licença do pacote e das dependências transitivas, registre versão, URL e licença em docs/LICENSES.md e preserve os avisos exigidos. Avise Lucas antes de incluir GPL/AGPL/LGPL ou outra licença copyleft/restritiva. Não adicione uma dependência com licença ambígua.
7. Guarde segredos em variáveis de ambiente/secret store local; nunca os inclua em commits, logs, screenshots ou arquivos de exemplo. Servidor de sinalização não recebe mídia nem senha em texto claro.
8. Mantenha renderer Electron isolado: nodeIntegration desativado, contextIsolation e sandbox habilitados, preload com API mínima e IPC validado. Não carregue conteúdo arbitrário remoto no renderer privilegiado.
9. Não publique um instalador de release até cumprir os gates de segurança e os testes de duas máquinas descritos no roadmap. Em cada etapa, atualize docs/ROADMAP.md com resultados reais, limitações e instruções para executar.

## Fluxo de trabalho e entrega

- Trabalhe diretamente no repositório MafraDesk e mantenha o GitHub como fonte oficial do projeto.
- Avance pelos marcos em ordem sem parar para pedir aprovação a cada etapa; pare apenas quando houver uma decisão de segurança/licença sem solução, credencial externa ausente ou teste que realmente exija o Lucas.
- Faça commits pequenos e claros após cada marco testado. Se tiver acesso de escrita ao GitHub, publique as mudanças na branch de trabalho e abra/atualize PR; não reescreva histórico nem force push.
- Se não tiver acesso de escrita, entregue patch completo e passos objetivos para Lucas aplicar; nunca diga que atualizou o GitHub sem confirmar o commit.
- Em cada etapa, informe comandos e resultados reais. Não afirmar que algo foi testado se apenas compilou ou se não houve teste manual.
- Antes de gerar instalador, publique versão e SHA-256 do arquivo; não coloque secrets no artefato.

## Primeira tarefa

Comece pelo Marco 0 e siga para os marcos seguintes do docs/ROADMAP.md, na ordem, validando cada critério. Gere build de teste para Windows para os marcos que permitirem; só gere instalador de release após o Marco 7. Investigue uma implementação PAKE/protocolo revisado e sua licença antes de conectar usuários externos. Se esse gate não puder ser resolvido, continue as partes locais seguras e marque as partes de rede como bloqueadas, sem improvisar criptografia ou alegar que o MVP completo está pronto.