# 🚀 DEPLOY FINAL PRODUÇÃO - COMANDOS DE EXECUÇÃO

## 📋 Comandos de Deploy

### 1. Pull da Configuração de Produção
```bash
vercel pull --environment=production
```

### 2. Deploy em Produção
```bash
vercel deploy --prod
```

### 3. Verificar Deploy
```bash
# Verificar status do deploy
vercel ls

# Verificar logs
vercel logs --follow
```

## 🔍 Validação Pós-Deploy

### 1. Verificar URLs
- ✅ `https://www.alloehealth.com.br/pricing`
- ✅ `https://www.alloehealth.com.br/dashboard`
- ✅ `https://www.alloehealth.com.br/billing`
- ✅ `https://www.alloehealth.com.br/presente`
- ✅ `https://www.alloehealth.com.br/resgatar`

### 2. Verificar APIs
- ✅ `https://www.alloehealth.com.br/api/stripe/create-checkout-session`
- ✅ `https://www.alloehealth.com.br/api/stripe/create-portal-session`
- ✅ `https://www.alloehealth.com.br/api/stripe/webhook`
- ✅ `https://www.alloehealth.com.br/api/gift/create`
- ✅ `https://www.alloehealth.com.br/api/gift/redeem`

### 3. Verificar Performance
- ✅ Lighthouse Score > 90
- ✅ Tempo de carregamento < 3s
- ✅ A11y Score = 100
- ✅ Erros no console = 0

## 🧪 Smoke Test Final

### Teste 1: Página de Pricing
```bash
curl -I https://www.alloehealth.com.br/pricing
# Esperado: 200 OK
```

### Teste 2: API de Checkout
```bash
curl -X POST https://www.alloehealth.com.br/api/stripe/create-checkout-session \
  -H "Content-Type: application/json" \
  -d '{"planType": "BASIC_MONTHLY", "userId": "test", "email": "test@test.com", "name": "Test"}'
# Esperado: 200 OK com sessionId
```

### Teste 3: API de Portal
```bash
curl -X POST https://www.alloehealth.com.br/api/stripe/create-portal-session \
  -H "Content-Type: application/json" \
  -d '{"userId": "test"}'
# Esperado: 200 OK com url
```

### Teste 4: API de Presente
```bash
curl -X POST https://www.alloehealth.com.br/api/gift/create \
  -H "Content-Type: application/json" \
  -d '{"userId": "test", "recipientName": "Test", "recipientEmail": "test@test.com"}'
# Esperado: 200 OK com giftTokenId
```

## 📊 Monitoramento Pós-Deploy

### Primeiras 24h
- **Erros 500**: < 1%
- **Tempo resposta**: < 3s
- **Conversão**: > 5%
- **Webhooks**: 100% sucesso

### Primeira Semana
- **Receita**: > R$ 500
- **Churn**: < 20%
- **Presentes**: > 5 criados
- **Suporte**: < 10 tickets

### Primeiro Mês
- **ARPU**: > R$ 30
- **Retenção**: > 80%
- **Crescimento**: > 20%
- **Satisfação**: > 4.5/5

## 🚨 Alertas Críticos

### Críticos (Primeiras 24h)
- Erro 500 > 5%
- Webhook falha > 1%
- Tempo resposta > 5s
- Conversão < 3%

### Importantes (Primeira semana)
- Churn > 20%
- Taxa de erro checkout > 2%
- Presentes não resgatados > 50%
- Performance < 90

### Informativos (Primeiro mês)
- Receita mensal < R$ 500
- ARPU < R$ 30
- Taxa de presente < 5%
- Suporte > 10 tickets/dia

## 🔄 Rollback de Emergência

### Rollback Rápido (5 min)
```bash
# Reverter para commit anterior
git revert HEAD --no-edit
git push origin main

# Deploy de rollback
vercel deploy --prod
```

### Rollback Completo (15 min)
```bash
# Reverter para branch anterior
git checkout main
git reset --hard HEAD~1
git push origin main --force

# Deploy de rollback
vercel deploy --prod

# Verificar saúde
curl -f https://www.alloehealth.com.br/api/health
```

## ✅ Checklist de Deploy

### Pré-Deploy
- [x] Código testado localmente
- [x] Build funcionando
- [x] Testes E2E passando
- [x] Performance otimizada
- [x] Acessibilidade validada
- [x] Documentação completa

### Deploy
- [ ] Pull configuração produção
- [ ] Deploy em produção
- [ ] Verificar URLs funcionando
- [ ] Verificar APIs funcionando
- [ ] Smoke test executado
- [ ] Monitoramento ativo

### Pós-Deploy
- [ ] Monitorar por 24h
- [ ] Verificar métricas
- [ ] Validar conversões
- [ ] Confirmar com stakeholders

## 🎯 Status do Deploy

**Comando**: `vercel deploy --prod`
**Status**: ⏳ Aguardando execução
**URLs**: ⏳ Aguardando validação
**APIs**: ⏳ Aguardando validação
**Smoke Test**: ⏳ Aguardando execução
**Monitoramento**: ⏳ Aguardando ativação
