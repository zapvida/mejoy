#!/usr/bin/env bash
set -euo pipefail

BASE_URL="${1:-https://www.aistotele.com}"

echo "🧪 TESTE COMPLETO DO FLUXO - DEPLOY PERFEITO"
echo "=============================================="
echo "Timestamp: $(date)"
echo "Base URL: $BASE_URL"
echo ""

# Cores para output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

check() {
  local url="$1"
  local expected="$2"
  local description="$3"
  local code=$(curl -s -o /dev/null -w "%{http_code}" --max-time 10 "$url" 2>/dev/null || echo "000")
  
  if [ "$code" == "$expected" ]; then
    echo -e "${GREEN}✅ PASS${NC} $description"
    echo "   URL: $url"
    echo "   Status: $code"
    return 0
  else
    echo -e "${RED}❌ FAIL${NC} $description"
    echo "   URL: $url"
    echo "   Status: $code (esperado: $expected)"
    return 1
  fi
}

post_json() {
  local url="$1"
  local json="$2"
  local expected="$3"
  local description="$4"
  local response=$(curl -s -w "\n%{http_code}" --max-time 10 -X POST \
    -H "Content-Type: application/json" \
    -d "$json" "$url" 2>/dev/null || echo -e "\n000")
  
  local body=$(echo "$response" | sed '$d')
  local code=$(echo "$response" | tail -n 1)
  
  if [ "$code" == "$expected" ]; then
    echo -e "${GREEN}✅ PASS${NC} $description"
    echo "   URL: $url"
    echo "   Status: $code"
    if [ "$code" == "201" ] || [ "$code" == "200" ]; then
      echo "   Response: $(echo "$body" | head -c 100)..."
    fi
    return 0
  else
    echo -e "${RED}❌ FAIL${NC} $description"
    echo "   URL: $url"
    echo "   Status: $code (esperado: $expected)"
    echo "   Response: $body"
    return 1
  fi
}

echo "📋 1. TESTANDO ROTAS ESTÁTICAS..."
echo "-----------------------------------"
check "$BASE_URL/" 200 "Homepage"
check "$BASE_URL/b2b/configurar" 200 "B2B Runner - Step 1"
check "$BASE_URL/b2b/configurar/cores" 200 "B2B Runner - Step 2"
check "$BASE_URL/b2b/configurar/cta" 200 "B2B Runner - Step 3"
check "$BASE_URL/b2b/configurar/revisao" 200 "B2B Runner - Step 4"
check "$BASE_URL/pricing" 200 "Pricing Page"
check "$BASE_URL/faq" 200 "FAQ Page"
echo ""

echo "📋 2. TESTANDO APIs CRÍTICAS..."
echo "--------------------------------"
post_json "$BASE_URL/api/branding/draft" \
  '{"brandColor":"#10b981","accentColor":"#34d399","fantasyName":"Clínica Teste","ctaText":"Falar com médico","ctaUrl":"https://wa.me/5599999999999"}' \
  201 "API Branding Draft (POST)"

post_json "$BASE_URL/api/b2b/lead" \
  '{"name":"Teste Lead","email":"teste@lead.com"}' \
  200 "API B2B Lead (POST)"

post_json "$BASE_URL/api/stripe/create-checkout-session" \
  '{"plan":"plus","period":"monthly"}' \
  200 "API Stripe Checkout (POST)"
echo ""

echo "📋 3. TESTANDO HEALTH CHECK..."
echo "--------------------------------"
check "$BASE_URL/api/health" 200 "Health Check"
echo ""

echo "📋 4. VERIFICANDO SEO..."
echo "-------------------------"
check "$BASE_URL/robots.txt" 200 "Robots.txt"
check "$BASE_URL/sitemap.xml" 200 "Sitemap.xml"
echo ""

echo "=============================================="
echo -e "${GREEN}✅ TESTE COMPLETO FINALIZADO${NC}"
echo "=============================================="
echo ""
echo "📊 Verificar logs no Vercel:"
echo "   https://vercel.com/aistotele-projects/aistotele"
echo ""

