#!/usr/bin/env bash
# Importa catálogo na produção via API
# Usa ADMIN_SECRET_KEY (de .env.local ou export)
set -euo pipefail
cd "$(dirname "$0")/.."
[ -f .env.local ] && set -a && source .env.local 2>/dev/null && set +a
KEY="${ADMIN_SECRET_KEY:-}"
if [ -z "$KEY" ]; then
  echo "Configure: export ADMIN_SECRET_KEY=\"valor_da_Vercel\""
  echo "Ou adicione ADMIN_SECRET_KEY no .env.local (mesmo valor da Vercel)"
  exit 1
fi
echo "→ Importando catálogo em https://www.mejoy.com.br ..."
RES=$(curl -s -X POST "https://www.mejoy.com.br/api/admin/catalog/import" \
  -H "Authorization: Bearer $KEY" \
  -H "Content-Type: application/json" \
  -d '{}')
echo "$RES"
if echo "$RES" | grep -q '"ok":true'; then
  echo "✅ Catálogo importado"
else
  echo "⚠️ Verifique se ADMIN_SECRET_KEY bate com a Vercel"
fi
