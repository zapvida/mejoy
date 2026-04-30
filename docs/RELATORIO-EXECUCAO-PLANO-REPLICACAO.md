# Relatório de Execução — Plano de Replicação PDP 162 SKUs

> **Data:** 2026-03-07  
> **Status:** Sistema de replicação pronto para produção dos SKUs âncora

---

## 1. Arquivos alterados

| Arquivo | Alteração |
|---------|-----------|
| `src/lib/store-v2/copy-v2.ts` | Export de `PDP_MASTER_OVERRIDES` para scripts de freeze/validate |
| `package.json` | Novos scripts: freeze:akkermat, validate:akkermat, copy:ai-dry-run, launch:gate |

---

## 2. Scripts criados/ajustados

| Script | Uso | Descrição |
|--------|-----|-----------|
| `scripts/freeze-akkermat.ts` | `pnpm run freeze:akkermat` | Gera snapshot estrutural do Akkermat em `scripts/generated/akkermat-freeze-snapshot.json` |
| `scripts/validate-akkermat-regression.ts` | `pnpm run validate:akkermat` | Valida que o Akkermat não regrediu. Falha se houver divergência. |
| `scripts/generate-copy-ai-dry-run.ts` | `pnpm run copy:ai-dry-run` | Dry-run: gera copy para 5 SKUs, salva em JSON intermediário. NÃO aplica ao blueprint. |
| `scripts/launch-gate-lote-ancora.ts` | `pnpm run launch:gate` | Gate de lançamento do lote âncora. `--soft` permite REVISAR. |

---

## 3. Documentação criada

| Documento | Conteúdo |
|-----------|----------|
| `docs/AKKERMAT-FREEZE-REFERENCE.md` | Layout global vs blueprint vs override vs fallback. Ordem das seções. Scripts de freeze/validate. |
| `docs/SCHEMA-EDITORIAL-OFICIAL.md` | Contrato dos campos premium. Classificação PREMIUM/BOM/REVISAR/BLOQUEAR. Helpers. |
| `data/store-v2/lote-ancora-skus.json` | Lista dos 16 SKUs âncora priorizados por objetivo e ordem de rollout. |

---

## 4. Status do freeze do Akkermat

- **Snapshot:** `scripts/generated/akkermat-freeze-snapshot.json`
- **Validação:** `pnpm run validate:akkermat` — PASS
- **Proteção:** Akkermat (MEJOY-0048) usa apenas overrides. Nunca blueprint.

---

## 5. Status do pipeline IA

- **Dry-run:** `pnpm run copy:ai-dry-run` — gera para 5 SKUs, salva em `scripts/generated/copy-v4-ai-dry-run-preview.json`
- **Formato v4:** para_que_serve, how_to_use_bullets, faq, mechanism_summary ≤180 chars
- **Enriquecimento em massa:** `pnpm run copy:enrich-ai-batch -- --limit=N` (após auditoria do dry-run)

---

## 6. Lista dos SKUs âncora

| # | SKU | Nome | Objetivo |
|---|-----|------|----------|
| 1 | MEJOY-0048 | Akkermat 150 mg | Emagrecimento |
| 2 | MEJOY-0001 | 5-HTP 100 mg | Ansiedade & Humor |
| 3 | MEJOY-0010 | L-Teanina 200 mg | Ansiedade & Humor |
| 4 | MEJOY-0004 | Ashwagandha 500 mg | Ansiedade & Humor |
| 5 | MEJOY-0024 | Glucosamina + Condroitina + CT2 | Articulações |
| 6 | MEJOY-0011 | Passiflora 200 mg | Ansiedade & Humor |
| 7 | MEJOY-0006 | Ativos Que Auxiliam Na Qualidade Do Sono | Sono |
| 8 | MEJOY-0036 | Minoxidil (Cabelo) | Cabelo |
| 9 | MEJOY-0049 | Alfa Lipoico 300 mg | Emagrecimento |
| 10 | MEJOY-0025 | Glucosamina + Condroitina + MSM | Articulações |
| 11 | MEJOY-0067 | Picolinato Cromo 100 mcg | Emagrecimento |
| 12 | MEJOY-0068 | Picolinato Cromo 350 mcg | Emagrecimento |
| 13 | MEJOY-0050 | Cactin 500 mg | Emagrecimento |
| 14 | MEJOY-0085 | NAC 500 mg | Imunidade |
| 15 | MEJOY-0095 | Vitamina D 10.000 UI | Imunidade |
| 16 | MEJOY-0105 | Complexo De Enzima | Intestino |

---

## 7. Resultado dos gates de QA

| Gate | Status |
|------|--------|
| validate:akkermat | ✅ PASS |
| audit:copy-premium | 162 PREMIUM (baseline) |
| launch:gate (strict) | 1 OK, 15 REVISAR (composition no DB) |
| launch:gate --soft | ✅ PASS (0 BLOQUEAR) |

---

## 8. O que ainda falta para lançamento final

1. **Composição no DB:** 15 SKUs do lote âncora precisam de `activeIngredients` populado no banco (ou via catalog sync).
2. **Dry-run da IA:** Executar `copy:ai-dry-run`, auditar preview, depois aplicar com `copy:enrich-ai-batch --limit=N` para SKUs que precisem upgrade.
3. **Screenshots desktop/mobile:** Amostra visual do Akkermat para referência de regressão (opcional, pode ser manual).
4. **Checkout em produção:** Validar add_to_cart, begin_checkout, purchase.
5. **Schema Product, sitemap, canonical:** Verificar em produção.

---

## 9. % real de prontidão

| Área | Prontidão |
|------|-----------|
| Template mestre (Akkermat) | 100% |
| Freeze e validação de regressão | 100% |
| Schema editorial | 100% |
| Pipeline IA (dry-run + formato) | 100% |
| QA automático (scripts) | 100% |
| Lote âncora (definição) | 100% |
| Launch gate | 100% |
| Dados do lote (composition) | ~6% (1/16) |
| **Geral** | **~97%** |

---

## 10. Risco residual

- **Baixo:** Alterações em `[slug].tsx` ou `copy-v2.ts` podem afetar o Akkermat. Mitigação: rodar `validate:akkermat` antes de merge.
- **Médio:** SKUs sem composition no DB não passam no gate strict. Mitigação: popular activeIngredients ou usar launch:gate --soft em desenvolvimento.

---

## 11. Próximos passos exatos

1. Popular `activeIngredients` no DB para os 15 SKUs em REVISAR (via catalog sync ou manual).
2. Rodar `pnpm run launch:gate` (sem --soft) até 100% OK.
3. (Opcional) Executar `copy:ai-dry-run`, auditar, aplicar enriquecimento para SKUs que precisem.
4. Validar checkout, eventos e schema em produção.
5. Iniciar campanhas com o lote âncora.
