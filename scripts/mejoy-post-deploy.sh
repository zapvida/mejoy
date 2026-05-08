#!/usr/bin/env bash
# Pós-deploy contra produção MeJoy — requer rede; BASE_URL pode ser preview.
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

export BASE_URL="${BASE_URL:-https://www.mejoy.com.br}"
export PRODUCTION_URL="${PRODUCTION_URL:-https://www.mejoy.com.br}"

echo "== MeJoy post-deploy (BASE_URL=$BASE_URL) =="
pnpm qa:emagrecimento:prod
pnpm smoke:checkout
BASE_URL="$BASE_URL" pnpm soft-launch:gate
BASE_URL="$BASE_URL" pnpm official-launch:gate
BASE_URL="$BASE_URL" pnpm tracking:launch:gate
echo "== MeJoy post-deploy: OK =="
echo "Opcional (E2E contra PRODUCTION_URL, pode ser flaky): CI=1 PRODUCTION_URL=$PRODUCTION_URL pnpm test:emagrecimento"
