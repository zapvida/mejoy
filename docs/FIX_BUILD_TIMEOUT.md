# Fix: Build timeout na Vercel (47 min)

## Causa

O `postbuild` rodava `prisma migrate deploy`, que **trava indefinidamente** ao usar o pooler Supabase (porta 6543). O PgBouncer em modo Transaction não suporta advisory locks que o Prisma usa nas migrations. Resultado: build >45 min → timeout.

## Solução aplicada

Removido `prisma migrate deploy` do `postbuild`. O build agora roda apenas:
- `next-sitemap` (sitemap)

## Migrations: como rodar

**Opção 1 — Manual (recomendado):** Antes de fazer deploy, localmente:

```bash
# .env.local já deve ter DATABASE_URL com pooler
# Para migrations, use conexão DIRETA (porta 5432) — pooler trava
# Crie DATABASE_URL_DIRECT temporariamente ou use Supabase SQL Editor
pnpm prisma migrate deploy
```

**Opção 2 — Supabase SQL Editor:** Se as tabelas Store V2 foram criadas via `scripts/store-v2-migrations.sql`, não precisa rodar `prisma migrate deploy`. O schema já está aplicado.

**Opção 3 — GitHub Action:** Rodar `prisma migrate deploy` em um job de CI com `DATABASE_URL` direta (porta 5432), antes do deploy na Vercel.

## Resumo

- ✅ `postbuild` removido: sem `prisma migrate deploy` → build termina em ~2–3 min
- ⚠️ Migrations: rodar manualmente ou em CI com conexão direta quando houver mudanças no schema
