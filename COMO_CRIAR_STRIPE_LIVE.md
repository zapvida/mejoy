# 🚀 COMO CRIAR PRODUTOS NO STRIPE EM PRODUÇÃO

**Data:** 4 de novembro de 2025

---

## 📋 O QUE VOCÊ PRECISA FORNECER

Para criar os produtos em **PRODUÇÃO (LIVE MODE)**, preciso da sua **Secret Key completa** do Stripe.

### Onde encontrar:

1. Acesse: https://dashboard.stripe.com/
2. Certifique-se de estar em **LIVE MODE** (toggle no topo)
3. Vá para **Developers** → **API keys**
4. Copie a **Secret key** (começa com `sk_live_...`)
   - ⚠️ **Importante:** Deve ser uma chave com permissões de **escrita** (não uma restricted key)

---

## 🎯 OPÇÃO 1: Executar Script Automático (Recomendado)

### Passo 1: Obter Secret Key

Copie sua Secret Key completa do Stripe Dashboard (LIVE MODE).

### Passo 2: Executar Script

```bash
cd /Users/teobeckert/desenvolvimento/aistotele

# Opção A: Passar como argumento
./scripts/create-stripe-live-simple.sh sk_live_SUA_CHAVE_AQUI

# Opção B: Usar variável de ambiente
export STRIPE_SECRET_KEY=your_secret_from_provider
./scripts/create-stripe-live-simple.sh
```

O script criará todos os produtos e preços e mostrará os IDs prontos para copiar.

---

## 🎯 OPÇÃO 2: Usar Node.js Diretamente

```bash
cd /Users/teobeckert/desenvolvimento/aistotele

# Passar a chave como argumento
node scripts/create-stripe-live.mjs --key sk_live_SUA_CHAVE_AQUI

# Ou usar variável de ambiente
STRIPE_SECRET_KEY=your_secret_from_provider node scripts/create-stripe-live.mjs
```

---

## 🎯 OPÇÃO 3: Criar Manualmente no Dashboard (Mais Seguro)

Se preferir criar manualmente:

### 1. Acesse Stripe Dashboard (LIVE MODE)
https://dashboard.stripe.com/

### 2. Criar Produto "Aistotele Plus"
- Products → Add product
- Nome: "Aistotele Plus"
- Descrição: "Plano principal com relatórios ilimitados"
- Adicionar preço:
  - **Mensal:** R$ 29,90 (BRL) - Recurring - Monthly → Copiar Price ID
  - **Anual:** R$ 299,00 (BRL) - Recurring - Yearly → Copiar Price ID

### 3. Criar Produto "Aistotele Gift"
- Products → Add product
- Nome: "Aistotele Gift"
- Descrição: "Plano presente com preço especial"
- Adicionar preço:
  - **Mensal:** R$ 19,90 (BRL) - Recurring - Monthly → Copiar Price ID
  - **Anual:** R$ 199,00 (BRL) - Recurring - Yearly → Copiar Price ID

### 4. Criar Produto "Assentos Extras"
- Products → Add product
- Nome: "Assentos Extras"
- Descrição: "Assentos adicionais para incluir mais pessoas"
- Adicionar preço:
  - **Mensal:** R$ 9,90 (BRL) - Recurring - Monthly → Copiar Price ID
  - **Anual:** R$ 99,00 (BRL) - Recurring - Yearly → Copiar Price ID

---

## ⚠️ IMPORTANTE

### Se a chave não tiver permissões:

Se você receber erro de permissão, significa que a chave é **restricted**. Soluções:

1. **Criar nova chave no Stripe Dashboard:**
   - Developers → API keys → Create secret key
   - Dê permissões de **Write** para Products e Prices
   - Use essa nova chave

2. **Ou criar manualmente no Dashboard** (Opção 3 acima)

---

## 📋 DEPOIS DE CRIAR

Após criar os produtos, você terá 6 Price IDs. Copie para o Vercel:

```bash
STRIPE_PRICE_PLUS_MONTHLY=price_...
STRIPE_PRICE_PLUS_YEARLY=price_...
STRIPE_PRICE_GIFT_MONTHLY=price_...
STRIPE_PRICE_GIFT_YEARLY=price_...
STRIPE_PRICE_ADDON_MONTHLY=price_...
STRIPE_PRICE_ADDON_YEARLY=price_...
```

---

**Próximo passo:** Me forneça a Secret Key (`sk_live_...`) e eu crio tudo automaticamente!

