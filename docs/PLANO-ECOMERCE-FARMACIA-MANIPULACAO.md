# Plano E-commerce Farmácia de Manipulação — MeJoy

> **Objetivo:** Ter o melhor e-commerce de farmácia de manipulação do Brasil, superior aos concorrentes (Oficialfarma, Drogasil, Eficaciafarmacia), pronto para lançamento oficial.

**Última atualização:** 2026-03-06  
**Fontes:** Reunião com Jé + Cursor Agent + GPT superprompt

---

## 0. Instrução para o Cursor Agent (execução)

**Use este documento como fonte única de verdade.** Execute as fases na ordem, com commits incrementais. Valide `pnpm lint` e `pnpm build` após cada fase.

**REGRAS CRÍTICAS:**
- NÃO renomear rotas/slugs atuais
- Commits pequenos e incrementais
- Tudo responsivo e validado (lint/build)
- Copy e UI focam benefícios do **PRODUTO** no primeiro quadrante (não comerciais)
- Evitar claims ilegais: linguagem conservadora, informativa, advertências claras

---

## 1. O que os concorrentes fazem que converte (benchmark)

| Prática | Oficialfarma | Drogasil | MeJoy hoje |
|---------|--------------|----------|-------------|
| Primeiro quadrante = benefícios do produto | ✅ | ✅ | ❌ (comerciais) |
| Benefícios com ✅ + emojis | ✅ | ⚠️ | ❌ |
| Preço "de/por" + parcela visível | ✅ | ✅ | ⚠️ Parcial |
| Badge % OFF | ✅ | ✅ | ❌ |
| Sticky CTA desktop | ✅ | ✅ | ❌ (só mobile) |
| Calcular frete e prazo na PDP | ✅ | ✅ | ❌ |
| Wishlist/favoritos | ✅ | ⚠️ | ❌ (404) |
| Composição em tabela | ✅ | ✅ | ❌ |
| Busca destacada + autocomplete | ✅ | ⚠️ | ❌ |
| Mais buscados / Mais vendidos | ✅ | ⚠️ | ❌ |
| Carousel auto-scroll | ✅ | ✅ | ❌ |
| Narrativa "manipulado = personalização" | ✅ | ✅ | ⚠️ |

---

## 2. Definition of Done (DoD)

### PDP
1. **Primeiro quadrante:**
   - Subtítulo "mecanismo em 1 frase" (mechanism_summary)
   - 5–7 benefícios com ✅ e emojis (hero_bullets)
   - Preço "de/por", parcela visível, badge %OFF
   - CTA "Adicionar ao carrinho"
   - Bloco "Calcular frete e prazo" (CEP + resultado)
2. **Sticky CTA** também no **DESKTOP** (não só mobile)
3. **Galeria** com thumbnails e suporte a múltiplas imagens
4. **Conteúdo abaixo do fold** reordenado:
   - Benefícios (negrito + descrição)
   - Ciência/diferencial (curto)
   - Para quem é
   - Como usar
   - Composição em tabela (Ingrediente | Dose | Unidade)
   - Advertências formatadas (lista objetiva)

### Site
5. **Busca no header:** input visível + autocomplete (top 6)
6. **Favoritos:** coração funcional + página `/favoritos`
7. **Home:** seções Mais buscados, Mais vendidos, Novidades + carousel auto-scroll

### Copy Pipeline
8. **Estrutura Copy Blocks** (copy-blueprint-v4 ou runtime merge):
   - `hero_bullets[]` — 5–7 itens com emoji
   - `mechanism_summary` — subtítulo 1 frase
   - `benefits_structured[]` — { title, desc }
   - `composition[]` — { ingredient, dose, unit }
   - `cautions[]` / `warnings[]`
   - `faq[]`
9. **Geração:** usar referências concorrentes (sem copiar texto), revisão humana para dosagem/claims

---

## 3. Status atual vs. solicitado (checklist)

| # | Item | Status | Prioridade |
|---|------|--------|------------|
| 1 | Primeiro quadrante: benefícios do produto | ❌ | P0 |
| 2 | Subtítulo mechanism_summary | ❌ | P0 |
| 3 | Emojis nos benefícios | ❌ | P0 |
| 4 | Badge % OFF | ❌ | P0 |
| 5 | Parcelamento visível (ex: 3x de R$ X) | ⚠️ | P0 |
| 6 | Sticky CTA desktop | ❌ | P0 |
| 7 | Calcular frete e prazo na PDP | ❌ | P0 |
| 8 | Galeria/mosaico múltiplas imagens | ⚠️ | P0 |
| 9 | Composição em tabela | ❌ | P1 |
| 10 | Advertências formatadas | ❌ | P1 |
| 11 | Benefícios negrito + descrição | ❌ | P1 |
| 12 | Ordem seções (ciência antes) | ❌ | P1 |
| 13 | Como usar separado | ⚠️ | P1 |
| 14 | Busca destacada no header | ❌ | P0 |
| 15 | Autocomplete busca | ❌ | P0 |
| 16 | Favoritos funcional + /favoritos | ❌ | P0 |
| 17 | Seção Mais buscados | ❌ | P0 |
| 18 | Seção Mais vendidos | ❌ | P0 |
| 19 | Seção Novidades | ❌ | P1 |
| 20 | Carousel auto-scroll | ❌ | P1 |
| 21 | Marcação featured (manual inicial) | ❌ | P1 |

---

## 4. Estrutura Copy Blocks (para catálogo + blueprint v4)

```
hero_bullets: string[]        // ["Melhora da energia ⚡", "Ganho de massa 💪", ...]
mechanism_summary: string     // "Potencializa a queima calórica e facilita o emagrecimento."
benefits_structured: { title: string; desc: string }[]
composition: { ingredient: string; dose: string; unit: string }[]
cautions: string[]
faq: { q: string; a: string }[]
```

**Fonte atual:** `copy-blueprint-v4.csv` tem `hero_benefit`, `science_summary`, `what_makes_this_formula_different`, `best_fit_profile`, `faq`, `cautions`, `activeIngredients` (parser).

**Mapeamento:**
- `hero_bullets` ← parse de `hero_benefit` ou novo campo (split por bullet)
- `mechanism_summary` ← `mechanism_summary` ou `science_summary` (1 frase)
- `benefits_structured` ← parse de `description_md` ou novo campo
- `composition` ← parse de `activeIngredients` (ex: "Goma Guar 250mg" → { ingredient: "Goma Guar", dose: "250", unit: "mg" })

---

## 5. Implementação — ordem e arquivos

### A) PDP (P0)

**Arquivos:** `src/pages/p/[slug].tsx`, `src/lib/store-v2/copy-v2.ts`, `src/lib/store-v2/catalog.ts`

1. **Hero benefits:** Substituir benefícios comerciais por `hero_bullets` (copy v4) ou fallback `shortBenefit` + 2–3 genéricos. Adicionar emojis por categoria (mapeamento).
2. **mechanism_summary:** Subtítulo curto abaixo do H1.
3. **Badge % OFF:** `(compareAtCents - priceCents) / compareAtCents * 100` quando `compareAtCents > priceCents`.
4. **Parcelamento:** Calcular 3x, 6x, 12x e exibir "ou 3x de R$ X" (parcela mínima R$ 30).
5. **Calcular frete:** Componente `PdpShippingCalculator` — input CEP, botão "Calcular", chamada `/api/store-v2/checkout/calculate-shipping` com `subtotalCents` do produto × quantidade. Exibir valor e prazo.
6. **Sticky CTA desktop:** Nova barra fixa `hidden md:flex` (inversa do mobile) com preço + parcela + botão. Mobile mantém `md:hidden`.
7. **Galeria:** Já existe thumbnails; garantir que `images` seja usado. Placeholder para produtos com 1 imagem.

### B) PDP Conteúdo (P1)

**Arquivos:** `src/pages/p/[slug].tsx`, novo `PdpCompositionTable.tsx`, `PdpWarnings.tsx`

1. **Reordenar seções:** Benefícios → Ciência/Diferencial → O que é → Para quem → Como usar → Composição → Advertências → FAQ → Reviews.
2. **Composição tabela:** Parser de `activeIngredients` ou dados estruturados. Tabela responsiva: Ingrediente | Dose | Unidade.
3. **Advertências:** Lista com bullets, "Ver mais" se > 5 itens. `cautions` (copy v4) + ADVERTENCIAS_ANVISA.
4. **Como usar:** Seção dedicada, copy de `description_md` ou `packSizeDisplay`.

### C) Busca e Favoritos (P0)

**Arquivos:** `src/components/store-v2/StorefrontHeader.tsx`, `src/pages/search.tsx`, `src/pages/favoritos.tsx`, `src/pages/api/store-v2/search.ts`, `src/hooks/useFavorites.ts`

1. **Header:** Input de busca visível (não só ícone). Placeholder: "Busque por sintoma, ingrediente ou produto". Debounce 300ms, dropdown com top 6 resultados. Submit → `/search?q=`.
2. **API search:** Incluir `activeIngredients`, `tags`, `objective` no `where` (Prisma).
3. **Favoritos:** Hook `useFavorites` com localStorage. Página `/favoritos` lista produtos. Coração em ProductCard e PDP. Toggle add/remove.

### D) Home (P0/P1)

**Arquivos:** `src/components/store-v2/StoreV2Home.tsx`, `src/components/store-v2/HomeCarousel.tsx`, `src/lib/store-v2/catalog.ts`, `prisma/schema.prisma` (opcional: `featuredIn` ou usar `tags`)

1. **Marcação featured:** Usar `tags` com valores `mais_buscados`, `mais_vendidos`, `novidades` ou campo `featuredIn` (array). Inicial: manual no import/CSV.
2. **Seções:** "Manipulados mais buscados", "Mais vendidos", "Novidades em destaque". Cada uma com carousel horizontal.
3. **Carousel:** Embla ou Swiper com `autoplay`, setas, dots. Produtos por `tags` ou `priorityRank`.
4. **Layout:** Categoria (nav) → Banner/Hero → TrustBar → Seções → Footer.

---

## 6. Calcular frete na PDP

**API existente:** `POST /api/store-v2/checkout/calculate-shipping` — body: `{ cep, subtotalCents }`.

**Componente:** `PdpShippingCalculator`
- Input CEP (mask 00000-000)
- Botão "Calcular frete e prazo"
- Exibir: "R$ X,XX — até N dias úteis" ou "Frete grátis para Sudeste/Sul em compras acima de R$ 190"
- Usar `subtotalCents = priceCents * quantity`

---

## 7. Flags e ativação

| Flag | Uso | Default |
|------|-----|---------|
| `NEXT_PUBLIC_STORE_V2` | Loja nova | 1 |
| `NEXT_PUBLIC_STORE_V2_CONVERSION` | PDP premium, TrustBar frete | 0 → 1 no lançamento |
| `NEXT_PUBLIC_COPY_V4` | Copy blueprint v4 | 1 |
| `NEXT_PUBLIC_STORE_V2_REVIEWS` | Reviews na PDP | 0 |

**Novas (opcional):**
- `NEXT_PUBLIC_PDP_SHIPPING_CALC` — calcular frete na PDP (1 = on)
- `NEXT_PUBLIC_HEADER_SEARCH_INPUT` — input visível no header (1 = on)
- `NEXT_PUBLIC_FAVORITES_ENABLED` — favoritos (1 = on)
- `NEXT_PUBLIC_HOME_CAROUSELS` — seções + carousels (1 = on)

---

## 8. Commits sugeridos

```
1) feat(pdp): hero benefits + mechanism + badge + installments
2) feat(pdp): desktop sticky cta + pdp shipping calculator
3) feat(pdp): composition table + warnings formatting + reorder sections
4) feat(search): header search input + autocomplete + api enhancements
5) feat(favorites): localStorage favorites + page + heart icons
6) feat(home): sections mais buscados/vendidos/novidades + carousels
7) chore: lint/build pass + docs update
```

---

## 9. Validação final

- [ ] `pnpm lint` — sem erros
- [ ] `pnpm build` — sucesso
- [ ] PDP desktop: sticky CTA visível ao rolar
- [ ] PDP mobile: sticky CTA com WhatsApp + preço + Add to cart
- [ ] PDP: benefícios do produto (não comerciais) no primeiro frame
- [ ] PDP: badge % OFF quando há compareAt
- [ ] PDP: calcular frete e prazo funciona
- [ ] PDP: composição em tabela
- [ ] Header: input de busca visível, autocomplete
- [ ] Favoritos: coração toggle, página /favoritos
- [ ] Home: seções + carousels com auto-scroll

---

## 10. Integração GPT (Copy Pipeline)

**Fluxo:**
1. Input: copy-blueprint-v4.csv + textos concorrentes (referência, não cópia)
2. GPT gera: hero_bullets, mechanism_summary, benefits_structured, composition, faq, cautions
3. Validação: `validate-copy-blueprint-v4.ts`, `harden-compliance-v4.ts`
4. Revisão humana: dosagem, contraindicações, claims
5. Output: atualiza CSV ou merge em runtime

**Script existente:** `scripts/enrich-copy-ai-batch.ts` — adaptar para aceitar referências.

---

## 11. Referências competitivas

| Site | URL |
|------|-----|
| Oficialfarma | https://www.oficialfarma.com.br/ |
| Drogasil Manipulação | https://manipulacao.drogasil.com.br/ |
| Eficaciafarmacia | https://www.eficaciafarmacia.com.br/ |

---

## 12. Métricas de sucesso

- Conversão PDP (add-to-cart / visitantes)
- Tempo na página
- Bounce rate
- % sessões com busca, conversão pós-busca
- Uso de favoritos, conversão favoritos → compra
- Cliques em Mais buscados/vendidos/novidades

---

*Documento vivo. Atualizar conforme implementação. Cursor Agent: execute as fases na ordem, validando após cada commit.*
