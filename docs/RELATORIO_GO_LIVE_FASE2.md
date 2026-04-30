# Relatório GO-LIVE — Fase 2 (Token-Protect + Quality Gates)

**Data:** 2026-03-05  
**Status:** ✅ Concluído

---

## 1. RESUMO DO QUE MUDOU

### scripts/generate-pricing-validated.ts
- **Tokens protegidos:** 5-HTP, NAC, KSM 66, HCl, UI, UFC, mg, mcg, mL, g substituídos por placeholders Unicode (\uE001–\uE00A) ANTES do titleCase, restaurados DEPOIS
- **Variações tratadas:** "5 - htp", "5htp", "5 HTP" → placeholder → "5-HTP"
- **Correção gramatical:** `para apoia` → `para apoiar` (defensiva final)
- **Anti-titlecase-feio:** Typos para MáLico→Málico, MagnéSio→Magnésio, EquilíBrio→Equilíbrio, FóRmula→Fórmula
- **collapseSpaces:** Aplicado em nome, description, seoTitle, seoDescription
- **Quality Gate:** Script falha (exit 1) se CSV contiver: 5-Htp, para apoia, MáLico, MagnéSio, EquilíBrio, FóRmula, ou espaços duplos

### scripts/catalog-engine.ts
- **fixBaseNameForSlug:** Mantido (ASWHAGANDA→Ashwagandha, INDIANDO→Indiano)
- **slugDiffsTop30:** Report inclui comparação com run anterior (até 30 slugs alterados)

### scripts/validate-catalog.sh
- **Quality Gate local:** Se pricing-content-v3-validado.csv existir, falha se grep encontrar 5-Htp, para apoia, MáLico ou MagnéSio

---

## 2. OUTPUTS DOS COMANDOS

```
$ pnpm catalog:pricing:validated
✅ Gerado data/store-v2/pricing-content-v3-validado.csv com 162 SKUs

$ pnpm catalog:sql
✅ Catalog Engine
   MEJOY: 162 | Sensíveis: 9

$ grep -R "5-Htp" data/store-v2/pricing-content-v3-validado.csv
OK (nenhuma ocorrência)

$ grep -E "para apoia[^r]|para apoia " data/store-v2/pricing-content-v3-validado.csv
OK (nenhuma ocorrência)

$ grep -E "MáLico|MagnéSio" data/store-v2/pricing-content-v3-validado.csv
OK (nenhuma ocorrência)

$ pnpm lint && pnpm build
✅ OK
```

---

## 3. CHECKLIST GO/NO-GO

| # | Check | Resultado |
|---|-------|-----------|
| A | CSV não contém "5-Htp" | ✅ PASS |
| B | CSV não contém "para apoia" | ✅ PASS |
| C | CSV não contém MáLico/MagnéSio | ✅ PASS |
| D | Siglas preservadas (5-HTP, NAC, HCl, mg, etc.) | ✅ PASS |
| E | pnpm lint && pnpm build | ✅ PASS |
| F | Quality Gate no script (exit 1 em regressão) | ✅ PASS |

---

## 4. DECISÃO

**GO/NO-GO: GO** ✅

Todos os itens A–F passaram. O catálogo está premium, humano e consistente, com travas anti-regressão.

---

## 5. PRÓXIMOS PASSOS MANUAIS (deixar por último)

1. **Supabase (se slugs/copy mudaram):**
   - `pnpm catalog:pricing:validated`
   - `pnpm catalog:sql`
   - Executar `catalog-rollback.sql` e depois `catalog-apply.sql`

2. **Deploy:** `git push origin main`

3. **Validação em produção:** `BASE_URL=https://www.mejoy.com.br pnpm catalog:validate`

4. **Compra PIX real:** Produto não sensível → validar webhook + admin + status PAID + instrução de entrega
