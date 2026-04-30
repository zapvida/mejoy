#!/usr/bin/env bash
# Deploy: add + commit + push → Git integrado na Vercel (time zapvida).
# O autor do commit deve ser um membro do time Vercel / conta GitHub ligada ao projeto.
# Uso: pnpm run deploy   ou   pnpm run deploy -- "sua mensagem de commit"
set -euo pipefail

git config user.email "allzapvida@gmail.com"
git config user.name "zapvida"

MSG="${1:-chore: deploy}"

echo "→ Add + commit..."
git add -A
if git diff --staged --quiet 2>/dev/null; then
  echo "   Nada para commitar (working tree limpo)"
else
  git commit -m "$MSG"
  echo "   Commit feito: $MSG"
fi

echo "→ Push main..."
git push origin main

echo ""
echo "✅ Push enviado — build na Vercel (projeto mejoy, time zapvida)"
echo "   Repo: https://github.com/zapvida/mejoy/actions"
echo "   Deployments: https://vercel.com/zap-12b300bd/mejoy/deployments"
echo ""
