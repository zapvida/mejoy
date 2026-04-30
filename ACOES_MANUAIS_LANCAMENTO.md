# ✅ AÇÕES MANUAIS PARA LANÇAMENTO - RESUMO EXECUTIVO

**Data:** Janeiro 2025  
**Tempo estimado:** 2-3 horas  
**Status:** Pronto para executar

---

## 🎯 RESUMO RÁPIDO

Você precisa fazer **4 coisas principais**:

1. ✅ **Configurar 42 variáveis de ambiente no Vercel** (30 são preços dos produtos)
2. ✅ **Aplicar migrações SQL no Supabase** (copiar e colar)
3. ✅ **Configurar webhook no Asaas** (5 minutos)
4. ✅ **Testar fluxo completo** (15 minutos)

---

## 📋 CHECKLIST RÁPIDO

### ✅ 1. VERCEL - VARIÁVEIS DE AMBIENTE (42 variáveis)

**Acesse:** Vercel Dashboard → Seu Projeto → Settings → Environment Variables

#### 1.1 Supabase (4 variáveis)
```
NEXT_PUBLIC_SUPABASE_URL=https://SEU_PROJETO.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
DATABASE_URL=postgresql://postgres:SENHA@db.SEU_PROJETO.supabase.co:5432/postgres
```

#### 1.2 Asaas (2 variáveis)
```
ASAAS_API_KEY=aact_prod_XXXXXXXXXXXXXXXXXXXXXXXXXXXX
ASAAS_ENVIRONMENT=production
```

#### 1.3 Preços Asaas - 10 Produtos × 3 Planos (30 variáveis)

**Copie e cole TODAS estas 30 variáveis:**

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

**⚠️ IMPORTANTE:** Valores estão em CENTAVOS (13900 = R$ 139,00)

#### 1.4 OpenAI (1 variável)
```
OPENAI_API_KEY=sk-proj-XXXXXXXXXXXXXXXXXXXXXXXXXXXX
```

#### 1.5 Configuração Básica (3 variáveis)
```
NEXT_PUBLIC_BASE_URL=https://www.zapfarm.com.br
NEXT_PUBLIC_SITE_URL=https://www.zapfarm.com.br
NODE_ENV=production
```

#### 1.6 NextAuth (2 variáveis)
```
NEXTAUTH_URL=https://www.zapfarm.com.br
NEXTAUTH_SECRET=Os5XKCrU+1KHLar/j7TSVZM/zpzDuRaov3m/93c7MzI=
```

#### 1.7 Webhook (1 variável)
```
WEBHOOK_ASAAS_URL=https://www.zapfarm.com.br/api/asaas/webhook
```

**✅ Total: 42 variáveis**

---

### ✅ 2. SUPABASE - APLICAR MIGRAÇÕES SQL

**Acesse:** Supabase Dashboard → SQL Editor → New Query

**Copie e cole este SQL completo:**

```sql
-- Tabelas Core (Triagem)
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
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

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

CREATE TABLE IF NOT EXISTS public.triage_steps (
  triage_id uuid REFERENCES public.triage_sessions(triage_id) ON DELETE CASCADE,
  step_key text,
  answer jsonb,
  updated_at timestamptz DEFAULT now(),
  PRIMARY KEY (triage_id, step_key)
);

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

-- Tabela de Pedidos ZapFarm
CREATE TABLE IF NOT EXISTS public.zapfarm_orders (
  id text PRIMARY KEY,
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
CREATE INDEX IF NOT EXISTS zapfarm_orders_payment_idx ON public.zapfarm_orders("asaasPaymentId");
CREATE INDEX IF NOT EXISTS zapfarm_orders_email_idx ON public.zapfarm_orders("customerEmail");
CREATE INDEX IF NOT EXISTS zapfarm_orders_profile_idx ON public.zapfarm_orders("profileId");
CREATE INDEX IF NOT EXISTS zapfarm_orders_created_idx ON public.zapfarm_orders("createdAt");
```

**✅ Clique em "Run" e aguarde confirmação**

---

### ✅ 3. ASAAS - CONFIGURAR WEBHOOK

**Acesse:** https://www.asaas.com → Configurações → Webhooks → Adicionar Webhook

**Configure:**
- **URL:** `https://www.zapfarm.com.br/api/asaas/webhook`
- **Eventos:** Selecione TODOS (especialmente `PAYMENT_CONFIRMED` e `PAYMENT_RECEIVED`)

**✅ Salve o webhook**

---

### ✅ 4. TESTAR FLUXO COMPLETO

1. **Acesse:** `https://www.zapfarm.com.br/emagrecimento`
2. **Complete a triagem**
3. **Escolha um plano**
4. **Tente fazer checkout** (use dados de teste do Asaas)
5. **Verifique:** Pedido criado no banco (Supabase → Table Editor → `zapfarm_orders`)

**✅ Se tudo funcionar, você está pronto para lançar!**

---

## 🚨 SE ALGO FALHAR

### Erro: "Asaas Price não configurado"
→ Verifique se todas as 30 variáveis `ASAAS_PRICE_*` estão configuradas

### Erro: "Could not find the table"
→ Execute o SQL da Parte 2 novamente no Supabase

### Erro: Webhook não recebe eventos
→ Verifique URL do webhook no Asaas (deve ser exatamente `https://www.zapfarm.com.br/api/asaas/webhook`)

---

## 📊 RESUMO DOS 10 PROTOCOLOS

| Produto | Slug | P1 | P2 | P3 |
|---------|------|----|----|----|
| MetaboSlim | emagrecimento | R$ 2.949 | R$ 4.423 | R$ 5.898 |
| CapilMax | calvicie | R$ 139 | R$ 209 | R$ 278 |
| SonoZen | sono | R$ 139 | R$ 209 | R$ 278 |
| ZenDay | ansiedade | R$ 139 | R$ 209 | R$ 278 |
| FloraBalance | intestino | R$ 139 | R$ 209 | R$ 278 |
| HepaDetox | figado | R$ 139 | R$ 209 | R$ 278 |
| VigorMax | libido-masculina | R$ 139 | R$ 209 | R$ 278 |
| FemBalance 360 | menopausa | R$ 139 | R$ 209 | R$ 278 |
| ArticFlex | articulacoes | R$ 139 | R$ 209 | R$ 278 |
| Imuno360 | imunidade | R$ 139 | R$ 209 | R$ 278 |

---

## ✅ PRONTO!

Após completar estas 4 ações, seu sistema estará **100% funcional** e pronto para começar a vender os 10 protocolos.

**Tempo total:** 2-3 horas  
**Resultado:** Sistema completo funcionando em produção

---

**🚀 BOA SORTE COM O LANÇAMENTO!**

