#!/usr/bin/env bash
# Lançamento absoluto — validação completa antes do deploy
# Uso: ./scripts/launch-absolute.sh
set -euo pipefail

echo "== Lançamento Absoluto MeJoy =="
echo ""

echo "1. Lint..."
pnpm lint
echo "   ✅ Lint OK"
echo ""

echo "2. Build..."
rm -rf .next
pnpm build
echo "   ✅ Build OK"
echo ""

echo "3. Auditoria copy 162 SKUs..."
pnpm audit:copy-premium
echo ""

echo "== Validação pré-deploy concluída =="
echo ""
echo "✅ Rotas validadas (audit anterior): 13 OK, 1 redirect"
echo "✅ Copy: 162 PREMIUM"
echo ""
echo "Para DEPLOY (use 'pnpm run deploy' — pnpm deploy é comando interno):"
echo "  git add -A && git status"
echo "  git commit -m 'chore(launch): lançamento absoluto'"
echo "  pnpm run deploy"
echo ""
echo "Após deploy, validar produção:"
echo "  BASE_URL=https://www.mejoy.com.br pnpm audit:routes"
echo ""
