# 🎯 ENVs FINAIS PARA PRODUÇÃO - PRONTAS PARA COPIAR

**Data:** 4 de novembro de 2025  
**Status:** ✅ Produtos criados em LIVE MODE

---

## ✅ ENVs STRIPE PRICE IDs (PRODUÇÃO)

Copie e cole estas ENVs no **Vercel Dashboard → Settings → Environment Variables → Production**:

```bash
STRIPE_PRICE_PLUS_MONTHLY=price_1SPwV22Nl0Zqe3RCWesmjWr7
STRIPE_PRICE_PLUS_YEARLY=price_1SPwV22Nl0Zqe3RCnHrrqhNW
STRIPE_PRICE_GIFT_MONTHLY=price_1SPwV32Nl0Zqe3RCHWaD6uel
STRIPE_PRICE_GIFT_YEARLY=price_1SPwV42Nl0Zqe3RCmVGigy9x
STRIPE_PRICE_ADDON_MONTHLY=price_1SPwV42Nl0Zqe3RCfQ9NmJbp
STRIPE_PRICE_ADDON_YEARLY=price_1SPwV42Nl0Zqe3RC5HlUGurP
```

**Environment:** All Environments (ou Production)

---

## 📋 ENVs COMPLETAS - CHECKLIST FINAL

### ✅ Já Configuradas (Manter)
- `DATABASE_URL` ✅
- `SUPABASE_SERVICE_ROLE_KEY` ✅
- `NEXT_PUBLIC_SUPABASE_URL` ✅
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` ✅
- `STRIPE_SECRET_KEY` ✅
- `NEXTAUTH_URL` ✅
- `NEXTAUTH_SECRET` ✅
- `NEXT_PUBLIC_ROOT_B2B_DOMAINS` ✅
- `NEXT_PUBLIC_BRAND_NAME` ✅
- `NEXT_PUBLIC_SHOW_SALES_ASSISTANT` ✅
- `NEXT_PUBLIC_CUSTOMER_MODE` ✅
- `CLEANUP_CRON_TOKEN` ✅
- `OPENAI_API_KEY` ✅

### ⚠️ Mudar Valores (2 ENVs)
```bash
TENANT_MODE=multi
STRIPE_ENABLED=1
```

### ❌ Adicionar (8 ENVs)
```bash
# Stripe Price IDs (PRODUÇÃO - criados agora)
STRIPE_PRICE_PLUS_MONTHLY=price_1SPwV22Nl0Zqe3RCWesmjWr7
STRIPE_PRICE_PLUS_YEARLY=price_1SPwV22Nl0Zqe3RCnHrrqhNW
STRIPE_PRICE_GIFT_MONTHLY=price_1SPwV32Nl0Zqe3RCHWaD6uel
STRIPE_PRICE_GIFT_YEARLY=price_1SPwV42Nl0Zqe3RCmVGigy9x
STRIPE_PRICE_ADDON_MONTHLY=price_1SPwV42Nl0Zqe3RCfQ9NmJbp
STRIPE_PRICE_ADDON_YEARLY=price_1SPwV42Nl0Zqe3RC5HlUGurP

# Stripe Webhook e Publishable (obter no Stripe Dashboard)
STRIPE_WEBHOOK_SECRET=your_secret_from_provider
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
```

---

## 📝 COMO ADICIONAR NO VERCEL

1. Acesse: https://vercel.com/dashboard
2. Selecione seu projeto `aistotele`
3. Vá para **Settings** → **Environment Variables**
4. Para cada ENV acima:
   - Clique em **Add New**
   - Cole o nome da variável
   - Cole o valor
   - Selecione **Environment** (Production ou All Environments)
   - Clique em **Save**

---

## ✅ CHECKLIST FINAL

### Envs a Mudar (2)
- [ ] `TENANT_MODE`: `single` → `multi`
- [ ] `STRIPE_ENABLED`: `0` → `1`

### Envs a Adicionar (8)
- [ ] `STRIPE_PRICE_PLUS_MONTHLY` = `price_1SPwV22Nl0Zqe3RCWesmjWr7`
- [ ] `STRIPE_PRICE_PLUS_YEARLY` = `price_1SPwV22Nl0Zqe3RCnHrrqhNW`
- [ ] `STRIPE_PRICE_GIFT_MONTHLY` = `price_1SPwV32Nl0Zqe3RCHWaD6uel`
- [ ] `STRIPE_PRICE_GIFT_YEARLY` = `price_1SPwV42Nl0Zqe3RCmVGigy9x`
- [ ] `STRIPE_PRICE_ADDON_MONTHLY` = `price_1SPwV42Nl0Zqe3RCfQ9NmJbp`
- [ ] `STRIPE_PRICE_ADDON_YEARLY` = `price_1SPwV42Nl0Zqe3RC5HlUGurP`
- [ ] `STRIPE_WEBHOOK_SECRET` = `whsec_...` (obter no Stripe Dashboard)
- [ ] `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` = `pk_live_...` (obter no Stripe Dashboard)

---

## 🎉 APÓS CONCLUIR

Após adicionar todas as ENVs:

1. ✅ Backend estará 100% funcional
2. ✅ Stripe checkout funcionará em produção
3. ✅ Webhook funcionará
4. ✅ Provisionamento de tenant funcionará
5. ✅ Multi-tenancy ativado

---

**Próximo passo:** Adicionar as ENVs no Vercel e fazer redeploy!

