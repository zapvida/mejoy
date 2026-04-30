# ✅ AÇÕES MANUAIS FINAIS - PASSO A PASSO

**Data:** 5 de novembro de 2025  
**Status:** ⏳ 2 ações manuais necessárias

---

## 🎯 RESUMO

**O que já está feito:**
- ✅ Código corrigido e deployado
- ✅ API B2B Lead funcionando (sem GHL)
- ✅ ENVs do Stripe configuradas
- ✅ Testes automatizados criados

**O que você precisa fazer (2 ações):**
1. ✅ Criar tabelas no Supabase (5 min)
2. ✅ Configurar wildcard no Vercel (5 min)

---

## 1️⃣ SUPABASE - CRIAR TABELAS (5 MIN)

### Passo 1: Abrir Supabase SQL Editor

1. Acesse: https://supabase.com/dashboard
2. Selecione seu projeto
3. Clique em **SQL Editor** (menu lateral esquerdo)
4. Clique em **New Query**

### Passo 2: Colar e Executar SQL

**Arquivo pronto:** `SUPABASE_SQL_PRONTO.sql`

**Ou cole este conteúdo:**

```sql
-- 1) UUID helper (se não existir)
create extension if not exists "pgcrypto";

-- 2) Drafts de branding (expiram em 48h)
create table if not exists "BrandingDraft" (
  id              uuid primary key default gen_random_uuid(),
  "createdAt"     timestamptz not null default now(),
  "updatedAt"     timestamptz not null default now(),
  "expiresAt"     timestamptz not null default (now() + interval '48 hours'),
  "logoUrl"       text,
  "brandColor"    text,
  "accentColor"   text,
  "fantasyName"   text,
  "ctaText"       text,
  "ctaUrl"        text,
  "whatsapp"      text,
  "desiredDomain" text
);

create index if not exists brandingdraft_expires_at_idx on "BrandingDraft"("expiresAt");
create index if not exists brandingdraft_created_at_idx on "BrandingDraft"("createdAt");

-- 3) Tenants provisionados pelo webhook do Stripe
create table if not exists "Tenant" (
  id                   uuid primary key default gen_random_uuid(),
  "createdAt"          timestamptz not null default now(),
  "updatedAt"          timestamptz not null default now(),
  slug                 text not null unique,
  domain               text unique,
  "provisionalUrl"     text,
  name                 text not null,
  "ownerEmail"         text not null,
  "ownerName"          text,
  "ownerPhone"         text,
  "logoUrl"            text,
  "brandColor"         text,
  "accentColor"        text,
  "ctaText"            text,
  "ctaUrl"             text,
  status               text not null default 'pending',
  "stripeCustomerId"   text,
  "stripeSubscriptionId" text
);

create index if not exists tenant_slug_idx on "Tenant"(slug);
create index if not exists tenant_owner_email_idx on "Tenant"("ownerEmail");
```

### Passo 3: Executar

1. Clique em **Run** (ou pressione `Ctrl+Enter` / `Cmd+Enter`)
2. Aguarde mensagem de sucesso
3. Verifique se as tabelas foram criadas:
   - Vá em **Table Editor**
   - Procure por `BrandingDraft` e `Tenant`
   - Se aparecerem, está tudo certo!

### Passo 4: Verificar (Opcional)

Execute este SQL para confirmar:

```sql
SELECT table_name 
FROM information_schema.tables
WHERE table_schema='public' 
AND table_name IN ('BrandingDraft', 'Tenant');
```

**Esperado:** 2 linhas retornadas

---

## 2️⃣ VERCEL - CONFIGURAR WILDCARD (5 MIN)

### Opção A: DNS Gerenciado pelo Vercel (Recomendado)

1. **Acesse Vercel Dashboard:**
   - https://vercel.com/dashboard
   - Selecione projeto: `aistotele`

2. **Adicionar Domínio:**
   - Clique em **Settings** → **Domains**
   - Clique em **Add Domain**
   - Digite: `aistotele.app`
   - Clique em **Add**

3. **Habilitar Wildcard:**
   - Após adicionar, clique no domínio `aistotele.app`
   - Procure por **Wildcard Subdomains** ou **Enable Wildcard**
   - Ative o toggle (ou adicione manualmente `*.aistotele.app`)

4. **Verificar DNS:**
   - Vercel mostrará instruções de DNS
   - Se usar DNS do Vercel, será automático
   - Aguarde alguns minutos para propagação

### Opção B: DNS Externo (Cloudflare/Registro.br)

1. **No seu provedor de DNS:**
   - Crie um registro CNAME:
     - **Host/Nome:** `*`
     - **Target/Destino:** `cname.vercel-dns.com`
     - **TTL:** 3600 (ou automático)

2. **No Vercel:**
   - Settings → Domains
   - Add Domain: `aistotele.app`
   - Aguarde validação

3. **Testar:**
   ```bash
   dig +short test.aistotele.app CNAME
   # Esperado: cname.vercel-dns.com
   ```

---

## 3️⃣ TESTAR TUDO (5 MIN)

Após criar as tabelas e configurar wildcard, execute:

### Teste 1: Draft (POST) - Deve retornar 201

```bash
curl -s -X POST -H "Content-Type: application/json" \
  -d '{
    "brandColor":"#16a34a",
    "accentColor":"#065f46",
    "fantasyName":"Clínica Teste",
    "ctaText":"Falar com médico",
    "ctaUrl":"https://wa.me/5547999999999",
    "logoUrl":"https://picsum.photos/120/120.jpg"
  }' \
  https://www.aistotele.com/api/branding/draft | jq
```

**Esperado:** `{ "id": "...", "draft": {...} }` com status 201

---

### Teste 2: Lead (sem GHL) - Deve retornar 200

```bash
curl -s -X POST -H "Content-Type: application/json" \
  -d '{"name":"João","email":"joao@ex.com","company":"Clínica"}' \
  https://www.aistotele.com/api/b2b/lead | jq
```

**Esperado:** `{ "success": true, "message": "Lead salvo com sucesso" }`

---

### Teste 3: Checkout Stripe - Deve retornar URL

```bash
curl -s -X POST -H "Content-Type: application/json" \
  -d '{"plan":"plus","period":"monthly"}' \
  https://www.aistotele.com/api/stripe/create-checkout-session | jq
```

**Esperado:** `{ "id": "...", "url": "https://checkout.stripe.com/..." }`

---

### Teste 4: Scripts Automatizados

```bash
# Teste básico
BASE_URL=https://www.aistotele.com bash scripts/test-all-production.sh

# Teste completo
BASE_URL=https://www.aistotele.com bash scripts/test-flow-complete.sh
```

**Esperado:** Todos os testes passando (15/15)

---

### Teste 5: Wildcard

```bash
# Testar DNS
dig +short test.aistotele.app CNAME

# Testar URL
curl -I https://test.aistotele.app
```

**Esperado:** URL abre o app normalmente

---

## 🎯 CRITÉRIO DE GO/NO-GO

### ✅ GO (Aprovar) se:

- [x] Draft POST → 201 com `{ id, draft }`
- [x] Lead POST → 200 com `{ success: true }`
- [ ] Checkout → 200 com `{ url: "https://checkout.stripe.com/..." }`
- [ ] Wildcard → `https://test.aistotele.app` abre o app
- [ ] Testes automatizados → 15/15 passando

### ❌ NO-GO se:

- [ ] Draft ainda falha (tabela não criada)
- [ ] Checkout sem URL (ENVs faltando)
- [ ] Wildcard não resolve (DNS não configurado)

---

## 🔧 SE ALGO NÃO PASSAR

### Draft ainda falha

**Sintoma:** `{ "error": "Internal server error" }`

**Solução:**
1. Verifique se tabela `BrandingDraft` existe no Table Editor do Supabase
2. Se não existir, execute o SQL novamente
3. Se existir, faça redeploy no Vercel (Deployments → Redeploy)

---

### Checkout sem URL

**Sintoma:** Erro ou sem resposta

**Solução:**
1. Verifique ENVs no Vercel:
   - `STRIPE_SECRET_KEY`
   - `STRIPE_PRICE_PLUS_MONTHLY`
   - `STRIPE_PRICE_PLUS_YEARLY`
   - `STRIPE_PRICE_GIFT_MONTHLY`
   - `STRIPE_PRICE_GIFT_YEARLY`
   - `STRIPE_PRICE_ADDON_MONTHLY`
   - `STRIPE_PRICE_ADDON_YEARLY`
   - `STRIPE_WEBHOOK_SECRET`
2. Faça redeploy após verificar

---

### Wildcard não resolve

**Sintoma:** `test.aistotele.app` não abre

**Solução:**
1. Verifique se `aistotele.app` está no projeto Vercel
2. Verifique se wildcard está habilitado
3. Aguarde propagação DNS (pode levar alguns minutos)
4. Teste com `dig +short test.aistotele.app CNAME`

---

## 📊 CHECKLIST FINAL

Após executar as ações:

- [ ] SQL executado no Supabase
- [ ] Tabelas `BrandingDraft` e `Tenant` criadas
- [ ] Wildcard configurado no Vercel
- [ ] Teste Draft: 201 ✅
- [ ] Teste Lead: 200 ✅
- [ ] Teste Checkout: 200 com URL ✅
- [ ] Teste Wildcard: URL abre ✅
- [ ] Testes automatizados: 15/15 ✅

---

## 🚀 PRÓXIMO PASSO

Após tudo passar:

**Me avise: "ok, tudo verde"** → Já preparo o PR #1 da LPAC V2 (Hero + StickyBar)

---

**Status:** ⏳ **AGUARDANDO AÇÕES MANUAIS**

