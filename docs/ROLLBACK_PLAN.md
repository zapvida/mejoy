# 🚨 ROLLBACK PLAN - PR-2 MONETIZAÇÃO

## ⚡ Rollback Rápido (5 minutos)

### 1. Reverter Código
```bash
# Reverter para commit anterior
git revert HEAD --no-edit
git push origin main

# Ou reverter para branch específica
git checkout main
git reset --hard HEAD~1
git push origin main --force
```

### 2. Desativar Webhooks Stripe
1. Acesse: https://dashboard.stripe.com/webhooks
2. Encontre o endpoint: `https://alloehealth.com.br/api/stripe/webhook`
3. Clique em "Desativar" ou delete o endpoint

### 3. Desmarcar Conversão GA4
1. Acesse GA4 → Admin → Eventos
2. Encontre `subscribe_click`
3. Clique em "Desmarcar como conversão"

### 4. Verificar Funcionalidade Básica
- ✅ Triagens continuam funcionando
- ✅ Relatórios continuam sendo gerados
- ✅ Página inicial carrega normalmente

## 🔄 Rollback Completo (15 minutos)

### 1. Banco de Dados
```sql
-- Reverter migration do GiftToken
DROP TABLE IF EXISTS "GiftToken";

-- Limpar dados de assinatura se necessário
DELETE FROM "Subscription" WHERE created_at > '2025-10-13';
```

### 2. Variáveis de Ambiente
```bash
# Remover variáveis Stripe
unset STRIPE_SECRET_KEY
unset STRIPE_WEBHOOK_SECRET
unset STRIPE_PRICE_BASIC_M
unset STRIPE_PRICE_PLUS_M
unset STRIPE_PRICE_BASIC_Y
unset STRIPE_PRICE_PLUS_Y
```

### 3. Limpar Cache
```bash
# Limpar cache do Next.js
rm -rf .next
npm run build
```

### 4. Verificar Logs
```bash
# Verificar logs de erro
tail -f logs/error.log

# Verificar métricas
curl https://alloehealth.com.br/api/health
```

## 🚨 Pontos de Falha Críticos

### 1. Webhook Stripe Falhando
**Sintomas:**
- Assinaturas não são criadas no banco
- Usuários pagam mas não têm acesso
- Logs mostram erro 500 em webhook

**Ação:**
```bash
# Verificar logs do webhook
curl -X POST https://alloehealth.com.br/api/stripe/webhook \
  -H "Content-Type: application/json" \
  -d '{"test": true}'

# Se falhar, desativar webhook no Stripe
```

### 2. Portal de Cobrança Indisponível
**Sintomas:**
- Botão "Gerenciar Cobrança" não funciona
- Erro 404 ou 500 na API

**Ação:**
```bash
# Verificar API do portal
curl -X POST https://alloehealth.com.br/api/stripe/create-portal-session \
  -H "Content-Type: application/json" \
  -d '{"userId": "test"}'

# Se falhar, ocultar botão temporariamente
```

### 3. Erro na Criação de Assinaturas
**Sintomas:**
- Checkout não redireciona
- Erro 500 na API de checkout

**Ação:**
```bash
# Verificar API de checkout
curl -X POST https://alloehealth.com.br/api/stripe/create-checkout-session \
  -H "Content-Type: application/json" \
  -d '{"planType": "BASIC_MONTHLY", "userId": "test", "email": "test@test.com", "name": "Test"}'

# Se falhar, reverter para versão anterior
```

### 4. Problemas de Performance
**Sintomas:**
- Página de pricing lenta
- Timeout em APIs

**Ação:**
```bash
# Verificar performance
curl -w "@curl-format.txt" -o /dev/null -s https://alloehealth.com.br/pricing

# Se lento, verificar logs de erro
```

## 📊 Monitoramento Pós-Deploy

### Métricas Críticas (Primeiras 24h)
- **Taxa de erro**: < 2%
- **Tempo de resposta**: < 3s
- **Conversão**: > 5%
- **Webhooks**: 100% sucesso

### Alertas Configurados
```bash
# Alertas críticos
- Erro 500 > 5%
- Tempo resposta > 5s
- Webhook falha > 1%
- Conversão < 3%

# Alertas de performance
- Página pricing > 3s
- API checkout > 2s
- Portal billing > 2s
```

## 🔧 Scripts de Emergência

### Script de Rollback Automático
```bash
#!/bin/bash
# rollback-monetization.sh

echo "🚨 Iniciando rollback de monetização..."

# 1. Reverter código
git checkout main
git reset --hard HEAD~1
git push origin main --force

# 2. Restart serviços
pm2 restart alloehealth

# 3. Verificar saúde
curl -f https://alloehealth.com.br/api/health || exit 1

# 4. Notificar equipe
curl -X POST "https://hooks.slack.com/services/..." \
  -H "Content-Type: application/json" \
  -d '{"text": "🚨 Rollback de monetização executado automaticamente"}'

echo "✅ Rollback concluído"
```

### Script de Verificação
```bash
#!/bin/bash
# verify-monetization.sh

echo "🔍 Verificando sistema de monetização..."

# Verificar APIs
curl -f https://alloehealth.com.br/api/stripe/create-checkout-session || echo "❌ Checkout API falhou"
curl -f https://alloehealth.com.br/api/stripe/create-portal-session || echo "❌ Portal API falhou"
curl -f https://alloehealth.com.br/api/gift/create || echo "❌ Gift API falhou"

# Verificar páginas
curl -f https://alloehealth.com.br/pricing || echo "❌ Pricing page falhou"
curl -f https://alloehealth.com.br/dashboard || echo "❌ Dashboard falhou"
curl -f https://alloehealth.com.br/billing || echo "❌ Billing falhou"

# Verificar banco
psql $DATABASE_URL -c "SELECT COUNT(*) FROM \"Subscription\";" || echo "❌ Banco falhou"

echo "✅ Verificação concluída"
```

## 📞 Contatos de Emergência

### Equipe Técnica
- **DevOps**: [contato]
- **Backend**: [contato]
- **Frontend**: [contato]

### Stakeholders
- **Product**: [contato]
- **Business**: [contato]

### Provedores
- **Stripe Support**: https://support.stripe.com
- **Vercel Support**: https://vercel.com/support
- **Database**: [contato]

## 📋 Checklist de Rollback

### Antes do Deploy
- [ ] Backup do banco de dados
- [ ] Teste de rollback em staging
- [ ] Scripts de emergência prontos
- [ ] Equipe de plantão avisada

### Durante o Deploy
- [ ] Monitorar logs em tempo real
- [ ] Verificar métricas críticas
- [ ] Testar fluxo completo
- [ ] Validar webhooks

### Após o Deploy
- [ ] Monitorar por 24h
- [ ] Verificar conversões
- [ ] Validar pagamentos
- [ ] Confirmar com stakeholders

---

## 🎯 Objetivo do Rollback

**Garantir que o sistema volte ao estado funcional anterior em caso de problemas críticos, mantendo a funcionalidade básica de triagens e relatórios.**

**Tempo máximo de rollback: 15 minutos**
**Downtime aceitável: < 5 minutos**
