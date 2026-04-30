#!/usr/bin/env node
/**
 * Script para criar produtos e preços no Stripe
 * Uso: node scripts/create-stripe-products-fixed.js [--live]
 */

const { execSync } = require('child_process');
const isLive = process.argv.includes('--live');

const mode = isLive ? 'LIVE' : 'TEST';
const liveFlag = isLive ? '--live' : '';

console.log(`🚀 Criando produtos e preços no Stripe (${mode} MODE)`);
console.log('');

if (isLive) {
  console.log('⚠️  ATENÇÃO: Você está no modo LIVE!');
  console.log('   Certifique-se de que está usando a conta correta!\n');
}

// Verificar se Stripe CLI está instalado
try {
  execSync('stripe --version', { stdio: 'ignore' });
} catch (e) {
  console.error('❌ Stripe CLI não encontrado. Instale: brew install stripe/stripe-cli/stripe');
  process.exit(1);
}

// Função para executar comandos Stripe
function stripeCmd(command) {
  try {
    const fullCommand = `stripe ${command} ${liveFlag} --format=json`;
    const output = execSync(fullCommand, { encoding: 'utf-8' });
    return JSON.parse(output.trim());
  } catch (error) {
    console.error(`❌ Erro ao executar: stripe ${command}`);
    console.error(error.message);
    throw error;
  }
}

// Função para criar produto
function createProduct(name, description) {
  console.log(`📦 Criando produto: ${name}...`);
  const product = stripeCmd(`products create --name "${name}" --description "${description}"`);
  console.log(`✅ Produto criado: ${product.id}\n`);
  return product.id;
}

// Função para criar preço
function createPrice(productId, amount, interval, description) {
  console.log(`💰 Criando preço: ${description} (R$ ${(amount / 100).toFixed(2)}/${interval})...`);
  const price = stripeCmd(
    `prices create --product ${productId} --currency brl --unit-amount ${amount} --recurring[interval]=${interval}`
  );
  console.log(`✅ Preço criado: ${price.id} (${description})\n`);
  return price.id;
}

try {
  console.log('═══════════════════════════════════════════════════════════\n');

  // 1. Produto Plus
  const plusProductId = createProduct(
    'ZapFarm Plus',
    'Plano principal com relatórios ilimitados, consultas virtuais e monitoramento contínuo'
  );

  // 2. Preços Plus
  const plusMonthly = createPrice(plusProductId, 2990, 'month', 'Plus Mensal');
  const plusYearly = createPrice(plusProductId, 29900, 'year', 'Plus Anual');

  // 3. Produto Gift
  const giftProductId = createProduct(
    'ZapFarm Gift',
    'Plano presente com preço especial para presentear alguém'
  );

  // 4. Preços Gift
  const giftMonthly = createPrice(giftProductId, 1990, 'month', 'Gift Mensal');
  const giftYearly = createPrice(giftProductId, 19900, 'year', 'Gift Anual');

  // 5. Produto Addon
  const addonProductId = createProduct(
    'Assentos Extras',
    'Assentos adicionais para incluir mais pessoas no plano'
  );

  // 6. Preços Addon
  const addonMonthly = createPrice(addonProductId, 990, 'month', 'Addon Mensal');
  const addonYearly = createPrice(addonProductId, 9900, 'year', 'Addon Anual');

  // Resumo
  console.log('═══════════════════════════════════════════════════════════');
  console.log('✅ PRODUTOS E PREÇOS CRIADOS COM SUCESSO!');
  console.log('═══════════════════════════════════════════════════════════\n');
  console.log('📋 Copie estas ENVs para o Vercel:\n');
  console.log(`STRIPE_PRICE_PLUS_MONTHLY=${plusMonthly}`);
  console.log(`STRIPE_PRICE_PLUS_YEARLY=${plusYearly}`);
  console.log(`STRIPE_PRICE_GIFT_MONTHLY=${giftMonthly}`);
  console.log(`STRIPE_PRICE_GIFT_YEARLY=${giftYearly}`);
  console.log(`STRIPE_PRICE_ADDON_MONTHLY=${addonMonthly}`);
  console.log(`STRIPE_PRICE_ADDON_YEARLY=${addonYearly}`);
  console.log('\n');
  console.log('⚠️  Lembre-se:');
  console.log('   - Se usou --live, estes são os valores de PRODUÇÃO');
  console.log('   - Se não usou --live, estes são valores de TEST');
  console.log('   - Para produção, execute: node scripts/create-stripe-products-fixed.js --live');
  console.log('');

} catch (error) {
  console.error('\n❌ Erro ao criar produtos:', error.message);
  process.exit(1);
}

