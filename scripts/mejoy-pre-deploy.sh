#!/usr/bin/env bash
# Orquestra validações locais/CI antes do deploy — sem lógica nova, só ordem estável.
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

echo "== MeJoy pre-deploy =="
pnpm lint
pnpm typecheck
pnpm test:handoff
pnpm build
pnpm validate:handoff:bundle
echo "== MeJoy pre-deploy: OK =="
