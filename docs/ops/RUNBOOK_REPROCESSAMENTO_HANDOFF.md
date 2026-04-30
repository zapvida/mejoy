# Runbook Reprocessamento Handoff

## Quando usar
- `handoff/create` retornou erro transitório.
- Callback externo falhou temporariamente.
- Status chegou fora de ordem e precisa ser reenviado.
- Reprocessamento manual controlado de um caso específico.

## Regras
- Sempre usar `Idempotency-Key`.
- Nunca reenviar PII raw em `metadata`.
- Reprocessar por `handoff_id` ou por `correlation_id`.
- Registrar quem executou e quando.

## 1. Localizar o caso
```sql
select
  handoff_id,
  status,
  event_name,
  triage_id,
  report_id,
  metadata,
  created_at
from public.handoff_events
where handoff_id = '<handoff_id>'
order by created_at asc;
```

## 2. Reprocessar criação
- Reutilize o mesmo body da criação.
- Envie a mesma `Idempotency-Key`.
- Se existir handoff ativo, a API devolve `deduped=true`.

```bash
curl -X POST https://www.mejoy.com.br/api/handoff/create \
  -H 'Content-Type: application/json' \
  -H 'Idempotency-Key: handoff:emagrecimento.report:triage-123:report-123:corr-123' \
  -d '{
    "triageId": "triage-123",
    "reportId": "report-123",
    "sourceJourney": "emagrecimento.report",
    "correlationId": "corr-123",
    "metadata": {
      "origin": "manual_reprocess"
    }
  }'
```

## 3. Reprocessar callback/status
- Preferir callback assinado.
- Manter o mesmo `handoffToken`.
- Usar nova `Idempotency-Key` por tentativa manual.

## 4. Como confirmar sucesso
- Verificar novo evento em `handoff_events`.
- Confirmar `transition_from` e `transition_to`.
- Confirmar que não houve `409` por transição inválida.

## 5. Quando NÃO reprocessar
- Estado terminal já persistido corretamente.
- Token expirado e parceiro precisa de novo handoff.
- Callback de produção não assinado vindo de origem desconhecida.
