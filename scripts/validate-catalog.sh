#!/usr/bin/env bash
# Valida catálogo MEJOY pós-apply: HTTP em amostra de slugs, health, checkout smoke.
# Uso: BASE_URL=http://localhost:3000 ./scripts/validate-catalog.sh
# Produção: BASE_URL=https://www.mejoy.com.br ./scripts/validate-catalog.sh

set -euo pipefail

BASE_URL="${BASE_URL:-http://localhost:3000}"
REPORT_JSON="scripts/generated/catalog-report.json"
FAILED=0
curl_check() { curl -s -o /dev/null -w "%{http_code}" --connect-timeout 5 --max-time 10 "$@"; }

echo "== Validação Catálogo MEJOY =="
echo "URL: $BASE_URL"
echo "Timestamp: $(date)"
echo ""

# 0. Quality Gate local (conteúdo do CSV validado)
PRICING_CSV="data/store-v2/pricing-content-v3-validado.csv"
if [ -f "$PRICING_CSV" ]; then
  echo "🔍 Quality Gate (conteúdo CSV)..."
  BAD=0
  if grep -q "5-Htp" "$PRICING_CSV" 2>/dev/null; then
    echo "  ❌ CSV contém '5-Htp' (deve ser '5-HTP')"
    BAD=1
  fi
  if grep -qE "para apoia[^r]|para apoia\s" "$PRICING_CSV" 2>/dev/null; then
    echo "  ❌ CSV contém 'para apoia' (deve ser 'para apoiar')"
    BAD=1
  fi
  if grep -qE "MáLico|MagnéSio" "$PRICING_CSV" 2>/dev/null; then
    echo "  ❌ CSV contém 'MáLico' ou 'MagnéSio'"
    BAD=1
  fi
  if grep -qiE "cura|trata|garante|100%|reverte|resultado em|sem efeitos colaterais" "$PRICING_CSV" 2>/dev/null; then
    echo "  ❌ CSV contém termos proibidos (cura/trata/garante/100%/reverte/resultado em/sem efeitos colaterais)"
    BAD=1
  fi
  if [ "$BAD" -eq 1 ]; then
    echo "❌ Quality Gate FALHOU — rode pnpm catalog:pricing:validated"
    exit 1
  fi
  echo "  ✅ Quality Gate OK"
fi
echo ""

# 1. Report existe
if [ ! -f "$REPORT_JSON" ]; then
  echo "⚠️  Rodar antes: pnpm catalog:dry"
  echo "   (gera $REPORT_JSON)"
  exit 1
fi

# 2. Health
echo "🔍 Health..."
CODE=$(curl_check "$BASE_URL/api/health" 2>/dev/null || echo "000")
if [ "$CODE" = "200" ]; then
  echo "✅ Health OK ($CODE)"
else
  echo "❌ Health $CODE — server em $BASE_URL?"
  FAILED=1
fi
echo ""

# 2b. Home
echo "🔍 Home (/)..."
CODE=$(curl_check "$BASE_URL/" 2>/dev/null || echo "000")
if [ "$CODE" = "200" ]; then
  echo "✅ Home OK ($CODE)"
else
  echo "❌ Home $CODE"
  FAILED=1
fi
echo ""

# 2c. Categoria existente (sono ou imunidade)
echo "🔍 Categoria existente (/c/sono)..."
CODE=$(curl_check "$BASE_URL/c/sono" 2>/dev/null || echo "000")
if [ "$CODE" = "200" ]; then
  echo "✅ /c/sono OK ($CODE)"
else
  echo "❌ /c/sono $CODE"
  FAILED=1
fi
echo ""

# 3. Amostra de 20 slugs (PDP)
echo "🔍 PDP (amostra 20 slugs)..."
SLUGS=$(jq -r '.slugs[:20][] | .slug' "$REPORT_JSON" 2>/dev/null || true)
if [ -z "$SLUGS" ]; then
  echo "⚠️  Sem slugs no report (jq instalado?)"
else
  OK=0
  for slug in $SLUGS; do
    CODE=$(curl_check -L "$BASE_URL/p/$slug" 2>/dev/null || echo "000")
    if [ "$CODE" = "200" ]; then
      OK=$((OK + 1))
    else
      echo "  ❌ /p/$slug $CODE"
    fi
  done
  echo "  ✅ $OK/20 PDPs OK"
  if [ "$OK" -lt 15 ]; then
    FAILED=1
  fi
fi
echo ""

# 4. Categorias novas (hard fail)
echo "🔍 Categorias (menopausa-tpm, lipedema)..."
for cat in menopausa-tpm lipedema; do
  CODE=$(curl_check "$BASE_URL/c/$cat" 2>/dev/null || echo "000")
  if [ "$CODE" = "200" ]; then
    echo "  ✅ /c/$cat OK"
  else
    echo "  ❌ /c/$cat $CODE"
    FAILED=1
  fi
done
echo ""

# 5. Sample slug API
echo "🔍 API sample-slug..."
SLUG_RESP=$(curl -s --connect-timeout 5 --max-time 10 "$BASE_URL/api/store-v2/catalog/sample-slug" 2>/dev/null) || true
if echo "$SLUG_RESP" | grep -q '"slug"'; then
  echo "✅ Sample slug OK"
else
  echo "⚠️  Sample slug sem resposta"
fi
echo ""

# 6. Cart API (GET)
echo "🔍 API cart GET..."
CODE=$(curl_check -X GET "$BASE_URL/api/store-v2/cart" 2>/dev/null || echo "000")
if [ "$CODE" = "200" ]; then
  echo "✅ Cart API OK"
else
  echo "⚠️  Cart API $CODE"
fi
echo ""

# DB checks (SQL no runbook — aqui só resumo)
echo "📋 DB checks (executar manualmente no Supabase):"
echo "   SELECT COUNT(*) FROM store_v2_products WHERE sku LIKE 'MEJOY-%' AND status='active' AND active=true;  -- esperado: 162"
echo "   SELECT COUNT(*) FROM store_v2_products WHERE sku LIKE 'MJOY-%' AND status='active' AND active=true;   -- esperado: 0"
echo "   SELECT COUNT(*) FROM store_v2_product_variants v JOIN store_v2_products p ON p.id=v.\"productId\" WHERE p.sku LIKE 'MEJOY-%' AND (v.\"priceCents\"=0 OR v.\"priceCents\"=9900);  -- esperado: 0"
echo ""

if [ $FAILED -eq 1 ]; then
  echo "❌ Validação FALHOU"
  exit 1
fi

echo "🎉 Validação catálogo OK!"
echo "   Compra PIX real: ver docs/CATALOG_RUNBOOK.md"
exit 0
