#!/bin/bash
# Script para criar apenas os preços usando produtos existentes
# Uso: ./scripts/create-prices-only.sh [produto_plus] [produto_gift] [produto_addon]

set -e

# Verificar se produtos foram passados como argumentos
if [ "$#" -eq 3 ]; then
  PLUS_PROD=$1
  GIFT_PROD=$2
  ADDON_PROD=$3
else
  echo "❌ Uso: ./scripts/create-prices-only.sh [produto_plus] [produto_gift] [produto_addon]"
  echo ""
  echo "Para encontrar os IDs dos produtos, execute:"
  echo "  stripe products list"
  exit 1
fi

echo "🚀 Criando preços no Stripe (TEST MODE)"
echo ""
echo "Produtos:"
echo "  Plus: $PLUS_PROD"
echo "  Gift: $GIFT_PROD"
echo "  Addon: $ADDON_PROD"
echo ""

# Criar preços
echo "1. Criando Plus Mensal (R$ 29,90)..."
PLUS_MONTHLY=$(stripe prices create --product "$PLUS_PROD" --currency brl --unit-amount 2990 --recurring interval=month --format json 2>&1 | grep -o '"id":"[^"]*"' | cut -d'"' -f4)
echo "✅ Plus Mensal: $PLUS_MONTHLY"

echo "2. Criando Plus Anual (R$ 299,00)..."
PLUS_YEARLY=$(stripe prices create --product "$PLUS_PROD" --currency brl --unit-amount 29900 --recurring interval=year --format json 2>&1 | grep -o '"id":"[^"]*"' | cut -d'"' -f4)
echo "✅ Plus Anual: $PLUS_YEARLY"

echo "3. Criando Gift Mensal (R$ 19,90)..."
GIFT_MONTHLY=$(stripe prices create --product "$GIFT_PROD" --currency brl --unit-amount 1990 --recurring interval=month --format json 2>&1 | grep -o '"id":"[^"]*"' | cut -d'"' -f4)
echo "✅ Gift Mensal: $GIFT_MONTHLY"

echo "4. Criando Gift Anual (R$ 199,00)..."
GIFT_YEARLY=$(stripe prices create --product "$GIFT_PROD" --currency brl --unit-amount 19900 --recurring interval=year --format json 2>&1 | grep -o '"id":"[^"]*"' | cut -d'"' -f4)
echo "✅ Gift Anual: $GIFT_YEARLY"

echo "5. Criando Addon Mensal (R$ 9,90)..."
ADDON_MONTHLY=$(stripe prices create --product "$ADDON_PROD" --currency brl --unit-amount 990 --recurring interval=month --format json 2>&1 | grep -o '"id":"[^"]*"' | cut -d'"' -f4)
echo "✅ Addon Mensal: $ADDON_MONTHLY"

echo "6. Criando Addon Anual (R$ 99,00)..."
ADDON_YEARLY=$(stripe prices create --product "$ADDON_PROD" --currency brl --unit-amount 9900 --recurring interval=year --format json 2>&1 | grep -o '"id":"[^"]*"' | cut -d'"' -f4)
echo "✅ Addon Anual: $ADDON_YEARLY"

echo ""
echo "═══════════════════════════════════════════════════════════"
echo "✅ PREÇOS CRIADOS COM SUCESSO!"
echo "═══════════════════════════════════════════════════════════"
echo ""
echo "📋 Copie estas ENVs para o Vercel:"
echo ""
echo "STRIPE_PRICE_PLUS_MONTHLY=$PLUS_MONTHLY"
echo "STRIPE_PRICE_PLUS_YEARLY=$PLUS_YEARLY"
echo "STRIPE_PRICE_GIFT_MONTHLY=$GIFT_MONTHLY"
echo "STRIPE_PRICE_GIFT_YEARLY=$GIFT_YEARLY"
echo "STRIPE_PRICE_ADDON_MONTHLY=$ADDON_MONTHLY"
echo "STRIPE_PRICE_ADDON_YEARLY=$ADDON_YEARLY"
echo ""

