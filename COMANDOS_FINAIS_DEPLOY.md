# 🚀 COMANDOS FINAIS - DEPLOY E VALIDAÇÃO

**Data:** 4 de novembro de 2025  
**Status:** ✅ Código pronto | ⚠️ Configurações pendentes

---

## 📋 CHECKLIST RÁPIDO

### ✅ Validação Local (CONCLUÍDA)

Executeu: `bash scripts/validate-pre-deploy.sh`
- ✅ Prisma Client gerado
- ✅ Todos os arquivos criados
- ✅ Integrações validadas
- ✅ Cron configurado

---

## 🎯 PASSOS PARA DEPLOY (ORDEM EXATA)

### 1. Supabase - Migração SQL (5 min)

**Opção A: Via Supabase Dashboard (Recomendado)**

1. Acesse: https://supabase.com/dashboard → Seu projeto → SQL Editor
2. Abra o arquivo: `prisma/migrations/20241104_add_branding_draft_and_tenant/migration.sql`
3. Copie TODO o conteúdo
4. Cole no SQL Editor
5. Clique em **Run** (ou F5)
6. Verificar mensagem: "Success. No rows returned"

**Opção B: Via CLI (se tiver DATABASE_URL configurada)**

```bash
# Se tiver DATABASE_URL no .env.local
pnpm prisma migrate deploy
pnpm prisma generate
```

**Verificação:**
```sql
-- No Supabase SQL Editor, executar:
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('BrandingDraft', 'Tenant');
```

**Esperado:** 2 tabelas retornadas

---

### 2. Supabase - Storage (3 min)

1. Supabase Dashboard → Storage
2. Criar bucket `public` (se não existir)
3. Configurar políticas:
   ```sql
   -- Política de leitura pública
   CREATE POLICY "Public read access" ON storage.objects
   FOR SELECT USING (bucket_id = 'public');
   ```

**Verificação:**
- Bucket `public` existe
- Arquivos podem ser lidos publicamente

---

### 3. Vercel - Variáveis de Ambiente (10 min)

Vercel Dashboard → Seu Projeto → Settings → Environment Variables → **Production**

**Adicionar/Verificar:**

```bash
# Banco de Dados
DATABASE_URL=postgresql://...
DIRECT_URL=postgresql://...  # (se usar PGBouncer)

# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJ...  # ⚠️ CRÍTICO para cleanup

# Stripe
STRIPE_SECRET_KEY=sk_live_...
STRIPE_PUBLIC_KEY=pk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...

# B2B Config
NEXT_PUBLIC_ROOT_B2B_DOMAINS=aistotele.com,www.aistotele.com
NEXT_PUBLIC_BRAND_NAME=Aistotele
NEXT_PUBLIC_SHOW_SALES_ASSISTANT=1

# Cron Security (GERAR AGORA!)
CLEANUP_CRON_TOKEN=seu-token-seguro-aqui  # ⚠️ CRÍTICO

# GHL (CRM)
GHL_LOCATION_ID=...
GHL_PIPELINE_ID=...
GHL_STAGE_VISIT=...
GHL_STAGE_TRIAGE=...
GHL_STAGE_CHECKOUT=...
GHL_STAGE_WON=...
```

**Gerar CLEANUP_CRON_TOKEN:**
```bash
openssl rand -hex 32
```

**Copiar o resultado e colar no Vercel**

---

### 4. Vercel - Wildcard DNS (5 min)

1. Vercel Dashboard → Seu Projeto → Settings → Domains
2. Adicionar domínio: `aistotele.app`
3. Habilitar **Wildcard Subdomains**
4. Configurar DNS (se necessário):
   - Tipo: CNAME
   - Nome: `*` ou `*.aistotele.app`
   - Valor: `cname.vercel-dns.com`

**Verificação:**
- Domínio aparece como "Valid"
- Wildcard habilitado

---

### 5. Deploy (5 min)

```bash
# No terminal
cd /Users/teobeckert/desenvolvimento/aistotele

# Commit
git add .
git commit -m "feat: Lote H+I completo - wizard + provisionamento + cleanup 48h"

# Push
git push origin main

# Vercel fará deploy automaticamente
```

**Aguardar deploy completar (3-5 min)**

---

### 6. Validação (15 min)

#### A) Smoke Test

```bash
BASE_URL=https://www.aistotele.com pnpm smoke:prod
```

**Esperado:**
```
✅ GET / -> 200
✅ GET /#cases -> 200
✅ GET /b2b/sandbox -> 200
✅ GET /b2b/assinar -> 200
✅ GET /triagem -> 200
✅ GET /api/tenant/info -> 200
✅ GET /api/analytics/vitals -> 405 (esperado)
```

#### B) E2E Test

```bash
BASE_URL=https://www.aistotele.com pnpm e2e:prod
```

**Esperado:**
- Todos os testes passam
- Screenshots gerados em `test-results/`

#### C) Teste Manual do Cron

```bash
# Substituir SEU_TOKEN pelo valor de CLEANUP_CRON_TOKEN
curl -X POST \
  -H "x-cron-token: SEU_TOKEN" \
  https://www.aistotele.com/api/cron/cleanup
```

**Esperado:**
```json
{
  "ok": true,
  "removedDrafts": 0,
  "removedTenants": 0,
  "removedLogos": 0,
  "timestamp": "2025-11-04T..."
}
```

#### D) Fluxo Manual Completo

1. **Acessar:** `https://www.aistotele.com`
2. **Clicar:** "Personalizar agora (grátis)"
3. **Configurar:**
   - Upload logo (testar com imagem pequena)
   - Escolher cores
   - Preencher: nome fantasia, CTA, WhatsApp
   - Ver preview funcionando
   - Clicar "Continuar"
4. **Assinar:**
   - Preencher formulário
   - Enviar
   - Verificar redirecionamento para `/pricing?draft=...`
5. **Checkout:**
   - Abrir DevTools → Network
   - Selecionar plano
   - Verificar que request para `/api/stripe/create-checkout-session` inclui `draft_id`
   - Completar checkout (modo teste)
6. **Verificar:**
   - Webhook processado (Stripe Dashboard → Events)
   - Tenant criado (Supabase → Table Editor → Tenant)
   - Draft deletado (Supabase → Table Editor → BrandingDraft → não deve existir)
   - WhatsApp recebido com URL provisória
7. **URL Provisória:**
   - Acessar `https://{slug}.aistotele.app`
   - Verificar branding aplicado

---

## 🔍 VERIFICAÇÕES FINAIS

### No Vercel Dashboard

- [ ] Deploy concluído com sucesso
- [ ] Cron Jobs aparecendo: `/api/cron/cleanup` (a cada 6h)
- [ ] Domínio `aistotele.app` com wildcard habilitado
- [ ] Todas as ENVs configuradas

### No Supabase Dashboard

- [ ] Tabelas `BrandingDraft` e `Tenant` existem
- [ ] Bucket `public` existe
- [ ] Políticas de storage configuradas

### No Stripe Dashboard

- [ ] Webhook ativo: `https://aistotele.com/api/stripe/webhook`
- [ ] Eventos: `checkout.session.completed`, `invoice.payment_succeeded`
- [ ] Último evento processado com sucesso

---

## ✅ GO/NO-GO

### ✅ GO (Aprovar) se:

- [x] Migração SQL executada
- [x] ENVs configuradas (incluindo CLEANUP_CRON_TOKEN)
- [x] Wildcard DNS configurado
- [x] Smoke test: todos passam
- [x] E2E test: todos passam
- [x] Fluxo manual: funciona end-to-end
- [x] Draft deletado após checkout
- [x] URL provisória funciona
- [x] Cron responde 200

### ❌ NO-GO (Não Aprovar) se:

- [ ] Qualquer erro nos testes acima
- [ ] ENVs faltando
- [ ] Wildcard não funciona
- [ ] Webhook não cria tenant

---

## 📊 COPY PARA CAMPANHAS

### WhatsApp/E-mail

```
Olá! 👋

A Aistotele permite oferecer triagens médicas inteligentes com a sua marca (logo, cores e domínio).

Você personaliza grátis em 2 minutos, vê o preview funcionando e só paga se gostar.

✅ White-label completo
✅ Relatórios com IA
✅ Links e QRs para campanhas

Experimente: www.aistotele.com — clique em 'Personalizar agora (grátis)' 🚀
```

---

## 🎯 PRÓXIMA AÇÃO

**Execute os passos 1-6 acima na ordem exata.**

**Tempo estimado:** 30-45 minutos

**Após validação completa → GO para lançamento!** 🚀

