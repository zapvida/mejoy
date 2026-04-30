# 📊 RESUMO EXECUTIVO - ANÁLISE DE ENVs

**Data:** 4 de novembro de 2025  
**Status:** Análise completa baseada nas imagens do Vercel + código do projeto

---

## ✅ O QUE ESTÁ CERTO (Manter)

### Banco de Dados ✅
- `DATABASE_URL` ✅
- `DIRECT_URL` ✅
- `SUPABASE_SERVICE_ROLE_KEY` ✅

### Supabase ✅
- `NEXT_PUBLIC_SUPABASE_URL` ✅ (Preview e Production)
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` ✅

### Stripe (Parcial) ✅
- `STRIPE_SECRET_KEY` ✅ (sk_live_...)

### NextAuth ✅
- `NEXTAUTH_URL` ✅
- `NEXTAUTH_SECRET` ✅

### B2B Config ✅
- `NEXT_PUBLIC_ROOT_B2B_DOMAINS` ✅
- `NEXT_PUBLIC_BRAND_NAME` ✅
- `NEXT_PUBLIC_SHOW_SALES_ASSISTANT` ✅
- `NEXT_PUBLIC_CUSTOMER_MODE` ✅

### URLs ✅
- `NEXT_PUBLIC_SITE_URL` ✅
- `NEXT_PUBLIC_BASE_URL` ✅
- `PRIMARY_DOMAIN` ✅

### Outros ✅
- `CLEANUP_CRON_TOKEN` ✅
- `OPENAI_API_KEY` ✅
- `STRIPE_LOOKUP_PREFIX` ✅

---

## ⚠️ O QUE PRECISA MUDAR (2 variáveis)

### 1. TENANT_MODE
**Atual:** `single`  
**Deveria ser:** `multi`  
**Por quê:** Projeto é B2B2C (multi-tenant). `single` desativa a lógica de multi-tenancy.

### 2. STRIPE_ENABLED
**Atual:** `0`  
**Deveria ser:** `1`  
**Por quê:** Stripe está desabilitado. Para monetização funcionar, precisa estar `1`.

---

## ❌ O QUE FALTA PREENCHER (8 variáveis críticas)

### Stripe (8 variáveis)

1. **`STRIPE_WEBHOOK_SECRET`** ❌
   - Onde obter: Stripe Dashboard → Developers → Webhooks → Reveal secret
   - Começa com: `whsec_`

2. **`NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`** ❌
   - Onde obter: Stripe Dashboard → Developers → API keys → Publishable key
   - Começa com: `pk_live_`

3. **`STRIPE_PRICE_PLUS_MONTHLY`** ❌
   - Criar produto no Stripe: "Aistotele Plus - Mensal" (R$ 29,90/mês)
   - Copiar Price ID (começa com `price_`)

4. **`STRIPE_PRICE_PLUS_YEARLY`** ❌
   - Criar produto no Stripe: "Aistotele Plus - Anual" (R$ 299,00/ano)
   - Copiar Price ID (começa com `price_`)

5. **`STRIPE_PRICE_GIFT_MONTHLY`** ❌
   - Criar produto no Stripe: "Aistotele Gift - Mensal" (R$ 19,90/mês)
   - Copiar Price ID (começa com `price_`)

6. **`STRIPE_PRICE_GIFT_YEARLY`** ❌
   - Criar produto no Stripe: "Aistotele Gift - Anual" (R$ 199,00/ano)
   - Copiar Price ID (começa com `price_`)

7. **`STRIPE_PRICE_ADDON_MONTHLY`** ❌
   - Criar produto no Stripe: "Assentos Extras - Mensal" (R$ 9,90/mês)
   - Copiar Price ID (começa com `price_`)

8. **`STRIPE_PRICE_ADDON_YEARLY`** ❌
   - Criar produto no Stripe: "Assentos Extras - Anual" (R$ 99,00/ano)
   - Copiar Price ID (começa com `price_`)

---

## 📝 .ENV COMPLETO PARA PREENCHER

```bash
# ==============================================================================
# Aistotele B2B2C - PRODUÇÃO
# ==============================================================================

# ==============================================================================
# BANCO DE DADOS (✅ Já configurado)
# ==============================================================================
DATABASE_URL="postgresql://postgres:[PASSWORD]@[HOST]:5432/postgres?pgbouncer=true&connection_limit=1"
DIRECT_URL="postgresql://postgres:[PASSWORD]@[HOST]:5432/postgres"

# ==============================================================================
# SUPABASE (✅ Já configurado)
# ==============================================================================
NEXT_PUBLIC_SUPABASE_URL="https://qltixyfxxxbdnaldgtzr.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="eyJhbGci0iJIUzI1NiIsInR5cCI6IkpXV..."
SUPABASE_SERVICE_ROLE_KEY="eyJhbGci0iJIUzI1NiIsInR5cCI6IkpXV..."

# ==============================================================================
# STRIPE (⚠️ Preencher as que faltam)
# ==============================================================================
STRIPE_ENABLED="1"  # ⚠️ MUDAR: Era "0", agora "1"
STRIPE_SECRET_KEY="REDACTED_STRIPE_LIVE_PREFIX..."  # ✅ Já configurado
STRIPE_WEBHOOK_SECRET="whsec_..."  # ❌ FALTANDO - Obter no Stripe Dashboard
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_live_..."  # ❌ FALTANDO - Obter no Stripe Dashboard
STRIPE_LOOKUP_PREFIX="aistotele_"  # ✅ Já configurado

# Price IDs (❌ FALTANDO - Criar produtos no Stripe)
STRIPE_PRICE_PLUS_MONTHLY="price_..."  # Criar: Aistotele Plus - Mensal (R$ 29,90)
STRIPE_PRICE_PLUS_YEARLY="price_..."  # Criar: Aistotele Plus - Anual (R$ 299,00)
STRIPE_PRICE_GIFT_MONTHLY="price_..."  # Criar: Aistotele Gift - Mensal (R$ 19,90)
STRIPE_PRICE_GIFT_YEARLY="price_..."  # Criar: Aistotele Gift - Anual (R$ 199,00)
STRIPE_PRICE_ADDON_MONTHLY="price_..."  # Criar: Assentos Extras - Mensal (R$ 9,90)
STRIPE_PRICE_ADDON_YEARLY="price_..."  # Criar: Assentos Extras - Anual (R$ 99,00)

# ==============================================================================
# NEXTAUTH (✅ Já configurado)
# ==============================================================================
NEXTAUTH_URL="https://aistotele.com"
NEXTAUTH_SECRET="REDACTED_NEXTAUTH_SECRET_PREFIX..."

# ==============================================================================
# CONFIGURAÇÕES B2B2C
# ==============================================================================
TENANT_MODE="multi"  # ⚠️ MUDAR: Era "single", agora "multi"
NEXT_PUBLIC_ROOT_B2B_DOMAINS="aistotele.com,www.aistotele.com"
NEXT_PUBLIC_BRAND_NAME="Aistotele"
NEXT_PUBLIC_SHOW_SALES_ASSISTANT="1"
NEXT_PUBLIC_CUSTOMER_MODE="b2b"

# ==============================================================================
# URLs E DOMÍNIOS (✅ Já configurado)
# ==============================================================================
NEXT_PUBLIC_SITE_URL="https://aistotele.com"
NEXT_PUBLIC_BASE_URL="https://aistotele.com"
PRIMARY_DOMAIN="aistotele.com"

# ==============================================================================
# CRON JOB (✅ Já configurado)
# ==============================================================================
CLEANUP_CRON_TOKEN="5cfad740627ac1deb7cc39806de6199bd3bfe1a2521466b2cd1004b51fec9d3c"

# ==============================================================================
# OPENAI (✅ Já configurado)
# ==============================================================================
OPENAI_API_KEY="sk-proj-zeuahyDRd5ZIk3vohsPfAQNTq..."

# ==============================================================================
# NODE ENV
# ==============================================================================
NODE_ENV="production"
```

---

## 🎯 PRÓXIMOS PASSOS

1. **Ler:** `ANALISE_ENVS_COMPLETA.md` (análise detalhada)
2. **Seguir:** `CHECKLIST_ENVS_FINAL.md` (passo a passo)
3. **Executar:** `./scripts/create-stripe-products.sh` (criar produtos automaticamente)

---

**Tempo estimado:** 30-40 minutos para configurar tudo

