# 🎯 ORDEM CORRETA DE EXECUÇÃO - LANÇAMENTO

**Status Atual:** ✅ 42 ENVs configuradas no Vercel  
**Próximo Passo:** Executar SQL no Supabase → Deploy → Webhook → Testar

---

## 📋 ORDEM CORRETA (NÃO PULE ETAPAS!)

### ✅ **PASSO 1: JÁ FEITO**
- [x] 42 variáveis de ambiente configuradas no Vercel

---

### ✅ **PASSO 2: EXECUTAR SQL NO SUPABASE (FAÇA ISSO PRIMEIRO!)**

**Por quê primeiro?** O banco precisa ter as tabelas antes do deploy funcionar.

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

**✅ Verifique:** Execute este SQL para confirmar que as tabelas foram criadas:

```sql
SELECT 
  table_name,
  table_type
FROM information_schema.tables
WHERE table_schema = 'public'
  AND table_name IN ('profiles', 'triage_sessions', 'triage_steps', 'reports', 'zapfarm_orders')
ORDER BY table_name;
```

**Resultado esperado:** 5 tabelas listadas

---

### ✅ **PASSO 3: COMMIT E DEPLOY (FAÇA ISSO DEPOIS DO SQL)**

**Por quê depois?** O código precisa estar em produção para o webhook funcionar.

**3.1 Verificar mudanças:**
```bash
git status
```

**3.2 Adicionar tudo:**
```bash
git add -A
```

**3.3 Commit:**
```bash
git commit -m "feat: configuração completa para lançamento - 10 protocolos, Asaas, webhook, envs"
```

**3.4 Push:**
```bash
git push origin main
```

**3.5 Deploy no Vercel:**
- **Opção A (Automático):** O Vercel fará deploy automaticamente após o push
- **Opção B (Manual):** Vercel Dashboard → Deployments → Redeploy

**⏳ Aguarde:** 3-5 minutos para o build completar

**✅ Verifique:** Vercel Dashboard → Deployments → Último deploy deve estar "Ready"

---

### ✅ **PASSO 4: CONFIGURAR WEBHOOK NO ASAAS (DEPOIS DO DEPLOY)**

**Por quê depois?** O webhook precisa que o código esteja em produção para funcionar.

**Acesse:** https://www.asaas.com → Integrações → Webhooks → Adicionar Webhook

**Preencha:**

| Campo | Valor |
|-------|-------|
| **Nome do Webhook** | `ZapFarm - Pagamentos` |
| **URL do Webhook** | `https://www.zapfarm.com.br/api/asaas/webhook` |
| **E-mail** | `[SEU EMAIL]` |
| **Versão da API** | `v3` |
| **Token de autenticação** | `[DEIXE VAZIO]` |
| **Fila de sincronização** | `✅ SIM` |
| **Tipo de envio** | `Sequencial` |
| **Webhook ativo?** | `✅ SIM` |

**Eventos para selecionar (6 eventos na seção "Cobranças"):**
```
✅ PAYMENT_CONFIRMED
✅ PAYMENT_RECEIVED
✅ PAYMENT_UPDATED
✅ PAYMENT_OVERDUE
✅ PAYMENT_DELETED
✅ PAYMENT_REFUNDED
```

**✅ Clique em "Salvar"**

---

### ✅ **PASSO 5: TESTAR FLUXO COMPLETO**

**5.1 Teste de Conexão:**
- Acesse: `https://www.zapfarm.com.br/api/teste-env`
- **Resultado esperado:** JSON com status de todas as conexões

**5.2 Teste de Triagem:**
- Acesse: `https://www.zapfarm.com.br/emagrecimento`
- Complete a triagem
- **Resultado esperado:** Relatório gerado

**5.3 Teste de Checkout:**
- Escolha um plano
- Tente fazer checkout (use dados de teste do Asaas)
- **Resultado esperado:** Redirecionamento para página de pagamento Asaas

**5.4 Teste de Webhook:**
- Faça um pagamento de teste (PIX ou Cartão)
- Verifique logs do Vercel: Dashboard → Functions → `/api/asaas/webhook` → Logs
- Verifique banco: Supabase → Table Editor → `zapfarm_orders` (deve ter o pedido)
- **Resultado esperado:** Pedido criado com status `PAID` após confirmação

---

## 📊 RESUMO DA ORDEM

```
1. ✅ ENVs configuradas (JÁ FEITO)
   ↓
2. ✅ Executar SQL no Supabase (FAÇA AGORA)
   ↓
3. ✅ Commit e Deploy (DEPOIS DO SQL)
   ↓
4. ✅ Configurar Webhook Asaas (DEPOIS DO DEPLOY)
   ↓
5. ✅ Testar fluxo completo (DEPOIS DO WEBHOOK)
   ↓
6. 🚀 LANÇAR!
```

---

## ⚠️ POR QUÊ ESTA ORDEM?

1. **SQL primeiro:** O banco precisa ter as tabelas antes do código tentar usá-las
2. **Deploy depois:** O código precisa estar em produção para o webhook funcionar
3. **Webhook depois:** O webhook precisa que a URL esteja acessível (código em produção)
4. **Teste por último:** Só faz sentido testar quando tudo está configurado

---

## 🚨 SE ALGO FALHAR

### Erro no SQL:
- Verifique se você está no SQL Editor do Supabase
- Verifique se copiou o SQL completo
- Execute o SQL de verificação para ver se as tabelas foram criadas

### Erro no Deploy:
- Verifique se todas as 42 ENVs estão configuradas
- Verifique logs do build no Vercel
- Verifique se não há erros de TypeScript/Lint

### Erro no Webhook:
- Verifique se o deploy foi concluído
- Verifique se a URL está correta: `https://www.zapfarm.com.br/api/asaas/webhook`
- Teste a URL manualmente (deve retornar 405, não 404)

---

## ✅ CHECKLIST FINAL

- [ ] SQL executado no Supabase (5 tabelas criadas)
- [ ] Commit feito
- [ ] Deploy concluído no Vercel
- [ ] Webhook configurado no Asaas
- [ ] Teste de conexão passou
- [ ] Teste de triagem passou
- [ ] Teste de checkout passou
- [ ] Teste de webhook passou (pedido criado no banco)

---

**🚀 PRÓXIMO PASSO: Execute o SQL no Supabase (Passo 2) e depois me avise!**

