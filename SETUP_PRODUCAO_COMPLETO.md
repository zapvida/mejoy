# Setup Produção — MeJoy.com.br

Tudo que precisa ser feito **manualmente** para colocar o projeto em produção.

---

## 1. Variáveis de ambiente (Vercel)

Acesse: **Vercel → Project → Settings → Environment Variables**

### 1.1 Novas envs obrigatórias

| Name | Value | Environments |
|------|-------|---------------|
| `ASAAS_PRICE_TIRZEPATIDA_2_5` | `100000` | Production, Preview, Development |
| `ASAAS_PRICE_TIRZEPATIDA_5` | `200000` | Production, Preview, Development |
| `ASAAS_PRICE_TIRZEPATIDA_20` | `250000` | Production, Preview, Development |
| `ASAAS_PRICE_ASSINATURA_SOCIO` | `244200` | Production, Preview, Development |
| `ASAAS_PRICE_ASSINATURA_PUBLICO` | `294200` | Production, Preview, Development |
| `ASAAS_PRICE_TESTE` | `1000` | Production, Preview, Development |

### 1.2 Envs opcionais (feature flags)

| Name | Value | Uso |
|------|-------|-----|
| `NEXT_PUBLIC_TEST_CHECKOUT_PRODUCT` | `0` | Produção: deixe `0`. Use `1` só para validar fluxo R$10 |
| `NEXT_PUBLIC_TIRZEPATIDA_ENABLED` | `1` | Mostrar produto Tirzepatida na vitrine |

### 1.3 Webhook Asaas

| Name | Value |
|------|-------|
| `ASAAS_WEBHOOK_TOKEN` | Token secreto (ex: UUID) — **já configurado** |

O token deve ser o **mesmo** configurado no painel do Asaas (Webhooks → Token).

---

## 2. Webhook Asaas (painel Asaas)

1. Acesse **Asaas → Configurações → Webhooks**
2. Adicione ou edite o webhook:
   - **URL:** `https://www.mejoy.com.br/api/asaas/webhook`
   - **Eventos:** `PAYMENT_CONFIRMED`, `PAYMENT_RECEIVED`, `PAYMENT_UPDATED`, `PAYMENT_OVERDUE`, `PAYMENT_DELETED`, `PAYMENT_REFUNDED`
   - **Token:** o mesmo valor de `ASAAS_WEBHOOK_TOKEN` no Vercel

---

## 3. Evolution API — Webhook inbound (MENU)

Para que a resposta automática "MENU" funcione:

1. Acesse o painel da **Evolution API** (ou use a API)
2. Configure o webhook da instância:
   - **URL:** `https://www.mejoy.com.br/api/evolution/webhook`
   - **Eventos:** `MESSAGES_UPSERT`

Ou, se usar `webhook_by_events=true`:
- **URL base:** `https://www.mejoy.com.br/api/evolution`
- O Evolution adicionará `/messages-upsert` automaticamente

---

## 4. Checklist pré-deploy

- [ ] `pnpm lint && pnpm build` OK
- [ ] Todas as envs de preço configuradas (ver `vercel env ls`)
- [ ] `ASAAS_WEBHOOK_TOKEN` igual no Vercel e no Asaas
- [ ] Webhook Evolution apontando para produção
- [ ] `NEXT_PUBLIC_TEST_CHECKOUT_PRODUCT=0` em produção (ou `1` só para teste)
- [ ] `EVOLUTION_MAGIC_LINK_ENABLED=true` para WhatsApp pós-compra

---

## 5. Como testar

### Local

```bash
pnpm dev
# Testar: /calvicie, /sono, /tirzepatida, checkout
```

### Produto teste (R$ 10)

1. Setar `NEXT_PUBLIC_TEST_CHECKOUT_PRODUCT=1` no Vercel
2. Redeploy
3. Acessar checkout do produto "Teste" (se houver rota)
4. Pagar R$ 10 via PIX
5. Verificar webhook → email + WhatsApp

### Webhook Asaas

```bash
# Simular (com curl - substituir TOKEN e PAYLOAD)
curl -X POST https://www.mejoy.com.br/api/asaas/webhook \
  -H "Content-Type: application/json" \
  -H "asaas-access-token: SEU_TOKEN" \
  -d '{"event":"PAYMENT_CONFIRMED","payment":{...}}'
```

### Evolution MENU

1. Enviar "MENU" para o número WhatsApp conectado à Evolution
2. Deve receber: "Recebi ✅. Uma secretária inteligente irá falar com você em instantes. Por favor, aguarde."

---

## 6. Rollback

- **Produto teste:** `NEXT_PUBLIC_TEST_CHECKOUT_PRODUCT=0` → redeploy
- **Tirzepatida:** `NEXT_PUBLIC_TIRZEPATIDA_ENABLED=0` → não exibe na vitrine
- **Webhook:** reverter commit do webhook e redeploy

---

## 7. Arquivos alterados (referência)

| Arquivo | Alteração |
|---------|-----------|
| `src/config/zapfarm/pricing.ts` | Price registry, assinatura, teste, tirzepatida |
| `src/config/zapfarm/products.ts` | Produto Tirzepatida (3 SKUs) |
| `src/lib/asaas/utils.ts` | Mapeamento Tirzepatida 2_5/5/20 |
| `src/lib/zapfarm/price-resolver.ts` | Tirzepatida em SLUG_TO_ENV e getEnvPriceCents |
| `src/pages/api/asaas/webhook.ts` | Token validation, idempotência, WhatsApp pós-pagamento |
| `src/pages/api/evolution/webhook.ts` | Novo — resposta MENU |
| `src/pages/api/evolution/messages-upsert.ts` | Novo — alias para webhook por evento |
