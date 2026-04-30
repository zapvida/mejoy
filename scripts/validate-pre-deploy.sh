#!/bin/bash
# Script de validação pré-deploy
# Verifica se todas as configurações necessárias estão prontas

set -e

echo "🔍 VALIDAÇÃO PRÉ-DEPLOY - LOTE H+I"
echo "=================================="
echo ""

# Cores
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

check_pass() {
  if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅${NC} $1"
  else
    echo -e "${RED}❌${NC} $1"
    exit 1
  fi
}

check_warn() {
  if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅${NC} $1"
  else
    echo -e "${YELLOW}⚠️${NC} $1 (continuando...)"
  fi
}

echo "1. Verificando Prisma Client..."
pnpm prisma generate > /dev/null 2>&1
check_pass "Prisma Client gerado"

echo ""
echo "2. Verificando arquivos criados..."

[ -f "src/pages/b2b/configurar.tsx" ] && check_pass "Página /b2b/configurar existe" || echo -e "${RED}❌${NC} Página /b2b/configurar não encontrada"
[ -f "src/pages/api/branding/draft.ts" ] && check_pass "API /api/branding/draft existe" || echo -e "${RED}❌${NC} API draft não encontrada"
[ -f "src/lib/stripe/provision.ts" ] && check_pass "Função provision existe" || echo -e "${RED}❌${NC} Função provision não encontrada"
[ -f "src/pages/api/cron/cleanup.ts" ] && check_pass "API cleanup existe" || echo -e "${RED}❌${NC} API cleanup não encontrada"
[ -f "vercel.json" ] && check_pass "vercel.json existe" || echo -e "${RED}❌${NC} vercel.json não encontrado"

echo ""
echo "3. Verificando vercel.json (cron)..."
grep -q '"crons"' vercel.json && check_pass "Cron configurado no vercel.json" || echo -e "${YELLOW}⚠️${NC} Cron não encontrado no vercel.json"

echo ""
echo "4. Verificando schema Prisma..."
grep -q "model BrandingDraft" prisma/schema.prisma && check_pass "Modelo BrandingDraft no schema" || echo -e "${RED}❌${NC} BrandingDraft não encontrado"
grep -q "model Tenant" prisma/schema.prisma && check_pass "Modelo Tenant no schema" || echo -e "${RED}❌${NC} Tenant não encontrado"

echo ""
echo "5. Verificando migração SQL..."
[ -f "prisma/migrations/20241104_add_branding_draft_and_tenant/migration.sql" ] && check_pass "Migração SQL existe" || echo -e "${RED}❌${NC} Migração SQL não encontrada"

echo ""
echo "6. Verificando integrações..."
grep -q "draft_id" src/pages/api/stripe/create-checkout-session.ts && check_pass "draft_id no checkout" || echo -e "${RED}❌${NC} draft_id não encontrado no checkout"
grep -q "provisionTenantFromSession" src/lib/stripe/handlers.ts && check_pass "Provisionamento no webhook" || echo -e "${RED}❌${NC} Provisionamento não encontrado no webhook"

echo ""
echo "=================================="
echo -e "${GREEN}✅ Validação local concluída!${NC}"
echo ""
echo "⚠️  PRÓXIMOS PASSOS:"
echo "   1. Executar migração SQL no Supabase"
echo "   2. Configurar ENVs no Vercel"
echo "   3. Configurar wildcard DNS"
echo "   4. Deploy e validação em produção"

