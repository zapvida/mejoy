# Piloto Copy Blueprint v2 — Cluster Sono

**Data:** 2026-03-06  
**Status:** Implementado, aguardando ativação

## Resumo

Integração controlada do `copy-blueprint-v2.csv` no front, limitada ao cluster **Sono** (MEJOY-0152 a MEJOY-0162). Ativação via feature flag `NEXT_PUBLIC_COPY_V2_PILOT`.

---

## 1. Arquivos alterados

| Arquivo | Alteração |
|---------|-----------|
| `scripts/harden-high-risk-copy.ts` | **Novo** — Script para endurecer os 14 high risk |
| `scripts/generated/copy-high-risk-review-report.json` | **Gerado** — Relatório das alterações nos high risk |
| `src/lib/store-v2/copy-v2.ts` | **Novo** — Helper para leitura do v2 CSV, indexação por SKU |
| `src/lib/flags.ts` | Adicionada flag `NEXT_PUBLIC_COPY_V2_PILOT` |
| `src/pages/p/[slug].tsx` | Integração v2 na PDP (quando piloto ativo + produto Sono) |
| `src/pages/c/[objetivo].tsx` | Integração v2 na categoria `/c/sono` (hero_benefit nos cards) |
| `package.json` | Adicionado script `copy:harden-high-risk` |

---

## 2. O que foi feito

### Bloco 1 — Revisão dos 14 high risk

- **SKUs:** MEJOY-0036 a 0040 (Minoxidil), MEJOY-0057 a 0060 (Ioimbina), MEJOY-0066 (Orlistat), MEJOY-0126 a 0128 (Tadalafila), MEJOY-0149 (Progesterona)
- **Campos endurecidos:** hero_benefit, shortBenefit, problem_statement, when_to_consider, compliance_notes, cautions
- **Linguagem removida/suavizada:** "crescimento e força", "redução de absorção de gordura", "reposição", claims farmacológicas fechadas
- **Relatório:** `scripts/generated/copy-high-risk-review-report.json`

### Bloco 2–6 — Piloto Sono

- **Cluster piloto:** Sono (MEJOY-0152 a MEJOY-0162) — 11 produtos
- **PDP:** Usa do v2: seo_h1, hero_benefit, description_md, faq, cautions, seoTitle, seoDescription
- **Categoria:** `/c/sono` usa hero_benefit do v2 nos ProductCards
- **Fallback:** Produtos fora do piloto ou flag desligada → comportamento atual (Prisma/pricing)

---

## 3. Como funciona a flag

| Variável | Valor | Efeito |
|----------|-------|--------|
| `NEXT_PUBLIC_COPY_V2_PILOT=1` | Ativo | PDP e `/c/sono` usam copy do v2 para produtos Sono |
| `NEXT_PUBLIC_COPY_V2_PILOT=0` ou ausente | Desligado | Comportamento atual (fallback) |

**Ativar localmente:**
```bash
echo "NEXT_PUBLIC_COPY_V2_PILOT=1" >> .env.local
```

**Desativar:**
```bash
# Remover a linha ou definir =0
NEXT_PUBLIC_COPY_V2_PILOT=0
```

---

## 4. Produtos do piloto Sono

| SKU | Produto |
|-----|---------|
| MEJOY-0152 | Gaba 200 mg |
| MEJOY-0153 | Gaba 400 mg |
| MEJOY-0154 | Melatonina 3 mg |
| MEJOY-0155 | Melatonina 5 mg (100 caps) |
| MEJOY-0156 | Melatonina 5 mg (30 caps) |
| MEJOY-0157 | Mulungu 200 mg |
| MEJOY-0158 | Passiflora 200 mg |
| MEJOY-0159 | Proslepp 130 mg |
| MEJOY-0160 | Relora 250 mg |
| MEJOY-0161 | Relora 500 mg |
| MEJOY-0162 | Valeriana 100 mg |

---

## 5. Resultado da revisão high risk

- **14 SKUs** revisados
- **70 alterações** aplicadas no `copy-blueprint-v2.csv`
- **Relatório:** `scripts/generated/copy-high-risk-review-report.json`
- **Validação:** `pnpm run copy:validate:v2` — 162 linhas OK

---

## 6. Comandos executados

```bash
pnpm run copy:harden-high-risk   # Endurece os 14 high risk
pnpm run copy:validate:v2        # Valida o blueprint v2
pnpm run lint                    # Lint
pnpm run build                   # Build Next.js
```

---

## 7. Checklist GO/NO-GO

- [x] 14 high risk revisados
- [x] Relatório de high risk gerado
- [x] Integração v2 apenas para Sono
- [x] Fallback seguro (flag desligada = comportamento atual)
- [x] Feature flag implementada
- [x] Lint OK
- [x] Build OK
- [ ] Smoke manual: `/c/sono` e PDPs do cluster (com flag ativa)
- [ ] Validação visual e editorial no navegador

---

## 8. Deploy em produção

### Passo 6 — Checklist pré-deploy

```bash
# 1. Validar localmente
pnpm run copy:validate:v2
pnpm run build

# 2. OBRIGATÓRIO: incluir data/store-v2/copy/ no commit (contém copy-blueprint-v2.csv)
git add data/store-v2/copy/
git status data/store-v2/copy/   # deve aparecer staged
```

**Sem o CSV no repositório, o piloto não funciona** — o helper retorna null e o fallback é usado.

### Env na Vercel (obrigatório para piloto ativo)

Em **Vercel → Project → Settings → Environment Variables**:

| Variável | Valor | Ambiente |
|----------|-------|----------|
| `NEXT_PUBLIC_COPY_V2_PILOT` | `1` | Production |

Sem essa env, o piloto fica desligado (fallback para copy atual).

### Deploy

```bash
pnpm run deploy
# ou: bash scripts/deploy-vercel.sh "feat: piloto copy v2 Sono em produção"
```

### Validação pós-deploy

1. **https://www.mejoy.com.br/c/sono** — cards com hero_benefit do v2
2. **PDP piloto** (ex.: `/p/gaba-200-mg-60-capsulas`) — description, FAQ, cautions do v2
3. **PDP fora do piloto** — comportamento atual (fallback)
4. **Flag desligada** — `NEXT_PUBLIC_COPY_V2_PILOT=0` → tudo em fallback

---

## 9. Próximos passos (pós-piloto)

1. **Validar no navegador:** PDPs do Sono, `/c/sono`, FAQ, SEO, fallbacks
2. **Expandir para Menopausa/TPM:** Adicionar cluster MEJOY-0141 a 0151 ao piloto
3. **Expandir para Lipedema:** Adicionar cluster MEJOY-0132 a 0140
4. **Rollout completo:** Quando validado, expandir para os 162 produtos

---

## 10. Regras absolutas (não alteradas)

- Checkout, webhook, admin, schema Prisma, pricing — **inalterados**
- Slugs e rotas — **inalterados**
- Integração global sem piloto — **não feita**
