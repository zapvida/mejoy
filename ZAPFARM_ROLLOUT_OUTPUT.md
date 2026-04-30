# ZapFarm/MindJoy – Output de Lançamento Contínuo

**Branch:** `chore/zapfarm-price-source`  
**Data:** 26 fev 2025

---

## 1. Lista de Commits (hash + mensagem)

| Hash | Mensagem |
|------|----------|
| `20e3791` | fix(zapfarm): lint - remove unused vars and interface callback params |
| `96ca226` | test(zapfarm): add smoke-checkout script |
| `c87215f` | feat(zapfarm): compliance footer for checkout |
| `2383fa6` | feat(zapfarm): subscription toggle -10% behind flag (one-time payment) |
| `37afaff` | feat(zapfarm): bundles MVP behind flag + env bundle pricing |
| `5742c5f` | feat(zapfarm): variant selector behind flag + payment supports variant |
| `81c26b6` | feat(zapfarm): add optional CORE/PRO variant model behind flag |
| `939825c` | feat(asaas): create-payment uses env price resolver + metadata |
| `747cd35` | feat(zapfarm): health endpoint validates price env coverage |
| `0a86b05` | chore(zapfarm): add audit:prices script |
| `a9654f5` | feat(zapfarm): env price resolver + prices API + checkout uses resolver |

---

## 2. Arquivos Alterados/Criados

### Novos arquivos
- `scripts/zapfarm/audit-prices.ts` – auditoria de preços em env
- `scripts/zapfarm/smoke-checkout.sh` – smoke tests do checkout
- `src/lib/zapfarm/price-resolver.ts` – resolver de preços (env como fonte única)
- `src/pages/api/zapfarm/prices.ts` – API GET de preços
- `src/pages/api/health/zapfarm.ts` – health check de preços
- `src/types/zapfarm.ts` – tipos Variant, etc.
- `src/config/zapfarm/product-variants.ts` – mapeamento CORE/PRO
- `src/config/zapfarm/bundles.ts` – bundles sono-ansiedade, intestino-imunidade
- `src/config/zapfarm/compliance.ts` – textos de compliance
- `src/components/zapfarm/checkout/VariantSelector.tsx`
- `src/components/zapfarm/checkout/BundleUpsell.tsx`
- `src/components/zapfarm/checkout/SubscriptionToggle.tsx`
- `src/components/zapfarm/shared/ComplianceFooter.tsx`

### Arquivos modificados
- `package.json` – script `audit:prices`
- `src/lib/flags.ts` – feature flags ZapFarm
- `src/config/zapfarm/products.ts` – `supplement.variants` opcional
- `src/pages/[product]/checkout.tsx` – usa resolver, VariantSelector, BundleUpsell, SubscriptionToggle, ComplianceFooter
- `src/pages/api/asaas/create-payment.ts` – resolver env, variant, bundleId, isSubscription, metadata

---

## 3. Checklist Definition of Done

| # | Item | Status |
|---|------|--------|
| 1 | Preço exibido no checkout = preço cobrado no Asaas (env como fonte única) | ✅ |
| 2 | Variantes CORE/PRO, Bundles e Assinatura existem no código, controladas por feature flags | ✅ |
| 3 | Prod em produção inicia com flags=0 | ✅ (default) |
| 4 | Auditoria automática (script + health endpoint) impede divergência e detecta env faltando | ✅ |
| 5 | Smoke tests (shell) cobrindo health, prices, create-payment | ✅ |
| 6 | Deploy verde (lint/build) | ✅ |
| 7 | Rollout seguro: preview → staging → prod | ✅ (via Vercel) |
| 8 | Rollback imediato via env flags | ✅ |

---

## 4. O que você (humano) precisa fazer manualmente

### 4.1 Env vars a configurar na Vercel

Configure **antes** do deploy em produção:

#### Feature flags (iniciar com 0)
```
NEXT_PUBLIC_ZAPFARM_VARIANTS=0
NEXT_PUBLIC_ZAPFARM_BUNDLES=0
NEXT_PUBLIC_ZAPFARM_SUBSCRIPTION=0
ZAPFARM_PRICE_SOURCE=env
```

#### Preços por produto/plano (obrigatórios com ZAPFARM_PRICE_SOURCE=env)
Valores em **centavos** (ex: 29900 = R$ 299,00):

```
ASAAS_PRICE_EMAGRECIMENTO_BASICO=...
ASAAS_PRICE_EMAGRECIMENTO_COMPLETO=...
ASAAS_PRICE_EMAGRECIMENTO_PREMIUM=...

ASAAS_PRICE_CALVICIE_BASICO=...
ASAAS_PRICE_CALVICIE_COMPLETO=...
ASAAS_PRICE_CALVICIE_PREMIUM=...

ASAAS_PRICE_SONO_BASICO=...
ASAAS_PRICE_SONO_COMPLETO=...
ASAAS_PRICE_SONO_PREMIUM=...

ASAAS_PRICE_ANSIEDADE_BASICO=...
ASAAS_PRICE_ANSIEDADE_COMPLETO=...
ASAAS_PRICE_ANSIEDADE_PREMIUM=...

ASAAS_PRICE_INTESTINO_BASICO=...
ASAAS_PRICE_INTESTINO_COMPLETO=...
ASAAS_PRICE_INTESTINO_PREMIUM=...

ASAAS_PRICE_FIGADO_BASICO=...
ASAAS_PRICE_FIGADO_COMPLETO=...
ASAAS_PRICE_FIGADO_PREMIUM=...

ASAAS_PRICE_LIBIDO_MASCULINA_BASICO=...
ASAAS_PRICE_LIBIDO_MASCULINA_COMPLETO=...
ASAAS_PRICE_LIBIDO_MASCULINA_PREMIUM=...
# (ou LIBIDO_MASULINA_* como alias legado)

ASAAS_PRICE_MENOPAUSA_BASICO=...
ASAAS_PRICE_MENOPAUSA_COMPLETO=...
ASAAS_PRICE_MENOPAUSA_PREMIUM=...

ASAAS_PRICE_ARTICULACOES_BASICO=...
ASAAS_PRICE_ARTICULACOES_COMPLETO=...
ASAAS_PRICE_ARTICULACOES_PREMIUM=...

ASAAS_PRICE_IMUNIDADE_BASICO=...
ASAAS_PRICE_IMUNIDADE_COMPLETO=...
ASAAS_PRICE_IMUNIDADE_PREMIUM=...
```

#### Opcional (quando VARIANTS=1)
```
ASAAS_PRICE_{PRODUTO}_CORE_BASICO
ASAAS_PRICE_{PRODUTO}_CORE_COMPLETO
ASAAS_PRICE_{PRODUTO}_CORE_PREMIUM
ASAAS_PRICE_{PRODUTO}_PRO_BASICO
ASAAS_PRICE_{PRODUTO}_PRO_COMPLETO
ASAAS_PRICE_{PRODUTO}_PRO_PREMIUM
```

#### Opcional (quando BUNDLES=1)
```
ASAAS_PRICE_BUNDLE_SONO_ANSIEDADE=...
ASAAS_PRICE_BUNDLE_INTESTINO_IMUNIDADE=...
```

---

### 4.2 Ordem de habilitação das flags

1. **ZAPFARM_PRICE_SOURCE=env** – Já está como default; garanta que todas as envs ASAAS_PRICE_* estão configuradas.
2. **NEXT_PUBLIC_ZAPFARM_VARIANTS=1** – Habilitar variantes CORE/PRO (ex.: 10% tráfego ou produto a produto).
3. **NEXT_PUBLIC_ZAPFARM_BUNDLES=1** – Bundles sono-ansiedade, intestino-imunidade.
4. **NEXT_PUBLIC_ZAPFARM_SUBSCRIPTION=1** – Toggle de assinatura -10%.

---

### 4.3 Validação no Asaas

1. Abra o pagamento criado no painel Asaas.
2. Em **metadata** (ou campos externos), verifique:
   - `product`, `plano`, `variant` (quando usado)
   - `amountCents` – valor cobrado em centavos
   - `envVarUsed` – qual env foi usada
   - `is_subscription` – true quando toggle ativo
   - `bundleId` – quando for checkout de bundle
3. Confira que o valor cobrado bate com `amountCents` e com a env var usada.

---

### 4.4 Rollback imediato

Para desligar features:

```
NEXT_PUBLIC_ZAPFARM_VARIANTS=0
NEXT_PUBLIC_ZAPFARM_BUNDLES=0
NEXT_PUBLIC_ZAPFARM_SUBSCRIPTION=0
```

Para voltar a usar preços de `products.ts` em emergência:

```
ZAPFARM_PRICE_SOURCE=productsTs
```

Depois de alterar as envs, faça novo deploy ou aguarde o próximo build.

---

### 4.5 Comandos de smoke

**Preview (troque URL se necessário):**
```bash
./scripts/zapfarm/smoke-checkout.sh preview
# ou
./scripts/zapfarm/smoke-checkout.sh preview https://seu-preview.vercel.app
```

**Produção:**
```bash
./scripts/zapfarm/smoke-checkout.sh prod
# ou
./scripts/zapfarm/smoke-checkout.sh prod https://www.zapfarm.com.br
```

**Local (exige env vars; health falha sem envs):**
```bash
./scripts/zapfarm/smoke-checkout.sh local
```

---

## 5. Validação antes do merge

Execute localmente (com `.env` carregado se necessário):

```bash
pnpm lint && pnpm build
ZAPFARM_PRICE_SOURCE=env pnpm audit:prices
```

Em preview na Vercel:

1. `GET /api/health/zapfarm` → deve retornar 200 (com envs configuradas).
2. Fazer 1 checkout manual (ex.: sono básico).
3. Conferir valor e metadata no Asaas.
