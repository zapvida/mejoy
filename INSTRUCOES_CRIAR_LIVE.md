# 🎯 INSTRUÇÕES RÁPIDAS - CRIAR PRODUTOS EM PRODUÇÃO

**Para criar os produtos em PRODUÇÃO, você precisa:**

## 📋 O QUE EU PRECISO DE VOCÊ

**Secret Key completa do Stripe (LIVE MODE)**

### Onde encontrar:

1. Acesse: https://dashboard.stripe.com/
2. **Toggle para LIVE MODE** (no topo da página)
3. Vá para **Developers** → **API keys**
4. Copie a **Secret key** (começa com `sk_live_...`)
   - ⚠️ **Deve ter permissões de escrita** (não restricted key)

---

## 🚀 EXECUTAR (Depois de ter a chave)

```bash
cd /Users/teobeckert/desenvolvimento/aistotele

# Opção 1: Passar como argumento
node scripts/create-stripe-live-final.mjs sk_live_SUA_CHAVE_AQUI

# Opção 2: Variável de ambiente
STRIPE_SECRET_KEY=sk_live_SUA_CHAVE_AQUI node scripts/create-stripe-live-final.mjs
```

---

## ⚠️ SE A CHAVE NÃO TIVER PERMISSÕES

Se você receber erro de permissão:

1. **Criar nova chave no Stripe:**
   - Developers → API keys → Create secret key
   - Dê permissões de **Write** para Products e Prices
   - Use essa nova chave

2. **Ou criar manualmente** (mais seguro):
   - Veja: `COMO_CRIAR_STRIPE_LIVE.md`

---

## 📋 DEPOIS DE CRIAR

O script mostrará os 6 Price IDs prontos para copiar no Vercel.

---

**Me forneça a Secret Key (`sk_live_...`) e eu executo o script agora!**

Ou execute você mesmo:
```bash
node scripts/create-stripe-live-final.mjs sk_live_SUA_CHAVE
```

