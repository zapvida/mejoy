# COPIE E COLE — Lançamento Final MeJoy Store V2

**Tudo pronto para copiar e colar. Sem Prisma migrate (evita travar).**

---

## PASSO 1 — Migration SQL (Supabase) — SEM Prisma (evita travar)

1. Acesse **Supabase** → seu projeto → **SQL Editor** → **New query**
2. Abra o arquivo `scripts/store-v2-migrations.sql` no projeto
3. Selecione tudo (Cmd+A) e copie
4. Cole no SQL Editor do Supabase
5. Clique em **Run** (ou Ctrl+Enter)

**Resultado:** tabelas Store V2 criadas. Idempotente (pode rodar de novo).

---

## PASSO 2 — Envs na Vercel

Vercel → Project → Settings → Environment Variables. Adicione/confira:

| Nome | Valor |
|------|-------|
| STORE_V2 | 1 |
| NEXT_PUBLIC_STORE_V2 | 1 |
| DATABASE_URL | (sua URL postgres — pooler porta 6543) |
| ASAAS_API_KEY | (sua chave Asaas) |
| ASAAS_WEBHOOK_TOKEN | (token forte — ex: `openssl rand -hex 32`) |
| ADMIN_SECRET_KEY | (token forte) |
| RESEND_API_KEY | (sua chave Resend) |

---

## PASSO 3 — Webhook Asaas

1. Asaas Dashboard → **Configurações** → **Webhooks**
2. **URL:** `https://www.mejoy.com.br/api/asaas/webhook`
3. **Eventos:** PAYMENT_CONFIRMED, PAYMENT_RECEIVED
4. **Token:** mesmo valor de `ASAAS_WEBHOOK_TOKEN`

---

## PASSO 4 — Deploy

```bash
cd /Users/teobeckert/desenvolvimento/mejoy
git pull origin main
git push origin main
```

(Aguardar Vercel terminar o deploy.)

---

## PASSO 5 — Validar

```bash
BASE_URL=https://www.mejoy.com.br bash scripts/validate-store-v2-production.sh
```

Todos os checks devem ficar verde ✅

---

## PASSO 6 — Compra teste real

1. https://www.mejoy.com.br
2. Produto → Adicionar ao carrinho → Checkout
3. Preencher dados, CEP, gerar PIX
4. Pagar PIX
5. Conferir: PAID, email, dashboard, admin

---

## ROLLBACK (se quebrar)

Vercel → Settings → Environment Variables:
- `STORE_V2=0`
- `NEXT_PUBLIC_STORE_V2=0`  
Salvar → redeploy.
