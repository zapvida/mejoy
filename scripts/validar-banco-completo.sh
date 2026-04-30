#!/bin/bash
# Validação completa do banco e API

echo "🔍 VALIDAÇÃO COMPLETA DO BANCO"
echo "=============================="
echo ""

# 1. Verificar variáveis
echo "1️⃣ Verificando variáveis de ambiente..."
if [ -f .env.local ]; then
  HAS_DB=$(grep -c "^DATABASE_URL=" .env.local)
  HAS_DIRECT=$(grep -c "^DIRECT_URL=" .env.local)
  echo "  DATABASE_URL: $([ $HAS_DB -gt 0 ] && echo "✅" || echo "❌")"
  echo "  DIRECT_URL: $([ $HAS_DIRECT -gt 0 ] && echo "✅" || echo "❌")"
else
  echo "  ❌ .env.local não encontrado"
fi

# 2. Verificar Prisma Client
echo ""
echo "2️⃣ Verificando Prisma Client..."
if node -e "const { PrismaClient } = require('@prisma/client'); const p = new PrismaClient(); console.log('brandingDraft' in p ? '✅' : '❌');" 2>/dev/null; then
  echo "  ✅ BrandingDraft existe no Prisma Client"
else
  echo "  ❌ BrandingDraft NÃO existe no Prisma Client"
  echo "  💡 Execute: npx prisma generate"
fi

# 3. Verificar schema
echo ""
echo "3️⃣ Verificando schema Prisma..."
if grep -q "model BrandingDraft" prisma/schema.prisma; then
  echo "  ✅ Model BrandingDraft encontrado no schema"
else
  echo "  ❌ Model BrandingDraft NÃO encontrado no schema"
fi

# 4. Testar conexão (se possível)
echo ""
echo "4️⃣ Testando conexão com banco..."
echo "  (Verifique manualmente no Supabase se a tabela BrandingDraft existe)"

# 5. Testar API local
echo ""
echo "5️⃣ Testando API local..."
if curl -s http://localhost:3000/api/healthcheck > /dev/null 2>&1; then
  echo "  ✅ Servidor rodando"
  
  RESPONSE=$(curl -s -X POST "http://localhost:3000/api/branding/draft" \
    -H "Content-Type: application/json" \
    -d '{"fantasyName":"Teste Validacao","brandColor":"#10b981","accentColor":"#059669","ctaText":"Teste","ctaUrl":"https://wa.me/123"}')
  
  if echo "$RESPONSE" | jq -e '.id' > /dev/null 2>&1; then
    echo "  ✅ API funcionando! ID: $(echo "$RESPONSE" | jq -r '.id')"
  elif echo "$RESPONSE" | jq -e '.error' > /dev/null 2>&1; then
    echo "  ❌ Erro na API:"
    echo "$RESPONSE" | jq -r '.error, .details' 2>/dev/null || echo "$RESPONSE"
  else
    echo "  ⚠️ Resposta inesperada: $RESPONSE"
  fi
else
  echo "  ⚠️ Servidor não está rodando (inicie com: pnpm dev)"
fi

echo ""
echo "✅ Validação concluída!"

