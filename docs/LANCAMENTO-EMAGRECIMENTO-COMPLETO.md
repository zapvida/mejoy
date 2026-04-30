# 🚀 Lançamento Emagrecimento — Guia Completo

> **Status:** Código validado (lint + build). Execute os passos manuais abaixo para lançamento perfeito e estável.

---

## ✅ O QUE JÁ ESTÁ PRONTO

- Fluxo LP → Triagem → Relatório → Checkout → Pagamento → Obrigado
- Planos: 1m (R$ 2.000), 3m (R$ 4.000), 6m (R$ 6.000) em 12x
- Benefícios: Clínico + Nutricionista + Psicólogo + Retorno + Exames + Acompanhamento
- Botão "Falar com médico" (plantão ZapVida) em LP, relatório e checkout
- Lint e build passando

---

## 📋 PASSOS MANUAIS (ordem)

### 1. Validação técnica local

```bash
cd /Users/teobeckert/desenvolvimento/mejoy
pnpm run lint
pnpm run build
```

Ambos devem passar.

---

### 2. Variáveis de ambiente (Vercel)

**Vercel → Project zapfarm → Settings → Environment Variables → Production**

Cole ou confira estas variáveis:

```
# Emagrecimento — preços em centavos (1m R$2k, 3m R$4k, 6m R$6k)
ASAAS_PRICE_EMAGRECIMENTO_BASICO=200000
ASAAS_PRICE_EMAGRECIMENTO_COMPLETO=400000
ASAAS_PRICE_EMAGRECIMENTO_PREMIUM=600000

# WhatsApp (número sem +)
NEXT_PUBLIC_CONTACT_WHATSAPP=554797789479

# URLs base
NEXT_PUBLIC_BASE_URL=https://www.mejoy.com.br
NEXT_PUBLIC_SITE_URL=https://www.mejoy.com.br

# Webhook Asaas
WEBHOOK_ASAAS_URL=https://www.mejoy.com.br/api/asaas/webhook
```

**Já devem existir (conferir):**
- `ASAAS_API_KEY`
- `ASAAS_ENVIRONMENT` = `production`
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `SUPABASE_URL` (ou igual a NEXT_PUBLIC_SUPABASE_URL)

---

### 3. SQL Supabase (opcional — lista de espera)

**Só necessário se** você implementar regionalização (whitelist Navegantes) no futuro.

**Supabase → SQL Editor → New query → Cole e execute:**

```sql
-- Lista de espera para programa de emagrecimento (fora da whitelist regional)
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

### 4. Webhook Asaas

**Asaas → Configurações → Webhooks**

- **URL:** `https://www.mejoy.com.br/api/asaas/webhook`
- **Eventos:** PAYMENT_RECEIVED, PAYMENT_CONFIRMED, PAYMENT_OVERDUE, etc.
- **Token:** Se `ASAAS_WEBHOOK_TOKEN` estiver na Vercel, use o mesmo valor no Asaas.

---

### 5. Deploy

```bash
cd /Users/teobeckert/desenvolvimento/mejoy
pnpm run deploy
```

Ou: push para `main` + Deploy Hook.

---

### 6. Smoke test manual (produção)

**Após o deploy**, execute em `https://www.mejoy.com.br`:

| # | Ação | Esperado |
|---|------|----------|
| 1 | Abrir `/emagrecimento` | LP carrega |
| 2 | Clicar "Iniciar minha avaliação" | Vai para `/triagem/emagrecimento` |
| 3 | Completar triagem | Relatório é gerado |
| 4 | Clicar "Iniciar com este plano" | Vai para checkout |
| 5 | Step 1: preencher dados | Botão "Continuar" habilita |
| 6 | Step 2: preencher endereço | Avança para planos |
| 7 | Step 3: selecionar plano | Avança para pagamento |
| 8 | Step 4: PIX ou cartão | QR Code ou link de pagamento |
| 9 | Após pagamento | Página obrigado + WhatsApp |

---

## 📦 ENV VARS — COPY-PASTE COMPLETO

```bash
# === EMAGRECIMENTO ===
ASAAS_PRICE_EMAGRECIMENTO_BASICO=200000
ASAAS_PRICE_EMAGRECIMENTO_COMPLETO=400000
ASAAS_PRICE_EMAGRECIMENTO_PREMIUM=600000

# === WHATSAPP ===
NEXT_PUBLIC_CONTACT_WHATSAPP=554797789479

# === BASE ===
NEXT_PUBLIC_BASE_URL=https://www.mejoy.com.br
NEXT_PUBLIC_SITE_URL=https://www.mejoy.com.br

# === WEBHOOK ===
WEBHOOK_ASAAS_URL=https://www.mejoy.com.br/api/asaas/webhook
```

---

## 📄 SQL — COPY-PASTE COMPLETO

```sql
-- Lista de espera emagrecimento (opcional)
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

COMMENT ON TABLE public.emagrecimento_waitlist IS 'Leads para lista de espera do programa de emagrecimento';
```

---

## ✅ CHECKLIST FINAL

| Item | Status |
|------|--------|
| Lint passou | ☐ |
| Build passou | ☐ |
| Env vars na Vercel | ☐ |
| Webhook Asaas configurado | ☐ |
| Deploy concluído | ☐ |
| Smoke test em produção | ☐ |

**Se todos marcados:** ✅ **PODE LANÇAR**

---

**Última atualização:** 14/03/2025
