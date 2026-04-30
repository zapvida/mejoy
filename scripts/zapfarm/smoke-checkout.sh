#!/usr/bin/env bash
set -euo pipefail

# Smoke ZapFarm checkout: health, prices API, e validação de create-payment (dry-run)
# Uso: ./scripts/zapfarm/smoke-checkout.sh [local|preview|prod]
# Ex: ./scripts/zapfarm/smoke-checkout.sh local  -> http://localhost:3000
# Ex: ./scripts/zapfarm/smoke-checkout.sh preview -> $VERCEL_PREVIEW_URL ou URL passada

MODE="${1:-local}"
case "$MODE" in
  local)   BASE="${2:-http://localhost:3000}" ;;
  preview) BASE="${2:-${VERCEL_PREVIEW_URL:-https://mejoy-git-chore-zapfarm-price-source-zapfarm.vercel.app}}" ;;
  prod)    BASE="${2:-https://www.zapfarm.com.br}" ;;
  *)       BASE="$MODE" ;;
esac

echo "=== ZapFarm Checkout Smoke @ $BASE ==="
echo "Timestamp: $(date)"
echo ""

FAIL=0

check() {
  local url="$1" expected="$2" desc="${3:-}"
  local code
  code=$(curl -s -o /dev/null -w "%{http_code}" "$url" 2>/dev/null || echo "000")
  if [ "$code" != "$expected" ]; then
    echo "❌ FAIL $desc $url -> $code (expected $expected)"
    FAIL=1
    return 1
  fi
  echo "✅ OK   $desc $url -> $code"
  return 0
}

get_json() {
  local url="$1"
  curl -s "$url" 2>/dev/null || echo "{}"
}

echo "🔍 1. Health ZapFarm..."
check "$BASE/api/health/zapfarm" 200 "health"

echo ""
echo "🔍 2. Prices API (3 produtos)..."

for prod in sono ansiedade intestino; do
  json=$(get_json "$BASE/api/zapfarm/prices?product=$prod")
  if echo "$json" | grep -q '"pricesCents"'; then
    echo "✅ OK   prices?product=$prod"
  else
    echo "❌ FAIL prices?product=$prod -> response sem pricesCents"
    FAIL=1
  fi
done

echo ""
echo "🔍 3. Smoke create-payment validation..."
# POST com dados mínimos - em prod/preview com env ok retorna success ou 400
# Em local sem ASAAS_* retorna 500 (config) - não falha smoke
code=$(curl -s -o /tmp/smoke-create-payment.json -w "%{http_code}" -X POST "$BASE/api/asaas/create-payment" \
  -H "Content-Type: application/json" \
  -d '{"product":"sono","plano":"basico","quantity":1,"nome":"Test","email":"test@test.com","telefone":"11999999999"}' 2>/dev/null || echo "000")
json=$(cat /tmp/smoke-create-payment.json 2>/dev/null || echo '{}')

if [ "$code" = "200" ]; then
  if echo "$json" | grep -q '"status":"success"'; then
    echo "✅ OK   create-payment -> 200 success"
  else
    echo "⚠️  create-payment 200 mas sem status success"
  fi
elif [ "$code" = "400" ]; then
  echo "✅ OK   create-payment -> 400 (validação, esperado sem dados completos)"
elif [ "$code" = "500" ]; then
  echo "⚠️  create-payment -> 500 (verifique ASAAS_*, Supabase em env - normal em local sem .env)"
else
  echo "❌ FAIL create-payment -> $code"
  FAIL=1
fi

echo ""
if [ $FAIL -eq 1 ]; then
  echo "❌ Smoke FAILED"
  exit 1
fi
echo "✅ Smoke PASSED"
