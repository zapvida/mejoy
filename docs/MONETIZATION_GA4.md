# 📊 GA4 MONETIZAÇÃO - CONFIGURAÇÃO COMPLETA

## 🎯 Eventos Implementados

### Eventos de Conversão
- **`subscribe_click`** - Clique em assinatura (MARCAR COMO CONVERSÃO)
- **`gift_created`** - Criação de presente
- **`gift_redeemed`** - Resgate de presente

### Eventos de Navegação
- **`plan_view`** - Visualização da página de planos
- **`billing_portal_click`** - Acesso ao portal de cobrança
- **`gift_click`** - Clique em presente

### Eventos de Relatório
- **`zapvida_click`** - Clique em ZapVida
- **`alloezil_click`** - Clique em AlloeZil

## 🔧 Custom Definitions (Escopo: Evento)

### 1. `plan` (Texto)
- **Valores**: `basic`, `plus`
- **Descrição**: Tipo de plano selecionado
- **Uso**: Segmentação por plano

### 2. `period` (Texto)
- **Valores**: `monthly`, `yearly`
- **Descrição**: Período de cobrança
- **Uso**: Análise de conversão por período

### 3. `method` (Texto)
- **Valores**: `card`, `pix` (futuro)
- **Descrição**: Método de pagamento
- **Uso**: Análise de preferência de pagamento

### 4. `cta_variant` (Texto)
- **Valores**: `report_cta`, `pricing_cta`, `dashboard_cta`
- **Descrição**: Variante do CTA clicado
- **Uso**: A/B testing de CTAs

### 5. `gift_token` (Texto)
- **Valores**: `gift_token_id`
- **Descrição**: ID do token de presente
- **Uso**: Tracking de presentes específicos

## 📈 Configuração no GA4

### 1. Marcar subscribe_click como Conversão
1. Acesse GA4 → Admin → Eventos
2. Encontre `subscribe_click`
3. Clique em "Marcar como conversão"
4. Defina valor: `{{plan}} == 'plus' ? 49 : 29`

### 2. Criar Custom Definitions
1. Acesse GA4 → Admin → Definições personalizadas
2. Crie cada definição conforme especificado acima
3. Escopo: Evento
4. Ative para relatórios

### 3. Configurar Exploração de Funil
1. Acesse GA4 → Explorar → Funil de conversão
2. Etapas:
   - `page_view` (página de pricing)
   - `subscribe_click` (conversão)
   - `checkout.session.completed` (via webhook)

### 4. Segmentos Recomendados
- **Assinantes Plus**: `plan == 'plus'`
- **Assinantes Anuais**: `period == 'yearly'`
- **Usuários de Presente**: `gift_token` não é nulo
- **Conversões por CTA**: `cta_variant` específico

## 🎯 Relatórios de Monetização

### 1. Funil de Conversão
```
Pricing View → Subscribe Click → Checkout Complete
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

## 🚨 Alertas Recomendados

### Alertas Críticos
- Conversão < 5% (subscribe_click / plan_view)
- Erro em webhooks > 5%
- Churn > 20% mensal

### Alertas de Performance
- Tempo de carregamento pricing > 3s
- Taxa de erro checkout > 2%
- Presentes não resgatados > 50%

## 🔧 Implementação Técnica

### Código de Tracking
```javascript
// Exemplo de implementação
trackEvent('subscribe_click', {
  plan: 'plus',
  period: 'monthly',
  method: 'card',
  cta_variant: 'pricing_cta'
});
```

### Validação
- Todos os eventos devem ter parâmetros obrigatórios
- Valores devem seguir enum definido
- Testar em ambiente de desenvolvimento primeiro

---

## ✅ Checklist de Implementação

- [ ] Marcar `subscribe_click` como conversão
- [ ] Criar 5 custom definitions
- [ ] Configurar funil de conversão
- [ ] Criar segmentos recomendados
- [ ] Implementar webhooks GA4
- [ ] Configurar alertas
- [ ] Testar em desenvolvimento
- [ ] Documentar para equipe

**🎯 Objetivo**: Tracking completo da jornada de monetização para otimização contínua e análise de ROI.
