# Schema Editorial Oficial — 162 SKUs

> Contrato obrigatório dos campos premium por SKU.  
> Produtos sem dados suficientes são classificados REVISAR ou BLOQUEAR.  
> A página **não quebra** por falta de dados; fallbacks garantem renderização.

---

## Campos mínimos (contrato premium)

| Campo | Obrigatório | Formato | Condição para seção |
|-------|-------------|---------|---------------------|
| hero_benefit | Sim | String 30–150 chars | heroBullets ≥ 3 |
| mechanism_summary | Sim | String ≤180 chars | Subtítulo visível |
| para_que_serve | Sim | `Título1 \| Desc1 \| Título2 \| Desc2 \| ...` (4–6 pares) | Grid benefícios |
| description_md / whatIsIt | Sim | Markdown ou texto | Seção "O que é" |
| science_summary | Sim | String 80–400 chars | Seção "Como funciona" |
| what_makes_this_formula_different | Sim | String 50–300 chars | Seção "Diferencial" |
| best_fit_profile | Sim | String 30–150 chars | Seção "Para quem" |
| how_to_use_bullets | Sim | `- item1 \| - item2 \| - item3` | Seção "Como usar" |
| faq | Sim | `P1? \| R1 \| P2? \| R2 \| ...` (mín. 5 pares) | FAQ |
| advertencias_completo | Sim | Texto legal + específico | Advertências |
| activeIngredients | Sim | Parseável (DB ou override) | Composição |
| seoTitle | Sim | String 50–60 chars | Meta title |
| seoDescription | Sim | String 80–155 chars | Meta description |
| seo_h1 | Sim | String | H1 da página |
| images | Sim | 1+ URL | Galeria |

---

## Classificação por SKU

| Status | Critérios | Ação |
|--------|-----------|------|
| **PREMIUM** | score ≥ 8, FAQ específica, mechanism ok, 4–6 benefícios | Pronto para campanha |
| **BOM** | score ≥ 6, FAQ ou mechanism ok, benefícios ok | Pode publicar |
| **REVISAR** | score ≥ 4 ou dados parciais | Completar antes de campanha |
| **BLOQUEAR** | score < 4 ou dados críticos faltando | Não publicar |

---

## Helpers em copy-v2.ts

| Helper | Uso |
|--------|-----|
| getHeroBullets | hero_benefit + shortBenefit + objective → bullets |
| getMechanismSummaryForPdp | mechanism_summary ou science_summary truncado |
| parseParaQueServe | para_que_serve → { title, desc }[] |
| getBenefitsStructured | description_md → benefícios estruturados |
| parseFaqFromV2 | faq → { q, a }[] |
| getHowToUseBulletsForPdp | how_to_use_bullets → string[] |
| getFaqForPdp | FAQ com override para Akkermat |
| getParaQueServeFallback | Fallback quando para_que_serve vazio |

---

## Fallbacks (não quebram a página)

- **description**: shortBenefit ou texto genérico
- **FAQ**: FAQ_GENERICO quando copy vazia
- **heroBullets**: derivados de hero_benefit ou genéricos por objective
- **images**: /products/metaboslim.svg
- **advertencias**: ADVERTENCIAS_ANVISA + COMPLIANCE_BLOCK
