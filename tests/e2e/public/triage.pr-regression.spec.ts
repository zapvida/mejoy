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
    await page.locator('[data-step-key="altura"] input').fill('168');
    await page.locator('[data-step-key="peso"] input').fill('82');
    await page.locator('[data-step-key="peso_meta"] input').fill('70');
    await page.getByRole('button', { name: 'Masculino' }).click();
    await page.locator('[data-step-key="data_nascimento"] input[type="date"]').fill('1990-01-01');

    await page.getByRole('button', { name: 'Próximo' }).click();
    await expect(page.getByRole('heading', { level: 1 })).toContainText(
      'Agora precisamos do seu histórico de saúde.',
    );
  });
});
