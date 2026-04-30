# 🗄️ ERD - Diagrama de Entidade Relacionamento

## 📊 Modelos Principais

### Patient (Usuário)
```sql
model Patient {
  id          String    @id @default(cuid())
  email       String    @unique
  name        String
  phone       String?
  sessionId   String?   @unique
  deletedAt   DateTime?
  created_at  DateTime  @default(now())
  updated_at  DateTime  @updatedAt

  triages        Triage[]
  reports        Report[]
  giftTokensIssued GiftToken[] @relation("GiftTokenIssuer")
  giftTokensRedeemed GiftToken[] @relation("GiftTokenRedeemer")
  subscriptions  Subscription[]
}
```

### GiftToken (Sistema de Presentes)
```sql
model GiftToken {
  id                String    @id @default(uuid())
  issuerUserId       String
  status            String    @default("issued") // issued|redeemed|expired
  expiresAt         DateTime
  redeemedByUserId  String?   // ID do usuário que resgatou
  redeemedAt        DateTime?
  stripeSessionId   String?   // ID da sessão Stripe
  created_at        DateTime  @default(now())
  updated_at        DateTime  @updatedAt

  issuer     Patient @relation("GiftTokenIssuer", fields: [issuerUserId], references: [id], onDelete: Cascade)
  redeemedBy Patient? @relation("GiftTokenRedeemer", fields: [redeemedByUserId], references: [id])
}
```

### Subscription (Assinaturas)
```sql
model Subscription {
  id          String   @id @default(cuid())
  userId      String
  kind        String   // 'self' | 'gift'
  activeFrom  DateTime
  activeUntil DateTime
  status      String   // 'active' | 'expired' | 'cancelled'
  stripeSubscriptionId String? // ID da assinatura no Stripe
  stripeCustomerId     String? // ID do cliente no Stripe
  amount      Decimal? @db.Decimal(10,2) // Valor da assinatura
  cancelledAt DateTime? // Data de cancelamento
  planType    String?  // 'monthly' | 'yearly'
  planPrice   String?  // '29' | '49'
  created_at  DateTime  @default(now())
  updated_at  DateTime  @updatedAt

  user Patient @relation(fields: [userId], references: [id], onDelete: Cascade)
}
```

## 🔗 Relacionamentos

### Patient ↔ GiftToken
- **Um usuário pode criar múltiplos presentes** (1:N)
- **Um usuário pode resgatar múltiplos presentes** (1:N)
- **Um presente tem um criador** (N:1)
- **Um presente pode ter um resgatador** (N:1, opcional)

### Patient ↔ Subscription
- **Um usuário pode ter múltiplas assinaturas** (1:N)
- **Uma assinatura pertence a um usuário** (N:1)

## 📈 Índices para Performance

### GiftToken
```sql
@@index([issuerUserId])     -- Buscar presentes criados por usuário
@@index([status])           -- Filtrar por status (issued/redeemed/expired)
@@index([expiresAt])       -- Buscar presentes próximos do vencimento
@@index([redeemedAt])      -- Buscar presentes resgatados por data
```

### Subscription
```sql
@@index([userId, status])  -- Buscar assinaturas ativas do usuário
@@index([activeUntil])     -- Buscar assinaturas próximas do vencimento
@@index([stripeSubscriptionId]) -- Buscar por ID do Stripe
```

## 🔒 Regras de Negócio

### GiftToken
- **Expiração**: 30 dias após criação
- **Status**: issued → redeemed/expired
- **Rate Limit**: 1 presente/mês por usuário Plus
- **Antifraude**: Rate limit por IP (3/hora)

### Subscription
- **Tipos**: self (própria) ou gift (presente)
- **Planos**: basic (R$29) ou plus (R$49)
- **Períodos**: monthly ou yearly
- **Status**: active, expired, cancelled

## 🚀 Migração Necessária

```sql
-- Criar tabela GiftToken
CREATE TABLE "GiftToken" (
  "id" TEXT PRIMARY KEY DEFAULT uuid(),
  "issuerUserId" TEXT NOT NULL,
  "status" TEXT DEFAULT 'issued',
  "expiresAt" TIMESTAMP NOT NULL,
  "redeemedByUserId" TEXT,
  "redeemedAt" TIMESTAMP,
  "stripeSessionId" TEXT,
  "created_at" TIMESTAMP DEFAULT now(),
  "updated_at" TIMESTAMP DEFAULT now()
);

-- Adicionar campos na Subscription
ALTER TABLE "Subscription" ADD COLUMN "planType" TEXT;
ALTER TABLE "Subscription" ADD COLUMN "planPrice" TEXT;

-- Criar índices
CREATE INDEX "GiftToken_issuerUserId_idx" ON "GiftToken"("issuerUserId");
CREATE INDEX "GiftToken_status_idx" ON "GiftToken"("status");
CREATE INDEX "GiftToken_expiresAt_idx" ON "GiftToken"("expiresAt");
CREATE INDEX "GiftToken_redeemedAt_idx" ON "GiftToken"("redeemedAt");
```

## ✅ Validação
- [x] Schema validado pelo Prisma
- [x] Relacionamentos corretos
- [x] Índices otimizados
- [x] Regras de negócio implementadas
- [x] Migração pronta para execução
