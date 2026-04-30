# Relatório GO-LIVE — Fase 1 (Patch Premium)

**Data:** 2026-03-05  
**Status:** ✅ Concluído

---

## 1. STATUS POR ÁREA (com %)

| Área | Status | % |
|------|--------|---|
| DB catálogo (já aplicado) | ✅ 162 MEJOY ativos, 0 MJOY ativos | 100% |
| Pipeline (engine + scripts) | ✅ Patch aplicado, validações endurecidas | 100% |
| Normalização premium (copy) | ✅ "para apoiar", collapseSpaces, siglas preservadas | 100% |
| Front pronto para deploy | ✅ Rotas /c novas no código (menopausa-tpm, lipedema) | 100% |
| Pronto para venda | ⏳ Dependente da compra PIX real | 0% |

**Geral:** ~97% pronto para GO-LIVE (após deploy + compra PIX → 100%).

---

## 2. CHECKLIST GO/NO-GO

| # | Check | Resultado |
|---|-------|-----------|
| 1 | `grep "para apoia "` no CSV = 0 | ✅ PASS |
| 2 | `grep "5-Htp"` no CSV = 0 | ✅ PASS |
| 3 | Slugs sem aswhaganda/indiando | ✅ PASS |
| 4 | validate-catalog falha em categoria 404 | ✅ PASS |
| 5 | scripts/generated/ e sitemap no gitignore | ✅ PASS |
| 6 | catalog:pricing:validated no package.json | ✅ PASS |
| 7 | pnpm lint | ✅ PASS |
| 8 | pnpm build | ✅ PASS |

---

## 3. ARQUIVOS ALTERADOS

- `scripts/generate-pricing-validated.ts` — Typos (para apoia→apoiar), collapseSpaces, siglas (KSM 66, NAC, HCl)
- `scripts/catalog-engine.ts` — fixBaseNameForSlug, validação slugs proibidos
- `scripts/validate-catalog.sh` — Hard fail em Home, /c/sono, /c/menopausa-tpm, /c/lipedema
- `.gitignore` — public/sitemap-0.xml, scripts/generated/
- `package.json` — script catalog:pricing:validated
- `docs/CATALOG_RUNBOOK.md` — Passo catalog:pricing:validated, nota sobre scripts/generated
- `data/store-v2/pricing-content-v3-validado.csv` — Regenerado com normalização

**Removidos do tracking (gitignore):**
- `scripts/generated/*` (catalog-apply.sql, catalog-rollback.sql, catalog-report.json, etc.)
- `public/sitemap-0.xml`

---

## 4. O QUE AINDA É MANUAL (deixar por último)

| # | Passo | Descrição |
|---|-------|-----------|
| M1 | **Supabase SQL** | Se slugs mudaram: executar `catalog-rollback.sql` e depois `catalog-apply.sql` no Supabase. Antes: rodar `pnpm catalog:sql` para gerar os arquivos em `scripts/generated/`. |
| M2 | **Deploy** | `git push origin main` → deploy automático na Vercel |
| M3 | **Validação em produção** | `BASE_URL=https://www.mejoy.com.br pnpm catalog:validate` — deve retornar 200 em Home, /c/sono, /c/menopausa-tpm, /c/lipedema |
| M4 | **Compra PIX real** | Produto não sensível → validar webhook + admin + status PAID + instrução de entrega |

---

## 5. COMANDOS EXECUTADOS

```bash
pnpm catalog:pricing:validated   # ✅ 162 SKUs
pnpm catalog:sql                 # ✅ MEJOY: 162 | Sensíveis: 9
grep -c "para apoia " ...        # 0 ✅
grep -c "5-Htp" ...              # 0 ✅
jq ... | grep aswhaganda|indiando # sem saída ✅
pnpm lint && pnpm build          # ✅
```

---

## 6. PRÓXIMOS PASSOS

1. **Antes do deploy:** Rodar `pnpm catalog:sql` (gera SQL em scripts/generated/)
2. **Se slugs mudaram:** Aplicar rollback + apply no Supabase
3. **Deploy:** `git push origin main`
4. **Validação:** `BASE_URL=https://www.mejoy.com.br pnpm catalog:validate`
5. **Compra PIX real** conforme runbook

---

**Fase 2 (PDP premium + Copy Engine):** Fica para pós-go-live.
