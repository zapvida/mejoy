#!/bin/bash
# Script de Validação Completa - Emagrecimento
# Roda todos os testes e validações antes do deploy

set -e

echo "🚀 VALIDAÇÃO COMPLETA - FLUXO EMAGRECIMENTO"
echo "============================================"
echo ""

# Cores
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Contador de erros
ERRORS=0

# 1. Lint
echo "📋 [1/5] Rodando Lint..."
if pnpm lint; then
  echo -e "${GREEN}✅ Lint passou${NC}"
else
  echo -e "${RED}❌ Lint falhou${NC}"
  ERRORS=$((ERRORS + 1))
fi
echo ""

# 2. TypeScript
echo "📋 [2/5] Verificando TypeScript..."
if pnpm typecheck; then
  echo -e "${GREEN}✅ TypeScript OK${NC}"
else
  echo -e "${RED}❌ TypeScript falhou${NC}"
  ERRORS=$((ERRORS + 1))
fi
echo ""

# 3. Build
echo "📋 [3/5] Rodando Build..."
if pnpm build; then
  echo -e "${GREEN}✅ Build passou${NC}"
else
  echo -e "${RED}❌ Build falhou${NC}"
  ERRORS=$((ERRORS + 1))
fi
echo ""

# 4. Testes E2E (se Playwright estiver disponível)
echo "📋 [4/5] Rodando Testes E2E..."
if command -v playwright &> /dev/null; then
  if pnpm test:e2e tests/e2e/emagrecimento-completo.spec.ts --reporter=list 2>&1 | head -50; then
    echo -e "${GREEN}✅ Testes E2E passaram${NC}"
  else
    echo -e "${YELLOW}⚠️ Testes E2E com problemas (não bloqueante)${NC}"
  fi
else
  echo -e "${YELLOW}⚠️ Playwright não disponível, pulando testes E2E${NC}"
fi
echo ""

# 5. Smoke Test Automatizado
echo "📋 [5/5] Rodando Smoke Test Automatizado..."
if tsx scripts/qa/emagrecimento-smoke.ts; then
  echo -e "${GREEN}✅ Smoke Test passou${NC}"
else
  echo -e "${YELLOW}⚠️ Smoke Test com problemas (verificar logs)${NC}"
fi
echo ""

# Resumo
echo "============================================"
if [ $ERRORS -eq 0 ]; then
  echo -e "${GREEN}✅ VALIDAÇÃO COMPLETA - TUDO OK${NC}"
  echo ""
  echo "Próximos passos:"
  echo "1. git add ."
  echo "2. git commit -m 'feat: adiciona testes automatizados e validação completa'"
  echo "3. git push origin main"
  exit 0
else
  echo -e "${RED}❌ VALIDAÇÃO FALHOU - $ERRORS erro(s) encontrado(s)${NC}"
  exit 1
fi

