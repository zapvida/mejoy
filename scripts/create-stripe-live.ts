#!/usr/bin/env tsx
/**
 * Script para criar produtos e preços no Stripe LIVE MODE
 * Usa a Secret Key do ambiente ou passada como argumento
 * 
 * Uso: 
 *   tsx scripts/create-stripe-live.ts
 *   tsx scripts/create-stripe-live.ts --key sk_live_...
 */

import Stripe from 'stripe';

const secretKey = process.argv.includes('--key') 
  ? process.argv[process.argv.indexOf('--key') + 1]
  : process.env.STRIPE_SECRET_KEY;

if (!secretKey) {
  console.error('❌ STRIPE_SECRET_KEY não encontrada!');
  console.error('');
  console.error('Opções:');
  console.error('  1. Configurar STRIPE_SECRET_KEY no ambiente');
  console.error('  2. Passar como argumento: tsx scripts/create-stripe-live.ts --key sk_live_...');
  process.exit(1);
}

if (!secretKey.startsWith('sk_live_')) {
  console.error('❌ A chave deve ser uma Secret Key de PRODUÇÃO (sk_live_...)');
  process.exit(1);
}

const stripe = new Stripe(secretKey, {
  apiVersion: '2025-08-27.basil',
});

async function createProduct(name: string, description: string) {
  console.log(`📦 Criando produto: ${name}...`);
  const product = await stripe.products.create({
    name,
    description,
  });
  console.log(`✅ Produto criado: ${product.id}\n`);
  return product.id;
}

async function createPrice(productId: string, amount: number, interval: 'month' | 'year', description: string) {
  console.log(`💰 Criando preço: ${description} (R$ ${(amount / 100).toFixed(2)}/${interval})...`);
  const price = await stripe.prices.create({
    product: productId,
    currency: 'brl',
    unit_amount: amount,
    recurring: {
      interval,
    },
  });
  console.log(`✅ Preço criado: ${price.id} (${description})\n`);
  return price.id;
}

async function main() {
  console.log('🚀 Criando produtos e preços no Stripe (LIVE MODE)');
  console.log('═══════════════════════════════════════════════════════════\n');

  try {
    // 1. Produto Plus
    const plusProductId = await createProduct(
      'ZapFarm Plus',
      'Plano principal com relatórios ilimitados, consultas virtuais e monitoramento contínuo'
    );

    // 2. Preços Plus
    const plusMonthly = await createPrice(plusProductId, 2990, 'month', 'Plus Mensal');
    const plusYearly = await createPrice(plusProductId, 29900, 'year', 'Plus Anual');

    // 3. Produto Gift
    const giftProductId = await createProduct(
      'ZapFarm Gift',
      'Plano presente com preço especial para presentear alguém'
    );

    // 4. Preços Gift
    const giftMonthly = await createPrice(giftProductId, 1990, 'month', 'Gift Mensal');
    const giftYearly = await createPrice(giftProductId, 19900, 'year', 'Gift Anual');

    // 5. Produto Addon
    const addonProductId = await createProduct(
      'Assentos Extras',
      'Assentos adicionais para incluir mais pessoas no plano'
    );

    // 6. Preços Addon
    const addonMonthly = await createPrice(addonProductId, 990, 'month', 'Addon Mensal');
    const addonYearly = await createPrice(addonProductId, 9900, 'year', 'Addon Anual');

    // Resumo
    console.log('═══════════════════════════════════════════════════════════');
    console.log('✅ PRODUTOS E PREÇOS CRIADOS COM SUCESSO (LIVE MODE)!');
    console.log('═══════════════════════════════════════════════════════════\n');
    console.log('📋 Copie estas ENVs para o Vercel:\n');
    console.log(`STRIPE_PRICE_PLUS_MONTHLY=${plusMonthly}`);
    console.log(`STRIPE_PRICE_PLUS_YEARLY=${plusYearly}`);
    console.log(`STRIPE_PRICE_GIFT_MONTHLY=${giftMonthly}`);
    console.log(`STRIPE_PRICE_GIFT_YEARLY=${giftYearly}`);
    console.log(`STRIPE_PRICE_ADDON_MONTHLY=${addonMonthly}`);
    console.log(`STRIPE_PRICE_ADDON_YEARLY=${addonYearly}`);
    console.log('');

  } catch (error: any) {
    console.error('\n❌ Erro ao criar produtos:', error.message);
    if (error.code === 'resource_missing' || error.code === 'permission_denied') {
      console.error('\n⚠️  A chave não tem permissões para criar produtos/preços.');
      console.error('   Use uma Secret Key completa (sk_live_...) com permissões de escrita.');
    }
    process.exit(1);
  }
}

main();

