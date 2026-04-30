# Instrução de Execução — Cursor Agent

> Cole este prompt no Cursor Agent para executar o plano de lançamento do e-commerce Me Joy.

---

## Prompt para o Cursor Agent

```
Você é o Cursor (AGENT). Execute o plano do documento `docs/PLANO-ECOMERCE-FARMACIA-MANIPULACAO.md` e entregue o e-commerce MeJoy pronto para lançamento, sem quebrar nada.

REGRAS CRÍTICAS
- NÃO renomear rotas/slugs atuais.
- Commits pequenos e incrementais.
- Tudo responsivo e validado (lint/build).
- Copy e UI devem focar benefícios do PRODUTO no primeiro quadrante.
- Evitar claims ilegais: linguagem conservadora, informativa, com advertências claras.

OBJETIVO (Definition of Done)
PDP:
1) Primeiro quadrante com:
   - subtítulo "mecanismo em 1 frase"
   - 5–7 benefícios com ✅ e emojis
   - preço "de/por", parcela visível, badge %OFF
   - CTA "Adicionar ao carrinho"
   - bloco "calcular frete e prazo"
2) Sticky CTA também no DESKTOP (não só mobile).
3) Galeria com thumbnails e suporte a múltiplas imagens.
4) Conteúdo abaixo do fold reordenado:
   - Benefícios (negrito + descrição)
   - Ciência/diferencial (curto)
   - Para quem é
   - Como usar
   - Composição em tabela (Ingrediente | Dose | Unidade)
   - Advertências formatadas (lista objetiva)

SITE:
5) Busca no header: input visível + autocomplete.
6) Favoritos: coração funcional + página /favoritos.
7) Home com seções: Mais buscados, Mais vendidos, Novidades + carrossel auto-scroll (pode começar por marcação manual no catálogo).

COPY PIPELINE:
8) Criar estrutura de "Copy Blocks" no catálogo para cada produto:
   - hero_bullets[]
   - mechanism_summary
   - benefits_structured[] (title, desc)
   - composition[] (ingredient, dose, unit)
   - cautions[] / warnings[]
   - faq[]
9) Gerar copy inicial usando referências dos concorrentes (sem copiar texto):
   - tomar como padrão a estrutura do primeiro frame (benefícios ✅ + frase curta + preço + parcela + CTA).
   - Revisão humana: dosagens/contraindicações/claims.

IMPLEMENTAÇÃO (ordem e arquivos)
A) PDP (P0)
- Arquivos: src/pages/p/[slug].tsx, src/lib/store-v2/copy-v2.ts
- Substituir benefícios comerciais por hero_bullets (copy v4)
- Adicionar mechanism_summary como subtítulo
- Badge %OFF quando compareAt existir
- Parcela (3x/6x/12x) visível
- Sticky CTA desktop
- Componente PdpShippingCalculator (CEP + API calculate-shipping)

B) PDP Conteúdo (P1)
- Reordenar seções
- Tabela de composição (parser activeIngredients)
- Advertências em lista
- Como usar separado

C) Busca e Favoritos (P0)
- Header: input visível, debounce, dropdown autocomplete
- API search: incluir activeIngredients, tags
- Favoritos: localStorage + /favoritos + coração nos cards

D) Home (P0/P1)
- Seções + carrosséis
- Marcar produtos via tags (mais_buscados, mais_vendidos, novidades)

VALIDAÇÃO
- pnpm lint && pnpm build
- Smoke: PDP desktop/mobile, sticky, galeria, tabela, busca, favoritos, home carrosséis

COMMITS
1) feat(pdp): hero benefits + mechanism + badge + installments
2) feat(pdp): desktop sticky cta + pdp shipping calculator
3) feat(pdp): composition table + warnings + reorder sections
4) feat(search): header search input + autocomplete
5) feat(favorites): localStorage favorites + page + heart icons
6) feat(home): sections + carousels + featured tags
7) chore: lint/build pass + docs update
```

---

## Ordem de execução recomendada

1. **Fase A — PDP P0** (commit 1 e 2)
2. **Fase B — PDP P1** (commit 3)
3. **Fase C — Busca + Favoritos** (commits 4 e 5)
4. **Fase D — Home** (commit 6)
5. **Validação final** (commit 7)

---

## Arquivos principais a alterar

| Fase | Arquivos |
|------|----------|
| PDP | `src/pages/p/[slug].tsx`, `src/lib/store-v2/copy-v2.ts` |
| PDP Shipping | Novo: `src/components/store-v2/PdpShippingCalculator.tsx` |
| PDP Conteúdo | `src/pages/p/[slug].tsx`, novo `PdpCompositionTable.tsx` |
| Busca | `src/components/store-v2/StorefrontHeader.tsx`, `src/pages/api/store-v2/search.ts` |
| Favoritos | `src/hooks/useFavorites.ts`, `src/pages/favoritos.tsx`, `ProductCard.tsx` |
| Home | `src/components/store-v2/StoreV2Home.tsx`, `src/lib/store-v2/catalog.ts` |

---

## Referência rápida — Copy v4 campos

| Campo blueprint v4 | Uso na PDP |
|--------------------|------------|
| hero_benefit | → hero_bullets (split ou primeiro frame) |
| mechanism_summary / science_summary | Subtítulo 1 frase |
| what_makes_this_formula_different | Seção Ciência/Diferencial |
| best_fit_profile | Seção "Para quem é" |
| description_md | O que é, Como usar |
| faq | FAQ |
| cautions | Advertências |
| activeIngredients | Parser → tabela composição |
