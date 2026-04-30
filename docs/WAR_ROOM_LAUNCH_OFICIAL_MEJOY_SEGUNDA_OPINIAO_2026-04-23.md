# War Room Launch Oficial MeJoy

Segunda opinião consolidada em 23/04/2026
Base: estado atual do repo, saídas do Cursor, smoke automatizado em produção e P0 internos já registrados

## 1. Leitura executiva

O projeto saiu da fase de "desenhar o funil" e entrou na fase de "provar o launch".

Hoje a melhor leitura não é:

- redesenhar tudo
- abrir nova sprint de UX
- gerar outro superprompt de produto

A melhor leitura é:

- preservar o que já foi implementado
- fechar lacunas reais de produção, operação, pricing, compliance e evidência
- travar uma fonte única de verdade entre workspace, GitHub, Vercel e domínio

## 2. O que já está comprovado

### Produto e fluxo

- A rota [src/pages/triagem/[slug].tsx](/Users/teobeckert/desenvolvimento/TecMed/mejoy/src/pages/triagem/[slug].tsx) já desvia `emagrecimento` para `EmagrecimentoOnePageIntake`.
- O componente [src/components/triage/EmagrecimentoOnePageIntake.tsx](/Users/teobeckert/desenvolvimento/TecMed/mejoy/src/components/triage/EmagrecimentoOnePageIntake.tsx) já implementa:
  - persistência incremental
  - progresso segmentado
  - validação de WhatsApp BR
  - envio progressivo para `/api/triage/answer`
  - polling de finalize/relatório
- O formulário [src/forms/emagrecimento.ts](/Users/teobeckert/desenvolvimento/TecMed/mejoy/src/forms/emagrecimento.ts) já cobre a ordem clínica esperada:
  - consentimento
  - altura/peso/meta
  - sexo
  - data de nascimento
  - comorbidades
  - contraindicações
  - perguntas binárias
  - PA
  - FC
  - preferência terapêutica
  - nome
  - WhatsApp
  - consentimento de contato
- O relatório [src/pages/emagrecimento/relatorio.tsx](/Users/teobeckert/desenvolvimento/TecMed/mejoy/src/pages/emagrecimento/relatorio.tsx) já possui:
  - dobra de decisão
  - CTA WhatsApp
  - CTA de handoff clínico
  - conteúdo longo abaixo da dobra
- O checkout [src/pages/api/asaas/create-payment.ts](/Users/teobeckert/desenvolvimento/TecMed/mejoy/src/pages/api/asaas/create-payment.ts) já envia metadata crítica:
  - `emagrecimento_trilha`
  - `emagrecimento_principio`
  - UTMs

### Handoff e observabilidade

- O handoff [src/pages/api/handoff/create.ts](/Users/teobeckert/desenvolvimento/TecMed/mejoy/src/pages/api/handoff/create.ts) já:
  - lê contexto de tracking
  - assina envelope
  - gera `redirectUrl`
  - persiste eventos `created` e `sent`
- O repo já possui gates/scripts reais:
  - `pnpm mejoy:predeploy`
  - `pnpm mejoy:postdeploy`
  - `pnpm qa:emagrecimento:prod`
  - `pnpm soft-launch:gate`
  - `pnpm official-launch:gate`

### Evidência técnica já produzida

- O Cursor rodou `bash scripts/mejoy-pre-deploy.sh` com sucesso.
- O build compilou.
- Os testes de handoff passaram.
- O smoke automatizado em produção gerou [smoke-test-report-1776915113894.json](/Users/teobeckert/desenvolvimento/TecMed/mejoy/smoke-test-report-1776915113894.json) com `5/5` passos aprovados em `https://www.mejoy.com.br`.

## 3. O que ainda NÃO está comprovado

Estes itens continuam bloqueando a frase "launch oficial validado":

- O deploy ativo do domínio não foi comprovado aqui por SHA contra a fonte Git remota.
- O workspace atual `mejoy` não é a raiz Git; isso aumenta risco de validar uma pasta e publicar outra.
- O smoke automatizado não prova:
  - abertura real do WhatsApp
  - handoff real abrindo ZapVida
  - callback real de handoff
  - escrita confirmada em `handoff_events` de produção
  - cobrança teste real no Asaas
  - leitura final de metadata no Asaas
- O `official-launch:gate` atual é útil como gate técnico, mas não cobre sozinho:
  - revisão humana de compliance
  - aprovação de oferta/preço
  - conferência real de envs no Vercel
  - evidência operacional arquivada

## 4. Risco escondido mais importante

Existe um risco de governança/configuração:

- o diretório ativo é `/Users/teobeckert/desenvolvimento/TecMed/mejoy`
- o `.git` encontrado está em `../zapfarm`
- esse `zapfarm` local encontrado está apontando para outro remoto (`zapvida/farmacia`)
- ao mesmo tempo o projeto `.vercel/project.json` local aponta para `projectName: "zapfarm"`
- o pacote local também se chama `zapfarm`

Conclusão:

Antes de chamar qualquer coisa de "fonte única de verdade", o war room precisa provar exatamente:

1. qual pasta é a workspace operacional
2. qual repo Git é a fonte de deploy
3. qual SHA está em produção
4. se o domínio `mejoy.com.br` está mesmo servindo o build derivado desse workspace

Sem isso, existe risco real de falso positivo.

## 5. Percentual honesto otimizado

### Código e produto

- Funil em código: `80%–85%`
- Paridade estrutural MedVi adaptada: `70%–80%`

### Launch oficial real

- Launch oficial validado: `45%–55%`

Motivo:

- a frente de código caiu bastante
- o que sobrou concentra a maior parte do risco real

## 6. O que eu mudaria no plano anterior

### Remover

- qualquer linguagem que ainda trate a principal incerteza como "UX pode estar diferente"
- qualquer sprint grande de redesign
- qualquer uso frouxo de "pronto para produção" só porque `lint`, `typecheck`, `build` e smoke web passaram

### Adicionar

- uma etapa zero de alinhamento de fonte de verdade entre workspace, GitHub e Vercel
- uso explícito dos scripts já existentes como gates técnicos
- distinção formal entre:
  - `gate técnico`
  - `gate operacional`
  - `gate regulatório/comercial`

### Rebaixar de prioridade

- refino extra de layout
- polimento visual secundário
- novas experiências paralelas

## 7. Plano otimizado de execução

### Etapa 0. Fonte única de verdade

Objetivo:

- eliminar ambiguidade entre pasta ativa, repo Git, deploy e domínio

Checklist:

- confirmar qual pasta é a workspace oficial do launch
- confirmar qual repo/remote abastece a Vercel
- confirmar branch oficial
- confirmar SHA alvo do go-live
- registrar URL do deployment ativo

Saída:

- tabela única `workspace -> repo -> branch -> SHA -> deployment -> domínio`

### Etapa 1. Gate técnico automatizado

Rodar e salvar evidência:

- `pnpm mejoy:predeploy`
- `pnpm exec playwright install chromium`
- `pnpm qa:emagrecimento:prod`
- `BASE_URL=https://www.mejoy.com.br pnpm mejoy:postdeploy`

Importante:

- se `soft-launch:gate` ou `official-launch:gate` falharem, corrigir antes de qualquer declaração de prontidão

### Etapa 2. Smoke manual de produção

Executar manualmente:

1. abrir `/emagrecimento` com UTM de teste
2. percorrer a triagem completa
3. validar WhatsApp obrigatório + consentimento
4. abrir relatório
5. escolher trilha
6. abrir checkout
7. criar cobrança teste
8. seguir CTA clínico e validar handoff para ZapVida

Evidência mínima:

- screenshots
- URLs
- timestamp
- nome do responsável

### Etapa 3. Handoff e Supabase

Confirmar em produção:

- `redirectUrl` válido
- callback assinado
- transições em `public.handoff_events`
- migration `20260404154500_handoff_events.sql` aplicada no projeto de produção

Sem isso:

- não chamar de launch oficial

### Etapa 4. Asaas

Após cobrança teste:

- validar `emagrecimento_trilha`
- validar `emagrecimento_principio`
- validar UTMs
- guardar evidência

### Etapa 5. Envs críticos

Conferir no Vercel:

- Supabase
- Asaas
- `HANDOFF_TOKEN_SECRET`
- `NEXT_PUBLIC_ZAPVIDA_HANDOFF_URL`
- TTL
- GA4
- envs de pricing relevantes

### Etapa 6. Oferta, preço e compliance

Fechar com owner humano:

- protocolo foco = emagrecimento
- oferta mínima v1
- preço aprovado ou placeholder aprovado
- claims revisados
- WhatsApp/checkout/relatório dentro do guardrail regulatório

### Etapa 7. Evidência arquivada

Arquivar juntos:

- SHA
- URL do deploy
- relatório do smoke
- prints do smoke manual
- prova do handoff
- prova do Asaas
- prova do Supabase
- checklist assinado

## 8. Novo critério de encerramento

Só pode usar a frase "launch oficial validado e pronto para vender" se todos forem verdadeiros:

- SHA em produção confirmado
- `mejoy:predeploy` passou
- `mejoy:postdeploy` passou
- smoke manual em produção passou
- handoff ZapVida confirmado
- `handoff_events` confirmado em produção
- envs críticos revisados
- Asaas metadata conferida
- pricing/oferta aprovados
- copy/compliance revisados
- evidência arquivada

## 9. Veredito de segunda opinião

### O que eu concordo com o Cursor

- não faz sentido abrir nova sprint de redesign agora
- o núcleo técnico do funil já avançou bastante
- os bloqueios finais são principalmente de produção/operação/compliance
- o smoke automatizado passou e isso é relevante

### O que eu endureceria em relação ao Cursor

- `5/5` no smoke automatizado não é quase-launch; é só um bom gate de superfície
- `official-launch:gate` não pode ser interpretado sozinho como aprovação de go-live
- o problema de alinhamento entre workspace e repo/deploy precisa ser tratado como P0

## 10. Prompt otimizado para o Cursor

Use este prompt agora, no Cursor Agent, sem reabrir redesign:

```text
Você está em war room de fechamento do launch oficial do MeJoy emagrecimento.

OBJETIVO
Não redesenhar o produto. Não abrir nova sprint. Não reinventar o stack.
Seu trabalho agora é provar, corrigir e validar o launch em produção com evidência.

FONTE DE VERDADE
Antes de tudo, resolva a ambiguidade entre:
- workspace local ativo
- repo Git real
- branch oficial
- SHA em produção
- deployment ativo na Vercel
- domínio mejoy.com.br

Entregue uma tabela única com:
- workspace
- remote
- branch
- SHA local
- SHA em produção
- URL do deployment
- domínio

GATES TÉCNICOS
Rode e registre:
- pnpm mejoy:predeploy
- pnpm exec playwright install chromium
- pnpm qa:emagrecimento:prod
- BASE_URL=https://www.mejoy.com.br pnpm mejoy:postdeploy

Se qualquer gate falhar, corrija e repita.

SMOKE MANUAL
Depois execute smoke manual real:
1. /emagrecimento com UTM de teste
2. triagem completa
3. WhatsApp obrigatório + consentimento
4. relatório
5. escolha de trilha
6. checkout
7. cobrança teste Asaas
8. handoff ZapVida

HANDOFF E SUPABASE
Comprove:
- redirectUrl válido
- callback assinado
- handoff_events gravando em produção
- migration 20260404154500_handoff_events.sql aplicada em produção

ASAAS
Comprove em cobrança teste:
- emagrecimento_trilha
- emagrecimento_principio
- UTMs

ENVS
Revise no Vercel:
- Supabase
- Asaas
- HANDOFF_TOKEN_SECRET
- NEXT_PUBLIC_ZAPVIDA_HANDOFF_URL
- TTL
- GA4
- envs de preço relevantes

COMPLIANCE E OFERTA
Liste separadamente o que depende de owner humano:
- preço aprovado
- oferta mínima v1 aprovada
- claims/compliance aprovados

CRITÉRIO
Não chame de launch oficial por causa de build ou smoke superficial.
Só chame de launch oficial se houver evidência concreta de produção, handoff, Asaas, Supabase, envs e aprovação humana mínima.

FORMATO FINAL
1. STATUS GERAL
2. TABELA DE FONTE DE VERDADE
3. GATES RODADOS
4. SMOKE MANUAL
5. HANDOFF
6. SUPABASE
7. ASAAS
8. ENVS
9. P0 ABERTOS
10. VEREDITO FINAL

Veredito final permitido:
- PRONTO PARA LAUNCH OFICIAL
- NÃO PRONTO PARA LAUNCH OFICIAL
```

## 11. Próxima ação única mais inteligente

Executar no Cursor, agora, a Etapa 0:

- provar a correspondência exata entre workspace local, repo Git, branch `main`, SHA alvo, deployment Vercel e domínio `mejoy.com.br`

Se isso não estiver fechado, todo o resto continua vulnerável a erro de contexto.
