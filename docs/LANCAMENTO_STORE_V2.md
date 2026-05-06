# Lançamento Store V2 — MeJoy E-commerce

**Objetivo:** Loja 200 SKUs em produção, vendendo via PIX (Asaas), com lançamento contínuo.

**→ Para go-live imediato:** `docs/GO_LIVE_LOCKDOWN.md` (1 página com tudo)

---

## Checklist Pré-Lançamento

### 1. Banco de Dados

```bash
# Com DATABASE_URL configurado
cd /Users/teobeckert/desenvolvimento/mejoy
pnpm prisma migrate deploy
pnpm prisma generate
```

### 2. Importar Catálogo

O CSV atual tem preços vazios. Para ativar produtos na loja:

**Opção A — Preço padrão para todos (seed):**
```bash
# Define R$ 99,00 como preço para produtos sem preço no CSV
STORE_V2_SEED_PRICE_CENTS=9900 pnpm smoke:import
```

**Opção B — Via API (com servidor rodando):**
```bash
curl -X POST https://www.mejoy.com.br/api/admin/catalog/import \
  -H "Authorization: Bearer SEU_ADMIN_SECRET_KEY" \
  -d '{}'
# Use STORE_V2_SEED_PRICE_CENTS=9900 nas envs da Vercel para preencher preços vazios
```

### 3. Variáveis de Ambiente (Vercel)

**Obrigatórias para Store V2:**

```
STORE_V2=1
NEXT_PUBLIC_STORE_V2=1
DATABASE_URL=postgresql://...
ASAAS_API_KEY=...
ASAAS_WEBHOOK_TOKEN=<token-seguro>  # Obrigatório em produção
ADMIN_SECRET_KEY=<token-seguro-64-chars>
RESEND_API_KEY=...
```

**Já existentes (manter):** Supabase, NextAuth, etc.

### 4. Webhook Asaas

No painel Asaas: Configurações > Webhooks

- **URL:** `https://www.mejoy.com.br/api/asaas/webhook`
- **Eventos:** PAYMENT_CONFIRMED, PAYMENT_RECEIVED
- **Token:** **obrigatório em produção** — valor igual a `ASAAS_WEBHOOK_TOKEN`

### 5. Deploy

```bash
git add -A
git commit -m "feat(store-v2): carrinho + checkout Asaas PIX"
git push origin main
pnpm deploy
```

---

## Validação Pós-Deploy

```bash
BASE_URL=https://www.mejoy.com.br bash scripts/validate-store-v2-production.sh
```

O script valida: health, health/store-v2, health/catalog, health/payments, PDP dinâmico, webhook 401, admin 401.

**Compra teste real end-to-end:**

1. https://www.mejoy.com.br → Home Store V2
2. /c/sono → Listagem
3. /p/[slug] → PDP (slug real do banco; script usa sample-slug dinamicamente)
4. Adicionar → Carrinho → Checkout
5. Preencher dados, CEP, gerar PIX
6. Pagar PIX → Webhook atualiza Order → PAID
7. Verificar: email recebido, pedido no dashboard, admin vê pedido

---

## Rollback Imediato

Se algo quebrar:

1. Vercel → Project → Settings → Environment Variables
2. `STORE_V2=0` e `NEXT_PUBLIC_STORE_V2=0`
3. Salvar → Redeploy ou aguardar próximo deploy

A loja volta ao B2CLanding e fluxos legados **sem novo deploy**.

---

## Próximas Melhorias (pós-lançamento)

- [ ] Cartão de crédito (form ou redirect Asaas)
- [ ] RX/Validação + WhatsApp Evolution
- [ ] Assinaturas
- [ ] Migração Pagar.me (quando desejado)
