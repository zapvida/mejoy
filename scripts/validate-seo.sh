#!/usr/bin/env bash
# Valida SEO do PDP Store V2: schema Product, canonical, meta, og tags
# Uso: BASE_URL=https://www.mejoy.com.br bash scripts/validate-seo.sh
# Usa slug dinâmico do catálogo quando disponível.

set -euo pipefail

BASE_URL="${BASE_URL:-https://www.mejoy.com.br}"
FAILED=0

echo "== Validação SEO PDP Store V2 =="
echo "URL: $BASE_URL"
echo "Timestamp: $(date)"
echo ""

# Obter slug de um produto ativo
SLUG=""
SLUG_RESP=$(curl -s --connect-timeout 5 --max-time 10 "$BASE_URL/api/store-v2/catalog/sample-slug" 2>/dev/null) || true
if [ -n "$SLUG_RESP" ]; then
  SLUG=$(echo "$SLUG_RESP" | grep -o '"slug":"[^"]*"' 2>/dev/null | cut -d'"' -f4) || SLUG=""
fi
if [ -z "$SLUG" ]; then
  echo "⚠️  Sem slug no catálogo — usando fallback 'melatonina-sono'"
  SLUG="melatonina-sono"
fi

PDP_URL="$BASE_URL/p/$SLUG"
echo "📄 PDP: $PDP_URL"
echo ""

HTML=$(curl -s -L --connect-timeout 5 --max-time 15 "$PDP_URL" 2>/dev/null) || HTML=""

if [ -z "$HTML" ]; then
  echo "❌ Falha ao buscar HTML do PDP"
  exit 1
fi

# 1. Schema.org Product
echo "🔍 Schema Product..."
if echo "$HTML" | grep -q '"@type":"Product"' || echo "$HTML" | grep -q '"@type": "Product"'; then
  echo "✅ Schema Product presente"
else
  echo "❌ Schema Product ausente"
  FAILED=1
fi
echo ""

# 2. Canonical
echo "🔍 Canonical..."
if echo "$HTML" | grep -q 'rel="canonical"' && echo "$HTML" | grep -q "mejoy.com.br"; then
  echo "✅ Canonical presente"
else
  echo "❌ Canonical ausente ou inválido"
  FAILED=1
fi
echo ""

# 3. Meta description
echo "🔍 Meta description..."
if echo "$HTML" | grep -q '<meta name="description" content="[^"]' || echo "$HTML" | grep -q '<meta name="description" content="'; then
  echo "✅ Meta description presente"
else
  echo "❌ Meta description ausente"
  FAILED=1
fi
echo ""

# 4. OG tags
echo "🔍 Open Graph..."
OG_TITLE=$(echo "$HTML" | grep -o 'og:title"[^>]*content="[^"]*"' 2>/dev/null | head -1)
OG_DESC=$(echo "$HTML" | grep -o 'og:description"[^>]*content="[^"]*"' 2>/dev/null | head -1)
OG_IMAGE=$(echo "$HTML" | grep -o 'og:image"[^>]*content="[^"]*"' 2>/dev/null | head -1)
if [ -n "$OG_TITLE" ] && [ -n "$OG_DESC" ]; then
  echo "✅ OG title e description presentes"
else
  echo "❌ OG tags ausentes (title ou description)"
  FAILED=1
fi
if [ -n "$OG_IMAGE" ]; then
  echo "✅ OG image presente"
else
  echo "⚠️  OG image ausente (usa fallback)"
fi
echo ""

# 5. JSON-LD application/ld+json
echo "🔍 JSON-LD..."
if echo "$HTML" | grep -q 'application/ld+json'; then
  echo "✅ JSON-LD presente"
else
  echo "❌ JSON-LD ausente"
  FAILED=1
fi
echo ""

if [ $FAILED -eq 1 ]; then
  echo "❌ Validação SEO FALHOU"
  exit 1
fi

echo "🎉 Validação SEO concluída!"
