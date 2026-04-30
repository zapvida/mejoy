# Próximos passos (manual)

Você não fez nada manualmente ainda. Faça na ordem abaixo.

---

## 1. Deploy já acionado

O Deploy Hook foi disparado. Acompanhe:

- **Deploys:** https://vercel.com/monjoy-mejoy/zapfarm/deployments  
- Aguarde o último deployment ficar **Ready**.

---

## 2. Variáveis de ambiente (Vercel)

No Vercel: **Project → Settings → Environment Variables**.

Confira se existem e estão corretas para **Production**:

| Variável | Obrigatório para |
|----------|-------------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Triagem + relatório |
| `SUPABASE_SERVICE_ROLE_KEY` | Triagem + relatório |
| `NEXT_PUBLIC_SITE_URL` | Links corretos (ex: `https://www.mejoy.com.br`) |
| `ASAAS_API_KEY` | Se usar checkout Asaas |
| `OPENAI_API_KEY` | Se usar IA no relatório |
| `AI_REPORT_ENABLED=1` | Se quiser relatório com IA |
| `GHL_PIPELINE_ID`, `GHL_STAGE_*`, `GHL_API_KEY` | Se usar GHL/analytics |

Depois de alterar env vars, **redeploy** (Deployments → ⋮ no último → Redeploy).

---

## 3. Supabase em produção

Se o banco de produção ainda não tiver as tabelas:

- Abra o projeto no [Supabase Dashboard](https://supabase.com/dashboard).
- **SQL Editor** → rode os scripts em `supabase/migrations/` na ordem (ou use `supabase db push` se tiver CLI linkado ao projeto de prod).

Tabelas esperadas: `profiles`, `triage_sessions`, `triage_steps`, `triage_reports` (e as de magic link/leads se usar).

---

## 4. Testar em produção (smoke)

1. Abra o site em produção (mesma URL do `NEXT_PUBLIC_SITE_URL`).
2. Vá em **triagem** (ex: `/triagem/emagrecimento`).
3. Complete a triagem até o fim.
4. Confira se o **relatório** abre.
5. Se tiver checkout, clique até a tela de pagamento (sem pagar).

Se algo falhar, confira logs no Vercel (Deployments → último → Logs) e no Supabase (Logs).

---

## Comando para o próximo deploy

Sempre que fizer alterações e quiser subir para produção:

```bash
git add -A
git commit -m "sua mensagem"
pnpm run deploy
```

Isso faz **push** de `main` e dispara o **Deploy Hook** (não use `pnpm deploy` sozinho; use `pnpm run deploy`).
