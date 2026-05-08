# Eventos Emagrecimento

## Princípios
- `correlation_id` deve costurar landing, triagem, relatório, handoff e callbacks.
- `session_pseudo_id` é permitido; PII não.
- Eventos analíticos e payload clínico ficam separados.
- Click IDs devem ser preservados: `gclid`, `fbclid`, `ttclid`, `msclkid`.
- `src/lib/funnel/events-client.ts` é o contrato canônico client-side do launch.
- GTM é o orquestrador principal; `gtag` direto fica apenas como fallback sem GTM.

## Eventos client-side atuais
| Evento atual | Uso | Campos mínimos |
| --- | --- | --- |
| `lp_view` | visualização da landing | `correlation_id`, `session_pseudo_id`, `path` |
| `cta_start_triage` | CTA primário da landing | `correlation_id`, `origin` |
| `triage_started` | criação/retomada da triagem | `triage_id`, `triage_slug`, `correlation_id` |
| `triage_completed` | triagem concluída | `triage_id`, `report_id`, `correlation_id` |
| `report_viewed` | relatório aberto | `report_id`, `correlation_id` |
| `cta_clinical_handoff` | CTA para ZapVida | `report_id`, `origin`, `correlation_id` |
| `handoff_failed` | handoff não retornou redirect (erro ou fallback) | `report_id`, `origin`, `surface`, `correlation_id` (sem texto de erro bruto) |
| `handoff_created` | frontend recebeu redirect de handoff | `report_id`, `correlation_id` |
| `handoff_opened` | navegação para ZapVida iniciada | `report_id`, `correlation_id` |
| `clinical_payment_started` | fallback direto / plantão | `report_id`, `source`, `correlation_id` |

## Consentimento e Google
- O banner publica `analytics` e `marketing` em `dataLayer` via `mejoy_consent_bootstrap` / `mejoy_consent_update`.
- `analytics_storage`, `ad_storage`, `ad_user_data` e `ad_personalization` saem do mesmo estado de consentimento.
- `NEXT_PUBLIC_GOOGLE_CONSENT_MODE=strict` habilita bootstrap com default negado antes de carregar GTM/GA.

## Eventos server-side persistidos em `handoff_events.event_name`
| Evento | Origem |
| --- | --- |
| `handoff_create` | `/api/handoff/create` |
| `handoff_send` | `/api/handoff/create` |
| `handoff_accept` | `/api/handoff/status` |
| `handoff_reject` | `/api/handoff/status` |
| `handoff_expired` | `/api/handoff/status` |
| `callback_consult_started` | `/api/handoff/status` |
| `callback_consult_completed` | `/api/handoff/status` |
| `callback_prescription_created` | `/api/handoff/status` |
| `callback_quote_created` | `/api/handoff/status` |
| `callback_clinical_payment_started` | `/api/handoff/status` |
| `callback_clinical_payment_success` | `/api/handoff/status` |
| `callback_order_paid` | `/api/handoff/status` |
| `callback_order_created` | `/api/handoff/status` |
| `callback_order_delivered` | `/api/handoff/status` |
| `retention_entry` | `/api/handoff/status` |
| `callback_cancelled` | `/api/handoff/status` |

## Dimensões recomendadas
- `correlation_id`
- `session_pseudo_id`
- `triage_id`
- `report_id`
- `handoff_id`
- `program_slug`
- `source_journey`
- `utm_source`
- `utm_medium`
- `utm_campaign`
- `utm_content`
- `utm_term`
- `gclid`
- `fbclid`
- `ttclid`
- `msclkid`
- `partner`
- `entry_context`
- `origin`

## Métricas recomendadas
- `landing_views`
- `triage_starts`
- `triage_completions`
- `report_views`
- `handoff_creates`
- `handoff_sends`
- `handoff_accepts`
- `consult_completions`
- `prescriptions_created`
- `quotes_created`
- `orders_paid`
- `orders_delivered`
- `retention_entries`
- `revenue_attributed`

## Regras anti-PHI
- Nunca enviar `email`, `telefone`, `nome`, `CPF`, `patient_id` raw para analytics client-side.
- `identity` no envelope usa hash SHA-256.
- `metadata` do handoff remove chaves sensíveis conhecidas.
- Logs técnicos devem preferir `handoff_id`, `correlation_id`, `triage_id`, `report_id`.

## Receita atribuída
- `revenue_attributed` depende de callback externo com `order_paid` ou `order_delivered`.
- Enquanto ZapVida/ZapFarm não enviarem esses callbacks, a remontagem de receita fica pronta no MeJoy, mas incompleta externamente.

## URLs de parceiro
- `buildPartnerUrl()` mantém:
  - taxonomia do parceiro (`utm_source=mejoy`, `utm_medium`, `utm_campaign`)
  - origem anterior em `origin_utm_*`
  - click IDs originais
  - `correlation_id`
