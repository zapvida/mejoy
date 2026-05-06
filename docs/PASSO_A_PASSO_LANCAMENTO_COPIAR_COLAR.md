# 🚀 Passo a passo — Lançamento MeJoy (copiar e colar)

**Ordem exata.** Siga na sequência. Cada bloco está pronto para copiar e colar.

---

## PASSO 1 — Migrations no Supabase

1. Abra: **https://supabase.com/dashboard**
2. Entre no seu projeto MeJoy
3. Menu lateral: **SQL Editor** → **New query**
4. Abra o arquivo `scripts/store-v2-migrations.sql` do projeto (Ctrl+O ou arraste)
5. Copie **todo o conteúdo** do arquivo
6. Cole no SQL Editor
7. Clique em **Run** (ou Ctrl+Enter)
8. Aguarde terminar. Se aparecer "Success" ou sem erro → ok.

---

## PASSO 2 — Importar catálogo (produtos + preços)

1. Ainda no **Supabase** → **SQL Editor** → **New query**
2. Abra o arquivo `scripts/catalog-import.sql` do projeto
3. Copie **todo o conteúdo**
4. Cole no SQL Editor
5. Clique em **Run**
6. Aguarde terminar. Pode aparecer aviso de conflito em alguns produtos se já existirem — ignore se for “duplicate key”.

---

## PASSO 3 — Variáveis de ambiente na Vercel

1. Abra: **https://vercel.com/monjoy-mejoy/zapfarm**
2. **Settings** → **Environment Variables**
3. Adicione ou confira estas variáveis (em **Production**):

| Nome | Valor | Onde colar |
|------|-------|------------|
| `STORE_V2` | `1` | Key: STORE_V2, Value: 1 |
| `NEXT_PUBLIC_STORE_V2` | `1` | Key: NEXT_PUBLIC_STORE_V2, Value: 1 |
| `ASAAS_WEBHOOK_TOKEN` | (gere um token forte, ex: `mejoy_webhook_2025_abc123xyz`) | Key: ASAAS_WEBHOOK_TOKEN, Value: seu_token |
| `ADMIN_SECRET_KEY` | (token forte 64+ caracteres) | Key: ADMIN_SECRET_KEY, Value: seu_token |
| `NEXT_PUBLIC_ADMIN_SECRET_KEY` | (mesmo valor do ADMIN_SECRET_KEY) | Key: NEXT_PUBLIC_ADMIN_SECRET_KEY, Value: mesmo_token |
| `EVOLUTION_API_URL` | URL da sua Evolution API | Key: EVOLUTION_API_URL, Value: https://sua-url.evolution-api.com |
| `EVOLUTION_INSTANCE` | Nome da instância (ex: `alloehealth`) | Key: EVOLUTION_INSTANCE, Value: nome |
| `EVOLUTION_API_KEY` | Chave da API | Key: EVOLUTION_API_KEY, Value: sua_chave |

**Obrigatórias:** STORE_V2, NEXT_PUBLIC_STORE_V2, DATABASE_URL, ASAAS_API_KEY, RESEND_API_KEY, ADMIN_SECRET_KEY  
**WhatsApp (opcional):** EVOLUTION_API_URL, EVOLUTION_INSTANCE, EVOLUTION_API_KEY — sem elas o fluxo funciona (email, dashboard), mas não envia WhatsApp com magic link. Se não tiver Evolution, pode pular essas 3.

4. Clique **Save** em cada variável.

5. Depois de alterar/envs, faça **Redeploy**: Deployments → último deploy → ⋮ → Redeploy.

---

## PASSO 4 — Webhook no Asaas

1. Abra: **https://www.asaas.com** → faça login
2. **Configurações** (ou Integrações) → **Webhooks**
3. Adicione novo webhook:
   - **URL:** `https://www.mejoy.com.br/api/webhooks/asaas`
   - **Eventos:** marque `PAYMENT_CONFIRMED` e `PAYMENT_RECEIVED`
   - **Token (opcional):** se definiu `ASAAS_WEBHOOK_TOKEN` na Vercel, use o mesmo valor aqui.

4. Salve.

---

## PASSO 5 — Commit e deploy

No terminal, dentro da pasta do projeto:

```bash
cd /Users/teobeckert/desenvolvimento/mejoy
```

```bash
git add -A
git status
```

Confira os arquivos listados. Se estiver tudo certo:

```bash
git commit -m "feat: lancamento e-commerce MeJoy - PDP, tema laranja, Evolution, admin Store V2"
```

```bash
git push origin main
```

Ou use o script:

```bash
pnpm deploy
```

Aguarde o deploy na Vercel (1–3 min). Conferir em:  
https://vercel.com/monjoy-mejoy/zapfarm/deployments

---

## PASSO 6 — Validar em produção

Após o deploy concluir, no terminal:

```bash
cd /Users/teobeckert/desenvolvimento/mejoy
BASE_URL=https://www.mejoy.com.br bash scripts/validate-store-v2-production.sh
```

Todas as linhas devem terminar com ✅. Se aparecer ❌, revise as variáveis e o deploy.

---

## PASSO 7 — Teste de compra completo (checklist manual)

Execute na ordem:

1. [ ] Abrir https://www.mejoy.com.br
2. [ ] Clicar em um produto na home (ex: 5-HTP)
3. [ ] Na página do produto: escolher quantidade (1–10)
4. [ ] Clicar **Adicionar ao carrinho**
5. [ ] Ir para o carrinho e depois para **Checkout**
6. [ ] Preencher nome, email, telefone, CEP, endereço
7. [ ] Gerar PIX
8. [ ] Pagar o PIX (use conta de teste se tiver)
9. [ ] Verificar se chega **email de confirmação**
10. [ ] Se Evolution estiver configurado: verificar se chega **WhatsApp** com link
11. [ ] Clicar no link (magic link) e conferir se entra no **Dashboard**
12. [ ] Conferir se o pedido aparece em **Pedidos da Loja** no dashboard
13. [ ] Acessar https://www.mejoy.com.br/admin/store-v2/orders (com token Bearer ou login admin) e conferir se o pedido está listado

---

## PASSO 8 — Operação diária (Admin)

- URL: https://www.mejoy.com.br/admin/store-v2/orders  
- Autenticação: header `Authorization: Bearer SEU_ADMIN_SECRET_KEY` (ou via login admin)
- Ações: alterar status (PAID → PREPARING → SHIPPED), preencher rastreio (código + URL)
- O cliente vê o rastreio em https://www.mejoy.com.br/pedidos/[id-do-pedido]

---

## Rollback imediato (se algo der errado)

1. Vercel → Settings → Environment Variables
2. Altere:
   - `STORE_V2` = `0`
   - `NEXT_PUBLIC_STORE_V2` = `0`
3. Salvar e fazer **Redeploy** (Deployments → três pontinhos → Redeploy)

A loja volta ao modo antigo.

---

## Resumo da ordem

| # | O quê | Onde |
|---|-------|------|
| 1 | Migrations | Supabase SQL Editor |
| 2 | Catálogo | Supabase SQL Editor |
| 3 | Variáveis | Vercel Settings |
| 4 | Webhook | Painel Asaas |
| 5 | Deploy | Terminal (git push) |
| 6 | Validação | Terminal (validate-store-v2-production.sh) |
| 7 | Teste compra | Navegador (fluxo E2E) |
