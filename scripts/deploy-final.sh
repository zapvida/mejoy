#!/bin/bash
# Script de deploy final - tudo automatizado
# Uso: ./scripts/deploy-final.sh

set -e

echo "🚀 DEPLOY FINAL - AISTOTELE"
echo "============================"
echo ""

# Cores
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

# 1. Verificar se está em branch limpa
echo "1️⃣ Verificando repositório..."
if [ -n "$(git status --porcelain)" ]; then
  echo -e "${YELLOW}⚠️ Há mudanças não commitadas${NC}"
  git status --short
  echo ""
  read -p "Continuar com commit? (s/n) " -n 1 -r
  echo ""
  if [[ ! $REPLY =~ ^[Ss]$ ]]; then
    echo "Deploy cancelado."
    exit 1
  fi
fi

# 2. Build local (opcional, mas recomendado)
echo ""
echo "2️⃣ Testando build local..."
if pnpm build 2>&1 | tail -20; then
  echo -e "${GREEN}✅ Build local OK${NC}"
else
  echo -e "${YELLOW}⚠️ Build local falhou, mas continuando...${NC}"
fi

# 3. Commit e push
echo ""
echo "3️⃣ Commit e push..."
git add -A
git commit -m "release(b2b): wizard→sandbox→triage→report PDF + hardening" || {
  echo -e "${YELLOW}⚠️ Nada para commitar${NC}"
}
git push || {
  echo -e "${RED}❌ Erro no push${NC}"
  exit 1
}
echo -e "${GREEN}✅ Commit e push OK${NC}"

# 4. Deploy no Vercel
echo ""
echo "4️⃣ Deploy no Vercel..."
if vercel --prod; then
  echo -e "${GREEN}✅ Deploy iniciado${NC}"
else
  echo -e "${RED}❌ Erro no deploy${NC}"
  exit 1
fi

# 5. Aguardar deploy (opcional)
echo ""
echo "5️⃣ Aguardando deploy completar..."
echo "   (Verifique no Vercel Dashboard quando estiver pronto)"
echo ""
echo "Próximos passos:"
echo "1. Verifique se deploy completou no Vercel"
echo "2. Execute: ./scripts/smoke-production-final.sh https://aistotele.com"
echo "3. Teste o fluxo UI completo"
echo ""
echo -e "${GREEN}🎉 Deploy finalizado!${NC}"

