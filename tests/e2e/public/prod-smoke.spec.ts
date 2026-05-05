import { dismissCookieBanner } from '../support/auth';
import { isExternalBaseURL, missingEnv, productionReportId } from '../support/env';
import { expect, test } from '../support/test';

test.describe('MeJoy production public smoke @prod-smoke', () => {
  test('public routes and health endpoints stay operational without side effects', async ({
    page,
    request,
  }) => {
    test.skip(!isExternalBaseURL, 'Prod smoke only runs against a deployed MeJoy environment.');
    test.skip(
      missingEnv(['PRODUCTION_REPORT_ID']).length > 0,
      'PRODUCTION_REPORT_ID is required for public report smoke.',
    );

    const publicChecks: Array<{ path: string; match: RegExp | string }> = [
      { path: '/', match: /vida real|repensada|Telemedicina personalizada/i },
      { path: '/emagrecimento', match: /Emagrecimento com|avaliação médica/i },
      { path: '/triagem/emagrecimento', match: /perfil clínico|Qual é sua altura|Antes de começar/i },
      {
        path: `/emagrecimento/relatorio?id=${encodeURIComponent(productionReportId)}`,
        match: /Fechamento nesta página|Continue seu plano sem sair desta página|Continuar com meu plano/i,
      },
      { path: '/cart', match: /Carrinho|Seu carrinho/i },
      { path: '/checkout', match: /Carrinho vazio|Pagamento/i },
    ];

    for (const check of publicChecks) {
      await page.goto(check.path);
      await dismissCookieBanner(page);
      await expect(page.locator('body')).toContainText(check.match);
    }

    for (const endpoint of [
      '/api/health',
      '/api/health/store-v2',
      '/api/health/catalog',
      '/api/health/payments',
    ]) {
      const response = await request.get(endpoint);
      expect(response.status(), `${endpoint} should stay readable in prod smoke.`).toBe(200);
    }
  });
});
