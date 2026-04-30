#!/usr/bin/env bash
# Script para validar e garantir que as contas corretas do Git e Vercel estão configuradas
# Este script deve ser executado antes de qualquer deploy ou push

set -euo pipefail

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configurações esperadas
EXPECTED_GIT_USER="aistoteleapp-art"
EXPECTED_GIT_EMAIL="aistoteleapp-art@users.noreply.github.com"
EXPECTED_GIT_REMOTE="https://github.com/aistoteleapp-art/aistotele.git"
EXPECTED_VERCEL_ORG="team_iLgcoSdlWT4PyqOMtgGwSdIN"
EXPECTED_VERCEL_PROJECT="aistotele"

echo -e "${BLUE}🔍 VALIDAÇÃO DE CONTAS - Aistotele${NC}"
echo "=================================="
echo ""

ERRORS=0
WARNINGS=0

# Função para validar Git
validate_git() {
    echo -e "${BLUE}📦 Verificando configuração Git...${NC}"
    
    # Verificar se estamos no repositório correto
    if [ ! -d ".git" ]; then
        echo -e "${RED}❌ Não é um repositório Git${NC}"
        return 1
    fi
    
    # Ler configurações locais (prioridade sobre globais)
    GIT_USER=$(git config user.name || echo "")
    GIT_EMAIL=$(git config user.email || echo "")
    GIT_REMOTE=$(git config remote.origin.url || echo "")
    
    # Verificar usuário
    if [ "$GIT_USER" != "$EXPECTED_GIT_USER" ]; then
        echo -e "${RED}❌ Git user incorreto: ${GIT_USER}${NC}"
        echo -e "${YELLOW}   Esperado: ${EXPECTED_GIT_USER}${NC}"
        echo -e "${YELLOW}   Corrigindo...${NC}"
        git config user.name "$EXPECTED_GIT_USER"
        git config user.email "$EXPECTED_GIT_EMAIL"
        echo -e "${GREEN}✅ Git user corrigido para: ${EXPECTED_GIT_USER}${NC}"
        WARNINGS=$((WARNINGS + 1))
    else
        echo -e "${GREEN}✅ Git user correto: ${GIT_USER}${NC}"
    fi
    
    # Verificar email
    if [ "$GIT_EMAIL" != "$EXPECTED_GIT_EMAIL" ]; then
        echo -e "${RED}❌ Git email incorreto: ${GIT_EMAIL}${NC}"
        echo -e "${YELLOW}   Esperado: ${EXPECTED_GIT_EMAIL}${NC}"
        echo -e "${YELLOW}   Corrigindo...${NC}"
        git config user.email "$EXPECTED_GIT_EMAIL"
        echo -e "${GREEN}✅ Git email corrigido para: ${EXPECTED_GIT_EMAIL}${NC}"
        WARNINGS=$((WARNINGS + 1))
    else
        echo -e "${GREEN}✅ Git email correto: ${GIT_EMAIL}${NC}"
    fi
    
    # Verificar remote
    if [ "$GIT_REMOTE" != "$EXPECTED_GIT_REMOTE" ]; then
        echo -e "${RED}❌ Git remote incorreto: ${GIT_REMOTE}${NC}"
        echo -e "${YELLOW}   Esperado: ${EXPECTED_GIT_REMOTE}${NC}"
        ERRORS=$((ERRORS + 1))
    else
        echo -e "${GREEN}✅ Git remote correto: ${GIT_REMOTE}${NC}"
    fi
    
    echo ""
}

# Função para validar Vercel
validate_vercel() {
    echo -e "${BLUE}🚀 Verificando configuração Vercel...${NC}"
    
    # Verificar se Vercel CLI está instalado
    if ! command -v vercel &> /dev/null; then
        echo -e "${YELLOW}⚠️  Vercel CLI não está instalado${NC}"
        echo -e "${YELLOW}   Instale com: npm i -g vercel${NC}"
        WARNINGS=$((WARNINGS + 1))
        echo ""
        return
    fi
    
    # Verificar se está logado
    if ! vercel whoami &> /dev/null; then
        echo -e "${RED}❌ Não está logado no Vercel${NC}"
        echo -e "${YELLOW}   Execute: vercel login${NC}"
        ERRORS=$((ERRORS + 1))
        echo ""
        return
    fi
    
    # Verificar projeto linkado
    if [ ! -f ".vercel/project.json" ]; then
        echo -e "${YELLOW}⚠️  Projeto Vercel não está linkado${NC}"
        echo -e "${YELLOW}   Execute: vercel link${NC}"
        WARNINGS=$((WARNINGS + 1))
        echo ""
        return
    fi
    
    # Ler informações do projeto
    VERCEL_ORG=$(cat .vercel/project.json | grep -o '"orgId":"[^"]*"' | cut -d'"' -f4 || echo "")
    VERCEL_PROJECT=$(cat .vercel/project.json | grep -o '"projectName":"[^"]*"' | cut -d'"' -f4 || echo "")
    
    # Verificar org
    if [ "$VERCEL_ORG" != "$EXPECTED_VERCEL_ORG" ]; then
        echo -e "${RED}❌ Vercel org incorreto: ${VERCEL_ORG}${NC}"
        echo -e "${YELLOW}   Esperado: ${EXPECTED_VERCEL_ORG}${NC}"
        ERRORS=$((ERRORS + 1))
    else
        echo -e "${GREEN}✅ Vercel org correto: ${VERCEL_ORG}${NC}"
    fi
    
    # Verificar projeto
    if [ "$VERCEL_PROJECT" != "$EXPECTED_VERCEL_PROJECT" ]; then
        echo -e "${RED}❌ Vercel project incorreto: ${VERCEL_PROJECT}${NC}"
        echo -e "${YELLOW}   Esperado: ${EXPECTED_VERCEL_PROJECT}${NC}"
        ERRORS=$((ERRORS + 1))
    else
        echo -e "${GREEN}✅ Vercel project correto: ${VERCEL_PROJECT}${NC}"
    fi
    
    # Verificar usuário logado
    VERCEL_USER=$(vercel whoami 2>/dev/null || echo "")
    if [ -n "$VERCEL_USER" ]; then
        # Verificar se é a conta esperada (que tem acesso ao GitHub)
        # Nota: A conta pode ser diferente, mas o importante é que o projeto esteja linkado
        # e que os deploys sejam feitos via GitHub (automático)
        # Deve ser exatamente aistoteleapp-art para alinhar com Git
        if [ "$VERCEL_USER" != "aistoteleapp-art" ]; then
            echo -e "${RED}❌ Logado no Vercel como: ${VERCEL_USER}${NC}"
            echo -e "${YELLOW}   Esperado: aistoteleapp-art (para alinhar com Git)${NC}"
            echo -e "${YELLOW}   Corrija com: pnpm fix:vercel-account${NC}"
            echo -e "${YELLOW}   Ou execute: bash scripts/force-vercel-account.sh${NC}"
            ERRORS=$((ERRORS + 1))
        else
            echo -e "${GREEN}✅ Logado no Vercel como: ${VERCEL_USER} (alinhado com Git)${NC}"
        fi
    fi
    
    echo ""
}

# Executar validações
validate_git
validate_vercel

# Resumo
echo "=================================="
if [ $ERRORS -eq 0 ] && [ $WARNINGS -eq 0 ]; then
    echo -e "${GREEN}✅ Todas as validações passaram!${NC}"
    exit 0
elif [ $ERRORS -eq 0 ]; then
    echo -e "${YELLOW}⚠️  Validações passaram com ${WARNINGS} aviso(s)${NC}"
    exit 0
else
    echo -e "${RED}❌ Validação falhou com ${ERRORS} erro(s) e ${WARNINGS} aviso(s)${NC}"
    echo ""
    echo -e "${YELLOW}💡 DICAS:${NC}"
    echo "   1. Para corrigir Git: git config user.name '${EXPECTED_GIT_USER}'"
    echo "   2. Para corrigir Git: git config user.email '${EXPECTED_GIT_EMAIL}'"
    echo "   3. Para verificar Vercel: vercel whoami"
    echo "   4. Para linkar Vercel: vercel link"
    exit 1
fi

