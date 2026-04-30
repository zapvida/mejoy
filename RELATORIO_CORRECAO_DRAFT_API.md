# 🔧 RELATÓRIO - CORREÇÃO API DRAFT

**Data:** 11 de janeiro de 2025  
**Problema:** API `/api/branding/draft` retornando "Internal server error"  
**Status:** ✅ **CORRIGIDO**

---

## 🐛 PROBLEMA IDENTIFICADO

### Sintoma
```json
{
  "error": "Internal server error"
}
```

### Causa Raiz
**Incompatibilidade entre campos do schema Prisma e código da API:**

- ❌ Código usava: `fantasyName`, `brandColor`, `accentColor`, `desiredDomain`
- ✅ Schema Prisma tem: `name`, `primaryColor`, `secondaryColor`, `domain`

Além disso, o código tentava usar campos que não existem no schema:
- `whatsapp` (não existe no `BrandingDraft`)
- `updatedAt` (não existe no `BrandingDraft`)

---

## ✅ CORREÇÃO APLICADA

### Mudanças no `src/pages/api/branding/draft.ts`

#### 1. POST - Mapeamento Correto
```typescript
// ANTES (❌ Errado)
draft = await prisma.brandingDraft.create({
  data: {
    fantasyName: body.fantasyName,  // ❌ Campo não existe
    brandColor: body.brandColor,    // ❌ Campo não existe
    desiredDomain: body.desiredDomain, // ❌ Campo não existe
  }
});

// DEPOIS (✅ Correto)
draft = await prisma.brandingDraft.create({
  data: {
    name: body.fantasyName,           // ✅ Campo correto
    primaryColor: body.brandColor,    // ✅ Campo correto
    secondaryColor: body.accentColor,  // ✅ Campo correto
    domain: body.desiredDomain ?? null, // ✅ Campo correto
  }
});
```

#### 2. Resposta - Mapeamento Reverso
```typescript
// Mapear campos do banco para formato esperado pelo frontend
const draftResponse = {
  id: draft.id,
  fantasyName: draft.name,           // ✅ Mapeia name → fantasyName
  brandColor: draft.primaryColor,    // ✅ Mapeia primaryColor → brandColor
  accentColor: draft.secondaryColor, // ✅ Mapeia secondaryColor → accentColor
  logoUrl: draft.logoUrl,
  ctaText: draft.ctaText,
  ctaUrl: draft.ctaUrl,
  desiredDomain: draft.domain,       // ✅ Mapeia domain → desiredDomain
  expiresAt: draft.expiresAt,
};
```

#### 3. GET - Mapeamento Aplicado
Aplicado o mesmo mapeamento na resposta do GET para manter consistência.

---

## 📋 CAMPOS DO SCHEMA PRISMA

```prisma
model BrandingDraft {
  id            String   @id @default(uuid())
  name          String?  // ✅ Mapeia para fantasyName no frontend
  primaryColor  String?  // ✅ Mapeia para brandColor no frontend
  secondaryColor String? // ✅ Mapeia para accentColor no frontend
  logoUrl       String?
  ctaText       String?
  ctaUrl        String?
  domain        String?  // ✅ Mapeia para desiredDomain no frontend
  expiresAt     DateTime
  createdAt     DateTime @default(now())
}
```

---

## 🧪 TESTE APÓS CORREÇÃO

### Upload Logo
```bash
curl -sS -X POST "https://aistotele.com/api/branding/upload-logo" \
  -H "Content-Type: application/json" \
  -d '{"base64":"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR4nGMAAQAABQABDQottQAAAABJRU5ErkJggg=="}'
```

**Esperado:** ✅ `200` com `{ "url": "...", "path": "logos/..." }`

### Criar Draft
```bash
curl -sS -X POST "https://aistotele.com/api/branding/draft" \
  -H "Content-Type: application/json" \
  -d '{"fantasyName":"Clínica QA","brandColor":"#10b981","accentColor":"#059669","ctaText":"Falar no WhatsApp","ctaUrl":"https://wa.me/5500000000000"}'
```

**Esperado:** ✅ `201` com `{ ok: true, id: "...", draft: {...} }`

---

## ✅ STATUS FINAL

- ✅ Upload Logo: Funcionando
- ✅ Criar Draft: **CORRIGIDO** (aguardando deploy)
- ⏸️ Consultar Draft: Aguardando teste

---

**Próximo passo:** Após deploy, executar smoke tests novamente.

