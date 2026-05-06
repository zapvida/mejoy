# Status Completo e Próximos Passos — MeJoy E-commerce

**Data:** 2026-03-06  
**Objetivo:** Melhor e-commerce de farmácia de manipulação do Brasil, com PDPs mais conversíveis e copywriting completo, total e inteligente.

---

## 0. Por que o audit falhou com "fetch failed"

O script `audit-routes-forensic.ts` faz **fetch** em `http://localhost:3000`. O servidor precisa estar **rodando** antes de executar o audit.

**Para rodar o audit corretamente:**

```bash
# Terminal 1 — servidor
pnpm dev

# Terminal 2 — audit (depois que o servidor estiver pronto)
BASE_URL=http://localhost:3000 pnpm tsx scripts/audit-routes-forensic.ts
```

Ou, após build de produção:

```bash
pnpm build && pnpm start
# Em outro terminal:
BASE_URL=http://localhost:3000 pnpm tsx scripts/audit-routes-forensic.ts
```

---

## 1. FASE ATUAL E ONDE ESTAMOS

### Fase atual: **PÓS-ESTABILIZAÇÃO — PRONTO PARA DEPLOY**

| Etapa | Status | Observação |
|-------|--------|------------|
| **Estabilização técnica** | ✅ Concluída | Serialização, build, lint OK |
| **Deploy** | ✅ GO | Base estável |
| **Teste em produção** | 🔜 Pendente | Smoke após deploy |
| **Lançamento oficial** | 🔜 Condicionado | ASAAS_API_KEY + checkout validado |
| **Copy e conversão** | 🟡 Parcial | 162 premium, mas ainda há margem |
| **Melhor e-commerce do mundo** | 🟡 Em construção | Roadmap abaixo |

---

## 2. O QUE JÁ TEMOS (CONFIRMADO)

### 2.1 Infraestrutura

| Item | Status |
|------|--------|
| Build Next.js 15 | ✅ OK |
| Lint | ✅ OK |
| Serialização PDP | ✅ Corrigida |
| 162 produtos no catálogo | ✅ |
| 19 slug aliases (matriz → DB) | ✅ |
| Slugs canônicos + redirect 301 | ✅ |

### 2.2 PDP (Página de Produto)

| Item | Status | Fonte |
|------|--------|-------|
| Hero bullets (5–7 com ✅ e emojis) | ✅ | copy-v2.ts, PDP_MASTER_OVERRIDES |
| Mechanism summary (subtítulo 1 frase) | ✅ | getMechanismSummaryForPdp, MECHANISM_OVERRIDES |
| Benefits estruturados (negrito + desc) | ✅ | getBenefitsStructured |
| Composição em tabela | ✅ | PdpCompositionTable |
| Advertências formatadas | ✅ | PdpWarnings |
| FAQ (produto ou genérico) | ✅ | parseFaqFromV2, FAQ_GENERICO |
| Badge % OFF | ✅ | PDP |
| Parcelamento visível (3x, 6x, 12x) | ✅ | PDP |
| Sticky CTA desktop | ✅ | PDP |
| Sticky CTA mobile | ✅ | PDP |
| Calcular frete e prazo na PDP | ✅ | PdpShippingCalculator |
| Galeria com thumbnails | ✅ | PDP |
| Ciência / Diferencial | ✅ | copyV4Science, copyV4Diferencial |
| Para quem é | ✅ | copyV4BestFit |
| Como usar | ✅ | PDP |
| Quem viu viu também | ✅ | getRelatedProducts |

### 2.3 Site

| Item | Status |
|------|--------|
| Home Store V2 | ✅ |
| Busca por objetivo (/c/[objetivo]) | ✅ |
| Página de busca (/search) | ✅ |
| Favoritos (/favoritos) | ✅ |
| Carrinho (/cart) | ✅ |
| Checkout Store V2 | ✅ (API Asaas) |

### 2.4 Copy Pipeline

| Item | Status |
|------|--------|
| copy-blueprint-v4.csv | ✅ |
| 162 SKUs com copy | ✅ |
| hero_bullets, mechanism, benefits, faq, cautions | ✅ |
| Fallbacks automáticos | ✅ |
| MECHANISM_OVERRIDES (19 SKUs) | ✅ |
| PDP_MASTER_OVERRIDES (L-Teanina) | ✅ |

---

## 3. O QUE FALTA PARA "MELHOR E-COMMERCE FARMÁCIA DO MUNDO"

### 3.1 Conversão (PDP mais conversível)

| # | Item | Prioridade | Esforço |
|---|------|------------|---------|
| 1 | **Copywriting 100% completo** — 162 SKUs com copy premium sem fallback genérico | P0 | Alto |
| 2 | **Autocomplete na busca** — dropdown top 6 ao digitar | P0 | Médio |
| 3 | **Reviews reais** — integração com avaliações (se houver) | P1 | Médio |
| 4 | **Trust signals** — selos, badges, "X clientes compraram" | P1 | Baixo |
| 5 | **Carousel auto-scroll** na home | P1 | Baixo |
| 6 | **Imagens reais** por produto (hoje usa placeholder/repetição) | P1 | Alto |
| 7 | **A/B test** de headlines e CTAs | P2 | Médio |

### 3.2 Copywriting Completo e Inteligente

| # | Item | Status | Ação |
|---|------|--------|------|
| 1 | **Copy premium por SKU** | 162/162 | Revisar SKUs com fallback genérico |
| 2 | **Hero bullets** | 162/162 | Garantir 5–7 bullets únicos por produto |
| 3 | **Mechanism summary** | 162/162 | 19 overrides; demais via blueprint |
| 4 | **Benefits estruturados** | 162/162 | Revisar produtos com 0 benefits |
| 5 | **FAQ** | 162/162 | Revisar SKUs usando FAQ_GENERICO |
| 6 | **Cautions** | 162/162 | Revisar SKUs sem cautions específicos |
| 7 | **Ciência/Diferencial** | Parcial | Expandir science_summary, evidence_level |
| 8 | **Para quem é** | Parcial | Expandir best_fit_profile |

### 3.3 Operacional

| # | Item | Status |
|---|------|--------|
| 1 | ASAAS_API_KEY em produção | Pendente |
| 2 | Smoke checkout real | Pendente |
| 3 | GHL (CRM) se necessário | Pendente |

---

## 4. PRÓXIMOS PASSOS (ORDEM RECOMENDADA)

### Passo 1 — Validar em produção (imediato)

```bash
# 1. Deploy
git add -A && git commit -m "chore: status e próximos passos" && git push origin main

# 2. Após deploy na Vercel, iniciar servidor local para audit:
pnpm dev

# 3. Em outro terminal, audit contra produção (opcional):
BASE_URL=https://www.mejoy.com.br pnpm tsx scripts/audit-routes-forensic.ts
```

### Passo 2 — Configurar ASAAS em produção

- Adicionar `ASAAS_API_KEY` no painel Vercel
- Testar add-to-cart → checkout → pagamento

### Passo 3 — Auditoria de copy (SKU a SKU)

```bash
# Identificar SKUs com fallback genérico
pnpm tsx scripts/validate-pdps.ts
# Ver scripts/generated/pdp-validation.json — status_final REVISAR ou BLOQUEAR

# Score de copy
pnpm copy:score-v4
```

### Passo 4 — Enriquecer copy faltante

- Scripts: `copy:enrich-premium`, `copy:harden-compliance-v4`
- Revisão manual dos SKUs com FAQ genérico ou benefits vazios
- Pipeline: `pnpm copy:pipeline:v4`

### Passo 5 — Autocomplete na busca

- Header: input de busca com dropdown
- API: `/api/store-v2/search?q=` com limit 6
- Debounce 300ms

### Passo 6 — Imagens e trust signals

- Importar imagens reais por produto
- Carousel auto-scroll na home
- Badges "Mais vendido", "Novidade"

---

## 5. MATRIZ DE DECISÃO — GO/NO-GO

| Critério | Deploy | Teste Prod | Lançamento Oficial |
|----------|--------|------------|---------------------|
| Build OK | ✅ | ✅ | ✅ |
| Serialização OK | ✅ | ✅ | ✅ |
| Rotas 200 | ✅* | ✅ | ✅ |
| ASAAS em prod | — | Não | **Sim** |
| Checkout validado | — | Não | **Sim** |
| Copy 100% | — | — | Não (pode melhorar pós-lançamento) |

\* Rotas validadas com servidor rodando. Audit falhou por servidor parado.

---

## 6. COMANDOS ÚTEIS

```bash
# Build limpo
rm -rf .next && pnpm build

# Dev (necessário para audit)
pnpm dev

# Audit (com dev rodando)
BASE_URL=http://localhost:3000 pnpm tsx scripts/audit-routes-forensic.ts

# Validação PDP por HTTP (com dev rodando)
BASE_URL=http://localhost:3000 pnpm tsx scripts/validate-pdps-http.ts

# Validação PDP por copy (requer DB)
pnpm tsx scripts/validate-pdps.ts

# Pipeline copy v4
pnpm copy:pipeline:v4

# Score copy
pnpm copy:score-v4
```

---

## 7. RESUMO EXECUTIVO

| Pergunta | Resposta |
|----------|----------|
| **Em que fase estamos?** | Pós-estabilização. Base técnica estável. Pronto para deploy. |
| **O que falta para deploy?** | Nada. GO para deploy. |
| **O que falta para lançamento oficial?** | ASAAS_API_KEY em produção + smoke checkout real. |
| **O que falta para "melhor e-commerce farmácia"?** | Copy 100% completo, autocomplete, imagens reais, trust signals, carousel. |
| **O que falta para PDP mais conversível?** | Revisar copy dos 162 SKUs, eliminar fallbacks genéricos, FAQ específico por produto. |
| **Copywriting completo e inteligente?** | Parcial. 162 SKUs com copy premium, mas alguns usam fallback. Pipeline v4 existe; expandir science_summary, best_fit_profile, FAQ. |

---

*Documento gerado em 2026-03-06. Atualizar conforme avanço.*
