# 📋 RESUMO - ENVs PRONTAS PARA COPIAR/COLAR

**Data:** 11 de janeiro de 2025  
**Projeto:** qltixyfxxrbdnaldgtzr

---

## ⚠️ ANTES DE COMEÇAR

**Você precisa obter o `SUPABASE_SERVICE_ROLE_KEY`:**

1. Acesse: https://supabase.com/dashboard/project/qltixyfxxrbdnaldgtzr/settings/api-keys
2. Aba "Legacy API Keys"
3. Seção "Service Role (Secret) Key"
4. Clique no ícone 👁️ para revelar
5. Clique em "Copy"
6. Substitua `<OBTER_DO_DASHBOARD>` abaixo pelo valor copiado

---

## 📋 PARA .env.local (LOCAL)

**Copie e cole no seu `.env.local`:**

```env
SUPABASE_URL=https://qltixyfxxrbdnaldgtzr.supabase.co
NEXT_PUBLIC_SUPABASE_URL=https://qltixyfxxrbdnaldgtzr.supabase.co
SUPABASE_SERVICE_ROLE_KEY=<OBTER_DO_DASHBOARD>
NEXT_PUBLIC_SUPABASE_ANON_KEY=<REDACTED_SUPABASE_ANON_JWT>
DATABASE_URL=postgresql://postgres:DdVu8MWxAGTXUT3P@db.qltixyfxxrbdnaldgtzr.supabase.co:5432/postgres
DIRECT_URL=postgresql://postgres:DdVu8MWxAGTXUT3P@db.qltixyfxxrbdnaldgtzr.supabase.co:5432/postgres
BRANDING_BUCKET=branding-logos
NEXT_PUBLIC_FREE_TRIAGE_SLUG=gastro
```

---

## 📋 PARA VERCEL (PRODUCTION)

**Vercel Dashboard → Settings → Environment Variables → Add New**

### Variável 1:
```
Name: SUPABASE_URL
Value: https://qltixyfxxrbdnaldgtzr.supabase.co
Environment: ✅ Production ✅ Preview ✅ Development
```

### Variável 2:
```
Name: NEXT_PUBLIC_SUPABASE_URL
Value: https://qltixyfxxrbdnaldgtzr.supabase.co
Environment: ✅ Production ✅ Preview ✅ Development
```

### Variável 3:
```
Name: SUPABASE_SERVICE_ROLE_KEY
Value: <OBTER_DO_DASHBOARD>
Environment: ✅ Production ✅ Preview ✅ Development
```

### Variável 4:
```
Name: NEXT_PUBLIC_SUPABASE_ANON_KEY
Value: <REDACTED_SUPABASE_ANON_JWT>
Environment: ✅ Production ✅ Preview ✅ Development
```

### Variável 5:
```
Name: DATABASE_URL
Value: postgresql://postgres:DdVu8MWxAGTXUT3P@db.qltixyfxxrbdnaldgtzr.supabase.co:5432/postgres
Environment: ✅ Production ✅ Preview ✅ Development
```

### Variável 6:
```
Name: DIRECT_URL
Value: postgresql://postgres:DdVu8MWxAGTXUT3P@db.qltixyfxxrbdnaldgtzr.supabase.co:5432/postgres
Environment: ✅ Production ✅ Preview ✅ Development
```

### Variável 7:
```
Name: BRANDING_BUCKET
Value: branding-logos
Environment: ✅ Production ✅ Preview ✅ Development
```

### Variável 8:
```
Name: NEXT_PUBLIC_FREE_TRIAGE_SLUG
Value: gastro
Environment: ✅ Production ✅ Preview ✅ Development
```

---

## ✅ VALIDAÇÃO RÁPIDA

**Após configurar, execute:**

```bash
# Validar .env.local
./scripts/validar-env.sh

# Testar APIs
pnpm dev
# Em outro terminal:
curl -X POST "http://localhost:3000/api/branding/upload-logo" \
  -H "Content-Type: application/json" \
  -d '{"base64":"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR4nGMAAQAABQABDQottQAAAABJRU5ErkJggg=="}'
```

---

**Última atualização:** 11 de janeiro de 2025

