# 🚨 AÇÃO URGENTE - VALIDAÇÃO

**Data:** 5 de novembro de 2025, 00:20  
**Status:** ⚠️ Correções aplicadas mas não deployadas

---

## 🔍 PROBLEMAS IDENTIFICADOS

### 1. ❌ API B2B Lead - Ainda usando GHL

**Sintoma:**
```json
{
  "error": "Internal server error",
  "details": "[GHL POST /contacts/upsert] 401 {\"statusCode\":401,\"message\":\"Invalid JWT\"}"
}
```

**Causa:** Código não foi deployado ainda. O arquivo `src/pages/api/b2b/lead.ts` foi corrigido localmente, mas as mudanças não estão em produção.

**Solução:** Fazer deploy das correções

---

### 2. ❌ API Branding Draft - Internal server error

**Sintoma:**
```json
{
  "error": "Internal server error"
}
```

**Causa provável:**
1. Tabela `BrandingDraft` não existe no Supabase
2. `DATABASE_URL` não configurado corretamente
3. Migração não aplicada

**Solução:** Verificar/criar tabela no Supabase

---

### 3. ⚠️ API Stripe Checkout - Sem resposta

**Sintoma:** Request não retorna resposta clara

**Causa provável:** ENVs podem estar corretas, mas precisa validar

**Solução:** Testar após deploy

---

## 🚀 AÇÕES NECESSÁRIAS (ORDEM)

### 1. Fazer Deploy das Correções (5 min)

```bash
cd /Users/teobeckert/desenvolvimento/aistotele
vercel --prod
```

**Esperado:**
- Build passa
- Deploy completa
- APIs atualizadas em produção

---

### 2. Verificar/Criar Tabela BrandingDraft (5 min)

**No Supabase SQL Editor:**

```sql
-- Verificar se existe
SELECT table_name 
FROM information_schema.tables
WHERE table_schema='public' 
AND table_name='BrandingDraft';
```

**Se não existir:**

1. Abrir: `prisma/migrations/20241104_add_branding_draft_and_tenant/migration.sql`
2. Copiar todo o conteúdo
3. Colar no Supabase SQL Editor
4. Executar
5. Verificar novamente

---

### 3. Configurar Wildcard (5 min)

**Vercel Dashboard:**
1. Project → Domains
2. Add domain: `aistotele.app` (se não existir)
3. Enable Wildcard Subdomains
4. Ou adicionar manualmente: `*.aistotele.app`

**Testar:**
```bash
dig +short test.aistotele.app CNAME
# Esperado: cname.vercel-dns.com
```

---

### 4. Re-testar Após Deploy (5 min)

```bash
# Teste básico
BASE_URL=https://www.aistotele.com bash scripts/test-all-production.sh

# Teste completo
BASE_URL=https://www.aistotele.com bash scripts/test-flow-complete.sh
```

---

## 📋 CHECKLIST PÓS-DEPLOY

Após fazer deploy, verificar:

- [ ] API Branding Draft POST → 201 com `{ id, draft }`
- [ ] API Branding Draft GET → 200 com `{ draft }`
- [ ] API B2B Lead → 200 com `{ success: true }` (sem erro GHL)
- [ ] API Stripe Checkout → 200 com `{ url: "https://checkout.stripe.com/..." }`
- [ ] Wildcard → `https://test.aistotele.app` abre o app

---

## 🎯 RESULTADO ESPERADO

Após todas as ações:

- ✅ **Testes:** 15/15 passando
- ✅ **APIs:** Todas funcionando
- ✅ **Wildcard:** Configurado e funcionando
- ✅ **Banco:** Tabelas criadas

---

**Status:** ⏳ **AGUARDANDO DEPLOY E VALIDAÇÃO**

