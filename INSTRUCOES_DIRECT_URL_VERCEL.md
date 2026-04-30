# ⚠️ INSTRUÇÕES CRÍTICAS - DIRECT_URL NO VERCEL

**Erro:** `FATAL: Tenant or user not found`

**Causa:** `DIRECT_URL` não está configurada corretamente ou não está sendo usada.

---

## 🔧 AÇÃO IMEDIATA NO VERCEL

### 1. Verificar se DIRECT_URL existe
Vercel Dashboard → Project Settings → Environment Variables → **Production**

**Confirme que existe:**
```
DIRECT_URL
```

### 2. Valor correto da DIRECT_URL

**Formato correto:**
```
postgresql://postgres.qltixyfxxrbdnaldgtzr:DdVu8MWxAGTXUT3P@db.qltixyfxxrbdnaldgtzr.supabase.co:5432/postgres
```

**⚠️ IMPORTANTE:**
- ✅ Porta **5432** (NÃO 6543)
- ✅ Sem `?pgbouncer=true`
- ✅ Sem `?connection_limit=1`
- ✅ Usuário: `postgres.qltixyfxxrbdnaldgtzr` (com o prefixo do projeto)
- ✅ Senha: `DdVu8MWxAGTXUT3P`

### 3. DATABASE_URL vs DIRECT_URL

**DATABASE_URL (pooler - para leitura):**
```
postgresql://postgres.qltixyfxxrbdnaldgtzr:fcEv8StswRmI0XiZ@aws-1-sa-east-1.pooler.supabase.com:6543/postgres?pgbouncer=true&connection_limit=1&sslmode=require
```

**DIRECT_URL (direto - para escrita):**
```
postgresql://postgres.qltixyfxxrbdnaldgtzr:DdVu8MWxAGTXUT3P@db.qltixyfxxrbdnaldgtzr.supabase.co:5432/postgres
```

---

## ✅ DEPOIS DE CONFIGURAR

1. **Redeploy no Vercel:**
   - Vercel Dashboard → Deployments
   - Último deploy → 3 pontos → Redeploy

2. **Testar novamente:**
   ```bash
   curl -s -X POST "https://aistotele.com/api/branding/draft" \
     -H "Content-Type: application/json" \
     -d '{"fantasyName":"Teste","brandColor":"#10b981","accentColor":"#059669","ctaText":"Teste","ctaUrl":"https://wa.me/123"}' | jq '.'
   ```

---

**Configure DIRECT_URL no Vercel e faça redeploy!**

