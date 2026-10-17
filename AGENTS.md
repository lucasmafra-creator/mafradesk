# Instruções de agentes — MafraDesk

## Continuidade e segurança
Leia `CLAUDE.md`, `README.md`, `SECURITY.md` e os documentos de arquitetura, roadmap e licenças antes de trabalhar. Este é um produto original de acesso remoto educacional. Preservar consentimento, indicação visível de sessão, encerramento por qualquer lado, modelo de ameaças e proibição de acesso oculto/modo desacompanhado já aprovados. Não copiar marca, interface, código ou recursos proprietários de AnyDesk ou outro produto.

## Skills de interface
Consultar Impeccable (Apache-2.0: https://github.com/pbakaus/impeccable) para UI de produto, fluxos de conexão, acessibilidade, estados e telas de sessão. Taste-Skill (MIT: https://github.com/Leonxlnx/taste-skill) aplica-se a nova página pública de apresentação/marketing; em redesign existente, consultar `redesign-existing-projects`. A skill não altera as regras de consentimento, segurança ou originalidade.

Instalar no runtime da tarefa visual: `npx impeccable install`; Taste: `npx skills add https://github.com/Leonxlnx/taste-skill --skill design-taste-frontend` ou `--skill redesign-existing-projects`. Confirmar instalação no Codex/Claude/Cursor escolhido antes de dizer que ficou ativo. Taste requer Node 22+ e Chrome/Edge/Chromium para inspeção real; se indisponível, registrar BLOCKED/NOT RUN. Verificar licença/crédito de assets.

Esta regra no GitHub é política do projeto, não instalação no runtime nem propagação automática para outros repositórios. Registrar estado de instalação por ambiente com versão e evidência.