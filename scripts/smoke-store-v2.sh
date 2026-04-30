#!/usr/bin/env bash
# Smoke Store V2 — lint, build, health, páginas base, import stub
# Uso: ./scripts/smoke-store-v2.sh [BASE_URL]
# Ex: ./scripts/smoke-store-v2.sh http://localhost:3000
set -euo pipefail

BASE_URL="${1:-http://localhost:3000}"
FAILED=0

echo "== Smoke Store V2 @ $BASE_URL =="
echo "Timestamp: $(date)"
echo ""

# 1. Lint
echo "🔍 Lint..."
if pnpm run lint 2>/dev/null; then
  echo "✅ Lint OK"
else
  echo "❌ Lint FAILED"
  FAILED=1
fi
echo ""

# 2. Build
echo "🔍 Build..."
if pnpm run build 2>/dev/null; then
  echo "✅ Build OK"
else
  echo "❌ Build FAILED"
  FAILED=1
fi
echo ""

# 3. Health (opcional se server não estiver rodando)
echo "🔍 Health..."
CODE=$(curl -s -o /dev/null -w "%{http_code}" --connect-timeout 3 "$BASE_URL/api/health" 2>/dev/null || echo "000")
if [ "$CODE" = "200" ]; then
  echo "✅ Health OK ($CODE)"
  SERVER_UP=1
else
  echo "⚠️  Health $CODE — server not running at $BASE_URL? (run: pnpm dev)"
  SERVER_UP=0
fi
echo ""

# 4. Páginas básicas (quando server disponível)
if [ "${SERVER_UP:-0}" = "1" ]; then
  echo "🔍 Basic pages..."
  for url in "/" "/protocolos" "/produtos" "/faq"; do
    C=$(curl -s -o /dev/null -w "%{http_code}" "$BASE_URL$url" 2>/dev/null || echo "000")
    if [ "$C" = "200" ]; then
      echo "  ✅ $url $C"
    else
      echo "  ⚠️  $url $C"
    fi
  done
  echo ""

  # 5. Store V2 pages (quando STORE_V2=1)
  if [ "${NEXT_PUBLIC_STORE_V2:-0}" = "1" ] || [ "${STORE_V2:-0}" = "1" ]; then
    echo "🔍 Store V2 pages..."
    for url in "/c/sono" "/c/emagrecimento-metabolismo" "/p/5-htp-50-mg"; do
      C=$(curl -s -o /dev/null -w "%{http_code}" "$BASE_URL$url" 2>/dev/null || echo "000")
      if [ "$C" = "200" ]; then
        echo "  ✅ $url $C"
      else
        echo "  ⚠️  $url $C (may 404 before catalog import)"
      fi
    done
    echo ""
  fi
fi

# 6. Import CSV (quando DATABASE_URL disponível)
echo "🔍 Import CSV validation..."
if [ -n "${DATABASE_URL:-}" ]; then
  if pnpm run smoke:import 2>/dev/null; then
    echo "✅ Import OK (>=200 produtos, slugs únicos)"
  else
    echo "⚠️  Import failed or DB not ready — run: pnpm smoke:import"
  fi
else
  echo "  (SKIP: DATABASE_URL not set — run pnpm smoke:import manually)"
fi
echo ""

if [ $FAILED -eq 1 ]; then
  echo "❌ Smoke Store V2 FAILED"
  exit 1
fi

echo "🎉 Smoke Store V2 Complete!"
exit 0
