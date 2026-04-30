# 📊 RUNBOOK DE MONITORAMENTO - 72H PÓS-GO

## 🎯 Monitoramento Crítico (Primeiras 72h)

### Stripe Dashboard
**Métricas a Acompanhar**:
- ✅ **Falhas de fatura**: < 5%
- ✅ **Assinaturas novas**: > 5/dia
- ✅ **Assinaturas ativas**: Crescimento constante
- ✅ **Cancelamentos**: < 20% mensal
- ✅ **Receita**: > R$ 100/dia

**Alertas Configurados**:
- Falha de pagamento > 5%
- Cancelamento > 20%
- Receita < R$ 50/dia

### GA4 Funil de Conversão
**Funil**: `pricing_view → subscribe_click → checkout → subscription_active`

**Métricas Esperadas**:
- **Pricing View**: 100+ visitas/dia
- **Subscribe Click**: 8+ cliques/dia (8% conversão)
- **Checkout**: 5+ sessões/dia (5% conversão)
- **Subscription Active**: 3+ assinaturas/dia (3% conversão)

**Alertas Configurados**:
- Conversão < 5%
- Funil quebrado em qualquer etapa
- Tráfego < 50 visitas/dia

### Sentry/Logs
**APIs Monitoradas**:
- `/api/stripe/webhook` - Erros 4xx/5xx
- `/api/gift/create` - Falhas de criação
- `/api/gift/redeem` - Falhas de resgate
- `/api/stripe/create-checkout-session` - Erros de checkout

**Alertas Configurados**:
- Erro 500 > 1%
- Erro 4xx > 5%
- Tempo resposta > 5s
- Webhook falha > 1%

## 📈 Metas da Primeira Semana

### Conversão
- **CR pricing→checkout**: ≥ 8%
- **CR checkout→subscription**: ≥ 5%
- **CR total**: ≥ 3%

### Mix de Planos
- **Plus/Básico**: ≥ 40/60
- **Anual/Mensal**: ≥ 20/80
- **ARPU**: ≥ R$ 35

### Sistema de Presentes
- **Gift resgatado/gerado**: ≥ 60%
- **Presentes criados**: ≥ 5/semana
- **Taxa de resgate**: ≥ 70%

## 🚨 Alertas por Prioridade

### P0 - Críticos (Ação Imediata)
- Erro 500 > 5%
- Webhook falha > 1%
- Conversão < 3%
- Receita < R$ 50/dia

### P1 - Importantes (Ação em 1h)
- Erro 4xx > 5%
- Tempo resposta > 5s
- Churn > 20%
- Suporte > 10 tickets/dia

### P2 - Informativos (Ação em 24h)
- Performance < 90
- Taxa de presente < 5%
- ARPU < R$ 30
- Satisfação < 4.5/5

## 📊 Dashboard de Monitoramento

### Métricas em Tempo Real
- **Conversão atual**: X%
- **Receita hoje**: R$ X
- **Assinaturas ativas**: X
- **Erros últimos 24h**: X

### Gráficos de Tendência
- **Conversão por dia**: Linha crescente
- **Receita por dia**: Linha crescente
- **Churn por semana**: Linha decrescente
- **ARPU por mês**: Linha crescente

### Alertas Ativos
- ✅ Webhook funcionando
- ✅ Conversão dentro da meta
- ✅ Receita crescendo
- ✅ Erros controlados

## 🔧 Ações de Mitigação

### Se Conversão < 5%
1. Verificar CTAs nos relatórios
2. Analisar copy da página pricing
3. Testar diferentes variantes
4. Otimizar experiência de checkout

### Se Churn > 20%
1. Verificar portal de cobrança
2. Analisar motivos de cancelamento
3. Implementar e-mails de retenção
4. Oferecer desconto para retenção

### Se Erros > 5%
1. Verificar logs de erro
2. Analisar stack trace
3. Implementar hotfix
4. Notificar equipe técnica

### Se Receita < Meta
1. Analisar funil de conversão
2. Verificar preços competitivos
3. Implementar promoções
4. Otimizar copy de vendas

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

## 📋 Checklist Diário

### Manhã (9h)
- [ ] Verificar métricas da noite
- [ ] Analisar alertas críticos
- [ ] Verificar conversões
- [ ] Confirmar receita

### Tarde (14h)
- [ ] Verificar métricas do dia
- [ ] Analisar tendências
- [ ] Verificar erros
- [ ] Confirmar performance

### Noite (18h)
- [ ] Verificar métricas do dia
- [ ] Analisar conversões
- [ ] Verificar receita
- [ ] Preparar relatório

## 🎯 Relatório Semanal

### Métricas de Sucesso
- **Conversão**: X% (meta: ≥ 8%)
- **Receita**: R$ X (meta: ≥ R$ 500)
- **ARPU**: R$ X (meta: ≥ R$ 35)
- **Churn**: X% (meta: ≤ 20%)

### Insights e Ações
- **O que funcionou**: [insights]
- **O que não funcionou**: [problemas]
- **Próximas ações**: [melhorias]
- **Riscos identificados**: [alertas]

## ✅ Status do Monitoramento

**Dashboard**: ⏳ Aguardando configuração
**Alertas**: ⏳ Aguardando configuração
**Métricas**: ⏳ Aguardando coleta
**Relatórios**: ⏳ Aguardando geração
