# Launch Canonico - Evolution ZapVida + MeJoy

## Objetivo

Colocar a instância `zapvida` da Evolution como instância principal de WhatsApp do `mejoy`, mantendo:

1. `handoff` MeJoy -> ZapVida para a jornada clínica.
2. Evolution para notificações automáticas por WhatsApp.
3. Webhook inbound da Evolution para resposta inicial via `MENU`.
4. Asaas disparando notificações pós-pagamento.

## Decisão recomendada

Sim, a instância `zapvida` pode ser a principal do `mejoy`.

O código atual já suporta uma instância principal única via:

- `EVOLUTION_API_URL`
- `EVOLUTION_INSTANCE`
- `EVOLUTION_API_KEY`
- `EVOLUTION_MAGIC_LINK_ENABLED`

Sem refatoração extra, basta apontar:

- `EVOLUTION_INSTANCE=zapvida`

## Arquitetura final recomendada

### 1. Canal clínico principal

Usar `handoff` assinado do MeJoy para o ZapVida:

- origem: `POST /api/handoff/create`
- destino: URL do ZapVida em `NEXT_PUBLIC_ZAPVIDA_HANDOFF_URL`
- callback: `POST /api/handoff/status`
- rastreabilidade: `public.handoff_events`

### 2. Canal WhatsApp operacional

Usar Evolution para:

- envio do magic link após relatório pronto
- envio de mensagens após pagamento confirmado
- resposta automática quando o usuário enviar `MENU`

### 3. CTA público de WhatsApp

Os links públicos `wa.me` continuam controlados por:

- `NEXT_PUBLIC_CONTACT_WHATSAPP`
- `NEXT_PUBLIC_WHATSAPP_CTA`

## Regra importante sobre a URL da Evolution

### O que usar em produção

Use a URL base da API da Evolution, nunca a tela `/manager`.

Exemplo correto:

```bash
EVOLUTION_API_URL=https://evo.zapvida.com
```

ou, se a API realmente estiver exposta apenas na porta 8080:

```bash
EVOLUTION_API_URL=http://evo.zapvida.com:8080
```

### O que nao usar

Nao usar:

- `http://evo.zapvida.com:8080/manager`
- `http://evo.zapvida.com:8080/manager/instance/.../dashboard`

porque o codigo chama:

- `POST {EVOLUTION_API_URL}/message/sendText/{instance}`
- `POST {EVOLUTION_API_URL}/message/sendMedia/{instance}`

Logo, `EVOLUTION_API_URL` precisa ser a raiz da API.

### Recomendacao de seguranca

Para producao estavel, o ideal e:

1. publicar a Evolution atras de HTTPS
2. evitar `http://` puro em producao
3. evitar expor painel manager publicamente sem protecao adicional
4. preferir hostname dedicado, ex.: `https://evolution.zapvida.com`

## Riscos atuais encontrados

### 1. URL HTTP com porta 8080

Isso funciona como acesso administrativo, mas nao e o desenho ideal para producao:

- trafego sem TLS se usar `http://`
- superficie maior de exposicao do manager
- maior chance de bloqueio por proxy, firewall ou WAF

### 2. Documentacao inconsistente do webhook Asaas

A rota canonica atual do codigo e:

- `https://www.mejoy.com.br/api/webhooks/asaas`

Existe compatibilidade com a rota legada:

- `https://www.mejoy.com.br/api/asaas/webhook`

Mas, para evitar ambiguidade operacional, padronizar em:

```bash
WEBHOOK_ASAAS_URL=https://www.mejoy.com.br/api/webhooks/asaas
```

### 3. Indicacao de credencial sensivel em documentacao

Se existir qualquer chave real da Evolution registrada em docs do repositorio, tratar como comprometida e rotacionar antes do go-live.

## ENVs obrigatorias para producao

### Handoff MeJoy -> ZapVida

```bash
HANDOFF_TOKEN_SECRET=gerar_token_forte_64_chars
HANDOFF_CALLBACK_SECRET=gerar_outro_token_forte_64_chars
HANDOFF_TOKEN_TTL_SECONDS=900
HANDOFF_CALLBACK_TOLERANCE_SECONDS=300
NEXT_PUBLIC_ZAPVIDA_HANDOFF_URL=https://zapvida.com/quiz/emagrecimento
NEXT_PUBLIC_PARTNER_ZAPVIDA_URL=https://zapvida.com/programas/emagrecimento
NEXT_PUBLIC_PARTNER_ZAPFARM_URL=https://zapfarm.com.br/
```

### Evolution principal

```bash
EVOLUTION_MAGIC_LINK_ENABLED=true
EVOLUTION_API_URL=https://evo.zapvida.com
EVOLUTION_INSTANCE=zapvida
EVOLUTION_API_KEY=preencher_no_vercel
```

Se a API ainda nao estiver em HTTPS reverso:

```bash
EVOLUTION_API_URL=http://evo.zapvida.com:8080
```

### CTA publico WhatsApp

```bash
NEXT_PUBLIC_CONTACT_WHATSAPP=55DDDNUMERO
NEXT_PUBLIC_WHATSAPP_CTA=https://wa.me/55DDDNUMERO
```

### Base app / magic link

```bash
NEXT_PUBLIC_BASE_URL=https://www.mejoy.com.br
NEXT_PUBLIC_SITE_URL=https://www.mejoy.com.br
NEXT_PUBLIC_SUPABASE_URL=preencher_no_vercel
NEXT_PUBLIC_SUPABASE_ANON_KEY=preencher_no_vercel
SUPABASE_SERVICE_ROLE_KEY=preencher_no_vercel
```

### Asaas para notificacoes pos-pagamento

```bash
WEBHOOK_ASAAS_URL=https://www.mejoy.com.br/api/webhooks/asaas
ASAAS_WEBHOOK_TOKEN=gerar_token_forte
```

## SQLs obrigatorios para o launch

### 1. Magic links

Necessario para envio de acesso em 1 clique apos relatorio e pos-pagamento.

```sql
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
```

### 2. Lead funnel steps

Necessario para rastrear etapa do lead no admin.

```sql
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
```

### 3. Handoff events

Necessario para rastreabilidade do fluxo MeJoy -> ZapVida.

```sql
CREATE TABLE IF NOT EXISTS public.handoff_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  handoff_id text NOT NULL,
  status text NOT NULL,
  event_name text,
  triage_id text NOT NULL,
  report_id text,
  order_id text,
  patient_id text,
  program_slug text NOT NULL DEFAULT 'emagrecimento',
  recommended_queue text,
  source_system text NOT NULL DEFAULT 'mejoy',
  target_system text NOT NULL DEFAULT 'zapvida',
  consent_status text,
  utm jsonb NOT NULL DEFAULT '{}'::jsonb,
  identity jsonb NOT NULL DEFAULT '{}'::jsonb,
  envelope jsonb NOT NULL,
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_handoff_events_handoff_id
  ON public.handoff_events(handoff_id);

CREATE INDEX IF NOT EXISTS idx_handoff_events_status
  ON public.handoff_events(status);

CREATE INDEX IF NOT EXISTS idx_handoff_events_created_at
  ON public.handoff_events(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_handoff_events_program_slug
  ON public.handoff_events(program_slug);
```

## Ordem de lancamento

1. Aplicar os tres SQLs no Supabase de producao.
2. Configurar as envs de handoff.
3. Configurar as envs da Evolution com `EVOLUTION_INSTANCE=zapvida`.
4. Configurar webhook da Evolution para:
   - `https://www.mejoy.com.br/api/evolution/webhook`
5. Configurar webhook do Asaas para:
   - `https://www.mejoy.com.br/api/webhooks/asaas`
6. Redeploy do projeto.
7. Validar health, handoff, relatorio, WhatsApp e pagamento.

## Validacao minima obrigatoria

### Check tecnico

```bash
pnpm validate:handoff:env
pnpm test:handoff
```

### Smoke manual

1. Abrir `/emagrecimento`
2. Concluir a triagem com WhatsApp e email validos
3. Confirmar relatorio gerado
4. Confirmar `POST /api/handoff/create` com `redirectUrl`
5. Abrir ZapVida e validar leitura do token
6. Confirmar registros `created` e `sent` em `public.handoff_events`
7. Enviar callback `opened` para `/api/handoff/status`
8. Confirmar novo evento em `public.handoff_events`
9. Executar compra teste e validar webhook Asaas
10. Confirmar disparo WhatsApp pos-pagamento

## Go / no-go

### Pode declarar go-live quando

- `pnpm test:handoff` passar
- `pnpm validate:handoff:env` passar com envs reais
- tabela `magic_links` existir
- tabela `lead_funnel_steps` existir
- tabela `handoff_events` existir
- Evolution responder envio real na instância `zapvida`
- webhook Asaas estiver apontando para `/api/webhooks/asaas`
- handoff abrir ZapVida sem erro de assinatura
- callback `opened` gravar no banco
- pagamento teste disparar email + WhatsApp

### Nao declarar go-live quando

- `EVOLUTION_API_URL` estiver usando `/manager`
- a API da Evolution estiver sem chave valida
- handoff estiver sem `HANDOFF_TOKEN_SECRET`
- callback estiver sem `HANDOFF_CALLBACK_SECRET`
- a rota do webhook Asaas estiver divergente no painel
- existir suspeita de chave exposta sem rotacao

## Estado da validacao local nesta analise

- `pnpm test:handoff`: aprovado
- `pnpm validate:handoff:env`: reprovado por ausencia local das envs obrigatorias

Isso indica que o contrato de integracao esta pronto no codigo, mas o runtime ainda precisa ser completado com as credenciais e URLs finais antes do lancamento.
