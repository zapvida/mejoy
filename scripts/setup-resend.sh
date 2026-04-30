#!/bin/bash
# Script rápido para configurar Resend

echo "🚀 Configuração Rápida do Resend"
echo "=================================="
echo ""

echo "1️⃣  Criar conta no Resend:"
echo "   👉 https://resend.com/signup"
echo ""
echo "2️⃣  Obter API Key:"
echo "   👉 https://resend.com/api-keys"
echo "   👉 Clique em 'Create API Key'"
echo "   👉 Copie a chave (ela só aparece uma vez!)"
echo ""
echo "3️⃣  Configurar no Vercel:"
echo ""
read -p "Cole sua RESEND_API_KEY aqui: " RESEND_KEY

if [ -z "$RESEND_KEY" ]; then
  echo "❌ API Key não fornecida"
  exit 1
fi

echo ""
echo "📝 Configurando no Vercel..."
echo ""

# Verificar se vercel CLI está instalado
if ! command -v vercel &> /dev/null; then
  echo "⚠️  Vercel CLI não encontrado. Instalando..."
  npm install -g vercel
fi

# Configurar variáveis
vercel env add RESEND_API_KEY production <<< "$RESEND_KEY" 2>/dev/null || \
  vercel env rm RESEND_API_KEY production --yes 2>/dev/null; \
  echo "$RESEND_KEY" | vercel env add RESEND_API_KEY production

echo ""
echo "✅ RESEND_API_KEY configurada!"
echo ""
echo "📋 Variáveis opcionais (recomendadas):"
echo ""
echo "   EMAIL_FROM:"
echo "   ZapFarm <noreply@zapfarm.com.br>"
echo ""
echo "   EMAIL_REPLY_TO:"
echo "   contato@zapfarm.com.br"
echo ""
echo "💡 Para configurar manualmente:"
echo "   vercel env add EMAIL_FROM production"
echo "   vercel env add EMAIL_REPLY_TO production"
echo ""
echo "🎉 Pronto! Faça o deploy e teste:"
echo "   npm run test:emails"







