// tests/e2e/seo.test.ts
// Testes de SEO conforme SUPER-PROMPT

import { test, expect } from '@playwright/test';

test.describe('SEO - Meta tags e estrutura', () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
  });

  test('Homepage - Meta tags obrigatórias', async ({ page }) => {
    await page.goto('/');
    
    // Verificar título
    const title = await page.title();
    expect(title).toBeTruthy();
    expect(title.length).toBeGreaterThan(10);
    expect(title.length).toBeLessThan(60);
    
    // Verificar meta description
    const metaDescription = await page.getAttribute('meta[name="description"]', 'content');
    expect(metaDescription).toBeTruthy();
    expect(metaDescription!.length).toBeGreaterThan(120);
    expect(metaDescription!.length).toBeLessThan(160);
    
    // Verificar meta viewport
    const metaViewport = await page.getAttribute('meta[name="viewport"]', 'content');
    expect(metaViewport).toContain('width=device-width');
    
    // Verificar canonical
    const canonical = await page.getAttribute('link[rel="canonical"]', 'href');
    expect(canonical).toBeTruthy();
    
    // Verificar Open Graph
    const ogTitle = await page.getAttribute('meta[property="og:title"]', 'content');
    const ogDescription = await page.getAttribute('meta[property="og:description"]', 'content');
    const ogImage = await page.getAttribute('meta[property="og:image"]', 'content');
    const ogUrl = await page.getAttribute('meta[property="og:url"]', 'content');
    
    expect(ogTitle).toBeTruthy();
    expect(ogDescription).toBeTruthy();
    expect(ogImage).toBeTruthy();
    expect(ogUrl).toBeTruthy();
    
    // Verificar Twitter Card
    const twitterCard = await page.getAttribute('meta[name="twitter:card"]', 'content');
    const twitterTitle = await page.getAttribute('meta[name="twitter:title"]', 'content');
    const twitterDescription = await page.getAttribute('meta[name="twitter:description"]', 'content');
    
    expect(twitterCard).toBeTruthy();
    expect(twitterTitle).toBeTruthy();
    expect(twitterDescription).toBeTruthy();
  });

  test('Triagem Gastro - Meta tags específicas', async ({ page }) => {
    await page.goto('/triagem/gastro');
    
    // Verificar título específico
    const title = await page.title();
    expect(title).toContain('Gastrointestinal');
    expect(title).toContain('AlloeHealth');
    
    // Verificar meta description específica
    const metaDescription = await page.getAttribute('meta[name="description"]', 'content');
    expect(metaDescription).toContain('gastrointestinal');
    
    // Verificar canonical
    const canonical = await page.getAttribute('link[rel="canonical"]', 'href');
    expect(canonical).toContain('/triagem/gastro');
  });

  test('Relatório - Meta tags dinâmicas', async ({ page }) => {
    await page.goto('/relatorio/test-id');
    
    // Verificar título dinâmico
    const title = await page.title();
    expect(title).toContain('Relatório');
    expect(title).toContain('AlloeHealth');
    
    // Verificar meta description dinâmica
    const metaDescription = await page.getAttribute('meta[name="description"]', 'content');
    expect(metaDescription).toContain('relatório');
    
    // Verificar canonical
    const canonical = await page.getAttribute('link[rel="canonical"]', 'href');
    expect(canonical).toContain('/relatorio/test-id');
  });

  test('Assinatura - Meta tags de conversão', async ({ page }) => {
    await page.goto('/assinatura');
    
    // Verificar título de conversão
    const title = await page.title();
    expect(title).toContain('Assinatura');
    expect(title).toContain('R$ 49');
    
    // Verificar meta description de conversão
    const metaDescription = await page.getAttribute('meta[name="description"]', 'content');
    expect(metaDescription).toContain('30 dias');
    
    // Verificar canonical
    const canonical = await page.getAttribute('link[rel="canonical"]', 'href');
    expect(canonical).toContain('/assinatura');
  });

  test('Presente - Meta tags de presente', async ({ page }) => {
    await page.goto('/presente');
    
    // Verificar título de presente
    const title = await page.title();
    expect(title).toContain('Presente');
    expect(title).toContain('R$ 89');
    
    // Verificar meta description de presente
    const metaDescription = await page.getAttribute('meta[name="description"]', 'content');
    expect(metaDescription).toContain('presente');
    
    // Verificar canonical
    const canonical = await page.getAttribute('link[rel="canonical"]', 'href');
    expect(canonical).toContain('/presente');
  });

  test('Sitemap XML - Estrutura válida', async ({ page }) => {
    const response = await page.goto('/sitemap.xml');
    expect(response?.status()).toBe(200);
    
    const content = await page.textContent('body');
    expect(content).toContain('<?xml version="1.0" encoding="UTF-8"?>');
    expect(content).toContain('<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">');
    expect(content).toContain('<url>');
    expect(content).toContain('<loc>');
    expect(content).toContain('<lastmod>');
    expect(content).toContain('<changefreq>');
    expect(content).toContain('<priority>');
    
    // Verificar se todas as páginas principais estão no sitemap
    expect(content).toContain('/triagem');
    expect(content).toContain('/assinatura');
    expect(content).toContain('/presente');
    expect(content).toContain('/resgatar');
    expect(content).toContain('/obrigado');
    expect(content).toContain('/termos');
    expect(content).toContain('/privacidade');
    expect(content).toContain('/reembolso');
  });

  test('Robots.txt - Estrutura válida', async ({ page }) => {
    const response = await page.goto('/robots.txt');
    expect(response?.status()).toBe(200);
    
    const content = await page.textContent('body');
    expect(content).toContain('User-agent: *');
    expect(content).toContain('Allow: /');
    expect(content).toContain('Disallow: /admin');
    expect(content).toContain('Sitemap:');
    
    // Verificar se páginas principais estão permitidas
    expect(content).toContain('Allow: /triagem');
    expect(content).toContain('Allow: /relatorio');
    expect(content).toContain('Allow: /assinatura');
    expect(content).toContain('Allow: /presente');
    
    // Verificar se áreas administrativas estão bloqueadas
    expect(content).toContain('Disallow: /admin');
    expect(content).toContain('Disallow: /api/admin/');
  });

  test('Estrutura semântica - Headings hierárquicos', async ({ page }) => {
    await page.goto('/');
    
    // Verificar estrutura de headings
    const headings = await page.evaluate(() => {
      const h1s = document.querySelectorAll('h1');
      const h2s = document.querySelectorAll('h2');
      const h3s = document.querySelectorAll('h3');
      
      return {
        h1Count: h1s.length,
        h2Count: h2s.length,
        h3Count: h3s.length,
        h1Texts: Array.from(h1s).map(h => h.textContent?.trim()),
        h2Texts: Array.from(h2s).map(h => h.textContent?.trim()),
        h3Texts: Array.from(h3s).map(h => h.textContent?.trim())
      };
    });
    
    // Deve ter pelo menos um H1
    expect(headings.h1Count).toBeGreaterThan(0);
    expect(headings.h1Count).toBeLessThanOrEqual(1); // Apenas um H1 por página
    
    // Verificar se H1 tem texto descritivo
    expect(headings.h1Texts[0]).toBeTruthy();
    expect(headings.h1Texts[0]!.length).toBeGreaterThan(5);
  });

  test('URLs amigáveis - Estrutura limpa', async ({ page }) => {
    const urls = [
      '/',
      '/triagem',
      '/triagem/gastro',
      '/assinatura',
      '/presente',
      '/resgatar',
      '/obrigado',
      '/termos',
      '/privacidade',
      '/reembolso'
    ];
    
    for (const url of urls) {
      const response = await page.goto(url);
      expect(response?.status()).toBe(200);
      
      // Verificar se URL não tem parâmetros desnecessários
      expect(page.url()).not.toContain('?');
      expect(page.url()).not.toContain('#');
      
      // Verificar se URL não tem caracteres especiais
      expect(page.url()).not.toContain('%');
      expect(page.url()).not.toContain('&');
    }
  });

  test('Performance básica - Métricas essenciais', async ({ page }) => {
    await page.goto('/');
    
    // Aguardar carregamento completo
    await page.waitForLoadState('networkidle');
    
    // Verificar métricas de performance
    const performanceMetrics = await page.evaluate(() => {
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      return {
        loadTime: navigation.loadEventEnd - navigation.loadEventStart,
        domContentLoaded: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
        firstPaint: performance.getEntriesByName('first-paint')[0]?.startTime || 0,
        firstContentfulPaint: performance.getEntriesByName('first-contentful-paint')[0]?.startTime || 0,
        totalSize: performance.getEntriesByType('resource').reduce((total, resource) => {
          return total + ((resource as any).transferSize || 0);
        }, 0)
      };
    });
    
    // Verificar se métricas estão dentro dos limites aceitáveis
    expect(performanceMetrics.loadTime).toBeLessThan(3000); // 3 segundos
    expect(performanceMetrics.domContentLoaded).toBeLessThan(2000); // 2 segundos
    expect(performanceMetrics.firstContentfulPaint).toBeLessThan(2500); // 2.5 segundos
    
    // Verificar se tamanho total não é excessivo
    expect(performanceMetrics.totalSize).toBeLessThan(2000000); // 2MB
  });

  test('Links internos - Estrutura de navegação', async ({ page }) => {
    await page.goto('/');
    
    // Verificar se há links de navegação principais
    const navLinks = await page.evaluate(() => {
      const links = document.querySelectorAll('nav a, header a');
      return Array.from(links).map(link => ({
        text: link.textContent?.trim(),
        href: link.getAttribute('href')
      }));
    });
    
    expect(navLinks.length).toBeGreaterThan(0);
    
    // Verificar se há links para páginas principais
    const hrefs = navLinks.map(link => link.href);
    expect(hrefs.some(href => href?.includes('/triagem'))).toBe(true);
    expect(hrefs.some(href => href?.includes('/assinatura'))).toBe(true);
    expect(hrefs.some(href => href?.includes('/presente'))).toBe(true);
  });

  test('Imagens - Alt text e otimização', async ({ page }) => {
    await page.goto('/');
    
    // Verificar se todas as imagens têm alt text
    const images = await page.evaluate(() => {
      const imgs = document.querySelectorAll('img');
      return Array.from(imgs).map(img => ({
        src: img.src,
        alt: img.alt,
        loading: img.loading
      }));
    });
    
    for (const img of images) {
      expect(img.alt).toBeTruthy();
      expect(img.alt.length).toBeGreaterThan(0);
    }
    
    // Verificar se imagens têm lazy loading
    const lazyImages = images.filter(img => img.loading === 'lazy');
    expect(lazyImages.length).toBeGreaterThan(0);
  });

  test('Schema.org - Dados estruturados', async ({ page }) => {
    await page.goto('/');
    
    // Verificar se há dados estruturados
    const structuredData = await page.evaluate(() => {
      const scripts = document.querySelectorAll('script[type="application/ld+json"]');
      return Array.from(scripts).map(script => {
        try {
          return JSON.parse(script.textContent || '');
        } catch {
          return null;
        }
      }).filter(data => data !== null);
    });
    
    // Verificar se há pelo menos um schema
    expect(structuredData.length).toBeGreaterThan(0);
    
    // Verificar tipos de schema comuns
    const schemaTypes = structuredData.map(data => data['@type']);
    expect(schemaTypes.some(type => 
      ['WebSite', 'Organization', 'MedicalWebPage', 'HealthAndBeautyBusiness'].includes(type)
    )).toBe(true);
  });
});
