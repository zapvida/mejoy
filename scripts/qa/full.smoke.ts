// scripts/qa/full.smoke.ts
// Script de smoke test completo para validação E2E antes do go-live

import fetch from 'node-fetch';

// Suporte para --base CLI
const baseArgIndex = process.argv.indexOf('--base');
const BASE_URL = baseArgIndex !== -1 && process.argv[baseArgIndex + 1] 
  ? process.argv[baseArgIndex + 1] 
  : process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

const STRIPE_PRICE_PLUS_MONTHLY = process.env.STRIPE_PRICE_PLUS_MONTHLY || 'price_test';

interface SmokeTestResult {
  test: string;
  status: 'PASS' | 'FAIL';
  latency: number;
  details?: any;
  error?: string;
}

const results: SmokeTestResult[] = [];

async function runTest(testName: string, testFn: () => Promise<any>): Promise<void> {
  const start = Date.now();
  try {
    const result = await testFn();
    const latency = Date.now() - start;
    results.push({
      test: testName,
      status: 'PASS',
      latency,
      details: result
    });
    console.log(`✅ ${testName} - ${latency}ms`);
  } catch (error) {
    const latency = Date.now() - start;
    results.push({
      test: testName,
      status: 'FAIL',
      latency,
      error: error instanceof Error ? error.message : String(error)
    });
    console.log(`❌ ${testName} - ${latency}ms - ${error}`);
  }
}

async function testHealthEndpoints() {
  // Test /api/health
  const healthResponse = await fetch(`${BASE_URL}/api/health`);
  if (!healthResponse.ok) {
    throw new Error(`Health endpoint failed: ${healthResponse.status}`);
  }
  
  // Test /api/healthcheck
  const healthcheckResponse = await fetch(`${BASE_URL}/api/healthcheck`);
  if (!healthcheckResponse.ok) {
    throw new Error(`Healthcheck endpoint failed: ${healthcheckResponse.status}`);
  }
  
  return { health: healthResponse.status, healthcheck: healthcheckResponse.status };
}

async function testTriageSession() {
  const response = await fetch(`${BASE_URL}/api/triage/session`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      triageSlug: 'gastro',
      patientBasics: {
        name: 'Test User',
        sex: 'M',
        age: 30,
        bmi: 25
      }
    })
  });
  
  if (!response.ok) {
    throw new Error(`Triage session failed: ${response.status}`);
  }
  
  const data = await response.json();
  return { sessionId: data.sessionId || 'mock-session' };
}

async function testTriageAnswer() {
  const response = await fetch(`${BASE_URL}/api/triage/answer`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      sessionId: 'mock-session',
      stepKey: 'test-step',
      value: 'test-value'
    })
  });
  
  if (!response.ok) {
    throw new Error(`Triage answer failed: ${response.status}`);
  }
  
  const data = await response.json();
  return { reportId: data.reportId || 'mock-report' };
}

async function testPdfGeneration() {
  const response = await fetch(`${BASE_URL}/api/pdf/report?id=mock-report`);
  
  if (!response.ok) {
    throw new Error(`PDF generation failed: ${response.status}`);
  }
  
  const buffer = await response.buffer();
  if (buffer.length < 50000) {
    throw new Error(`PDF too small: ${buffer.length} bytes`);
  }
  
  return { size: buffer.length };
}

async function testWhatsappReport() {
  const response = await fetch(`${BASE_URL}/api/report/whatsapp`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      reportId: 'mock-report',
      phone: '+5511999999999'
    })
  });
  
  if (!response.ok) {
    throw new Error(`WhatsApp report failed: ${response.status}`);
  }
  
  return { status: response.status };
}

async function testStripeCheckout() {
  const response = await fetch(`${BASE_URL}/api/stripe/create-checkout-session`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      priceId: STRIPE_PRICE_PLUS_MONTHLY,
      successUrl: `${BASE_URL}/success`,
      cancelUrl: `${BASE_URL}/cancel`
    })
  });
  
  if (!response.ok) {
    throw new Error(`Stripe checkout failed: ${response.status}`);
  }
  
  const data = await response.json();
  if (!data.url) {
    throw new Error('No checkout URL returned');
  }
  
  return { checkoutUrl: data.url };
}

async function testStripeWebhook() {
  // Simular webhook local
  const payload = JSON.stringify({
    id: 'evt_test',
    type: 'checkout.session.completed',
    data: {
      object: {
        id: 'cs_test',
        amount_total: 4900,
        metadata: {
          plan: 'plus',
          period: 'monthly'
        }
      }
    }
  });
  
  const response = await fetch(`${BASE_URL}/api/stripe/webhook`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'stripe-signature': 'test-signature'
    },
    body: payload
  });
  
  if (!response.ok) {
    throw new Error(`Stripe webhook failed: ${response.status}`);
  }
  
  return { status: response.status };
}

async function testGHLIntegration() {
  const response = await fetch(`${BASE_URL}/api/crm/ghl/upsert`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: 'E2E Smoke Test',
      email: 'test@example.com',
      phone: '+5511999999999',
      utm: { source: 'smoke-test' }
    })
  });
  
  if (!response.ok) {
    throw new Error(`GHL integration failed: ${response.status}`);
  }
  
  const data = await response.json();
  return { contactId: data.contactId || 'mock-contact' };
}

async function main() {
  console.log('🚀 Starting full smoke test...');
  console.log(`Base URL: ${BASE_URL}`);
  
  await runTest('Health Endpoints', testHealthEndpoints);
  await runTest('Triage Session', testTriageSession);
  await runTest('Triage Answer', testTriageAnswer);
  await runTest('PDF Generation', testPdfGeneration);
  await runTest('WhatsApp Report', testWhatsappReport);
  await runTest('Stripe Checkout', testStripeCheckout);
  await runTest('Stripe Webhook', testStripeWebhook);
  await runTest('GHL Integration', testGHLIntegration);
  
  const passed = results.filter(r => r.status === 'PASS').length;
  const failed = results.filter(r => r.status === 'FAIL').length;
  const totalLatency = results.reduce((sum, r) => sum + r.latency, 0);
  
  console.log('\n📊 Smoke Test Results:');
  console.log(`✅ Passed: ${passed}`);
  console.log(`❌ Failed: ${failed}`);
  console.log(`⏱️  Total Latency: ${totalLatency}ms`);
  
  // Salvar resultados
  const fs = require('fs');
  const path = require('path');
  const outputDir = path.join(__dirname, '.out');
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }
  
  const outputFile = path.join(outputDir, 'latest.json');
  fs.writeFileSync(outputFile, JSON.stringify({
    timestamp: new Date().toISOString(),
    results,
    summary: { passed, failed, totalLatency }
  }, null, 2));
  
  console.log(`📁 Results saved to: ${outputFile}`);
  
  if (failed > 0) {
    console.log('\n❌ Some tests failed. Check the details above.');
    process.exit(1);
  } else {
    console.log('\n✅ All tests passed! Ready for go-live.');
  }
}

if (require.main === module) {
  main().catch(console.error);
}

export { main as runSmokeTest };
