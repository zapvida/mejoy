# 🚀 CHECKLIST COMPLETO - LANÇAMENTO PRODUÇÃO ZAPFARM

**Data:** Janeiro 2025  
**Status:** ✅ **PRONTO PARA CONFIGURAÇÃO E LANÇAMENTO**  
**10 Protocolos:** Emagrecimento, Calvície, Sono, Ansiedade, Intestino, Fígado, Libido Masculina, Menopausa, Articulações, Imunidade

---

## 📊 RESUMO EXECUTIVO

Este documento lista **TODAS** as variáveis de ambiente necessárias e **TODAS** as ações manuais que você precisa fazer para lançar o ZapFarm em produção e começar a vender os 10 protocolos.

### ✅ O que está pronto:
- ✅ Código 100% implementado e testado
- ✅ 10 protocolos configurados com preços e planos
- ✅ Checkout Asaas integrado (PIX e Cartão)
- ✅ Webhook de pagamentos configurado
- ✅ Banco de dados schema pronto
- ✅ Fluxo completo de triagem → relatório → checkout → pagamento

### ⚠️ O que você precisa fazer manualmente:
1. **Configurar 30 variáveis de ambiente no Vercel** (10 produtos × 3 planos)
2. **Configurar conta Asaas e API Key**
3. **Configurar webhook no Asaas**
4. **Aplicar migrações no Supabase**
5. **Configurar domínio e URLs**
6. **Testar fluxo completo**

**Tempo estimado:** 2-3 horas

---

## 🔐 PARTE 1: VARIÁVEIS DE AMBIENTE OBRIGATÓRIAS

### 📋 1.1 SUPABASE (4 variáveis)

#### ✅ NEXT_PUBLIC_SUPABASE_URL
```
Name: NEXT_PUBLIC_SUPABASE_URL
Value: https://SEU_PROJETO.supabase.co
Environment: ✅ Production ✅ Preview ✅ Development
```
**Como obter:**
1. Acesse: https://supabase.com/dashboard
2. Selecione seu projeto
3. Settings → API → Project URL
4. Copie a URL completa

#### ✅ NEXT_PUBLIC_SUPABASE_ANON_KEY
```
Name: NEXT_PUBLIC_SUPABASE_ANON_KEY
Value: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Environment: ✅ Production ✅ Preview ✅ Development
```
**Como obter:**
1. Supabase Dashboard → Settings → API
2. Seção "Project API keys" → `anon` `public`
3. Copie a chave completa

#### ✅ SUPABASE_SERVICE_ROLE_KEY
```
Name: SUPABASE_SERVICE_ROLE_KEY
Value: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Environment: ✅ Production ✅ Preview ✅ Development
```
**Como obter:**
1. Supabase Dashboard → Settings → API
2. Seção "Service Role" → Clique no ícone de olho 👁️
3. Copie a chave completa (é longa, começa com `eyJhbGc...`)

**⚠️ IMPORTANTE:** Esta chave tem acesso total ao banco. NUNCA exponha no frontend.

#### ✅ DATABASE_URL
```
Name: DATABASE_URL
Value: postgresql://your_user:your_password@your_host:5432/your_database
Environment: ✅ Production ✅ Preview ✅ Development
```
**Como obter:**
1. Supabase Dashboard → Settings → Database
2. Seção "Connection string" → "URI"
3. Copie a string completa (substitua `[YOUR-PASSWORD]` pela senha real)

---

### 📋 1.2 ASAAS - PAGAMENTOS (1 variável + 30 preços)

#### ✅ ASAAS_API_KEY
```
Name: ASAAS_API_KEY
Value: your_asaas_api_key
Environment: ✅ Production ✅ Preview ✅ Development
```
**Como obter:**
1. Acesse: https://www.asaas.com
2. Faça login na sua conta
3. Configurações → Integrações → API
4. Copie a chave de produção (começa com `aact_prod_`)

**⚠️ IMPORTANTE:** Use `aact_prod_` para produção. Para testes, use `aact_YTUw...` (sandbox).

#### ✅ ASAAS_ENVIRONMENT
```
Name: ASAAS_ENVIRONMENT
Value: production
Environment: ✅ Production apenas
```
**Para Preview/Development:** `sandbox` ou deixe vazio

---

### 📋 1.3 PREÇOS ASAAS - 10 PRODUTOS × 3 PLANOS (30 variáveis)

**CONVENÇÃO:** `ASAAS_PRICE_{PRODUTO}_{PLANO}` (valores em CENTAVOS)

#### 🎯 Emagrecimento (MetaboSlim)
```
ASAAS_PRICE_EMAGRECIMENTO_BASICO=294900
ASAAS_PRICE_EMAGRECIMENTO_COMPLETO=442300
ASAAS_PRICE_EMAGRECIMENTO_PREMIUM=589800
```

#### 🎯 Calvície (CapilMax)
```
ASAAS_PRICE_CALVICIE_BASICO=13900
ASAAS_PRICE_CALVICIE_COMPLETO=20900
ASAAS_PRICE_CALVICIE_PREMIUM=27800
```

#### 🎯 Sono (SonoZen)
```
ASAAS_PRICE_SONO_BASICO=13900
ASAAS_PRICE_SONO_COMPLETO=20900
ASAAS_PRICE_SONO_PREMIUM=27800
```

#### 🎯 Ansiedade (ZenDay)
```
ASAAS_PRICE_ANSIEDADE_BASICO=13900
ASAAS_PRICE_ANSIEDADE_COMPLETO=20900
ASAAS_PRICE_ANSIEDADE_PREMIUM=27800
```

#### 🎯 Intestino (FloraBalance)
```
ASAAS_PRICE_INTESTINO_BASICO=13900
ASAAS_PRICE_INTESTINO_COMPLETO=20900
ASAAS_PRICE_INTESTINO_PREMIUM=27800
```

#### 🎯 Fígado (HepaDetox)
```
ASAAS_PRICE_FIGADO_BASICO=13900
ASAAS_PRICE_FIGADO_COMPLETO=20900
ASAAS_PRICE_FIGADO_PREMIUM=27800
```

#### 🎯 Libido Masculina (VigorMax)
```
ASAAS_PRICE_LIBIDO_MASCULINA_BASICO=13900
ASAAS_PRICE_LIBIDO_MASCULINA_COMPLETO=20900
ASAAS_PRICE_LIBIDO_MASCULINA_PREMIUM=27800
```

#### 🎯 Menopausa (FemBalance 360)
```
ASAAS_PRICE_MENOPAUSA_BASICO=13900
ASAAS_PRICE_MENOPAUSA_COMPLETO=20900
ASAAS_PRICE_MENOPAUSA_PREMIUM=27800
```

#### 🎯 Articulações (ArticFlex)
```
ASAAS_PRICE_ARTICULACOES_BASICO=13900
ASAAS_PRICE_ARTICULACOES_COMPLETO=20900
ASAAS_PRICE_ARTICULACOES_PREMIUM=27800
```

#### 🎯 Imunidade (Imuno360)
```
ASAAS_PRICE_IMUNIDADE_BASICO=13900
ASAAS_PRICE_IMUNIDADE_COMPLETO=20900
ASAAS_PRICE_IMUNIDADE_PREMIUM=27800
```

**⚠️ IMPORTANTE:** 
- Valores estão em **CENTAVOS** (ex: 13900 = R$ 139,00)
- Todos os 30 preços são **OBRIGATÓRIOS** para o checkout funcionar
- Se faltar algum, o checkout desse produto/plano não funcionará

---

### 📋 1.4 OPENAI - GERAÇÃO DE RELATÓRIOS (1 variável)

#### ✅ OPENAI_API_KEY
```
Name: OPENAI_API_KEY
Value: your_openai_api_key
Environment: ✅ Production ✅ Preview ✅ Development
```
**Como obter:**
1. Acesse: https://platform.openai.com/api-keys
2. Crie uma nova chave ou use uma existente
3. Copie a chave completa (começa com `sk-proj-`)

**⚠️ IMPORTANTE:** 
- Use chave de produção (não de teste)
- Mantenha a chave segura (não exponha no código)

---

### 📋 1.5 CONFIGURAÇÃO BÁSICA (3 variáveis)

#### ✅ NEXT_PUBLIC_BASE_URL
```
Name: NEXT_PUBLIC_BASE_URL
Value: https://www.zapfarm.com.br
Environment: ✅ Production ✅ Preview ✅ Development
```
**Substitua:** `www.zapfarm.com.br` pelo seu domínio real

#### ✅ NEXT_PUBLIC_SITE_URL
```
Name: NEXT_PUBLIC_SITE_URL
Value: https://www.zapfarm.com.br
Environment: ✅ Production ✅ Preview ✅ Development
```
**Mesmo domínio acima**

#### ✅ NODE_ENV
```
Name: NODE_ENV
Value: production
Environment: ✅ Production apenas
```
**Para Preview/Development:** `development`

---

### 📋 1.6 NEXTAUTH (2 variáveis)

#### ✅ NEXTAUTH_URL
```
Name: NEXTAUTH_URL
Value: https://www.zapfarm.com.br
Environment: ✅ Production ✅ Preview ✅ Development
```
**Mesmo domínio acima**

#### ✅ NEXTAUTH_SECRET
```
Name: NEXTAUTH_SECRET
Value: [GERAR COM: openssl rand -base64 32]
Environment: ✅ Production ✅ Preview ✅ Development
```
**Como gerar:**
```bash
openssl rand -base64 32
```
Copie o resultado e use como valor.

---

### 📋 1.7 WEBHOOK ASAAS (1 variável)

#### ✅ WEBHOOK_ASAAS_URL
```
Name: WEBHOOK_ASAAS_URL
Value: https://www.zapfarm.com.br/api/asaas/webhook
Environment: ✅ Production apenas
```
**Substitua:** `www.zapfarm.com.br` pelo seu domínio real

---

## 🗄️ PARTE 2: BANCO DE DADOS SUPABASE

### ✅ 2.1 VERIFICAR TABELAS NECESSÁRIAS

O banco precisa ter as seguintes tabelas:

#### Tabelas Core (Triagem)
- ✅ `profiles` - Perfis de usuários
- ✅ `triage_sessions` - Sessões de triagem
- ✅ `triage_steps` - Passos da triagem
- ✅ `reports` - Relatórios gerados

#### Tabelas de Negócio (ZapFarm)
- ✅ `zapfarm_orders` - Pedidos dos produtos
- ✅ `subscriptions` - Assinaturas (se houver)
- ✅ `gift_tokens` - Tokens de presente (se houver)

### ✅ 2.2 APLICAR MIGRAÇÕES SQL

**Acesse:** Supabase Dashboard → SQL Editor → New Query

**Execute este SQL completo:**

```sql
-- =============================================
-- MIGRAÇÃO COMPLETA ZAPFARM - 10 PROTOCOLOS
-- =============================================

-- 1. Tabelas Core (Triagem)
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

-- 2. Tabela de Pedidos ZapFarm (já deve existir via Prisma, mas garantimos)
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

-- 3. Verificar se tabelas foram criadas
SELECT 
  table_name,
  table_type
FROM information_schema.tables
WHERE table_schema = 'public'
  AND table_name IN ('profiles', 'triage_sessions', 'triage_steps', 'reports', 'zapfarm_orders')
ORDER BY table_name;
```

**✅ Resultado esperado:** 5 tabelas listadas

---

## 🔗 PARTE 3: CONFIGURAR WEBHOOK ASAAS

### ✅ 3.1 CRIAR WEBHOOK NO ASAAS

1. **Acesse:** https://www.asaas.com → Configurações → Webhooks
2. **Clique em:** "Adicionar Webhook"
3. **Configure:**
   - **URL:** `https://www.zapfarm.com.br/api/asaas/webhook`
   - **Eventos:** Selecione TODOS:
     - ✅ `PAYMENT_CREATED`
     - ✅ `PAYMENT_UPDATED`
     - ✅ `PAYMENT_CONFIRMED` ⚠️ **CRÍTICO**
     - ✅ `PAYMENT_RECEIVED` ⚠️ **CRÍTICO**
     - ✅ `PAYMENT_OVERDUE`
     - ✅ `PAYMENT_DELETED`
     - ✅ `PAYMENT_RESTORED`
     - ✅ `PAYMENT_REFUNDED`
4. **Salve** o webhook

### ✅ 3.2 TESTAR WEBHOOK

Após criar, o Asaas enviará um evento de teste. Verifique os logs do Vercel para confirmar que chegou.

---

## 🌐 PARTE 4: CONFIGURAR DOMÍNIO E URLS

### ✅ 4.1 DOMÍNIO NO VERCEL

1. **Acesse:** Vercel Dashboard → Seu Projeto → Settings → Domains
2. **Adicione domínio:** `www.zapfarm.com.br` (ou seu domínio)
3. **Configure DNS:** Siga as instruções do Vercel
4. **Aguarde:** Propagação DNS (pode levar até 24h, geralmente 1-2h)

### ✅ 4.2 VERIFICAR URLs NAS ENVs

Certifique-se de que todas as URLs nas variáveis de ambiente usam o domínio correto:
- ✅ `NEXT_PUBLIC_BASE_URL`
- ✅ `NEXT_PUBLIC_SITE_URL`
- ✅ `NEXTAUTH_URL`
- ✅ `WEBHOOK_ASAAS_URL`

---

## 🧪 PARTE 5: TESTES FINAIS

### ✅ 5.1 TESTE DE CONEXÃO COM SUPABASE

**Acesse:** `https://www.zapfarm.com.br/api/teste-env`

**✅ Resultado esperado:** JSON com status de todas as conexões

### ✅ 5.2 TESTE DE CHECKOUT (Sandbox)

1. **Acesse:** `https://www.zapfarm.com.br/emagrecimento`
2. **Complete a triagem**
3. **Escolha um plano**
4. **Tente fazer checkout** (use dados de teste do Asaas)

**✅ Resultado esperado:** Redirecionamento para página de pagamento Asaas

### ✅ 5.3 TESTE DE WEBHOOK

1. **Faça um pagamento de teste** (PIX ou Cartão)
2. **Verifique logs do Vercel:** Functions → `/api/asaas/webhook`
3. **Verifique banco:** Tabela `zapfarm_orders` deve ter o pedido

**✅ Resultado esperado:** Pedido criado com status `PAID` após confirmação

---

## 📋 CHECKLIST FINAL - ANTES DE LANÇAR

### 🔐 Variáveis de Ambiente (42 no total)
- [ ] **Supabase (4):** NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY, SUPABASE_SERVICE_ROLE_KEY, DATABASE_URL
- [ ] **Asaas (2):** ASAAS_API_KEY, ASAAS_ENVIRONMENT
- [ ] **Preços Asaas (30):** Todos os 10 produtos × 3 planos
- [ ] **OpenAI (1):** OPENAI_API_KEY
- [ ] **Configuração (3):** NEXT_PUBLIC_BASE_URL, NEXT_PUBLIC_SITE_URL, NODE_ENV
- [ ] **NextAuth (2):** NEXTAUTH_URL, NEXTAUTH_SECRET
- [ ] **Webhook (1):** WEBHOOK_ASAAS_URL

### 🗄️ Banco de Dados
- [ ] **Migrações aplicadas:** Todas as tabelas criadas
- [ ] **Índices criados:** Performance otimizada
- [ ] **Conexão testada:** API `/api/teste-env` funcionando

### 🔗 Integrações
- [ ] **Webhook Asaas configurado:** URL correta e eventos selecionados
- [ ] **Domínio configurado:** DNS propagado e SSL ativo
- [ ] **URLs verificadas:** Todas apontam para domínio correto

### 🧪 Testes
- [ ] **Triagem funcionando:** Todos os 10 protocolos
- [ ] **Checkout funcionando:** PIX e Cartão
- [ ] **Webhook funcionando:** Pedidos sendo criados no banco
- [ ] **Relatórios gerando:** OpenAI funcionando

---

## 🚨 PROBLEMAS COMUNS E SOLUÇÕES

### ❌ Erro: "Asaas Price não configurado"
**Causa:** Faltou configurar alguma variável `ASAAS_PRICE_*`  
**Solução:** Verifique se todas as 30 variáveis estão configuradas

### ❌ Erro: "ASAAS_API_KEY não configurada"
**Causa:** Chave do Asaas não configurada  
**Solução:** Configure `ASAAS_API_KEY` no Vercel

### ❌ Erro: "Could not find the table 'public.zapfarm_orders'"
**Causa:** Migração não aplicada  
**Solução:** Execute o SQL da Parte 2.2 no Supabase

### ❌ Erro: Webhook não recebe eventos
**Causa:** URL do webhook incorreta ou eventos não selecionados  
**Solução:** Verifique configuração do webhook no Asaas

### ❌ Erro: "DATABASE_URL deve estar configurada"
**Causa:** Variável não configurada  
**Solução:** Configure `DATABASE_URL` no Vercel

---

## 📊 RESUMO DOS 10 PROTOCOLOS

| # | Slug | Nome Comercial | P1 (Essencial) | P2 (Completo) | P3 (Premium) |
|---|------|----------------|----------------|---------------|--------------|
| 1 | emagrecimento | MetaboSlim | R$ 2.949 | R$ 4.423 | R$ 5.898 |
| 2 | calvicie | CapilMax | R$ 139 | R$ 209 | R$ 278 |
| 3 | sono | SonoZen | R$ 139 | R$ 209 | R$ 278 |
| 4 | ansiedade | ZenDay | R$ 139 | R$ 209 | R$ 278 |
| 5 | intestino | FloraBalance | R$ 139 | R$ 209 | R$ 278 |
| 6 | figado | HepaDetox | R$ 139 | R$ 209 | R$ 278 |
| 7 | libido-masculina | VigorMax | R$ 139 | R$ 209 | R$ 278 |
| 8 | menopausa | FemBalance 360 | R$ 139 | R$ 209 | R$ 278 |
| 9 | articulacoes | ArticFlex | R$ 139 | R$ 209 | R$ 278 |
| 10 | imunidade | Imuno360 | R$ 139 | R$ 209 | R$ 278 |

**Todos os preços estão configurados em CENTAVOS nas variáveis de ambiente.**

---

## 🎯 PRÓXIMOS PASSOS APÓS CONFIGURAÇÃO

1. ✅ **Deploy no Vercel:** Push do código para produção
2. ✅ **Monitorar logs:** Verificar se não há erros
3. ✅ **Testar fluxo completo:** Triagem → Relatório → Checkout → Pagamento
4. ✅ **Validar webhook:** Confirmar que pedidos estão sendo criados
5. ✅ **Lançar marketing:** Começar a promover os produtos

---

## 📞 SUPORTE

Se encontrar problemas:
1. Verifique os logs do Vercel: Dashboard → Functions → Logs
2. Verifique os logs do Supabase: Dashboard → Logs
3. Teste cada endpoint individualmente: `/api/teste-env`

---

**🚀 BOA SORTE COM O LANÇAMENTO!**

**Tempo total estimado:** 2-3 horas  
**Resultado esperado:** Sistema 100% funcional e pronto para vender

