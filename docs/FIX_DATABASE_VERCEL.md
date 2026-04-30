# Corrigir "Can't reach database server" na Vercel

O erro ocorre quando `DATABASE_URL` usa a **conexão direta** (porta 5432) em vez do **pooler** (porta 6543). Funções serverless na Vercel precisam do pooler.

## Passos

1. **Supabase Dashboard** → seu projeto → **Settings** → **Database**
2. Em **Connection string**, selecione **URI**
3. Copie a URL do **Transaction pooler** (porta **6543**), não a direta (5432)
4. Formato esperado:
   ```
   postgresql://postgres.[project-ref]:[password]@aws-0-[region].pooler.supabase.com:6543/postgres?pgbouncer=true&sslmode=require
   ```
5. **Vercel** → Project **zapfarm** → **Settings** → **Environment Variables**
6. Edite `DATABASE_URL` e cole a URL do pooler (porta 6543)
7. **Redeploy** (Deployments → último deploy → Redeploy)

## Verificação

Se o projeto Supabase estiver **pausado** (free tier após inatividade):
- Dashboard Supabase → **Restore project**

## Alternativa

Se já usa o pooler e ainda falha:
- Verifique se a senha na URL está correta
- Caracteres especiais na senha: use `%24` no lugar de `$` (encode URL)
- Exemplo: senha `abc$123` → `abc%24123` na URL
