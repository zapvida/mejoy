# 📊 GA4 CONVERSÕES - CONFIGURAÇÃO FINAL

## 🎯 Marcar subscribe_click como Conversão

### Passo 1: Acessar GA4
1. Ir para [Google Analytics](https://analytics.google.com)
2. Selecionar propriedade do Alloe Health
3. Ir para **Admin** → **Eventos**

### Passo 2: Encontrar subscribe_click
1. Procurar por `subscribe_click` na lista
2. Clicar no evento
3. Clicar em **"Marcar como conversão"**

### Passo 3: Configurar Valor
```javascript
// Valor da conversão baseado no plano
{{plan}} == 'plus' ? 49 : 29
```

## 🔧 Custom Definitions (5 definições)

### 1. plan (Texto)
- **Nome**: plan
- **Escopo**: Evento
- **Descrição**: Tipo de plano selecionado
- **Valores**: basic, plus

### 2. period (Texto)
- **Nome**: period
- **Escopo**: Evento
- **Descrição**: Período de cobrança
- **Valores**: monthly, yearly

### 3. method (Texto)
- **Nome**: method
- **Escopo**: Evento
- **Descrição**: Método de pagamento
- **Valores**: card, pix

### 4. cta_variant (Texto)
- **Nome**: cta_variant
- **Escopo**: Evento
- **Descrição**: Variante do CTA clicado
- **Valores**: report_cta, pricing_cta, dashboard_cta

### 5. gift_token (Texto)
- **Nome**: gift_token
- **Escopo**: Evento
- **Descrição**: ID do token de presente
- **Valores**: gift_token_id

## 📈 Exploração de Funil

### Configuração do Funil
1. Ir para **Explorar** → **Funil de conversão**
2. Configurar etapas:

#### Etapa 1: Visualização da Página
- **Evento**: page_view
- **Condição**: page_location contém "/pricing"

#### Etapa 2: Clique em Assinatura
- **Evento**: subscribe_click
- **Condição**: plan = basic ou plus

#### Etapa 3: Checkout Completo
- **Evento**: checkout.session.completed
- **Condição**: via webhook Stripe

#### Etapa 4: Assinatura Ativa
- **Evento**: customer.subscription.created
- **Condição**: via webhook Stripe

## 🎯 Segmentos Recomendados

### 1. Assinantes Plus
- **Condição**: plan = "plus"
- **Uso**: Análise de usuários premium

### 2. Assinantes Anuais
- **Condição**: period = "yearly"
- **Uso**: Análise de retenção

### 3. Usuários de Presente
- **Condição**: gift_token não é nulo
- **Uso**: Análise de viralização

### 4. Conversões por CTA
- **Condição**: cta_variant específico
- **Uso**: A/B testing de CTAs

## 📊 Relatórios de Monetização

### 1. Funil de Conversão
```
Pricing View → Subscribe Click → Checkout → Subscription Active
```

### 2. Análise por Plano
- Conversão básico vs plus
- Receita por plano
- Churn por plano

### 3. Análise de Presentes
- Taxa de criação de presentes
- Taxa de resgate
- Valor médio de presentes

### 4. Análise de CTAs
- Performance por variante
- Conversão por fonte
- Otimização de copy

## 🚨 Alertas Configurados

### Críticos
- Conversão < 5% (subscribe_click / plan_view)
- Erro em webhooks > 5%
- Churn > 20% mensal

### Importantes
- Tempo de carregamento pricing > 3s
- Taxa de erro checkout > 2%
- Presentes não resgatados > 50%

## 🔄 Webhooks para GA4

### Eventos Enviados via Webhook
```javascript
// No webhook do Stripe
gtag('event', 'purchase', {
  transaction_id: subscription.id,
  value: subscription.amount / 100,
  currency: 'BRL',
  plan: metadata.plan,
  period: metadata.period,
  method: metadata.method
});
```

## 📊 Métricas de Sucesso

### KPIs Principais
- **Taxa de conversão**: subscribe_click / plan_view
- **Receita mensal**: Soma de todas as conversões
- **ARPU**: Receita média por usuário
- **Churn rate**: Cancelamentos / Total assinantes

### Métricas Secundárias
- **Taxa de presente**: gift_created / total_users
- **Taxa de resgate**: gift_redeemed / gift_created
- **Performance CTA**: Conversão por variante

## ✅ Checklist de Configuração

- [ ] subscribe_click marcado como conversão
- [ ] Valor da conversão configurado
- [ ] 5 custom definitions criadas
- [ ] Funil de conversão configurado
- [ ] Segmentos criados
- [ ] Relatórios configurados
- [ ] Alertas configurados
- [ ] Webhooks GA4 funcionando
- [ ] Métricas de sucesso definidas
- [ ] Testes de eventos realizados

## 🎯 Status da Configuração

**Conversão**: ⏳ Aguardando configuração
**Custom Definitions**: ⏳ Aguardando criação
**Funil**: ⏳ Aguardando configuração
**Segmentos**: ⏳ Aguardando criação
**Relatórios**: ⏳ Aguardando configuração
**Alertas**: ⏳ Aguardando configuração
