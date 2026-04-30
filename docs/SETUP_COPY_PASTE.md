# Setup Copy-Paste — Magic Link + Admin

Tudo pronto para copiar e colar. Sem erros.

---

## 1. SQL — Supabase SQL Editor

Acesse: **Supabase Dashboard → SQL Editor → New query**  
Cole o bloco abaixo e execute (**Run**):

```sql
-- ============================================
-- 1) Tabela magic_links (Magic Link via WhatsApp)
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
-- 2) Tabela lead_funnel_steps (funil admin)
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

## 2. Variáveis de ambiente — Vercel

Acesse: **Vercel → Project zapfarm → Settings → Environment Variables**

### Já configuradas (você tem)

| Nome | Status |
|------|--------|
| ADMIN_SECRET_KEY | ✅ |
| NEXT_PUBLIC_ADMIN_SECRET_KEY | ✅ |
| EVOLUTION_API_URL | ✅ |
| EVOLUTION_INSTANCE | ✅ |
| EVOLUTION_API_KEY | ✅ |
| EVOLUTION_MAGIC_LINK_ENABLED | ✅ |

### O que verificar

1. **EVOLUTION_MAGIC_LINK_ENABLED**  
   Em **Production** deve estar `true` para enviar Magic Link via WhatsApp.  
   Se estiver `false`, o fluxo não envia.

2. **EVOLUTION_API_URL**  
   Exemplo: `https://sua-instancia.evolution-api.com`  
   Sem barra no final.  
   Evolution v2 pode usar outro path; ajuste conforme documentação.

3. **EVOLUTION_INSTANCE**  
   Nome da instância (ex.: `mejoy-prod` ou `mejoy`).

4. **ADMIN_SECRET_KEY**  
   Use um token forte (ex.: 64+ caracteres).  
   `NEXT_PUBLIC_ADMIN_SECRET_KEY` deve estar com o mesmo valor.

### Se faltar alguma (adicionar)

```bash
# Adicionar via Vercel CLI (opcional)
vercel env add EVOLUTION_MAGIC_LINK_ENABLED production
# Valor: true

vercel env add EVOLUTION_API_URL production
# Valor: https://URL_DA_SUA_INSTANCIA

vercel env add EVOLUTION_INSTANCE production
# Valor: mejoy-prod

vercel env add EVOLUTION_API_KEY production
# Valor: sua_api_key
```

---

## 3. Checklist rápido

| Passo | Status |
|-------|--------|
| [ ] SQL executado no Supabase | |
| [ ] EVOLUTION_MAGIC_LINK_ENABLED=true em Production | |
| [ ] EVOLUTION_API_URL, EVOLUTION_INSTANCE, EVOLUTION_API_KEY corretos | |
| [ ] Instância Evolution conectada e funcionando | |
| [ ] Redeploy na Vercel após alterar envs | |
| [ ] Teste: triagem completa com WhatsApp → receber Magic Link | |

---

## 4. Comando alternativo (SQL via CLI)

Se preferir usar a CLI do Supabase:

```bash
cd /Users/teobeckert/desenvolvimento/mejoy
supabase db push
```

---

## 5. Roteiro de teste

1. Executar o SQL no Supabase.
2. Configurar/verificar as envs na Vercel.
3. Fazer redeploy na Vercel.
4. Fazer uma triagem completa (emagrecimento, calvície, etc.) com WhatsApp válido.
5. Conferir se o Magic Link chega no WhatsApp.
6. Clicar no link e confirmar que o login redireciona para `/dashboard`.
