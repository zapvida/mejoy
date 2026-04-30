# ✅ LOTE H + I IMPLEMENTADO

**Data:** 4 de novembro de 2025  
**Status:** ✅ Código implementado | ⚠️ Migração pendente

---

## 📋 RESUMO

Implementação completa dos Lotes H e I:
- **Lote H**: Wizard de personalização (`/b2b/configurar`) com preview em tempo real
- **Lote I**: Provisionamento automático de tenants após checkout Stripe

---

## 🎯 LOTE H: WIZARD DE PERSONALIZAÇÃO

### Arquivos Criados

1. **`src/pages/b2b/configurar.tsx`** ✅
   - Wizard completo com upload de logo
   - Seletor de cores (primária + secundária)
   - Campos: nome fantasia, CTA, WhatsApp, domínio
   - Preview em tempo real usando CSS vars
   - Botão "Continuar" → redireciona para `/b2b/assinar?draft={id}`

2. **`src/pages/api/branding/draft.ts`** ✅
   - POST: Criar/atualizar draft
   - GET: Buscar draft por ID
   - Validação com Zod
   - Expiração automática (7 dias)

3. **`src/pages/api/branding/upload-logo.ts`** ✅
   - Upload de logo via base64
   - Validação de tipo e tamanho (máx 5MB)
   - Armazenamento no Supabase Storage
   - Retorna URL pública

### Banco de Dados

**Modelo `BrandingDraft`** adicionado ao `prisma/schema.prisma`:
- `id`, `logoUrl`, `brandColor`, `accentColor`
- `fantasyName`, `ctaText`, `ctaUrl`, `whatsapp`, `desiredDomain`
- `expiresAt`, `createdAt`, `updatedAt`
- Índices em `expiresAt` e `createdAt`

---

## 🎯 LOTE I: PROVISIONAMENTO AUTOMÁTICO

### Arquivos Criados

1. **`src/lib/stripe/provision.ts`** ✅
   - Função `provisionTenantFromSession()`
   - Busca draft por ID do metadata
   - Gera slug único baseado no nome fantasia
   - Cria tenant com todas as configurações
   - Gera URL provisória: `{slug}.aistotele.app`
   - Logging completo

2. **`src/pages/b2b/dominio.tsx`** ✅
   - Página para verificar/configurar domínio customizado
   - Verificação de CNAME (estrutura pronta)
   - Botões: "Verificar" e "Aplicar domínio"

3. **`src/pages/api/b2b/check-domain.ts`** ✅
   - Verifica status do CNAME
   - Retorna instruções de configuração

4. **`src/pages/api/b2b/apply-domain.ts`** ✅
   - Aplica domínio customizado ao tenant
   - Atualiza registro no banco

### Arquivos Modificados

1. **`src/lib/stripe/handlers.ts`** ✅
   - `handleCheckoutCompleted()` modificado
   - Detecta `draft_id` no metadata
   - Chama `provisionTenantFromSession()` se tiver draft
   - Envia WhatsApp com URL provisória
   - Early return para checkout B2B

2. **`src/pages/api/stripe/create-checkout-session.ts`** ✅
   - Captura `draft_id` do body/query
   - Inclui `draft_id` no metadata do Stripe
   - Logging para debug

3. **`src/pages/b2b/assinar.tsx`** ✅
   - Integrado com `draft_id` da query
   - Redireciona para `/pricing?draft={id}` após salvar
   - Integrado com API `/api/b2b/lead`

4. **`src/components/b2b/B2BLanding.tsx`** ✅
   - CTA principal alterado para "Personalizar agora (grátis)"
   - Link para `/b2b/configurar`

5. **`src/pages/api/b2b/lead.ts`** ✅ (NOVO)
   - Salva lead B2B no GHL
   - Cria oportunidade no pipeline
   - Captura UTMs

### Banco de Dados

**Modelo `Tenant`** adicionado ao `prisma/schema.prisma`:
- `id`, `slug` (único), `name`, `domain` (único)
- `provisionalUrl`, `logoUrl`, `brandColor`, `accentColor`
- `ctaText`, `ctaUrl`, `status`
- `ownerEmail`, `ownerName`, `ownerPhone`
- `stripeCustomerId`, `stripeSubscriptionId`
- Índices em `ownerEmail`, `status`, `slug`, `createdAt`

---

## 🔄 FLUXO COMPLETO

```
1. Empresário acessa aistotele.com
   ↓
2. Clica "Personalizar agora (grátis)" → /b2b/configurar
   ↓
3. Faz upload de logo, escolhe cores, preenche dados
   ↓
4. Clica "Continuar" → /b2b/assinar?draft={id}
   ↓
5. Preenche formulário → salva no GHL
   ↓
6. Redireciona para /pricing?draft={id}
   ↓
7. Faz checkout Stripe (com draft_id no metadata)
   ↓
8. Webhook Stripe → provisionTenantFromSession()
   ↓
9. Tenant criado automaticamente
   ↓
10. URL provisória: {slug}.aistotele.app
   ↓
11. WhatsApp enviado com URL provisória
```

---

## ⚠️ PRÓXIMOS PASSOS

### 1. Migração do Banco de Dados (URGENTE)

```bash
# Executar quando tiver DATABASE_URL configurada
npx prisma migrate dev --name add_branding_draft_and_tenant
npx prisma generate
```

### 2. Configurar Supabase Storage

Criar bucket `public` no Supabase Storage com:
- Política pública para leitura
- Política de upload (autenticada ou anônima conforme necessário)

### 3. Configurar Domínio Provisório

Configurar DNS wildcard para `*.aistotele.app` apontando para Vercel.

### 4. Testar Fluxo Completo

1. Acessar `/b2b/configurar`
2. Fazer upload de logo
3. Preencher dados
4. Salvar draft
5. Fazer checkout (modo teste Stripe)
6. Verificar tenant criado
7. Acessar URL provisória

### 5. Melhorias Futuras

- [ ] Email de boas-vindas após provisionamento
- [ ] Dashboard do parceiro (`/b2b/dashboard`)
- [ ] Verificação real de CNAME (usar serviço de DNS)
- [ ] Kit de campanhas (Lote J)

---

## 📊 ARQUIVOS CRIADOS/MODIFICADOS

### Criados (11 arquivos)
- `src/pages/b2b/configurar.tsx`
- `src/pages/api/branding/draft.ts`
- `src/pages/api/branding/upload-logo.ts`
- `src/pages/api/b2b/lead.ts`
- `src/pages/api/b2b/check-domain.ts`
- `src/pages/api/b2b/apply-domain.ts`
- `src/pages/b2b/dominio.tsx`
- `src/lib/stripe/provision.ts`
- `prisma/schema.prisma` (modelos adicionados)

### Modificados (5 arquivos)
- `src/lib/stripe/handlers.ts`
- `src/pages/api/stripe/create-checkout-session.ts`
- `src/pages/b2b/assinar.tsx`
- `src/components/b2b/B2BLanding.tsx`

---

## ✅ CHECKLIST DE VALIDAÇÃO

- [x] Schema Prisma atualizado
- [x] APIs criadas
- [x] Páginas criadas
- [x] Integração com Stripe
- [x] Integração com GHL
- [ ] Migração executada
- [ ] Supabase Storage configurado
- [ ] DNS wildcard configurado
- [ ] Teste end-to-end realizado

---

## 🚀 STATUS

**Código:** ✅ 100% implementado  
**Migração:** ⚠️ Pendente (requer DATABASE_URL)  
**Testes:** ⚠️ Pendente

**Próxima ação:** Executar migração e testar fluxo completo.

