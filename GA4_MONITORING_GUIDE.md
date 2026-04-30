# GA4 & Monitoramento - Alloe Health

## 📊 **Configuração GA4**

### Eventos Canônicos Implementados
- ✅ `report_view` - Visualização do relatório
- ✅ `cta_click` - Clique em CTA principal
- ✅ `report_print` - Impressão/PDF do relatório
- ✅ `chat_interaction` - Interações com chat médico

### Parâmetros Padronizados
```javascript
// report_view
{
  report_id: string,
  triage_type: string,
  patient_age: number,
  cta_variant: string
}

// cta_click
{
  cta_id: string,
  triage_type: string,
  cta_variant: string,
  report_id: string
}

// report_print
{
  report_id: string,
  triage_type: string,
  page_title: string,
  page_location: string
}

// chat_interaction
{
  interaction_type: string,
  triage_type: string,
  report_id: string,
  page_title: string,
  page_location: string
}
```

## 🎯 **Funil Principal**

### Etapas do Funil
1. **report_view** → Visualização do relatório
2. **cta_click** → Clique em CTA (intenção alta)
3. **checkout** → Redirecionamento para checkout
4. **purchase** → Conversão final

### Segmentação
- **triage_type**: gastro, sono, metabolico, other
- **cta_id**: cta_medical_immediate, cta_unlock_premium, cta_follow_up, cta_whatsapp
- **cta_variant**: consulta, premium, whatsapp, auto

## 🔄 **A/B Testing de CTA**

### Implementação
- **Query Param**: `?cta=consulta|premium|whatsapp`
- **Fallback**: `auto` (lógica padrão)
- **Tracking**: `cta_variant` em todos os eventos

### Estratégia
1. **Semana 1**: 33/33/33 (consulta/premium/whatsapp)
2. **Semana 2**: Congelar vencedor por triage_type
3. **Monitoramento**: Taxa de conversão cta_click/report_view

## 🚨 **Alertas Automáticos**

### Alertas Críticos
1. **Queda no Funil**
   - Condição: `cta_click/report_view` < 20% vs 7 dias anteriores
   - Segmento: `/relatorio`
   - Ação: E-mail imediato

2. **Ausência de Impressão**
   - Condição: `report_print = 0` por 2h (08-22 BRT)
   - Ação: E-mail operacional

3. **Anomalia de Tráfego**
   - Condição: `report_view` com detecção de anomalia
   - Ação: E-mail de monitoramento

## 📈 **Relatórios Essenciais**

### 1. Funil Principal
- **Exploration**: Funnel exploration
- **Steps**: report_view → cta_click → checkout → purchase
- **Breakdowns**: triage_type, cta_id, cta_variant
- **Filtro**: Page path contains `/relatorio`

### 2. A/B CTA Performance
- **Tabela**: Linhas por cta_variant, colunas por cta_id
- **Métricas**: Event count, Taxa cta_click/report_view
- **Período**: Últimos 7 dias

### 3. Print & PDF Usage
- **Série Temporal**: report_print por dia
- **Breakdown**: triage_type
- **Objetivo**: Correlação com conversão

### 4. Chat Engagement
- **Tabela**: interaction_type × triage_type
- **Métricas**: Event count
- **Objetivo**: Suporte à conversão

## 🔧 **Custom Definitions**

### Dimensões Personalizadas
1. **triage_type** (Event scope)
2. **report_id** (Event scope)
3. **cta_id** (Event scope)
4. **cta_variant** (Event scope)
5. **interaction_type** (Event scope)

### Conversões
- ✅ `cta_click` marcado como conversão
- 🔄 `purchase` (quando checkout estiver 100% padronizado)

## 📊 **Looker Studio Dashboard**

### Página 1 - KPI Board
- **Scorecards**: report_view, cta_click, Taxa cta_click/report_view, report_print
- **Filtros**: Date, triage_type, cta_variant
- **Atualização**: Diária às 08:00 BRT

### Página 2 - Funil
- **Gráfico**: Funil report_view → cta_click → checkout → purchase
- **Breakdown**: triage_type, cta_variant
- **Período**: Últimos 30 dias

### Página 3 - A/B CTA
- **Tabela**: cta_variant × cta_id
- **Métricas**: Event count, Taxa de conversão
- **Decisão**: Congelar vencedor em 7 dias

## 🔍 **BigQuery (Opcional)**

### Dataset
- **Nome**: `ga4_alloe`
- **Export**: Daily (streaming se possível)
- **Retenção**: 14 meses

### Query Base
```sql
-- Funil diário por triage_type e cta_variant
SELECT
  DATE(event_date) AS dt,
  triage_type,
  cta_variant,
  COUNTIF(event_name = 'report_view') AS views,
  COUNTIF(event_name = 'cta_click') AS ctas,
  SAFE_DIVIDE(COUNTIF(event_name='cta_click'), COUNTIF(event_name='report_view')) AS cr_cta
FROM `project.ga4_alloe.events_*`,
UNNEST(event_params) ep
WHERE event_name IN ('report_view','cta_click')
  AND (_TABLE_SUFFIX BETWEEN FORMAT_DATE('%Y%m%d', DATE_SUB(CURRENT_DATE(), INTERVAL 30 DAY))
                         AND FORMAT_DATE('%Y%m%d', CURRENT_DATE()))
GROUP BY dt, triage_type, cta_variant
ORDER BY dt DESC;
```

## 🛡️ **Sentry Monitoramento**

### Alertas Configurados
1. **Exceções em `/relatorio/[id]`**
   - Threshold: > 5 exceções/hora
   - Ação: Slack + E-mail

2. **TTF > 2s**
   - Threshold: > 20% das requisições
   - Ação: E-mail operacional

3. **Erro 5xx**
   - Threshold: > 1% das requisições
   - Ação: E-mail crítico

## 📋 **Checklist de Validação**

### ✅ Eventos GA4
- [ ] report_view com report_id, triage_type, cta_variant
- [ ] cta_click com cta_id, triage_type, cta_variant
- [ ] report_print com report_id, triage_type
- [ ] chat_interaction com interaction_type, triage_type

### ✅ Configurações
- [ ] Custom definitions criadas e ativas
- [ ] Conversões marcadas (cta_click)
- [ ] Exploration Funnel criado e salvo
- [ ] Collection de Reports publicada
- [ ] Insights/Alerts ativos com e-mail
- [ ] Looker publicado e agendamento OK

## 🔄 **Rollback Plan**

### Se Algo Destoar
1. **Desmarcar** cta_click como conversão
2. **Pausar** alertas/insights até estabilizar
3. **Desligar** ?cta= (fallback cta_variant=auto)
4. **Manter** nomes dos eventos (não renomear)

## 💡 **Boas Práticas**

### Governança
- **Congelar nomes** de eventos/dimensões por 60 dias
- **1 pessoa** responsável por Custom Definitions
- **Evitar amostragem**: Ligar BigQuery cedo
- **Simplicidade**: Centralizar métricas calculadas no Looker/BQ

### Monitoramento
- **Funil diário**: Olhar todos os dias
- **A/B decisão**: Congelar vencedor em 7 dias
- **Alertas**: Responder em < 2h
- **Rollback**: Testar mensalmente
