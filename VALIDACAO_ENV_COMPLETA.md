# ✅ VALIDAÇÃO COMPLETA DE VARIÁVEIS DE AMBIENTE

**Data:** 11 de janeiro de 2025  
**Status:** ⚠️ **AGUARDANDO SERVICE_ROLE_KEY**

---

## 📊 RESUMO DAS VARIÁVEIS

### Informações Fornecidas ✅

| Item | Valor | Status |
|------|-------|--------|
| **Project ID** | `qltixyfxxrbdnaldgtzr` | ✅ OK |
| **Database Password** | `DdVu8MWxAGTXUT3P` | ✅ OK |
| **Anon Key** | `eyJhbGc...` | ✅ OK |
| **Service Role Key** | ❌ **FALTANDO** | ⚠️ Precisa obter |

---

## 🔐 VARIÁVEIS CONSTRUÍDAS

### Para `.env.local` (Local)

```env
# SUPABASE
SUPABASE_URL=https://qltixyfxxrbdnaldgtzr.supabase.co
NEXT_PUBLIC_SUPABASE_URL=https://qltixyfxxrbdnaldgtzr.supabase.co
SUPABASE_SERVICE_ROLE_KEY=<OBTER_DO_DASHBOARD>
NEXT_PUBLIC_SUPABASE_ANON_KEY=<REDACTED_SUPABASE_ANON_JWT>

# DATABASE
DATABASE_URL=postgresql://your_user:your_password@your_host:5432/your_database
DIRECT_URL=postgresql://your_user:your_password@your_host:5432/your_database

# BRANDING
BRANDING_BUCKET=branding-logos

# TRIAGEM
NEXT_PUBLIC_FREE_TRIAGE_SLUG=gastro
```

### Para Vercel (Production)

**Mesmas variáveis acima, configurar no Vercel Dashboard.**

---

## ⚠️ AÇÃO NECESSÁRIA: OBTER SERVICE_ROLE_KEY

### Passo 1: Acessar Supabase Dashboard

**URL:** https://supabase.com/dashboard/project/qltixyfxxrbdnaldgtzr/settings/api-keys

### Passo 2: Obter a Chave

**Opção A - Legacy API Keys (Recomendado):**
1. Aba "Legacy API Keys"
2. Seção "Service Role (Secret) Key"
3. Clique no ícone de "olho" 👁️ para revelar
4. Clique em "Copy" para copiar

**Opção B - API Keys (Novo):**
1. Aba "API Keys"
2. Seção "Secret keys"
3. Clique no ícone de "olho" 👁️ na linha `default`
4. Clique em "Copy"

### Passo 3: Adicionar ao .env.local

```env
SUPABASE_SERVICE_ROLE_KEY=<valor_copiado>
```

### Passo 4: Adicionar ao Vercel

Vercel Dashboard → Settings → Environment Variables → Adicionar `SUPABASE_SERVICE_ROLE_KEY`

---

## ✅ SCRIPT DE VALIDAÇÃO

Após configurar todas as variáveis, execute:

```bash
# 1. Validar .env.local
echo "=== VALIDAÇÃO .env.local ==="
cat .env.local | grep -E "^(SUPABASE|DATABASE|BRANDING)" | while read line; do
  var=$(echo "$line" | cut -d'=' -f1)
  val=$(echo "$line" | cut -d'=' -f2-)
  if [ -z "$val" ] || [ "$val" = "<OBTER_DO_DASHBOARD>" ] || [ "$val" = "<PREENCHER_COM_SERVICE_ROLE_KEY>" ]; then
    echo "❌ $var: NÃO CONFIGURADO"
  else
    echo "✅ $var: OK"
  fi
done

# 2. Reiniciar servidor
pkill -f "next dev"
pnpm dev &

# 3. Aguardar servidor iniciar
sleep 5

# 4. Testar APIs
echo -e "\n=== TESTE DE APIs ==="

# Upload Logo
echo "Testando upload-logo..."
UPLOAD_RESP=$(curl -s -X POST "http://localhost:3000/api/branding/upload-logo" \
  -H "Content-Type: application/json" \
  -d '{"base64":"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR4nGMAAQAABQABDQottQAAAABJRU5ErkJggg=="}')

if echo "$UPLOAD_RESP" | grep -q "url"; then
  echo "✅ Upload Logo: OK"
else
  echo "❌ Upload Logo: FALHOU"
  echo "Resposta: $UPLOAD_RESP"
fi

# Criar Draft
echo "Testando draft..."
DRAFT_RESP=$(curl -s -X POST "http://localhost:3000/api/branding/draft" \
  -H "Content-Type: application/json" \
  -d '{"fantasyName":"Teste Validação","brandColor":"#a34900","ctaText":"Teste","ctaUrl":"https://wa.me/123"}')

if echo "$DRAFT_RESP" | grep -q "ok.*true"; then
  echo "✅ Criar Draft: OK"
  DRAFT_ID=$(echo "$DRAFT_RESP" | grep -o '"id":"[^"]*"' | cut -d'"' -f4)
  echo "   Draft ID: $DRAFT_ID"
else
  echo "❌ Criar Draft: FALHOU"
  echo "Resposta: $DRAFT_RESP"
fi
```

---

## 📋 CHECKLIST FINAL

### Local (.env.local)

- [ ] `SUPABASE_URL` configurado
- [ ] `NEXT_PUBLIC_SUPABASE_URL` configurado
- [ ] `SUPABASE_SERVICE_ROLE_KEY` configurado (obter do dashboard)
- [ ] `NEXT_PUBLIC_SUPABASE_ANON_KEY` configurado
- [ ] `DATABASE_URL` configurado
- [ ] `DIRECT_URL` configurado
- [ ] `BRANDING_BUCKET` configurado
- [ ] `NEXT_PUBLIC_FREE_TRIAGE_SLUG` configurado

### Vercel (Production)

- [ ] Todas as 8 variáveis acima configuradas
- [ ] Todas marcadas para Production, Preview e Development
- [ ] Redeploy executado após adicionar variáveis

---

## 🧪 TESTE RÁPIDO APÓS CONFIGURAR

```bash
# 1. Parar servidor atual
pkill -f "next dev"

# 2. Iniciar servidor
pnpm dev

# 3. Em outro terminal, testar:
curl -X POST "http://localhost:3000/api/branding/upload-logo" \
  -H "Content-Type: application/json" \
  -d '{"base64":"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR4nGMAAQAABQABDQottQAAAABJRU5ErkJggg=="}'

# Esperado: { "url": "https://...", "path": "logos/..." }
```

---

## ⚠️ OBSERVAÇÕES IMPORTANTES

1. **Service Role Key é SECRETO:**
   - Nunca commitar no git
   - Nunca expor no client-side
   - Apenas em `.env.local` e Vercel (server-side)

2. **Database Password:**
   - ✅ Já fornecido: `DdVu8MWxAGTXUT3P`
   - ✅ Já incluído nas URLs de conexão

3. **Project ID:**
   - ✅ Confirmado: `qltixyfxxrbdnaldgtzr`
   - ✅ Usado em todas as URLs

---

**Última atualização:** 11 de janeiro de 2025

