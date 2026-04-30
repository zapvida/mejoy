#!/usr/bin/env bash
# Valida cart premium (STORE_V2_CONVERSION=1): progress bar, trust, upsell no HTML
# Requer NEXT_PUBLIC_STORE_V2_CONVERSION=1 no build (Vercel preview/staging)
# Uso: BASE_URL=https://staging.mejoy.com.br bash scripts/validate-cart-premium.sh

set -euo pipefail

BASE_URL="${BASE_URL:-https://www.mejoy.com.br}"

echo "== Validação Cart Premium =="
echo "URL: $BASE_URL/cart"
echo "Timestamp: $(date)"
echo ""
echo "⚠️  Este script exige NEXT_PUBLIC_STORE_V2_CONVERSION=1 no build."
echo "   Em prod com flag OFF, ele pode falhar (esperado)."
echo ""

HTML=$(curl -s -L --connect-timeout 5 --max-time 15 "$BASE_URL/cart" 2>/dev/null) || HTML=""

if [ -z "$HTML" ]; then
  echo "❌ Falha ao buscar HTML do carrinho"
  exit 1
fi

FAILED=0

# 1. cart-progress
echo "🔍 data-testid=cart-progress..."
if echo "$HTML" | grep -q 'data-testid="cart-progress"'; then
  echo "✅ cart-progress presente"
else
  echo "❌ cart-progress ausente (ligue NEXT_PUBLIC_STORE_V2_CONVERSION=1)"
  FAILED=1
fi
echo ""

# 2. cart-trust
echo "🔍 data-testid=cart-trust..."
if echo "$HTML" | grep -q 'data-testid="cart-trust"'; then
  echo "✅ cart-trust presente"
else
  echo "❌ cart-trust ausente"
  FAILED=1
fi
echo ""

# 3. cart-upsell
echo "🔍 data-testid=cart-upsell..."
if echo "$HTML" | grep -q 'data-testid="cart-upsell"'; then
  echo "✅ cart-upsell presente"
else
  echo "❌ cart-upsell ausente"
  FAILED=1
fi
echo ""

if [ $FAILED -eq 1 ]; then
  echo "❌ Validação Cart Premium FALHOU"
  echo ""
  echo "Para passar: deploy com STORE_V2_CONVERSION=1 e NEXT_PUBLIC_STORE_V2_CONVERSION=1"
  exit 1
fi

echo "🎉 Validação Cart Premium concluída!"
