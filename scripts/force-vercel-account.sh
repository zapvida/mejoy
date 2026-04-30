#!/usr/bin/env bash
# Script para forçar logout e login com a conta correta aistoteleapp-art
# Este script garante que o Vercel CLI esteja alinhado com o Git

set -euo pipefail

# Cores
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

EXPECTED_ACCOUNT="aistoteleapp-art"
EXPECTED_TEAM="aistotele-projects"

echo -e "${BLUE}🔧 FORÇAR CONTA VERCEL - aistoteleapp-art${NC}"
echo "=================================="
echo ""

# Verificar conta atual
CURRENT_ACCOUNT=$(vercel whoami 2>/dev/null || echo "")

if [ -z "$CURRENT_ACCOUNT" ]; then
    echo -e "${YELLOW}⚠️  Não está logado no Vercel${NC}"
    echo ""
    echo -e "${BLUE}Fazendo login...${NC}"
    echo ""
    vercel login
    echo ""
    
    # Verificar se agora está na conta correta
    NEW_ACCOUNT=$(vercel whoami 2>/dev/null || echo "")
    if [ "$NEW_ACCOUNT" != "$EXPECTED_ACCOUNT" ]; then
        echo -e "${RED}❌ Ainda não está na conta correta${NC}"
        echo -e "${YELLOW}   Conta atual: ${NEW_ACCOUNT}${NC}"
        echo -e "${YELLOW}   Conta esperada: ${EXPECTED_ACCOUNT}${NC}"
        echo ""
        echo -e "${YELLOW}💡 Por favor, faça logout e login novamente com a conta: ${EXPECTED_ACCOUNT}${NC}"
        exit 1
    fi
else
    if [ "$CURRENT_ACCOUNT" = "$EXPECTED_ACCOUNT" ]; then
        echo -e "${GREEN}✅ Já está logado com a conta correta: ${CURRENT_ACCOUNT}${NC}"
        echo ""
    else
        echo -e "${YELLOW}⚠️  Conta atual: ${CURRENT_ACCOUNT}${NC}"
        echo -e "${YELLOW}   Conta esperada: ${EXPECTED_ACCOUNT}${NC}"
        echo ""
        echo -e "${BLUE}Fazendo logout...${NC}"
        vercel logout
        echo ""
        echo -e "${BLUE}Agora faça login com a conta: ${EXPECTED_ACCOUNT}${NC}"
        echo ""
        vercel login
        echo ""
        
        # Verificar se agora está na conta correta
        NEW_ACCOUNT=$(vercel whoami 2>/dev/null || echo "")
        if [ "$NEW_ACCOUNT" != "$EXPECTED_ACCOUNT" ]; then
            echo -e "${RED}❌ Ainda não está na conta correta${NC}"
            echo -e "${YELLOW}   Conta atual: ${NEW_ACCOUNT}${NC}"
            echo -e "${YELLOW}   Conta esperada: ${EXPECTED_ACCOUNT}${NC}"
            echo ""
            echo -e "${YELLOW}💡 Por favor, faça logout e login novamente com a conta: ${EXPECTED_ACCOUNT}${NC}"
            exit 1
        fi
    fi
fi

# Verificar se está na conta correta agora
FINAL_ACCOUNT=$(vercel whoami 2>/dev/null || echo "")
if [ "$FINAL_ACCOUNT" = "$EXPECTED_ACCOUNT" ]; then
    echo -e "${GREEN}✅ Conta correta confirmada: ${FINAL_ACCOUNT}${NC}"
    echo ""
    
    # Verificar projeto linkado
    if [ ! -f ".vercel/project.json" ]; then
        echo -e "${YELLOW}⚠️  Projeto não está linkado${NC}"
        echo -e "${BLUE}Linkando projeto...${NC}"
        echo ""
        vercel link
    else
        ORG_ID=$(cat .vercel/project.json | grep -o '"orgId":"[^"]*"' | cut -d'"' -f4 || echo "")
        PROJECT_NAME=$(cat .vercel/project.json | grep -o '"projectName":"[^"]*"' | cut -d'"' -f4 || echo "")
        
        if [ "$PROJECT_NAME" = "aistotele" ]; then
            echo -e "${GREEN}✅ Projeto linkado corretamente: ${PROJECT_NAME}${NC}"
        else
            echo -e "${YELLOW}⚠️  Projeto pode não estar linkado corretamente${NC}"
            echo -e "${BLUE}Linkando projeto...${NC}"
            vercel link
        fi
    fi
    
    echo ""
    echo "=================================="
    echo -e "${GREEN}✅ Tudo alinhado com a conta: ${EXPECTED_ACCOUNT}${NC}"
    echo ""
    echo -e "${GREEN}✅ Git: aistoteleapp-art${NC}"
    echo -e "${GREEN}✅ Vercel: ${FINAL_ACCOUNT}${NC}"
    echo ""
    echo -e "${BLUE}🎯 Tudo pronto! Agora você pode usar:${NC}"
    echo "   - git push origin main (deploy automático)"
    echo "   - vercel deploy (deploy manual)"
    exit 0
else
    echo -e "${RED}❌ Erro: Não foi possível confirmar a conta correta${NC}"
    exit 1
fi

