# Deploy MeJoy / ZapFarm

**Use isto em qualquer chat:**

Rode **`pnpm run deploy`** — add + commit + push. O script usa `zapfarmx@gmail.com` como autor (obrigatório para Vercel). Deploys em: https://vercel.com/monjoy-mejoy/zapfarm/deployments

## Como funciona

O script define `git config user.email zapfarmx@gmail.com` antes de cada commit. A Vercel só deploya quando o autor é membro do time — zapfarmx tem acesso.

## Referência

Ver **docs/DEPLOY_SETUP_FINAL.md** para detalhes.
