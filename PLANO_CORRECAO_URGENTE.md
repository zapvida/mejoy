# 🚨 PLANO DE CORREÇÃO URGENTE - PROBLEMAS IDENTIFICADOS

**Data:** 4 de novembro de 2025, 23:50  
**Status:** ⚠️ 3 problemas críticos identificados

---

## 🔴 PROBLEMA 1: API Branding Draft (POST) - CRÍTICO

### Sintoma
```json
{
  "error": "Internal server error"
}
```

### Causa Provável
1. **DATABASE_URL não configurado** no Vercel
2. **Migração não aplicada** (tabela `BrandingDraft` não existe)
3. **Prisma não consegue conectar** ao banco

### Ação Imediata (5 min)

#### Passo 1: Verificar ENVs no Vercel
1. Acessar: https://vercel.com/dashboard
2. Projeto: `aistotele`
3. Settings → Environment Variables
4. Verificar que existem:
   - ✅ `DATABASE_URL` (postgresql://...)
   - ✅ `DIRECT_URL` (postgresql://...)

#### Passo 2: Verificar Migração no Supabase
1. Acessar: https://supabase.com/dashboard
2. Projeto: Seu projeto
3. SQL Editor
4. Executar query:
```sql
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name = 'BrandingDraft';
```

**Se não retornar nada:**
- Tabela não existe → aplicar migração

#### Passo 3: Aplicar Migração (se necessário)
1. Abrir: `prisma/migrations/20241104_add_branding_draft_and_tenant/migration.sql`
2. Copiar todo o conteúdo
3. Colar no Supabase SQL Editor
4. Executar

#### Passo 4: Testar Novamente
```bash
curl -X POST -H "Content-Type: application/json" \
  -d '{
    "brandColor": "#16a34a",
    "accentColor": "#065f46",
    "fantasyName": "Teste",
    "ctaText": "Teste",
    "ctaUrl": "https://test.com"
  }' \
  https://www.aistotele.com/api/branding/draft
```

**Esperado:** `{"id": "...", "draft": {...}}`

---

## 🟡 PROBLEMA 2: API B2B Lead - GHL Token Inválido

### Sintoma
```json
{
  "error": "Internal server error",
  "details": "[GHL POST /contacts/upsert] 401 {\"statusCode\":401,\"message\":\"Invalid JWT\"}"
}
```

### Causa Provável
- `GSH_TOKEN` inválido ou expirado
- `GSH_LOCATION_ID` incorreto

### Ação (5 min)

#### Passo 1: Verificar Token GHL
1. Acessar: https://app.gohighlevel.com/
2. Settings → Integrations → API
3. Gerar novo token (se necessário)
4. Copiar token completo

#### Passo 2: Atualizar ENV no Vercel
1. Vercel Dashboard → Settings → Environment Variables
2. Encontrar `GSH_TOKEN`
3. Atualizar com novo token
4. Verificar `GSH_LOCATION_ID` também

#### Passo 3: Testar Novamente
```bash
curl -X POST -H "Content-Type: application/json" \
  -d '{
    "name": "Teste",
    "email": "teste@example.com",
    "company": "Teste"
  }' \
  https://www.aistotele.com/api/b2b/lead
```

**Esperado:** `{"success": true, "contactId": "..."}`

---

## 🟡 PROBLEMA 3: API Checkout Session - Não Testado Completamente

### Sintoma
- API não retorna resposta clara
- Pode estar funcionando, mas precisa de ENVs configuradas

### Ação (5 min)

#### Passo 1: Verificar ENVs do Stripe
Vercel Dashboard → Settings → Environment Variables:

- ✅ `STRIPE_SECRET_KEY` (sk_live_...)
- ✅ `STRIPE_WEBHOOK_SECRET` (whsec_...)
- ✅ `STRIPE_PRICE_PLUS_MONTHLY` (price_1...)
- ✅ `STRIPE_PRICE_PLUS_YEARLY` (price_1...)
- ✅ `STRIPE_PRICE_GIFT_MONTHLY` (price_1...)
- ✅ `STRIPE_PRICE_GIFT_YEARLY` (price_1...)
- ✅ `STRIPE_PRICE_ADDON_MONTHLY` (price_1...)
- ✅ `STRIPE_PRICE_ADDON_YEARLY` (price_1...)

#### Passo 2: Testar API
```bash
curl -X POST -H "Content-Type: application/json" \
  -d '{
    "plan": "plus",
    "period": "monthly"
  }' \
  https://www.aistotele.com/api/stripe/create-checkout-session
```

**Esperado:** `{"url": "https://checkout.stripe.com/..."}` ou erro de validação

---

## 📋 CHECKLIST DE CORREÇÃO

### Urgente (Fazer Agora)
- [ ] Verificar `DATABASE_URL` no Vercel
- [ ] Verificar tabela `BrandingDraft` existe no Supabase
- [ ] Aplicar migração se necessário
- [ ] Testar API Branding Draft novamente

### Importante (Fazer Hoje)
- [ ] Verificar `GSH_TOKEN` no Vercel
- [ ] Atualizar token GHL se necessário
- [ ] Testar API B2B Lead novamente
- [ ] Verificar todas as ENVs do Stripe
- [ ] Testar API Checkout Session

### Opcional (Melhorias)
- [ ] Adicionar logging detalhado nas APIs
- [ ] Melhorar mensagens de erro
- [ ] Adicionar testes automatizados

---

## 🎯 ORDEM DE EXECUÇÃO

1. **Corrigir API Branding Draft** (5 min) → Bloqueia wizard
2. **Corrigir API B2B Lead** (5 min) → Bloqueia captura de leads
3. **Validar API Checkout** (5 min) → Bloqueia pagamentos

**Tempo total:** ~15 minutos

---

## ✅ APÓS CORRIGIR

1. **Re-executar testes:**
```bash
BASE_URL=https://www.aistotele.com bash scripts/test-flow-complete.sh
```

2. **Esperado:** Todos os testes passando (15/15)

3. **Testar fluxo completo manualmente:**
   - Wizard → Assinar → Checkout → Tenant

---

**Próxima ação:** Corrigir API Branding Draft verificando DATABASE_URL e migração.

