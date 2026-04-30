# 🔧 MIGRAÇÃO MANUAL - LOTE H + I

## ✅ PRISMA GENERATE CONCLUÍDO

O comando `npx prisma generate` foi executado com sucesso! ✅

---

## 📋 MIGRAÇÃO SQL CRIADA

A migração SQL foi criada manualmente em:
```
prisma/migrations/20241104_add_branding_draft_and_tenant/migration.sql
```

---

## 🚀 COMO EXECUTAR A MIGRAÇÃO

### Opção 1: Via Prisma (quando tiver DATABASE_URL)

```bash
# Configure DATABASE_URL no .env.local
DATABASE_URL="postgresql://user:password@host:port/database?pgbouncer=true&connection_limit=1"

# Execute a migração
npx prisma migrate deploy
```

### Opção 2: Via SQL direto no Supabase

1. Acesse o Supabase Dashboard
2. Vá em **SQL Editor**
3. Cole o conteúdo do arquivo `prisma/migrations/20241104_add_branding_draft_and_tenant/migration.sql`
4. Execute

### Opção 3: Via psql (se tiver acesso direto)

```bash
psql $DATABASE_URL -f prisma/migrations/20241104_add_branding_draft_and_tenant/migration.sql
```

---

## 📊 O QUE A MIGRAÇÃO CRIA

### Tabela `BrandingDraft`
- Armazena drafts de personalização (logo, cores, CTAs)
- Expira automaticamente após 7 dias
- Índices em `expiresAt` e `createdAt`

### Tabela `Tenant`
- Armazena tenants (clientes B2B)
- Campos: slug, domain, branding, status, owner
- Índices em ownerEmail, status, slug, createdAt
- Constraints: slug único, domain único

---

## ✅ VALIDAÇÃO

Após executar a migração, verifique:

```sql
-- Verificar tabelas criadas
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('BrandingDraft', 'Tenant');

-- Verificar índices
SELECT indexname, tablename 
FROM pg_indexes 
WHERE tablename IN ('BrandingDraft', 'Tenant');
```

---

## 🎯 PRÓXIMOS PASSOS

1. ✅ **Prisma Generate** - Já executado com sucesso
2. ⚠️ **Migração SQL** - Executar quando tiver DATABASE_URL
3. ⚠️ **Configurar Supabase Storage** - Criar bucket `public`
4. ⚠️ **Testar fluxo completo** - Após migração

---

## 📝 NOTAS

- A migração usa `IF NOT EXISTS` para segurança
- Todos os campos opcionais são `TEXT` nullable
- Timestamps usam `TIMESTAMPTZ` (timezone-aware)
- Índices criados para performance

---

**Status:** ✅ Migração SQL criada | ⚠️ Aguardando execução no banco

