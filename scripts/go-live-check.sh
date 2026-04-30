#!/usr/bin/env bash
# Go-Live Check — somente leitura. Não altera nada.
# Uso: BASE_URL=https://www.mejoy.com.br bash scripts/go-live-check.sh
# Ou local: BASE_URL=http://localhost:3000 bash scripts/go-live-check.sh

set -euo pipefail

BASE_URL="${BASE_URL:-https://www.mejoy.com.br}"
curl_check() { curl -s -o /dev/null -w "%{http_code}" --connect-timeout 5 --max-time 10 "$@"; }

echo "============================================"
echo "  GO-LIVE CHECK — Me Joy Store V2"
echo "  URL: $BASE_URL | $(date)"
echo "============================================"
echo ""

# 1. Envs (shell atual — sem expor valores; source .env.local antes para checar)
echo "📋 1. ENVS ESSENCIAIS (shell atual)"
check_env() {
  if [ -n "${!1:-}" ]; then echo "   ✅ $1"; return 0; else echo "   ⚠️  $1 (não setado)"; return 1; fi
}
check_env STORE_V2 2>/dev/null || true
check_env NEXT_PUBLIC_STORE_V2 2>/dev/null || true
check_env DATABASE_URL 2>/dev/null || true
check_env ASAAS_API_KEY 2>/dev/null || true
# ASAAS_WEBHOOK_TOKEN opcional
check_env ADMIN_SECRET_KEY 2>/dev/null || true
check_env RESEND_API_KEY 2>/dev/null || true
echo "   (Health /payments valida envs no servidor)"
echo ""

# 2. Health endpoints
echo "📋 2. HEALTH ENDPOINTS"
for path in "/api/health" "/api/health/store-v2" "/api/health/catalog" "/api/health/payments"; do
  C=$(curl_check "$BASE_URL$path" 2>/dev/null || echo "000")
  if [ "$C" = "200" ]; then
    echo "   ✅ $path ($C)"
  else
    echo "   ❌ $path ($C)"
  fi
done
echo ""

# 3. Webhook (endpoint ativo)
echo "📋 3. WEBHOOK (endpoint ativo)"
W=$(curl_check -X POST -H "Content-Type: application/json" -d '{}' "$BASE_URL/api/webhooks/asaas" 2>/dev/null || echo "000")
if [ "$W" = "200" ] || [ "$W" = "400" ]; then
  echo "   ✅ Webhook OK ($W)"
else
  echo "   ⚠️  Webhook $W"
fi
echo ""

# 4. Admin 401 (sem auth)
echo "📋 4. ADMIN (401 sem auth = protegido)"
A=$(curl_check -X GET "$BASE_URL/api/admin/store-v2/orders" 2>/dev/null || echo "000")
if [ "$A" = "401" ]; then
  echo "   ✅ Admin retorna 401 sem auth"
else
  echo "   ⚠️  Admin $A"
fi
echo ""

# 5. PDP dinâmico
echo "📋 5. PDP DINÂMICO"
SLUG=$(curl -s --connect-timeout 5 --max-time 10 "$BASE_URL/api/store-v2/catalog/sample-slug" 2>/dev/null | grep -o '"slug":"[^"]*"' | cut -d'"' -f4) || true
if [ -n "$SLUG" ]; then
  C=$(curl_check -L "$BASE_URL/p/$SLUG" 2>/dev/null || echo "000")
  if [ "$C" = "200" ]; then
    echo "   ✅ PDP /p/$SLUG ($C)"
  else
    echo "   ❌ PDP $C (slug: $SLUG)"
  fi
else
  echo "   ⚠️  Sem slug no catálogo"
fi
echo ""

echo "============================================"
echo "  PRÓXIMO PASSO: COMPRA E2E MANUAL"
echo "============================================"
echo ""
echo "  1. Home → PDP → Carrinho → Checkout"
echo "  2. Preencher dados, CEP, gerar PIX"
echo "  3. Pagar PIX"
echo "  4. Verificar: PAID + email + dashboard + admin"
echo ""
echo "  Script completo: bash scripts/validate-store-v2-production.sh"
echo ""
