# Plano PDP Template Mestre — Akkermat 150mg

> **Objetivo:** Transformar a PDP do Akkermat no template mestre de conversão da MeJoy, superior ao concorrente e replicável nos 162 produtos.  
> **Princípio:** Sistema de conversão em 4 camadas — venda no fold, confiança no corpo, dados replicáveis, performance.  
> **Última atualização:** 2026-03-07  
> **Status:** Piloto Akkermat (MEJOY-0048) implementado e **validado**. Produto engessado e intocável. Próximo: replicação para 162 SKUs (ver `PLANO-REPLICACAO-PDP-162-SKUS.md`).

---

## 1. Schema Mestre Replicável (162 SKUs)

Cada produto deve ser montado por estrutura de dados:

| Campo | Fonte | Fallback | Obrigatório |
|-------|-------|----------|-------------|
| hero_title | seo_h1, name | name | Sim |
| mechanism_summary | blueprint, MECHANISM_OVERRIDES, PDP_MASTER_OVERRIDES | science_summary (120 chars), hero_benefit | Sim |
| hero_bullets | PDP_MASTER_OVERRIDES, getHeroBullets | — | Sim |
| benefits_structured | getBenefitsStructured | hero_benefit | Sim |
| what_is_it | description, description_md | shortBenefit | Sim |
| how_it_works | copyV4Science, copyV4Diferencial | — | Opcional |
| what_makes_this_formula_different | copyV4Diferencial | copyV4Science | Opcional |
| best_fit_profile | copyV4BestFit | — | Sim |
| how_to_use | howToUseBullets, packSizeDisplay | "Siga orientação profissional" | Sim |
| composition_table | activeIngredients (parser) | — | Sim |
| warnings | copyV2Cautions, advertenciasCompleto | ADVERTENCIAS_ANVISA | Sim |
| faq | copyV2Faq | FAQ_GENERICO | Sim |
| gallery_storyboard | images (5 slots, duplicar se < 5) | ProductPackShot | Sim |
| trust_signals | TrustBar + 1 linha | — | Sim |
| pricing_anchors | compareAtCents, priceCents | — | Sim |

---

## 2. Ordem Ideal do First Fold

**Esquerda:** Galeria (5 thumbnails) + imagem hero principal.

**Direita (topo → CTA):**
1. Badges (curtas, máx. 2)
2. formDisplay (ex: "30 cápsulas")
3. Título (H1)
4. FavoriteButton
5. Subtítulo (mechanism_summary — sem truncamento)
6. Rating + contagem (ou "Seja o primeiro a avaliar")
7. Hero bullets (emoji no início)
8. Trust line (uma só: "Troca em até 7 dias" ou "Frete grátis acima de R$ 190")
9. PdpShippingCalculator
10. **Bloco decisório:** Preço atual → Preço riscado → % OFF → Parcelamento → Pix → Quantidade → CTA → Assinar (opcional) → Cashback

**Regra:** Preço + Quantidade + CTA no mesmo bloco, no final.

---

## 3. Ordem Ideal do Corpo da Página

1. O que é
2. Como funciona
3. Benefícios principais (para_que_serve / benefitsStructured)
4. O que torna esta fórmula diferente
5. Para quem é ideal
6. Como usar
7. Composição
8. Advertências
9. FAQ
10. Como funciona sua compra
11. Reviews
12. Quem viu, viu também

---

## 4. Checklist de Rollout para 162 Produtos

- [ ] hero_title preenchido (seo_h1 ou name)
- [ ] mechanism_summary no blueprint ou override
- [ ] hero_bullets (4–6 itens, emoji no início)
- [ ] benefits_structured ou para_que_serve
- [ ] what_is_it (description)
- [ ] best_fit_profile
- [ ] how_to_use ou packSizeDisplay
- [ ] activeIngredients no formato parseável
- [ ] compareAtCents quando houver desconto
- [ ] images (1+ URL; código duplica até 5)
- [ ] faq no blueprint
- [ ] cautions no blueprint

---

## 5. Critérios de Validação Automática

- Build e lint passam
- PDP carrega sem erro (200)
- Subtítulo não trunca (sem "…" indevido)
- Preço + quantidade + CTA visíveis no fold
- Bullets com emoji no início
- Galeria com 5 thumbnails
- Tabela de composição renderiza
- Sticky CTA desktop e mobile funcionam

---

## 6. Arquivos Impactados

| Arquivo | Fase |
|---------|------|
| src/lib/store-v2/copy-v2.ts | 0, 2, 7 |
| src/pages/p/[slug].tsx | 1, 2, 3, 5, 6 |
| src/components/store-v2/PdpRatingSummary.tsx | 1 |
| src/components/store-v2/PdpCashbackBadge.tsx | 1 |
| src/components/store-v2/PdpCompositionTable.tsx | 4 |
| src/components/store-v2/PdpWarnings.tsx | 4 |
| data/store-v2/copy/copy-blueprint-v4.csv | 2 |
| store_v2_price_versions (DB) | 0 (compareAtCents) |

---

## 7. O que é Layout Global vs Dado vs Override

| Tipo | Exemplo |
|------|---------|
| **Layout global** | Ordem do fold, estrutura de blocos, componentes PdpCompositionTable, PdpWarnings |
| **Dado (DB/blueprint)** | name, priceCents, images, activeIngredients, blueprint v4 |
| **Override (PDP_MASTER_FULL_OVERRIDES)** | heroBullets, mechanismSummary, faq, advertenciasCompleto, whatIsIt, bestFitProfile, whatMakesDifferent, scienceSummary, paraQueServe, activeIngredients, howToUseBullets |
| **Fallback** | compareAtCents (11070 para Template Mestre quando ausente no DB) |

---

## 8. Checklist Operacional de Rollout para 162 SKUs

- [ ] Preencher blueprint v4 com: mechanism_summary, para_que_serve, how_to_use_bullets, faq, advertencias_completo
- [ ] Garantir activeIngredients no formato parseável (ingrediente + dose + unidade por linha)
- [ ] Adicionar compareAtCents em store_v2_price_versions quando houver desconto
- [ ] Validar que images tem 1+ URL (código duplica até 5)
- [ ] Testar PDP em staging antes de produção

---

## 9. Copywriting vs Concorrente (Akkermat)

| Aspecto | MeJoy | OficialFarma |
|---------|--------|--------------|
| **Benefícios** | 6 itens (benefício + mecanismo) | 6 itens |
| **O que é** | Fitocomplexo GLP-1, saciedade, termogênico | Texto científico |
| **Como funciona** | GLP-1, grelina, leptina, termogênico, microbiota, anti-inflamatório | Mecanismo detalhado |
| **Diferencial** | Microencapsulado patenteado + múltiplos mecanismos | — |

**Gatilhos mentais:** escassez/urgência, prova social (patenteada), autoridade (tecnologia), benefício concreto, especificidade científica. Linguagem regulatória: "pode", "auxiliar", "apoiar".
