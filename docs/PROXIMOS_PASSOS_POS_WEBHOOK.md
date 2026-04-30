# Próximos passos — pós webhook e deploy

**O que foi feito:**
1. Migrations rodadas (Supabase)
2. Redeploy (git push)
3. Webhook configurado: `https://www.mejoy.com.br/api/webhooks/asaas`
4. Token **opcional** — pode deixar sem `ASAAS_WEBHOOK_TOKEN`
5. Env `WEBHOOK_ASAAS_URL` atualizada

---

## Próximos passos (ordem)

### 1. Fazer deploy do código atual

```bash
cd ~/desenvolvimento/mejoy
git add -A
git status
git commit -m "fix: webhook em /api/webhooks/asaas, token opcional"
git push origin main
```

Aguarde o deploy na Vercel terminar.

---

### 2. Conferir Asaas

- URL do webhook: `https://www.mejoy.com.br/api/webhooks/asaas`
- Eventos: PAYMENT_CONFIRMED, PAYMENT_RECEIVED
- Token: em branco (ou configurar se quiser)

---

### 3. Rodar validação

```bash
cd ~/desenvolvimento/mejoy

# Health + páginas
BASE_URL=https://www.mejoy.com.br bash scripts/validate-store-v2-production.sh

# SEO PDP
BASE_URL=https://www.mejoy.com.br bash scripts/validate-seo.sh
```

Todos devem passar.

---

### 4. Compra E2E (1 PIX real)

1. Acesse https://www.mejoy.com.br
2. Produto → Adicionar ao carrinho → Finalizar compra
3. Preencha dados, CEP, gere PIX
4. Pague com PIX

Depois confira:
- [ ] Pedido fica **PAID**
- [ ] Email de confirmação recebido
- [ ] Pedido em /dashboard
- [ ] Pedido em /admin/store-v2/orders

---

### 5. (Opcional) PDP e Carrinho premium

Para ativar TrustBar ampliada, progress bar de frete, upsell:
- Envs: `STORE_V2_CONVERSION=1` e `NEXT_PUBLIC_STORE_V2_CONVERSION=1`
- Redeploy

---

## Checklist final

- [ ] Deploy concluído
- [ ] validate-store-v2-production.sh passou
- [ ] validate-seo.sh passou
- [ ] 1 compra PIX paga e validada
- [ ] PAID + email + dashboard + admin conferidos

Depois disso → campanha liberada com rampa 10% → 30% → 100%.
