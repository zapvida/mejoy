# 🎯 ENVs STRIPE PRONTAS PARA COPIAR

**Data:** 4 de novembro de 2025  
**Status:** ✅ Preços criados em TEST MODE | ⚠️ LIVE precisa criar manualmente

---

## ✅ PREÇOS CRIADOS (TEST MODE)

Os seguintes preços foram criados com sucesso no Stripe (modo TEST):

### Price IDs Criados

```
STRIPE_PRICE_PLUS_MONTHLY=price_1SPwPG2Nl0Zqe3RCBYvoa3jl
STRIPE_PRICE_PLUS_YEARLY=price_1SPwPH2Nl0Zqe3RCPVefNz2k
STRIPE_PRICE_GIFT_MONTHLY=price_1SPwPI2Nl0Zqe3RCvoe2thtC
STRIPE_PRICE_GIFT_YEARLY=price_1SPwPK2Nl0Zqe3RC83DsE8ry
STRIPE_PRICE_ADDON_MONTHLY=price_1SPwPL2Nl0Zqe3RCX2Qd2hmU
STRIPE_PRICE_ADDON_YEARLY=price_1SPwPN2Nl0Zqe3RCL318c2MA
```

---

## 📋 COPIAR PARA VERCEL (TEST MODE)

**Vercel Dashboard → Settings → Environment Variables → Production**

### Copiar e Colar Estas ENVs:

```bash
STRIPE_PRICE_PLUS_MONTHLY=price_1SPwPG2Nl0Zqe3RCBYvoa3jl
STRIPE_PRICE_PLUS_YEARLY=price_1SPwPH2Nl0Zqe3RCPVefNz2k
STRIPE_PRICE_GIFT_MONTHLY=price_1SPwPI2Nl0Zqe3RCvoe2thtC
STRIPE_PRICE_GIFT_YEARLY=price_1SPwPK2Nl0Zqe3RC83DsE8ry
STRIPE_PRICE_ADDON_MONTHLY=price_1SPwPL2Nl0Zqe3RCX2Qd2hmU
STRIPE_PRICE_ADDON_YEARLY=price_1SPwPN2Nl0Zqe3RCL318c2MA
```

**Environment:** All Environments (ou Production)

---

## ⚠️ IMPORTANTE: TEST vs LIVE

### Modo TEST (Atual)
- ✅ Preços criados e prontos
- ✅ Pode usar para testes
- ⚠️ Não funcionará em produção real (pagamentos de verdade)

### Modo LIVE (Produção)
- ❌ Preços não foram criados automaticamente (falta de permissão na chave)
- ✅ Precisa criar manualmente no Stripe Dashboard

---

## 🚀 COMO CRIAR EM PRODUÇÃO (LIVE MODE)

### Opção 1: Via Stripe Dashboard (Recomendado)

1. Acesse: https://dashboard.stripe.com/
2. **Certifique-se de estar em LIVE MODE** (toggle no topo)
3. Vá para **Products** → **Add product**

#### Criar Produtos e Preços:

**1. Aistotele Plus**
- Nome: "Aistotele Plus"
- Descrição: "Plano principal com relatórios ilimitados"
- Adicionar preço:
  - **Mensal:** R$ 29,90 (BRL) - Recurring - Monthly → Copiar Price ID → `STRIPE_PRICE_PLUS_MONTHLY`
  - **Anual:** R$ 299,00 (BRL) - Recurring - Yearly → Copiar Price ID → `STRIPE_PRICE_PLUS_YEARLY`

**2. Aistotele Gift**
- Nome: "Aistotele Gift"
- Descrição: "Plano presente com preço especial"
- Adicionar preço:
  - **Mensal:** R$ 19,90 (BRL) - Recurring - Monthly → Copiar Price ID → `STRIPE_PRICE_GIFT_MONTHLY`
  - **Anual:** R$ 199,00 (BRL) - Recurring - Yearly → Copiar Price ID → `STRIPE_PRICE_GIFT_YEARLY`

**3. Assentos Extras**
- Nome: "Assentos Extras"
- Descrição: "Assentos adicionais para incluir mais pessoas"
- Adicionar preço:
  - **Mensal:** R$ 9,90 (BRL) - Recurring - Monthly → Copiar Price ID → `STRIPE_PRICE_ADDON_MONTHLY`
  - **Anual:** R$ 99,00 (BRL) - Recurring - Yearly → Copiar Price ID → `STRIPE_PRICE_ADDON_YEARLY`

### Opção 2: Usar Stripe CLI com Secret Key Completa

Se você tiver a Secret Key completa (não restricted), pode usar:

```bash
# Configurar secret key
export STRIPE_SECRET_KEY="your_secret_from_provider"

# Criar preços
stripe prices create \
  --product prod_TMfeXks4Y14HEq \
  --currency brl \
  --unit-amount 2990 \
  --recurring.interval month \
  --api-key sk_live_...
```

---

## 📝 CHECKLIST FINAL

### Envs a Adicionar no Vercel (6 variáveis)

- [ ] `STRIPE_PRICE_PLUS_MONTHLY` = `price_1SPwPG2Nl0Zqe3RCBYvoa3jl` (TEST)
- [ ] `STRIPE_PRICE_PLUS_YEARLY` = `price_1SPwPH2Nl0Zqe3RCPVefNz2k` (TEST)
- [ ] `STRIPE_PRICE_GIFT_MONTHLY` = `price_1SPwPI2Nl0Zqe3RCvoe2thtC` (TEST)
- [ ] `STRIPE_PRICE_GIFT_YEARLY` = `price_1SPwPK2Nl0Zqe3RC83DsE8ry` (TEST)
- [ ] `STRIPE_PRICE_ADDON_MONTHLY` = `price_1SPwPL2Nl0Zqe3RCX2Qd2hmU` (TEST)
- [ ] `STRIPE_PRICE_ADDON_YEARLY` = `price_1SPwPN2Nl0Zqe3RCL318c2MA` (TEST)

### Envs que Ainda Faltam

- [ ] `STRIPE_WEBHOOK_SECRET` (obter no Stripe Dashboard → Webhooks)
- [ ] `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` (obter no Stripe Dashboard → API keys)

### Envs a Mudar

- [ ] `TENANT_MODE`: `single` → `multi`
- [ ] `STRIPE_ENABLED`: `0` → `1`

---

## 🎉 PRÓXIMO PASSO

1. **Copiar as 6 ENVs acima para o Vercel** (TEST mode funciona para testes)
2. **Obter `STRIPE_WEBHOOK_SECRET`** no Stripe Dashboard
3. **Obter `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`** no Stripe Dashboard
4. **Mudar `TENANT_MODE` e `STRIPE_ENABLED`**
5. **Testar checkout em modo TEST**
6. **Depois criar produtos em LIVE** quando estiver pronto para produção real

---

**Status:** ✅ Preços TEST criados | ⚠️ LIVE precisa criar manualmente

