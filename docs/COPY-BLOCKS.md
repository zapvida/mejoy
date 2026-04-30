# Copy Blocks — Estrutura Escalável para PDP

Estrutura de blocos de copy usada na PDP, com mapeamento para o blueprint v4 e fallbacks.

## Blocos e Ordem de Fallback

| Bloco | Fonte primária | Fallback 1 | Fallback 2 |
|-------|----------------|------------|-------------|
| **hero_bullets** | `hero_benefit` + `shortBenefit` parseados | tags/objetivo → bullets genéricos | — |
| **mechanism_summary** | `mechanism_summary` (v4) | `science_summary` truncado | `MECHANISM_OVERRIDES` (19 SKUs) ou hero_benefit |
| **benefits_structured** | `description_md` parseado (##, **x**: y, - item) | `hero_benefit` | `shortBenefit` |
| **composition** | `activeIngredients` (parse) | — | "Composição sob consulta" |
| **cautions** | `cautions` (v2/v4) | ADVERTENCIAS_ANVISA | COMPLIANCE_BLOCK |
| **faq** | `faq` (v2/v4) parseado | FAQ_GENERICO | — |

## Arquivos

- **`src/lib/store-v2/copy-v2.ts`**: funções `getHeroBullets`, `getBenefitsStructured`, `parseFaqFromV2`, leitura do blueprint v4
- **`data/store-v2/copy/copy-blueprint-v4.csv`**: copy editorial por SKU
- **`src/components/store-v2/PdpCompositionTable.tsx`**: parse de `activeIngredients`
- **`src/components/store-v2/PdpWarnings.tsx`**: render de advertências

## Regras de Copy

1. Foco no produto, não em discurso comercial genérico
2. Benefícios claros e escaneáveis
3. Claims conservadores e compliance-safe
4. Nunca deixar bloco vazio — sempre usar fallback

## Replicação para Novos SKUs

1. Adicionar linha no `copy-blueprint-v4.csv` com os campos necessários
2. O sistema aplica fallbacks automaticamente quando campos estão vazios
3. Produtos sem linha no blueprint usam dados do catálogo (shortBenefit, activeIngredients, etc.)
