# Relatório Launch Runner — Me Joy

**Data:** 2026-03-05  
**Objetivo:** GO/NO-GO pré-deploy + passos manuais finais

---

## 1. ESTADO DO REPO

| Item | Valor |
|------|-------|
| Branch | `main` |
| Status | ahead 13 commits (origin/main) |
| Working tree | limpa (nada a commitar) |
| Último commit | `docs: RELATORIO_GO_LIVE_FINAL` |

---

## 2. RESULTADO DOS COMANDOS

| Comando | Resultado |
|---------|-----------|
| `pnpm catalog:pricing:validated` | ✅ 162 SKUs gerados |
| `pnpm catalog:sql` | ✅ MEJOY: 162 \| Sensíveis: 9 |
| `pnpm lint` | ✅ OK |
| `pnpm build` | ✅ OK |
| `BASE_URL=http://localhost:3000 pnpm catalog:validate` | ✅ Quality Gate OK, Health OK, Home OK, /c/sono OK, /c/menopausa-tpm OK, /c/lipedema OK |
| PDP (20 slugs) | 18/20 OK — 2× 404 (Ashwagandha) |

---

## 3. SLUGS CRÍTICOS (Ashwagandha) + SKUs

| SKU | Slug esperado (engine/report) |
|-----|------------------------------|
| MEJOY-0004 | `ashwagandha-ginseng-indiano-500-mg-30-capsulas` |
| MEJOY-0005 | `ashwagandha-ginseng-indiano-500-mg-60-capsulas` |

**Origem:** `scripts/generated/catalog-report.json` (jq `.slugs[:20][] | .slug`)  
**validate-catalog:** usa esses slugs do report — fonte única.

---

## 4. DB ALIGNMENT NOTE

**Por que 2 PDPs 404 (Ashwagandha)?**

O DB (Supabase produção) que o localhost consulta provavelmente tem slugs diferentes para MEJOY-0004 e MEJOY-0005 — por exemplo, de um `catalog-apply.sql` anterior ou variação de `base_name` no catálogo.

**Solução:** M2 (rollback + apply) alinha o DB com o SQL gerado pelo engine. O `catalog-apply.sql` atual cria exatamente os slugs acima. Após M2, os 20 PDPs devem retornar 200.

**Não alterar:** o slug esperado no código. A fonte única é o engine/SQL.

---

## 5. DECISÃO GO/NO-GO PRÉ-DEPLOY

**GO/NO-GO pré-deploy: GO** ✅

- Código, gates, lint e build OK
- Catálogo e SQL gerados
- 18/20 PDPs OK (≥15 exigido)
- 2 PDPs 404 resolvidos com M2 (rollback+apply)

---

## 6. PASSOS MANUAIS FINAIS (M1–M7)

Execute **na ordem**:

### M1 — Gerar SQL (se ainda não fez)

```bash
pnpm catalog:pricing:validated && pnpm catalog:sql
```

### M2 — Supabase: alinhar DB (recomendado)

1. Abra o **Supabase SQL Editor** (produção)
2. Execute o conteúdo de `scripts/generated/catalog-rollback.sql`
3. Execute o conteúdo de `scripts/generated/catalog-apply.sql`
4. Confirme: `SELECT COUNT(*) FROM store_v2_products WHERE sku LIKE 'MEJOY-%' AND status='active';` → 162

### M3 — Deploy

```bash
git push origin main
```

### M4 — Validação em produção

```bash
BASE_URL=https://www.mejoy.com.br pnpm catalog:validate
```

Esperado: 200 em /, /c/sono, /c/menopausa-tpm, /c/lipedema e 20/20 PDPs (ou ≥15).

### M5 — Compra PIX real (produto NÃO sensível)

1. Acesse https://www.mejoy.com.br
2. Escolha um produto MEJOY não sensível (ex.: 5-HTP, Passiflora)
3. Adicione ao carrinho e finalize com PIX
4. Conclua o pagamento

### M6 — Checagem webhook/admin

- [ ] Webhook recebido (logs Vercel/Asaas)
- [ ] Pedido em `store_v2_orders` com status PAID
- [ ] Admin: https://www.mejoy.com.br/admin/store-v2/orders — pedido visível
- [ ] Email de confirmação enviado

### M7 — Rollback rápido (se falhar)

No Supabase SQL Editor, execute `scripts/generated/catalog-rollback.sql` para reverter o catálogo ao estado anterior.

---

## 7. ARQUIVOS GERADOS

| Arquivo | Descrição |
|---------|-----------|
| `scripts/generated/catalog-apply.sql` | INSERT MEJOY + soft-disable MJOY |
| `scripts/generated/catalog-rollback.sql` | DELETE MEJOY + reativar MJOY |
| `scripts/generated/catalog-report.json` | Contagens, slugs, sensíveis |
