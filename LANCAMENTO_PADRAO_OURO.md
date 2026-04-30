# Lançamento Store V2 — Padrão Ouro (Validado)

**Projeto:** https://vercel.com/monjoy-mejoy/zapfarm  
**Domínio:** https://www.mejoy.com.br  
**Git:** https://github.com/zapfarmx/zapfarm  

---

## 1. Deploy (código local → produção)

### Opção A — Conta com acesso ao time monjoy-mejoy

```bash
cd /Users/teobeckert/desenvolvimento/mejoy
vercel login    # use conta que tem acesso ao time monjoy-mejoy
bash scripts/deploy-store-v2.sh
```

### Opção B — Push via Git (com GITHUB_TOKEN)

```bash
cd /Users/teobeckert/desenvolvimento/mejoy
export GITHUB_TOKEN=ghp_xxxx   # PAT do GitHub (zapfarmx ou conta com acesso)
bash scripts/push-and-deploy.sh "feat: Store V2 lançamento"
```

O script commita, faz push e o Vercel (conectado ao repo) faz o deploy. Se o push falhar, configure um [Personal Access Token](https://github.com/settings/tokens) com escopo `repo`.

### Opção C — Redeploy manual pela Vercel

1. Acesse: https://vercel.com/monjoy-mejoy/zapfarm/deployments  
2. Clique nos 3 pontinhos do último deploy → **Redeploy**  
3. Ou: **Deployments** → **Create** → selecione branch/commit com Store V2  

---

## 2. Envs na Vercel (verificar)

Em **Settings → Environment Variables** do projeto zapfarm:

| Nome | Valor | Ambiente |
|------|-------|----------|
| `STORE_V2` | `1` | Production |
| `NEXT_PUBLIC_STORE_V2` | `1` | Production |
| `ADMIN_SECRET_KEY` | (seu token seguro) | Production |
| `DATABASE_URL` | (Supabase connection string) | Production |

---

## 3. Validação pós-deploy

```bash
# Health (deve ter storeV2Enabled: true)
curl -s "https://www.mejoy.com.br/api/health" | grep storeV2Enabled

# Validação completa
BASE_URL=https://www.mejoy.com.br bash scripts/validate-store-v2-production.sh
```

**Resultado esperado:**

```
✅ Health OK (200)
✅ Home OK (200)
✅ /c/sono OK (200)
✅ PDP OK (200)
✅ /cart OK (200)
✅ API cart OK (200)
```

---

## 4. Import do catálogo

Use o valor real de `ADMIN_SECRET_KEY` (da Vercel ou `.env.local`):

```bash
curl -X POST "https://www.mejoy.com.br/api/admin/catalog/import" \
  -H "Authorization: Bearer SEU_ADMIN_SECRET_KEY" \
  -H "Content-Type: application/json" -d '{}'
```

Resposta esperada: `{"ok":true,"created":N,"updated":N,"total":N}`

---

## 5. Lançamento contínuo (CI/CD)

### Fluxo padrão

1. **Commit** → `git add -A && git commit -m "mensagem"`
2. **Push** → `git push origin main`
3. **Vercel** → deploy automático via conexão Git
4. **Validação** → `BASE_URL=https://www.mejoy.com.br bash scripts/validate-store-v2-production.sh`

### Deploy Hook (sem push)

Se configurado (ver `docs/DEPLOY_HOOK_SETUP.md`):

```bash
curl -X POST "$VERCEL_DEPLOY_HOOK"
```

Redeploya o último commit na branch `main`.

---

## 6. Checklist final

- [ ] Deploy realizado (A, B ou C)
- [ ] `STORE_V2=1` e `NEXT_PUBLIC_STORE_V2=1` na Vercel
- [ ] Health retorna `storeV2Enabled: true`
- [ ] Script de validação passa
- [ ] Catálogo importado (200 produtos)
- [ ] Webhook Asaas: `https://www.mejoy.com.br/api/asaas/webhook`

---

## 7. Rollback

Em **Vercel → Environment Variables**:

- `STORE_V2` = `0`
- `NEXT_PUBLIC_STORE_V2` = `0`
- Redeploy

A loja volta ao layout legado.
