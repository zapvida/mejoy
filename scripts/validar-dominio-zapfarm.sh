#!/bin/bash

# Script de validação do domínio zapfarm.com.br
# Verifica se o domínio está mostrando a página B2B correta

echo "🔍 Validando domínio zapfarm.com.br..."
echo ""

# Cores para output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Função para testar URL
test_url() {
    local url=$1
    local expected_text=$2
    local description=$3
    
    echo -n "Testando: $description... "
    
    # Fazer requisição e procurar pelo texto esperado
    response=$(curl -s -L "$url" 2>&1)
    
    if echo "$response" | grep -qi "$expected_text"; then
        echo -e "${GREEN}✅ OK${NC}"
        return 0
    else
        echo -e "${RED}❌ FALHOU${NC}"
        echo "   URL: $url"
        echo "   Esperado: '$expected_text'"
        return 1
    fi
}

# Contador de testes
passed=0
failed=0

# Teste 1: Domínio principal (deve mostrar página B2B)
if test_url "https://zapfarm.com.br" "White-label de Triagens" "zapfarm.com.br → Página B2B"; then
    ((passed++))
else
    ((failed++))
fi

# Teste 2: Domínio com www (deve mostrar página B2B)
if test_url "https://www.zapfarm.com.br" "White-label de Triagens" "www.zapfarm.com.br → Página B2B"; then
    ((passed++))
else
    ((failed++))
fi

# Teste 3: Preview Vercel (deve continuar funcionando)
if test_url "https://zapfarm-git-main-zapfarms-projects.vercel.app" "White-label de Triagens" "Preview Vercel → Página B2B"; then
    ((passed++))
else
    ((failed++))
fi

# Teste 4: Verificar se NÃO mostra página B2C (verificar que não tem texto específico B2C)
echo -n "Verificando que NÃO é página B2C... "
response=$(curl -s -L "https://zapfarm.com.br" 2>&1)
if echo "$response" | grep -qi "Seu check-up de saúde completo"; then
    echo -e "${RED}❌ FALHOU (mostrando página B2C)${NC}"
    ((failed++))
else
    echo -e "${GREEN}✅ OK${NC}"
    ((passed++))
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📊 Resultado:"
echo -e "   ${GREEN}✅ Passou: $passed${NC}"
echo -e "   ${RED}❌ Falhou: $failed${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

if [ $failed -eq 0 ]; then
    echo -e "${GREEN}🎉 Todos os testes passaram!${NC}"
    exit 0
else
    echo -e "${RED}⚠️  Alguns testes falharam. Verifique a configuração.${NC}"
    exit 1
fi

