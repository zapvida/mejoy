# Setup manual para lançamento — Admin + Magic Link + Evolution API

**Data:** 25/02/2026  
**Status:** Implementação completa — pendente configuração manual

---

## O que foi implementado

- Evolution API client (`src/lib/evolution/client.ts`)
- Magic Link (geração, validação, página `/auth/magic-link`)
- Tabelas: `magic_links`, `lead_funnel_steps`
- Envio de Magic Link via WhatsApp após triagem concluída
- Admin com dados reais (KPIs, Funnel, Revenue, Product)
- Serviço de funil (`advanceLead`) e integrações
- API e página de leads unificados (`/admin/leads`)
- Export CSV com auditoria de PII

---

## 1. Variáveis de ambiente (.env ou Vercel)

Adicione no seu `.env` ou no painel da Vercel:

```env
# Evolution API (Magic Link via WhatsApp)
EVOLUTION_API_URL=https://sua-instancia.evolution-api.com
EVOLUTION_INSTANCE=mejoy-prod
EVOLUTION_API_KEY=your_secret_from_provider
EVOLUTION_MAGIC_LINK_ENABLED=true

# Já existentes (verificar)
NEXT_PUBLIC_SITE_URL=https://www.mejoy.com.br
NEXT_PUBLIC_BASE_URL=https://www.mejoy.com.br
ADMIN_SECRET_KEY=seu_token_admin_seguro
```

- Se `EVOLUTION_MAGIC_LINK_ENABLED=false` ou não definido, o envio de Magic Link não ocorre.
- A Evolution API v2 pode usar endpoint diferente; ajuste `EVOLUTION_API_URL` conforme a documentação da sua instância.

---

## 2. Migrations SQL no Supabase

Execute no **SQL Editor** do Supabase (projeto MeJoy):

```sql
-- 1) Tabela magic_links
CREATE TABLE IF NOT EXISTS public.magic_links (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  token_hash text NOT NULL UNIQUE,
  profile_id uuid NOT NULL,
  redirect_path text DEFAULT '/dashboard',
  expires_at timestamptz NOT NULL,
  used_at timestamptz,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_magic_links_token_hash ON public.magic_links(token_hash);
CREATE INDEX IF NOT EXISTS idx_magic_links_profile ON public.magic_links(profile_id);
CREATE INDEX IF NOT EXISTS idx_magic_links_expires ON public.magic_links(expires_at);

-- 2) Tabela lead_funnel_steps
CREATE TABLE IF NOT EXISTS public.lead_funnel_steps (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id uuid NOT NULL,
  product_slug text NOT NULL DEFAULT 'geral',
  triage_slug text,
  current_step text NOT NULL,
  source text,
  entered_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  metadata jsonb DEFAULT '{}'::jsonb
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_lead_funnel_profile_product
  ON public.lead_funnel_steps(profile_id, product_slug);

CREATE INDEX IF NOT EXISTS idx_lead_funnel_step ON public.lead_funnel_steps(current_step);
CREATE INDEX IF NOT EXISTS idx_lead_funnel_entered ON public.lead_funnel_steps(entered_at);
CREATE INDEX IF NOT EXISTS idx_lead_funnel_product ON public.lead_funnel_steps(product_slug);
```

---

## 3. Configuração da Evolution API

1. Instale e configure uma instância Evolution API (self-hosted ou serviço).
2. Registre um número de WhatsApp para envio.
3. Gere ou copie a `API Key` e preencha `EVOLUTION_API_KEY`.
4. Ajuste a URL base (`EVOLUTION_API_URL`), por exemplo:
   - `https://api.evolutionapi.com/v1` (ou conforme documentação)
5. O client usa `POST /message/sendText/{instance}`. Se sua versão usar outro endpoint, altere em `src/lib/evolution/client.ts`.

---

## 4. Checklist de validação

### Evolution + Magic Link

- [ ] `EVOLUTION_MAGIC_LINK_ENABLED=true`
- [ ] Envio de teste via Evolution para um número real
- [ ] Triagem concluída → Magic Link gerado
- [ ] WhatsApp recebido com link em até 2 minutos
- [ ] Clicar no link → login → redirect para `/dashboard`
- [ ] Token expirado ou já usado não permite novo login

### Admin

- [ ] `/admin` com métricas reais (sem mocks)
- [ ] `/admin/leads` listando leads
- [ ] Filtros por produto e etapa funcionando
- [ ] Export CSV
- [ ] Export CSV com PII e auditoria em `AdminAuditLog`

### Fluxo

- [ ] Triagem → Relatório → Magic Link no WhatsApp
- [ ] Checkout → etapa `checkout_started`
- [ ] Pagamento confirmado → etapa `paid`
- [ ] OTP por email continua funcionando

---

## 5. Roteiro sugerido de lançamento

1. Rodar as migrations SQL no Supabase.
2. Configurar variáveis de ambiente (incluindo Evolution).
3. Fazer deploy.
4. Executar triagem de teste com WhatsApp válido.
5. Conferir recebimento do Magic Link e acesso ao dashboard.
6. Validar admin e leads.

---

## 6. Rollback rápido

Em caso de problema:

- `EVOLUTION_MAGIC_LINK_ENABLED=false` → desativa envio de Magic Link.
- Admin segue operando com dados reais; não há feature flag específica para reverter para mocks.

---

## 7. Arquivos criados/alterados

| Arquivo | Descrição |
|---------|-----------|
| `src/lib/evolution/client.ts` | Cliente Evolution API |
| `src/lib/auth/magic-link.ts` | Lógica de Magic Link |
| `src/lib/funnel/service.ts` | Serviço de funil |
| `src/pages/api/auth/magic-link.ts` | API geração Magic Link |
| `src/pages/api/auth/magic-link/validate.ts` | API validação Magic Link |
| `src/pages/auth/magic-link.tsx` | Página de validação do link |
| `src/pages/api/triage/finalize.ts` | Integração Magic Link + Evolution |
| `src/pages/api/admin/kpis.ts` | KPIs com dados reais |
| `src/pages/api/admin/funnel.ts` | Funil com dados reais |
| `src/pages/api/admin/revenue.ts` | Receita com dados reais |
| `src/pages/api/admin/product.ts` | Produto com dados reais |
| `src/pages/api/admin/leads.ts` | API de leads |
| `src/pages/api/admin/leads/export.ts` | Export CSV |
| `src/pages/admin/leads.tsx` | Página de leads |
| `src/pages/admin/index.tsx` | Link para leads |
| `src/pages/api/asaas/webhook.ts` | Integração `advanceLead` (paid) |
| `src/pages/api/asaas/create-payment.ts` | Integração `advanceLead` (checkout) |
| `supabase/migrations/20250225000001_magic_links.sql` | Migration magic_links |
| `supabase/migrations/20250225000002_lead_funnel_steps.sql` | Migration lead_funnel_steps |

---

**Fim do documento.**
