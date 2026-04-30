# 🔐 VARIÁVEIS DE AMBIENTE COMPLETAS

**Data:** 11 de janeiro de 2025  
**Projeto:** aistoteleapp-art's Project  
**Project ID:** `qltixyfxxrbdnaldgtzr`  
**Ambiente:** Production

---

## 📋 VARIÁVEIS PARA `.env.local` (LOCAL)

```env
# ============================================
# SUPABASE - CONFIGURAÇÃO
# ============================================
SUPABASE_URL=https://qltixyfxxrbdnaldgtzr.supabase.co
NEXT_PUBLIC_SUPABASE_URL=https://qltixyfxxrbdnaldgtzr.supabase.co
SUPABASE_SERVICE_ROLE_KEY=<PREENCHER_COM_SERVICE_ROLE_KEY>
NEXT_PUBLIC_SUPABASE_ANON_KEY=<REDACTED_SUPABASE_ANON_JWT>

# ============================================
# DATABASE - CONFIGURAÇÃO
# ============================================
DATABASE_URL=postgresql://postgres:DdVu8MWxAGTXUT3P@db.qltixyfxxrbdnaldgtzr.supabase.co:5432/postgres
DIRECT_URL=postgresql://postgres:DdVu8MWxAGTXUT3P@db.qltixyfxxrbdnaldgtzr.supabase.co:5432/postgres

# ============================================
# BRANDING - CONFIGURAÇÃO
# ============================================
BRANDING_BUCKET=branding-logos

# ============================================
# TRIAGEM - CONFIGURAÇÃO
# ============================================
NEXT_PUBLIC_FREE_TRIAGE_SLUG=gastro
```

---

## 📋 VARIÁVEIS PARA VERCEL (PRODUCTION)

### Configuração no Vercel Dashboard:

**Settings → Environment Variables → Add New**

#### 1. SUPABASE_URL
```
Name: SUPABASE_URL
Value: https://qltixyfxxrbdnaldgtzr.supabase.co
Environment: ✅ Production ✅ Preview ✅ Development
```

#### 2. NEXT_PUBLIC_SUPABASE_URL
```
Name: NEXT_PUBLIC_SUPABASE_URL
Value: https://qltixyfxxrbdnaldgtzr.supabase.co
Environment: ✅ Production ✅ Preview ✅ Development
```

#### 3. SUPABASE_SERVICE_ROLE_KEY
```
Name: SUPABASE_SERVICE_ROLE_KEY
Value: <PREENCHER_COM_SERVICE_ROLE_KEY>
Environment: ✅ Production ✅ Preview ✅ Development
```

#### 4. NEXT_PUBLIC_SUPABASE_ANON_KEY
```
Name: NEXT_PUBLIC_SUPABASE_ANON_KEY
Value: <REDACTED_SUPABASE_ANON_JWT>
Environment: ✅ Production ✅ Preview ✅ Development
```

#### 5. DATABASE_URL
```
Name: DATABASE_URL
Value: postgresql://postgres:DdVu8MWxAGTXUT3P@db.qltixyfxxrbdnaldgtzr.supabase.co:5432/postgres
Environment: ✅ Production ✅ Preview ✅ Development
```

#### 6. DIRECT_URL
```
Name: DIRECT_URL
Value: postgresql://postgres:DdVu8MWxAGTXUT3P@db.qltixyfxxrbdnaldgtzr.supabase.co:5432/postgres
Environment: ✅ Production ✅ Preview ✅ Development
```

#### 7. BRANDING_BUCKET
```
Name: BRANDING_BUCKET
Value: branding-logos
Environment: ✅ Production ✅ Preview ✅ Development
```

#### 8. NEXT_PUBLIC_FREE_TRIAGE_SLUG
```
Name: NEXT_PUBLIC_FREE_TRIAGE_SLUG
Value: gastro
Environment: ✅ Production ✅ Preview ✅ Development
```

---

## ⚠️ FALTANDO: SERVICE_ROLE_KEY

**Precisa ser obtido do Supabase Dashboard:**

1. Acesse: https://supabase.com/dashboard/project/qltixyfxxrbdnaldgtzr/settings/api-keys
2. Na aba "Legacy API Keys" ou "API Keys" → "Secret keys"
3. Copie o `service_role secret` key completo
4. Substitua `<PREENCHER_COM_SERVICE_ROLE_KEY>` nas variáveis acima

---

## ✅ VALIDAÇÃO RÁPIDA

### Verificar se todas as variáveis estão configuradas:

**Local:**
```bash
cat .env.local | grep -E "^(SUPABASE|DATABASE|BRANDING)" | wc -l
# Deve retornar pelo menos 7 linhas
```

**Vercel:**
- Dashboard → Settings → Environment Variables
- Verificar que todas as 8 variáveis acima estão configuradas

---

## 🧪 TESTE RÁPIDO APÓS CONFIGURAR

```bash
# 1. Reiniciar servidor
pkill -f "next dev"
pnpm dev

# 2. Testar upload logo
curl -X POST "http://localhost:3000/api/branding/upload-logo" \
  -H "Content-Type: application/json" \
  -d '{"base64":"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR4nGMAAQAABQABDQottQAAAABJRU5ErkJggg=="}'

# Esperado: { "url": "...", "path": "..." }

# 3. Testar criar draft
curl -X POST "http://localhost:3000/api/branding/draft" \
  -H "Content-Type: application/json" \
  -d '{"fantasyName":"Teste","brandColor":"#a34900","ctaText":"Teste","ctaUrl":"https://wa.me/123"}'

# Esperado: { "ok": true, "id": "...", "draft": {...} }
```

---

**Última atualização:** 11 de janeiro de 2025

