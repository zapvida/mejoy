// scripts/qa/pdf.unified.smoke.ts
// Smoke test automatizado para PDF unificado

interface TestResult {
  endpoint: string;
  status: 'PASS' | 'FAIL';
  statusCode: number;
  contentType: string;
  sizeBytes: number;
  durationMs: number;
  error?: string;
}

async function testEndpoint(baseUrl: string, endpoint: string): Promise<TestResult> {
  const startTime = Date.now();
  const url = `${baseUrl}${endpoint}`;
  
  try {
    console.log(`Testing: ${url}`);
    
    const response = await fetch(url, {
      method: 'GET',
      // @ts-ignore - timeout não é suportado em todos os ambientes
      timeout: 30000, // 30 segundos
    });
    
    const durationMs = Date.now() - startTime;
    const contentType = response.headers.get('content-type') || '';
    const body = await response.arrayBuffer();
    const sizeBytes = body.byteLength;
    
    // Critérios de sucesso
    const isSuccess = 
      response.status === 200 &&
      contentType.includes('application/pdf') &&
      sizeBytes > 80000; // Mínimo 80KB
    
    return {
      endpoint,
      status: isSuccess ? 'PASS' : 'FAIL',
      statusCode: response.status,
      contentType,
      sizeBytes,
      durationMs,
      error: isSuccess ? undefined : `Status: ${response.status}, Content-Type: ${contentType}, Size: ${sizeBytes} bytes`
    } as TestResult;
    
  } catch (error) {
    const durationMs = Date.now() - startTime;
    return {
      endpoint,
      status: 'FAIL',
      statusCode: 0,
      contentType: '',
      sizeBytes: 0,
      durationMs,
      error: error instanceof Error ? error.message : String(error)
    };
  }
}

async function runSmokeTests(): Promise<void> {
  const baseUrl = process.env.BASE_URL || 'http://localhost:3000';
  const endpoints = [
    '/api/pdf/report?demo=1',
    '/api/pdf/demo',
    '/api/pdf/optimized?demo=1',
  ];
  
  console.log('🧪 PDF Unified Smoke Tests');
  console.log(`Base URL: ${baseUrl}`);
  console.log('=' .repeat(50));
  
  const results: TestResult[] = [];
  
  for (const endpoint of endpoints) {
    const result = await testEndpoint(baseUrl, endpoint);
    results.push(result);
    
    const statusIcon = result.status === 'PASS' ? '✅' : '❌';
    console.log(`${statusIcon} ${result.endpoint}`);
    console.log(`   Status: ${result.statusCode} | Content-Type: ${result.contentType}`);
    console.log(`   Size: ${result.sizeBytes} bytes | Duration: ${result.durationMs}ms`);
    
    if (result.error) {
      console.log(`   Error: ${result.error}`);
    }
    console.log('');
  }
  
  // Resumo
  const passed = results.filter(r => r.status === 'PASS').length;
  const total = results.length;
  
  console.log('=' .repeat(50));
  console.log(`📊 Results: ${passed}/${total} tests passed`);
  
  if (passed === total) {
    console.log('🎉 All PDF tests passed!');
    process.exit(0);
  } else {
    console.log('💥 Some tests failed!');
    process.exit(1);
  }
}

// Executar se chamado diretamente
if (require.main === module) {
  runSmokeTests().catch(error => {
    console.error('❌ Smoke test failed:', error);
    process.exit(1);
  });
}

export { runSmokeTests, testEndpoint };
