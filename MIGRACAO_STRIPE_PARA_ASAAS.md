# 🚀 Migração Completa: Stripe → Asaas

## ✅ Status da Migração

Esta migração substitui completamente o Stripe pelo Asaas no projeto ZapFarm, mantendo todas as funcionalidades de pagamento (PIX e Cartão de Crédito) sem quebrar nada.

## 📋 O que foi implementado

### 1. ✅ Estrutura Base do Asaas
- **`src/lib/asaas/config.ts`** - Configurações do Asaas
- **`src/lib/asaas/client.ts`** - Cliente API do Asaas
- **`src/lib/asaas/utils.ts`** - Utilitários (preços, datas, etc)

### 2. ✅ APIs de Checkout
- **`src/pages/api/asaas/product-checkout.ts`** - Checkout simplificado para produtos
- **`src/pages/api/asaas/create-payment.ts`** - Criação de pagamentos (PIX e Cartão)

### 3. ✅ Webhook de Notificações
- **`src/pages/api/asaas/webhook.ts`** - Processa eventos do Asaas (pagamentos confirmados, vencidos, etc)

### 4. ✅ Schema do Banco de Dados
- Atualizado `prisma/schema.prisma`:
  - `ZapfarmOrder`: `stripeSessionId` → `asaasPaymentId`
  - `Subscription`: `stripeSubscriptionId` → `asaasSubscriptionId`
  - `GiftToken`: `stripeSessionId` → `asaasPaymentId`
  - Adicionado campo `billingType` (PIX | CREDIT_CARD)

### 5. ✅ Componentes Atualizados
- **`src/pages/[product]/checkout.tsx`** - Já usa `/api/asaas/create-payment`

## 🔧 Configuração Necessária

### Variáveis de Ambiente

Adicione as seguintes variáveis de ambiente:

```bash
# Asaas API Key (obtenha em https://www.asaas.com)
ASAAS_API_KEY=seu_token_aqui

# Ambiente (sandbox ou production)
ASAAS_ENVIRONMENT=sandbox  # ou 'production'

# Preços dos produtos (em centavos)
# Exemplo para emagrecimento:
ASAAS_PRICE_EMAGRECIMENTO_BASICO=29900
ASAAS_PRICE_EMAGRECIMENTO_COMPLETO=49900
ASAAS_PRICE_EMAGRECIMENTO_PREMIUM=79900

# Repita para todos os produtos:
# ASAAS_PRICE_CALVICIE_BASICO=...
# ASAAS_PRICE_CALVICIE_COMPLETO=...
# ASAAS_PRICE_CALVICIE_PREMIUM=...
# ... e assim por diante
```

### Configuração do Webhook no Asaas

1. Acesse https://www.asaas.com → Configurações → Webhooks
2. Adicione endpoint: `https://seu-dominio.com/api/asaas/webhook`
3. Selecione eventos:
   - `PAYMENT_CONFIRMED`
   - `PAYMENT_RECEIVED`
   - `PAYMENT_UPDATED`
   - `PAYMENT_OVERDUE`
   - `PAYMENT_DELETED`
   - `PAYMENT_REFUNDED`
4. Configure IP whitelist (recomendado em produção)

## 📝 Migração do Banco de Dados

Execute a migração SQL em `prisma/migrations/migrate_stripe_to_asaas.sql`:

```bash
# Via Prisma Studio ou cliente PostgreSQL
psql $DATABASE_URL -f prisma/migrations/migrate_stripe_to_asaas.sql
```

Ou use o Prisma Migrate:

```bash
npx prisma migrate dev --name migrate_stripe_to_asaas
```

## 🔄 Páginas que Ainda Precisam ser Atualizadas

As seguintes páginas ainda referenciam APIs do Stripe e precisam ser atualizadas:

1. **`src/pages/emagrecimento/checkout.tsx`**
   - Atualizar: `/api/stripe/zapfarm-checkout` → `/api/asaas/product-checkout`

2. **`src/pages/pricing.tsx`**
   - Atualizar: `/api/stripe/create-checkout-session` → Criar nova API para assinaturas

3. **`src/pages/presente.tsx`**
   - Atualizar: `/api/stripe/create-checkout-session` → Criar nova API para presentes

4. **`src/pages/assinatura.tsx`**
   - Atualizar: `/api/stripe/checkout` → Criar nova API para assinaturas

5. **`src/components/b2b/Pricing.tsx`**
   - Atualizar: `/api/stripe/checkout` → Criar nova API para B2B

6. **`src/pages/api/gift/create.ts`**
   - Atualizar: Referência ao Stripe → Usar Asaas

## 🗑️ Remover Após Migração Completa

Após atualizar todas as páginas acima, você pode remover:

### Arquivos do Stripe:
- `src/pages/api/stripe/*` (todos os arquivos)
- `src/lib/stripe/*` (todos os arquivos)
- `src/lib/stripe-config.ts`
- `src/lib/zapfarm/stripe-utils.ts`

### Dependências:
- Remover `stripe` do `package.json`
- Remover `@types/stripe` do `package.json` (devDependencies)

### Variáveis de Ambiente:
- Remover todas as `STRIPE_*` do `.env`

## ✅ Checklist Final

- [ ] Configurar variáveis de ambiente do Asaas
- [ ] Configurar webhook no dashboard do Asaas
- [ ] Executar migração do banco de dados
- [ ] Atualizar páginas que ainda usam Stripe (lista acima)
- [ ] Testar checkout PIX
- [ ] Testar checkout Cartão de Crédito
- [ ] Testar webhook de notificações
- [ ] Remover arquivos e dependências do Stripe
- [ ] Atualizar documentação

## 🎯 Benefícios da Migração

1. **Mais simples**: Asaas é mais fácil de configurar que Stripe
2. **Brasileiro**: Melhor suporte para PIX e regulamentações brasileiras
3. **Melhor UX**: Checkout nativo em português
4. **Menos complexidade**: Menos configurações necessárias
5. **Melhor para e-commerce**: Otimizado para vendas no Brasil

## 📞 Suporte

Em caso de dúvidas sobre a API do Asaas:
- Documentação: https://docs.asaas.com/
- Suporte: https://www.asaas.com/contato

---

**Data da Migração**: Janeiro 2025
**Status**: ✅ Estrutura base completa, pendente atualização de páginas específicas

