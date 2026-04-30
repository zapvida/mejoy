#!/usr/bin/env bash
# Valida Store V2 em produção (mejoy.com.br com STORE_V2=1)
# Uso: BASE_URL=https://www.mejoy.com.br ./scripts/validate-store-v2-production.sh
# Sempre usa timeout para nunca travar (--max-time 10).

set -euo pipefail

BASE_URL="${BASE_URL:-https://www.mejoy.com.br}"
FAILED=0
curl_check() { curl -s -o /dev/null -w "%{http_code}" --connect-timeout 5 --max-time 10 "$@"; }

echo "== Validação Store V2 em Produção =="
echo "URL: $BASE_URL"
echo "Timestamp: $(date)"
echo ""

# 1. Health
echo "🔍 Health..."
CODE=$(curl_check "$BASE_URL/api/health" 2>/dev/null || echo "000")
if [ "$CODE" = "200" ]; then
  echo "✅ Health OK ($CODE)"
else
  echo "❌ Health FAILED ($CODE)"
  FAILED=1
fi
echo ""

# 2. Health Store V2
echo "🔍 Health Store V2 /api/health/store-v2..."
CODE=$(curl_check "$BASE_URL/api/health/store-v2" 2>/dev/null || echo "000")
if [ "$CODE" = "200" ]; then
  echo "✅ Health store-v2 OK ($CODE)"
else
  echo "❌ Health store-v2 FAILED ($CODE)"
  FAILED=1
fi
echo ""

# 3. Health Catalog
echo "🔍 Health Catalog /api/health/catalog..."
CODE=$(curl_check "$BASE_URL/api/health/catalog" 2>/dev/null || echo "000")
if [ "$CODE" = "200" ]; then
  echo "✅ Health catalog OK ($CODE)"
else
  echo "❌ Health catalog FAILED ($CODE)"
  FAILED=1
fi
echo ""

# 4. Health Payments
echo "🔍 Health Payments /api/health/payments..."
CODE=$(curl_check "$BASE_URL/api/health/payments" 2>/dev/null || echo "000")
if [ "$CODE" = "200" ]; then
  echo "✅ Health payments OK ($CODE)"
else
  echo "❌ Health payments FAILED ($CODE)"
  FAILED=1
fi
echo ""

# 5. Home (Store V2 precisa de STORE_V2=1 no servidor - não conseguimos forçar via curl)
echo "🔍 Home..."
CODE=$(curl_check "$BASE_URL/" 2>/dev/null || echo "000")
if [ "$CODE" = "200" ]; then
  echo "✅ Home OK ($CODE)"
else
  echo "❌ Home FAILED ($CODE)"
  FAILED=1
fi
echo ""

# 6. Categoria
echo "🔍 Categoria /c/sono..."
CODE=$(curl_check "$BASE_URL/c/sono" 2>/dev/null || echo "000")
if [ "$CODE" = "200" ]; then
  echo "✅ /c/sono OK ($CODE)"
else
  echo "⚠️  /c/sono $CODE (pode 404 se STORE_V2=0)"
fi
echo ""

# 7. PDP (slug dinâmico do banco - evita falso positivo 404)
echo "🔍 PDP..."
SLUG=""
SLUG_RESP=$(curl -s --connect-timeout 5 --max-time 10 "$BASE_URL/api/store-v2/catalog/sample-slug" 2>/dev/null) || true
if [ -n "$SLUG_RESP" ]; then
  SLUG=$(echo "$SLUG_RESP" | grep -o '"slug":"[^"]*"' 2>/dev/null | cut -d'"' -f4) || SLUG=""
fi
if [ -n "$SLUG" ]; then
  CODE=$(curl_check -L "$BASE_URL/p/$SLUG" 2>/dev/null || echo "000")
  if [ "$CODE" = "200" ]; then
    echo "✅ PDP OK ($CODE) — slug: $SLUG"
  else
    echo "❌ PDP $CODE (slug: $SLUG)"
    FAILED=1
  fi
else
  echo "⚠️  Sem slug no catálogo — PDP ignorado (rodar import se necessário)"
fi
echo ""

# 8. Carrinho
echo "🔍 /cart..."
CODE=$(curl_check "$BASE_URL/cart" 2>/dev/null || echo "000")
if [ "$CODE" = "200" ]; then
  echo "✅ /cart OK ($CODE)"
else
  echo "⚠️  /cart $CODE"
fi
echo ""

# 9. Checkout (página crítica do fluxo)
echo "🔍 /checkout..."
CODE=$(curl_check -L "$BASE_URL/checkout" 2>/dev/null || echo "000")
if [ "$CODE" = "200" ]; then
  echo "✅ /checkout OK ($CODE)"
else
  echo "❌ /checkout $CODE"
  FAILED=1
fi
echo ""

# 10. API Cart
echo "🔍 API /api/store-v2/cart..."
CODE=$(curl_check -X GET "$BASE_URL/api/store-v2/cart" 2>/dev/null || echo "000")
if [ "$CODE" = "200" ]; then
  echo "✅ API cart OK ($CODE)"
else
  echo "⚠️  API cart $CODE"
fi
echo ""

# 11. Webhook Asaas (POST em /api/webhooks/asaas - endpoint responde)
echo "🔍 Webhook /api/webhooks/asaas..."
WEBHOOK_CODE=$(curl_check -X POST -H "Content-Type: application/json" -d '{}' "$BASE_URL/api/webhooks/asaas" 2>/dev/null || echo "000")
if [ "$WEBHOOK_CODE" = "200" ] || [ "$WEBHOOK_CODE" = "400" ]; then
  echo "✅ Webhook OK ($WEBHOOK_CODE - endpoint ativo)"
elif [ "$WEBHOOK_CODE" = "000" ]; then
  echo "⚠️  Webhook timeout/erro"
else
  echo "⚠️  Webhook $WEBHOOK_CODE"
fi
echo ""

# 12. Admin store-v2 orders (sem auth = 401 esperado; 404 = ainda não deployado)
echo "🔍 Admin /api/admin/store-v2/orders..."
CODE=$(curl_check -X GET "$BASE_URL/api/admin/store-v2/orders" 2>/dev/null || echo "000")
if [ "$CODE" = "401" ]; then
  echo "✅ Admin orders 401 OK (protegido)"
elif [ "$CODE" = "404" ]; then
  echo "⚠️  Admin orders 404 (fazer deploy para ativar)"
else
  echo "⚠️  Admin orders $CODE"
fi
echo ""

if [ $FAILED -eq 1 ]; then
  echo "❌ Validação FALHOU"
  exit 1
fi

echo "🎉 Validação concluída!"
echo ""
echo "Próximos passos:"
echo "1. Envs obrigatórias: STORE_V2=1, NEXT_PUBLIC_STORE_V2=1, ASAAS_WEBHOOK_TOKEN, ADMIN_SECRET_KEY, RESEND_API_KEY, DATABASE_URL"
echo "2. Migration: SQL no Supabase (scripts/store-v2-migrations.sql)"
echo "3. Webhook Asaas: URL $BASE_URL/api/webhooks/asaas (token opcional)"
echo "4. Compra teste real end-to-end (PIX → PAID → email → dashboard)"
