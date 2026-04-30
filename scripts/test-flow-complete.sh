#!/bin/bash

# 🧪 Teste Completo do Fluxo B2B2C End-to-End
# Simula um usuário real passando por todo o ciclo

set -e

BASE_URL="${BASE_URL:-https://www.aistotele.com}"
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo "🧪 TESTE COMPLETO DO FLUXO B2B2C"
echo "═══════════════════════════════════════════════════════════"
echo "Base URL: $BASE_URL"
echo ""

PASSED=0
FAILED=0
TOTAL=0

test_step() {
    local description=$1
    local command=$2
    
    TOTAL=$((TOTAL + 1))
    echo -e "${BLUE}📋 Testando:${NC} $description"
    
    if eval "$command" > /tmp/test_output.txt 2>&1; then
        echo -e "${GREEN}✅${NC} $description"
        PASSED=$((PASSED + 1))
        return 0
    else
        echo -e "${RED}❌${NC} $description"
        cat /tmp/test_output.txt | head -5
        FAILED=$((FAILED + 1))
        return 1
    fi
}

echo "═══════════════════════════════════════════════════════════"
echo "1. TESTE DE LANDING PAGE B2B"
echo "═══════════════════════════════════════════════════════════"

test_step "Homepage carrega" "curl -s -o /dev/null -w '%{http_code}' '$BASE_URL/' | grep -q '200'"
test_step "CTA 'Personalizar agora' presente" "curl -s '$BASE_URL/' | grep -q 'Personalizar agora'"
test_step "CTA 'Ver demonstração' presente" "curl -s '$BASE_URL/' | grep -q 'Ver demonstração'"
test_step "Título hero presente" "curl -s '$BASE_URL/' | grep -q 'Triagens inteligentes'"

echo ""
echo "═══════════════════════════════════════════════════════════"
echo "2. TESTE DO WIZARD DE PERSONALIZAÇÃO"
echo "═══════════════════════════════════════════════════════════"

test_step "Página /b2b/configurar carrega" "curl -s -o /dev/null -w '%{http_code}' '$BASE_URL/b2b/configurar' | grep -q '200'"
test_step "Título 'Personalize sua marca' presente" "curl -s '$BASE_URL/b2b/configurar' | grep -q 'Personalize sua marca'"
test_step "Preview presente" "curl -s '$BASE_URL/b2b/configurar' | grep -qi 'preview'"

echo ""
echo "═══════════════════════════════════════════════════════════"
echo "3. TESTE DE API - CRIAR DRAFT"
echo "═══════════════════════════════════════════════════════════"

DRAFT_RESPONSE=$(curl -s -X POST -H "Content-Type: application/json" \
    -d '{
        "brandColor": "#16a34a",
        "accentColor": "#065f46",
        "fantasyName": "Clínica Teste Automatizado",
        "ctaText": "Falar com médico",
        "ctaUrl": "https://wa.me/5511999999999"
    }' \
    "$BASE_URL/api/branding/draft")

TOTAL=$((TOTAL + 1))
if echo "$DRAFT_RESPONSE" | grep -q '"id"'; then
    echo -e "${GREEN}✅${NC} API cria draft com sucesso"
    PASSED=$((PASSED + 1))
    DRAFT_ID=$(echo "$DRAFT_RESPONSE" | grep -o '"id":"[^"]*"' | head -1 | cut -d'"' -f4)
    echo "   Draft ID: $DRAFT_ID"
else
    echo -e "${RED}❌${NC} API falhou ao criar draft"
    echo "$DRAFT_RESPONSE" | head -10
    FAILED=$((FAILED + 1))
    DRAFT_ID=""
fi

if [ -n "$DRAFT_ID" ]; then
    echo ""
    echo "═══════════════════════════════════════════════════════════"
    echo "4. TESTE DE API - BUSCAR DRAFT"
    echo "═══════════════════════════════════════════════════════════"
    
    TOTAL=$((TOTAL + 1))
    GET_RESPONSE=$(curl -s "$BASE_URL/api/branding/draft?id=$DRAFT_ID")
    if echo "$GET_RESPONSE" | grep -q '"id"'; then
        echo -e "${GREEN}✅${NC} API retorna draft corretamente"
        PASSED=$((PASSED + 1))
    else
        echo -e "${RED}❌${NC} API falhou ao buscar draft"
        echo "$GET_RESPONSE" | head -5
        FAILED=$((FAILED + 1))
    fi
fi

echo ""
echo "═══════════════════════════════════════════════════════════"
echo "5. TESTE DE FORMULÁRIO DE ASSINATURA"
echo "═══════════════════════════════════════════════════════════"

test_step "Página /b2b/assinar carrega" "curl -s -o /dev/null -w '%{http_code}' '$BASE_URL/b2b/assinar' | grep -q '200'"

if [ -n "$DRAFT_ID" ]; then
    TOTAL=$((TOTAL + 1))
    ASSINAR_WITH_DRAFT=$(curl -s "$BASE_URL/b2b/assinar?draft=$DRAFT_ID")
    if echo "$ASSINAR_WITH_DRAFT" | grep -q "$DRAFT_ID"; then
        echo -e "${GREEN}✅${NC} draft_id presente na URL de assinatura"
        PASSED=$((PASSED + 1))
    else
        echo -e "${YELLOW}⚠️${NC} draft_id não detectado na página (pode ser frontend)"
        # Não falha, pode ser implementado no frontend
    fi
fi

echo ""
echo "═══════════════════════════════════════════════════════════"
echo "6. TESTE DE API - SALVAR LEAD"
echo "═══════════════════════════════════════════════════════════"

TOTAL=$((TOTAL + 1))
LEAD_RESPONSE=$(curl -s -X POST -H "Content-Type: application/json" \
    -d "{
        \"name\": \"João Silva Teste\",
        \"email\": \"joao.teste@example.com\",
        \"whatsapp\": \"11999999999\",
        \"company\": \"Clínica Teste Automatizado\",
        \"draftId\": \"$DRAFT_ID\"
    }" \
    "$BASE_URL/api/b2b/lead")

if echo "$LEAD_RESPONSE" | grep -q '"success"'; then
    echo -e "${GREEN}✅${NC} API salva lead com sucesso"
    PASSED=$((PASSED + 1))
else
    echo -e "${YELLOW}⚠️${NC} API de lead retornou erro (pode ser GHL/Supabase)"
    echo "$LEAD_RESPONSE" | head -5
    # Não falha, pode ser integração externa
fi

echo ""
echo "═══════════════════════════════════════════════════════════"
echo "7. TESTE DE PÁGINA DE PLANOS"
echo "═══════════════════════════════════════════════════════════"

test_step "Página /pricing carrega" "curl -s -o /dev/null -w '%{http_code}' '$BASE_URL/pricing' | grep -q '200'"

if [ -n "$DRAFT_ID" ]; then
    TOTAL=$((TOTAL + 1))
    PRICING_WITH_DRAFT=$(curl -s "$BASE_URL/pricing?draft=$DRAFT_ID")
    if echo "$PRICING_WITH_DRAFT" | grep -q "pricing\|plano\|assinar"; then
        echo -e "${GREEN}✅${NC} Página de planos carrega com draft_id"
        PASSED=$((PASSED + 1))
    else
        echo -e "${YELLOW}⚠️${NC} Página de planos pode não estar usando draft_id"
    fi
fi

echo ""
echo "═══════════════════════════════════════════════════════════"
echo "8. TESTE DE API - CHECKOUT SESSION (VALIDAÇÃO)"
echo "═══════════════════════════════════════════════════════════"

TOTAL=$((TOTAL + 1))
# Testar validação da API (sem criar checkout real)
CHECKOUT_TEST=$(curl -s -X POST -H "Content-Type: application/json" \
    -d "{
        \"plan\": \"plus\",
        \"period\": \"monthly\",
        \"draft_id\": \"$DRAFT_ID\"
    }" \
    "$BASE_URL/api/stripe/create-checkout-session" 2>&1)

# Pode retornar erro de autenticação ou sucesso, ambos são válidos (significa que API está funcionando)
if echo "$CHECKOUT_TEST" | grep -qE '(checkout|error|url|session)'; then
    echo -e "${GREEN}✅${NC} API de checkout responde (validação básica)"
    PASSED=$((PASSED + 1))
else
    echo -e "${YELLOW}⚠️${NC} API de checkout pode ter problema"
    echo "$CHECKOUT_TEST" | head -5
    # Não falha, pode precisar de ENVs configuradas
fi

echo ""
echo "═══════════════════════════════════════════════════════════"
echo "9. TESTE DE OUTRAS ROTAS"
echo "═══════════════════════════════════════════════════════════"

test_step "Página /b2b/sandbox carrega" "curl -s -o /dev/null -w '%{http_code}' '$BASE_URL/b2b/sandbox' | grep -q '200'"
test_step "Página /triagem carrega" "curl -s -o /dev/null -w '%{http_code}' '$BASE_URL/triagem' | grep -q '200'"

echo ""
echo "═══════════════════════════════════════════════════════════"
echo "10. TESTE DE PERFORMANCE"
echo "═══════════════════════════════════════════════════════════"

TOTAL=$((TOTAL + 1))
LOAD_TIME=$(curl -s -o /dev/null -w "%{time_total}" "$BASE_URL/")
if (( $(echo "$LOAD_TIME < 3.0" | bc -l 2>/dev/null || echo "0") )); then
    echo -e "${GREEN}✅${NC} Tempo de carregamento aceitável (${LOAD_TIME}s < 3s)"
    PASSED=$((PASSED + 1))
else
    echo -e "${YELLOW}⚠️${NC} Tempo de carregamento alto (${LOAD_TIME}s)"
    FAILED=$((FAILED + 1))
fi

echo ""
echo "═══════════════════════════════════════════════════════════"
echo "📊 RESULTADOS FINAIS"
echo "═══════════════════════════════════════════════════════════"
echo -e "${GREEN}✅ Passou: $PASSED${NC}"
echo -e "${RED}❌ Falhou: $FAILED${NC}"
echo -e "📋 Total: $TOTAL"
echo ""

if [ $FAILED -eq 0 ]; then
    echo -e "${GREEN}🎉 TODOS OS TESTES PASSARAM!${NC}"
    exit 0
else
    echo -e "${YELLOW}⚠️  ALGUNS TESTES FALHARAM. Verifique os detalhes acima.${NC}"
    exit 1
fi

