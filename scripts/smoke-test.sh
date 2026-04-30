#!/bin/bash

# 🧪 SMOKE TEST - ZAPFARM PRODUCTION
# Script para validar todos os 10 produtos antes do lançamento

set -e

BASE_URL="${BASE_URL:-https://www.zapfarm.com.br}"
PRODUCTS=(
  "emagrecimento"
  "calvicie"
  "sono"
  "ansiedade"
  "intestino"
  "figado"
  "libido-masculina"
  "menopausa"
  "articulacoes"
  "imunidade"
)

GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo "🚀 ZAPFARM SMOKE TEST"
echo "===================="
echo "Base URL: $BASE_URL"
echo ""

PASSED=0
FAILED=0

test_url() {
  local url=$1
  local description=$2
  
  if curl -s -o /dev/null -w "%{http_code}" "$url" | grep -q "200"; then
    echo -e "${GREEN}✅${NC} $description"
    ((PASSED++))
    return 0
  else
    echo -e "${RED}❌${NC} $description"
    ((FAILED++))
    return 1
  fi
}

echo "📋 Testando LPACs (Landing Pages)..."
echo ""

for product in "${PRODUCTS[@]}"; do
  test_url "$BASE_URL/$product" "LPAC: $product"
done

echo ""
echo "📋 Testando Checkouts..."
echo ""

for product in "${PRODUCTS[@]}"; do
  test_url "$BASE_URL/$product/checkout" "Checkout: $product"
done

echo ""
echo "📋 Testando Páginas de Obrigado..."
echo ""

for product in "${PRODUCTS[@]}"; do
  test_url "$BASE_URL/$product/obrigado" "Obrigado: $product"
done

echo ""
echo "📋 Testando APIs críticas..."
echo ""

test_url "$BASE_URL/api/asaas/webhook" "Webhook Asaas (deve retornar 405 Method Not Allowed para GET)"
test_url "$BASE_URL/api/profile/me-basic" "API Profile Me Basic"

echo ""
echo "===================="
echo "📊 RESULTADO FINAL"
echo "===================="
echo -e "${GREEN}✅ Passou: $PASSED${NC}"
echo -e "${RED}❌ Falhou: $FAILED${NC}"
echo ""

if [ $FAILED -eq 0 ]; then
  echo -e "${GREEN}🎉 TODOS OS TESTES PASSARAM!${NC}"
  echo ""
  echo "✅ Próximos passos:"
  echo "   1. Teste manualmente: LPAC → Triagem → Relatório → Checkout"
  echo "   2. Teste pagamento PIX em pelo menos 2 produtos"
  echo "   3. Teste pagamento Cartão em pelo menos 2 produtos"
  echo "   4. Verifique webhook no painel Asaas"
  exit 0
else
  echo -e "${RED}⚠️  ALGUNS TESTES FALHARAM${NC}"
  echo ""
  echo "Verifique os URLs que falharam acima."
  exit 1
fi

