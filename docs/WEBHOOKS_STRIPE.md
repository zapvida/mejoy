# Stripe Webhooks Configuration
# Para configurar os webhooks no Stripe Dashboard:

# 1. Acesse: https://dashboard.stripe.com/webhooks
# 2. Clique em "Add endpoint"
# 3. URL do endpoint: https://alloehealth.com.br/api/stripe/webhook
# 4. Eventos para escutar:
#    - checkout.session.completed
#    - customer.subscription.created
#    - customer.subscription.updated
#    - customer.subscription.deleted
#    - invoice.payment_succeeded
#    - invoice.payment_failed

# 5. Copie o "Signing secret" e configure como STRIPE_WEBHOOK_SECRET

# Configuração do Portal de Cobrança:
# 1. Acesse: https://dashboard.stripe.com/settings/billing/portal
# 2. Configure as funcionalidades disponíveis:
#    - Update payment methods
#    - Cancel subscriptions
#    - Update billing information
#    - Download invoices

# Planos de Preço no Stripe:
# 1. Acesse: https://dashboard.stripe.com/products
# 2. Crie os produtos e preços:
#    - Alloe Health Plus - Mensal R$ 29
#    - Alloe Health Plus - Mensal R$ 49
#    - Alloe Health Plus - Anual R$ 290 (10 meses)
#    - Alloe Health Plus - Anual R$ 490 (10 meses)
# 3. Copie os Price IDs e configure nas variáveis de ambiente