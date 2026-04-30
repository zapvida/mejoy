# Contexto Codex Thread -> ZapVida (MeJoy)

- Data do vinculo: 2026-04-04
- Thread Codex: `codex://threads/019d599c-0fcf-7f41-9060-ea8862278eae`
- Thread ID: `019d599c-0fcf-7f41-9060-ea8862278eae`
- Workspace: `/Users/teobeckert/desenvolvimento/mejoy`
- Contexto principal: integracoes e decisoes de fluxo com CTA/atendimento ZapVida dentro do projeto MeJoy.

## Objetivo do vinculo

1. Manter continuidade entre conversas do Codex sem perder contexto funcional.
2. Ancorar o thread atual ao projeto MeJoy com foco em ZapVida.
3. Facilitar handoff para novos chats/agentes com ponto unico de referencia.

## Ancoras de codigo e testes

- Componente relacionado a CTA:
  - `src/components/relatorio/ZapVidaCTA.tsx`
- Testes E2E com regras ZapVida:
  - `tests/e2e/triage-gastro.spec.ts`
  - `tests/e2e/ctas.test.ts`
  - `tests/e2e/triage-cardiovascular.spec.ts`
- Variaveis de ambiente relevantes:
  - `.env.local` -> `NEXT_PUBLIC_URL_ZAPVIDA`
  - `.env.local` -> `NEXT_PUBLIC_PARTNER_ZAPVIDA_URL`

## Regra funcional que deve ser preservada

- Em cenarios de alerta/red flags, priorizar CTA ZapVida antes de outras opcoes, mantendo consistencia com os testes e documentacao existentes.

## Como continuar em proximas sessoes

1. Referenciar este arquivo e o thread ID ao iniciar novo chat no Codex.
2. Validar qualquer ajuste em links/UTM/ordem de CTA nos testes E2E citados.
3. Atualizar este documento sempre que houver mudanca de regra de negocio ZapVida.

## Registro desta solicitacao

- Solicitacao do usuario: vincular de forma inteligente o contexto deste chat ao projeto ZapVida/MeJoy.
- Status: vinculo criado.
