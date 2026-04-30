# Setup manual – Copy & Paste

Tudo pronto para copiar e colar. Sem erros.

---

## 1. SQL – Supabase (executar no SQL Editor)

**Onde:** Supabase Dashboard → SQL Editor → New query

### Migration 1: magic_links (Magic Link via WhatsApp)

```sql
-- Tabela magic_links para tokens de acesso sem senha (Magic Link via WhatsApp)
-- Usado pós-triagem: cliente recebe link no WhatsApp e acessa dashboard em 1 clique

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

COMMENT ON TABLE public.magic_links IS 'Tokens Magic Link para acesso ao dashboard sem senha via WhatsApp';
```

### Migration 2: lead_funnel_steps (funil admin)

```sql
-- Tabela lead_funnel_steps para rastreamento "onde entrou / onde parou"
-- Usado no admin para métricas de funil por produto

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

COMMENT ON TABLE public.lead_funnel_steps IS 'Etapas do funil por lead para admin e métricas';
```

---

## 2. Envs – Vercel (Settings → Environment Variables)

**Onde:** https://vercel.com/monjoy-mejoy/zapfarm/settings/environment-variables

### Se ainda não existir ou precisar ajustar

| Name | Value | Environments |
|------|-------|--------------|
| `EVOLUTION_MAGIC_LINK_ENABLED` | `true` | Production, Preview, Development |
| `EVOLUTION_API_URL` | `https://sua-instancia.evolution-api.com` | Production, Preview, Development |
| `EVOLUTION_INSTANCE` | `mejoy-prod` | Production, Preview, Development |
| `EVOLUTION_API_KEY` | `sua_api_key_aqui` | Production, Preview, Development |
| `ADMIN_SECRET_KEY` | *(gerar 64 chars aleatórios)* | Production, Preview, Development |
| `NEXT_PUBLIC_ADMIN_SECRET_KEY` | *(mesmo valor de ADMIN_SECRET_KEY)* | Production, Preview, Development |

### Gerar ADMIN_SECRET_KEY (64 chars)

```bash
openssl rand -base64 48
```

Use o resultado como valor de `ADMIN_SECRET_KEY` e `NEXT_PUBLIC_ADMIN_SECRET_KEY`.

### Importante

- `EVOLUTION_MAGIC_LINK_ENABLED=false` → desativa envio de Magic Link via WhatsApp.
- Para ativar: `EVOLUTION_MAGIC_LINK_ENABLED=true`.
- Troque `EVOLUTION_API_URL`, `EVOLUTION_INSTANCE` e `EVOLUTION_API_KEY` pelos valores reais da sua Evolution API.

---

## 3. Alternativa: Supabase via CLI

Se tiver Supabase CLI configurado:

```bash
cd /Users/teobeckert/desenvolvimento/mejoy
supabase db push
```

---

## 4. Depois de aplicar

1. Redeploy na Vercel (ou aguardar próximo deploy).
2. Conferir: https://www.mejoy.com.br/admin
3. Testar triagem completa → relatório → (se Evolution ativo) Magic Link no WhatsApp.

---

## 5. Deploy Hook (se deploy não aparecer)

GitHub → https://github.com/zapfarmx/zapfarm/settings/secrets/actions

| Secret | Valor |
|--------|-------|
| `VERCEL_DEPLOY_HOOK` | `https://api.vercel.com/v1/integrations/deploy/prj_HxEANEHVT9ixnoCJp43uZKAMHgST/OZ657hY5nr` |
| `DEPLOYER_EMAIL` | Email de quem tem acesso ao time Vercel (monjoy-mejoy) |
