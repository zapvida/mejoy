# Deploy Hook – Configuração (1 vez)

O GitHub Actions dispara o Deploy Hook no push em main. Para funcionar sem convidar membros, configure o bypass de autor.

## Passo 1: Deploy Hook na Vercel

1. Acesse: **https://vercel.com/monjoy-mejoy/zapfarm/settings** → Git → Deploy Hooks
2. Se já existe hook para `main`, copie a URL. Senão: Create Hook → Nome: `Deploy main` → Branch: `main`
3. URL exemplo: `https://api.vercel.com/v1/integrations/deploy/prj_HxEANEHVT9ixnoCJp43uZKAMHgST/OZ657hY5nr`

## Passo 2: Secrets no GitHub

1. Acesse: **https://github.com/zapfarmx/zapfarm/settings/secrets/actions**
2. Adicione:

| Nome | Valor |
|------|-------|
| `VERCEL_DEPLOY_HOOK` | URL do Deploy Hook (passo 1) |
| `DEPLOYER_EMAIL` | Email de quem tem acesso ao time Vercel (para bypass) |

## Pronto

`git push origin main` (ou `pnpm run deploy`) → GitHub Actions → Deploy Hook → Vercel.

Se o deploy não aparecer, ver **docs/DEPLOY_HOOK_FIX.md**.
