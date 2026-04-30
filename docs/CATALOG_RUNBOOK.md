# Catalog Runbook — Migração MJOY → MEJOY

## Visão geral

- **Apply:** `scripts/generated/catalog-apply.sql` — INSERT MEJOY-* + soft-disable MJOY-*
- **Rollback:** `scripts/generated/catalog-rollback.sql` — DELETE MEJOY-* + reativar MJOY-*
- **Validação:** `pnpm catalog:validate` (HTTP) + SQL manual no Supabase

---

## Pré-requisitos

1. CSVs em `data/store-v2/`:
   - `catalogo_mejoy_validado_v2.csv`
   - `pricing-content-v3-validado.csv`
2. **Quando houver alteração de normalização/copy:** rodar `pnpm catalog:pricing:validated` antes de `pnpm catalog:sql`
3. Rodar `pnpm catalog:sql` (gera SQL + report em `scripts/generated/`)
4. **Nota:** `scripts/generated/` é gerado localmente e não é versionado (gitignore)
5. Acesso ao Supabase SQL Editor (produção)

---

## Passo 1 — Preview / Staging

1. Rodar `pnpm catalog:dry`
2. Revisar `scripts/generated/catalog-report.json` (contagens, sensíveis, slugs)
3. Em ambiente de teste (staging), aplicar `catalog-apply.sql` no Supabase
4. Rodar `BASE_URL=<staging> pnpm catalog:validate`
5. Fazer compra PIX de teste (valor mínimo)

---

## Passo 2 — Produção (Apply)

1. **Se houver alterações de normalização:** rodar `pnpm catalog:pricing:validated` e `pnpm catalog:sql` antes de aplicar
2. **Backup:** Exportar `store_v2_products` e `store_v2_product_variants` (opcional)
3. No **Supabase SQL Editor**, colar e executar o conteúdo de `scripts/generated/catalog-apply.sql`
4. Verificar: `SELECT COUNT(*) FROM store_v2_products WHERE sku LIKE 'MEJOY-%' AND status='active';` → 162
5. Verificar: `SELECT COUNT(*) FROM store_v2_products WHERE sku LIKE 'MJOY-%' AND status='active';` → 0

---

## Passo 3 — Validação HTTP

```bash
BASE_URL=https://www.mejoy.com.br pnpm catalog:validate
```

---

## Passo 4 — Compra PIX real

1. Acessar https://www.mejoy.com.br
2. Navegar até um produto MEJOY (ex.: /p/5-htp-100-mg-60-capsulas)
3. Adicionar ao carrinho
4. Ir para checkout
5. Preencher dados e pagar com PIX
6. **Verificar:**
   - Webhook recebido (logs Vercel / Asaas)
   - Pedido em `store_v2_orders` com status PAID
   - Admin: https://www.mejoy.com.br/admin/store-v2/orders — pedido aparece
   - Email de confirmação enviado
   - WhatsApp (se configurado)

---

## Passo 5 — Fulfillment (entrega)

1. Admin: marcar pedido como "Em preparação" → "Enviado"
2. Inserir tracking (código + URL)
3. Sistema envia email "Seu pedido foi enviado"
4. Cliente acompanha em /dashboard ou /pedidos/[orderId]

---

## Rollback imediato

Se algo der errado:

1. No Supabase SQL Editor, executar `scripts/generated/catalog-rollback.sql`
2. Catálogo volta ao estado anterior (MJOY-* ativo, MEJOY-* removido)

---

## Checklist GO-LIVE

- [ ] `pnpm catalog:dry` OK
- [ ] Report: 162 MEJOY, 9 sensíveis
- [ ] Apply SQL executado no Supabase
- [ ] DB checks: 162 MEJOY ativos, 0 MJOY ativos
- [ ] `pnpm catalog:validate` OK
- [ ] Compra PIX real concluída
- [ ] Pedido em admin
- [ ] Webhook + email OK
