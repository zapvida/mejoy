# Akkermat Freeze — Referência Oficial do Template Mestre PDP

> **Status:** Template mestre congelado. MEJOY-0048 é INTOCÁVEL.  
> **Data:** 2026-03-07  
> **URL validada:** http://localhost:3000/p/akkermat-150-mg-30-capsulas

---

## 1. O que é o quê

| Conceito | Descrição | Onde vive |
|----------|-----------|-----------|
| **Layout global** | Estrutura da PDP (`/p/[slug].tsx`): ordem das seções, componentes, responsividade | `src/pages/p/[slug].tsx` |
| **Conteúdo via blueprint** | Copy dos 161 produtos (exceto Akkermat): hero_benefit, para_que_serve, faq, etc. | `data/store-v2/copy/copy-blueprint-v4.csv` |
| **Override do template mestre** | Conteúdo exclusivo do Akkermat — nunca lê do blueprint | `src/lib/store-v2/copy-v2.ts` → `PDP_MASTER_FULL_OVERRIDES`, `PDP_MASTER_OVERRIDES`, `HOW_TO_USE_OVERRIDES` |
| **Fallback** | Valores usados quando blueprint/catalog não tem dado: imagens, FAQ genérico, etc. | `copy-v2.ts`, `[slug].tsx` |

---

## 2. Pontos de override do Akkermat (MEJOY-0048)

O Akkermat **nunca** usa o blueprint. Todos os dados vêm de:

| Campo | Fonte | Arquivo |
|-------|-------|---------|
| heroBullets | PDP_MASTER_OVERRIDES | copy-v2.ts |
| mechanismSummary | PDP_MASTER_OVERRIDES | copy-v2.ts |
| paraQueServe | PDP_MASTER_FULL_OVERRIDES | copy-v2.ts |
| faq | PDP_MASTER_FULL_OVERRIDES | copy-v2.ts |
| whatIsIt | PDP_MASTER_FULL_OVERRIDES | copy-v2.ts |
| bestFitProfile | PDP_MASTER_FULL_OVERRIDES | copy-v2.ts |
| whatMakesDifferent | PDP_MASTER_FULL_OVERRIDES | copy-v2.ts |
| scienceSummary | PDP_MASTER_FULL_OVERRIDES | copy-v2.ts |
| advertenciasCompleto | PDP_MASTER_FULL_OVERRIDES | copy-v2.ts |
| activeIngredients | PDP_MASTER_FULL_OVERRIDES | copy-v2.ts |
| howToUseBullets | HOW_TO_USE_OVERRIDES | copy-v2.ts |
| images | Hardcoded AKKERMAT_IMG | [slug].tsx |
| compareAtCents | PDP_MASTER_COMPARE_AT_FALLBACK_CENTS | copy-v2.ts |
| rating, reviewCount | Hardcoded 4.7, 247 | [slug].tsx getServerSideProps |

---

## 3. Ordem das seções (igual para todos os produtos)

| # | Seção | Condição |
|---|-------|----------|
| 1 | Breadcrumb | Sempre |
| 2 | Galeria (imagem + 5 thumbnails) | Sempre |
| 3 | Título H1 + formDisplay | Sempre |
| 4 | Subtítulo (mechanism_summary) | mechanism_summary preenchido |
| 5 | Rating + avaliações | Sempre |
| 6 | Hero bullets (4–5 itens) | heroBullets com 3+ itens |
| 7 | Trust line | Sempre |
| 8 | Bloco decisório (preço, quantidade, CTA) | Sempre |
| 9 | Calculadora de frete | preço > 0 |
| 10 | TrustBar (4 cards) | Sempre |
| 11 | O que é | description ou shortBenefit |
| 12 | Como funciona | copyV4Science |
| 13 | Para que serve (grid 6 benefícios) | paraQueServe com 1+ itens |
| 14 | O que torna esta fórmula diferente | copyV4Diferencial |
| 15 | Para quem é ideal | copyV4BestFit |
| 16 | Como usar | howToUseBullets |
| 17 | Composição | activeIngredients |
| 18 | Advertências e precauções | advertenciasCompleto ou copyV2Cautions |
| 19 | Perguntas frequentes | copyV2Faq |
| 20 | Como funciona sua compra | Sempre (Store V2) |
| 21 | Avaliações | Sempre |
| 22 | Quem viu, viu também | Sempre |
| 23 | Sticky CTA (desktop + mobile) | Sempre |

---

## 4. First fold (visível sem scroll)

- Breadcrumb
- Galeria
- Título H1
- Subtítulo (mechanism)
- Rating
- Hero bullets
- Trust line
- Bloco decisório (preço + quantidade + CTA)

---

## 5. Scripts de freeze e validação

| Script | Uso | Descrição |
|--------|-----|-----------|
| `freeze-akkermat.ts` | `pnpm tsx scripts/freeze-akkermat.ts` | Gera snapshot em `scripts/generated/akkermat-freeze-snapshot.json` |
| `validate-akkermat-regression.ts` | `pnpm tsx scripts/validate-akkermat-regression.ts` | Valida contra snapshot. Falha se regressão. |
| | `BASE_URL=http://localhost:3000 pnpm tsx scripts/validate-akkermat-regression.ts` | Inclui checagem HTTP da página |

**Regra:** Antes de merge/deploy, rodar `validate-akkermat-regression`. Se falhar, não fazer merge.

---

## 6. Fallbacks de segurança

- Produtos sem blueprint: usam shortBenefit, hero_benefit derivado, FAQ genérico
- Imagens: fallback `/products/metaboslim.svg` quando não há imagem
- Akkermat: imagens fixas `/products/akkermat-150mg.png` (5 thumbnails)

---

## 7. Alterações permitidas vs proibidas

| Permitido | Proibido |
|-----------|----------|
| Adicionar campos ao blueprint v4 | Alterar ordem das seções na PDP |
| Ajustar helpers em copy-v2 (para outros SKUs) | Remover seções do Akkermat |
| Criar scripts de QA/auditoria | Alterar PDP_MASTER_FULL_OVERRIDES para MEJOY-0048 |
| Preencher blueprint para os 161 produtos | Alterar PDP_MASTER_OVERRIDES para MEJOY-0048 |
| | Criar segunda PDP ou layout alternativo |
