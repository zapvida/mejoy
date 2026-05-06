# Setup manual — copiar e colar

**MeJoy · mejoy.com.br** — Tudo que falta fazer manualmente, pronto para copiar e colar. Validado para lançamento contínuo.

---

## 0. Usuário de teste (login com senha)

Para validar o fluxo completo como paciente:

```bash
cd /Users/teobeckert/desenvolvimento/mejoy
pnpm run setup:test-user
```

**Credenciais geradas:**
- Email: `paciente-teste@mejoy.com.br`
- Senha: `Teste123!`

**Teste:** https://www.mejoy.com.br/login → Tab "E-mail e senha"

---

## 1. SQL — executar no Supabase

Acesse: **Supabase Dashboard → SQL Editor** e execute cada bloco.

### 1.1 Tabela `magic_links`

```sql
-- Tabela magic_links para tokens de acesso sem senha (Magic Link via WhatsApp)
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

### 1.2 Tabela `lead_funnel_steps`

```sql
-- Tabela lead_funnel_steps para rastreamento "onde entrou / onde parou"
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

## 2. Env vars — Vercel (se faltar)

Acesse: **Vercel → Project zapfarm (monjoy-mejoy) → Settings → Environment Variables**

### 2.1 Ativar Magic Link via WhatsApp

| Name | Value | Environments |
|------|-------|---------------|
| `EVOLUTION_MAGIC_LINK_ENABLED` | `true` | Production, Preview |

Se já existir, edite e garanta que o valor seja `true` (não `false` nem `0`).

### 2.2 Evolution API (se ainda não configurou)

| Name | Value | Environments |
|------|-------|---------------|
| `EVOLUTION_API_URL` | `https://evo.zapvida.com` (ou URL da sua Evolution API) | Production |
| `EVOLUTION_INSTANCE` | `alloehealth` | Production |
| `EVOLUTION_API_KEY` | `91DBFEC04BD5-4F8D-8BBD-3F205E18B759` | Production |

Substitua pelos valores reais da sua instância Evolution API.

---

## 3. Comando alternativo — migrations via CLI

Se preferir usar o Supabase CLI em vez do SQL Editor:

```bash
cd /Users/teobeckert/desenvolvimento/mejoy
supabase db push
```

---

## 4. Validação rápida

1. **SQL:** No Supabase SQL Editor:
   ```sql
   SELECT table_name FROM information_schema.tables 
   WHERE table_schema = 'public' 
   AND table_name IN ('magic_links', 'lead_funnel_steps');
   ```
   Deve retornar 2 linhas.

2. **Env:** `vercel env ls` — conferir se `EVOLUTION_MAGIC_LINK_ENABLED` existe e está em Production.

3. **Health check:** `GET /api/health/zapfarm` — retorna `evolution.ready: true` quando EVOLUTION_* estão configurados e enabled.

4. **Fluxo:** Fazer uma triagem completa → finalizar → conferir se o Magic Link chega no WhatsApp (Zapvidax) → clicar → deve abrir o dashboard.

---

## 5. Supabase — Redirect URLs (obrigatório)

**Supabase Dashboard** → Authentication → URL Configuration

**Site URL:**
```
https://www.mejoy.com.br
```

**Redirect URLs (adicionar todas):**
```
https://www.mejoy.com.br/auth/callback
https://www.mejoy.com.br/**
http://localhost:3000/auth/callback
http://localhost:3000/**
```

---

## 6. Resend + templates de e-mail (Magic Link sem fricção)

**Importante:** O login usa **Magic Link** (link no e-mail), não OTP de 6 dígitos. O usuário clica no link e entra direto — sem digitar código.

### 6.1 Custom SMTP (Resend)

**Supabase Dashboard** → Authentication → Providers → Email → **Enable Custom SMTP**

| Campo | Valor |
|-------|-------|
| Host | `smtp.resend.com` |
| Port | `465` |
| User | `resend` |
| Password | sua `RESEND_API_KEY` |

### 6.2 Personalizar templates

**Supabase Dashboard** → Authentication → **Email Templates** → **Magic Link**

**Assunto (Subject):**
```
Acesse seu painel MeJoy
```

**Corpo (Body) — Magic Link (tab "Link"):**
```html
<h2>Olá!</h2>
<p>Clique no link abaixo para acessar seu painel de saúde:</p>
<p><a href="{{ .ConfirmationURL }}" style="background:#10b981;color:white;padding:12px 24px;text-decoration:none;border-radius:8px;display:inline-block;">Acessar meu painel</a></p>
<p>Ou copie e cole no navegador:</p>
<p style="word-break:break-all;color:#666;">{{ .ConfirmationURL }}</p>
<p style="color:#999;font-size:12px;">Este link expira em 24 horas. Se não foi você, ignore este e-mail.</p>
```

**Para OTP (tab "Código"):** Use `{{ .Token }}` em vez de `{{ .ConfirmationURL }}`:
```html
<h2>Olá!</h2>
<p>Seu código de acesso:</p>
<p style="font-size:28px;font-weight:bold;letter-spacing:0.3em;">{{ .Token }}</p>
<p style="color:#999;font-size:12px;">Este código expira em 1 hora. Se não foi você, ignore este e-mail.</p>
```

**Nota:** Só um template por vez. Escolha Link ou Código conforme preferir.

Salve as alterações.

---

## 7. Checklist pré-lançamento (validado)

### Infra
- [ ] SQL executado (magic_links, lead_funnel_steps)
- [ ] Envs conferidas na Vercel (Production)
- [ ] `NEXT_PUBLIC_BASE_URL=https://www.mejoy.com.br`
- [ ] `NEXT_PUBLIC_SITE_URL=https://www.mejoy.com.br`
- [ ] Redirect URLs configuradas no Supabase (seção 5)
- [ ] `EVOLUTION_MAGIC_LINK_ENABLED=true` (se usar WhatsApp)
- [ ] Templates de e-mail personalizados (opcional)
- [ ] `NEXT_PUBLIC_TIRZEPATIDA_ENABLED=1` (se quiser Tirzepatida na vitrine)
- [ ] `pnpm run deploy` ou redeploy manual

### Usuário de teste
- [ ] `pnpm run setup:test-user` executado (ou criado manualmente no Supabase)
- [ ] Login com senha testado em produção

---

## 8. Checklist de validação pós-deploy

### Auth
- [ ] Magic Link: email recebido e login funciona
- [ ] Senha: `paciente-teste@mejoy.com.br` / `Teste123!` → dashboard
- [ ] Google: login com conta Google (se habilitado)
- [ ] Redirect: após login vai para `/dashboard` (ou `?redirect=`)

### Dashboard e fluxos
- [ ] Dashboard carrega métricas
- [ ] Check-up → `/protocolos` → triagem
- [ ] Relatórios → lista e visualização
- [ ] Produtos → catálogo
- [ ] Assinatura → checkout Asaas/PIX
- [ ] Chat → mensagens e resposta da IA

### Compras
- [ ] Triagem → Relatório → CTA "Ver Produtos" → Checkout
- [ ] Checkout Asaas/PIX → pagamento e confirmação
- [ ] Download PDF do relatório

---

## 9. Redeploy

```bash
pnpm run deploy
```

Ou: Vercel → Deployments → Redeploy (último deploy).

---

## 10. Validação pós-deploy (mejoy.com.br)

1. **Home:** https://www.mejoy.com.br → Loja B2C (MeJoy)
2. **Produtos:** https://www.mejoy.com.br/produtos → Catálogo completo
3. **Protocolos:** https://www.mejoy.com.br/protocolos → Check-up gratuito
4. **Login:** https://www.mejoy.com.br/login → Magic Link ou E-mail e senha → `/dashboard`
5. **Teste paciente:** `paciente-teste@mejoy.com.br` / `Teste123!` (após `pnpm run setup:test-user`)

---

---

## 11. Deploy contínuo

```bash
pnpm run deploy
```

Ou: `git push origin main` (se Deploy Hook configurado).

**Validação pós-deploy:** Home → Produtos → Protocolos → Login. Todas devem carregar em < 3s.

---

## 12. Passos manuais finais (após deploy)

1. **Supabase:** Configurar Redirect URLs (seção 5) se ainda não fez
2. **Supabase:** SMTP (Resend) para Magic Link por email (seção 6)
3. **Usuário de teste:** Rodar `pnpm run setup:test-user` (usa .env.local do projeto — rode localmente com as credenciais de produção no .env.local, ou crie manualmente no Supabase Dashboard)
4. **Vercel:** Conferir envs `NEXT_PUBLIC_SITE_URL`, `OPENAI_API_KEY`, Supabase, Asaas
5. **Validar:** Login com senha → Dashboard → Check-up → Relatórios → Chat → Assinatura

---

**Pronto para lançamento contínuo.** Última atualização: Fevereiro 2025.
