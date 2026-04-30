# 🎯 CONDUTA FINAL - CORREÇÃO NO VERCEL

**PRIORIDADE:** 🔴 CRÍTICA - RESOLVER AGORA

---

## ❌ PROBLEMA IDENTIFICADO

**Erro:** `FATAL: Tenant or user not found`

**Causa Raiz:** `DIRECT_URL` no Vercel está usando usuário incorreto

**Nas imagens do Vercel você mostrou:**
```
postgresql://postgres:fcEv8StswRmT0XiZ@db.qltixyfxxrbdnaldgtzr.supabase.co:5432/postgres
```

**O que está errado:**
- ❌ Usuário: `postgres` (deveria ser `postgres.qltixyfxxrbdnaldgtzr`)
- ❌ Senha: `fcEv8StswRmT0XiZ` (antiga, deveria ser `DdVu8MWxAGTXUT3P`)

---

## ✅ CORREÇÃO (COPIE E COLE)

### 1. Vercel Dashboard
1. Vá em: **Project Settings → Environment Variables → Production**
2. Encontre a variável: **`DIRECT_URL`**
3. Clique em **Editar** (ou 3 pontos → Edit)

### 2. Valor Correto (COPIE TUDO):
```
postgresql://postgres.qltixyfxxrbdnaldgtzr:DdVu8MWxAGTXUT3P@db.qltixyfxxrbdnaldgtzr.supabase.co:5432/postgres?sslmode=require
```

**Diferenças:**
- ✅ Usuário: `postgres.qltixyfxxrbdnaldgtzr` (com prefixo do projeto)
- ✅ Senha: `DdVu8MWxAGTXUT3P` (nova senha)
- ✅ Porta: `5432` (direto, sem pooler)
- ✅ Host: `db.qltixyfxxrbdnaldgtzr.supabase.co` (NÃO pooler)

### 3. Verificar DATABASE_URL também

**Confirme que está:**
```
postgresql://postgres.qltixyfxxrbdnaldgtzr:fcEv8StswRmT0XiZ@aws-1-sa-east-1.pooler.supabase.com:6543/postgres?pgbouncer=true&pool_timeout=30&connect_timeout=15&sslmode=require
```

**Se estiver com `postgres:` em vez de `postgres.qltixyfxxrbdnaldgtzr:`, corrigir também.**

### 4. Salvar e Redeploy

1. **Salvar** a variável
2. **Redeploy** (Vercel Dashboard → Deployments → Último deploy → 3 pontos → Redeploy)
3. **Aguardar** 2-3 minutos

---

## 🧪 TESTE APÓS CORREÇÃO

Após redeploy:

```bash
./scripts/smoke-production-final.sh https://aistotele.com
```

**Esperado:**
- ✅ Upload de Logo: HTTP 200
- ✅ Criar Draft: HTTP 201
- ✅ Consultar Draft: HTTP 200
- ✅ Páginas B2B: HTTP 200

---

## 📋 RESUMO

**O que fazer:**
1. ✅ Corrigir `DIRECT_URL` no Vercel (usuário + senha)
2. ✅ Verificar `DATABASE_URL` (usuário correto)
3. ✅ Redeploy
4. ✅ Testar

**Tempo:** 5 minutos

**Status:** Código 100% pronto, faltando apenas correção de variável no Vercel

---

**🎯 CORRIJA O DIRECT_URL NO VERCEL AGORA!**

