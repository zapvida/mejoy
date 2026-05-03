# Launch Checklist Técnico — Emagrecimento

## 1) Pré-go-live
- [ ] `HANDOFF_TOKEN_SECRET` definido em todos os ambientes.
- [ ] `NEXT_PUBLIC_ZAPVIDA_HANDOFF_URL` validada (quiz/bridge correto).
- [ ] `HANDOFF_TOKEN_TTL_SECONDS` definido (recomendado: 900).
- [ ] URLs de parceiros confirmadas (`NEXT_PUBLIC_PARTNER_ZAPVIDA_URL`, `NEXT_PUBLIC_PARTNER_ZAPFARM_URL`).
- [ ] Migration `20260404154500_handoff_events.sql` aplicada no Supabase.
- [ ] Revisão de copy/compliance concluída.

## 2) Validação local
- [ ] `pnpm mejoy:predeploy` (atalho: lint, typecheck, test:handoff, validate:handoff:bundle, build)
- [ ] Ou passo a passo: `pnpm lint` → `pnpm typecheck` → `pnpm build` → `pnpm test:handoff` → `pnpm validate:handoff:bundle`
- [ ] `pnpm validate:handoff:env` (com env de preview/prod ou CI com secrets)
- [ ] Fluxo smoke: LP -> triagem -> relatório -> handoff create.
- [ ] Conferir resposta de `/api/handoff/create` com `redirectUrl` e token.
- [ ] Conferir `/api/handoff/status` com status válidos.
- [ ] Conferir callback assinado com `x-handoff-signature`, `x-handoff-timestamp`, `x-handoff-nonce`.
- [ ] Confirmar persistência em `public.handoff_events` (`created`, `opened`, `accepted/completed`).
- [ ] Conferir `/api/admin/handoff?days=7` com métricas coerentes.

## 3) Validação em preview
- [ ] Evento `lp_view` chegando no analytics.
- [ ] Evento `triage_started` e `triage_completed` chegando no analytics.
- [ ] Evento `report_viewed` chegando no analytics.
- [ ] Eventos `cta_clinical_handoff`, `handoff_created`, `handoff_opened` chegando no analytics.
- [ ] UTM sem colisão em CTAs de parceiros.

## 4) Rollout controlado
- [ ] Liberar 10% tráfego para nova jornada.
- [ ] Monitorar erro de API (`/api/handoff/*`, `/api/triage/session`) por 24h.
- [ ] Monitorar drop na etapa relatório -> handoff.
- [ ] Monitorar volume e latência de escrita em `handoff_events`.
- [ ] Escalar para 30%/60%/100% após estabilidade.

## 5) Rollback
- [ ] Reverter CTA principal de handoff para link direto ZapVida.
- [ ] Desativar chamadas para `/api/handoff/create` no frontend.
- [ ] Manter triagem e relatório operando sem dependência do handoff.

## 6) P0 launch oficial (evidência em produção)
Estes itens bloqueiam declarar **launch oficial** até estarem verificados e arquivados (print, log, ticket ou doc com data/owner).

### Congelamento e oferta mínima v1
- [ ] **Protocolo foco:** emagrecimento como vertical única do go-live (decisão de produto registrada).
- [ ] **Oferta mínima v1** (trilhas): (1) tirzepatida original, (2) semaglutida original, (3) Contrave, (4) médico escolhe / alternativas — copy comercial **sem** Ozempic/Rybelsus como promessa principal.
- [ ] **Preços em camadas:** LP “a partir de” / texto aprovado (`NEXT_PUBLIC_EMAGRECIMENTO_LP_FROM_PRICE`); relatório faixa (`NEXT_PUBLIC_EMAGRECIMENTO_RESULTS_BAND`); checkout valor final aprovado ou placeholder explícito até aprovação jurídico/comercial.
- [ ] Guard rail de launch: placeholders como `2222`, `3333`, `todo` ou `test` nunca podem aparecer na LP ou no relatório; devem cair em fallback seguro.

### Smoke produção ponta a ponta
- [ ] `pnpm exec playwright install` (uma vez por máquina/CI) e `pnpm qa:emagrecimento` com `PRODUCTION_URL` correto.
- [ ] Smoke **manual** além do script: triagem one-page → relatório → CTA WhatsApp → handoff → abertura ZapVida → checkout → pagamento teste Asaas (sandbox ou valor mínimo conforme política).

### Handoff MeJoy → ZapVida
- [ ] `POST /api/handoff/create` em prod retorna `redirectUrl` válido; abertura no destino sem erro.
- [ ] Callback assinado e estados em `public.handoff_events` (`created` → `opened` → aceito/concluído conforme fluxo).
- [ ] `pnpm validate:handoff:env` em ambiente com secrets reais.

### Supabase
- [ ] Migration `20260404154500_handoff_events.sql` aplicada no **projeto de produção**; conferir tabela e RLS conforme esperado.

### Variáveis críticas (Vercel / runtime)
- [ ] Supabase URL + service role / anon conforme deploy.
- [ ] Asaas (API key, webhook, ambiente prod/sandbox alinhado ao que se vende).
- [ ] `HANDOFF_TOKEN_SECRET`, `NEXT_PUBLIC_ZAPVIDA_HANDOFF_URL`, TTL.
- [ ] `NEXT_PUBLIC_GA4_MEASUREMENT_ID` + owner de revisão de eventos.

### Asaas metadata (conferência pós-pagamento teste)
- [ ] `emagrecimento_trilha`, `emagrecimento_principio` presentes quando `product === emagrecimento`.
- [ ] UTMs repassados na metadata conforme implementação em `/api/asaas/create-payment`.

### Compliance / copy
- [ ] Revisão humana de claims em LP, relatório, checkout e CTAs WhatsApp (não prescrever automaticamente; programa com revisão médica).

### Evidência arquivada
- [ ] SHA do deploy, link Vercel, JSON do smoke (`smoke-test-report-*.json`), checklist esta seção assinada com data e responsável.
