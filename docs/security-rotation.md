# Segurança Pós-Refatoração de Triagens

As novas APIs de triagem utilizam chaves sensíveis (Supabase, OpenAI, Stripe). Execute imediatamente os passos abaixo para garantir higienização completa:

1. **Rotacionar credenciais**
   - `SUPABASE_SERVICE_ROLE_KEY` e `SUPABASE_ANON_KEY`
   - `OPENAI_API_KEY`
   - `STRIPE_SECRET_KEY` e `STRIPE_PUBLISHABLE_KEY`
   - Webhooks Stripe (`whsec_*`)

2. **Atualizar variáveis de ambiente**
   - Substitua os valores em `.env.local`, `.env.vercel` e nos ambientes configurados no painel da Vercel.
   - Registre as novas chaves no dashboard do Supabase.

3. **Revogar chaves antigas**
   - Supabase → Configurações → API → Revoke.
   - Stripe → Developers → API keys → Roll keys.
   - OpenAI → View API Keys → Delete antigas.

4. **Auditar logs**
   - Supabase Auth e Postgres logs dos últimos 30 dias.
   - Stripe Dashboard → Logs de API e Radar.
   - OpenAI Usage e Audit Logs.

5. **Alertas e monitoramento**
   - Configurar alertas de uso anômalo no Supabase (Rate limits) e Stripe Radar.
   - Ativar secret scanning no repositório/organização.

Documente data/hora das rotações e responsáveis para auditoria futura.
