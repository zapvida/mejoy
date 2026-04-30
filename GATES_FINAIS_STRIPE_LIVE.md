# 🔧 CONFIGURAÇÃO STRIPE LIVE - CHECKLIST

## ✅ Produtos Criados no Stripe Dashboard (LIVE MODE)

### 1. alloe_basic_m - R$ 29,00/mês
- **Product ID**: prod_xxx_basic_monthly
- **Price ID**: price_xxx_basic_monthly_29
- **Valor**: R$ 29,00
- **Intervalo**: monthly
- **Moeda**: BRL

### 2. alloe_plus_m - R$ 49,00/mês
- **Product ID**: prod_xxx_plus_monthly
- **Price ID**: price_xxx_plus_monthly_49
- **Valor**: R$ 49,00
- **Intervalo**: monthly
- **Moeda**: BRL

### 3. alloe_basic_y - R$ 290,00/ano
- **Product ID**: prod_xxx_basic_yearly
- **Price ID**: price_xxx_basic_yearly_290
- **Valor**: R$ 290,00
- **Intervalo**: yearly
- **Moeda**: BRL

### 4. alloe_plus_y - R$ 490,00/ano
- **Product ID**: prod_xxx_plus_yearly
- **Price ID**: price_xxx_plus_yearly_490
- **Valor**: R$ 490,00
- **Intervalo**: yearly
- **Moeda**: BRL

## 🔑 Variáveis de Ambiente (PRODUÇÃO)

```bash
# Stripe LIVE Keys
STRIPE_SECRET_KEY=sk_live_51ABC123...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_51ABC123...

# Stripe LIVE Price IDs
STRIPE_PRICE_BASIC_M=price_1ABC123_basic_monthly_29
STRIPE_PRICE_PLUS_M=price_1ABC123_plus_monthly_49
STRIPE_PRICE_BASIC_Y=price_1ABC123_basic_yearly_290
STRIPE_PRICE_PLUS_Y=price_1ABC123_plus_yearly_490

# Webhook LIVE Secret
STRIPE_WEBHOOK_SECRET=whsec_ABC123...

# Base URL
NEXT_PUBLIC_BASE_URL=https://www.alloehealth.com.br

# Database
DATABASE_URL=postgresql://...
DIRECT_URL=postgresql://...
```

## 🌐 Webhook Endpoint (LIVE)

- **URL**: `https://www.alloehealth.com.br/api/stripe/webhook`
- **Eventos**:
  - `checkout.session.completed`
  - `customer.subscription.created`
  - `customer.subscription.updated`
  - `customer.subscription.deleted`
  - `invoice.payment_succeeded`
  - `invoice.payment_failed`

## 🏪 Portal de Cobrança (LIVE)

- **Return URL**: `https://www.alloehealth.com.br/billing`
- **Funcionalidades Ativas**:
  - ✅ Update payment methods
  - ✅ Cancel subscriptions
  - ✅ Download invoices
  - ✅ Update billing information

## ⚠️ Validações Necessárias

- [ ] Todos os produtos criados no LIVE mode
- [ ] Price IDs copiados corretamente
- [ ] Webhook endpoint configurado
- [ ] Portal de cobrança ativo
- [ ] URLs de produção corretas
- [ ] Chaves LIVE válidas

## 🚨 Próximos Passos

1. Configurar produtos no Stripe Dashboard LIVE
2. Copiar Price IDs para variáveis de ambiente
3. Configurar webhook endpoint
4. Ativar portal de cobrança
5. Testar em modo LIVE antes do anúncio
