#!/usr/bin/env bash
# Script de deploy seguro que valida contas antes de executar
# Uso: ./scripts/deploy-safe.sh [--prod|--preview]

set -euo pipefail

# Cores
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Determinar tipo de deploy
DEPLOY_TYPE="${1:---preview}"
if [ "$DEPLOY_TYPE" != "--prod" ] && [ "$DEPLOY_TYPE" != "--preview" ]; then
    echo -e "${RED}❌ Uso: ./scripts/deploy-safe.sh [--prod|--preview]${NC}"
    exit 1
fi

echo -e "${BLUE}🚀 DEPLOY SEGURO - Aistotele${NC}"
echo "=================================="
echo ""

# 1. Validar contas
echo -e "${BLUE}📋 Passo 1: Validando contas...${NC}"
VALIDATION_OUTPUT=$(bash scripts/validate-accounts.sh 2>&1)
VALIDATION_EXIT=$?

if [ $VALIDATION_EXIT -ne 0 ]; then
    echo "$VALIDATION_OUTPUT"
    echo ""
    echo -e "${RED}❌ Validação de contas falhou. Abortando deploy.${NC}"
    echo ""
    echo -e "${YELLOW}💡 Para corrigir a conta do Vercel:${NC}"
    echo "   pnpm force:vercel-account"
    exit 1
fi

# Verificar se há erros mesmo com exit 0 (warnings)
if echo "$VALIDATION_OUTPUT" | grep -q "❌"; then
    echo "$VALIDATION_OUTPUT"
    echo ""
    echo -e "${RED}❌ Contas não estão alinhadas. Abortando deploy.${NC}"
    echo ""
    echo -e "${YELLOW}💡 Para corrigir:${NC}"
    echo "   pnpm force:vercel-account"
    exit 1
fi

echo "$VALIDATION_OUTPUT"

# 2. Verificar se há mudanças não commitadas
echo ""
echo -e "${BLUE}📋 Passo 2: Verificando mudanças não commitadas...${NC}"
if [ -n "$(git status --porcelain)" ]; then
    echo -e "${YELLOW}⚠️  Há mudanças não commitadas:${NC}"
    git status --short
    echo ""
    read -p "Deseja continuar mesmo assim? (s/N): " -n 1 -r
    echo ""
    if [[ ! $REPLY =~ ^[Ss]$ ]]; then
        echo -e "${YELLOW}Deploy cancelado.${NC}"
        exit 0
    fi
else
    echo -e "${GREEN}✅ Nenhuma mudança não commitada${NC}"
fi

# 3. Verificar branch
echo ""
echo -e "${BLUE}📋 Passo 3: Verificando branch...${NC}"
CURRENT_BRANCH=$(git branch --show-current)
if [ "$DEPLOY_TYPE" == "--prod" ] && [ "$CURRENT_BRANCH" != "main" ]; then
    echo -e "${RED}❌ Deploy para produção só pode ser feito da branch 'main'${NC}"
    echo -e "${YELLOW}   Branch atual: ${CURRENT_BRANCH}${NC}"
    exit 1
fi
echo -e "${GREEN}✅ Branch: ${CURRENT_BRANCH}${NC}"

# 4. Verificar se está atualizado
echo ""
echo -e "${BLUE}📋 Passo 4: Verificando sincronização com remote...${NC}"
git fetch origin
LOCAL=$(git rev-parse @)
REMOTE=$(git rev-parse @{u})
BASE=$(git merge-base @ @{u})

if [ "$LOCAL" = "$REMOTE" ]; then
    echo -e "${GREEN}✅ Branch está atualizado${NC}"
elif [ "$LOCAL" = "$BASE" ]; then
    echo -e "${YELLOW}⚠️  Branch está desatualizado. Execute: git pull${NC}"
    read -p "Deseja continuar mesmo assim? (s/N): " -n 1 -r
    echo ""
    if [[ ! $REPLY =~ ^[Ss]$ ]]; then
        echo -e "${YELLOW}Deploy cancelado.${NC}"
        exit 0
    fi
elif [ "$REMOTE" = "$BASE" ]; then
    echo -e "${YELLOW}⚠️  Você tem commits locais não enviados${NC}"
    read -p "Deseja fazer push primeiro? (S/n): " -n 1 -r
    echo ""
    if [[ ! $REPLY =~ ^[Nn]$ ]]; then
        echo -e "${BLUE}📤 Fazendo push...${NC}"
        git push origin "$CURRENT_BRANCH"
    fi
else
    echo -e "${YELLOW}⚠️  Branch divergiu do remote${NC}"
    read -p "Deseja continuar mesmo assim? (s/N): " -n 1 -r
    echo ""
    if [[ ! $REPLY =~ ^[Ss]$ ]]; then
        echo -e "${YELLOW}Deploy cancelado.${NC}"
        exit 0
    fi
fi

# 5. Deploy
echo ""
echo -e "${BLUE}📋 Passo 5: Executando deploy...${NC}"
if [ "$DEPLOY_TYPE" == "--prod" ]; then
    echo -e "${YELLOW}🚀 Deploy para PRODUÇÃO${NC}"
    vercel deploy --prod --confirm
else
    echo -e "${BLUE}🚀 Deploy para PREVIEW${NC}"
    vercel deploy
fi

echo ""
echo -e "${GREEN}✅ Deploy concluído com sucesso!${NC}"

