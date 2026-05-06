# 🚀 Lançamento oficial MeJoy Farma — Ações manuais

**Status:** Código pronto. Build e typecheck OK. Falta apenas executar estes passos manuais.

---

## O que foi implementado (automático)

| Item | Implementação |
|------|---------------|
| **PDP** | Seletor de quantidade (1–10), AddToCartButton com quantity |
| **PDP** | Textos com melhor contraste (`text-gray-700`), CTAs visíveis |
| **PDP** | Cores usando `hsl(var(--brand))` compatível com tema |
| **Tema** | Laranja forte (#EA580C) em theme.css e design-tokens |
| **Webhook Asaas** | Email + WhatsApp (Evolution) + Magic Link no `processStoreV2Payment` |
| **Webhook** | Profile criado/buscado por email para pedidos guest |
| **Dashboard stats** | Contagem de pedidos Zapfarm + Store V2 |
| **Admin KPIs** | Receita e pedidos incluindo Store V2 |
| **Dashboard** | Atividades recentes incluem pedidos Store V2 |
| **micro.d.ts** | Corrigido tipo `buffer(req)` |
| **cart.tsx** | Tipo para `error` no shipping API |

---

## 1. Commit e push

```bash
cd /Users/teobeckert/desenvolvimento/mejoy
git add -A
git status   # conferir
git commit -m "feat: lançamento e-commerce - PDP, tema laranja, Evolution+Magic link Store V2, admin/dashboard"
git push origin main
```

Ou usar o script de deploy:

```bash
pnpm deploy
# ou
bash scripts/deploy-vercel.sh
```

---

## 2. Variáveis de ambiente (Vercel)

**Já existentes:** DATABASE_URL, ASAAS_*, RESEND_*, SUPABASE_*, etc.

**Para WhatsApp (Evolution) — obrigatórias para enviar magic link ao cliente:**

| Variável | Valor | Onde |
|----------|-------|------|
| `EVOLUTION_API_URL` | URL da sua instância Evolution | Vercel → Settings → Env Vars |
| `EVOLUTION_INSTANCE` | Nome da instância (ex: `alloehealth`) | Idem |
| `EVOLUTION_API_KEY` | Chave da API Evolution | Idem |

**Obs:** `sendEvolutionMessageStoreV2` não depende de `EVOLUTION_MAGIC_LINK_ENABLED`. Se as 3 variáveis acima estiverem configuradas, o WhatsApp será enviado. Se faltar alguma, o webhook continua funcionando (apenas não envia WhatsApp).

**Store V2 (já devem estar):**

- `STORE_V2=1`
- `NEXT_PUBLIC_STORE_V2=1`

---

## 3. Webhook Asaas

- **URL:** `https://www.mejoy.com.br/api/webhooks/asaas`
- **Eventos:** PAYMENT_CONFIRMED, PAYMENT_RECEIVED
- Se `ASAAS_WEBHOOK_TOKEN` estiver definido na Vercel, configure o mesmo token no painel Asaas (header `x-asaas-webhook-token`).

---

## 4. Migrations (se ainda não rodou)

Se as migrations Store V2 já foram aplicadas em produção, pule. Caso contrário:

- Supabase → SQL Editor → colar conteúdo de `scripts/store-v2-migrations.sql` → Run

---

## 5. Validação pós-deploy

```bash
BASE_URL=https://www.mejoy.com.br bash scripts/validate-store-v2-production.sh
```

---

## 6. Checklist E2E de compra real

1. [ ] Home → PDP (ex: primeiro produto) → selecionar quantidade → Adicionar ao carrinho
2. [ ] /cart → ir para /checkout
3. [ ] Preencher dados, CEP, gerar PIX
4. [ ] Pagar PIX
5. [ ] Order vira **PAID**
6. [ ] Email de confirmação chega (Resend)
7. [ ] Se Evolution configurado: WhatsApp chega com magic link
8. [ ] Clicar magic link → login automático → /dashboard
9. [ ] Pedido aparece em **/dashboard** (seção "Pedidos da Loja")
10. [ ] Pedido aparece em **/admin/store-v2/orders**

---

## 7. Admin — operação diária

- [ ] `/admin/store-v2/orders` com token Bearer (ADMIN_SECRET_KEY)
- [ ] Alterar status: PAID → PREPARING → SHIPPED
- [ ] Preencher tracking (código + URL)
- [ ] Cliente vê rastreio em `/pedidos/[orderId]`

---

## 8. Rollback imediato

Se algo der errado:

1. Vercel → Settings → Environment Variables
2. `STORE_V2=0` e `NEXT_PUBLIC_STORE_V2=0`
3. Salvar → Redeploy

---

## Arquivos alterados (referência)

- `src/pages/p/[slug].tsx` — PDP: quantidade, contraste, hsl(brand)
- `src/components/store-v2/AddToCartButton.tsx` — prop quantity
- `src/styles/theme.css` — laranja HSL
- `src/pages/api/webhooks/asaas.ts` — Evolution + magic link Store V2
- `src/pages/api/dashboard/stats.ts` — Store V2 em totalPedidos
- `src/pages/api/admin/kpis.ts` — Store V2 em receita e pedidos
- `src/pages/dashboard.tsx` — Store V2 em atividades e resumo
- `src/pages/cart.tsx` — tipo error no shipping
- `src/types/micro.d.ts` — buffer(req)
