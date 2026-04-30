# 🔍 DIAGNÓSTICO - API Branding Draft

**Problema:** API retorna `{ "error": "Internal server error" }`

---

## 🔍 POSSÍVEIS CAUSAS

### 1. Tabela não foi criada

**Verificar no Supabase:**
1. Table Editor → Procurar por `BrandingDraft`
2. Se não existir, execute o SQL novamente

**Solução:** Executar `SUPABASE_SQL_PRONTO.sql` novamente

---

### 2. Prisma Client não sincronizado

**Problema:** Após criar tabela manualmente, Prisma Client pode não estar sincronizado

**Solução:** Fazer redeploy no Vercel (ou rodar `prisma generate` localmente)

```bash
# Local (se quiser testar)
npx prisma generate

# Ou fazer redeploy no Vercel
# Vercel Dashboard → Deployments → Último deploy → Redeploy
```

---

### 3. DATABASE_URL não acessível

**Verificar:**
- Vercel Dashboard → Settings → Environment Variables
- `DATABASE_URL` deve estar configurada
- `DIRECT_URL` deve estar configurada

---

### 4. Schema do Prisma vs SQL

**Schema Prisma:**
```prisma
model BrandingDraft {
  id            String   @id @default(uuid())
  ...
}
```

**SQL correto:**
```sql
CREATE TABLE IF NOT EXISTS "BrandingDraft" (
    "id" TEXT NOT NULL,
    ...
    CONSTRAINT "BrandingDraft_pkey" PRIMARY KEY ("id")
);
```

**Nota:** O Prisma gera o UUID no client-side, então o SQL não precisa de DEFAULT. Está correto!

---

## ✅ SOLUÇÃO RECOMENDADA

### Passo 1: Verificar se tabela existe

No Supabase Table Editor:
- Procure por `BrandingDraft`
- Se não existir, execute o SQL novamente

### Passo 2: Redeploy no Vercel

Após criar tabela:
1. Vercel Dashboard → Deployments
2. Clique nos 3 pontos do último deploy
3. Redeploy (sem mudanças de código, apenas para sincronizar)

### Passo 3: Testar novamente

```bash
curl -s -X POST -H "Content-Type: application/json" \
  -d '{"brandColor":"#16a34a","accentColor":"#065f46","fantasyName":"Teste","ctaText":"Teste","ctaUrl":"https://test.com"}' \
  https://www.aistotele.com/api/branding/draft | jq
```

**Esperado:** `201` com `{ id, draft }`

---

## 🎯 PRÓXIMA AÇÃO

1. Verificar se tabela existe no Supabase
2. Se não existir, executar SQL novamente
3. Fazer redeploy no Vercel
4. Testar novamente

---

**Status:** ⏳ **AGUARDANDO VERIFICAÇÃO DA TABELA**

