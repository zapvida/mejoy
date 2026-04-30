# 🚀 GUIA DE DEPLOY FINAL - PASSO A PASSO

**Data:** 11 de janeiro de 2025  
**Status:** ✅ **Código pronto para deploy**

---

## 📋 CHECKLIST PRÉ-DEPLOY

### 1. ✅ Variáveis de Ambiente no Vercel (Production)

**Vercel Dashboard → Project Settings → Environment Variables → Production**

Confirme estas 8 variáveis estão em **Production** (não só Preview):

- [ ] `SUPABASE_URL` (mesmo valor do NEXT_PUBLIC_SUPABASE_URL)
- [ ] `NEXT_PUBLIC_SUPABASE_URL`
- [ ] `SUPABASE_SERVICE_ROLE_KEY`
- [ ] `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- [ ] `DATABASE_URL` (pooler do Supabase)
- [ ] `DIRECT_URL` (sem pooler, porta 5432)
- [ ] `BRANDING_BUCKET=branding-logos`
- [ ] `NEXT_PUBLIC_FREE_TRIAGE_SLUG=gastro`

**💡 Dica:** Se ajustar algo, faça redeploy após.

---

### 2. ✅ Supabase Storage

**Supabase Dashboard → Storage:**

- [ ] Bucket `branding-logos` existe?
- [ ] Se não: criar, marcar como **Public**
- [ ] Permitir tipos: `png`, `jpg`, `jpeg`, `svg`, `webp`

**💡 Nosso endpoint tenta criar automaticamente, mas é melhor garantir manualmente.**

---

## 🚀 DEPLOY

```bash
git add -A
git commit -m "fix(b2b): prisma generate + envs + draft api hardened"
git push
vercel --prod
```

**O `postinstall: prisma generate` garante que o Prisma Client em produção reconheça `brandingDraft`.**

---

## 🧪 TESTES PÓS-DEPLOY

### Opção 1: Script Automático (Recomendado)

```bash
./scripts/smoke-production-final.sh https://aistotele.com
```

### Opção 2: Testes Manuais (Curls)

#### 4.1 Upload de Logo
```bash
curl -sS -X POST "https://aistotele.com/api/branding/upload-logo" \
  -H "Content-Type: application/json" \
  -d '{"base64":"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR4nGMAAQAABQABDQottQAAAABJRU5ErkJggg=="}'
```
**Esperado:** `200` com `{"url":"...","path":"..."}`

#### 4.2 Criar Draft (201)
```bash
curl -sS -X POST "https://aistotele.com/api/branding/draft" \
  -H "Content-Type: application/json" \
  -d '{"fantasyName":"Clínica QA","brandColor":"#10b981","accentColor":"#059669","ctaText":"Falar no WhatsApp","ctaUrl":"https://wa.me/5599999999999"}'
```
**Esperado:** `201` com `{ ok:true, id:"...", draft:{...} }`  
**💡 Guarde o `id` para o próximo teste**

#### 4.3 Atualizar Draft por Domínio (200)
```bash
curl -sS -X POST "https://aistotele.com/api/branding/draft" \
  -H "Content-Type: application/json" \
  -d '{"fantasyName":"Clínica QA Atualizada","brandColor":"#10b981","accentColor":"#059669","desiredDomain":"aimed.com.br","ctaText":"Falar no WhatsApp","ctaUrl":"https://wa.me/5599999999999"}'
```
**Esperado:** `200` com `{ ok:true, id:"...", draft:{...} }`

#### 4.4 Consultar Draft (GET)
```bash
curl -sS "https://aistotele.com/api/branding/draft?id=<ID_DO_PASSO_4.2>"
```
**Esperado:** `200` com `{ draft:{...} }`

**✅ Se os 4 passaram, infra está ok!**

---

## 🎯 FLUXO REAL (UI) - 2 minutos

1. Abra `https://aistotele.com/b2b/configurar`
2. Faça upload de qualquer logo, escolha cores, preencha CTA/WhatsApp e salve
3. Ao salvar, deve ir para `.../b2b/sandbox?draft=...`:
   - Ver se logo + cores aparecem
   - Botão "Testar triagem personalizada" → ir para `.../triagem/gastro`
4. Complete a triagem (qualquer resposta)
5. Deve abrir o relatório com branding (logo + cores)
6. Clique "Baixar PDF" e valide que baixa (≥20KB, Content-Type `application/pdf`, logo no cabeçalho)

**✅ Se isso tudo passa, experiência do cliente está pronta!**

---

## ✅ DEFINITION OF DONE

- [ ] Variáveis Production confirmadas na Vercel
- [ ] Bucket `branding-logos` público no Supabase
- [ ] `vercel --prod` concluído sem erros
- [ ] 4 cURLs acima retornam os status esperados
- [ ] Fluxo UI Wizard → Sandbox → Triagem → Relatório → PDF ok

---

## 🆘 ROLLBACK (SE NECESSÁRIO)

Se algum passo falhar em produção, você pode promover o deploy anterior no Vercel em 1 clique (rollback seguro):

1. Vercel Dashboard → Deployments
2. Clique nos 3 pontos do deploy anterior
3. "Promote to Production"

---

## 📊 STATUS ATUAL

**Código:** ✅ Pronto (92-95% do lançamento perfeito)  
**Falta:** Variáveis + Bucket + Deploy + Testes

**Com os passos acima, esses 92-95% viram 100%! 🎉**

