# 🚨 AÇÃO IMEDIATA - VERIFICAR TABELA NO BANCO

**Problema:** Erro "Tenant or user not found" indica que a tabela pode não existir.

---

## ✅ VERIFICAÇÃO RÁPIDA

### No Supabase Dashboard:

1. **Acesse:** https://supabase.com/dashboard/project/qltixyfxxrbdnaldgtzr
2. **Table Editor** → Procure por `BrandingDraft`
3. **Se NÃO existir:**
   - SQL Editor → Cole e execute:
   ```sql
   CREATE TABLE IF NOT EXISTS "BrandingDraft" (
       "id" TEXT NOT NULL,
       "logoUrl" TEXT,
       "brandColor" TEXT,
       "accentColor" TEXT,
       "fantasyName" TEXT,
       "ctaText" TEXT,
       "ctaUrl" TEXT,
       "whatsapp" TEXT,
       "desiredDomain" TEXT,
       "expiresAt" TIMESTAMPTZ NOT NULL,
       "createdAt" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
       "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
       CONSTRAINT "BrandingDraft_pkey" PRIMARY KEY ("id")
   );
   
   CREATE INDEX IF NOT EXISTS "BrandingDraft_expiresAt_idx" ON "BrandingDraft"("expiresAt");
   CREATE INDEX IF NOT EXISTS "BrandingDraft_createdAt_idx" ON "BrandingDraft"("createdAt");
   ```

4. **Após criar:** Teste local novamente:
   ```bash
   curl -X POST "http://localhost:3000/api/branding/draft" \
     -H "Content-Type: application/json" \
     -d '{"fantasyName":"Teste","brandColor":"#10b981","accentColor":"#059669","ctaText":"Teste","ctaUrl":"https://wa.me/123"}'
   ```

---

**Depois de verificar, me avise e continuo a validação!**

