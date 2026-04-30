# Setup Lançamento Store V2 — Copiar e Colar

**Status:** Implementação concluída. Siga os passos abaixo para ativar em produção.

---

## 1. Variáveis de Ambiente (Vercel)

Em **Vercel → zapfarm → Settings → Environment Variables**, adicione ou confira:

```
STORE_V2=1
NEXT_PUBLIC_STORE_V2=1
STORE_V2_SEED_PRICE_CENTS=9900
ADMIN_SECRET_KEY=<gere-um-token-64-chars>
```

**Já devem existir:** `DATABASE_URL`, `ASAAS_API_KEY`, `ASAAS_ENVIRONMENT`

---

## 2. Aplicar Migration

```bash
cd /Users/teobeckert/desenvolvimento/mejoy
# Com DATABASE_URL no .env
npx prisma migrate deploy
```

---

## 3. Importar Catálogo

**Com servidor local rodando** (ou após deploy):

```bash
# Via curl (substitua BASE e ADMIN_SECRET_KEY)
curl -X POST http://localhost:3000/api/admin/catalog/import \
  -H "Authorization: Bearer SEU_ADMIN_SECRET_KEY"
```

Ou via script (requer `DATABASE_URL` no ambiente):

```bash
STORE_V2_SEED_PRICE_CENTS=9900 pnpm smoke:import
```

---

## 4. Webhook Asaas

No **Asaas Dashboard** → Configurações → Webhooks:

- **URL:** `https://www.mejoy.com.br/api/asaas/webhook`
- **Eventos:** PAYMENT_CONFIRMED, PAYMENT_RECEIVED, PAYMENT_OVERDUE

---

## 5. Deploy

```bash
git push origin main
# Ou use o Deploy Hook da Vercel se configurado
```

---

## 6. Validação

```bash
pnpm validate:prod
# ou
BASE_URL=https://www.mejoy.com.br bash scripts/validate-store-v2-production.sh
```

**Fluxo manual de teste:**

1. https://www.mejoy.com.br (com STORE_V2=1)
2. Navegar: Home → /c/sono → produto → Adicionar ao carrinho
3. Carrinho → Finalizar compra
4. Preencher dados, CEP, avançar
5. Pagar via PIX (sandbox ou produção)
6. Webhook atualiza Order para PAID

---

## Rollback

Se algo quebrar: defina `STORE_V2=0` e `NEXT_PUBLIC_STORE_V2=0` nas envs da Vercel. A loja volta ao layout legado sem novo deploy.
