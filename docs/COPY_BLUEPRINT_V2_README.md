# Copy Blueprint v2 — Base Editorial Premium

## Visão geral

O `copy-blueprint-v2.csv` é a fonte mestra editorial para os 162 produtos MEJOY. Foi criado a partir do v1 (congelado), com normalização forte, novas colunas editoriais, compliance score e copy reescrita por cluster.

**Status:** Pronto para revisão manual. NÃO integrado no site.

---

## Arquivos criados

| Arquivo | Descrição |
|---------|-----------|
| `data/store-v2/copy/copy-blueprint-v1.csv` | Base congelada (não editar) |
| `data/store-v2/copy/copy-blueprint-v2.csv` | Fonte mestra editorial premium |
| `scripts/generate-copy-blueprint-v2.ts` | Gerador do v2 |
| `scripts/validate-copy-blueprint-v2.ts` | Validador com quality gates |
| `scripts/lib/copy-normalizer.ts` | Módulo de normalização |
| `scripts/generated/copy-blueprint-v2-report.json` | Relatório de geração |
| `scripts/generated/copy-normalization-issues.json` | Correções de normalização aplicadas |

---

## Campos do v2

### Identificação e normalização
- `sku`, `productName`, `normalizedProductName`
- `primaryActive`, `normalizedPrimaryActive`
- `dose`, `normalizedDose`
- `pack`, `normalizedPack`
- `formKey`, `normalizedFormDisplay`

### Copy editorial
- `hero_benefit` — Frase curta e forte
- `shortBenefit` — Benefício resumido
- `problem_statement` — Dor/necessidade que o produto conversa
- `who_is_it_for` — Perfil do comprador
- `when_to_consider` — Contexto de uso
- `differentiators` — Diferenciais da fórmula
- `description_md` — Markdown com seções obrigatórias
- `faq` — 4–6 perguntas úteis
- `cautions` — Cuidados específicos

### SEO
- `seoTitle`, `seoDescription`, `seo_h1`
- `search_intent` — informational | commercial | transactional | mixed
- `questions_people_ask` — Perguntas reais de busca
- `keywords_primary` — 3–5 termos
- `keywords_secondary` — 6–12 termos
- `semantic_entities` — Entidades relacionadas
- `internal_links` — Links sugeridos

### Compliance
- `compliance_risk` — low | medium | high
- `compliance_notes` — Notas de revisão
- `medical_review_needed` — yes | no
- `review_status` — draft | needs_review | approved
- `needs_catalog_review` — yes | no (conflitos nome/dose/pack)

---

## Lógica de compliance

| Risco | Critérios | Ação |
|-------|-----------|------|
| **high** | Minoxidil, Orlistat, Tadalafila, Progesterona transdérmica, Ioimbina | `medical_review_needed=yes`, `review_status=needs_review` |
| **medium** | Hormonal, menopausa, lipedema, linguagem sensível | Sugerida revisão antes de publicação |
| **low** | Demais produtos | `draft` |

---

## Principais melhorias vs v1

1. **Normalização forte** — Selênio, Cafeína, Ômega, Sachês, Transdérmica, Ácido Málico, UC II, Óleo, Prímula, etc.
2. **Colunas editoriais** — hero_benefit, problem_statement, who_is_it_for, when_to_consider, differentiators
3. **Estrutura description_md** — O que é | Para quem | Diferenciais | Como usar | Cuidados
4. **FAQ real** — 5 perguntas úteis por produto (não placeholder)
5. **Compliance score** — Classificação por risco e revisão obrigatória para high
6. **SEO semântico** — questions_people_ask, semantic_entities
7. **Priorização** — Clusters Sono, Menopausa/TPM e Lipedema com copy diferenciada

---

## Conflitos detectados no catálogo

Nenhum conflito estrutural (nome vs dose vs pack) foi encontrado na última geração.

---

## Clusters prioritários

1. **Sono** — Copy focada em relaxamento, rotina noturna, qualidade do sono
2. **Menopausa/TPM** — Copy focada em desconfortos hormonais, alterações de humor
3. **Lipedema** — Copy focada em bem-estar corporal e cuidados específicos

---

## Comandos

```bash
pnpm run copy:blueprint:v2   # Gera copy-blueprint-v2.csv
pnpm run copy:validate:v2   # Valida com quality gates
```

---

## Próximos passos recomendados

1. **Revisão manual** — Priorizar os 14 SKUs high risk (Minoxidil, Orlistat, Tadalafila, Progesterona, Ioimbina)
2. **Revisão por cluster** — Sono, Menopausa/TPM, Lipedema
3. **Piloto no front** — Integrar apenas `/c/sono` primeiro
4. **Medir** — CTR, permanência, conversão
5. **Rollout** — Expandir para demais categorias após validação

---

## SKUs que precisam revisão manual (high risk)

- MEJOY-0036, MEJOY-0037, MEJOY-0038, MEJOY-0039, MEJOY-0040 (Minoxidil)
- MEJOY-0057, MEJOY-0058, MEJOY-0059, MEJOY-0060 (Ioimbina)
- MEJOY-0066 (Orlistat)
- MEJOY-0126, MEJOY-0127, MEJOY-0128 (Tadalafila)
- MEJOY-0149 (Progesterona transdérmica)
