# Manual Basics Final — Emagrecimento

## Ambiente
1. Node 20.x
2. pnpm instalado
3. `.env.local` com variáveis mínimas

## Envs novas (handoff)
- `HANDOFF_TOKEN_SECRET`
- `HANDOFF_TOKEN_TTL_SECONDS=900`
- `NEXT_PUBLIC_ZAPVIDA_HANDOFF_URL=https://zapvida.com/quiz/emagrecimento`

## SQL obrigatória (rastreabilidade)
1. Executar a migration `supabase/migrations/20260404154500_handoff_events.sql`.
2. Validar que a tabela `public.handoff_events` foi criada.
3. Confirmar inserções de evento `created` e `opened` após clique do CTA clínico.

## Envs já usadas no fluxo
- `NEXT_PUBLIC_PARTNER_ZAPVIDA_URL`
- `NEXT_PUBLIC_PARTNER_ZAPFARM_URL`
- `NEXT_PUBLIC_SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`

## Comandos
```bash
pnpm install
pnpm mejoy:predeploy   # lint + typecheck + test:handoff + validate:handoff:bundle + build
pnpm dev
```
Ou granular: `pnpm lint`, `pnpm typecheck`, `pnpm build`, `pnpm test:handoff`, `pnpm validate:handoff:bundle`.

Pós-deploy (URL pública): `BASE_URL=https://www.mejoy.com.br pnpm mejoy:postdeploy` (ver `docs/ops/GO_LIVE_MEJOY.md`).

## Smoke manual recomendado
1. Abrir `/emagrecimento` e validar CTA principal.
2. Iniciar `/triagem/emagrecimento`.
3. Concluir triagem e validar relatório.
4. Acionar CTA clínico e validar `POST /api/handoff/create`.
5. Validar `redirectUrl` para ZapVida com `handoff=` e `handoff_id=`.
6. Confirmar registro em `public.handoff_events` com `status='created'`.
7. Chamar `/api/handoff/status` com `opened` e confirmar novo registro no banco.
8. Consultar `/api/admin/handoff?days=7` e validar taxa de abertura/conclusão.

## Callback assinado
1. Preferir `HANDOFF_CALLBACK_SECRET` dedicado.
2. Assinar `<timestamp>.<nonce>.<stable-json-body>` com HMAC SHA-256.
3. Enviar `x-handoff-signature`, `x-handoff-timestamp`, `x-handoff-nonce`.
4. Em produção, tratar callback token-only apenas como compatibilidade temporária.

## Rollout
1. Deploy preview.
2. Validar analytics e erros.
3. Subir em produção com tráfego controlado.
4. Escalar gradualmente.

## Rollback
1. Voltar CTA principal para link direto ZapVida.
2. Pausar uso de `/api/handoff/create` no frontend.
3. Manter triagem+relatório ativos.
