# 🎯 AÇÃO FINAL - 3 PONTOS PARA 100%

**Data:** 5 de novembro de 2025  
**Status:** ✅ Deploy realizado | ⚠️ 3 verificações manuais restantes

---

## ✅ O QUE JÁ ESTÁ FEITO

- ✅ Código corrigido e deployado
- ✅ API B2B Lead funcionando (100%)
- ✅ Rotas principais funcionando (100%)
- ✅ Deploy completo

---

## 🎯 3 PONTOS PARA 100% (10 MIN)

### 1️⃣ Verificar/Criar Tabelas no Supabase (5 min)

**Problema:** API Branding Draft retorna erro interno

**Solução:**
1. Supabase Dashboard → Table Editor
2. Verificar se existem: `BrandingDraft` e `Tenant`
3. **Se não existirem:**
   - SQL Editor → New Query
   - Cole conteúdo de `SUPABASE_SQL_PRONTO.sql`
   - Execute
4. **Após criar:** Fazer redeploy no Vercel

**Arquivo:** `SUPABASE_SQL_PRONTO.sql`

---

### 2️⃣ Configurar Wildcard no Vercel (3 min)

**Problema:** Wildcard subdomains não configurado

**Solução:**
1. Vercel Dashboard → Settings → Domains
2. Add Domain: `aistotele.app` (se não existir)
3. Enable Wildcard Subdomains
4. Aguardar alguns minutos para propagação

**Teste:**
```bash
dig +short test.aistotele.app CNAME
# Esperado: cname.vercel-dns.com
```

---

### 3️⃣ Validar ENVs do Stripe (2 min)

**Problema:** API Stripe Checkout pode estar sem ENVs

**Solução:**
1. Vercel Dashboard → Settings → Environment Variables
2. Verificar que existem:
   - `STRIPE_SECRET_KEY`
   - `STRIPE_PRICE_PLUS_MONTHLY`
   - `STRIPE_PRICE_PLUS_YEARLY`
   - `STRIPE_PRICE_GIFT_MONTHLY`
   - `STRIPE_PRICE_GIFT_YEARLY`
   - `STRIPE_PRICE_ADDON_MONTHLY`
   - `STRIPE_PRICE_ADDON_YEARLY`
   - `STRIPE_WEBHOOK_SECRET`
3. Se faltar alguma, adicionar

---

## 🧪 APÓS FAZER OS 3 PONTOS - TESTAR

```bash
# Teste 1: Draft (deve retornar 201)
curl -X POST -H "Content-Type: application/json" \
  -d '{"brandColor":"#16a34a","accentColor":"#065f46","fantasyName":"Teste","ctaText":"Teste","ctaUrl":"https://test.com"}' \
  https://www.aistotele.com/api/branding/draft | jq

# Teste 2: Checkout (deve retornar URL)
curl -X POST -H "Content-Type: application/json" \
  -d '{"plan":"plus","period":"monthly"}' \
  https://www.aistotele.com/api/stripe/create-checkout-session | jq

# Teste 3: Wildcard (deve abrir)
curl -I https://test.aistotele.app

# Teste 4: Scripts automatizados
BASE_URL=https://www.aistotele.com bash scripts/test-flow-complete.sh
```

---

## ✅ CRITÉRIO DE GO

**Tudo OK se:**
- ✅ Draft POST → 201 com `{ id, draft }`
- ✅ Lead POST → 200 com `{ success: true }` (já OK)
- ✅ Checkout → 200 com `{ url: "https://checkout.stripe.com/..." }`
- ✅ Wildcard → `https://test.aistotele.app` abre
- ✅ Testes automatizados → 15/15 passando

---

## 🚀 PRÓXIMO PASSO

Após completar os 3 pontos e tudo passar:

**Me avise: "ok, tudo verde"** → Já preparo o PR #1 da LPAC V2 (Hero + StickyBar)

---

**Status:** ⏳ **AGUARDANDO 3 VERIFICAÇÕES MANUAIS**

