#!/bin/bash
# Script para criar produtos e preços no Stripe via CLI
# Uso: ./scripts/create-stripe-products.sh

set -e

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}🚀 Criando produtos e preços no Stripe (LIVE MODE)${NC}"
echo ""

# Verificar se Stripe CLI está instalado
if ! command -v stripe &> /dev/null; then
    echo -e "${RED}❌ Stripe CLI não encontrado. Instale: brew install stripe/stripe-cli/stripe${NC}"
    exit 1
fi

# Verificar se está logado
if ! stripe config --list &> /dev/null; then
    echo -e "${YELLOW}⚠️  Você precisa fazer login no Stripe CLI primeiro:${NC}"
    echo "   stripe login"
    exit 1
fi

echo -e "${YELLOW}⚠️  ATENÇÃO: Você está no modo LIVE.${NC}"
echo -e "${YELLOW}   Certifique-se de que está usando a conta correta!${NC}"
echo ""
read -p "Continuar? (s/N): " -n 1 -r
echo
if [[ ! $REPLY =~ ^[SsYy]$ ]]; then
    echo "Cancelado."
    exit 0
fi

echo ""
echo -e "${GREEN}📦 Criando produtos...${NC}"
echo ""

# 1. Produto Plus
echo "1. Criando produto 'Aistotele Plus'..."
PLUS_PRODUCT=$(stripe products create \
  --name="Aistotele Plus" \
  --description="Plano principal com relatórios ilimitados, consultas virtuais e monitoramento contínuo" \
  --format=json | jq -r '.id')

echo -e "${GREEN}✅ Produto Plus criado: ${PLUS_PRODUCT}${NC}"

# 2. Preço Plus Mensal
echo "2. Criando preço Plus Mensal (R$ 29,90/mês)..."
PLUS_MONTHLY=$(stripe prices create \
  --product="$PLUS_PRODUCT" \
  --currency=brl \
  --unit-amount=2990 \
  --recurring[interval]=month \
  --format=json | jq -r '.id')

echo -e "${GREEN}✅ Plus Mensal criado: ${PLUS_MONTHLY}${NC}"
echo -e "${YELLOW}   Adicione ao Vercel: STRIPE_PRICE_PLUS_MONTHLY=${PLUS_MONTHLY}${NC}"
echo ""

# 3. Preço Plus Anual
echo "3. Criando preço Plus Anual (R$ 299,00/ano)..."
PLUS_YEARLY=$(stripe prices create \
  --product="$PLUS_PRODUCT" \
  --currency=brl \
  --unit-amount=29900 \
  --recurring[interval]=year \
  --format=json | jq -r '.id')

echo -e "${GREEN}✅ Plus Anual criado: ${PLUS_YEARLY}${NC}"
echo -e "${YELLOW}   Adicione ao Vercel: STRIPE_PRICE_PLUS_YEARLY=${PLUS_YEARLY}${NC}"
echo ""

# 4. Produto Gift
echo "4. Criando produto 'Aistotele Gift'..."
GIFT_PRODUCT=$(stripe products create \
  --name="Aistotele Gift" \
  --description="Plano presente com preço especial para presentear alguém" \
  --format=json | jq -r '.id')

echo -e "${GREEN}✅ Produto Gift criado: ${GIFT_PRODUCT}${NC}"

# 5. Preço Gift Mensal
echo "5. Criando preço Gift Mensal (R$ 19,90/mês)..."
GIFT_MONTHLY=$(stripe prices create \
  --product="$GIFT_PRODUCT" \
  --currency=brl \
  --unit-amount=1990 \
  --recurring[interval]=month \
  --format=json | jq -r '.id')

echo -e "${GREEN}✅ Gift Mensal criado: ${GIFT_MONTHLY}${NC}"
echo -e "${YELLOW}   Adicione ao Vercel: STRIPE_PRICE_GIFT_MONTHLY=${GIFT_MONTHLY}${NC}"
echo ""

# 6. Preço Gift Anual
echo "6. Criando preço Gift Anual (R$ 199,00/ano)..."
GIFT_YEARLY=$(stripe prices create \
  --product="$GIFT_PRODUCT" \
  --currency=brl \
  --unit-amount=19900 \
  --recurring[interval]=year \
  --format=json | jq -r '.id')

echo -e "${GREEN}✅ Gift Anual criado: ${GIFT_YEARLY}${NC}"
echo -e "${YELLOW}   Adicione ao Vercel: STRIPE_PRICE_GIFT_YEARLY=${GIFT_YEARLY}${NC}"
echo ""

# 7. Produto Addon
echo "7. Criando produto 'Assentos Extras'..."
ADDON_PRODUCT=$(stripe products create \
  --name="Assentos Extras" \
  --description="Assentos adicionais para incluir mais pessoas no plano" \
  --format=json | jq -r '.id')

echo -e "${GREEN}✅ Produto Addon criado: ${ADDON_PRODUCT}${NC}"

# 8. Preço Addon Mensal
echo "8. Criando preço Addon Mensal (R$ 9,90/mês)..."
ADDON_MONTHLY=$(stripe prices create \
  --product="$ADDON_PRODUCT" \
  --currency=brl \
  --unit-amount=990 \
  --recurring[interval]=month \
  --format=json | jq -r '.id')

echo -e "${GREEN}✅ Addon Mensal criado: ${ADDON_MONTHLY}${NC}"
echo -e "${YELLOW}   Adicione ao Vercel: STRIPE_PRICE_ADDON_MONTHLY=${ADDON_MONTHLY}${NC}"
echo ""

# 9. Preço Addon Anual
echo "9. Criando preço Addon Anual (R$ 99,00/ano)..."
ADDON_YEARLY=$(stripe prices create \
  --product="$ADDON_PRODUCT" \
  --currency=brl \
  --unit-amount=9900 \
  --recurring[interval]=year \
  --format=json | jq -r '.id')

echo -e "${GREEN}✅ Addon Anual criado: ${ADDON_YEARLY}${NC}"
echo -e "${YELLOW}   Adicione ao Vercel: STRIPE_PRICE_ADDON_YEARLY=${ADDON_YEARLY}${NC}"
echo ""

# Resumo
echo ""
echo -e "${GREEN}═══════════════════════════════════════════════════════════${NC}"
echo -e "${GREEN}✅ PRODUTOS CRIADOS COM SUCESSO!${NC}"
echo -e "${GREEN}═══════════════════════════════════════════════════════════${NC}"
echo ""
echo "📋 Copie estes valores para o Vercel:"
echo ""
echo "STRIPE_PRICE_PLUS_MONTHLY=${PLUS_MONTHLY}"
echo "STRIPE_PRICE_PLUS_YEARLY=${PLUS_YEARLY}"
echo "STRIPE_PRICE_GIFT_MONTHLY=${GIFT_MONTHLY}"
echo "STRIPE_PRICE_GIFT_YEARLY=${GIFT_YEARLY}"
echo "STRIPE_PRICE_ADDON_MONTHLY=${ADDON_MONTHLY}"
echo "STRIPE_PRICE_ADDON_YEARLY=${ADDON_YEARLY}"
echo ""
echo -e "${YELLOW}⚠️  Não esqueça de:${NC}"
echo "   1. Configurar webhook no Stripe Dashboard"
echo "   2. Copiar STRIPE_WEBHOOK_SECRET"
echo "   3. Copiar NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY"
echo "   4. Mudar TENANT_MODE para 'multi'"
echo "   5. Mudar STRIPE_ENABLED para '1'"
echo ""

