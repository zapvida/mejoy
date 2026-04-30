# 🗄️ ERD - Admin Dashboard

## 📊 Diagrama de Entidade Relacionamento

### Modelos Principais

#### AdminAuditLog
```sql
model AdminAuditLog {
  id           String   @id @default(cuid())
  at           DateTime @default(now())
  actorUserId  String
  ipHash       String?
  action       String   // e.g., "VIEW_PII", "EXPORT_CSV"
  target       String?  // e.g., "user:123", "report:abc"
  metadata     Json?

  @@index([actorUserId])
  @@index([at])
  @@index([action])
}
```

#### AdminAlertRule
```sql
model AdminAlertRule {
  id          String   @id @default(cuid())
  name        String
  key         String   // e.g., "conversion_drop", "error_rate_spike"
  threshold   Float
  windowMin   Int      // ex: 60
  channel     String   // "console" | "email" | "slack" | "whatsapp"
  enabled     Boolean  @default(true)
  createdAt   DateTime @default(now())

  alerts      AdminAlert[]

  @@index([key])
  @@index([enabled])
}
```

#### AdminAlert
```sql
model AdminAlert {
  id         String   @id @default(cuid())
  ruleId     String
  at         DateTime @default(now())
  severity   String   // "P0" | "P1"
  message    String
  status     String   // "open" | "acked" | "closed"
  metadata   Json?

  rule       AdminAlertRule @relation(fields: [ruleId], references: [id], onDelete: Cascade)

  @@index([ruleId])
  @@index([status])
  @@index([at])
}
```

#### KpiSnapshot
```sql
model KpiSnapshot {
  id         String   @id @default(cuid())
  day        DateTime
  mrr        Float
  activeSubs Int
  churn30d   Float
  arpu       Float
  ltv        Float

  @@unique([day])
  @@index([day])
}
```

## 🔗 Relacionamentos

### AdminAlertRule → AdminAlert
- **Tipo**: One-to-Many
- **Descrição**: Uma regra pode gerar múltiplos alertas
- **Cascade**: Delete em cascata

### Relacionamentos com Modelos Existentes
- **AdminAuditLog.actorUserId** → **Patient.id** (referência)
- **AdminAlert.metadata** → Dados contextuais dos modelos existentes

## 📈 Índices Otimizados

### AdminAuditLog
- `actorUserId` - Busca por usuário
- `at` - Busca temporal
- `action` - Busca por tipo de ação

### AdminAlertRule
- `key` - Busca por chave da regra
- `enabled` - Filtro de regras ativas

### AdminAlert
- `ruleId` - Busca por regra
- `status` - Filtro por status
- `at` - Ordenação temporal

### KpiSnapshot
- `day` - Busca temporal única

## 🎯 Propósito dos Modelos

### AdminAuditLog
- **Auditoria completa** de ações administrativas
- **Compliance** com LGPD e regulamentações
- **Debugging** de problemas de acesso
- **Análise** de padrões de uso

### AdminAlertRule
- **Configuração flexível** de regras de alerta
- **Thresholds personalizáveis** por métrica
- **Canais de notificação** configuráveis
- **Ativação/desativação** dinâmica

### AdminAlert
- **Histórico completo** de alertas
- **Status tracking** (aberto/reconhecido/fechado)
- **Metadados contextuais** para debugging
- **Severidade** para priorização

### KpiSnapshot
- **Histórico temporal** de KPIs
- **Análise de tendências** ao longo do tempo
- **Comparações** período vs período
- **Projeções** baseadas em dados históricos
