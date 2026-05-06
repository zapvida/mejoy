# Setup Lançamento 100% — Store V2 MeJoy

**Objetivo:** Validar em produção o e-commerce completo (home, categorias, produtos, carrinho, checkout PIX) com produtos carregados e alinhados.

---

## TL;DR — Copiar e colar

```bash
# 1. Local: migrations (com DATABASE_URL no .env)
cd /Users/teobeckert/desenvolvimento/mejoy
npx prisma migrate deploy
npx prisma generate

# 2. Local: importar catálogo (usa mesmo banco do .env)
STORE_V2_SEED_PRICE_CENTS=9900 pnpm smoke:import

# 3. Deploy
git add -A && git commit -m "chore: setup Store V2 produção" && git push origin main

# 4. Após deploy: validar
BASE_URL=https://www.mejoy.com.br bash scripts/validate-store-v2-production.sh
```

**Antes disso:** confira na Vercel que `STORE_V2=1`, `NEXT_PUBLIC_STORE_V2=1`, `ADMIN_SECRET_KEY` e `DATABASE_URL` estão configurados.

---

## Diagnóstico atual (baseado na validação)

| Check | Resultado |
|-------|-----------|
| Health | ✅ 200 |
| Home | ✅ 200 |
| /c/sono | ⚠️ 404 |
| /p/5-htp-50-mg | ⚠️ 404 |
| /cart | ⚠️ 404 |
| API cart | ⚠️ 404 |

**404 geralmente indica:** `STORE_V2=0` (rotas redirecionam/bloqueiam) **ou** catálogo não importado **ou** deploy desatualizado.

---

## Passos manuais (ordem de execução)

### 1. Variáveis de ambiente (Vercel)

Em **Vercel → Seu projeto → Settings → Environment Variables**:

| Variável | Valor | Ambiente |
|----------|-------|----------|
| `STORE_V2` | `1` | Production, Preview |
| `NEXT_PUBLIC_STORE_V2` | `1` | Production, Preview |
| `DATABASE_URL` | `postgresql://...` | Production, Preview |
| `ASAAS_API_KEY` | sua chave | Production, Preview |
| `ASAAS_ENVIRONMENT` | `production` | Production |
| `ADMIN_SECRET_KEY` | token seguro (ex: 64 chars) | Production, Preview |

**Opcionais (recomendados):**
| Variável | Valor | Uso |
|----------|-------|-----|
| `ASAAS_WEBHOOK_TOKEN` | token secreto | Validar webhook |
| `STORE_V2_SEED_PRICE_CENTS` | `9900` | Temporário: preencher preços vazios (R$ 99). Remover em produção final. |

Salve e **redeploy** (ou aguarde o próximo push).

---

### 2. Migrations do banco

**Opção A — Via SQL (recomendado se DATABASE_URL não estiver no .env local)**

1. Abra o SQL Editor do seu banco (Supabase, Neon, etc.).
2. Copie e cole todo o conteúdo de `scripts/store-v2-migrations.sql`.
3. Execute.
4. (Opcional) Se for usar `prisma migrate deploy` depois, marque como aplicadas:  
   `npx prisma migrate resolve --applied "20260228120000_store_v2_models"`  
   (e o mesmo para as outras 3 migrations, se precisar).

**Opção B — Via Prisma (com DATABASE_URL no .env)**

```bash
cd /Users/teobeckert/desenvolvimento/mejoy
npx prisma migrate deploy
npx prisma generate
```

**Migrations Store V2 incluídas:**
- Base — produtos, categorias, carrinho, pedidos
- asaasPaymentId no Order
- Webhook events (idempotência)
- RX submissions (receita/validação)

Se usar banco local diferente do da Vercel, rode também contra a **DATABASE_URL de produção** (cuidado: não sobrescreva dados reais).

---

### 3. Importar catálogo

**Opção A — Via API (servidor em produção):**

```bash
# Substitua ADMIN_SECRET_KEY e a URL se necessário
curl -X POST "https://www.mejoy.com.br/api/admin/catalog/import" \
  -H "Authorization: Bearer SEU_ADMIN_SECRET_KEY" \
  -H "Content-Type: application/json" \
  -d '{}'
```

**Opção B — Local (usa DATABASE_URL do .env):**

```bash
cd /Users/teobeckert/desenvolvimento/mejoy

# Com seed de preço temporário (produtos sem preço = R$ 99)
STORE_V2_SEED_PRICE_CENTS=9900 pnpm smoke:import
```

**Importante:** O CSV está em `data/catalogo_master_mejoy_seed_200.csv`. Ele precisa existir no repositório e no deploy (Vercel inclui por padrão).

---

### 4. Webhook Asaas

No **Asaas Dashboard** → Configurações → Webhooks:

| Campo | Valor |
|-------|-------|
| **URL** | `https://www.mejoy.com.br/api/asaas/webhook` |
| **Eventos** | PAYMENT_CONFIRMED, PAYMENT_RECEIVED, PAYMENT_OVERDUE |
| **Token** (opcional) | Mesmo valor de `ASAAS_WEBHOOK_TOKEN` na Vercel |

---

### 5. Deploy

```bash
cd /Users/teobeckert/desenvolvimento/mejoy
git add -A
git status   # Confira o que vai
git commit -m "chore: setup Store V2 produção"
git push origin main
```

A Vercel fará o deploy. O `postbuild` roda `prisma migrate deploy` se `DATABASE_URL` existir.

---

### 6. Validação 100%

Após deploy concluído:

```bash
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
🎉 Validação concluída!
```

---

## Verificação manual no navegador

1. **Home:** https://www.mejoy.com.br  
   - Deve exibir Store V2 (seções por objetivo, produto cards).

2. **Categoria:** https://www.mejoy.com.br/c/sono  
   - Grid de produtos da categoria Sono.

3. **PDP:** https://www.mejoy.com.br/p/5-htp-50-mg  
   - Página do produto (ou outro slug do CSV).

4. **Carrinho:** https://www.mejoy.com.br/cart  
   - Carrinho (vazio ou com itens).

5. **Checkout:** adicionar produto → Finalizar compra  
   - Stepper: dados, frete, pagamento PIX.

---

## Rollback imediato

Se algo quebrar:

1. Vercel → Environment Variables
2. `STORE_V2=0` e `NEXT_PUBLIC_STORE_V2=0`
3. Redeploy ou aguardar próximo deploy

A loja volta ao layout legado sem novo código.

---

## Troubleshooting

| Problema | Possível causa | Ação |
|---------|----------------|------|
| /c/sono 404 | STORE_V2=0 | Garantir STORE_V2=1 e redeploy |
| /c/sono 404 | Slug inválido | Testar /c/saude (objetivo válido) |
| PDP 404 | Produto não importado | Rodar import do catálogo |
| API cart 404 | Deploy sem rotas Store V2 | Conferir se último push foi deployado |
| Home mostra layout antigo | NEXT_PUBLIC_STORE_V2=0 | Ativar e redeploy (rebuild obrigatório) |
| Produtos sem preço | CSV com preços vazios | Usar STORE_V2_SEED_PRICE_CENTS=9900 no import ou preencher CSV |

---

## Próximos passos (pós-lançamento)

- [ ] Remover `STORE_V2_SEED_PRICE_CENTS` em produção (produtos sem preço = draft)
- [ ] Step RX/Validação no checkout
- [ ] Admin: aprovar/rejeitar receitas
- [ ] Cartão de crédito Asaas
- [ ] Atualizar script de validação (draft, RX, webhook idempotente)
