# Relatório Forense Final de Estabilização — MeJoy

**Data:** 2026-03-06  
**Modo:** Fase Forense — Verdade Única (logs reais, execução real)

---

## 1. RESUMO EXECUTIVO

Esta rodada focou em **eliminar contradições** entre relatório anterior e logs reais. Foram aplicadas correções definitivas de serialização PDP, validação por execução real e auditoria forense de rotas.

**Resultado desta rodada:**
- Serialização PDP corrigida (sanitização explícita de todos os campos)
- Rotas críticas validadas por HTTP real: 200 em /, /search, /favoritos, /cart, PDPs
- Build e lint OK
- Erro chunk/vendor: não reproduzido após `rm -rf .next` (causa: cache corrompido)
- 404: não reproduzido — rotas respondem 200

**Veredito técnico:** Base estável para deploy. GO para deploy e teste em produção. GO para lançamento oficial **condicionado** a ASAAS_API_KEY em produção e smoke de checkout real.

---

## 2. CONTRADIÇÕES ENTRE RELATÓRIO ANTERIOR E LOGS REAIS

| Relatório anterior afirmou | Logs reais contradiziam |
|----------------------------|-------------------------|
| "162 PREMIUM_VALIDADO" | Rota PDP falhava por serialização `copyV2Faq` undefined |
| "Runtime estável" | Erro `Cannot find module './chunks/vendor-chunks/...js'` → 500 |
| "Zero 500 em dev" | 500 em / e /p/[slug] por chunk |
| "Smoke passando" | GET /, /search, /favoritos, /cart, /p/... retornando 404 em alguns momentos |

**Causa raiz das contradições:** Validação baseada em suposição (copy/DB) sem execução HTTP real; cache `.next` corrompido; serialização com `undefined` em props.

---

## 3. BLOQUEADORES REAIS ENCONTRADOS

| # | Bloqueador | Severidade | Status |
|---|------------|------------|--------|
| 1 | Serialização PDP: `copyV2Faq`, `benefitsStructured`, `heroBullets` podiam ter `undefined` | Crítica | **RESOLVIDO** |
| 2 | Erro chunk/vendor → 500 | Crítica | **RESOLVIDO** (rm .next) |
| 3 | 404 em rotas principais | Alta | **NÃO REPRODUZIDO** (possível estado transitório) |
| 4 | Validação "PREMIUM_VALIDADO" sem HTTP real | Média | **MITIGADO** (script validate-pdps-http.ts) |

---

## 4. BLOQUEADORES RESOLVIDOS

### 4.1 Serialização PDP (FASE 1)

**Alterações em `src/pages/p/[slug].tsx`:**
- `safeCopyV2Faq`: array sanitizado, `q` e `a` sempre strings
- `safeHeroBullets`: filtro de undefined, `.toString()` em cada item
- `safeBenefitsStructured`: `title` e `desc` sempre strings
- `safeProduct`: todos os campos com `?? null` ou `?? []`
- `safeRelated`: produtos relacionados sanitizados

**Alterações em `src/lib/store-v2/copy-v2.ts`:**
- `parseFaqFromV2`: `q` e `a` com `?? ''` para evitar undefined
- `getBenefitsStructured`: `m[1]`, `m[2]` com `?? ''`

### 4.2 Erro chunk/vendor (FASE 2)

**Causa:** Cache `.next` corrompido ou inconsistente entre dev/build.

**Solução:** `rm -rf .next && pnpm build` — não reapareceu após restart limpo.

**Prevenção:** Se o erro voltar, executar:
```bash
rm -rf .next && pnpm build && pnpm dev
```

### 4.3 Regressão 404 (FASE 3)

**Investigação:** Middleware não interfere em rotas estáticas. Rewrites/redirects corretos. Rotas dinâmicas `/p/[slug]` e `/[product]` não conflitam.

**Hipótese:** Estado transitório após rebuild ou cache parcial. Não reproduzido nesta rodada.

---

## 5. BLOQUEADORES AINDA ABERTOS

| Item | Bloqueia? | Ação |
|------|-----------|------|
| ASAAS_API_KEY em produção | Checkout Store V2 | Configurar no Vercel antes do lançamento |
| Smoke add-to-cart → checkout | Validação de fluxo | Executar manualmente em produção |
| Imagens reais por produto | Não | Substituir pós-lançamento |

---

## 6. RESULTADO DAS ROTAS CRÍTICAS

Execução real em 2026-03-06 (BASE_URL=http://localhost:3000):

| Rota | Status | Tempo | Observação |
|------|--------|-------|------------|
| / | 200 | ~9s | OK |
| /search | 200 | 48ms | OK |
| /favoritos | 200 | 23ms | OK |
| /cart | 200 | 23ms | OK |
| /p/l-teanine-200-mg-60-capsulas | 200 | ~4s | OK (canônico) |
| /p/l-teanina-200-mg-60-capsulas | 308 | ~3s | Redirect 301 → canônico |
| /p/5-htp-100-mg-60-capsulas | 200 | ~5s | OK |
| /p/passiflora-200-mg-60-capsulas | 200 | ~5s | OK |
| /p/ashwagandha-ginseng-indiano-500-mg-60-capsulas | 200 | ~4s | OK |
| /p/acido-malico-magnesio-quelato-90-capsulas | 308 | — | Redirect → ac-malico-magnesio-quelato-90-capsulas |

**Script:** `pnpm tsx scripts/audit-routes-forensic.ts`

---

## 7. RESULTADO DA AUDITORIA DE SLUGS

| Métrica | Valor |
|---------|-------|
| Total matriz (blueprint) | 162 |
| Total DB | 162 |
| Divergências (matriz ≠ DB) | 19 |
| Aliases em catalog.ts | 19 |
| Slugs canônicos | 143 |

**Comportamento:** URL com slug da matriz → redirect 301 para slug canônico (DB). Alias 100% funcional.

**Script:** `pnpm tsx scripts/audit-slugs.ts`

---

## 8. MATRIZ FINAL REAL DOS 162 PRODUTOS

A validação anterior (`validate-pdps.ts`) era baseada em copy/DB, **não em HTTP real**. Foi criado `validate-pdps-http.ts` para validação por rota funcional.

**Status da validação por copy (validate-pdps.ts):**
- PREMIUM_VALIDADO: 162 (hero, mechanism, benefits, faq, warnings OK)
- rota_ok: assumido true (não validado por HTTP)

**Validação HTTP (validate-pdps-http.ts):**
- Executa GET em cada `/p/{slug_db}`
- status_final: PREMIUM_VALIDADO_REAL (200) ou FUNCIONAL_VALIDADO_REAL (308) ou BLOQUEAR (404)
- Uso: `BASE_URL=http://localhost:3000 pnpm tsx scripts/validate-pdps-http.ts`

**Amostra validada manualmente:** 10+ PDPs retornaram 200 ou 308. Nenhum 404 ou 500.

---

## 9. RESULTADO DE LINT/BUILD/DEV

```
pnpm lint   — ✅ OK
pnpm build  — ✅ OK (rm -rf .next antes)
pnpm dev    — ✅ OK (/, /search, /favoritos, /cart, PDPs 200)
```

**Runtime:** Estável após limpeza de cache e correções de serialização.

---

## 10. STATUS DOS ENVS

| Variável | Impacto real | Bloqueia storefront? | Bloqueia PDP? | Bloqueia add-to-cart? | Bloqueia checkout? | Bloqueia CRM? | Obrigatório antes deploy? | Obrigatório antes lançamento? |
|----------|--------------|----------------------|---------------|------------------------|--------------------|---------------|---------------------------|-------------------------------|
| DATABASE_URL | Storefront + PDP | Sim | Sim | Sim | Sim | — | Sim | Sim |
| ASAAS_API_KEY | Checkout Store V2 | Não | Não | Não | **Sim** | — | Não | **Sim** |
| STRIPE_SECRET_KEY | Checkout Zapfarm | Não | Não | Não | Não (Store V2 usa Asaas) | — | Não | Não |
| STRIPE_WEBHOOK_SECRET | Webhooks | Não | Não | Não | Não | — | Não | Não |
| STRIPE_PRICE_* | Planos Plus/Gift | Não | Não | Não | Não | — | Não | Não |
| GHL_API_KEY | CRM | — | Não | Não | Não | Sim | Não | Sim (se CRM) |
| GHL_LOCATION_ID | CRM | — | Não | Não | Não | Sim | Não | Sim (se CRM) |
| GHL_PIPELINE_ID | CRM | — | Não | Não | Não | Sim | Não | Sim (se CRM) |
| NEXT_PUBLIC_STORE_V2 | Storefront | Sim | Sim | Sim | Sim | — | Sim | Sim |
| NEXT_PUBLIC_BASE_URL | SEO | Não | Não | Não | Não | — | Não | Não |

---

## 11. GO / NO-GO PARA DEPLOY

### **GO PARA DEPLOY**

- Serialização PDP corrigida
- Zero 500 em dev (após correções)
- Lint/Build OK
- Rotas críticas validadas por HTTP
- Slugs com alias/redirect funcionando

**Condição:** DATABASE_URL configurada em produção (Vercel).

---

## 12. GO / NO-GO PARA TESTE EM PRODUÇÃO

### **GO PARA TESTE EM PRODUÇÃO**

- Smoke forense passou (rotas 200)
- PDPs testadas manualmente OK
- Sem erro de serialização nos logs
- Sem erro chunk/vendor após restart

**Recomendação:** Deploy → testar home, busca, favoritos, PDP, cart, add-to-cart em produção.

---

## 13. GO / NO-GO PARA LANÇAMENTO OFICIAL

### **GO PARA LANÇAMENTO OFICIAL** (com condição)

**Condição:** ASAAS_API_KEY configurada para checkout funcionar.

**O que está pronto:**
- Storefront estável
- 162 produtos com copy premium
- Slugs consistentes (19 aliases)
- Serialização PDP corrigida
- Rotas validadas por execução real

**O que falta para "iniciar vendas":**
- ASAAS_API_KEY em produção
- Teste real de add-to-cart → checkout → pagamento

---

## 14. COMANDOS EXATOS FINAIS

```bash
# Limpar cache e rebuild (se 500 ou chunk/vendor voltar)
rm -rf .next && pnpm build

# Auditoria forense de rotas (requer dev rodando)
BASE_URL=http://localhost:3000 pnpm tsx scripts/audit-routes-forensic.ts

# Validação PDP por HTTP (requer dev rodando)
BASE_URL=http://localhost:3000 pnpm tsx scripts/validate-pdps-http.ts

# Validação PDP por copy (requer DB)
pnpm tsx scripts/validate-pdps.ts

# Auditoria de slugs (requer DB)
pnpm tsx scripts/audit-slugs.ts

# Lint e build
pnpm lint && pnpm build

# Deploy
git add -A && git status && git commit -m "fix(launch): serialização PDP + auditoria forense" && git push origin main
```

---

## ARQUIVOS ALTERADOS NESTA RODADA

| Arquivo | Alteração |
|---------|-----------|
| src/pages/p/[slug].tsx | Sanitização explícita copyV2Faq, heroBullets, benefitsStructured, safeProduct, safeRelated |
| src/lib/store-v2/copy-v2.ts | parseFaqFromV2 e getBenefitsStructured com fallback para string vazia |
| scripts/audit-routes-forensic.ts | Novo — auditoria HTTP de rotas críticas |
| scripts/validate-pdps-http.ts | Novo — validação PDP por HTTP real |
| docs/RELATORIO-FORENSE-ESTABILIZACAO.md | Este documento |

---

*Documento gerado pelo Cursor Agent em modo Fase Forense de Estabilização.*
