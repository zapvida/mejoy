# 🚀 GO/NO-GO FINAL - LANÇAMENTO B2B2C

**Data:** 4 de novembro de 2025  
**Status:** ⚠️ Aguardando configurações e validação

---

## ✅ CHECKLIST GO/NO-GO

### ✅ Código (100% implementado)

- [x] Lote H: Wizard `/b2b/configurar` completo
- [x] Lote I: Provisionamento automático
- [x] Retenção 48h configurada
- [x] Cron de limpeza automática
- [x] Integrações completas (draft_id no fluxo)
- [x] Webhook deleta draft após criar tenant
- [x] Migração SQL criada
- [x] Prisma Client gerado

### ⚠️ Configurações (PENDENTE - VOCÊ PRECISA FAZER)

#### 1. Supabase (5 min)

- [ ] **Migração SQL executada**
  - Arquivo: `prisma/migrations/20241104_add_branding_draft_and_tenant/migration.sql`
  - Ação: Supabase Dashboard → SQL Editor → Colar e executar

- [ ] **Bucket Storage configurado**
  - Bucket: `public`
  - Política: Leitura pública (anon SELECT)

#### 2. Vercel (10 min)

- [ ] **ENVs configuradas (Production)**
  ```bash
  DATABASE_URL=...
  DIRECT_URL=...
  NEXT_PUBLIC_SUPABASE_URL=...
  SUPABASE_SERVICE_ROLE_KEY=...  # ⚠️ CRÍTICO
  CLEANUP_CRON_TOKEN=...          # ⚠️ CRÍTICO (gerar: openssl rand -hex 32)
  STRIPE_SECRET_KEY=...
  STRIPE_WEBHOOK_SECRET=...
  NEXT_PUBLIC_ROOT_B2B_DOMAINS=aistotele.com,www.aistotele.com
  NEXT_PUBLIC_BRAND_NAME=Aistotele
  NEXT_PUBLIC_SHOW_SALES_ASSISTANT=1
  GHL_LOCATION_ID=...
  GHL_PIPELINE_ID=...
  GHL_STAGE_VISIT=...
  GHL_STAGE_TRIAGE=...
  GHL_STAGE_CHECKOUT=...
  GHL_STAGE_WON=...
  ```

- [ ] **Wildcard DNS configurado**
  - Vercel → Domains → Adicionar `aistotele.app`
  - Habilitar **Wildcard subdomains**
  - DNS: `*.aistotele.app` → Vercel

#### 3. Stripe (2 min)

- [ ] **Webhook verificado**
  - Endpoint: `https://aistotele.com/api/stripe/webhook`
  - Eventos: `checkout.session.completed`, `invoice.payment_succeeded`
  - Status: Ativo e testado

---

## 🧪 VALIDAÇÃO EM PRODUÇÃO

### Teste 1: Smoke Test

```bash
BASE_URL=https://www.aistotele.com pnpm smoke:prod
```

**Esperado:**
- ✅ GET `/` → 200
- ✅ GET `/#cases` → 200
- ✅ GET `/b2b/sandbox` → 200
- ✅ GET `/b2b/assinar` → 200
- ✅ GET `/triagem` → 200
- ✅ GET `/api/tenant/info` → 200
- ✅ GET `/api/analytics/vitals` → 405

### Teste 2: E2E (Playwright)

```bash
BASE_URL=https://www.aistotele.com pnpm e2e:prod
```

**Esperado:**
- ✅ LP renderiza "Triagens inteligentes..."
- ✅ CTAs visíveis (`cta-assinar-hero`, `cta-demo-hero`)
- ✅ Navegação funciona: root → configurar → sandbox → assinar
- ✅ Página `/b2b/configurar` carrega com preview

### Teste 3: Fluxo Manual Completo

**Passos:**
1. Acessar `https://www.aistotele.com`
2. Clicar "Personalizar agora (grátis)"
3. `/b2b/configurar`:
   - Upload logo (PNG ≤5MB)
   - Escolher cores (primária + secundária)
   - Preencher nome fantasia, CTA, WhatsApp
   - Ver preview funcionando
   - Clicar "Continuar"
4. `/b2b/assinar?draft={id}`:
   - Preencher formulário
   - Enviar
   - Verificar redirecionamento para `/pricing?draft={id}`
5. `/pricing`:
   - Verificar `draft_id` na query
   - Selecionar plano
   - Abrir checkout (dev tools: verificar metadata.draft_id)
6. **Checkout Stripe:**
   - Completar pagamento (modo teste)
7. **Webhook:**
   - Verificar logs do webhook
   - Confirmar tenant criado
   - Confirmar draft deletado
8. **URL Provisória:**
   - Receber WhatsApp com `{slug}.aistotele.app`
   - Acessar URL
   - Verificar branding aplicado (logo, cores)

### Teste 4: Cron de Limpeza

```bash
curl -X POST \
  -H "x-cron-token: SEU_TOKEN_AQUI" \
  https://www.aistotele.com/api/cron/cleanup
```

**Esperado:**
```json
{
  "ok": true,
  "removedDrafts": 0,
  "removedTenants": 0,
  "removedLogos": 0,
  "timestamp": "..."
}
```

---

## 📊 CRITÉRIOS DE GO/NO-GO

### ✅ GO (Aprovar Lançamento)

TODOS os itens abaixo devem passar:

- [ ] Migração SQL executada no Supabase
- [ ] ENVs configuradas no Vercel (incluindo CLEANUP_CRON_TOKEN)
- [ ] Wildcard DNS configurado e funcionando
- [ ] Smoke test: TODOS os endpoints retornam 2xx
- [ ] E2E test: TODOS os testes passam
- [ ] Fluxo manual: wizard → checkout → tenant criado
- [ ] Draft deletado após provisionamento
- [ ] URL provisória funciona com branding
- [ ] Cron responde 200 com token correto
- [ ] CTAs visíveis na LP (desktop + mobile)

### ❌ NO-GO (Não Aprovar)

Se QUALQUER um ocorrer:

- [ ] Migração SQL não executada
- [ ] ENVs faltando (especialmente CLEANUP_CRON_TOKEN)
- [ ] Wildcard não configurado
- [ ] Smoke test: algum endpoint retorna 4xx/5xx
- [ ] E2E test: testes falhando
- [ ] Fluxo manual: erro em qualquer etapa
- [ ] Draft não deletado após checkout
- [ ] URL provisória não funciona
- [ ] Cron retorna 401 (token incorreto)
- [ ] CTAs invisíveis na LP

---

## 🎯 MÉTRICAS DE SUCESSO (Dia 1)

Após lançamento, monitorar:

- **A→B (LP → Configurar):** ≥ 6%
- **B→C (Configurar → Assinar):** ≥ 40%
- **C→D (Assinar → Checkout start):** ≥ 70%
- **D→E (Checkout success):** ≥ 30%
- **E→F (Tenant first-open):** ≥ 95%

---

## 🔧 RUNBOOK DE SUPORTE

### Webhook Falha

**Sintoma:** Tenant não criado após pagamento

**Solução:**
1. Stripe Dashboard → Events → Buscar último `checkout.session.completed`
2. Retry event
3. Ou rodar manualmente: `provisionTenantFromSession(sessionId)`

### Wildcard Não Funciona

**Sintoma:** `{slug}.aistotele.app` não carrega

**Solução:**
- Usar fallback `/t/{slug}` temporariamente
- Verificar DNS: `*.aistotele.app` → Vercel
- Aguardar propagação DNS (até 24h)

### Upload Falha

**Sintoma:** Logo não faz upload

**Solução:**
1. Verificar `SUPABASE_SERVICE_ROLE_KEY` no Vercel
2. Verificar bucket `public` existe
3. Verificar políticas do bucket

### Cron 401

**Sintoma:** Cron retorna unauthorized

**Solução:**
1. Verificar `CLEANUP_CRON_TOKEN` no Vercel
2. Verificar header `x-cron-token` no request
3. Regenerar token se necessário

---

## 📝 COPY PARA CAMPANHAS

### WhatsApp/E-mail (Empresários)

```
Olá! 👋

A Aistotele permite oferecer triagens médicas inteligentes com a sua marca (logo, cores e domínio).

Você personaliza grátis em 2 minutos, vê o preview funcionando e só paga se gostar.

✅ White-label completo
✅ Relatórios com IA
✅ Links e QRs para campanhas

Experimente: www.aistotele.com — clique em 'Personalizar agora (grátis)' 🚀
```

### Meta/Google Ads

**Headline:**
"Triagens médicas inteligentes com sua marca. White-label em minutos."

**Descrição:**
"Aqueça leads, gere valor e acompanhe resultados com relatórios personalizados. Logo, domínio e CTAs da sua clínica. Alloe Health e ZapVida já utilizam."

**CTA:**
"Ver demonstração grátis"

---

## 🚀 PRÓXIMA AÇÃO IMEDIATA

### Ordem Exata:

1. **Executar migração SQL no Supabase** (5 min)
   - Abrir: `prisma/migrations/20241104_add_branding_draft_and_tenant/migration.sql`
   - Colar no Supabase SQL Editor → Executar

2. **Configurar ENVs no Vercel** (10 min)
   - Adicionar todas as variáveis listadas
   - **CRÍTICO:** `CLEANUP_CRON_TOKEN` (gerar: `openssl rand -hex 32`)

3. **Configurar Wildcard** (5 min)
   - Vercel → Domains → `aistotele.app` → Enable Wildcard

4. **Deploy** (5 min)
   ```bash
   git add .
   git commit -m "feat: Lote H+I completo - pronto para lançamento"
   git push origin main
   ```

5. **Validação** (15 min)
   ```bash
   # Smoke
   BASE_URL=https://www.aistotele.com pnpm smoke:prod
   
   # E2E
   BASE_URL=https://www.aistotele.com pnpm e2e:prod
   
   # Teste manual completo
   # (seguir passos do Teste 3 acima)
   ```

---

## ✅ STATUS ATUAL

**Código:** ✅ 100% implementado  
**Migração:** ⚠️ SQL criada, aguardando execução  
**ENVs:** ⚠️ Lista pronta, aguardando configuração  
**DNS:** ⚠️ Aguardando configuração  
**Validação:** ⚠️ Aguardando deploy

**Tempo estimado para GO:** 30-45 minutos

---

**Quando todos os passos acima estiverem ✅ → GO para lançamento!** 🚀

