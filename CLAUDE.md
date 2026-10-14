# Instruções do projeto MafraDesk

Leia README.md, docs/ARCHITECTURE.md, docs/ROADMAP.md, docs/LICENSES.md e SECURITY.md antes de alterar código.

## Regras de implementação

1. Escreva código original. Não copie código, marca, identidade visual ou recursos de engenharia reversa de AnyDesk ou de outro produto.
2. Implemente uma etapa do roadmap por vez. Faça testes automatizados e uma prova manual apropriada antes de avançar; não marque como pronto se o critério de aceite não foi executado.
3. Exija consentimento local explícito antes de iniciar captura ou aceitar entrada remota. Mantenha indicador visível enquanto a sessão estiver ativa. Qualquer lado pode encerrar a sessão.
4. Não implemente modo desacompanhado, acesso oculto, inicialização persistente, bypass de UAC/secure desktop ou execução de comandos. Eles estão fora do MVP.
5. Use WebRTC e APIs documentadas. Não implemente criptografia, troca de chaves, PAKE ou protocolo de autenticação próprio. Se a autenticação de pares não puder ser feita com biblioteca/protocolo revisado e licença aprovada, pare e registre a pendência de segurança.
6. Antes de instalar ou atualizar uma dependência, confira a licença do pacote e das dependências transitivas, registre versão, URL e licença em docs/LICENSES.md e preserve os avisos exigidos. Avise Lucas antes de incluir GPL/AGPL/LGPL ou outra licença copyleft/restritiva. Não adicione uma dependência com licença ambígua.
7. Guarde segredos em variáveis de ambiente/secret store local; nunca os inclua em commits, logs, screenshots ou arquivos de exemplo. Servidor de sinalização não recebe mídia nem senha em texto claro.
8. Mantenha renderer Electron isolado: nodeIntegration desativado, contextIsolation e sandbox habilitados, preload com API mínima e IPC validado. Não carregue conteúdo arbitrário remoto no renderer privilegiado.
9. Não publique um instalador até cumprir os gates de segurança e os testes de duas máquinas descritos no roadmap. Em cada etapa, atualize docs/ROADMAP.md com resultados reais, limitações e instruções para executar.

## Entrega de cada etapa

- Alterações completas no repositório, sem trechos soltos.
- Testes executados e resultado literal (comando, sucesso/falha).
- Limitações conhecidas e requisitos para testar em Windows.
- Commit/push na branch de trabalho ou instruções claras para aplicar o patch, caso a sessão do Claude não tenha acesso de escrita.
- Não afirmar que algo foi testado se apenas compilou ou se não houve teste manual.
- Antes de gerar instalador, publicar a versão e o hash do arquivo; não colocar secrets no artefato.

## Primeira tarefa

Comece pelo Marco 0 de docs/ROADMAP.md. Depois proponha a implementação do Marco 1 e aguarde a revisão do usuário antes de avançar para captura, transporte de rede ou injeção de entrada.