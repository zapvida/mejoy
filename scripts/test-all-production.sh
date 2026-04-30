#!/usr/bin/env bash
set -euo pipefail
BASE_URL="${1:-https://www.aistotele.com}"

echo "== Smoke Test E2E @ $BASE_URL =="
echo "Timestamp: $(date)"
echo ""

check() {
  local url="$1"
  local expected="$2"
  local code=$(curl -s -o /dev/null -w "%{http_code}" "$url" || echo "000")
  local time=$(curl -s -o /dev/null -w "%{time_total}" "$url" || echo "0.000")
  if [ "$code" != "$expected" ]; then
    echo "❌ FAIL $url -> $code (expected $expected) [${time}s]"
    return 1
  fi
  echo "✅ OK   $url -> $code [${time}s]"
}

post_json() {
  local url="$1"
  local json="$2"
  local expected="$3"
  local response=$(curl -s -w "\n%{http_code}" -H "Content-Type: application/json" -d "$json" "$url" || echo -e "\n000")
  local body=$(echo "$response" | head -n -1)
  local code=$(echo "$response" | tail -n 1)
  local time=$(curl -s -o /dev/null -w "%{time_total}" -H "Content-Type: application/json" -d "$json" "$url" || echo "0.000")
  if [ "$code" != "$expected" ]; then
    echo "❌ FAIL POST $url -> $code (expected $expected) [${time}s]"
    echo "   Response: $body"
    return 1
  fi
  echo "✅ OK   POST $url -> $code [${time}s]"
  if [ "$code" = "201" ] || [ "$code" = "200" ]; then
    echo "   Response preview: $(echo "$body" | head -c 100)..."
  fi
}

echo "🔍 Testing B2B Runner Routes..."
check "$BASE_URL/b2b/configurar" 200
check "$BASE_URL/b2b/configurar/cores" 200
check "$BASE_URL/b2b/configurar/cta" 200
check "$BASE_URL/b2b/configurar/revisao" 200

echo ""
echo "🔍 Testing Critical APIs..."
check "$BASE_URL/api/health" 200

echo ""
echo "🔍 Testing Branding Draft API..."
post_json "$BASE_URL/api/branding/draft" '{"brandColor":"#10b981","accentColor":"#34d399","fantasyName":"Clínica Teste","ctaText":"Falar com médico","ctaUrl":"https://wa.me/5599999999999"}' 201

echo ""
echo "🔍 Testing B2B Lead API..."
post_json "$BASE_URL/api/b2b/lead" '{"name":"Teste","email":"teste@example.com"}' 200

echo ""
echo "🔍 Testing Stripe Checkout API..."
post_json "$BASE_URL/api/stripe/create-checkout-session" '{"plan":"plus","period":"monthly"}' 200

echo ""
echo "🎉 Smoke Test Complete!"
echo "✅ All critical endpoints are responding correctly"