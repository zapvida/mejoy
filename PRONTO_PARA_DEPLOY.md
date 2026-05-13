# 🚀 PRONTO PARA DEPLOY - LOTE H + I COMPLETO

**Data:** 4 de novembro de 2025  
**Status:** ✅ Código 100% | ⚠️ Configurações pendentes

---

## ✅ O QUE FOI IMPLEMENTADO

### Lote H: Wizard de Personalização
- ✅ Página `/b2b/configurar` com upload de logo, cores, CTAs
- ✅ Preview em tempo real
- ✅ APIs: draft (POST/GET), upload-logo
- ✅ Retenção: 48h (expiresAt calculado)

### Lote I: Provisionamento Automático
- ✅ Função `provisionTenantFromSession()` 
- ✅ Webhook Stripe → cria tenant automaticamente
- ✅ Deleta draft após criar tenant
- ✅ Gera URL provisória: `{slug}.aistotele.app`
- ✅ WhatsApp com URL provisória

### Limpeza Automática
- ✅ API `/api/cron/cleanup` criada
- ✅ Cron configurado no `vercel.json` (a cada 6h)
- ✅ Remove drafts >48h, tenants pendentes >48h, logos órfãs

### Integrações Completas
- ✅ Landing → Personalizar → Assinar → Pricing → Checkout → Tenant
- ✅ `draft_id` passa por todo o fluxo
- ✅ Metadata Stripe inclui `draft_id`

---

## ⚠️ O QUE VOCÊ PRECISA FAZER AGORA

### 1. Supabase (5 minutos)

#### A) Executar Migração SQL
1. Acesse Supabase Dashboard → SQL Editor
2. Abra: `prisma/migrations/20241104_add_branding_draft_and_tenant/migration.sql`
3. Cole e execute o SQL completo

#### B) Configurar Storage
1. Supabase Dashboard → Storage
2. Criar bucket `public` (se não existir)
3. Políticas:
   - Leitura pública (anon SELECT)
   - Upload via service role (já configurado no código)

---

### 2. Vercel (10 minutos)

#### A) Variáveis de Ambiente (Production)

Vercel Dashboard → Settings → Environment Variables → Production:

```bash
# Banco
DATABASE_URL=postgresql://your_user:your_password@your_host:5432/your_database
DIRECT_URL=postgresql://your_user:your_password@your_host:5432/your_database

# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://...
SUPABASE_SERVICE_ROLE_KEY=eyJ...

# Stripe
STRIPE_SECRET_KEY=your_secret_from_provider
STRIPE_PUBLIC_KEY=pk_live_...
STRIPE_WEBHOOK_SECRET=your_secret_from_provider

# B2B
NEXT_PUBLIC_ROOT_B2B_DOMAINS=aistotele.com,www.aistotele.com
NEXT_PUBLIC_BRAND_NAME=Aistotele
NEXT_PUBLIC_SHOW_SALES_ASSISTANT=1

# Cron (GERAR UM TOKEN SEGURO!)
CLEANUP_CRON_TOKEN=seu-token-forte-aqui-123456789

# GHL
GHL_LOCATION_ID=...
GHL_PIPELINE_ID=...
GHL_STAGE_VISIT=...
GHL_STAGE_TRIAGE=...
GHL_STAGE_CHECKOUT=...
GHL_STAGE_WON=...
```

**⚠️ IMPORTANTE:** Gere um token seguro para `CLEANUP_CRON_TOKEN`:
```bash
# Exemplo: usar openssl
openssl rand -hex 32
```

#### B) Configurar Domínio Wildcard
1. Vercel Dashboard → Domains
2. Adicionar `aistotele.app`
3. Habilitar **Wildcard subdomains**
4. Configurar DNS (se ainda não configurado)

---

### 3. Stripe (2 minutos)

#### Verificar Webhook
1. Stripe Dashboard → Webhooks
2. Endpoint: `https://aistotele.com/api/stripe/webhook`
3. Eventos: `checkout.session.completed`, `invoice.payment_succeeded`
4. Testar (modo test ou live)

---

### 4. Deploy (5 minutos)

```bash
# Commit e push
git add .
git commit -m "feat: Lote H+I completo - wizard + provisionamento + cleanup"
git push origin main

# Vercel fará deploy automaticamente
```

---

### 5. Validação (10 minutos)

#### A) Smoke Test
```bash
BASE_URL=https://www.aistotele.com pnpm smoke:prod
```

#### B) E2E Test
```bash
BASE_URL=https://www.aistotele.com pnpm e2e:prod
```

#### C) Teste Manual
1. `https://aistotele.com` → "Personalizar agora"
2. Upload logo, cores, dados
3. Continuar → Assinar → Pricing
4. Checkout (modo teste)
5. Verificar tenant criado
6. Acessar URL provisória

#### D) Testar Cron
```bash
curl -X POST \
  -H "x-cron-token: seu-token-aqui" \
  https://aistotele.com/api/cron/cleanup
```

---

## 📋 CHECKLIST RÁPIDO

### Antes do Deploy
- [ ] Migração SQL executada no Supabase
- [ ] Bucket `public` criado no Supabase Storage
- [ ] Todas as ENVs configuradas no Vercel
- [ ] `CLEANUP_CRON_TOKEN` gerado e configurado
- [ ] Domínio wildcard configurado
- [ ] Webhook Stripe verificado

### Após Deploy
- [ ] Smoke test passa
- [ ] E2E test passa
- [ ] Teste manual completo funciona
- [ ] Cron aparece no Vercel Dashboard
- [ ] URL provisória funciona

---

## 🎯 FLUXO COMPLETO (VALIDAR)

```
1. aistotele.com
   ↓
2. "Personalizar agora (grátis)"
   ↓
3. /b2b/configurar
   - Upload logo ✅
   - Escolher cores ✅
   - Preencher dados ✅
   - Ver preview ✅
   ↓
4. "Continuar" → /b2b/assinar?draft={id}
   ↓
5. Preencher formulário → salva no GHL
   ↓
6. Redireciona → /pricing?draft={id}
   ↓
7. Selecionar plano → checkout Stripe
   - metadata.draft_id incluído ✅
   ↓
8. Webhook Stripe → checkout.session.completed
   ↓
9. provisionTenantFromSession()
   - Cria tenant ✅
   - Deleta draft ✅
   - Gera URL provisória ✅
   ↓
10. WhatsApp enviado com URL
   ↓
11. {slug}.aistotele.app funciona ✅
   ↓
12. Cron limpa drafts/tenants antigos (a cada 6h) ✅
```

---

## 📊 ARQUIVOS CRIADOS

- `src/pages/b2b/configurar.tsx`
- `src/pages/b2b/dominio.tsx`
- `src/pages/api/branding/draft.ts`
- `src/pages/api/branding/upload-logo.ts`
- `src/pages/api/b2b/lead.ts`
- `src/pages/api/b2b/check-domain.ts`
- `src/pages/api/b2b/apply-domain.ts`
- `src/pages/api/cron/cleanup.ts`
- `src/lib/stripe/provision.ts`
- `prisma/migrations/20241104_add_branding_draft_and_tenant/migration.sql`

---

## 🎉 PRONTO PARA LANÇAR!

Após executar os passos acima:
1. ✅ Sistema 100% funcional
2. ✅ Fluxo completo testado
3. ✅ Limpeza automática ativa
4. ✅ Pronto para campanhas

**Tempo total estimado:** 30-45 minutos

---

**Documentação completa:** `CHECKLIST_FINAL_LOTE_H_I.md`

