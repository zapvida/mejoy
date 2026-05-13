# GO-LIVE — MeJoy Store V2 | 1 Página

**Status:** Pronto para execução manual. Tudo validado. **Rollback:** `STORE_V2=0` em 1 minuto.

---

## 1. PASSOS MANUAIS FINAIS (ordem exata)

| # | Ação | Comando / Onde |
|---|------|----------------|
| 1 | **Migration prod** | SQL no Supabase: copie `scripts/store-v2-migrations.sql` → SQL Editor → Run |
| 2 | **Envs Vercel** | Settings → Environment Variables (lista abaixo) |
| 3 | **Webhook Asaas** | Asaas Dashboard → Configurações → Webhooks |
| 4 | **Deploy** | `git push origin main` (Vercel auto-deploy) |
| 5 | **Validate** | `BASE_URL=https://www.mejoy.com.br bash scripts/validate-store-v2-production.sh` |
| 6 | **Compra E2E** | Fluxo manual (checklist abaixo) |

---

## 2. ENVS OBRIGATÓRIAS (Vercel)

```
STORE_V2=1
NEXT_PUBLIC_STORE_V2=1
DATABASE_URL=postgresql://your_user:your_password@your_host:5432/your_database (pooler porta 6543)
ASAAS_API_KEY=...
ASAAS_WEBHOOK_TOKEN=<obrigatório-em-prod>
ADMIN_SECRET_KEY=<forte-64-chars>
RESEND_API_KEY=...
```

---

## 3. WEBHOOK ASAAS

- **URL:** `https://www.mejoy.com.br/api/webhooks/asaas`
- **Eventos:** PAYMENT_CONFIRMED, PAYMENT_RECEIVED
- **Token:** opcional — se `ASAAS_WEBHOOK_TOKEN` estiver definido, o Asaas pode enviá-lo no header `x-asaas-webhook-token`

---

## 4. CHECKLIST COMPRA REAL E2E

- [ ] Home → PDP → Adicionar ao carrinho
- [ ] /checkout → preencher dados, CEP, gerar PIX
- [ ] Pagar PIX
- [ ] Order vira **PAID**
- [ ] Email de confirmação chega (Resend)
- [ ] Pedido aparece em **/dashboard**
- [ ] Pedido aparece em **/admin/store-v2/orders**

---

## 5. CHECKLIST OPERAÇÃO ADMIN (status + tracking)

- [ ] Acessar `/admin/store-v2/orders` com `Authorization: Bearer ADMIN_SECRET_KEY`
- [ ] Alterar status: PAID → PREPARING → SHIPPED
- [ ] Preencher tracking (código + URL)
- [ ] Cliente vê tracking em `/pedidos/[orderId]`
- [ ] Emails SHIPPED e DELIVERED disparam (idempotentes)

---

## 6. ROLLBACK IMEDIATO

**Se falhar X → faça rollback:**

1. Vercel → Settings → Environment Variables
2. `STORE_V2=0` e `NEXT_PUBLIC_STORE_V2=0`
3. Salvar → Redeploy

Loja volta ao B2CLanding. **Sem novo deploy.**

---

## 7. LIBERAR CAMPANHA (10% → 30% → 100%)

| Etapa | Critério |
|-------|----------|
| **10%** | Validate passou + 1 compra E2E OK |
| **30%** | 5+ compras sem incidente + admin operacional |
| **100%** | 24h estável + rollback testado (STORE_V2=0) |

---

## MIGRATIONS (já existem)

```
prisma/migrations/20260228120000_store_v2_models/
prisma/migrations/20260228130000_store_v2_asaas_payment_id/
prisma/migrations/20260228140000_store_v2_webhook_events/
prisma/migrations/20260228150000_store_v2_rx_submissions/
prisma/migrations/20260228160000_store_v2_order_tracking_audit/
```
