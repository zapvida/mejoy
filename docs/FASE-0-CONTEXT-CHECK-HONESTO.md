# FASE 0 — Context Check Honesto

**Data:** 2025-03-06  
**Modo:** Auditor Pré-Lançamento Absoluto — Sem Autoengano

---

## 1. O QUE ESTÁ REALMENTE FORTE

| Área | Evidência | Nota |
|------|-----------|------|
| **Estrutura PDP** | Hero, bullets, preço, CTA, sticky desktop/mobile, galeria 5 img, frete, composição, advertências, FAQ | Código completo |
| **Busca** | Input header, autocomplete, ícone mobile → /search | Implementado |
| **Favoritos** | Coração, /favoritos, localStorage | Implementado |
| **Home** | Hero, TrustBar, carrosséis (Mais buscados, Mais vendidos, Novidades), seções por objetivo | Implementado |
| **Copy pipeline** | getHeroBullets, getBenefitsStructured, getMechanismSummaryForPdp | copy-v2.ts |
| **PDP Master** | MEJOY-0010 com overrides premium (heroBullets, mechanismSummary) | Único com copy curada |
| **Blueprint v4** | 162 linhas, hero_benefit, description_md, faq, cautions | Dados editoriais presentes |
| **Lint/Build** | Sem erros | pnpm lint, pnpm build |

---

## 2. O QUE AINDA É FRÁGIL

| Fragilidade | Detalhe |
|-------------|---------|
| **Aprovação por fallback** | Matriz atual marcou 162 "aprovados" porque `hasMechanism()` aceita hero_benefit como fallback. Isso não prova excelência editorial. |
| **143 têm science_summary, 11 têm mechanism_summary** | 19 SKUs não têm mechanism nem science — só hero_benefit. Esses 19 foram "aprovados" por heurística permissiva. |
| **mechanism_summary real** | Apenas 11 SKUs têm mechanism_summary explícito no blueprint. 143 têm science_summary (que é real). 19 têm só hero_benefit. |
| **Validação visual** | Nenhum screenshot. Nenhuma prova de que o layout converte. |
| **Validação funcional** | Smoke HTTP feito; smoke de cliques não. |
| **Slugs matriz vs DB** | Matriz deriva slug do blueprint; DB pode ter normalização diferente (ex.: l-teanina vs l-teanine). |

---

## 3. ONDE HOUVE "APROVAÇÃO POR FALLBACK"

- **Script generate-sku-matrix.ts:** `hasMechanism()` considera hero_benefit > 30 chars como mechanism. Isso elevou os 19 SKUs sem mechanism/science para "aprovado".
- **copy-v2.ts:** `getMechanismSummaryForPdp` usa hero_benefit como fallback quando mechanism e science vazios.
- **Resultado:** 162 "aprovados" incluem 19 que dependem de copy genérica (primeira frase do hero) como mechanism.

**Os 19 SKUs com fallback de mechanism:**
- MEJOY-0036 a MEJOY-0040 (Minoxidil)
- MEJOY-0057 a MEJOY-0060 (Ioimbina)
- MEJOY-0066 (Orlistat)
- MEJOY-0126 a MEJOY-0128 (Tadalafila)
- MEJOY-0132 (Centella Asiática)
- MEJOY-0140 (Dimpless)
- MEJOY-0141 (Amora Negra)
- MEJOY-0145 (Composto Menopausa)
- MEJOY-0149 (Progesterona)
- MEJOY-0150 (Vitex Agnus Castus)

---

## 4. ARQUIVOS QUE SERÃO TOCADOS NESTA RODADA

| Arquivo | Ação |
|---------|------|
| `scripts/generate-sku-matrix.ts` | Nova lógica: 4 status (premium, funcional, revisar, bloquear). mechanism REAL ≠ hero fallback. |
| `data/store-v2/copy/copy-blueprint-v4.csv` | Adicionar mechanism_summary para os 19 SKUs (ou usar science_summary quando disponível) |
| `src/lib/store-v2/copy-v2.ts` | Opcional: overrides de mechanism para os 19 se não for possível editar CSV em batch |
| `scripts/generated/sku-matrix.json` | Regenerar com nova classificação |
| `scripts/generated/sku-matrix.csv` | Regenerar |
| `docs/RELATORIO-FINAL-PRE-LANCAMENTO.md` | Novo relatório final honesto |

---

## 5. CRITÉRIO DURO DE APROVAÇÃO DESTA VEZ

| Status | Critério |
|--------|----------|
| **APROVADO_PREMIUM** | mechanism_summary OU science_summary no blueprint (conteúdo real, > 15 chars). hero forte. benefits. faq. cautions. Copy escaneável. |
| **APROVADO_FUNCIONAL** | Produto usável. mechanism via hero_benefit fallback. Coerente e vendável. |
| **REVISAR** | Copy fraca, genérica, ou sem clareza suficiente. |
| **BLOQUEAR** | Falha estrutural ou ausência grave de conteúdo. |

**Regra:** hero_benefit como mechanism fallback **NÃO** basta para premium.

---

## 6. CONTAGEM REAL (Blueprint v4)

- **mechanism_summary preenchido:** 11
- **science_summary preenchido:** 143
- **mechanism OU science:** 143 (overlap: quem tem mechanism pode ter science)
- **Só hero_benefit (sem mechanism nem science):** 19

**Conclusão:** 143 SKUs podem ser premium (têm mechanism real). 19 são funcionais (fallback).
