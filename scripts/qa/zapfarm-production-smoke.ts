#!/usr/bin/env tsx
/**
 * Smoke Test Completo para Produção - 10 Produtos ZapFarm
 * 
 * Testa o fluxo completo de cada produto:
 * 1. Página do produto (LPAC)
 * 2. Início da triagem
 * 3. Geração de relatório (via API)
 * 4. Página de checkout
 * 
 * Execução: tsx scripts/qa/zapfarm-production-smoke.ts
 */

import https from 'https';
import http from 'http';

const BASE_URL = process.env.PRODUCTION_URL || 'https://www.zapfarm.com.br';
const TIMEOUT = 30000; // 30 segundos

interface TestResult {
  product: string;
  step: string;
  status: 'pass' | 'fail' | 'skip';
  message: string;
  duration: number;
  url?: string;
  statusCode?: number;
}

interface ProductTest {
  slug: string;
  triageSlug: string;
  name: string;
}

const PRODUCTS: ProductTest[] = [
  { slug: 'emagrecimento', triageSlug: 'emagrecimento', name: 'MetaboSlim' },
  { slug: 'calvicie', triageSlug: 'calvicie', name: 'CapilMax' },
  { slug: 'sono', triageSlug: 'sono', name: 'SonoZen' },
  { slug: 'ansiedade', triageSlug: 'ansiedade', name: 'VigorMax' },
  { slug: 'intestino', triageSlug: 'intestino', name: 'FloraBalance' },
  { slug: 'figado', triageSlug: 'figado', name: 'HepaDetox' },
  { slug: 'libido-masculina', triageSlug: 'libido-masculina', name: 'VigorMax' },
  { slug: 'menopausa', triageSlug: 'menopausa', name: 'FemBalance 360' },
  { slug: 'articulacoes', triageSlug: 'articulacoes', name: 'ArticFlex' },
  { slug: 'imunidade', triageSlug: 'imunidade', name: 'Imuno360' },
];

class ZapfarmProductionSmokeTest {
  private results: TestResult[] = [];
  private startTime: number = Date.now();

  constructor() {
    console.log('\n🚀 ZAPFARM - SMOKE TEST COMPLETO EM PRODUÇÃO');
    console.log('='.repeat(80));
    console.log(`🎯 Target: ${BASE_URL}`);
    console.log(`📦 Produtos: ${PRODUCTS.length}`);
    console.log(`⏰ Início: ${new Date().toISOString()}`);
    console.log('='.repeat(80));
  }

  async makeRequest(url: string, options: { method?: string; data?: any } = {}): Promise<{ statusCode: number; body: string; duration: number }> {
    const startTime = Date.now();
    const method = options.method || 'GET';
    const isHttps = url.startsWith('https');
    const client = isHttps ? https : http;

    return new Promise((resolve, reject) => {
      const urlObj = new URL(url);
      const requestOptions = {
        hostname: urlObj.hostname,
        port: urlObj.port || (isHttps ? 443 : 80),
        path: urlObj.pathname + urlObj.search,
        method: method,
        headers: {
          'User-Agent': 'ZapFarm-SmokeTest/1.0',
          'Accept': 'text/html,application/json',
          'Content-Type': 'application/json',
        },
        timeout: TIMEOUT,
      };

      const req = client.request(requestOptions, (res) => {
        let body = '';
        res.on('data', (chunk) => {
          body += chunk;
        });
        res.on('end', () => {
          const duration = Date.now() - startTime;
          resolve({
            statusCode: res.statusCode || 0,
            body: body.substring(0, 500), // Limitar tamanho do body
            duration,
          });
        });
      });

      req.on('error', (error) => {
        reject(error);
      });

      req.on('timeout', () => {
        req.destroy();
        reject(new Error('Request timeout'));
      });

      if (options.data) {
        req.write(JSON.stringify(options.data));
      }

      req.end();
    });
  }

  async testEndpoint(name: string, url: string, method: string = 'GET', expectedStatus: number = 200): Promise<TestResult> {
    const startTime = Date.now();
    const fullUrl = url.startsWith('http') ? url : `${BASE_URL}${url}`;

    try {
      const response = await this.makeRequest(fullUrl, { method });
      const duration = Date.now() - startTime;
      const passed = response.statusCode === expectedStatus || (expectedStatus === 200 && response.statusCode < 400);

      const result: TestResult = {
        product: 'global',
        step: name,
        status: passed ? 'pass' : 'fail',
        message: passed
          ? `✅ ${response.statusCode} (${duration}ms)`
          : `❌ Esperado ${expectedStatus}, recebido ${response.statusCode}`,
        duration,
        url: fullUrl,
        statusCode: response.statusCode,
      };

      this.results.push(result);
      console.log(`  ${result.status === 'pass' ? '✅' : '❌'} ${name}: ${result.message}`);
      return result;
    } catch (error: any) {
      const duration = Date.now() - startTime;
      const result: TestResult = {
        product: 'global',
        step: name,
        status: 'fail',
        message: `❌ Erro: ${error.message}`,
        duration,
        url: fullUrl,
      };

      this.results.push(result);
      console.log(`  ❌ ${name}: ${result.message}`);
      return result;
    }
  }

  async testProductPage(product: ProductTest): Promise<TestResult> {
    return await this.testEndpoint(
      `Página ${product.name}`,
      `/${product.slug}`,
      'GET',
      200
    );
  }

  async testTriageStart(product: ProductTest): Promise<TestResult> {
    return await this.testEndpoint(
      `Triagem ${product.name}`,
      `/triagem/${product.triageSlug}`,
      'GET',
      200
    );
  }

  async testTriageSession(product: ProductTest): Promise<TestResult> {
    const startTime = Date.now();
    const fullUrl = `${BASE_URL}/api/triage/session`;

    try {
      // Criar sessão de triagem (apenas verificar se API responde)
      // NOTA: Em produção, isso cria uma sessão real, mas é necessário para validar o fluxo
      const response = await this.makeRequest(fullUrl, {
        method: 'POST',
        data: {
          triageSlug: product.triageSlug,
          profile: {
            name: 'Smoke Test',
            age: 35,
            sex: 'masculino',
          },
        },
      });

      const duration = Date.now() - startTime;
      const passed = response.statusCode === 200 || response.statusCode === 201;

      let triageId: string | null = null;
      if (passed) {
        try {
          const data = JSON.parse(response.body);
          triageId = data.triageId || data.id || null;
        } catch {
          // Não conseguiu parsear, mas status foi OK
        }
      }

      const result: TestResult = {
        product: product.slug,
        step: `API Sessão Triagem ${product.name}`,
        status: passed ? 'pass' : 'fail',
        message: passed
          ? `✅ API respondeu (${duration}ms)${triageId ? ` - ID: ${triageId.substring(0, 8)}...` : ''}`
          : `❌ Falha na API: ${response.statusCode}`,
        duration,
        url: fullUrl,
        statusCode: response.statusCode,
      };

      this.results.push(result);
      console.log(`  ${result.status === 'pass' ? '✅' : '❌'} ${result.step}: ${result.message}`);
      return result;
    } catch (error: any) {
      const duration = Date.now() - startTime;
      const result: TestResult = {
        product: product.slug,
        step: `API Sessão Triagem ${product.name}`,
        status: 'fail',
        message: `❌ Erro: ${error.message}`,
        duration,
        url: fullUrl,
      };

      this.results.push(result);
      console.log(`  ❌ ${result.step}: ${result.message}`);
      return result;
    }
  }

  async testReportAPI(product: ProductTest): Promise<TestResult> {
    // Testar se a API de relatório está acessível (sem criar relatório real)
    return await this.testEndpoint(
      `API Relatório ${product.name}`,
      `/api/triage/finalize`,
      'POST',
      400 // Esperamos 400 porque não enviamos triageId válido
    );
  }

  async testCheckoutPage(product: ProductTest): Promise<TestResult> {
    // Testar página de checkout (pode variar por produto)
    const checkoutUrls = [
      `/${product.slug}/checkout`,
      `/emagrecimento/checkout`, // Fallback para emagrecimento
    ];

    for (const url of checkoutUrls) {
      const result = await this.testEndpoint(
        `Checkout ${product.name}`,
        url,
        'GET',
        200
      );
      if (result.status === 'pass') {
        return result;
      }
    }

    // Se nenhum checkout específico funcionou, testar genérico
    return await this.testEndpoint(
      `Checkout ${product.name}`,
      `/checkout`,
      'GET',
      200
    );
  }

  async testProductFlow(product: ProductTest): Promise<void> {
    console.log(`\n📦 Testando: ${product.name} (${product.slug})`);
    console.log('-'.repeat(80));

    // 1. Página do produto (LPAC)
    await this.testProductPage(product);

    // 2. Página de triagem
    await this.testTriageStart(product);

    // 3. API de sessão de triagem (verifica se está funcionando)
    await this.testTriageSession(product);

    // 4. API de relatório (verifica se está acessível)
    await this.testReportAPI(product);

    // 5. Página de checkout
    await this.testCheckoutPage(product);

    // Pequeno delay entre produtos para não sobrecarregar
    await new Promise((resolve) => setTimeout(resolve, 1500));
  }

  async testInfrastructure(): Promise<void> {
    console.log('\n🏗️  TESTANDO INFRAESTRUTURA BÁSICA');
    console.log('-'.repeat(80));

    await this.testEndpoint('Homepage', '/', 'GET', 200);
    await this.testEndpoint('Sitemap', '/sitemap.xml', 'GET', 200);
    await this.testEndpoint('Robots.txt', '/robots.txt', 'GET', 200);
    await this.testEndpoint('Health Check', '/api/health', 'GET', 200);
  }

  async run(): Promise<void> {
    try {
      // 1. Testar infraestrutura básica
      await this.testInfrastructure();

      // 2. Testar cada produto
      console.log('\n\n🛍️  TESTANDO FLUXOS DOS PRODUTOS');
      console.log('='.repeat(80));

      for (const product of PRODUCTS) {
        await this.testProductFlow(product);
      }

      // 3. Gerar relatório
      this.generateReport();
    } catch (error: any) {
      console.error('\n❌ ERRO CRÍTICO NO TESTE:', error.message);
      process.exit(1);
    }
  }

  generateReport(): void {
    const totalDuration = Date.now() - this.startTime;
    const passed = this.results.filter((r) => r.status === 'pass').length;
    const failed = this.results.filter((r) => r.status === 'fail').length;
    const skipped = this.results.filter((r) => r.status === 'skip').length;
    const total = this.results.length;

    console.log('\n\n' + '='.repeat(80));
    console.log('📊 RELATÓRIO FINAL');
    console.log('='.repeat(80));
    console.log(`⏱️  Duração Total: ${(totalDuration / 1000).toFixed(2)}s`);
    console.log(`✅ Passou: ${passed}/${total} (${((passed / total) * 100).toFixed(1)}%)`);
    console.log(`❌ Falhou: ${failed}/${total} (${((failed / total) * 100).toFixed(1)}%)`);
    console.log(`⏭️  Pulado: ${skipped}/${total}`);

    if (failed > 0) {
      console.log('\n❌ TESTES QUE FALHARAM:');
      this.results
        .filter((r) => r.status === 'fail')
        .forEach((r) => {
          console.log(`  - ${r.step} (${r.product}): ${r.message}`);
          if (r.url) console.log(`    URL: ${r.url}`);
        });
    }

    console.log('\n' + '='.repeat(80));

    // Resumo por produto
    console.log('\n📦 RESUMO POR PRODUTO:');
    for (const product of PRODUCTS) {
      const productResults = this.results.filter((r) => r.product === product.slug);
      const productPassed = productResults.filter((r) => r.status === 'pass').length;
      const productTotal = productResults.length;
      const status = productPassed === productTotal ? '✅' : '⚠️';
      console.log(`  ${status} ${product.name}: ${productPassed}/${productTotal} testes passaram`);
    }

    console.log('\n' + '='.repeat(80));

    // Exit code baseado em resultados
    if (failed > 0) {
      console.log('\n⚠️  ALGUNS TESTES FALHARAM. REVISE OS RESULTADOS ACIMA.');
      process.exit(1);
    } else {
      console.log('\n✅ TODOS OS TESTES PASSARAM! SISTEMA PRONTO PARA PRODUÇÃO.');
      process.exit(0);
    }
  }
}

// Executar teste
if (require.main === module) {
  const tester = new ZapfarmProductionSmokeTest();
  tester.run().catch((error) => {
    console.error('Erro fatal:', error);
    process.exit(1);
  });
}

export default ZapfarmProductionSmokeTest;

