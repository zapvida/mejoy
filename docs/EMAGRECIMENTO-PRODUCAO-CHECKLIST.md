# ✅ Checklist de Produção — Programa de Emagrecimento

> **Objetivo:** Garantir que tudo está configurado e validado antes do lançamento oficial.

---

## 1. VARIÁVEIS DE AMBIENTE (Vercel → Production)

### Copy-paste para Vercel (se faltar alguma)

Cole em **Vercel → Project → Settings → Environment Variables → Production**:

```
# Emagrecimento — preços (centavos) — 1m R$2k, 3m R$4k, 6m R$6k
ASAAS_PRICE_EMAGRECIMENTO_BASICO=200000
ASAAS_PRICE_EMAGRECIMENTO_COMPLETO=400000
ASAAS_PRICE_EMAGRECIMENTO_PREMIUM=600000

# WhatsApp (número sem +, ex: 554797789479)
NEXT_PUBLIC_CONTACT_WHATSAPP=554797789479

# Regionalização (opcional — false = todos passam)
EMAGRECIMENTO_REGIONAL_ENABLED=false
```

### Obrigatórias (já devem existir)

| Variável | Descrição | Exemplo |
|----------|-----------|---------|
| `NEXT_PUBLIC_SUPABASE_URL` | URL do Supabase | `https://xxx.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Chave anônima Supabase | `eyJ...` |
| `SUPABASE_SERVICE_ROLE_KEY` | Chave service role (backend) | `eyJ...` |
| `SUPABASE_URL` | URL Supabase (fallback) | `https://xxx.supabase.co` |
| `ASAAS_API_KEY` | Chave API Asaas | `$aact_prod_...` |
| `ASAAS_ENVIRONMENT` | Ambiente Asaas | `production` |
| `ASAAS_PRICE_EMAGRECIMENTO_BASICO` | Preço Programa 1m (centavos) | `200000` |
| `ASAAS_PRICE_EMAGRECIMENTO_COMPLETO` | Preço Programa 3m (centavos) | `400000` |
| `ASAAS_PRICE_EMAGRECIMENTO_PREMIUM` | Preço Programa 6m (centavos) | `600000` |
| `NEXT_PUBLIC_BASE_URL` | URL base do site | `https://www.mejoy.com.br` |
| `NEXT_PUBLIC_SITE_URL` | URL do site | `https://www.mejoy.com.br` |
| `NEXT_PUBLIC_CONTACT_WHATSAPP` | Número WhatsApp (sem +) | `554797789479` |
| `WEBHOOK_ASAAS_URL` | URL do webhook Asaas | `https://www.mejoy.com.br/api/asaas/webhook` |

### Opcionais (para regionalização)

| Variável | Descrição | Valor padrão |
|----------|-----------|--------------|
| `EMAGRECIMENTO_REGIONAL_ENABLED` | Ativa whitelist Navegantes | `false` = todos passam |
| `NEXT_PUBLIC_EMAGRECIMENTO_REGIONAL_ENABLED` | Mesmo, para client | `false` |

**Quando `EMAGRECIMENTO_REGIONAL_ENABLED=true`:**
- CEP 88370-xxx (Navegantes/SC) → fluxo normal até pagamento
- Outros CEPs → lista de espera + WhatsApp

**Quando `false` ou não definido:** todos passam (comportamento nacional).

---

## 2. MIGRATION SUPABASE (lista de espera)

A tabela `emagrecimento_waitlist` é necessária para o fluxo fora da whitelist.

```bash
cd /Users/teobeckert/desenvolvimento/mejoy
supabase db push
```

**Ou executar manualmente** no painel Supabase (SQL Editor):

```sql
-- Arquivo: supabase/migrations/20250314000001_emagrecimento_waitlist.sql
CREATE TABLE IF NOT EXISTS public.emagrecimento_waitlist (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  nome text NOT NULL,
  email text NOT NULL,
  whatsapp text,
  cep text,
  cidade text,
  estado text,
  report_id text,
  triage_id text,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_emagrecimento_waitlist_email ON public.emagrecimento_waitlist(email);
CREATE INDEX IF NOT EXISTS idx_emagrecimento_waitlist_created ON public.emagrecimento_waitlist(created_at);

COMMENT ON TABLE public.emagrecimento_waitlist IS 'Leads para lista de espera do programa de emagrecimento (fora da região atendida)';
```

---

## 3. WEBHOOK ASAAS

No painel Asaas:

1. **Configurações** → **Webhooks**
2. URL: `https://www.mejoy.com.br/api/asaas/webhook`
3. Eventos: `PAYMENT_RECEIVED`, `PAYMENT_CONFIRMED`, `PAYMENT_OVERDUE`, etc.
4. Token (se configurado): deve coincidir com `ASAAS_WEBHOOK_TOKEN`

---

## 4. VALIDAÇÃO TÉCNICA (antes do deploy)

```bash
pnpm run lint
pnpm run build
```

Ambos devem passar sem erros.

---

## 5. DEPLOY

```bash
pnpm run deploy
```

Ou: push para `main` + Deploy Hook Vercel.

---

## 6. SMOKE TEST MANUAL (obrigatório antes de tráfego pago)

Execute os 3 cenários abaixo em **produção** (`https://www.mejoy.com.br`).

Ver roteiro completo em: **`docs/EMAGRECIMENTO-SMOKE-TEST-MANUAL.md`**

---

## 7. GO / NO-GO

| Item | Status |
|------|--------|
| Env vars configuradas | ☐ |
| Migration executada | ☐ |
| Webhook Asaas ok | ☐ |
| Lint + Build passando | ☐ |
| Deploy concluído | ☐ |
| Cenário 1 (whitelist) passou | ☐ |
| Cenário 2 (fora whitelist) passou | ☐ |
| Cenário 3 (regressão) passou | ☐ |

**Se todos os itens estiverem marcados:** ✅ **PODE LANÇAR**

---

**Última atualização:** 14/03/2025
