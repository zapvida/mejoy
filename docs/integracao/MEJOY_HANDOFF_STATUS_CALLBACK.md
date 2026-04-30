# MeJoy Handoff Status Callback

## Endpoint
- `POST /api/handoff/status`

## Objetivo
- Receber confirmação do ZapVida e etapas pós-consulta.
- Persistir auditoria append-only.
- Validar assinatura, timestamp e nonce.
- Manter compatibilidade com callback legado token-only.

## Body aceito
- `handoffToken`
- `status`
- `statusReason`
- `occurredAt`
- `orderId`
- `quoteId`
- `prescriptionId`
- `correlationId`
- `metadata`
- `idempotencyKey`

## Headers de callback assinado
- `x-handoff-signature`
- `x-handoff-timestamp`
- `x-handoff-nonce`

## Canonical string para HMAC
```text
<timestamp>.<nonce>.<stable-json-body>
```

## Segredo
- Preferencial: `HANDOFF_CALLBACK_SECRET`
- Fallback compatível: `HANDOFF_TOKEN_SECRET`

## Janela de tolerância
- `HANDOFF_CALLBACK_TOLERANCE_SECONDS`
- Default: `300`

## Replay protection
- Nonce único por janela de tolerância.
- Armazenamento:
  - Upstash `setnx` + `expire` quando disponível.
  - Fallback in-memory por instância.

## Compatibilidade retroativa
- Sem headers de assinatura, o endpoint ainda aceita `handoffToken` válido.
- Esse modo retorna `callback_auth_mode=token_only` no envelope persistido.
- Novo consumo ZapVida deve migrar para callback assinado.

## Exemplo Node
```ts
import crypto from "node:crypto";

const body = {
  handoffToken: process.env.HANDOFF_TOKEN,
  status: "consult_completed",
  prescriptionId: "presc-123",
  occurredAt: new Date().toISOString()
};

const nonce = crypto.randomUUID();
const timestamp = new Date().toISOString();
const stableBody = JSON.stringify(body, Object.keys(body).sort());
const payload = `${timestamp}.${nonce}.${stableBody}`;
const signature = crypto
  .createHmac("sha256", process.env.HANDOFF_CALLBACK_SECRET || process.env.HANDOFF_TOKEN_SECRET!)
  .update(payload)
  .digest("hex");
```

## Exemplo curl
```bash
curl -X POST https://www.mejoy.com.br/api/handoff/status \
  -H 'Content-Type: application/json' \
  -H "x-handoff-timestamp: 2026-04-05T18:30:00.000Z" \
  -H "x-handoff-nonce: nonce-123" \
  -H "x-handoff-signature: <hex-hmac>" \
  -d '{
    "handoffToken": "<token>",
    "status": "consult_completed",
    "prescriptionId": "presc-123",
    "quoteId": "quote-123"
  }'
```

## Códigos de resposta
- `200 ok=true`
- `200 deduped=true`
- `400 Payload inválido`
- `400 Timestamp expirado`
- `400 Token inválido`
- `401 Assinatura inválida`
- `409 Nonce já utilizado`
- `409 Transição inválida`

## Status recomendados do callback
- `opened`
- `accepted`
- `consult_started`
- `consult_completed`
- `prescription_created`
- `quote_created`
- `order_paid`
- `order_delivered`
- `retention_started`
- `cancelled`

## Status legados ainda aceitos
- `completed`
- `clinical_payment_started`
- `clinical_payment_success`
- `pharmacy_order_started`
- `pharmacy_order_created`
- `followup_started`
- `failed`

## Observabilidade mínima
- Consultar `public.handoff_events` por `handoff_id` ou `metadata->event_id`.
- Alertar em:
  - `401`
  - `409` repetido
  - callbacks sem assinatura em produção
