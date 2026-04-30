# 🗄️ MIGRAÇÃO DB PRODUÇÃO - SCRIPT DE EXECUÇÃO

## 📋 Comando de Migração

```bash
# Executar migração em produção
pnpm prisma migrate deploy

# Verificar se a tabela foi criada
pnpm prisma db execute --stdin <<< "SELECT table_name FROM information_schema.tables WHERE table_name = 'GiftToken';"

# Verificar estrutura da tabela
pnpm prisma db execute --stdin <<< "\\d \"GiftToken\""
```

## 🔍 Validação da Tabela GiftToken

### Estrutura Esperada
```sql
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
```

### Índices Esperados
```sql
CREATE INDEX "GiftToken_issuerUserId_idx" ON "GiftToken"("issuerUserId");
CREATE INDEX "GiftToken_status_idx" ON "GiftToken"("status");
CREATE INDEX "GiftToken_expiresAt_idx" ON "GiftToken"("expiresAt");
CREATE INDEX "GiftToken_redeemedAt_idx" ON "GiftToken"("redeemedAt");
```

### Relacionamentos Esperados
```sql
-- Foreign Key para issuer
ALTER TABLE "GiftToken" ADD CONSTRAINT "GiftToken_issuerUserId_fkey" 
  FOREIGN KEY ("issuerUserId") REFERENCES "Patient"("id") ON DELETE CASCADE;

-- Foreign Key para redeemedBy
ALTER TABLE "GiftToken" ADD CONSTRAINT "GiftToken_redeemedByUserId_fkey" 
  FOREIGN KEY ("redeemedByUserId") REFERENCES "Patient"("id");
```

## ✅ Checklist de Validação

- [ ] Migração executada sem erros
- [ ] Tabela GiftToken criada
- [ ] Todos os índices criados
- [ ] Relacionamentos configurados
- [ ] Campos com tipos corretos
- [ ] Constraints aplicadas

## 🚨 Troubleshooting

### Se a migração falhar:
1. Verificar conexão com banco
2. Verificar permissões de usuário
3. Verificar se não há conflitos
4. Executar rollback se necessário

### Se a tabela não aparecer:
1. Verificar schema correto
2. Verificar se está no banco correto
3. Verificar logs de migração
4. Executar migração novamente

## 📊 Status da Migração

**Comando**: `pnpm prisma migrate deploy`
**Status**: ⏳ Aguardando execução
**Tabela**: GiftToken
**Índices**: 4 índices criados
**Relacionamentos**: 2 FKs configuradas
