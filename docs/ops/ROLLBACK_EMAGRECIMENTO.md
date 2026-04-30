# Rollback Emagrecimento

## Objetivo
- Recuar a camada de handoff sem derrubar landing, triagem ou relatório.

## Estratégia 1. Rollback suave
- Voltar CTA principal para ZapVida direto.
- Manter `report` e `triage` funcionando.
- Parar de chamar `/api/handoff/create` no frontend.

## Estratégia 2. Rollback técnico
- Desligar integração com callback `/api/handoff/status`.
- Seguir com fallback por parceiro direto.
- Continuar gravando apenas analytics client-side.

## Estratégia 3. Rollback de deploy
- Voltar para o último deploy verde.
- Revalidar:
  - `pnpm lint`
  - `pnpm build`
  - `pnpm validate:handoff:bundle`
  - `BASE_URL=https://www.mejoy.com.br pnpm smoke:checkout`

## Sinais para acionar rollback
- 5xx repetido em `/api/handoff/create`
- 401/409 anômalo em `/api/handoff/status`
- queda real em relatório -> CTA -> handoff
- erro de bundle/manifests

## O que não muda no rollback
- Landing
- Triagem
- Relatório
- Checkout
- Responsividade
