# 🚀 SETUP COMPLETO - COPIAR E COLAR (ZERO ERRO)

**MeJoy · mejoy.com.br** — Use este documento como única fonte. Tudo que falta configurar manualmente está aqui. Validado para lançamento contínuo.

---

## 1️⃣ SQL - SUPABASE (Execute no SQL Editor)

**Acesse:** Supabase Dashboard → SQL Editor → New Query → Cole o bloco abaixo → Run

```sql
-- ============================================
-- SETUP COMPLETO SUPABASE - ZAPFARM
-- Execute UMA VEZ. CREATE IF NOT EXISTS = seguro
-- ============================================

-- 1. Profiles
CREATE TABLE IF NOT EXISTS public.profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id text UNIQUE,
  name text,
  email text,
  whatsapp text,
  sex text CHECK (sex IN ('male','female','undisclosed')),
  birth_date date,
  weight_kg numeric,
  height_cm numeric,
  checkout_cache jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- 2. Triage Sessions
CREATE TABLE IF NOT EXISTS public.triage_sessions (
  triage_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id text,
  profile_id uuid REFERENCES public.profiles(id) ON DELETE SET NULL,
  triage_slug text NOT NULL,
  answers jsonb DEFAULT '{}'::jsonb,
  profile_snapshot jsonb,
  progress_percent integer DEFAULT 0,
  completed_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS triage_sessions_client_idx ON public.triage_sessions(client_id);
CREATE INDEX IF NOT EXISTS triage_sessions_slug_idx ON public.triage_sessions(triage_slug);
CREATE INDEX IF NOT EXISTS triage_sessions_profile_idx ON public.triage_sessions(profile_id);

-- 3. Triage Steps
CREATE TABLE IF NOT EXISTS public.triage_steps (
  triage_id uuid REFERENCES public.triage_sessions(triage_id) ON DELETE CASCADE,
  step_key text NOT NULL,
  answer jsonb,
  updated_at timestamptz DEFAULT now(),
  PRIMARY KEY (triage_id, step_key)
);

-- 4. Triage Reports (usado pelo código)
CREATE TABLE IF NOT EXISTS public.triage_reports (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  triage_id uuid UNIQUE REFERENCES public.triage_sessions(triage_id) ON DELETE CASCADE,
  status text CHECK (status IN ('pending','running','completed','failed')) DEFAULT 'pending',
  sections jsonb,
  summary text,
  audio_url text,
  error text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS triage_reports_status_idx ON public.triage_reports(status);
CREATE INDEX IF NOT EXISTS triage_reports_triage_id_idx ON public.triage_reports(triage_id);

-- 5. Zapfarm Orders (Prisma/Webhook Asaas)
CREATE TABLE IF NOT EXISTS public.zapfarm_orders (
  id text PRIMARY KEY DEFAULT gen_random_uuid()::text,
  "productSlug" text NOT NULL,
  "planSlug" text NOT NULL,
  "asaasPaymentId" text UNIQUE NOT NULL,
  "asaasCustomerId" text,
  status text DEFAULT 'PENDING',
  "customerName" text NOT NULL,
  "customerEmail" text NOT NULL,
  "customerPhone" text,
  amount integer NOT NULL,
  currency text DEFAULT 'BRL',
  "billingType" text,
  "reportId" text,
  "triageId" text,
  "profileId" text,
  "utmSource" text,
  "utmMedium" text,
  "utmCampaign" text,
  "utmContent" text,
  "utmTerm" text,
  "createdAt" timestamptz DEFAULT now(),
  "updatedAt" timestamptz DEFAULT now(),
  "paidAt" timestamptz
);

CREATE INDEX IF NOT EXISTS zapfarm_orders_product_idx ON public.zapfarm_orders("productSlug");
CREATE INDEX IF NOT EXISTS zapfarm_orders_status_idx ON public.zapfarm_orders(status);
CREATE INDEX IF NOT EXISTS zapfarm_orders_asaas_idx ON public.zapfarm_orders("asaasPaymentId");
CREATE INDEX IF NOT EXISTS zapfarm_orders_email_idx ON public.zapfarm_orders("customerEmail");
CREATE INDEX IF NOT EXISTS zapfarm_orders_profile_idx ON public.zapfarm_orders("profileId");
CREATE INDEX IF NOT EXISTS zapfarm_orders_created_idx ON public.zapfarm_orders("createdAt");

-- 6. Magic Links (Evolution)
CREATE TABLE IF NOT EXISTS public.magic_links (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  token_hash text NOT NULL UNIQUE,
  profile_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  redirect_path text DEFAULT '/dashboard',
  expires_at timestamptz NOT NULL,
  used_at timestamptz,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_magic_links_token_hash ON public.magic_links(token_hash);
CREATE INDEX IF NOT EXISTS idx_magic_links_profile ON public.magic_links(profile_id);
CREATE INDEX IF NOT EXISTS idx_magic_links_expires ON public.magic_links(expires_at);

-- 7. Lead Funnel Steps
CREATE TABLE IF NOT EXISTS public.lead_funnel_steps (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  product_slug text NOT NULL DEFAULT 'geral',
  triage_slug text,
  current_step text NOT NULL,
  source text,
  entered_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  metadata jsonb DEFAULT '{}'::jsonb
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_lead_funnel_profile_product ON public.lead_funnel_steps(profile_id, product_slug);
CREATE INDEX IF NOT EXISTS idx_lead_funnel_step ON public.lead_funnel_steps(current_step);
CREATE INDEX IF NOT EXISTS idx_lead_funnel_entered ON public.lead_funnel_steps(entered_at);

-- 8. Report Requests & API Quota
CREATE TABLE IF NOT EXISTS public.report_requests (
  id bigserial PRIMARY KEY,
  key text UNIQUE NOT NULL,
  payload jsonb NOT NULL,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.api_quota (
  id bigserial PRIMARY KEY,
  client_id text NOT NULL,
  route text NOT NULL,
  occurred_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS api_quota_idx ON public.api_quota(client_id, route, occurred_at DESC);

-- 9. LGPD Consents
CREATE TABLE IF NOT EXISTS public.lgpd_consents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id text,
  consent_at timestamptz NOT NULL,
  policy_version text NOT NULL,
  ip_hash text,
  revoked_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS lgpd_consents_user_id_idx ON public.lgpd_consents(user_id);
CREATE INDEX IF NOT EXISTS lgpd_consents_consent_at_idx ON public.lgpd_consents(consent_at);

-- 10. Coluna checkout_cache em profiles (se não existir)
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS checkout_cache jsonb;

-- 11. Tabela reports (legacy)
CREATE TABLE IF NOT EXISTS public.reports (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  triage_id uuid UNIQUE REFERENCES public.triage_sessions(triage_id) ON DELETE CASCADE,
  status text CHECK (status IN ('pending','running','completed','failed')) DEFAULT 'pending',
  sections jsonb,
  summary text,
  audio_url text,
  error text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS reports_status_idx ON public.reports(status);
```

---

## 2️⃣ ENV VARS - VERCEL (verificar se falta alguma)

**Acesse:** Vercel → Projeto → Settings → Environment Variables

### Obrigatórias (substitua [OBTER] pelos valores reais)

| Nome | Valor | Exemplo |
|------|-------|---------|
| `NEXT_PUBLIC_SUPABASE_URL` | [OBTER] | `https://xxx.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | [OBTER] | `eyJhbGciOiJIUzI1NiIs...` |
| `SUPABASE_SERVICE_ROLE_KEY` | [OBTER] | `eyJhbGciOiJIUzI1NiIs...` |
| `DATABASE_URL` | [OBTER] | `postgresql://postgres:SENHA@db.xxx.supabase.co:5432/postgres` |
| `ASAAS_API_KEY` | [OBTER] | `aact_prod_xxxx` |
| `ASAAS_ENVIRONMENT` | `production` | `production` |
| `OPENAI_API_KEY` | [OBTER] | `sk-proj-xxxx` |
| `AI_REPORT_ENABLED` | `1` | `1` |
| `RESEND_API_KEY` | [OBTER] | `re_xxxx` |
| `EMAIL_FROM` | `MeJoy <noreply@mejoy.com.br>` | ou `onboarding@resend.dev` (sem domínio) |
| `EMAIL_REPLY_TO` | `contato@mejoy.com.br` | seu email |
| `NEXTAUTH_URL` | `https://www.mejoy.com.br` | seu domínio |
| `NEXTAUTH_SECRET` | [GERAR] | `openssl rand -base64 32` |
| `NEXT_PUBLIC_BASE_URL` | `https://www.mejoy.com.br` | seu domínio |
| `NEXT_PUBLIC_SITE_URL` | `https://www.mejoy.com.br` | seu domínio |
| `NEXT_PUBLIC_SITE_NAME` | `MeJoy` | marca |
| `NODE_ENV` | `production` | `production` |
| `WEBHOOK_ASAAS_URL` | `https://www.mejoy.com.br/api/asaas/webhook` | seu domínio |

### Preços Asaas (30 vars – CENTAVOS: 13900 = R$ 139,00)

```bash
# Emagrecimento
ASAAS_PRICE_EMAGRECIMENTO_BASICO=294900
ASAAS_PRICE_EMAGRECIMENTO_COMPLETO=442300
ASAAS_PRICE_EMAGRECIMENTO_PREMIUM=589800

# Calvície
ASAAS_PRICE_CALVICIE_BASICO=13900
ASAAS_PRICE_CALVICIE_COMPLETO=20900
ASAAS_PRICE_CALVICIE_PREMIUM=27800

# Sono
ASAAS_PRICE_SONO_BASICO=13900
ASAAS_PRICE_SONO_COMPLETO=20900
ASAAS_PRICE_SONO_PREMIUM=27800

# Ansiedade
ASAAS_PRICE_ANSIEDADE_BASICO=13900
ASAAS_PRICE_ANSIEDADE_COMPLETO=20900
ASAAS_PRICE_ANSIEDADE_PREMIUM=27800

# Intestino
ASAAS_PRICE_INTESTINO_BASICO=13900
ASAAS_PRICE_INTESTINO_COMPLETO=20900
ASAAS_PRICE_INTESTINO_PREMIUM=27800

# Fígado
ASAAS_PRICE_FIGADO_BASICO=13900
ASAAS_PRICE_FIGADO_COMPLETO=20900
ASAAS_PRICE_FIGADO_PREMIUM=27800

# Libido Masculina
ASAAS_PRICE_LIBIDO_MASCULINA_BASICO=13900
ASAAS_PRICE_LIBIDO_MASCULINA_COMPLETO=20900
ASAAS_PRICE_LIBIDO_MASCULINA_PREMIUM=27800

# Menopausa
ASAAS_PRICE_MENOPAUSA_BASICO=13900
ASAAS_PRICE_MENOPAUSA_COMPLETO=20900
ASAAS_PRICE_MENOPAUSA_PREMIUM=27800

# Articulações
ASAAS_PRICE_ARTICULACOES_BASICO=13900
ASAAS_PRICE_ARTICULACOES_COMPLETO=20900
ASAAS_PRICE_ARTICULACOES_PREMIUM=27800

# Imunidade
ASAAS_PRICE_IMUNIDADE_BASICO=13900
ASAAS_PRICE_IMUNIDADE_COMPLETO=20900
ASAAS_PRICE_IMUNIDADE_PREMIUM=27800
```

### Evolution (WhatsApp Magic Link)

| Nome | Valor |
|------|-------|
| `EVOLUTION_MAGIC_LINK_ENABLED` | `true` ou `1` |
| `EVOLUTION_API_URL` | `https://sua-evolution-api.com` |
| `EVOLUTION_INSTANCE` | `zapvidax` |
| `EVOLUTION_API_KEY` | [OBTER] chave da Evolution |

### Feature Flags (opcional)

| Nome | Valor |
|------|-------|
| `NEXT_PUBLIC_TRIAGE_GI_ENHANCED` | `1` |
| `NEXT_PUBLIC_SHOW_PARTNER_CTAS` | `1` |
| `NEXT_PUBLIC_CUSTOMER_MODE` | `b2c` |

---

## 3️⃣ WEBHOOK ASAAS (manual no painel)

**Acesse:** https://www.asaas.com → Configurações → Integrações → Webhooks → Adicionar Webhook

| Campo | Valor |
|-------|-------|
| **Nome** | `MeJoy - Pagamentos` |
| **URL** | `https://www.mejoy.com.br/api/asaas/webhook` |
| **E-mail** | `contato@mejoy.com.br` |
| **Versão API** | `v3` |
| **Ativo** | Sim |
| **Fila sincronização** | Sim |
| **Tipo envio** | Sequencial |

**Eventos (obrigatórios):**
- `PAYMENT_CONFIRMED`
- `PAYMENT_RECEIVED`
- `PAYMENT_UPDATED`
- `PAYMENT_OVERDUE`
- `PAYMENT_DELETED`
- `PAYMENT_REFUNDED`

---

## 4️⃣ EVOLUTION (manual)

1. Criar instância no servidor da Evolution API
2. Conectar via QR Code (WhatsApp)
3. Copiar `EVOLUTION_API_URL`, `EVOLUTION_INSTANCE`, `EVOLUTION_API_KEY` para o Vercel
4. Endpoint usado: `POST /message/sendText/{instance}` — conferir se sua versão da Evolution usa esse path

---

## 5️⃣ RESEND DOMÍNIO (opcional)

Sem domínio: emails só de `@resend.dev` (pode limitar destinatários).

Com domínio: https://resend.com/domains → Add Domain → `mejoy.com.br` → configurar DNS (SPF, DKIM, DMARC conforme o Resend indicar).

---

## 6️⃣ VALIDAÇÃO SQL (após executar o bloco 1)

```sql
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('profiles', 'triage_sessions', 'triage_steps', 'triage_reports', 'zapfarm_orders', 'magic_links', 'lead_funnel_steps', 'report_requests', 'api_quota', 'lgpd_consents')
ORDER BY table_name;
```

**Esperado:** 10 linhas.

---

## 7️⃣ CHECKLIST FINAL

- [ ] SQL executado no Supabase
- [ ] 10 tabelas criadas (validação)
- [ ] Env vars no Vercel (42+ obrigatórias)
- [ ] Webhook Asaas configurado
- [ ] Evolution: instância criada e conectada (se usar)
- [ ] Teste: triagem → relatório → checkout → pagamento
- [ ] Webhook: pedido após pagamento em `zapfarm_orders`

---

## 8️⃣ URLs PRODUÇÃO (mejoy.com.br)

| Página | URL |
|--------|-----|
| Home (Loja) | https://www.mejoy.com.br |
| Produtos | https://www.mejoy.com.br/produtos |
| Protocolos | https://www.mejoy.com.br/protocolos |
| Login | https://www.mejoy.com.br/login |
| Admin | https://www.mejoy.com.br/admin |

---

**Última atualização:** Fevereiro 2025
