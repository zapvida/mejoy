import { test, expect } from '@playwright/test';

const BASE = process.env.BASE_URL || 'http://localhost:3000';

test.describe('B2B Flow - Sandbox to Triage', () => {
  test('sandbox carrega draft e abre triagem grátis', async ({ page, request }) => {
    // 1) cria draft via API
    const create = await request.post(`${BASE}/api/branding/draft`, {
      data: {
        fantasyName: 'Clínica Teste QA',
        brandColor: '#a34900',
        accentColor: '#050505',
        ctaText: 'Agendar Consulta Já',
        ctaUrl: 'https://wa.me/5547990099923'
      },
      headers: { 'Content-Type': 'application/json' }
    });

    expect(create.status()).toBeGreaterThanOrEqual(200);
    const body = await create.json();
    const id = body.id;
    expect(id).toBeTruthy();

    // 2) abre sandbox
    await page.goto(`${BASE}/b2b/sandbox?draft=${id}`);
    
    // Aguarda carregar (pode ter loading)
    await page.waitForLoadState('networkidle', { timeout: 10000 });
    
    // 3) valida presença do nome fantasia ou "White-label"
    const hasContent = await page.getByText(/demo|white-label|clínica teste qa/i).isVisible({ timeout: 10000 }).catch(() => false);
    expect(hasContent).toBeTruthy();

    // 4) valida botão de testar triagem
    const btn = page.getByRole('button', { name: /testar triagem/i });
    await expect(btn).toBeVisible({ timeout: 5000 });

    // 5) clica para ir à triagem
    await btn.click();

    // 6) valida que a triagem abriu (header e algum campo inicial)
    await expect(page).toHaveURL(new RegExp(`/triag(en|ens?)/`), { timeout: 10000 });
    await expect(page.locator('header, nav, [role="navigation"]').first()).toBeVisible({ timeout: 5000 });
  });

  test('sandbox aplica branding do draft', async ({ page, request }) => {
    // Cria draft com cores específicas
    const create = await request.post(`${BASE}/api/branding/draft`, {
      data: {
        fantasyName: 'Clínica Branding Test',
        brandColor: '#ff6b35',
        accentColor: '#004e89',
        ctaText: 'Falar com médico',
        ctaUrl: 'https://wa.me/5547990099923'
      },
      headers: { 'Content-Type': 'application/json' }
    });

    const body = await create.json();
    const id = body.id;

    // Abre sandbox
    await page.goto(`${BASE}/b2b/sandbox?draft=${id}`);
    await page.waitForLoadState('networkidle', { timeout: 10000 });

    // Verifica se o nome fantasia aparece
    await expect(page.getByText(/clínica branding test/i)).toBeVisible({ timeout: 5000 });

    // Verifica se sessionStorage contém o draft
    const draftInStorage = await page.evaluate(() => {
      return window.sessionStorage.getItem('b2b_draft');
    });
    expect(draftInStorage).toBeTruthy();
    
    const parsed = JSON.parse(draftInStorage!);
    expect(parsed.fantasyName).toBe('Clínica Branding Test');
    expect(parsed.brandColor).toBe('#ff6b35');
  });
});

test.describe('B2B Flow - Relatório e PDF', () => {
  test.skip('relatório/PDF exibe CTA e botão de download presentes', async ({ page }) => {
    // Este teste assume que você completou manualmente uma triagem e já tem um relatório recente.
    // Abra uma URL conhecida ou pule este teste se não tiver ID.
  });
});

