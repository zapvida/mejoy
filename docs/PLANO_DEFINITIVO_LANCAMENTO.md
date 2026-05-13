# Plano Definitivo — Lançamento MeJoy

**Status:** Implementado em código. Pronto para validação e deploy.

---

## O que foi implementado

### Fase 1 — Correção PDP "Algo deu errado"
- Removido `isStoreV2Enabled()` do cliente na PDP — evita hydration mismatch
- `getServerSideProps` continua redirecionando quando Store V2 desativado

### Fase 2 — PDP premium (estilo Oficialfarma)
- **Galeria:** Imagem principal + thumbnails quando há múltiplas fotos
- **O que é:** Seção com description/shortBenefit
- **Benefícios:** Lista com checkmarks
- **Composição:** activeIngredients quando disponível
- **Como usar:** Texto com packSizeDisplay
- **FAQ:** 4 perguntas colapsáveis (entrega, troca, segurança, receita)
- **Advertências:** Texto padrão ANVISA
- **Quem viu viu também:** Produtos do mesmo objetivo (até 4)

### Fase 3 — UX e conversão
- **Sticky CTA mobile:** Fixo no rodapé em telas < md (768px)
- **TrustBar:** Já existente (frete, ANVISA, troca 7 dias)

### Fase 4 — Responsividade e acessibilidade
- Grid mobile-first: 2 colunas em mobile, 3–4 em desktop
- Breadcrumbs com aria-label
- Imagens com alt adequado
- Botões com aria-label onde necessário
- Categoria e PDP sem hydration mismatch

### Correções adicionais
- **create-payment.ts:** quantity no tipo de cart.items; cepClean; complement → complemento
- **index.tsx:** Tipagem ProductCardData para sections

---

## Validação local

```bash
# 1. Pré-requisitos
pnpm typecheck && pnpm lint && pnpm build

# 2. Subir servidor
STORE_V2=1 NEXT_PUBLIC_STORE_V2=1 pnpm dev

# 3. Testar manualmente
# - http://localhost:3000 → Home
# - Clicar em produto → PDP (deve carregar sem erro)
# - Adicionar ao carrinho → /cart
# - Checkout → /checkout
```

---

## Validação produção

```bash
BASE_URL=https://www.mejoy.com.br bash scripts/validate-store-v2-production.sh
```

---

## Passos manuais pós-deploy

### 1. Variáveis de ambiente (Vercel)
| Variável | Valor |
|----------|-------|
| STORE_V2 | 1 |
| NEXT_PUBLIC_STORE_V2 | 1 |
| DATABASE_URL | postgresql://your_user:your_password@your_host:5432/your_database (pooler 6543) |
| ASAAS_API_KEY | ... |
| ASAAS_WEBHOOK_TOKEN | obrigatório em prod |
| ADMIN_SECRET_KEY | 64+ caracteres |
| RESEND_API_KEY | ... |

### 2. Webhook Asaas
- URL: `https://www.mejoy.com.br/api/asaas/webhook`
- Eventos: PAYMENT_CONFIRMED, PAYMENT_RECEIVED
- Token: mesmo de ASAAS_WEBHOOK_TOKEN

### 3. Catálogo (se não populado)
- Executar `scripts/catalog-import.sql` no Supabase SQL Editor
- Ou: `STORE_V2_SEED_PRICE_CENTS=9900 pnpm exec tsx scripts/import-catalog-local.ts`

### 4. Teste E2E compra
1. Home → Produto → PDP
2. Adicionar ao carrinho → /cart
3. Checkout → Preencher dados, CEP, gerar PIX
4. Pagar PIX
5. Verificar: Order PAID, email, dashboard, admin

### 5. Rollback
Vercel → STORE_V2=0, NEXT_PUBLIC_STORE_V2=0 → Redeploy
