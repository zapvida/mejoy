# 📊 Queries Otimizadas - Admin Dashboard

## 🔍 Agregações Principais

### KPIs Principais
```sql
-- MRR (Monthly Recurring Revenue)
SELECT 
  SUM(amount) as mrr
FROM subscriptions 
WHERE status = 'active' 
  AND created_at >= date_trunc('month', CURRENT_DATE);

-- ARPU (Average Revenue Per User)
SELECT 
  SUM(amount) / COUNT(DISTINCT userId) as arpu
FROM subscriptions 
WHERE status = 'active' 
  AND created_at >= date_trunc('month', CURRENT_DATE);

-- LTV (Lifetime Value)
WITH churn_rate AS (
  SELECT 
    COUNT(CASE WHEN status = 'cancelled' THEN 1 END) / 
    COUNT(CASE WHEN status = 'active' THEN 1 END) as rate
  FROM subscriptions 
  WHERE created_at >= CURRENT_DATE - INTERVAL '30 days'
)
SELECT 
  arpu / churn_rate.rate as ltv
FROM churn_rate;

-- Churn Rate (30 dias)
SELECT 
  COUNT(CASE WHEN status = 'cancelled' THEN 1 END) * 100.0 / 
  COUNT(CASE WHEN status = 'active' THEN 1 END) as churn_rate
FROM subscriptions 
WHERE created_at >= CURRENT_DATE - INTERVAL '30 days';
```

### Funil de Conversão
```sql
-- Funil completo com taxas
WITH funnel_data AS (
  SELECT 
    COUNT(DISTINCT CASE WHEN created_at >= CURRENT_DATE - INTERVAL '30 days' THEN id END) as triage_starts,
    COUNT(DISTINCT CASE WHEN status = 'submitted' AND created_at >= CURRENT_DATE - INTERVAL '30 days' THEN id END) as triage_completions,
    COUNT(DISTINCT CASE WHEN created_at >= CURRENT_DATE - INTERVAL '30 days' THEN id END) as report_views,
    COUNT(DISTINCT CASE WHEN status = 'active' AND created_at >= CURRENT_DATE - INTERVAL '30 days' THEN id END) as subscriptions
  FROM triages t
  LEFT JOIN reports r ON t.id = r.triageId
  LEFT JOIN subscriptions s ON t.patientId = s.userId
)
SELECT 
  triage_starts,
  triage_completions,
  report_views,
  subscriptions,
  (triage_completions * 100.0 / triage_starts) as triage_to_completion,
  (report_views * 100.0 / triage_completions) as completion_to_report,
  (subscriptions * 100.0 / report_views) as report_to_subscription
FROM funnel_data;
```

### Receita por Plano
```sql
-- Receita detalhada por plano
SELECT 
  planType,
  planPrice,
  COUNT(*) as subscriptions,
  SUM(amount) as revenue,
  AVG(amount) as avg_amount
FROM subscriptions 
WHERE status = 'active' 
  AND created_at >= date_trunc('month', CURRENT_DATE)
GROUP BY planType, planPrice
ORDER BY revenue DESC;
```

### Métricas de Produto
```sql
-- Triagens por tipo com completion rate
SELECT 
  type,
  COUNT(*) as total_triages,
  COUNT(CASE WHEN status = 'submitted' THEN 1 END) as completed_triages,
  (COUNT(CASE WHEN status = 'submitted' THEN 1 END) * 100.0 / COUNT(*)) as completion_rate,
  AVG(CASE WHEN r.score IS NOT NULL THEN r.score END) as avg_score
FROM triages t
LEFT JOIN reports r ON t.id = r.triageId
WHERE t.created_at >= CURRENT_DATE - INTERVAL '30 days'
GROUP BY type
ORDER BY total_triages DESC;

-- Cohorts de retenção
SELECT 
  'D7' as cohort,
  COUNT(DISTINCT p.id) as users
FROM patients p
WHERE p.created_at >= CURRENT_DATE - INTERVAL '7 days'
  AND EXISTS (
    SELECT 1 FROM triages t 
    WHERE t.patientId = p.id 
      AND t.created_at >= CURRENT_DATE - INTERVAL '7 days'
  )

UNION ALL

SELECT 
  'D30' as cohort,
  COUNT(DISTINCT p.id) as users
FROM patients p
WHERE p.created_at >= CURRENT_DATE - INTERVAL '30 days'
  AND EXISTS (
    SELECT 1 FROM triages t 
    WHERE t.patientId = p.id 
      AND t.created_at >= CURRENT_DATE - INTERVAL '30 days'
  );
```

## 🚀 Queries de Performance

### Índices Recomendados
```sql
-- Índices para queries de admin
CREATE INDEX CONCURRENTLY idx_subscriptions_status_created 
ON subscriptions(status, created_at);

CREATE INDEX CONCURRENTLY idx_triages_status_created 
ON triages(status, created_at);

CREATE INDEX CONCURRENTLY idx_reports_created 
ON reports(created_at);

CREATE INDEX CONCURRENTLY idx_patients_created 
ON patients(created_at);

-- Índices compostos para agregações
CREATE INDEX CONCURRENTLY idx_subscriptions_plan_status_created 
ON subscriptions(planType, planPrice, status, created_at);

CREATE INDEX CONCURRENTLY idx_triages_type_status_created 
ON triages(type, status, created_at);
```

### Queries com Cache
```sql
-- Materialized view para KPIs (atualizar a cada hora)
CREATE MATERIALIZED VIEW mv_daily_kpis AS
SELECT 
  CURRENT_DATE as day,
  COUNT(DISTINCT p.id) as total_users,
  COUNT(DISTINCT CASE WHEN s.status = 'active' THEN s.id END) as active_subscriptions,
  SUM(CASE WHEN s.status = 'active' THEN s.amount ELSE 0 END) as mrr,
  COUNT(DISTINCT t.id) as total_triages,
  COUNT(DISTINCT CASE WHEN t.status = 'submitted' THEN t.id END) as completed_triages
FROM patients p
LEFT JOIN subscriptions s ON p.id = s.userId
LEFT JOIN triages t ON p.id = t.patientId
WHERE p.created_at >= CURRENT_DATE - INTERVAL '30 days'
GROUP BY CURRENT_DATE;

-- Refresh da materialized view
REFRESH MATERIALIZED VIEW mv_daily_kpis;
```

## 📈 Análise de Tendências

### Comparação Período vs Período
```sql
-- Comparação mês atual vs anterior
WITH current_month AS (
  SELECT 
    SUM(amount) as revenue,
    COUNT(*) as subscriptions
  FROM subscriptions 
  WHERE status = 'active' 
    AND created_at >= date_trunc('month', CURRENT_DATE)
),
previous_month AS (
  SELECT 
    SUM(amount) as revenue,
    COUNT(*) as subscriptions
  FROM subscriptions 
  WHERE status = 'active' 
    AND created_at >= date_trunc('month', CURRENT_DATE) - INTERVAL '1 month'
    AND created_at < date_trunc('month', CURRENT_DATE)
)
SELECT 
  c.revenue as current_revenue,
  p.revenue as previous_revenue,
  ((c.revenue - p.revenue) * 100.0 / p.revenue) as revenue_growth,
  c.subscriptions as current_subscriptions,
  p.subscriptions as previous_subscriptions,
  ((c.subscriptions - p.subscriptions) * 100.0 / p.subscriptions) as subscription_growth
FROM current_month c, previous_month p;
```

### Análise de Cohort
```sql
-- Cohort analysis por semana
WITH user_cohorts AS (
  SELECT 
    p.id as user_id,
    date_trunc('week', p.created_at) as cohort_week,
    date_trunc('week', t.created_at) as activity_week
  FROM patients p
  LEFT JOIN triages t ON p.id = t.patientId
  WHERE p.created_at >= CURRENT_DATE - INTERVAL '12 weeks'
),
cohort_sizes AS (
  SELECT 
    cohort_week,
    COUNT(DISTINCT user_id) as cohort_size
  FROM user_cohorts
  GROUP BY cohort_week
),
cohort_activity AS (
  SELECT 
    cohort_week,
    activity_week,
    COUNT(DISTINCT user_id) as active_users
  FROM user_cohorts
  WHERE activity_week IS NOT NULL
  GROUP BY cohort_week, activity_week
)
SELECT 
  ca.cohort_week,
  ca.activity_week,
  cs.cohort_size,
  ca.active_users,
  (ca.active_users * 100.0 / cs.cohort_size) as retention_rate
FROM cohort_activity ca
JOIN cohort_sizes cs ON ca.cohort_week = cs.cohort_week
ORDER BY ca.cohort_week, ca.activity_week;
```

## 🔍 Queries de Debugging

### Análise de Erros
```sql
-- Taxa de erro por endpoint (simulado)
SELECT 
  'api_error_rate' as metric,
  COUNT(CASE WHEN status_code >= 400 THEN 1 END) * 100.0 / COUNT(*) as error_rate
FROM api_logs 
WHERE created_at >= CURRENT_DATE - INTERVAL '1 hour';

-- Alertas ativos
SELECT 
  a.id,
  a.severity,
  a.message,
  a.at,
  ar.name as rule_name
FROM admin_alerts a
JOIN admin_alert_rules ar ON a.ruleId = ar.id
WHERE a.status = 'open'
ORDER BY a.severity DESC, a.at DESC;
```

### Monitoramento de Performance
```sql
-- Tempo de resposta médio por endpoint
SELECT 
  endpoint,
  AVG(response_time) as avg_response_time,
  PERCENTILE_CONT(0.95) WITHIN GROUP (ORDER BY response_time) as p95_response_time,
  COUNT(*) as requests
FROM api_logs 
WHERE created_at >= CURRENT_DATE - INTERVAL '1 hour'
GROUP BY endpoint
ORDER BY avg_response_time DESC;
```

## 📊 Queries de Exportação

### Dados Completos para CSV
```sql
-- Export completo de métricas
SELECT 
  'KPI' as category,
  'mrr' as metric,
  SUM(amount) as value,
  '30d' as period
FROM subscriptions 
WHERE status = 'active' 
  AND created_at >= CURRENT_DATE - INTERVAL '30 days'

UNION ALL

SELECT 
  'KPI' as category,
  'active_subscriptions' as metric,
  COUNT(*) as value,
  '30d' as period
FROM subscriptions 
WHERE status = 'active' 
  AND created_at >= CURRENT_DATE - INTERVAL '30 days'

UNION ALL

SELECT 
  'FUNNEL' as category,
  'triage_starts' as metric,
  COUNT(*) as value,
  '30d' as period
FROM triages 
WHERE created_at >= CURRENT_DATE - INTERVAL '30 days'

ORDER BY category, metric;
```

## 🎯 Otimizações Implementadas

### Cache Strategy
- **Cache em memória**: 30-60 segundos por tipo de dados
- **Invalidação inteligente**: Baseada em mudanças de dados
- **Chaves compostas**: Incluem parâmetros de filtro

### Query Optimization
- **Índices compostos**: Para queries frequentes
- **Materialized views**: Para agregações pesadas
- **Batch processing**: Para múltiplas métricas
- **Connection pooling**: Para alta concorrência

### Performance Targets
- **TTFB**: < 400ms para endpoints admin
- **Query time**: < 200ms para agregações
- **Cache hit rate**: > 80%
- **Concurrent users**: Suporte a 100+ admins simultâneos
