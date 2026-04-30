# Copy-Paste: Setup Manual (SQL + ENV)

**Use este arquivo para copiar e colar sem erro.**

---

## 1. SQL — Supabase (SQL Editor)

Acesse: **Supabase Dashboard → SQL Editor → New Query**

Cole o bloco abaixo e execute (Run):

```sql
-- ============================================
-- MIGRATION 1: magic_links (Magic Link WhatsApp)
-- ============================================
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

-- ============================================
-- MIGRATION 2: lead_funnel_steps (Funil Admin)
-- ============================================
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

## 2. ENV — Vercel (Settings → Environment Variables)

**Você já tem as 4 Evolution + ADMIN no Vercel.** Só precisa garantir que os **valores** estão corretos:

| Variável | Valor esperado | Status |
|----------|----------------|--------|
| `EVOLUTION_API_URL` | URL real da sua Evolution API (ex: `https://api.evolutionapi.com`) | ⚠️ Trocar placeholder |
| `EVOLUTION_INSTANCE` | Nome da instância (ex: `mejoy-prod`) | ⚠️ Trocar placeholder |
| `EVOLUTION_API_KEY` | API Key real da Evolution | ⚠️ Trocar placeholder |
| `EVOLUTION_MAGIC_LINK_ENABLED` | `true` para ativar envio WhatsApp | ⚠️ Deve ser `true` |
| `ADMIN_SECRET_KEY` | Token seguro 64+ chars | ⚠️ Gerar se for placeholder |
| `NEXT_PUBLIC_ADMIN_SECRET_KEY` | Mesmo valor de `ADMIN_SECRET_KEY` | ⚠️ Mesmo valor |

### Comandos para adicionar/atualizar (se faltar):

```bash
# Evolution (substitua pelos valores reais)
vercel env add EVOLUTION_API_URL production
# digite: https://SUA_URL_EVOLUTION_API

vercel env add EVOLUTION_INSTANCE production
# digite: mejoy-prod

vercel env add EVOLUTION_API_KEY production
# digite: sua_api_key_real

vercel env add EVOLUTION_MAGIC_LINK_ENABLED production
# digite: true

# Admin (gerar token: openssl rand -hex 32)
vercel env add ADMIN_SECRET_KEY production
# digite: token_gerado_64_chars

vercel env add NEXT_PUBLIC_ADMIN_SECRET_KEY production
# digite: mesmo_token_do_ADMIN_SECRET_KEY
```

### Gerar token admin seguro:

```bash
openssl rand -hex 32
```

---

## 3. Verificação rápida

Depois de rodar SQL e conferir ENV:

1. **SQL:** Supabase → Table Editor → deve existir `magic_links` e `lead_funnel_steps`
2. **ENV:** `vercel env ls` — todas as 6 acima devem aparecer
3. **Redeploy:** Vercel → Deployments → Redeploy último deploy
4. **Teste:** Triagem completa → WhatsApp com Magic Link → clicar → login no dashboard

---

## 4. O que NÃO falta (já configurado)

- Supabase URL, Anon Key, Service Role
- Asaas (API, preços, webhook)
- Resend, NextAuth, OpenAI
- NEXT_PUBLIC_SITE_URL, NEXT_PUBLIC_BASE_URL
