#!/usr/bin/env bash
# Push + Deploy Store V2
# Tenta push para GitHub; se funcionar, Vercel faz deploy automático.
# Ou dispara Deploy Hook se VERCEL_DEPLOY_HOOK estiver configurado.
set -euo pipefail

cd "$(dirname "$0")/.."

git config user.email "zapfarmx@gmail.com"
git config user.name "zapfarmx"

echo "== Commit das alterações =="
git add -A
if git diff --staged --quiet 2>/dev/null; then
  echo "   Nada para commitar"
else
  git commit -m "${1:-chore: Store V2 lançamento}"
  echo "   Commit OK"
fi

echo ""
echo "== Push para GitHub =="
ORIG_URL="https://github.com/zapfarmx/zapfarm.git"
[ -n "${GITHUB_TOKEN:-}" ] && git remote set-url origin "https://${GITHUB_TOKEN}@github.com/zapfarmx/zapfarm.git" && echo "   Usando GITHUB_TOKEN"

if git push origin main 2>/dev/null; then
  git remote set-url origin "$ORIG_URL" 2>/dev/null || true
  echo "   ✅ Push OK — Vercel deve fazer deploy automático"
  echo ""
  echo "   Deployments: https://vercel.com/monjoy-mejoy/zapfarm/deployments"
  exit 0
fi

git remote set-url origin "$ORIG_URL" 2>/dev/null || true
echo "   ❌ Push falhou"

if [ -n "${VERCEL_DEPLOY_HOOK:-}" ]; then
  echo ""
  echo "== Disparando Deploy Hook (redeploy do último commit em main) =="
  if curl -s -X POST "$VERCEL_DEPLOY_HOOK" >/dev/null; then
    echo "   ✅ Hook disparado — verifique os deployments"
    exit 0
  fi
  echo "   ❌ Hook falhou"
fi

echo ""
echo "Próximos passos manuais:"
echo "1. Push: Configure GITHUB_TOKEN (PAT com repo) e rode de novo"
echo "   export GITHUB_TOKEN=ghp_xxxx"
echo "   bash scripts/push-and-deploy.sh"
echo ""
echo "2. Ou: Acesse https://vercel.com/monjoy-mejoy/zapfarm e faça Redeploy manual"
echo ""
exit 1
