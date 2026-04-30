# ✅ CHECKLIST DEPLOY FINAL

**Data:** 11 de janeiro de 2025  
**Status:** 🚀 **Pronto para deploy**

---

## ✅ CORREÇÕES APLICADAS

1. ✅ **`postinstall: prisma generate`** adicionado ao `package.json`
2. ✅ **API `draft.ts` refatorada** com `safeParse` e melhor tratamento de erros
3. ✅ **Status codes padronizados**: 201 para create, 200 para update
4. ✅ **Validação de campos obrigatórios** melhorada

---

## 📋 CHECKLIST PRÉ-DEPLOY

### 1. Variáveis de Ambiente no Vercel (Production)

Verifique no Vercel Dashboard → Project Settings → Environment Variables → **Production**:

- [ ] `SUPABASE_URL` (mesmo valor do NEXT_PUBLIC_SUPABASE_URL)
- [ ] `NEXT_PUBLIC_SUPABASE_URL`
- [ ] `SUPABASE_SERVICE_ROLE_KEY`
- [ ] `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- [ ] `DATABASE_URL` (pooler)
- [ ] `DIRECT_URL` (sem pooler, porta 5432)
- [ ] `BRANDING_BUCKET=branding-logos`
- [ ] `NEXT_PUBLIC_FREE_TRIAGE_SLUG=gastro`

### 2. Supabase Storage

No Supabase Dashboard → Storage:

- [ ] Bucket `branding-logos` existe
- [ ] Bucket marcado como **Public**
- [ ] Tipos permitidos: `png`, `jpg`, `jpeg`, `svg`, `webp`

### 3. Banco de Dados

- [ ] Tabela `BrandingDraft` criada no Supabase (você já fez ✅)

---

## 🚀 DEPLOY

```bash
git add -A
git commit -m "fix(b2b): envs + prisma generate + bucket + draft api hardened"
git push
vercel --prod
```

---

## 🧪 TESTES PÓS-DEPLOY (Produção)

### 1. Upload de Logo
```bash
curl -sS -X POST "https://aistotele.com/api/branding/upload-logo" \
  -H "Content-Type: application/json" \
  -d '{"base64":"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAAB..."}'
```
**Esperado:** `200` com `{ url, path }`

### 2. Criar Draft (201)
```bash
curl -sS -X POST "https://aistotele.com/api/branding/draft" \
  -H "Content-Type: application/json" \
  -d '{"fantasyName":"Clínica Teste","brandColor":"#10b981","ctaText":"Falar no WhatsApp","ctaUrl":"https://wa.me/5599999999999"}'
```
**Esperado:** `201` com `{ ok:true, id: "...", draft: {...} }`

### 3. Atualizar Draft por Domínio (200)
```bash
curl -sS -X POST "https://aistotele.com/api/branding/draft" \
  -H "Content-Type: application/json" \
  -d '{"fantasyName":"Clínica Teste","brandColor":"#10b981","desiredDomain":"aimed.com.br","ctaText":"Teste","ctaUrl":"https://wa.me/123"}'
```
**Esperado:** `200` com `{ ok:true, id: "...", draft: {...} }`

### 4. GET Draft
```bash
curl -sS "https://aistotele.com/api/branding/draft?id=<ID_DO_PASSO_2>"
```
**Esperado:** `200` com `{ draft: {...} }`

### 5. Fluxo UX Manual
- [ ] `/b2b/configurar` → salva → redireciona `sandbox?draft={id}`
- [ ] Sandbox carrega logo/cores → botão "Testar Triagem"
- [ ] Triagem (slug free) completa → Relatório → PDF baixa

---

## ✅ GO/NO-GO

**GO** quando:
1. ✅ Envs confirmadas na Vercel (Production)
2. ✅ `postinstall: prisma generate` habilitado
3. ✅ Bucket `branding-logos` público

**Depois do deploy:**
- Rodar os 4 curls acima
- Fazer clique-teste Wizard → Sandbox → Triagem → Relatório → PDF

---

**Última atualização:** 11 de janeiro de 2025

