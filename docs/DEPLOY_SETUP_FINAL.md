# Deploy – Configuração definitiva

## O que foi feito (e por que funciona)

1. **Git config** – O script de deploy define `user.email=zapfarmx@gmail.com` e `user.name=zapfarmx` antes de cada commit.
2. **Autor do commit** – A Vercel só faz deploy quando o autor do commit é membro do time. `zapfarmx@gmail.com` tem acesso.
3. **Fluxo** – `pnpm run deploy` → add + commit (com autor zapfarmx) + push → GitHub Actions → Deploy Hook → Vercel.

## Como usar (sempre)

```bash
pnpm run deploy
```

Ou com mensagem:

```bash
pnpm run deploy -- "feat: nova funcionalidade"
```

## Por que não quebra mais

- O script **sempre** define o autor antes de commitar.
- Não depende de config global da máquina.
- Funciona em qualquer máquina que rode o script.
- Não precisa de DEPLOYER_EMAIL nem dummy commit.

## Requisitos (já configurados)

- Deploy Hook na Vercel para branch `main`
- `zapfarmx@gmail.com` no time monjoy-mejoy na Vercel
- GitHub Actions com `VERCEL_DEPLOY_HOOK` nos secrets
