#!/usr/bin/env bash
# Deploy Store V2 — Padrão Ouro
# Conecta ao monjoy-mejoy/zapfarm e faz deploy com código local.
#
# PRÉ-REQUISITO: Logado na Vercel com conta que tenha acesso ao time monjoy-mejoy
#   vercel login    (use conta com acesso a monjoy-mejoy)
#
set -euo pipefail

cd "$(dirname "$0")/.."
PROJECT="zapfarm"
SCOPE="monjoy-mejoy"
PRODUCTION_URL="https://www.mejoy.com.br"

echo "== Deploy Store V2 → $PRODUCTION_URL =="
echo ""

# 1. Link para o projeto correto
if [ ! -d .vercel ] || ! grep -q '"projectName":"zapfarm"' .vercel/project.json 2>/dev/null; then
  echo "→ Relinkando ao projeto $SCOPE/$PROJECT..."
  rm -rf .vercel 2>/dev/null || true
  if vercel link --yes --project "$PROJECT" --scope "$SCOPE" 2>/dev/null; then
    echo "   Link OK"
  else
    echo ""
    echo "❌ Não foi possível linkar ao $SCOPE/$PROJECT."
    echo "   Verifique se está logado com conta que tem acesso ao time monjoy-mejoy:"
    echo "   vercel login"
    echo "   vercel teams switch monjoy-mejoy   # se disponível"
    echo ""
    exit 1
  fi
fi

# 2. Deploy
echo "→ Deploy em produção..."
vercel --prod --yes

echo ""
echo "✅ Deploy concluído!"
echo ""
echo "Próximos passos:"
echo "1. Validar: BASE_URL=$PRODUCTION_URL bash scripts/validate-store-v2-production.sh"
echo "2. Importar catálogo: curl -X POST \"$PRODUCTION_URL/api/admin/catalog/import\" \\"
echo "     -H \"Authorization: Bearer \$ADMIN_SECRET_KEY\" -H \"Content-Type: application/json\" -d '{}'"
echo ""
