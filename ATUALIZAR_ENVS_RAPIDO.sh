#!/bin/bash
# Script rápido para atualizar env vars de Emagrecimento no Vercel
# Execute: bash ATUALIZAR_ENVS_RAPIDO.sh

echo "🔧 ATUALIZANDO ENV VARS DE EMAGRECIMENTO"
echo "========================================"
echo ""

# Valores corretos (em centavos)
BASICO=418800
COMPLETO=478800
PREMIUM=538800

echo "📋 Valores que serão configurados:"
echo "  BÁSICO:    $BASICO (R$ 4.188,00 - 12x de R$ 349)"
echo "  COMPLETO:  $COMPLETO (R$ 4.788,00 - 12x de R$ 399)"
echo "  PREMIUM:   $PREMIUM (R$ 5.388,00 - 12x de R$ 449)"
echo ""
echo "⚠️  IMPORTANTE: Quando o Vercel perguntar se quer sobrescrever, digite 'y' (yes)"
echo ""

# Atualizar BÁSICO
echo "1️⃣  Atualizando ASAAS_PRICE_EMAGRECIMENTO_BASICO..."
echo "$BASICO" | vercel env add ASAAS_PRICE_EMAGRECIMENTO_BASICO production preview development

# Atualizar COMPLETO
echo ""
echo "2️⃣  Atualizando ASAAS_PRICE_EMAGRECIMENTO_COMPLETO..."
echo "$COMPLETO" | vercel env add ASAAS_PRICE_EMAGRECIMENTO_COMPLETO production preview development

# Atualizar PREMIUM
echo ""
echo "3️⃣  Atualizando ASAAS_PRICE_EMAGRECIMENTO_PREMIUM..."
echo "$PREMIUM" | vercel env add ASAAS_PRICE_EMAGRECIMENTO_PREMIUM production preview development

echo ""
echo "✅ CONCLUÍDO!"
echo ""
echo "📊 Verificando valores atualizados..."
vercel env ls | grep EMAGRECIMENTO

echo ""
echo "🚀 Próximo passo: Forçar redeploy"
echo "   Opção 1: git push origin main"
echo "   Opção 2: Vercel Dashboard → Deployments → Redeploy"

