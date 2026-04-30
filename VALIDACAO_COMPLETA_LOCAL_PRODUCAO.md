# ✅ VALIDAÇÃO COMPLETA - LOCAL E PRODUÇÃO

**Data:** 11 de janeiro de 2025  
**Status:** ✅ **VALIDANDO LOCAL PRIMEIRO**

---

## 🎯 ESTRATÉGIA: VALIDAR LOCAL → DEPOIS PRODUÇÃO

### Por que validar local primeiro?
1. ✅ Erros aparecem imediatamente nos logs
2. ✅ Pode corrigir antes de fazer deploy
3. ✅ Evita loop de deploys
4. ✅ Testa com dados reais do banco

---

## ✅ CORREÇÕES APLICADAS

### 1. Model BrandingDraft no Schema Prisma ✅
**Problema:** Model não existia no `schema.prisma`

**Solução:**
```prisma
model BrandingDraft {
  id            String   @id @default(uuid())
  logoUrl       String?
  brandColor    String?
  accentColor   String?
  fantasyName   String?
  ctaText       String?
  ctaUrl        String?
  whatsapp      String?
  desiredDomain String?
  expiresAt     DateTime
  createdAt     DateTime @default(now()) @map("createdAt")
  updatedAt     DateTime @default(now()) @updatedAt @map("updatedAt")

  @@index([expiresAt])
  @@index([createdAt])
  @@map("BrandingDraft")
}
```

### 2. DIRECT_URL no Schema Prisma ✅
**Problema:** Pooler (pgbouncer) não permite certas operações

**Solução:**
```prisma
datasource db {
  provider  = "postgresql"
  url       = env("DATABASE_URL")      // Pooler (leitura)
  directUrl = env("DIRECT_URL")        // Conexão direta (escrita)
}
```

### 3. Campos Corretos no Código ✅
**Problema:** Código usava campos do schema Prisma, mas banco usa campos da migration SQL

**Solução:** Usar campos exatos do banco:
- `brandColor` (não `primaryColor`)
- `fantasyName` (não `name`)
- `desiredDomain` (não `domain`)

---

## 🧪 TESTE LOCAL (EM ANDAMENTO)

### Passo 1: Configurar .env.local
```bash
# Adicionar se não existir
DIRECT_URL=postgresql://postgres:DdVu8MWxAGTXUT3P@db.qltixyfxxrbdnaldgtzr.supabase.co:5432/postgres
```

### Passo 2: Gerar Prisma Client
```bash
npx prisma generate
```

### Passo 3: Testar API Local
```bash
curl -X POST "http://localhost:3000/api/branding/draft" \
  -H "Content-Type: application/json" \
  -d '{"fantasyName":"Teste Local","brandColor":"#10b981","accentColor":"#059669","ctaText":"Teste","ctaUrl":"https://wa.me/123"}'
```

**Esperado:** `201` com `{ ok: true, id: "...", draft: {...} }`

---

## 🚀 TESTE PRODUÇÃO (APÓS VALIDAR LOCAL)

### Passo 1: Deploy
```bash
git add -A
git commit -m "fix: BrandingDraft schema + DIRECT_URL"
git push
vercel --prod
```

### Passo 2: Smoke Tests
```bash
./scripts/smoke-production.sh https://aistotele.com
```

**Esperado:** Todos os testes passando ✅

---

## 📋 CHECKLIST

### Local
- [ ] Model BrandingDraft no schema.prisma
- [ ] DIRECT_URL configurado no .env.local
- [ ] Prisma Client regenerado
- [ ] API testada localmente
- [ ] Teste passou com sucesso

### Produção
- [ ] Deploy executado
- [ ] Smoke tests passando
- [ ] Fluxo completo validado

---

**Última atualização:** 11 de janeiro de 2025

