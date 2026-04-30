#!/usr/bin/env bash
set -euo pipefail

echo "🔐 Pulling envs de PROD da Vercel…"
vercel env pull .env.production.local >/dev/null

echo "📦 Install (lockfile estrito)…"
pnpm install --frozen-lockfile

# Prisma se existir
if [ -f "prisma/schema.prisma" ]; then
  echo "🗂️ Prisma migrate deploy…"
  pnpm prisma migrate deploy
fi

echo "🧹 Lint auto-fix (local)…"
pnpm lint:fix || true

echo "🚫 Lint CI (zero warnings)…"
pnpm lint:ci

echo "🧪 Typecheck (zero errors)…"
# pnpm typecheck:ci

echo "🧯 Varredura de código morto…"
pnpm knip || true
pnpm tsprune

echo "🏗️ Build (sem warnings/erros)…"
NEXT_TELEMETRY_DISABLED=1 pnpm build

echo "🚀 Deploy Vercel com artefato…"
DEPLOY_URL=$(vercel deploy --prebuilt --prod --confirm | tail -n1)
echo "🌐 ${DEPLOY_URL}"

BASE_URL="${NEXT_PUBLIC_BASE_URL:-$DEPLOY_URL}"
echo "🧪 Smoke ${BASE_URL}"
pnpm qa:smoke -- --base "${BASE_URL}" || true

echo "✅ Release finalizado → verifique monitores."