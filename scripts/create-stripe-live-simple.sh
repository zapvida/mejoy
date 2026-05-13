#!/bin/bash
# Script para criar produtos e preços no Stripe LIVE MODE
# Uso: ./scripts/create-stripe-live-simple.sh [secret_key]

set -e

if [ -z "$1" ]; then
  echo "❌ Erro: Secret Key não fornecida"
  echo ""
  echo "Uso:"
  echo "  ./scripts/create-stripe-live-simple.sh sk_live_..."
  echo ""
  echo "Ou exporte a variável:"
  echo "  export STRIPE_SECRET_KEY=your_secret_from_provider"
  echo "  ./scripts/create-stripe-live-simple.sh"
  exit 1
fi

SECRET_KEY="$1"

if [[ ! "$SECRET_KEY" =~ ^sk_live_ ]]; then
  echo "❌ Erro: A chave deve ser uma Secret Key de PRODUÇÃO (sk_live_...)"
  exit 1
fi

echo "🚀 Criando produtos e preços no Stripe (LIVE MODE)"
echo "═══════════════════════════════════════════════════════════"
echo ""

# Criar produtos
echo "1. Criando produto 'Aistotele Plus'..."
PLUS_PROD=$(node -e "
const Stripe = require('stripe');
const stripe = new Stripe('$SECRET_KEY', { apiVersion: '2024-12-18.acacia' });
stripe.products.create({
  name: 'Aistotele Plus',
  description: 'Plano principal com relatórios ilimitados, consultas virtuais e monitoramento contínuo'
}).then(p => console.log(p.id)).catch(e => { console.error(e.message); process.exit(1); });
")
echo "✅ Produto Plus: $PLUS_PROD"

echo "2. Criando produto 'Aistotele Gift'..."
GIFT_PROD=$(node -e "
const Stripe = require('stripe');
const stripe = new Stripe('$SECRET_KEY', { apiVersion: '2024-12-18.acacia' });
stripe.products.create({
  name: 'Aistotele Gift',
  description: 'Plano presente com preço especial para presentear alguém'
}).then(p => console.log(p.id)).catch(e => { console.error(e.message); process.exit(1); });
")
echo "✅ Produto Gift: $GIFT_PROD"

echo "3. Criando produto 'Assentos Extras'..."
ADDON_PROD=$(node -e "
const Stripe = require('stripe');
const stripe = new Stripe('$SECRET_KEY', { apiVersion: '2024-12-18.acacia' });
stripe.products.create({
  name: 'Assentos Extras',
  description: 'Assentos adicionais para incluir mais pessoas no plano'
}).then(p => console.log(p.id)).catch(e => { console.error(e.message); process.exit(1); });
")
echo "✅ Produto Addon: $ADDON_PROD"
echo ""

# Criar preços
echo "4. Criando preços Plus..."
PLUS_MONTHLY=$(node -e "
const Stripe = require('stripe');
const stripe = new Stripe('$SECRET_KEY', { apiVersion: '2024-12-18.acacia' });
stripe.prices.create({
  product: '$PLUS_PROD',
  currency: 'brl',
  unit_amount: 2990,
  recurring: { interval: 'month' }
}).then(p => console.log(p.id)).catch(e => { console.error(e.message); process.exit(1); });
")
echo "✅ Plus Mensal: $PLUS_MONTHLY"

PLUS_YEARLY=$(node -e "
const Stripe = require('stripe');
const stripe = new Stripe('$SECRET_KEY', { apiVersion: '2024-12-18.acacia' });
stripe.prices.create({
  product: '$PLUS_PROD',
  currency: 'brl',
  unit_amount: 29900,
  recurring: { interval: 'year' }
}).then(p => console.log(p.id)).catch(e => { console.error(e.message); process.exit(1); });
")
echo "✅ Plus Anual: $PLUS_YEARLY"

echo "5. Criando preços Gift..."
GIFT_MONTHLY=$(node -e "
const Stripe = require('stripe');
const stripe = new Stripe('$SECRET_KEY', { apiVersion: '2024-12-18.acacia' });
stripe.prices.create({
  product: '$GIFT_PROD',
  currency: 'brl',
  unit_amount: 1990,
  recurring: { interval: 'month' }
}).then(p => console.log(p.id)).catch(e => { console.error(e.message); process.exit(1); });
")
echo "✅ Gift Mensal: $GIFT_MONTHLY"

GIFT_YEARLY=$(node -e "
const Stripe = require('stripe');
const stripe = new Stripe('$SECRET_KEY', { apiVersion: '2024-12-18.acacia' });
stripe.prices.create({
  product: '$GIFT_PROD',
  currency: 'brl',
  unit_amount: 19900,
  recurring: { interval: 'year' }
}).then(p => console.log(p.id)).catch(e => { console.error(e.message); process.exit(1); });
")
echo "✅ Gift Anual: $GIFT_YEARLY"

echo "6. Criando preços Addon..."
ADDON_MONTHLY=$(node -e "
const Stripe = require('stripe');
const stripe = new Stripe('$SECRET_KEY', { apiVersion: '2024-12-18.acacia' });
stripe.prices.create({
  product: '$ADDON_PROD',
  currency: 'brl',
  unit_amount: 990,
  recurring: { interval: 'month' }
}).then(p => console.log(p.id)).catch(e => { console.error(e.message); process.exit(1); });
")
echo "✅ Addon Mensal: $ADDON_MONTHLY"

ADDON_YEARLY=$(node -e "
const Stripe = require('stripe');
const stripe = new Stripe('$SECRET_KEY', { apiVersion: '2024-12-18.acacia' });
stripe.prices.create({
  product: '$ADDON_PROD',
  currency: 'brl',
  unit_amount: 9900,
  recurring: { interval: 'year' }
}).then(p => console.log(p.id)).catch(e => { console.error(e.message); process.exit(1); });
")
echo "✅ Addon Anual: $ADDON_YEARLY"
echo ""

echo "═══════════════════════════════════════════════════════════"
echo "✅ PRODUTOS E PREÇOS CRIADOS COM SUCESSO (LIVE MODE)!"
echo "═══════════════════════════════════════════════════════════"
echo ""
echo "📋 Copie estas ENVs para o Vercel:"
echo ""
echo "STRIPE_PRICE_PLUS_MONTHLY=$PLUS_MONTHLY"
echo "STRIPE_PRICE_PLUS_YEARLY=$PLUS_YEARLY"
echo "STRIPE_PRICE_GIFT_MONTHLY=$GIFT_MONTHLY"
echo "STRIPE_PRICE_GIFT_YEARLY=$GIFT_YEARLY"
echo "STRIPE_PRICE_ADDON_MONTHLY=$ADDON_MONTHLY"
echo "STRIPE_PRICE_ADDON_YEARLY=$ADDON_YEARLY"
echo ""

