import { createEmagrecimentoReportViaApi } from '../support/triage';
import { expect, test } from '../support/test';

test.describe('MeJoy report flow @pr-regression', () => {
  test('report renders the new decision fold and inline checkout shell', async ({ page, request }) => {
    const { reportPath } = await createEmagrecimentoReportViaApi(request);

    await page.goto(reportPath);

    await expect(
      page.getByText('Seu programa pode ser fechado agora, nesta mesma pagina').first(),
    ).toBeVisible();
    await expect(page.getByText('Escolha o plano do seu programa').first()).toBeVisible();
    await expect(page.locator('#report-inline-checkout')).toBeVisible();
    await expect(
      page.getByText('Continue seu plano sem sair desta página').first(),
    ).toBeVisible();

    await page
      .getByRole('button', { name: /Abrir checkout agora|Continuar nesta pagina|Continuar com meu plano/i })
      .first()
      .click();
    await expect(page.getByText('Alterar trilha ou plano')).toBeVisible();
  });

  test('standalone emagrecimento checkout stays reachable', async ({ request }) => {
    const { triageId } = await createEmagrecimentoReportViaApi(request);
    const response = await request.get(
      `/emagrecimento/checkout?plano=programa-3m&reportId=${encodeURIComponent(triageId)}`,
    );

    expect(response.ok()).toBeTruthy();
  });
});
