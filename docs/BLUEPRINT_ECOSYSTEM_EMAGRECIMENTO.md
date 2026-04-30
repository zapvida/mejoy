# Blueprint Oficial — Ecossistema Emagrecimento (MeJoy + ZapVida + ZapFarm + TECMED)

## Decisão estratégica
1. Entrada principal: `mejoy.com.br/emagrecimento`.
2. Decisão clínica e pagamento clínico: ZapVida.
3. ZapFarm atua no pós-decisão clínica, como execução/logística.
4. MeJoy segue como motor de aquisição, triagem, relatório e handoff.

## Fluxo oficial implementado no MeJoy
1. Landing premium (`/emagrecimento`) com CTA para triagem e sinais de confiança cedo.
2. Triagem (`/triagem/emagrecimento`) com continuidade de sessão.
3. Relatório (`/emagrecimento/relatorio?id=...`) com CTA principal para avaliação clínica.
4. Handoff técnico para ZapVida via token assinado (`/api/handoff/create`).
5. Status do handoff e eventos de continuidade via `/api/handoff/status`.

## Contrato de handoff (HandoffEnvelopeV1)
- Fonte: `src/lib/handoff/envelope.ts`
- Campos principais:
  - `handoff_id`
  - `utm.source|medium|campaign|content|term`
  - `journey.triage_id|report_id|order_id|patient_id|program_slug|recommended_queue|handoff_status`
  - `consent.consent_status|consent_timestamp`
  - `identity.email_hash|phone_hash`
- Assinatura: HMAC SHA-256 com `HANDOFF_TOKEN_SECRET`.
- TTL: `HANDOFF_TOKEN_TTL_SECONDS` (default 15 min).
- Persistência: `public.handoff_events` (migration `20260404154500_handoff_events.sql`).

## Eventos mínimos instrumentados no MeJoy
- `lp_view`
- `cta_start_triage`
- `triage_started`
- `triage_completed`
- `report_viewed`
- `cta_clinical_handoff`
- `handoff_created`
- `handoff_opened`
- `handoff_completed` (via status endpoint)
- `clinical_payment_started`
- `clinical_payment_success` (via status endpoint)
- `consult_completed` (via status endpoint)
- `pharmacy_order_started`
- `pharmacy_order_created`
- `followup_started` (via status endpoint)

## Métrica operacional (admin)
- Endpoint técnico: `/api/admin/handoff?days=7`.
- Retorna totais por status e taxas de abertura/conclusão para monitoramento de rollout.

## Guardrails de compliance no produto
1. Relatório é contexto e orientação, não prescrição final.
2. CTA primário direciona para avaliação médica no ZapVida.
3. Linguagem sem promessa de resultado.
4. Execução farmacêutica explicitamente pós-decisão clínica.

## Rollback
1. Reverter uso do handoff mantendo CTAs diretos por parceiro.
2. Retornar CTA principal do relatório para checkout local por flag/ajuste de copy.
3. Manter APIs de handoff desativadas removendo chamadas de frontend.
