# Copy Blueprint v3 — Camada Editorial Premium

**Data:** 2026-03-06  
**Status:** Estrutura criada, enriquecimento piloto aplicado

## Resumo

O v3 é uma **camada acima do v2**, sem substituí-lo. Adiciona colunas de enriquecimento semântico, SEO, ciência aplicada e diferenciação entre produtos.

---

## 1. Novas colunas (v3)

| Coluna | Descrição |
|--------|-----------|
| `search_intent_primary` | Intenção de busca principal |
| `search_intent_secondary` | Intenção secundária |
| `top_questions_real` | Perguntas reais que pessoas fazem |
| `science_summary` | Resumo científico honesto |
| `evidence_level` | emerging / moderate / strong |
| `best_fit_profile` | Perfil ideal de uso |
| `not_for_whom` | Para quem não é indicado |
| `what_makes_this_formula_different` | Diferencial da fórmula |
| `comparison_note` | Nota de comparação com irmãos |
| `content_angle` | Ângulo de conteúdo |
| `blog_support_topics` | Tópicos para blog |
| `internal_link_targets` | Links internos |
| `editorial_score` | Score 0–100 |
| `semantic_depth_score` | Score semântico |
| `differentiation_score` | Score de diferenciação |

---

## 2. Clusters enriquecidos

| Cluster | SKUs enriquecidos |
|---------|-------------------|
| **Sono** | 11 (MEJOY-0152 a 0162) — completo |
| **Menopausa/TPM** | 3 (0141, 0145, 0150) |
| **Lipedema** | 2 (0132, 0140) |

---

## 3. Ganhos do v3 sobre o v2

- **Diferenciação:** Cada produto Sono tem `what_makes_this_formula_different` e `comparison_note`
- **SEO:** `search_intent_primary`, `top_questions_real` para conteúdo orgânico
- **Ciência:** `science_summary`, `evidence_level` (honesto, sem fake claims)
- **Perfil:** `best_fit_profile`, `not_for_whom` para clareza de escolha
- **Scores:** `editorial_score`, `differentiation_score` para QA

---

## 4. Relatório de qualidade (copy-v3-quality-report.json)

- **Média editorial_score:** 71
- **Média differentiation_score:** 53
- **Repetições detectadas:** 11 (hero_benefit muito similar entre irmãos)
- **Revisão humana sugerida:** 20 SKUs (Menopausa + Lipedema prioritários)

---

## 5. Comandos

```bash
pnpm run copy:blueprint:v3   # Gera v3 a partir do v2
pnpm run copy:validate:v3   # Valida v3
pnpm run copy:quality:v3    # Relatório de qualidade
```

---

## 6. Integração no front

O v3 **ainda não está integrado** no front. O piloto atual usa o v2.

**Próximos passos para integrar v3:**

1. Estender `copy-v2.ts` (ou criar `copy-v3.ts`) para ler v3
2. Usar `science_summary`, `best_fit_profile`, `what_makes_this_formula_different` na PDP
3. Usar `top_questions_real` para enriquecer FAQ ou bloco "Perguntas que as pessoas fazem"
4. Manter fallback para v2

---

## 7. Produtos que precisam revisão humana

Conforme `copy-v3-quality-report.json`:

- **Lipedema:** MEJOY-0132 a 0140 (9 produtos)
- **Menopausa/TPM:** MEJOY-0141 a 0151 (11 produtos)

Esses clusters têm enriquecimento parcial. Recomenda-se revisão editorial para completar `science_summary`, `best_fit_profile` e `what_makes_this_formula_different`.

---

## 8. Pode expandir agora?

**Não.** Recomendação:

1. Validar piloto Sono no navegador (flag ativa)
2. Completar enriquecimento Menopausa e Lipedema no v3
3. Revisar os 11 pares com repetição de hero_benefit
4. Só então expandir piloto para Menopausa e Lipedema
