# 🔧 VERIFICAÇÃO CRÍTICA - .env.local

**Erro:** `FATAL: Tenant or user not found`

**Causa:** `DIRECT_URL` no `.env.local` está com credenciais incorretas ou formato errado.

---

## ✅ VERIFIQUE SEU .env.local

Abra o arquivo `.env.local` e confirme que `DIRECT_URL` está assim:

```bash
DIRECT_URL=postgresql://postgres.qltixyfxxrbdnaldgtzr:DdVu8MWxAGTXUT3P@db.qltixyfxxrbdnaldgtzr.supabase.co:5432/postgres
```

**⚠️ IMPORTANTE:**
- ✅ Usuário: `postgres.qltixyfxxrbdnaldgtzr` (com o prefixo do projeto)
- ✅ Senha: `DdVu8MWxAGTXUT3P`
- ✅ Host: `db.qltixyfxxrbdnaldgtzr.supabase.co` (NÃO pooler)
- ✅ Porta: `5432` (NÃO 6543)
- ✅ Sem `?pgbouncer=true`

---

## 🔍 COMPARAÇÃO

**DATABASE_URL (pooler - leitura):**
```
postgresql://postgres.qltixyfxxrbdnaldgtzr:fcEv8StswRmI0XiZ@aws-1-sa-east-1.pooler.supabase.com:6543/postgres?pgbouncer=true&connection_limit=1&sslmode=require
```

**DIRECT_URL (direto - escrita):**
```
postgresql://postgres.qltixyfxxrbdnaldgtzr:DdVu8MWxAGTXUT3P@db.qltixyfxxrbdnaldgtzr.supabase.co:5432/postgres
```

**Diferenças:**
- DATABASE_URL: pooler, porta 6543, senha diferente
- DIRECT_URL: direto, porta 5432, senha DdVu8MWxAGTXUT3P

---

## ✅ DEPOIS DE CORRIGIR

1. **Salve o `.env.local`**
2. **Reinicie o servidor** (`pnpm dev`)
3. **Teste novamente:**
   ```bash
   curl -X POST "http://localhost:3002/api/branding/draft" \
     -H "Content-Type: application/json" \
     -d '{"fantasyName":"Teste","brandColor":"#10b981","accentColor":"#059669","ctaText":"Teste","ctaUrl":"https://wa.me/123"}'
   ```

---

**Corrija o DIRECT_URL no .env.local e me avise quando fizer!**

