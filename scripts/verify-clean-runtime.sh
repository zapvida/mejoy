#!/usr/bin/env bash
# verify:clean-runtime — Validação limpa de runtime.
# Remove .next, build, start (produção), smoke.
# Objetivo: provar que o erro vendor-chunks/cache não compromete o lançamento.
#
# Uso: ./scripts/verify-clean-runtime.sh [BASE_URL]
# Ex:  ./scripts/verify-clean-runtime.sh
#      BASE_URL=http://localhost:3000 ./scripts/verify-clean-runtime.sh
#
# Requer: pnpm, DATABASE_URL (para smoke com PDPs)

set -euo pipefail

BASE_URL="${BASE_URL:-http://localhost:3000}"
[ -n "${1:-}" ] && BASE_URL="$1"
PORT="${PORT:-3000}"

echo "=============================================="
echo "  VERIFY CLEAN RUNTIME — Me Joy"
echo "=============================================="
echo "Timestamp: $(date)"
echo "BASE_URL: $BASE_URL"
echo ""

# 1. Clean .next
echo "🧹 1. Removendo .next..."
rm -rf .next
echo "   ✅ .next removido"
echo ""

# 2. Build limpo
echo "🔨 2. Build limpo..."
pnpm run build
echo "   ✅ Build OK"
echo ""

# 3. Liberar porta se ocupada
if lsof -ti:$PORT >/dev/null 2>&1; then
  echo "   Liberando porta $PORT..."
  lsof -ti:$PORT | xargs kill -9 2>/dev/null || true
  sleep 2
fi

# 4. Start em background (produção)
echo "🚀 4. Iniciando servidor (pnpm start)..."
PORT=$PORT pnpm start &
SERVER_PID=$!
echo "   PID: $SERVER_PID"
echo "   Aguardando servidor em http://localhost:$PORT..."
sleep 5

# Poll até health responder
for i in {1..30}; do
  if curl -s -o /dev/null -w "%{http_code}" "http://localhost:$PORT/api/health" 2>/dev/null | grep -q 200; then
    echo "   ✅ Servidor pronto"
    break
  fi
  if [ $i -eq 30 ]; then
    echo "   ❌ Timeout aguardando servidor"
    kill $SERVER_PID 2>/dev/null || true
    exit 1
  fi
  sleep 2
done
echo ""

# 5. Smoke launch
echo "🔍 5. Smoke launch..."
if PDP_LIMIT=4 BASE_URL="$BASE_URL" pnpm tsx scripts/smoke-launch.ts; then
  echo "   ✅ Smoke launch OK"
else
  echo "   ❌ Smoke launch FAILED"
  kill $SERVER_PID 2>/dev/null || true
  exit 1
fi
echo ""

# 6. Validate Akkermat
echo "🔐 6. Validate Akkermat..."
if BASE_URL="$BASE_URL" pnpm tsx scripts/validate-akkermat-regression.ts; then
  echo "   ✅ Akkermat intacto"
else
  echo "   ❌ Akkermat REGRESSÃO"
  kill $SERVER_PID 2>/dev/null || true
  exit 1
fi
echo ""

# 7. Stop server
kill $SERVER_PID 2>/dev/null || true
echo "   Servidor encerrado"
echo ""

echo "=============================================="
echo "  ✅ VERIFY CLEAN RUNTIME — PASSOU"
echo "=============================================="
echo "Risco de runtime/cache: ELIMINADO"
echo ""
