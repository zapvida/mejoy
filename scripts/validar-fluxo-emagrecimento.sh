#!/bin/bash

# Script de validação do fluxo de emagrecimento
# Verifica se todas as envs necessárias estão configuradas

echo "🔍 Validando configuração do fluxo de emagrecimento..."
echo ""

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

ERRORS=0
WARNINGS=0

# Função para verificar env
check_env() {
    local name=$1
    local required=$2
    
    if [ -z "${!name}" ]; then
        if [ "$required" = "required" ]; then
            echo -e "${RED}❌ $name${NC} - FALTANDO (OBRIGATÓRIA)"
            ERRORS=$((ERRORS + 1))
        else
            echo -e "${YELLOW}⚠️  $name${NC} - Não configurada (opcional)"
            WARNINGS=$((WARNINGS + 1))
        fi
    else
        # Mascarar valores sensíveis
        local value="${!name}"
        if [[ "$name" == *"KEY"* ]] || [[ "$name" == *"SECRET"* ]]; then
            local masked="${value:0:10}...${value: -4}"
            echo -e "${GREEN}✅ $name${NC} - Configurada ($masked)"
        else
            echo -e "${GREEN}✅ $name${NC} - Configurada"
        fi
    fi
}

echo "📋 Variáveis Obrigatórias:"
echo ""

# Obrigatórias
check_env "OPENAI_API_KEY" "required"
check_env "STRIPE_SECRET_KEY" "required"
check_env "STRIPE_PRICE_ZAPFARM_MENSAL" "required"
check_env "STRIPE_PRICE_ZAPFARM_TRIMESTRAL" "required"
check_env "STRIPE_PRICE_ZAPFARM_SEMESTRAL" "required"

echo ""
echo "📋 Variáveis Opcionais:"
echo ""

# Opcionais
check_env "AI_REPORT_ENABLED" "optional"
check_env "NEXT_PUBLIC_SUPABASE_URL" "optional"
check_env "SUPABASE_SERVICE_ROLE_KEY" "optional"

echo ""
echo "📊 Resumo:"

if [ $ERRORS -eq 0 ]; then
    echo -e "${GREEN}✅ Todas as variáveis obrigatórias estão configuradas!${NC}"
    if [ $WARNINGS -gt 0 ]; then
        echo -e "${YELLOW}⚠️  $WARNINGS variável(is) opcional(is) não configurada(s)${NC}"
        echo ""
        echo "Nota: O sistema funciona sem Supabase em desenvolvimento, mas é necessário em produção."
    fi
    echo ""
    echo "🚀 Você pode rodar o fluxo de emagrecimento!"
    echo ""
    echo "Para testar:"
    echo "  1. LPAC: http://localhost:3000/emagrecimento"
    echo "  2. Triagem: http://localhost:3000/triagem/emagrecimento"
    echo "  3. Checkout: Aparecerá após completar a triagem"
    exit 0
else
    echo -e "${RED}❌ $ERRORS variável(is) obrigatória(s) faltando${NC}"
    if [ $WARNINGS -gt 0 ]; then
        echo -e "${YELLOW}⚠️  $WARNINGS variável(is) opcional(is) não configurada(s)${NC}"
    fi
    echo ""
    echo "Por favor, configure as variáveis faltantes no arquivo .env.local"
    echo "Consulte ENVS_FLUXO_EMAGRECIMENTO.md para mais detalhes"
    exit 1
fi

