#!/usr/bin/env bash
# Valida catálogo Store V2: preços, conteúdo, compliance, produção
# Uso: BASE_URL=https://www.mejoy.com.br bash scripts/validate-catalog-pricing-v1.sh
# Ou: bash scripts/validate-catalog-pricing-v1.sh  (valida apenas CSV/arquivos)

set -euo pipefail

BASE_URL="${BASE_URL:-}"
CATALOG_CSV="${CATALOG_CSV:-data/catalogo_master_mejoy_seed_200.csv}"
PRICING_CSV="${PRICING_CSV:-data/store-v2/pricing-content-v1.csv}"
UPDATE_SQL="${UPDATE_SQL:-scripts/generated/store-v2-pricing-content-update.sql}"
FAILED=0

echo "== Validação Catálogo Pricing V1 =="
echo "Timestamp: $(date)"
echo ""

# 1. Validar que catálogo base existe
echo "🔍 Catálogo base..."
if [ ! -f "$CATALOG_CSV" ]; then
  echo "❌ Catálogo não encontrado: $CATALOG_CSV"
  FAILED=1
else
  CATALOG_COUNT=$(tail -n +2 "$CATALOG_CSV" | grep -c . || true)
  echo "✅ Catálogo OK ($CATALOG_COUNT linhas)"
fi
echo ""

# 2. Gerar e validar SQL (fonte única de validação CSV)
echo "🔍 Gerando SQL (valida CSV)..."
if pnpm catalog:pricing:sql 2>/dev/null; then
  echo "✅ CSV/SQL OK"
else
  echo "❌ Falha ao gerar SQL. Verifique: priceCents, Moonjoy, compliance."
  FAILED=1
fi
echo ""

# 3. Estatísticas por formKey (se temos catalogo)
if [ -f "$CATALOG_CSV" ] && [ -f "$PRICING_CSV" ]; then
  echo "🔍 Estatísticas por formKey..."
  # Junta catalogo (form_key) com pricing (priceCents) por sku
  # Simplificado: só mostramos que temos dados
  echo "   (Execute pnpm catalog:pricing:sql para ver min/max/mediana no output)"
fi
echo ""

# 4. Validação em produção (se BASE_URL definido)
if [ -n "$BASE_URL" ]; then
  echo "🔍 Validação em produção ($BASE_URL)..."

  # Slugs conhecidos (formato produção: seo_slug + -1)
  SLUGS="5-htp-50-mg-1 curcuma-450-mg-mjoy-0002-1 minoxidil-turbinado-100-ml-1 morosil-500-mg-1 citrato-de-magnesio-500-mg-1 vitamina-d3-2000-ui-1 silimarina-200-mg-1 berberina-500-mg-mjoy-0013-1 coenzima-q10-100-mg-1 colageno-hidrolisado-1"

  # Tentar API sample-slug como primeiro
  SAMPLE_SLUG=""
  SAMPLE_RESP=$(curl -s --connect-timeout 5 --max-time 10 "$BASE_URL/api/store-v2/catalog/sample-slug" 2>/dev/null) || true
  if [ -n "$SAMPLE_RESP" ]; then
    SAMPLE_SLUG=$(echo "$SAMPLE_RESP" | grep -o '"slug":"[^"]*"' 2>/dev/null | cut -d'"' -f4) || true
  fi
  [ -n "$SAMPLE_SLUG" ] && SLUGS="$SAMPLE_SLUG $SLUGS"

  PDP_FAIL=0
  PRICE_99_FAIL=0
  MOONJOY_FAIL=0
  CHECKED=0

  for SLUG in $SLUGS; do
    [ -z "$SLUG" ] && continue
    [ $CHECKED -ge 10 ] && break
    CHECKED=$((CHECKED + 1))

    CODE=$(curl -s -o /dev/null -w "%{http_code}" --connect-timeout 5 --max-time 10 "$BASE_URL/p/$SLUG" 2>/dev/null || echo "000")
    if [ "$CODE" != "200" ]; then
      echo "   ⚠️  PDP $SLUG: $CODE"
      PDP_FAIL=$((PDP_FAIL + 1))
    fi

    HTML=$(curl -s -L --connect-timeout 5 --max-time 10 "$BASE_URL/p/$SLUG" 2>/dev/null) || true
    if echo "$HTML" | grep -q "R\$ 99,00"; then
      PRICE_99_FAIL=$((PRICE_99_FAIL + 1))
    fi
    if echo "$HTML" | grep -qi "moonjoy"; then
      echo "   ⚠️  PDP $SLUG: Moonjoy no HTML"
      MOONJOY_FAIL=$((MOONJOY_FAIL + 1))
    fi
  done

  if [ $PDP_FAIL -gt 0 ]; then
    echo "❌ $PDP_FAIL PDP(s) com status != 200"
    FAILED=1
  else
    echo "✅ PDPs retornam 200 ($CHECKED verificados)"
  fi
  if [ $CHECKED -gt 0 ] && [ $PRICE_99_FAIL -eq $CHECKED ]; then
    echo "❌ Todos os $CHECKED PDPs amostrados com R$ 99,00 (aplique o SQL de update)"
    FAILED=1
  elif [ $PRICE_99_FAIL -gt 0 ]; then
    echo "⚠️  $PRICE_99_FAIL de $CHECKED PDPs com R$ 99,00 (pode ser cache ou não aplicado)"
  else
    echo "✅ Preços variados (não R$ 99)"
  fi
  if [ $MOONJOY_FAIL -gt 0 ]; then
    echo "❌ Moonjoy encontrado em $MOONJOY_FAIL PDP(s)"
    FAILED=1
  else
    echo "✅ Sem Moonjoy no HTML"
  fi
else
  echo "⚠️  BASE_URL não definido — pulando validação em produção"
  echo "   Para validar produção: BASE_URL=https://www.mejoy.com.br $0"
fi
echo ""

if [ $FAILED -eq 1 ]; then
  echo "❌ Validação FALHOU"
  exit 1
fi

echo "🎉 Validação concluída!"
