# Plano Definitivo — Migração Catálogo MJOY-* → MEJOY-*

**Modo ASK — Fechado sem execução.**  
**Data:** 2025-03-05  
**Status:** GO (após checklist aprovado)

---

## (1) ARQUIVOS INSPECIONADOS

| Categoria | Arquivo | O que confirma |
|-----------|---------|----------------|
| **Catálogo (filtros active/status)** | `src/lib/store-v2/catalog.ts` | `status: 'active'`, `active: true` em todas as queries de produtos |
| **Catálogo (objective/slug)** | `src/lib/store-v2/slugs.ts` | `OBJECTIVES`, `slugToObjective`, `objectiveToSlug` |
| **Home sections** | `src/lib/store-v2/catalog.ts` → `getHomeSections()` | Agrupa por `objective`, usa `slugMap` para rotas |
| **Rotas PDP** | `src/pages/p/[slug].tsx` | PDP por slug; usa `getProductBySlug` |
| **Rotas categorias** | `/c/[objetivo]` | `objective` do DB → slug da URL via `slugToObjective` |
| **Cart (adicionar)** | `src/pages/api/store-v2/cart/index.ts` | Busca por `slug`, filtro `status: 'active', active: true` |
| **Cart (listar)** | `src/pages/api/store-v2/cart/index.ts` | Busca por `productId`, filtro `status: 'active'` |
| **Checkout / PaymentIntent** | `src/pages/api/store-v2/create-payment.ts` | Valida `product.status === 'active'`, preço do DB; `assertPriceAudit`; OrderItem por `productId` |
| **Webhook pagamento** | `src/pages/api/webhooks/asaas.ts` → `processStoreV2Payment` | Atualiza `Order.status`; envia email + WhatsApp; usa `order.snapshot` (não SKU) |
| **Admin pedidos** | `src/pages/admin/store-v2/orders.tsx` | Lista pedidos; PATCH status/tracking |
| **Admin API** | `src/pages/api/admin/store-v2/orders/` | CRUD pedidos |
| **Import CSV** | `src/lib/catalog/import-csv.ts` | `findUnique({ where: { sku } })` para upsert; `FORMS_ALLOWED`, `WHATSAPP_FLOWS` |
| **Schema** | `prisma/schema.prisma` | Product: `requiresRx`, `requiresValidation`, `whatsappFlow`, `status`, `active` |
| **PDP JSON-LD** | `src/pages/p/[slug].tsx` | Usa `product.sku` em schema.org (SEO) |
| **Pricing audit** | `src/lib/pricing/audit.ts` | `assertPriceAudit` valida total vs gateway |

---

## (2) DATA CONTRACT CONGELADO

### store_v2_products (Product)

| Campo | Obrigatório | Default | Limites |
|-------|-------------|---------|--------|
| id | sim (cuid) | — | — |
| sku | sim | — | UNIQUE |
| slug | sim | — | UNIQUE |
| name | sim | — | — |
| objective | sim | — | Chave estável (não renomear) |
| formKey | não | — | Permitidos: caps, powder, topical, sachet, drops, cream, shampoo |
| status | sim | 'draft' | 'draft' \| 'active' |
| active | sim | true | — |
| shortBenefit | não | — | — |
| description | não | — | — |
| seoTitle | não | — | — |
| seoDescription | não | — | **≤ 155 chars** (hard fail se exceder) |
| requiresRx | sim | false | — |
| requiresValidation | sim | false | — |
| whatsappFlow | não | 'none' | 'none' \| 'rx_upload' |
| packSizeDisplay | não | — | — |
| formDisplay | não | — | — |
| Outros | — | — | Ver schema |

**Campos que podem ser null sem quebrar:** shortBenefit, description, seoTitle, seoDescription, formKey, packSizeDisplay, formDisplay, category, shortName, activeIngredients, tags, images, badges.

### store_v2_product_variants (ProductVariant)

| Campo | Obrigatório | Default | Limites |
|-------|-------------|---------|--------|
| id | sim (cuid) | — | — |
| productId | sim | — | FK Product |
| sku | sim | — | UNIQUE |
| priceCents | não | — | **> 0** e **≠ 9900** (mock) |
| name | não | — | — |
| stock | não | 0 | — |

**Regra:** Se `priceCents` null, usa `PriceVersion`. Para migração: sempre preencher `priceCents` na variant.

### Limites práticos

- **slug:** UNIQUE, lowercase, hífens; identidade pública estável.
- **seoDescription:** ≤ 155 caracteres (SEO).
- **priceCents:** > 0 e ≠ 9900 (bloquear mock).
- **objective:** valor exato do DB; não alterar existentes.

---

## (3) DECISÃO FINAL DE MIGRAÇÃO

### INSERT MEJOY + soft-disable MJOY

**Justificativa:**
- `OrderItem` usa `productId` (não SKU). Pedidos históricos referenciam IDs de produtos MJOY.
- Soft-disable (`active=false`, `status='draft'`) mantém produtos no banco; histórico de pedidos continua válido. (Schema não tem 'archived'; usa draft.)
- DELETE quebraria FK em `OrderItem` (Cascade não é desejado para histórico).

### Busca por SKU

| Local | Uso | Impacto |
|-------|-----|---------|
| `import-csv.ts` | `findUnique({ where: { sku } })` | Import de novos produtos; MEJOY-* não existe ainda → INSERT |
| `p/[slug].tsx` | JSON-LD schema.org | Apenas exibição; SKU do produto atual |
| `generate-pricing-content-sql.ts` | UPDATE por SKU | Script de pricing; MEJOY-* será novo |
| `FormulasTable.tsx` (ZapFarm) | Contexto diferente | Não afeta Store V2 |

**Compat:** Nenhuma. Cart/checkout usam `productId`/`slug`. SKU é identidade de produto, não de pedido.

### objective "DB key" + displayName no front

- **objective** no banco = valor exato (ex.: "Emagrecimento & Metabolismo", "Ansiedade & Humor").
- **slug** da URL = derivado (ex.: `emagrecimento-metabolismo`, `ansiedade-humor`).
- `slugs.ts` e `catalog.ts` mapeiam slug → objective. DisplayName só no front (nunca alterar objective no DB).

---

## (4) MAPEAMENTO NICHE → OBJECTIVE (DB)

| Niche (catalogo CSV) | objective (DB) |
|----------------------|----------------|
| Ansiedade e Estresse | Ansiedade & Humor |
| Articulação | Articulações |
| Capilar | Cabelo |
| Emagrecimento | Emagrecimento & Metabolismo |
| Hepato Detox | Detox & Fígado |
| Imunidade | Imunidade |
| Intestino | Intestino |
| Libido e Disposição | Hormonal & Libido |
| Lipedema | Lipedema *(novo)* |
| Menopausa/TPM | Menopausa & TPM *(novo)* |
| Sono | Sono |

**Novas categorias:** Adicionar em `slugs.ts` e `catalog.ts`:
- `menopausa-tpm` → "Menopausa & TPM"
- `lipedema` → "Lipedema"

---

## (5) PRODUTOS SENSÍVEIS (requiresRx / whatsappFlow)

| base_name | SKUs | requiresRx | whatsappFlow |
|-----------|------|------------|--------------|
| Tadalafila | MEJOY-0126, 0127, 0128 | true | rx_upload |
| Orlistat | MEJOY-0066 | true | rx_upload |
| Minoxidil* | MEJOY-0036, 0037, 0038, 0039, 0040 | true | rx_upload |

\* Qualquer produto com "Minoxidil" no nome.

---

## (6) CATALOG ENGINE — PIPELINE DEFINITIVO

### Script único: `scripts/catalog-engine.ts`

**Entrada:**
- `data/store-v2/catalogo_mejoy_validado_v2.csv` (ou copiar de `~/Desktop/XXcatalogo_mejoy_validado_v2.csv`)
- `data/store-v2/pricing-content-v3.csv` (ou copiar de `~/Desktop/XXpricing-content-v3.csv`)

**Fluxo:**
1. **validate**
   - sku único
   - slug único (após normalização)
   - objective mapeado (niche → objective)
   - formKey em `['caps','powder','topical','sachet','drops','cream','shampoo']`
   - priceCents > 0 e ≠ 9900
   - Campos obrigatórios presentes
   - seoDescription ≤ 155
   - **Fail-fast:** qualquer erro → exit 1

2. **normalize**
   - Title Case em nome/seoTitle (exceções: NAC, KSM 66, 5-HTP, mg/mL/UI/mcg/UFC/HCl, L-Teanina)
   - Typos fixos: ASWHAGANDA→Ashwagandha, L TEANINE→L-Teanina, IOMBINA→Yohimbina, etc.
   - slug: preferir `seo_slug` do catálogo; senão `base_name-dose-pack` determinístico

3. **generate**
   - `scripts/generated/catalog-apply.sql` (BEGIN; INSERT products + variants; UPDATE MJOY-* SET active=false, status='draft'; COMMIT;)
   - `scripts/generated/catalog-rollback.sql` (BEGIN; DELETE MEJOY-*; UPDATE MJOY-* SET active=true, status='active'; COMMIT;)

4. **report**
   - `scripts/generated/catalog-report.json`: contagem MEJOY ativos, MJOY inativos, diff (novos/removidos/preço), lista sensíveis

5. **--dry-run**
   - Gera SQL + report sem aplicar

### Script bash: `scripts/validate-catalog.sh`

- DB checks (via SQL ou script): count MEJOY ativos, 0 MJOY ativos, 0 price=0, 0 price=9900
- HTTP: amostra 20 slugs retornam 200 e preço correto
- Checkout smoke: criar carrinho e confirmar totals (sem cobrar); compra PIX real no runbook

### Runbook: `docs/CATALOG_RUNBOOK.md`

- Passos manuais no Supabase (apply/rollback)
- Preview → staging → prod
- Compra PIX real: webhook, pedido em store_v2_orders, itens corretos, status PAID
- Fulfillment: status, tracking, comunicação

### package.json

```json
"catalog:dry": "tsx scripts/catalog-engine.ts --dry-run",
"catalog:sql": "tsx scripts/catalog-engine.ts",
"catalog:validate": "bash scripts/validate-catalog.sh"
```

---

## (7) RISCOS REAIS + MITIGAÇÃO

| # | Risco | Mitigação |
|---|-------|-----------|
| 1 | Slug duplicado | Validação fail-fast; sufixo numérico determinístico se colisão |
| 2 | objective sem mapeamento | Tabela fixa niche→objective; fail se niche desconhecido |
| 3 | priceCents 0 ou 9900 | Validação obrigatória; reject |
| 4 | seoDescription > 155 | Truncar ou fail |
| 5 | requiresRx inexistente no schema | Já existe no Prisma |
| 6 | whatsappFlow inexistente | Já existe no Prisma |
| 7 | formKey inválido | Lista permitida; fail se fora |
| 8 | Categoria nova (Lipedema, Menopausa) sem rota | Adicionar em slugs.ts e catalog.ts antes do apply |
| 9 | PDP 404 para slug antigo (MJOY) | MJOY inativo; URLs antigas 404 (ou redirect se desejado) |
| 10 | Carrinho com MJOY antes do apply | create-payment rejeita (status!=='active') |
| 11 | Divergência preço front/backend | Backend é fonte; assertPriceAudit garante |
| 12 | Rollback incompleto | SQL em transação; testar rollback em staging |
| 13 | CSV com encoding errado | Validar UTF-8; BOM se necessário |
| 14 | Produto sensível sem requiresRx | Catalog engine marca na lista; validação manual |
| 15 | Home sections vazias para novas categorias | getHomeSections filtra por `byObjective.has(obj)`; adicionar Lipedema/Menopausa em `order` e `slugMap` |

---

## (8) SEQUÊNCIA DE COMMITS

| Commit | Conteúdo | Comando pós-commit |
|--------|----------|---------------------|
| 1 | Copiar CSVs para data/store-v2; criar pricing-content-v3-validado.csv | `pnpm lint && pnpm build` |
| 2 | Atualizar slugs.ts e catalog.ts (menopausa-tpm, lipedema) | `pnpm lint && pnpm build` |
| 3 | scripts/catalog-engine.ts + package.json scripts | `pnpm lint && pnpm build` |
| 4 | scripts/validate-catalog.sh + docs/CATALOG_RUNBOOK.md | `pnpm lint && pnpm build` |
| 5 | Ajustes finais (lint/build) | `pnpm lint && pnpm build` |

---

## (9) CHECKLIST GO / NO-GO

| # | Item | Critério | Se falhar |
|---|------|----------|-----------|
| 1 | CSVs existem | pricing-content-v3 e catalogo_mejoy_validado_v2 em data/store-v2 | Copiar de Desktop |
| 2 | catalog-engine --dry-run | Gera SQL + report sem erro | Corrigir validações |
| 3 | slug único | Nenhum slug duplicado no report | Ajustar seo_slug ou sufixo |
| 4 | objective mapeado | Todos os niches têm objective | Adicionar mapeamento |
| 5 | priceCents válido | 0 price=0, 0 price=9900 | Corrigir CSV |
| 6 | seoDescription ≤155 | Nenhum excedente | Truncar ou editar |
| 7 | formKey permitido | Todos em FORMS_ALLOWED | Corrigir form_key |
| 8 | slugs.ts atualizado | menopausa-tpm, lipedema | Adicionar em slugs.ts e catalog.ts |
| 9 | pnpm lint | 0 erros | Corrigir lint |
| 10 | pnpm build | Build OK | Corrigir erros TS |

**Se qualquer item falhar → NO-GO.** Corrigir antes de mudar para AGENT.

---

## (10) AGENT PROMPT RECOMENDADO

**Usar somente após GO aprovado.**

```
Você está no modo AGENT. Execute a migração do catálogo MJOY-* para MEJOY-* conforme o plano em docs/PLANO_MIGRACAO_CATALOGO_MEJOY_DEFINITIVO.md.

REGRAS:
1. Fail-fast: se qualquer validação falhar, pare e reporte.
2. NÃO alterar schema Prisma.
3. NÃO tocar em payment/webhook/admin (apenas usar).
4. NÃO fazer DELETE de MJOY-*; apenas soft-disable.

PASSOS (na ordem):
1. Copiar ~/Desktop/XXpricing-content-v3.csv e ~/Desktop/XXcatalogo_mejoy_validado_v2.csv para data/store-v2/ (renomear removendo XX).
2. Criar pricing-content-v3-validado.csv com Title Case, typos corrigidos, seoDescription ≤155.
3. Atualizar src/lib/store-v2/slugs.ts e src/lib/store-v2/catalog.ts com menopausa-tpm e lipedema.
4. Criar scripts/catalog-engine.ts conforme especificação no plano.
5. Criar scripts/validate-catalog.sh e docs/CATALOG_RUNBOOK.md.
6. Adicionar scripts ao package.json: catalog:dry, catalog:sql, catalog:validate.
7. Rodar pnpm catalog:dry e validar output.
8. Rodar pnpm lint && pnpm build.

NÃO aplique SQL em produção. O runbook descreve os passos manuais no Supabase.
```

---

*Documento gerado em modo ASK. Nenhuma alteração foi aplicada.*
