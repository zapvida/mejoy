# MeJoy Handoff Contract

## Escopo
- Origem: `POST /api/handoff/create`
- Destino clínico: ZapVida
- Callback/status: `POST /api/handoff/status`
- Persistência: `public.handoff_events`
- Versão emitida: `1.1`
- Compatibilidade aceita: `1.0`

## Garantias do contrato
- Envelope assinado com HMAC SHA-256.
- Compatibilidade retroativa para payload camelCase e snake_case.
- `correlation_id` gerado quando ausente.
- `session_pseudo_id` aceito e devolvido sem PII.
- Idempotência por chave explícita ou derivada do contexto.
- Reuso do handoff ativo quando a mesma criação é repetida.
- Trilha append-only em `handoff_events`.

## Campos do envelope
### Root
- `handoff_version`
- `handoff_id`
- `correlation_id`
- `source_system`
- `target_system`
- `source_journey`
- `source_url`
- `created_at`
- `issued_at`
- `expires_at`
- `session_pseudo_id`
- `signature`
- `metadata`

### `journey`
- `triage_id`
- `report_id`
- `order_id`
- `quote_id`
- `prescription_id`
- `patient_id`
- `program_slug`
- `recommended_queue`
- `handoff_status`

### `consent`
- `consent_status`
- `consent_timestamp`

### `utm`
- `source`
- `medium`
- `campaign`
- `content`
- `term`
- `gclid`
- `fbclid`
- `ttclid`
- `msclkid`
- `ref`

### `identity`
- `email_hash`
- `phone_hash`

### `signature`
- `algorithm`
- `token_type`
- `key_source`
- `signed_at`
- `callback_auth_mode`

## `POST /api/handoff/create`
### Request
- Aceita camelCase e snake_case.
- Campos mínimos:
  - `triageId` ou `triage_id`
- Campos opcionais:
  - `reportId`, `orderId`, `quoteId`, `prescriptionId`
  - `correlationId`, `sessionPseudoId`
  - `sourceJourney`, `sourceUrl`
  - `programSlug`, `recommendedQueue`
  - `consentStatus`, `consentTimestamp`
  - `utm`
  - `metadata`
  - `Idempotency-Key` no header ou `idempotencyKey` no body

### Response
- `ok`
- `handoffId`
- `correlationId`
- `handoffToken`
- `redirectUrl`
- `envelope`
- `deduped` quando um handoff ativo é reutilizado

### Exemplo
```bash
curl -X POST https://www.mejoy.com.br/api/handoff/create \
  -H 'Content-Type: application/json' \
  -H 'Idempotency-Key: handoff:emagrecimento.report:triage-123:report-123:corr-123' \
  -d '{
    "triageId": "triage-123",
    "reportId": "report-123",
    "programSlug": "emagrecimento",
    "sourceJourney": "emagrecimento.report",
    "correlationId": "corr-123",
    "sessionPseudoId": "session-123",
    "consentStatus": "granted",
    "metadata": {
      "origin": "report_primary"
    }
  }'
```

## Máquina de estados
### Base
- `created`
- `sent`
- `opened`
- `accepted`
- `rejected`
- `expired`

### Continuidade clínica/comercial
- `consult_started`
- `clinical_payment_started`
- `clinical_payment_success`
- `consult_completed`
- `prescription_created`
- `quote_created`
- `pharmacy_order_started`
- `pharmacy_order_created`
- `order_paid`
- `order_delivered`
- `retention_started`
- `followup_started`
- `cancelled`
- `failed`

### Alias legado aceito
- `completed`

## Regras de transição
- Repetir o mesmo status é idempotente.
- Status terminais não aceitam regressão.
- Eventos fora da ordem retornam `409`.
- Status terminal pode encerrar o fluxo a partir de estado não terminal.

## Persistência em `handoff_events`
### Colunas-base usadas
- `handoff_id`
- `status`
- `event_name`
- `triage_id`
- `report_id`
- `order_id`
- `patient_id`
- `program_slug`
- `recommended_queue`
- `source_system`
- `target_system`
- `consent_status`
- `utm`
- `identity`
- `envelope`
- `metadata`
- `created_at`

### Metadados persistidos
- `event_id`
- `correlation_id`
- `schema_version`
- `occurred_at`
- `idempotency_key`
- `producer`
- `delivery_status`
- `transition_from`
- `transition_to`
- `auth_mode`
- `callback_nonce`
- `callback_timestamp`

## Erros esperados
- `400 Payload inválido`
- `400 Token inválido`
- `400 Token expirado`
- `401 Assinatura inválida`
- `405 Use POST`
- `409 Transição inválida`
- `409 Nonce já utilizado`
- `500 Falha ao criar handoff`

---

## Alinhamento com ZapVida (ecossistema pós-integração)

### Transporte (importante)
- **MeJoy não envia** `POST` para `program-intake` com o corpo completo do doente. O fluxo implementado é: **`POST /api/handoff/create` no MeJoy** → resposta com `redirectUrl` → utilizador abre URL no **ZapVida** com query `handoff` (token assinado) + `handoff_id` + `correlation_id` + UTMs.
- No ZapVida, o equivalente a “intake” ocorre **ao validar o token** na landing (ex.: quiz) e/ou rotas internas documentadas no repositório ZapVida. Qualquer doc que peça “MeJoy chama `POST …/program-intake`” deve ser tratada como **contrato alternativo ou camada interna do ZapVida**, não como substituto deste fluxo, salvo decisão explícita dos dois times.

### Fonte única no MeJoy (já implementado)
- `correlation_id`: gerado no servidor se ausente (`createHandoffEnvelope`).
- `handoff_version`: `1.1` (`HANDOFF_VERSION` em `src/lib/handoff/schema.ts`).
- `source_system`: literal `"mejoy"` no envelope.
- `journey.program_slug`, UTMs e consentimento: envelope + `buildZapVidaHandoffUrl` (UTMs também na query).

### Segredos partilhados (coordenação manual ZapVida ↔ MeJoy)
- MeJoy assina com **`HANDOFF_TOKEN_SECRET`** (HMAC SHA-256 sobre o payload do envelope; ver `signHandoffEnvelope`).
- No ZapVida podem existir nomes como `INTEGRATION_EVENT_SECRET`, `ZAPVIDA_INTERNAL_SIGNING_SECRET`, etc. **O valor que verifica o token MeJoy tem de ser o mesmo** que o MeJoy usa para assinar — confirmar no código/handlers do ZapVida qual env é lido para handoff MeJoy e igualar na Vercel do **projeto MeJoy** (`HANDOFF_TOKEN_SECRET`) e do **projeto ZapVida** (nome conforme o repo ZapVida).

### URLs
- **`NEXT_PUBLIC_ZAPVIDA_HANDOFF_URL`** (MeJoy, Vercel): deve ser a URL base do quiz/entrada clínica no ZapVida que **aceita** `?handoff=…` (sem hardcode no código além do fallback em `buildZapVidaHandoffUrl`).
- Após alterar envs: **redeploy** em ambos os projetos Vercel.

### Validação cruzada sugerida
1. MeJoy: `pnpm validate:handoff:env` (com secrets) → exit 0.
2. Criar handoff (curl ou relatório) → `redirectUrl` abre ZapVida sem erro de assinatura.
3. ZapVida: gate de lançamento / logs de integração conforme runbook do próprio ZapVida.
4. Callback: `POST /api/handoff/status` no MeJoy com assinatura acordada (`HANDOFF_CALLBACK_SECRET` / modo `signed` se ativo).
