# 🧪 QA - Pré-Release Checklist

**Última atualização:** 11 de janeiro de 2025

---

## 🚀 Quick Start

### 1. Deploy

```bash
git add -A
git commit -m "B2B demo E2E: sandbox + branding + smoke + QA"
git push
vercel --prod
```

### 2. Smoke Tests (APIs)

```bash
# Substitua SEU_DOMINIO pelo domínio real
./scripts/smoke-production.sh https://SEU_DOMINIO
```

**Ou manualmente:**

```bash
# Upload logo
curl -sS -X POST "https://SEU_DOMINIO/api/branding/upload-logo" \
  -H "Content-Type: application/json" \
  -d '{"base64":"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR4nGMAAQAABQABDQottQAAAABJRU5ErkJggg=="}'

# Criar draft
curl -sS -X POST "https://SEU_DOMINIO/api/branding/draft" \
  -H "Content-Type: application/json" \
  -d '{"fantasyName":"Clínica QA","brandColor":"#10b981","accentColor":"#059669","ctaText":"Falar no WhatsApp","ctaUrl":"https://wa.me/5500000000000"}'

# Consultar draft (use o ID retornado)
curl -sS "https://SEU_DOMINIO/api/branding/draft?id=DRAFT_ID"
```

---

## ✅ Checklist Completo

### 📋 APIs (Smoke Tests)

- [ ] **Upload Logo** → `200` com `{ "url": "...", "path": "logos/..." }`
- [ ] **Criar Draft** → `201` com `{ ok: true, id, draft }`
- [ ] **Consultar Draft** → `200` com `{ draft: {...} }`

### 🎨 UI Visual (Mobile + Desktop)

#### Landing (`/`)
- [ ] Sem duplicação dos cards "4 min / 100+ / +37%"
- [ ] Números 1-2-3-4 bonitos e alinhados
- [ ] FAB "?" não colide com WhatsApp no mobile
- [ ] Navbar mostra "Aistotele" (não "AlloeHealth")

#### Wizard (`/b2b/configurar`)
- [ ] Upload da logo com preview
- [ ] Cores refletem no preview
- [ ] CTA com `wa.me/...` válido
- [ ] Salvar e abrir demo sem "Internal server error"
- [ ] Navbar não sobrepõe o conteúdo (padding OK)

#### Sandbox (`/b2b/sandbox?draft=DRAFT_ID`)
- [ ] Carrega nome/cores/logo do draft
- [ ] `sessionStorage['b2b_draft']` presente
- [ ] Botão "Testar triagem agora" navega

#### Triagem (slug free)
- [ ] Header com logo + cores do draft
- [ ] Fluxo completo até o fim
- [ ] Redireciona para relatório

#### Relatório (`/relatorio/{id}`)
- [ ] Branding aplicado (logo + cores)
- [ ] Conteúdo completo (sem placeholders)
- [ ] Botão "Baixar PDF" presente e funcional

#### PDF
- [ ] Download inicia corretamente
- [ ] Content-Type: `application/pdf`
- [ ] Tamanho > 20 KB
- [ ] Logo renderizado
- [ ] Cores aplicadas
- [ ] QR Code visível

---

## 🔍 Observabilidade

### Vercel

- [ ] Deploy anterior marcado como fallback (rollback 1-clique)
- [ ] Logs de funções sem erros:
  - Sem "Bucket not found"
  - Sem "Prisma undefined"
  - Sem "Cannot read properties"

### Supabase

- [ ] Bucket `branding-logos` existe e é público
- [ ] Arquivo em `logos/{uuid}.png` com Public URL acessível

### Prisma

```bash
pnpm prisma studio
```

- [ ] `BrandingDraft` com registro salvo
- [ ] `expiresAt` ~48h no futuro

---

## 🚨 Diagnóstico Rápido

### "Bucket not found"
```bash
# Verificar no Vercel
vercel env ls production | grep BRANDING_BUCKET
# Deve retornar: BRANDING_BUCKET=branding-logos
```

### 500 em `/api/branding/draft`
```bash
# Verificar conexão com banco
vercel env ls production | grep DATABASE_URL
# Verificar logs
vercel logs --follow
```

### Upload falha
```bash
# Verificar variáveis Supabase
vercel env ls production | grep SUPABASE
# Deve ter: SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY
```

### UI sobrepondo
- Verificar `pt-20 md:pt-24` no `RunnerLayout.tsx`
- Verificar CSS global aplicado

---

## 📊 Status Atual

| Área | Status | Observação |
|------|--------|------------|
| Build & Rotas | ✅ 100% | Compilação perfeita |
| Variáveis (Vercel) | ✅ 100% | Todas configuradas |
| Fluxo B2B | ⏸️ 95% | Requer validação final |
| APIs | ⏸️ 95% | Requer smoke em produção |
| UI/QA Visual | ⏸️ 95% | Requer checklist manual |
| Automação | ⏸️ 85% | Scripts criados |
| Observabilidade | ⏸️ 80% | Requer verificação final |

---

## 🎯 Meta: 92% → 100%

**Passos finais:**
1. ✅ Deploy executado
2. ⏸️ Smoke tests em produção
3. ⏸️ Fluxo manual completo
4. ⏸️ Checklist visual
5. ⏸️ Observabilidade verificada

**Tempo estimado:** 15-20 minutos

---

**Nota:** Este checklist deve ser executado antes de cada release. Use `./scripts/smoke-production.sh` para automatizar os testes de API.
