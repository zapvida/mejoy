# ✅ CHECKLIST FINAL - ENVs PARA BACKEND 100%

**Data:** 4 de novembro de 2025  
**Status:** Guia passo a passo para configurar todas as ENVs

---

## 📊 RESUMO RÁPIDO

### ✅ O que já está certo (manter)
- Banco de dados (DATABASE_URL, SUPABASE_SERVICE_ROLE_KEY)
- Supabase público (NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY)
- Stripe Secret Key
- NextAuth
- Configurações B2B
- URLs e domínios
- Cron token
- OpenAI

### ⚠️ O que precisa mudar (2 variáveis)
1. `TENANT_MODE`: `single` → `multi`
2. `STRIPE_ENABLED`: `0` → `1`

### ❌ O que falta preencher (8 variáveis)
1. `STRIPE_WEBHOOK_SECRET`
2. `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
3. `STRIPE_PRICE_PLUS_MONTHLY`
4. `STRIPE_PRICE_PLUS_YEARLY`
5. `STRIPE_PRICE_GIFT_MONTHLY`
6. `STRIPE_PRICE_GIFT_YEARLY`
7. `STRIPE_PRICE_ADDON_MONTHLY`
8. `STRIPE_PRICE_ADDON_YEARLY`

---

## 🎯 PASSO A PASSO COMPLETO

### Passo 1: Mudar ENVs Existentes (2 min)

**Vercel Dashboard → Settings → Environment Variables → Production**

1. Encontrar `TENANT_MODE`
   - Clicar nos 3 pontos → Edit
   - Mudar valor de `single` para `multi`
   - Salvar

2. Encontrar `STRIPE_ENABLED`
   - Clicar nos 3 pontos → Edit
   - Mudar valor de `0` para `1`
   - Salvar

---

### Passo 2: Obter Chaves do Stripe (5 min)

**Stripe Dashboard → Developers → API keys**

1. Copiar **Publishable key** (começa com `pk_live_`)
   - Adicionar no Vercel como: `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
   - Environment: **All Environments**

2. Verificar **Secret key** (começa com `sk_live_`)
   - Já está configurado, mas verificar se está correto

---

### Passo 3: Configurar Webhook (5 min)

**Stripe Dashboard → Developers → Webhooks**

1. Clicar em **Add endpoint**
2. URL: `https://www.aistotele.com/api/stripe/webhook`
3. Selecionar eventos:
   - ✅ `checkout.session.completed` (CRÍTICO)
   - ✅ `customer.subscription.created`
   - ✅ `customer.subscription.updated`
   - ✅ `customer.subscription.deleted`
   - ✅ `invoice.payment_succeeded`
   - ✅ `invoice.payment_failed`
4. Clicar em **Add endpoint**
5. Após criar, clicar em **Reveal** no campo "Signing secret"
6. Copiar o valor (começa com `whsec_`)
   - Adicionar no Vercel como: `STRIPE_WEBHOOK_SECRET`
   - Environment: **All Environments**

---

### Passo 4: Criar Produtos no Stripe (10-15 min)

**Opção A: Via Script Automático (Recomendado)**

```bash
cd /Users/teobeckert/desenvolvimento/aistotele

# 1. Instalar Stripe CLI (se não tiver)
brew install stripe/stripe-cli/stripe

# 2. Fazer login
stripe login

# 3. Executar script
./scripts/create-stripe-products.sh
```

O script criará todos os produtos e preços e mostrará os IDs para copiar.

**Opção B: Manualmente no Dashboard**

1. **Aistotele Plus - Mensal**
   - Products → Add product
   - Nome: "Aistotele Plus"
   - Preço: R$ 29,90
   - Recurring: Monthly
   - Copiar Price ID → `STRIPE_PRICE_PLUS_MONTHLY`

2. **Aistotele Plus - Anual**
   - No mesmo produto, adicionar preço
   - Preço: R$ 299,00
   - Recurring: Yearly
   - Copiar Price ID → `STRIPE_PRICE_PLUS_YEARLY`

3. **Aistotele Gift - Mensal**
   - Products → Add product
   - Nome: "Aistotele Gift"
   - Preço: R$ 19,90
   - Recurring: Monthly
   - Copiar Price ID → `STRIPE_PRICE_GIFT_MONTHLY`

4. **Aistotele Gift - Anual**
   - No mesmo produto, adicionar preço
   - Preço: R$ 199,00
   - Recurring: Yearly
   - Copiar Price ID → `STRIPE_PRICE_GIFT_YEARLY`

5. **Assentos Extras - Mensal**
   - Products → Add product
   - Nome: "Assentos Extras"
   - Preço: R$ 9,90
   - Recurring: Monthly
   - Copiar Price ID → `STRIPE_PRICE_ADDON_MONTHLY`

6. **Assentos Extras - Anual**
   - No mesmo produto, adicionar preço
   - Preço: R$ 99,00
   - Recurring: Yearly
   - Copiar Price ID → `STRIPE_PRICE_ADDON_YEARLY`

---

### Passo 5: Adicionar Price IDs no Vercel (5 min)

**Vercel Dashboard → Settings → Environment Variables → Production**

Adicionar cada uma das 6 variáveis:

1. `STRIPE_PRICE_PLUS_MONTHLY` = `price_...`
2. `STRIPE_PRICE_PLUS_YEARLY` = `price_...`
3. `STRIPE_PRICE_GIFT_MONTHLY` = `price_...`
4. `STRIPE_PRICE_GIFT_YEARLY` = `price_...`
5. `STRIPE_PRICE_ADDON_MONTHLY` = `price_...`
6. `STRIPE_PRICE_ADDON_YEARLY` = `price_...`

**Environment:** All Environments (ou Production, conforme preferir)

---

### Passo 6: Verificar e Aplicar (2 min)

**Vercel Dashboard → Deployments**

1. Verificar que todas as ENVs estão configuradas
2. Fazer redeploy (ou aguardar próximo deploy automático)
3. Testar checkout

---

## 📋 CHECKLIST FINAL

### ENVs a Mudar
- [ ] `TENANT_MODE`: `single` → `multi`
- [ ] `STRIPE_ENABLED`: `0` → `1`

### ENVs a Adicionar
- [ ] `STRIPE_WEBHOOK_SECRET` (do Stripe Dashboard)
- [ ] `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` (do Stripe Dashboard)
- [ ] `STRIPE_PRICE_PLUS_MONTHLY` (criar produto no Stripe)
- [ ] `STRIPE_PRICE_PLUS_YEARLY` (criar produto no Stripe)
- [ ] `STRIPE_PRICE_GIFT_MONTHLY` (criar produto no Stripe)
- [ ] `STRIPE_PRICE_GIFT_YEARLY` (criar produto no Stripe)
- [ ] `STRIPE_PRICE_ADDON_MONTHLY` (criar produto no Stripe)
- [ ] `STRIPE_PRICE_ADDON_YEARLY` (criar produto no Stripe)

---

## 🎉 APÓS CONCLUIR

Após preencher todas as ENVs:

1. ✅ Backend estará 100% funcional
2. ✅ Stripe checkout funcionará
3. ✅ Webhook funcionará
4. ✅ Provisionamento de tenant funcionará
5. ✅ Multi-tenancy ativado

**Próximo passo:** Testar fluxo completo end-to-end

---

**Tempo total estimado:** 30-40 minutos

