# Passos manuais para lançamento contínuo em produção

Execute na ordem abaixo. Se algum passo falhar, resolva antes de continuar.

---

## 0. Já feito

- [x] Logout Vercel (conta `allzapvida-2146`)
- [x] GitHub ativo: `zapfarmx` (conta com acesso ao repo)
- [x] Push do código (main → da9743c..6f9d948)

---

## 1. Login Vercel (conta monjoy-mejoy)

Você precisa estar logado na conta que tem acesso ao **time monjoy-mejoy** (projeto zapfarm).

```bash
vercel login
```

- Use o email que tem acesso a https://vercel.com/monjoy-mejoy/zapfarm  
- Se não tiver acesso, peça convite no time ou use a conta do dono do projeto  

**Verificar:**
```bash
vercel whoami
vercel teams ls
# Deve aparecer o time monjoy-mejoy (ou equivalente)
```

---

## 2. Push do código para o GitHub — ✅ FEITO

O push já foi concluído (`da9743c..6f9d948`). Para novos deploys no futuro:

```bash
cd /Users/teobeckert/desenvolvimento/mejoy
gh auth switch -u zapfarmx    # garantir conta correta
git add -A && git commit -m "mensagem" && git push origin main
```

**Se der "Repository not found":** use `gh auth switch -u zapfarmx` antes do push.

---

## 3. Conferir deploy na Vercel

1. Acesse: https://vercel.com/monjoy-mejoy/zapfarm/deployments  
2. O deploy deve começar automaticamente após o push  
3. Aguarde concluir (status "Ready")  
4. Confirme que o domínio é **www.mejoy.com.br**

---

## 4. Variáveis de ambiente na Vercel

Em **Settings → Environment Variables** do projeto zapfarm, em **Production**:

| Nome | Valor |
|------|-------|
| `STORE_V2` | `1` |
| `NEXT_PUBLIC_STORE_V2` | `1` |
| `ADMIN_SECRET_KEY` | (token seguro — ex.: 64 caracteres) |
| `DATABASE_URL` | (connection string do Supabase) |

Se mudar alguma variável, faça **Redeploy** em Deployments.

---

## 5. Validação em produção

```bash
cd /Users/teobeckert/desenvolvimento/mejoy

# Health com Store V2
curl -s "https://www.mejoy.com.br/api/health" | grep storeV2Enabled
# Esperado: "storeV2Enabled":true

# Script completo
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

## 6. Import do catálogo

**ADMIN_SECRET_KEY em `.env.local` deve ser igual ao da Vercel.** Se atualizou na Vercel, copie o valor e atualize o `.env.local`.

```bash
bash scripts/import-catalog-production.sh
```

Se der "Unauthorized", use a chave da Vercel:
```bash
export ADMIN_SECRET_KEY="valor_copiado_da_Vercel"
bash scripts/import-catalog-production.sh
```

Resposta esperada: `{"ok":true,"created":200,"updated":0,"total":200}`.

---

## 7. Webhook Asaas (se ainda não configurado)

1. Acesse: https://www.asaas.com → Integrações → Webhooks  
2. **URL:** `https://www.mejoy.com.br/api/asaas/webhook`  
3. Salve e confira se o Vercel tem `ASAAS_WEBHOOK_TOKEN` configurado (se o Asaas exigir)

---

## 8. Lançamento contínuo (fluxo futuro)

Após tudo validado:

1. **Commit** → `git add -A && git commit -m "mensagem"`
2. **Push** → `git push origin main`
3. **Vercel** → deploy automático
4. **Validação** → `BASE_URL=https://www.mejoy.com.br bash scripts/validate-store-v2-production.sh`

---

## Resumo (ordem de execução)

| # | Ação | Onde |
|---|------|------|
| 1 | `vercel login` (conta monjoy-mejoy) | Terminal |
| 2 | `git push origin main` | Terminal |
| 3 | Aguardar deploy na Vercel | Dashboard |
| 4 | Verificar STORE_V2=1 e NEXT_PUBLIC_STORE_V2=1 | Vercel Settings |
| 5 | Rodar script de validação | Terminal |
| 6 | Import catálogo (curl com ADMIN_SECRET_KEY) | Terminal |
| 7 | Configurar webhook Asaas (se necessário) | Asaas Dashboard |

---

## Troubleshooting

| Erro | Solução |
|------|---------|
| `Repository not found` | Use `gh auth switch -u zapfarmx` ou token no remote |
| `vercel link` scope não existe | Login com conta que tem monjoy-mejoy |
| 404 em /c/sono, /cart | STORE_V2 e NEXT_PUBLIC_STORE_V2 = 1 + redeploy |
| Import 401 | ADMIN_SECRET_KEY incorreto |
| Import 404 | Deploy antigo — confira se o push e o deploy rodaram |
