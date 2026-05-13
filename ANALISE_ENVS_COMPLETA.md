# 🔍 ANÁLISE COMPLETA DE ENVs - O QUE ESTÁ CERTO E O QUE FALTA

**Data:** 4 de novembro de 2025  
**Status:** Análise baseada nas imagens do Vercel + código do projeto

---

## ✅ ENVs CORRETAS (Já Configuradas)

### 1. Banco de Dados ✅
- ✅ `DATABASE_URL` - Configurado (postgresql://your_user:your_password@your_host:5432/your_database)
- ✅ `DIRECT_URL` - Configurado (Production)
- ✅ `SUPABASE_SERVICE_ROLE_KEY` - Configurado

### 2. Supabase ✅
- ✅ `NEXT_PUBLIC_SUPABASE_URL` - Configurado (Preview e Production)
- ✅ `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Configurado

### 3. Stripe (Parcial) ✅/⚠️
- ✅ `STRIPE_SECRET_KEY` - Configurado (REDACTED_STRIPE_LIVE_PREFIX...)
- ⚠️ `STRIPE_WEBHOOK_SECRET` - **VAZIO** (precisa preencher)
- ⚠️ `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` - **VAZIO** (precisa preencher)
- ✅ `STRIPE_LOOKUP_PREFIX` - Configurado (aistotele_)

### 4. NextAuth ✅
- ✅ `NEXTAUTH_URL` - Configurado (https://aistotele.com)
- ✅ `NEXTAUTH_SECRET` - Configurado

### 5. Configurações B2B ✅
- ✅ `NEXT_PUBLIC_ROOT_B2B_DOMAINS` - Configurado (aistotele.com,www.aistotele.com)
- ✅ `NEXT_PUBLIC_BRAND_NAME` - Configurado (Aistotele)
- ✅ `NEXT_PUBLIC_SHOW_SALES_ASSISTANT` - Configurado (1)
- ✅ `NEXT_PUBLIC_CUSTOMER_MODE` - Configurado (b2b)

### 6. URLs e Domínios ✅
- ✅ `NEXT_PUBLIC_SITE_URL` - Configurado (https://aistotele.com)
- ✅ `NEXT_PUBLIC_BASE_URL` - Configurado (https://aistotele.com)
- ✅ `PRIMARY_DOMAIN` - Configurado (aistotele.com)

### 7. Cron Job ✅
- ✅ `CLEANUP_CRON_TOKEN` - Configurado (5cfad740627ac1deb7cc39806de6199b...)

### 8. OpenAI ✅
- ✅ `OPENAI_API_KEY` - Configurado

---

## ⚠️ ENVs COM PROBLEMAS (Precisam de Ajuste)

### 1. TENANT_MODE ⚠️
**Atual:** `single`  
**Deveria ser:** `multi`  
**Motivo:** O projeto é B2B2C (multi-tenant). O valor `single` desativa a lógica de multi-tenancy.

**Ação:** Mudar para `multi` no Vercel

### 2. STRIPE_ENABLED ⚠️
**Atual:** `0`  
**Deveria ser:** `1`  
**Motivo:** Stripe está desabilitado. Para monetização funcionar, precisa estar `1`.

**Ação:** Mudar para `1` no Vercel

---

## ❌ ENVs FALTANDO (Críticas para Backend 100%)

### 1. Stripe Price IDs (CRÍTICO) ❌

O código usa estas variáveis (ver `src/lib/stripe-config.ts` e `src/lib/tenancy/tenant.ts`):

- ❌ `STRIPE_PRICE_PLUS_MONTHLY` - **FALTANDO**
- ❌ `STRIPE_PRICE_PLUS_YEARLY` - **FALTANDO**
- ❌ `STRIPE_PRICE_GIFT_MONTHLY` - **FALTANDO**
- ❌ `STRIPE_PRICE_GIFT_YEARLY` - **FALTANDO**
- ❌ `STRIPE_PRICE_ADDON_MONTHLY` - **FALTANDO**
- ❌ `STRIPE_PRICE_ADDON_YEARLY` - **FALTANDO**

**Nota:** Na imagem há `STRIPE_PRICE_ALL_ACCESS` e `STRIPE_PRICE_GIFT` vazios, mas o código não usa esses nomes. O código usa os nomes acima.

**Ação:** Criar produtos/preços no Stripe e preencher estas ENVs

---

## 📋 ENVs OPCIONAIS (Podem estar faltando, mas não críticas)

### GHL (CRM) - Se usar integração
- ⚠️ `GHL_API_KEY` - Não aparece na imagem
- ⚠️ `GHL_LOCATION_ID` - Não aparece na imagem
- ⚠️ `GHL_PIPELINE_ID` - Não aparece na imagem
- ⚠️ `GHL_STAGE_VISIT` - Não aparece na imagem
- ⚠️ `GHL_STAGE_TRIAGE` - Não aparece na imagem
- ⚠️ `GHL_STAGE_CHECKOUT` - Não aparece na imagem
- ⚠️ `GHL_STAGE_WON` - Não aparece na imagem

### Feature Flags (Opcionais)
- ✅ Várias `FF_*` estão configuradas (não críticas)

---

## 📝 .ENV COMPLETO PARA PRODUÇÃO

Aqui está o template completo com TODAS as variáveis necessárias:

```bash
# ==============================================================================
# Aistotele B2B2C - Variáveis de Ambiente PRODUÇÃO
# ==============================================================================

# ==============================================================================
# BANCO DE DADOS
# ==============================================================================
DATABASE_URL="postgresql://your_user:your_password@your_host:5432/your_database"
DIRECT_URL="postgresql://your_user:your_password@your_host:5432/your_database"  # Se usar PGBouncer, use DIRECT_URL separado

# ==============================================================================
# SUPABASE
# ==============================================================================
NEXT_PUBLIC_SUPABASE_URL="https://qltixyfxxxbdnaldgtzr.supabase.co"  # ✅ Já configurado
NEXT_PUBLIC_SUPABASE_ANON_KEY="eyJhbGci0iJIUzI1NiIsInR5cCI6IkpXV..."  # ✅ Já configurado
SUPABASE_SERVICE_ROLE_KEY="your_secret_from_provider"  # ✅ Já configurado

# ==============================================================================
# STRIPE (CRÍTICO - Preencher TODOS)
# ==============================================================================
STRIPE_ENABLED="1"  # ⚠️ MUDAR: Era "0", agora "1"
STRIPE_SECRET_KEY="your_secret_from_provider"  # ✅ Já configurado
STRIPE_WEBHOOK_SECRET="your_secret_from_provider"  # ❌ FALTANDO - Obter no Stripe Dashboard
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_live_..."  # ❌ FALTANDO - Obter no Stripe Dashboard
STRIPE_LOOKUP_PREFIX="aistotele_"  # ✅ Já configurado

# Price IDs (CRÍTICO - Criar no Stripe e preencher)
STRIPE_PRICE_PLUS_MONTHLY="price_..."  # ❌ FALTANDO - Criar produto no Stripe
STRIPE_PRICE_PLUS_YEARLY="price_..."  # ❌ FALTANDO - Criar produto no Stripe
STRIPE_PRICE_GIFT_MONTHLY="price_..."  # ❌ FALTANDO - Criar produto no Stripe
STRIPE_PRICE_GIFT_YEARLY="price_..."  # ❌ FALTANDO - Criar produto no Stripe
STRIPE_PRICE_ADDON_MONTHLY="price_..."  # ❌ FALTANDO - Criar produto no Stripe
STRIPE_PRICE_ADDON_YEARLY="price_..."  # ❌ FALTANDO - Criar produto no Stripe

# ==============================================================================
# NEXTAUTH
# ==============================================================================
NEXTAUTH_URL="https://aistotele.com"  # ✅ Já configurado
NEXTAUTH_SECRET="your_secret_from_provider"  # ✅ Já configurado

# ==============================================================================
# CONFIGURAÇÕES B2B2C
# ==============================================================================
TENANT_MODE="multi"  # ⚠️ MUDAR: Era "single", agora "multi"
NEXT_PUBLIC_ROOT_B2B_DOMAINS="aistotele.com,www.aistotele.com"  # ✅ Já configurado
NEXT_PUBLIC_BRAND_NAME="Aistotele"  # ✅ Já configurado
NEXT_PUBLIC_SHOW_SALES_ASSISTANT="1"  # ✅ Já configurado
NEXT_PUBLIC_CUSTOMER_MODE="b2b"  # ✅ Já configurado

# ==============================================================================
# URLs E DOMÍNIOS
# ==============================================================================
NEXT_PUBLIC_SITE_URL="https://aistotele.com"  # ✅ Já configurado
NEXT_PUBLIC_BASE_URL="https://aistotele.com"  # ✅ Já configurado
PRIMARY_DOMAIN="aistotele.com"  # ✅ Já configurado

# ==============================================================================
# CRON JOB
# ==============================================================================
CLEANUP_CRON_TOKEN="5cfad740627ac1deb7cc39806de6199bd3bfe1a2521466b2cd1004b51fec9d3c"  # ✅ Já configurado

# ==============================================================================
# OPENAI
# ==============================================================================
OPENAI_API_KEY="your_secret_from_provider"  # ✅ Já configurado

# ==============================================================================
# GHL CRM (Opcional - Se usar integração)
# ==============================================================================
GHL_API_KEY=""  # Opcional
GHL_LOCATION_ID=""  # Opcional
GHL_PIPELINE_ID=""  # Opcional
GHL_STAGE_VISIT=""  # Opcional
GHL_STAGE_TRIAGE=""  # Opcional
GHL_STAGE_CHECKOUT=""  # Opcional
GHL_STAGE_WON=""  # Opcional

# ==============================================================================
# NODE ENV
# ==============================================================================
NODE_ENV="production"  # ✅ Já configurado
```

---

## 🎯 RESUMO - O QUE FAZER AGORA

### 1. Mudar ENVs Existentes (2 min)

No Vercel Dashboard → Settings → Environment Variables:

1. **`TENANT_MODE`**: Mudar de `single` para `multi`
2. **`STRIPE_ENABLED`**: Mudar de `0` para `1`

### 2. Preencher ENVs Faltando do Stripe (15-20 min)

#### A) Obter Chaves do Stripe

1. Acesse: https://dashboard.stripe.com/
2. Vá para **Developers** → **API keys**
3. Copie:
   - **Publishable key** → `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
   - **Secret key** → `STRIPE_SECRET_KEY` (já tem, mas verificar se está correto)

#### B) Configurar Webhook

1. Vá para **Developers** → **Webhooks**
2. Clique em **Add endpoint**
3. URL: `https://www.aistotele.com/api/stripe/webhook`
4. Eventos a selecionar:
   - `checkout.session.completed` ✅ (CRÍTICO)
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_succeeded`
   - `invoice.payment_failed`
5. Após criar, clique em **Reveal secret** → Copie → `STRIPE_WEBHOOK_SECRET`

#### C) Criar Produtos e Preços no Stripe

**Plano Plus Mensal:**
- Nome: "Aistotele Plus - Mensal"
- Preço: R$ 29,90/mês
- Tipo: Recurring
- Interval: Month
- Copiar Price ID → `STRIPE_PRICE_PLUS_MONTHLY`

**Plano Plus Anual:**
- Nome: "Aistotele Plus - Anual"
- Preço: R$ 299,00/ano
- Tipo: Recurring
- Interval: Year
- Copiar Price ID → `STRIPE_PRICE_PLUS_YEARLY`

**Plano Gift Mensal:**
- Nome: "Aistotele Gift - Mensal"
- Preço: R$ 19,90/mês
- Tipo: Recurring
- Interval: Month
- Copiar Price ID → `STRIPE_PRICE_GIFT_MONTHLY`

**Plano Gift Anual:**
- Nome: "Aistotele Gift - Anual"
- Preço: R$ 199,00/ano
- Tipo: Recurring
- Interval: Year
- Copiar Price ID → `STRIPE_PRICE_GIFT_YEARLY`

**Addon Assentos Extras Mensal:**
- Nome: "Assentos Extras - Mensal"
- Preço: R$ 9,90/mês
- Tipo: Recurring
- Interval: Month
- Copiar Price ID → `STRIPE_PRICE_ADDON_MONTHLY`

**Addon Assentos Extras Anual:**
- Nome: "Assentos Extras - Anual"
- Preço: R$ 99,00/ano
- Tipo: Recurring
- Interval: Year
- Copiar Price ID → `STRIPE_PRICE_ADDON_YEARLY`

---

## 🚀 COMANDOS PARA CRIAR PRODUTOS NO STRIPE VIA TERMINAL

Vou criar um script para você executar que cria todos os produtos e preços automaticamente:

---

## ✅ CHECKLIST FINAL

### Envs a Mudar (2 min)
- [ ] `TENANT_MODE`: `single` → `multi`
- [ ] `STRIPE_ENABLED`: `0` → `1`

### Envs a Preencher (15-20 min)
- [ ] `STRIPE_WEBHOOK_SECRET` (obter no Stripe Dashboard)
- [ ] `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` (obter no Stripe Dashboard)
- [ ] `STRIPE_PRICE_PLUS_MONTHLY` (criar produto no Stripe)
- [ ] `STRIPE_PRICE_PLUS_YEARLY` (criar produto no Stripe)
- [ ] `STRIPE_PRICE_GIFT_MONTHLY` (criar produto no Stripe)
- [ ] `STRIPE_PRICE_GIFT_YEARLY` (criar produto no Stripe)
- [ ] `STRIPE_PRICE_ADDON_MONTHLY` (criar produto no Stripe)
- [ ] `STRIPE_PRICE_ADDON_YEARLY` (criar produto no Stripe)

---

**Próximo passo:** Vou criar um script para criar produtos no Stripe automaticamente via terminal.

