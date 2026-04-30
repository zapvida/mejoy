import { test, expect } from '@playwright/test';

const BASE = process.env.BASE_URL || 'https://www.zapfarm.com';

test.describe('B2B – produção', () => {
  test('root: CTAs visíveis + navegação configurar/sandbox', async ({ page }) => {
    await page.goto(BASE + '/');
    await expect(page.getByText(/Triagens inteligentes/i)).toBeVisible();

    const ctaPersonalizar = page.getByTestId('cta-assinar-hero');
    const ctaDemo = page.getByTestId('cta-demo-hero');
    await expect(ctaPersonalizar).toBeVisible();
    await expect(ctaDemo).toBeVisible();

    // Testar navegação para configurar
    await ctaPersonalizar.click();
    await expect(page).toHaveURL(/\/b2b\/configurar/);
    await expect(page.getByTestId('cta-continuar-config')).toBeVisible();

    // Voltar e testar sandbox
    await page.goto(BASE + '/');
    await ctaDemo.click();
    await expect(page).toHaveURL(/\/b2b\/sandbox/);
    await expect(page.getByTestId('cta-assinar-sandbox')).toBeVisible();

    await page.getByTestId('cta-assinar-sandbox').click();
    await expect(page).toHaveURL(/\/b2b\/assinar/);
    await expect(page.getByTestId('submit-assinar')).toBeVisible();
  });

  test('wizard: página configurar carrega e mostra preview', async ({ page }) => {
    await page.goto(BASE + '/b2b/configurar');
    
    // Verificar elementos principais
    await expect(page.getByText(/Personalize sua marca/i)).toBeVisible();
    await expect(page.getByText(/Preview/i)).toBeVisible();
    await expect(page.getByTestId('cta-continuar-config')).toBeVisible();
    await expect(page.getByTestId('preview-live')).toBeVisible();
  });

  test('smoke: rotas críticas respondem', async ({ request }) => {
    const ok = async (p: string) => {
      const r = await request.get(BASE + p);
      expect(r.status(), `GET ${p}`).toBeGreaterThanOrEqual(200);
      expect(r.status(), `GET ${p}`).toBeLessThan(400);
    };
    
    await ok('/');
    await ok('/#cases');
    await ok('/b2b/configurar');
    await ok('/b2b/sandbox');
    await ok('/b2b/assinar');
    await ok('/triagem');

    // API deve retornar 405 para GET em endpoint POST-only
    const vit = await request.get(BASE + '/api/analytics/vitals');
    expect(vit.status()).toBe(405);
  });
});

