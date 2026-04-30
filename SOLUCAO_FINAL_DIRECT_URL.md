# ✅ SOLUÇÃO FINAL - DIRECT_URL

**Problema:** `FATAL: Tenant or user not found` ao criar draft

**Causa:** Prisma precisa de `DIRECT_URL` para operações de escrita, mas pode não estar configurada no Vercel.

---

## 🎯 VERIFICAÇÃO NO VERCEL (FAÇA AGORA)

### Vercel Dashboard → Settings → Environment Variables → Production

**Confirme estas 2 variáveis:**

1. **DATABASE_URL** (pooler - já deve estar):
   ```
   postgresql://postgres.qltixyfxxrbdnaldgtzr:fcEv8StswRmI0XiZ@aws-1-sa-east-1.pooler.supabase.com:6543/postgres?pgbouncer=true&connection_limit=1&sslmode=require
   ```

2. **DIRECT_URL** (direto - CRÍTICO):
   ```
   postgresql://postgres.qltixyfxxrbdnaldgtzr:DdVu8MWxAGTXUT3P@db.qltixyfxxrbdnaldgtzr.supabase.co:5432/postgres
   ```

**Diferenças importantes:**
- DATABASE_URL: porta **6543**, pooler, usuário `postgres.qltixyfxxrbdnaldgtzr`
- DIRECT_URL: porta **5432**, direto, mesmo usuário, senha `DdVu8MWxAGTXUT3P`

---

## 🚀 APÓS CONFIGURAR DIRECT_URL

### 1. Redeploy no Vercel
Vercel Dashboard → Deployments → Último deploy → 3 pontos → **Redeploy**

### 2. Testar (aguardar 2-3 min após redeploy)
```bash
./scripts/smoke-production-final.sh https://aistotele.com
```

**Esperado:** 4 verdes ✅

---

## 🔍 SE AINDA FALHAR

Verifique nos logs do Vercel:
- Vercel Dashboard → Deployments → Último deploy → Functions → `/api/branding/draft`
- Procure por `[branding/draft][POST]` nos logs

---

**Configure DIRECT_URL no Vercel (Production) e faça redeploy!**

