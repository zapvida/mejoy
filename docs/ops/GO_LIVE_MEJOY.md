# Go Live MeJoy

## Fonte única — pricing programas emagrecimento (1/3/6 meses)
- Números e parcelas: `src/config/zapfarm/emagrecimento-plans.ts`
- Checkout MeJoy: `src/pages/emagrecimento/checkout.tsx` (deriva de `emagrecimentoPlans`)
- LP/catálogo ZapFarm (`ZAPFARM_PRODUCTS.emagrecimento`): `price` e `unitPrice` sincronizados via `getPlanById` — não editar valores à mão em `products.ts` para estes planos
- Cobrança real: envs Asaas (`ASAAS_PRICE_*` em `emagrecimento-plans`) devem refletir os mesmos totais no painel Asaas

## Pré-deploy (repo, um comando)
```bash
pnpm mejoy:predeploy
```
Equivale a: lint → typecheck → `test:handoff` → `validate:handoff:bundle` → build.

Antes do deploy com secrets injectados (CI ou máquina com `.env` de preview/prod):
```bash
pnpm validate:handoff:env
```

## Pós-deploy (produção ou preview com URL)
```bash
BASE_URL=https://www.mejoy.com.br pnpm mejoy:postdeploy
```
Equivale a: `qa:emagrecimento:prod` → `smoke:checkout` → `soft-launch:gate` → `official-launch:gate` → `tracking:launch:gate`.

## Gates obrigatórios (detalhado; já cobertos por `mejoy:predeploy` + `mejoy:postdeploy` exceto E2E)
- `pnpm lint`
- `pnpm build`
- `pnpm validate:handoff:bundle`
- `pnpm test:handoff`
- `pnpm qa:emagrecimento:prod`
- `BASE_URL=https://www.mejoy.com.br pnpm smoke:checkout`
- `BASE_URL=https://www.mejoy.com.br pnpm soft-launch:gate`
- `BASE_URL=https://www.mejoy.com.br pnpm official-launch:gate`
- `BASE_URL=https://www.mejoy.com.br pnpm tracking:launch:gate`
- `CI=1 PRODUCTION_URL=https://www.mejoy.com.br pnpm test:emagrecimento` (opcional se flaky)
- `CI=1 PRODUCTION_URL=https://www.mejoy.com.br pnpm test:responsive` (opcional se flaky)

## Pendências externas mínimas
- Aplicar migration `20260404154500_handoff_events.sql`
- Provisionar envs de handoff em preview/prod
- Implementar consumo/callback no ZapVida
- Definir callback pós-farmácia/ZapFarm
- Aprovação jurídico/compliance
- Aprovação final de assets/creatives

## Rollout
- 10% tráfego
- 30% após 24h sem regressão
- 60% após estabilidade do handoff/status
- 100% apenas com callback externo confiável

## Observabilidade
- `/api/admin/handoff?days=7`
- `public.handoff_events`
- erros de API `/api/handoff/*`
- taxa relatório -> create -> accepted -> consult_completed

## Verificações manuais de go-live
- GTM Preview mostra apenas a taxonomia canônica do launch (`lp_view`, `triage_started`, `triage_completed`, `report_viewed`, `cta_clinical_handoff`, `handoff_created`)
- GA4 DebugView recebe 1 evento por ação crítica, sem duplicidade de `page_view` ou `handoff_created`
- fluxo de teste com `gclid` preserva `gclid`, `msclkid` e `origin_utm_*` no `redirectUrl`
- relatório gera `handoffId`
- `redirectUrl` contém `handoff`, `handoff_id`, `correlation_id`
- `public.handoff_events` e `/api/admin/handoff` mostram o mesmo `correlation_id` do fluxo validado
- callback assinado retorna `200`
- reprocessamento idempotente não duplica caso
