#!/bin/bash
# Smoke tests completos para produção após deploy
# Uso: ./scripts/smoke-production-final.sh https://aistotele.com

set -e

BASE_URL="${1:-https://aistotele.com}"
echo "🧪 Smoke Tests - Produção: $BASE_URL"
echo "===================================="
echo ""

# Cores para output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Contador de sucessos/falhas
SUCCESS=0
FAIL=0

# Função para testar
test_api() {
  local name="$1"
  local method="$2"
  local url="$3"
  local data="$4"
  local expected_status="$5"
  local expected_field="$6"
  
  echo -n "Testando $name... "
  
  if [ "$method" = "POST" ]; then
    RESPONSE=$(curl -sS -w "\n%{http_code}" -X POST "$url" \
      -H "Content-Type: application/json" \
      -d "$data" 2>&1)
  else
    RESPONSE=$(curl -sS -w "\n%{http_code}" "$url" 2>&1)
  fi
  
  HTTP_CODE=$(echo "$RESPONSE" | tail -n1)
  BODY=$(echo "$RESPONSE" | sed '$d')
  
  if [ "$HTTP_CODE" = "$expected_status" ]; then
    if [ -n "$expected_field" ]; then
      if echo "$BODY" | grep -q "$expected_field"; then
        echo -e "${GREEN}✅ PASSOU${NC} (HTTP $HTTP_CODE)"
        ((SUCCESS++))
        echo "$BODY" | jq '.' 2>/dev/null || echo "$BODY"
        echo ""
        return 0
      else
        echo -e "${RED}❌ FALHOU${NC} - Campo '$expected_field' não encontrado"
        echo "Resposta: $BODY"
        ((FAIL++))
        return 1
      fi
    else
      echo -e "${GREEN}✅ PASSOU${NC} (HTTP $HTTP_CODE)"
      ((SUCCESS++))
      echo "$BODY" | jq '.' 2>/dev/null || echo "$BODY"
      echo ""
      return 0
    fi
  else
    echo -e "${RED}❌ FALHOU${NC} - Esperado HTTP $expected_status, recebido $HTTP_CODE"
    echo "Resposta: $BODY"
    ((FAIL++))
    return 1
  fi
}

# 1. Upload de logo
echo "1️⃣ Upload de Logo"
PIXEL_BASE64="iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR4nGMAAQAABQABDQottQAAAABJRU5ErkJggg=="
LOGO_DATA="{\"base64\":\"data:image/png;base64,$PIXEL_BASE64\"}"
test_api "Upload Logo" "POST" "$BASE_URL/api/branding/upload-logo" "$LOGO_DATA" "200" "url"
echo ""

# 2. Criar draft (201)
echo "2️⃣ Criar Draft (POST - 201)"
DRAFT_CREATE_DATA='{"fantasyName":"Clínica QA","brandColor":"#10b981","accentColor":"#059669","ctaText":"Falar no WhatsApp","ctaUrl":"https://wa.me/5599999999999"}'
test_api "Criar Draft" "POST" "$BASE_URL/api/branding/draft" "$DRAFT_CREATE_DATA" "201" "id"

# Extrair ID do draft criado
DRAFT_ID=$(echo "$BODY" | jq -r '.id // empty' 2>/dev/null)
if [ -z "$DRAFT_ID" ] || [ "$DRAFT_ID" = "null" ]; then
  echo -e "${RED}❌ Não foi possível extrair ID do draft${NC}"
  DRAFT_ID=""
else
  echo -e "${GREEN}✅ Draft ID: $DRAFT_ID${NC}"
fi
echo ""

# 3. Atualizar draft por domínio (200)
echo "3️⃣ Atualizar Draft por Domínio (POST - 200)"
DRAFT_UPDATE_DATA="{\"fantasyName\":\"Clínica QA Atualizada\",\"brandColor\":\"#10b981\",\"accentColor\":\"#059669\",\"desiredDomain\":\"aimed.com.br\",\"ctaText\":\"Falar no WhatsApp\",\"ctaUrl\":\"https://wa.me/5599999999999\"}"
test_api "Atualizar Draft" "POST" "$BASE_URL/api/branding/draft" "$DRAFT_UPDATE_DATA" "200" "id"
echo ""

# 4. Consultar draft (GET)
if [ -n "$DRAFT_ID" ]; then
  echo "4️⃣ Consultar Draft (GET - 200)"
  test_api "Consultar Draft" "GET" "$BASE_URL/api/branding/draft?id=$DRAFT_ID" "" "200" "draft"
  echo ""
else
  echo -e "${YELLOW}⚠️ Pulando teste GET (ID não disponível)${NC}"
  echo ""
fi

# Resumo final
echo "===================================="
echo "📊 RESUMO FINAL"
echo "===================================="
echo -e "${GREEN}✅ Sucessos: $SUCCESS${NC}"
echo -e "${RED}❌ Falhas: $FAIL${NC}"
echo ""

if [ $FAIL -eq 0 ]; then
  echo -e "${GREEN}🎉 TODOS OS TESTES PASSARAM!${NC}"
  echo ""
  echo "Próximos passos:"
  echo "1. Teste o fluxo UI: $BASE_URL/b2b/configurar"
  echo "2. Complete o wizard → sandbox → triagem → relatório → PDF"
  exit 0
else
  echo -e "${RED}⚠️ ALGUNS TESTES FALHARAM${NC}"
  echo ""
  echo "Verifique:"
  echo "1. Variáveis de ambiente no Vercel (Production)"
  echo "2. Bucket 'branding-logos' no Supabase (público)"
  echo "3. Tabela 'BrandingDraft' existe no banco"
  echo "4. Logs do Vercel para erros"
  exit 1
fi

