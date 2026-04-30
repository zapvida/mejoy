// scripts/qa/stripe.webhook.local.ts
// Script para simular webhook do Stripe localmente

import crypto from 'crypto';

import fetch from 'node-fetch';

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
const STRIPE_WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET || 'whsec_test';

function createStripeSignature(payload: string, secret: string): string {
  const timestamp = Math.floor(Date.now() / 1000);
  const signature = crypto
    .createHmac('sha256', secret)
    .update(`${timestamp}.${payload}`)
    .digest('hex');
  
  return `t=${timestamp},v1=${signature}`;
}

async function simulateWebhook(eventType: string, data: any) {
  const payload = JSON.stringify({
    id: `evt_${Date.now()}`,
    type: eventType,
    data: { object: data },
    created: Math.floor(Date.now() / 1000)
  });
  
  const signature = createStripeSignature(payload, STRIPE_WEBHOOK_SECRET);
  
  const response = await fetch(`${BASE_URL}/api/stripe/webhook`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'stripe-signature': signature
    },
    body: payload
  });
  
  return {
    status: response.status,
    body: await response.text()
  };
}

async function testCheckoutCompleted() {
  console.log('🧪 Testing checkout.session.completed webhook...');
  
  const result = await simulateWebhook('checkout.session.completed', {
    id: 'cs_test_' + Date.now(),
    amount_total: 4900,
    currency: 'brl',
    customer_email: 'test@example.com',
    metadata: {
      plan: 'plus',
      period: 'monthly',
      tenant: 'alloe'
    }
  });
  
  console.log(`Status: ${result.status}`);
  console.log(`Response: ${result.body}`);
  
  return result;
}

async function testInvoicePaid() {
  console.log('🧪 Testing invoice.payment_succeeded webhook...');
  
  const result = await simulateWebhook('invoice.payment_succeeded', {
    id: 'in_test_' + Date.now(),
    amount_paid: 4900,
    currency: 'brl',
    customer_email: 'test@example.com',
    subscription: 'sub_test_' + Date.now()
  });
  
  console.log(`Status: ${result.status}`);
  console.log(`Response: ${result.body}`);
  
  return result;
}

async function main() {
  console.log('🚀 Starting Stripe webhook simulation...');
  console.log(`Base URL: ${BASE_URL}`);
  console.log(`Webhook Secret: ${STRIPE_WEBHOOK_SECRET.substring(0, 10)}...`);
  
  try {
    await testCheckoutCompleted();
    await testInvoicePaid();
    console.log('✅ Webhook simulation completed successfully!');
  } catch (error) {
    console.error('❌ Webhook simulation failed:', error);
    process.exit(1);
  }
}

if (require.main === module) {
  main().catch(console.error);
}

export { simulateWebhook, testCheckoutCompleted, testInvoicePaid };
