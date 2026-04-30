# 🔐 VARIÁVEIS DE AMBIENTE - VERCEL PRODUCTION

**Data:** 11 de janeiro de 2025  
**Projeto:** aistoteleapp-art's Project  
**Project ID:** `qltixyfxxrbdnaldgtzr`

---

## 📋 CONFIGURAR NO VERCEL DASHBOARD

**Acesse:** Vercel Dashboard → Seu Projeto → Settings → Environment Variables

**Adicione cada variável abaixo:**

---

### 1. SUPABASE_URL

```
Name: SUPABASE_URL
Value: https://qltixyfxxrbdnaldgtzr.supabase.co
Environment: ✅ Production ✅ Preview ✅ Development
```

---

### 2. NEXT_PUBLIC_SUPABASE_URL

```
Name: NEXT_PUBLIC_SUPABASE_URL
Value: https://qltixyfxxrbdnaldgtzr.supabase.co
Environment: ✅ Production ✅ Preview ✅ Development
```

---

### 3. SUPABASE_SERVICE_ROLE_KEY

```
Name: SUPABASE_SERVICE_ROLE_KEY
Value: <OBTER_DO_SUPABASE_DASHBOARD>
Environment: ✅ Production ✅ Preview ✅ Development
```

**Como obter:**
1. Acesse: https://supabase.com/dashboard/project/qltixyfxxrbdnaldgtzr/settings/api-keys
2. Aba "Legacy API Keys" → `service_role secret`
3. Clique no ícone de "olho" para revelar
4. Clique em "Copy" para copiar o valor completo
5. Cole no Vercel

---

### 4. NEXT_PUBLIC_SUPABASE_ANON_KEY

```
Name: NEXT_PUBLIC_SUPABASE_ANON_KEY
Value: <REDACTED_SUPABASE_ANON_JWT>
Environment: ✅ Production ✅ Preview ✅ Development
```

---

### 5. DATABASE_URL

```
Name: DATABASE_URL
Value: postgresql://postgres:DdVu8MWxAGTXUT3P@db.qltixyfxxrbdnaldgtzr.supabase.co:5432/postgres
Environment: ✅ Production ✅ Preview ✅ Development
```

---

### 6. DIRECT_URL

```
Name: DIRECT_URL
Value: postgresql://postgres:DdVu8MWxAGTXUT3P@db.qltixyfxxrbdnaldgtzr.supabase.co:5432/postgres
Environment: ✅ Production ✅ Preview ✅ Development
```

---

### 7. BRANDING_BUCKET

```
Name: BRANDING_BUCKET
Value: branding-logos
Environment: ✅ Production ✅ Preview ✅ Development
```

---

### 8. NEXT_PUBLIC_FREE_TRIAGE_SLUG

```
Name: NEXT_PUBLIC_FREE_TRIAGE_SLUG
Value: gastro
Environment: ✅ Production ✅ Preview ✅ Development
```

---

## ✅ CHECKLIST DE VALIDAÇÃO

Após adicionar todas as variáveis:

- [ ] Todas as 8 variáveis acima estão configuradas
- [ ] `SUPABASE_SERVICE_ROLE_KEY` foi obtido do dashboard Supabase
- [ ] Todas estão marcadas para Production, Preview e Development
- [ ] Redeploy executado após adicionar variáveis

---

## 🧪 TESTE APÓS CONFIGURAR

Após redeploy, teste em produção:

```bash
# 1. Upload Logo
curl -X POST "https://seu-dominio.com/api/branding/upload-logo" \
  -H "Content-Type: application/json" \
  -d '{"base64":"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR4nGMAAQAABQABDQottQAAAABJRU5ErkJggg=="}'

# Esperado: { "url": "...", "path": "..." }

# 2. Criar Draft
curl -X POST "https://seu-dominio.com/api/branding/draft" \
  -H "Content-Type: application/json" \
  -d '{"fantasyName":"Teste","brandColor":"#a34900","ctaText":"Teste","ctaUrl":"https://wa.me/123"}'

# Esperado: { "ok": true, "id": "...", "draft": {...} }
```

---

**Última atualização:** 11 de janeiro de 2025

