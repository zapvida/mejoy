# 🔗 WEBHOOK STRIPE LIVE - CONFIGURAÇÃO E TESTE

## 🌐 Configuração do Webhook

### Endpoint URL
```
https://www.alloehealth.com.br/api/stripe/webhook
```

### Eventos Configurados
- ✅ `checkout.session.completed`
- ✅ `customer.subscription.created`
- ✅ `customer.subscription.updated`
- ✅ `customer.subscription.deleted`
- ✅ `invoice.payment_succeeded`
- ✅ `invoice.payment_failed`

### Secret do Webhook
```
whsec_ABC123... (LIVE)
```

## 🧪 Teste do Webhook

### 1. Teste customer.subscription.created
```json
{
  "id": "evt_test_subscription_created",
  "object": "event",
  "api_version": "2020-08-27",
  "created": 1697123456,
  "data": {
    "object": {
      "id": "sub_live_123456789",
      "object": "subscription",
      "customer": "cus_live_123456789",
      "status": "active",
      "current_period_start": 1697123456,
      "current_period_end": 1699715456,
      "items": {
        "data": [
          {
            "price": {
              "id": "price_live_basic_monthly",
              "unit_amount": 2900,
              "currency": "brl",
              "recurring": {
                "interval": "month"
              }
            }
          }
        ]
      },
      "metadata": {
        "userId": "user_live_123",
        "planType": "BASIC_MONTHLY",
        "plan": "basic",
        "period": "monthly",
        "method": "card"
      }
    }
  },
  "livemode": true,
  "pending_webhooks": 1,
  "request": {
    "id": "req_live_subscription_created",
    "idempotency_key": null
  },
  "type": "customer.subscription.created"
}
```

### 2. Teste invoice.payment_succeeded
```json
{
  "id": "evt_test_payment_succeeded",
  "object": "event",
  "api_version": "2020-08-27",
  "created": 1697123456,
  "data": {
    "object": {
      "id": "in_live_123456789",
      "object": "invoice",
      "customer": "cus_live_123456789",
      "subscription": "sub_live_123456789",
      "amount_paid": 2900,
      "currency": "brl",
      "status": "paid",
      "metadata": {
        "userId": "user_live_123",
        "planType": "BASIC_MONTHLY",
        "plan": "basic",
        "period": "monthly"
      }
    }
  },
  "livemode": true,
  "pending_webhooks": 1,
  "request": {
    "id": "req_live_payment_succeeded",
    "idempotency_key": null
  },
  "type": "invoice.payment_succeeded"
}
```

## 🔍 Validação dos Logs

### Logs Esperados (Sucesso)
```
✅ Webhook recebido: customer.subscription.created
✅ Subscription criada no banco: sub_live_123456789
✅ Status: active
✅ Usuário: user_live_123
✅ Plano: basic monthly
```

### Logs de Erro (Falha)
```
❌ Webhook falhou: customer.subscription.created
❌ Erro: Invalid signature
❌ Status: 400
❌ Ação: Verificar STRIPE_WEBHOOK_SECRET
```

## 🚨 Monitoramento

### Alertas Configurados
- **Webhook falha > 1%**: Alerta crítico
- **Tempo resposta > 5s**: Alerta de performance
- **Erro 4xx/5xx**: Alerta de erro
- **Eventos duplicados**: Alerta de idempotência

### Métricas de Sucesso
- **Taxa de sucesso**: > 99%
- **Tempo médio**: < 2s
- **Erros**: < 1%
- **Duplicatas**: 0%

## ✅ Checklist de Validação

- [ ] Webhook endpoint configurado
- [ ] Eventos selecionados corretamente
- [ ] Secret configurado
- [ ] Teste customer.subscription.created enviado
- [ ] Teste invoice.payment_succeeded enviado
- [ ] Logs sem erros 4xx/5xx
- [ ] Subscription criada no banco
- [ ] Payment processado corretamente

## 🔧 Troubleshooting

### Se webhook falhar:
1. Verificar STRIPE_WEBHOOK_SECRET
2. Verificar URL do endpoint
3. Verificar logs da aplicação
4. Testar com Stripe CLI

### Se eventos não chegarem:
1. Verificar conectividade
2. Verificar firewall
3. Verificar SSL/TLS
4. Verificar logs do Stripe

## 📊 Status do Webhook

**Endpoint**: `https://www.alloehealth.com.br/api/stripe/webhook`
**Status**: ⏳ Aguardando configuração
**Eventos**: 6 eventos configurados
**Secret**: Configurado
**Teste**: ⏳ Aguardando execução
