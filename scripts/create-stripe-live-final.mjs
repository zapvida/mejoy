#!/usr/bin/env node
/**
 * Script para criar produtos e preços no Stripe LIVE MODE
 * 
 * Uso: 
 *   node scripts/create-stripe-live-final.mjs sk_live_...
 *   STRIPE_SECRET_KEY=sk_live_... node scripts/create-stripe-live-final.mjs
 */

import Stripe from 'stripe';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Obter Secret Key
let secretKey = process.env.STRIPE_SECRET_KEY;

if (!secretKey && process.argv[2]) {
  secretKey = process.argv[2];
}

if (!secretKey) {
  console.error('❌ STRIPE_SECRET_KEY não encontrada!');
  console.error('');
  console.error('Uso:');
  console.error('  node scripts/create-stripe-live-final.mjs sk_live_...');
  console.error('');
  console.error('Ou:');
  console.error('  STRIPE_SECRET_KEY=sk_live_... node scripts/create-stripe-live-final.mjs');
  process.exit(1);
}

if (!secretKey.startsWith('sk_live_')) {
  console.error('❌ A chave deve ser uma Secret Key de PRODUÇÃO (sk_live_...)');
  console.error(`   Recebido: ${secretKey.substring(0, 15)}...`);
  process.exit(1);
}

const stripe = new Stripe(secretKey, {
  apiVersion: '2024-12-18.acacia',
});

async function createProduct(name, description) {
  console.log(`📦 Criando produto: ${name}...`);
  try {
    const product = await stripe.products.create({
      name,
      description,
    });
    console.log(`✅ Produto criado: ${product.id}\n`);
    return product.id;
  } catch (error) {
    console.error(`❌ Erro ao criar produto ${name}:`, error.message);
    throw error;
  }
}

async function createPrice(productId, amount, interval, description) {
  console.log(`💰 Criando preço: ${description} (R$ ${(amount / 100).toFixed(2)}/${interval})...`);
  try {
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
  } catch (error) {
    console.error(`❌ Erro ao criar preço ${description}:`, error.message);
    throw error;
  }
}

async function main() {
  console.log('🚀 Criando produtos e preços no Stripe (LIVE MODE)');
  console.log('═══════════════════════════════════════════════════════════\n');

  try {
    // Verificar conexão
    const account = await stripe.accounts.retrieve();
    console.log(`✅ Conectado à conta Stripe: ${account.id}`);
    if (account.email) {
      console.log(`   Email: ${account.email}`);
    }
    console.log('');

    // 1. Produto Plus
    const plusProductId = await createProduct(
      'Aistotele Plus',
      'Plano principal com relatórios ilimitados, consultas virtuais e monitoramento contínuo'
    );

    // 2. Preços Plus
    const plusMonthly = await createPrice(plusProductId, 2990, 'month', 'Plus Mensal');
    const plusYearly = await createPrice(plusProductId, 29900, 'year', 'Plus Anual');

    // 3. Produto Gift
    const giftProductId = await createProduct(
      'Aistotele Gift',
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
    console.log('📋 Copie estas ENVs para o Vercel (PRODUÇÃO):\n');
    console.log(`STRIPE_PRICE_PLUS_MONTHLY=${plusMonthly}`);
    console.log(`STRIPE_PRICE_PLUS_YEARLY=${plusYearly}`);
    console.log(`STRIPE_PRICE_GIFT_MONTHLY=${giftMonthly}`);
    console.log(`STRIPE_PRICE_GIFT_YEARLY=${giftYearly}`);
    console.log(`STRIPE_PRICE_ADDON_MONTHLY=${addonMonthly}`);
    console.log(`STRIPE_PRICE_ADDON_YEARLY=${addonYearly}`);
    console.log('');

    // Salvar em arquivo
    const fs = await import('fs');
    const envContent = `# Stripe Price IDs - PRODUÇÃO (LIVE MODE)
# Criado em: ${new Date().toISOString()}

STRIPE_PRICE_PLUS_MONTHLY=${plusMonthly}
STRIPE_PRICE_PLUS_YEARLY=${plusYearly}
STRIPE_PRICE_GIFT_MONTHLY=${giftMonthly}
STRIPE_PRICE_GIFT_YEARLY=${giftYearly}
STRIPE_PRICE_ADDON_MONTHLY=${addonMonthly}
STRIPE_PRICE_ADDON_YEARLY=${addonYearly}
`;

    fs.writeFileSync('STRIPE_PRICES_LIVE.txt', envContent);
    console.log('💾 Valores salvos em: STRIPE_PRICES_LIVE.txt\n');

  } catch (error) {
    console.error('\n❌ Erro ao criar produtos:', error.message);
    if (error.code === 'resource_missing' || error.code === 'permission_denied') {
      console.error('\n⚠️  A chave não tem permissões para criar produtos/preços.');
      console.error('   Soluções:');
      console.error('   1. Criar nova Secret Key no Stripe Dashboard com permissões de escrita');
      console.error('   2. Ou criar produtos manualmente no Dashboard (mais seguro)');
      console.error('');
      console.error('   Veja: COMO_CRIAR_STRIPE_LIVE.md');
    }
    process.exit(1);
  }
}

main();

