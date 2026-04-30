# 🚀 LAUNCH NOTES — OPERAÇÃO PÓS-DEPLOY

**Data:** 2025-11-05  
**Versão:** 1.0.0 (Produção)

---

## 1. WILDCARD DNS

### Status Atual
- ✅ `*.aistotele.com` está verde no Vercel
- ✅ Wildcard ativo e pronto para `{slug}.aistotele.com`

### Como Verificar
```bash
# No Vercel Dashboard
Settings → Domains → *.aistotele.com (deve estar verde)

# Teste rápido
curl -I https://teste.aistotele.com
# Deve retornar 200 (ou 404 se rota não existir, mas não erro DNS)
```

### Atenção
Se você usa e-mail fora do Vercel, garanta que os MX/SPF/DKIM estejam recriados no Vercel DNS.

---

## 2. STRIPE PRICING IDs (LIVE)

### IDs Configurados (Vercel)
Todos os seguintes estão presentes nas variáveis de ambiente:

| Variável | Uso |
|----------|-----|
| `STRIPE_PRICE_PLUS_MONTHLY` | Plano Plus mensal |
| `STRIPE_PRICE_PLUS_YEARLY` | Plano Plus anual |
| `STRIPE_PRICE_GIFT_MONTHLY` | Gift mensal |
| `STRIPE_PRICE_GIFT_YEARLY` | Gift anual |
| `STRIPE_PRICE_ADDON_MONTHLY` | Assentos extras (mensal) |
| `STRIPE_PRICE_ADDON_YEARLY` | Assentos extras (anual) |

### Verificar IDs
```bash
# No Stripe Dashboard
Products → Verificar que todos os prices estão criados
# IDs devem corresponder às variáveis no Vercel
```

### Como Criar Novos IDs (se necessário)
1. Stripe Dashboard → Products → Create product
2. Configurar preço (mensal/anual)
3. Copiar Price ID (começa com `price_...`)
4. Adicionar no Vercel como variável de ambiente

---

## 3. BRANDING DRAFT (Como Refazer)

### Fluxo Completo
1. **Usuário acessa:** `/b2b/configurar`
2. **Step 1:** Logo & Nome
   - Upload logo (suporta ObjectURL local)
   - Nome da clínica
3. **Step 2:** Cores
   - Swatches curados ou hex livre
   - Preview ao vivo
4. **Step 3:** CTA
   - Texto do botão
   - URL (WhatsApp ou qualquer HTTPS)
5. **Step 4:** Revisão
   - Salva draft via `/api/branding/draft` POST
   - Retorna `{ id, draft }`
   - Draft expira em 48h

### API Endpoints

#### Criar Draft
```bash
POST /api/branding/draft
Content-Type: application/json

{
  "logoUrl": "https://...",
  "brandColor": "#10b981",
  "accentColor": "#34d399",
  "fantasyName": "Clínica Exemplo",
  "ctaText": "Falar com médico",
  "ctaUrl": "https://wa.me/5511999999999",
  "whatsapp": "11999999999",
  "desiredDomain": "clinicaexemplo.com.br"
}

Response: 201 { id: "uuid", draft: {...} }
```

#### Recuperar Draft
```bash
GET /api/branding/draft?id={draft_id}

Response: 200 { draft: {...} }
Response: 404 (não encontrado)
Response: 410 (expirado)
```

### Persistência
- Store Zustand (`b2bBranding.ts`) persiste no localStorage
- Draft no banco expira em 48h (campo `expiresAt`)

---

## 4. SANDBOX (Como Ver)

### Acesso
- **URL:** `https://www.aistotele.com/b2b/sandbox`
- **Função:** Demonstração do white-label

### Como Funciona
1. Usa o mesmo tema CSS (`btn-brand`, `text-ink`, etc.)
2. Inclui Navbar para consistência
3. Botão CTA aponta para `/b2b/assinar`

### Testar
```bash
# Acessar
open https://www.aistotele.com/b2b/sandbox

# Verificar preview
# Deve mostrar layout consistente com o resto do site B2B
```

---

## 5. STRIPE CHECKOUT (Modo Teste)

### Como Abrir Checkout em Teste

#### Opção 1: Via API
```bash
POST /api/stripe/create-checkout-session
Content-Type: application/json

{
  "plan": "plus",
  "period": "monthly"
}

Response: 200 { id: "cs_...", url: "https://checkout.stripe.com/..." }
```

#### Opção 2: Via Página
1. Acessar `/b2b/assinar`
2. Preencher formulário
3. Clicar em "Assinar"
4. Redireciona para Stripe Checkout

### Verificar Modo
- **Teste:** Use `STRIPE_SECRET_KEY` com `sk_test_...`
- **Live:** Use `STRIPE_SECRET_KEY` com `sk_live_...`

### Metadata Capturado
- `plan`, `period`, `variant`
- `tenant` (ID do tenant)
- `draft_id` (se veio do wizard)
- `source` (`lp_b2b` se tem draft_id, `pricing` caso contrário)
- UTMs completos (`utm_source`, `utm_medium`, etc.)

---

## 6. MIGRAÇÕES DO BANCO

### Status
- ✅ Migração `20241104_add_branding_draft_and_tenant` aplicada
- ✅ Tabelas `BrandingDraft` e `Tenant` criadas

### Aplicar Manualmente (se necessário)
```sql
-- Executar no Supabase SQL Editor
-- Arquivo: prisma/migrations/20241104_add_branding_draft_and_tenant/migration.sql
```

### Verificar
```bash
# Via Prisma Studio (local)
npx prisma studio

# Verificar tabelas
# BrandingDraft
# Tenant
```

---

## 7. SMOKE TESTS (Produção)

### Script Criado
```bash
# Executar smoke test completo
BASE_URL=https://www.aistotele.com bash scripts/test-all-production.sh
```

### Testes Incluídos
- ✅ 4 rotas do runner (200)
- ✅ `/api/branding/draft` POST (201)
- ✅ `/api/b2b/lead` POST (200)
- ✅ `/api/stripe/create-checkout-session` POST (200)

### Validação Manual Rápida
```bash
BASE=https://www.aistotele.com

# Rotas do runner
curl -I $BASE/b2b/configurar | head -n1
curl -I $BASE/b2b/configurar/cores | head -n1
curl -I $BASE/b2b/configurar/cta | head -n1
curl -I $BASE/b2b/configurar/revisao | head -n1

# API Draft
curl -s -X POST -H "Content-Type: application/json" \
  -d '{"brandColor":"#10b981","accentColor":"#34d399","fantasyName":"Clínica Teste","ctaText":"Falar com médico","ctaUrl":"https://wa.me/5599999999999"}' \
  $BASE/api/branding/draft

# API Stripe
curl -s -X POST -H "Content-Type: application/json" \
  -d '{"plan":"plus","period":"monthly"}' \
  $BASE/api/stripe/create-checkout-session
```

---

## 8. ROLLBACK (Se Necessário)

### Visual "Neutro"
```bash
# No Vercel Dashboard
Settings → Environment Variables
NEXT_PUBLIC_LPAC_VIBRANT = 0

# Redeploy
vercel --prod
```

### Build Anterior
```bash
# No Vercel Dashboard
Deployments → Selecionar deployment anterior → Promote to Production
```

---

## 9. MONITORAMENTO

### Logs
- **Vercel:** https://vercel.com/dashboard → Logs
- **Filtrar por:** `/api/branding/draft`, `/api/stripe/create-checkout-session`

### Métricas
- **Stripe Dashboard:** Verificar sessões de checkout criadas
- **Supabase:** Verificar registros em `BrandingDraft` e `Tenant`

### Alertas
- Monitorar erros 500 nas APIs
- Verificar timeout em migrações (postbuild)
- Checar rate limits (10 req/min por IP)

---

## 10. PRÓXIMOS PASSOS

1. ✅ Deploy: `vercel --prod`
2. ✅ Smoke tests em produção
3. ✅ Validar fluxo completo B2B end-to-end
4. ✅ Monitorar primeiras 24h
5. ✅ Ajustes finos se necessário

---

## 📞 SUPORTE

Se algo reprovar, verificar:
1. Logs do Vercel
2. Variáveis de ambiente (todas presentes?)
3. Banco de dados (migrações aplicadas?)
4. DNS (wildcard ativo?)

**Comandos úteis:**
```bash
# Verificar envs
vercel env ls

# Verificar domínios
vercel domains ls

# Ver logs
vercel logs --follow
```
