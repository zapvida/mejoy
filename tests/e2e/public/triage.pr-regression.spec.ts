import { ensureEmagrecimentoTriageShell } from '../support/triage';
import { expect, test } from '../support/test';

test.describe('MeJoy triage shell @pr-regression', () => {
  test('first page blocks submit until required answers are present', async ({ page }) => {
    await ensureEmagrecimentoTriageShell(page);

    await page.getByRole('button', { name: 'Próximo' }).click();
    await expect(page.getByText('Confirme os documentos para continuar.')).toBeVisible();
    await expect(page.getByText('Responda para continuar.').first()).toBeVisible();
  });

  test('first page advances with valid eligibility data', async ({ page }) => {
    await ensureEmagrecimentoTriageShell(page);

    await page.getByRole('button', {
      name: /Confirmo que li os documentos essenciais da jornada/i,
    }).click();
    await page.getByLabel('Qual sua altura?').fill('168');
    await page.getByLabel('Qual seu peso atual?').fill('82');
    await page.getByLabel('Qual seu peso-meta (objetivo)?').fill('70');
    await page.getByRole('button', { name: 'Masculino' }).click();
    await page.getByLabel('Data de nascimento').fill('1990-01-01');

    await page.getByRole('button', { name: 'Próximo' }).click();
    await expect(page.getByRole('heading', { level: 1 })).toContainText(
      'Existe alguma contraindicação importante para a linha GLP-1?',
    );
  });
});
