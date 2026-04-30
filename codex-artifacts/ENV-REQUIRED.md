# 📋 ENV-REQUIRED.md - Variáveis de Ambiente Necessárias

## ✅ Variáveis Stripe (TEST MODE)

### Chaves de API
- `STRIPE_SECRET_KEY` - Chave secreta do Stripe (sk_test_...)
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` - Chave pública do Stripe (pk_test_...)
- `STRIPE_WEBHOOK_SECRET` - Secret do webhook (whsec_...)

### Price IDs dos Planos
- `STRIPE_PRICE_BASIC_M` - Price ID do plano básico mensal (price_...)
- `STRIPE_PRICE_PLUS_M` - Price ID do plano plus mensal (price_...)
- `STRIPE_PRICE_BASIC_Y` - Price ID do plano básico anual (price_...)
- `STRIPE_PRICE_PLUS_Y` - Price ID do plano plus anual (price_...)

## ✅ Variáveis de Aplicação
- `NEXT_PUBLIC_BASE_URL` - URL base da aplicação (https://www.alloehealth.com.br)
- `DATABASE_URL` - URL de conexão com o banco de dados

## ✅ Variáveis Opcionais
- `GA4_MEASUREMENT_ID` - ID de medição do GA4 (G-...)
- `SENTRY_DSN` - DSN do Sentry para monitoramento de erros

## 🔧 Configuração no Stripe Dashboard

### Products Criados
1. **alloe_basic_m** - R$ 29,00/mês
2. **alloe_plus_m** - R$ 49,00/mês  
3. **alloe_basic_y** - R$ 290,00/ano
4. **alloe_plus_y** - R$ 490,00/ano

### Webhook Endpoint
- URL: `https://www.alloehealth.com.br/api/stripe/webhook`
- Eventos: checkout.session.completed, customer.subscription.*, invoice.*

### Portal de Cobrança
- Return URL: `https://www.alloehealth.com.br/billing`
- Funcionalidades: Update payment methods, Cancel subscriptions, Download invoices

## ⚠️ Validação Necessária
- [ ] Todas as variáveis estão definidas
- [ ] Price IDs são válidos no Stripe
- [ ] Webhook endpoint está configurado
- [ ] Portal de cobrança está ativo
- [ ] URLs estão corretas para produção

## 🚨 Próximos Passos
1. Configurar produtos no Stripe Dashboard
2. Copiar Price IDs para variáveis de ambiente
3. Configurar webhook endpoint
4. Ativar portal de cobrança
5. Testar em modo TEST antes de ir para LIVE
