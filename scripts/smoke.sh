#!/usr/bin/env bash
set -euo pipefail
BASE_URL="${1:-https://www.alloehealth.com.br}"

echo "== Smoke Test @ $BASE_URL =="
echo "Timestamp: $(date)"
echo ""

check() { # url expected_status
  local url="$1"
  local expected="$2"
  local code=$(curl -s -o /dev/null -w "%{http_code}" "$url" || echo "000")
  if [ "$code" != "$expected" ]; then
    echo "❌ FAIL $url -> $code (expected $expected)"
    return 1
  fi
  echo "✅ OK   $url -> $code"
}

post_json() { # url json expected_status
  local url="$1"
  local json="$2"
  local expected="$3"
  local code=$(curl -s -o /dev/null -w "%{http_code}" \
    -H "Content-Type: application/json" \
    -d "$json" "$url" || echo "000")
  if [ "$code" != "$expected" ]; then
    echo "❌ FAIL POST $url -> $code (expected $expected)"
    return 1
  fi
  echo "✅ OK   POST $url -> $code"
}

echo "🔍 Testing Static Pages..."
check "$BASE_URL/" 200
check "$BASE_URL/triagem/gastro" 200
check "$BASE_URL/relatorio/demo" 200 || echo "⚠️  Demo report may not exist"
check "$BASE_URL/faq" 200
check "$BASE_URL/quem-somos" 200
check "$BASE_URL/politica" 200
check "$BASE_URL/termos" 200

echo ""
echo "🔍 Testing Critical APIs..."
check "$BASE_URL/api/health" 200

echo ""
echo "🔍 Testing Fixed APIs (should now return 200/400 instead of 500)..."
post_json "$BASE_URL/api/chat-medico" '{"messages":[{"role":"user","content":"oi"}]}' 200
post_json "$BASE_URL/api/report/share" '{"id":"demo-123"}' 200
post_json "$BASE_URL/api/report/whatsapp" '{"id":"demo-123"}' 200
post_json "$BASE_URL/api/tts-secure" '{"text":"teste"}' 200

echo ""
echo "🔍 Testing PDF Generation..."
check "$BASE_URL/api/pdf/demo" 200

echo ""
echo "🔍 Testing Admin APIs (should return 401 - expected)..."
check "$BASE_URL/api/admin/revenue" 401
check "$BASE_URL/api/admin/product" 401
check "$BASE_URL/api/admin/funnel" 401

echo ""
echo "🎉 Smoke Test Complete!"
echo "✅ All critical endpoints are responding correctly"
echo "✅ No more 500 errors from fixed APIs"
echo "✅ Health check endpoint working"
echo ""
echo "📊 Check Vercel logs to see all requests:"
echo "   https://vercel.com/alloe-healths-projects/aistotele"
echo "   Go to: Logs > Last 30 minutes"
