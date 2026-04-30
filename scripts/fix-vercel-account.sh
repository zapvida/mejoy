#!/usr/bin/env bash
# Script para garantir que o Vercel está usando a conta correta
# Este script valida e corrige a conta do Vercel

set -euo pipefail

# Cores
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Conta esperada (a que tem acesso ao GitHub)
EXPECTED_VERCEL_ACCOUNT="aistoteleapp-art"
# Team esperado
EXPECTED_TEAM="aistotele-projects"
EXPECTED_ORG_ID="team_iLgcoSdlWT4PyqOMtgGwSdIN"

echo -e "${BLUE}🔧 CORREÇÃO DE CONTA VERCEL${NC}"
echo "=================================="
echo ""

# Verificar conta atual
CURRENT_ACCOUNT=$(vercel whoami 2>/dev/null || echo "")

if [ -z "$CURRENT_ACCOUNT" ]; then
    echo -e "${RED}❌ Não está logado no Vercel${NC}"
    echo ""
    echo -e "${YELLOW}💡 Execute:${NC}"
    echo "   vercel login"
    echo ""
    exit 1
fi

echo -e "${BLUE}Conta atual: ${CURRENT_ACCOUNT}${NC}"
echo ""

# Verificar se está na conta correta
if [ "$CURRENT_ACCOUNT" != "$EXPECTED_VERCEL_ACCOUNT" ]; then
    echo -e "${YELLOW}⚠️  Conta atual (${CURRENT_ACCOUNT}) não é a esperada (${EXPECTED_VERCEL_ACCOUNT})${NC}"
    echo ""
    echo -e "${YELLOW}💡 OPÇÕES:${NC}"
    echo ""
    echo "1. Fazer logout e login com a conta correta:"
    echo "   vercel logout"
    echo "   vercel login"
    echo "   # Depois linkar: vercel link"
    echo ""
    echo "2. Ou usar integração Git (RECOMENDADO):"
    echo "   - Deploys automáticos via GitHub"
    echo "   - Não precisa usar CLI para deploy"
    echo "   - Apenas fazer push para main"
    echo ""
    
    read -p "Deseja fazer logout agora? (s/N): " -n 1 -r
    echo ""
    if [[ $REPLY =~ ^[Ss]$ ]]; then
        echo -e "${BLUE}Fazendo logout...${NC}"
        vercel logout
        echo ""
        echo -e "${GREEN}✅ Logout realizado${NC}"
        echo ""
        echo -e "${YELLOW}Próximo passo:${NC}"
        echo "   vercel login"
        echo "   # Use a conta: ${EXPECTED_VERCEL_ACCOUNT}"
        echo ""
    else
        echo -e "${YELLOW}⚠️  Mantendo conta atual.${NC}"
        echo -e "${YELLOW}   Recomendação: Use deploys via GitHub (push para main)${NC}"
    fi
else
    echo -e "${GREEN}✅ Conta correta: ${CURRENT_ACCOUNT}${NC}"
fi

# Verificar projeto linkado
echo ""
echo -e "${BLUE}Verificando projeto linkado...${NC}"
if [ -f ".vercel/project.json" ]; then
    ORG_ID=$(cat .vercel/project.json | grep -o '"orgId":"[^"]*"' | cut -d'"' -f4 || echo "")
    PROJECT_NAME=$(cat .vercel/project.json | grep -o '"projectName":"[^"]*"' | cut -d'"' -f4 || echo "")
    
    if [ "$ORG_ID" = "$EXPECTED_ORG_ID" ] && [ "$PROJECT_NAME" = "aistotele" ]; then
        echo -e "${GREEN}✅ Projeto linkado corretamente: ${PROJECT_NAME}${NC}"
    else
        echo -e "${YELLOW}⚠️  Projeto pode não estar linkado corretamente${NC}"
        echo -e "${YELLOW}   Execute: vercel link${NC}"
    fi
else
    echo -e "${YELLOW}⚠️  Projeto não está linkado${NC}"
    echo -e "${YELLOW}   Execute: vercel link${NC}"
fi

echo ""
echo "=================================="
echo -e "${GREEN}✅ Verificação concluída${NC}"

