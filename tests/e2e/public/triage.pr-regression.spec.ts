import { ensureEmagrecimentoTriageShell } from '../support/triage';
import { expect, test } from '../support/test';

test.describe('MeJoy triage shell @pr-regression', () => {
  test('first page blocks submit until required answers are present', async ({ page }) => {
    await ensureEmagrecimentoTriageShell(page);

    await page.getByRole('button', { name: 'Continuar com segurança' }).click();
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
    await page.locator('[data-step-key="data_nascimento"] input').fill('01/01/1990');

    await page.getByRole('button', { name: 'Continuar com segurança' }).click();
    await expect(page.getByRole('heading', { level: 2, name: /segurança antes/i })).toBeVisible();
    await expect(page.getByRole('heading', { level: 2 }).first()).toContainText(
      'Segurança antes de qualquer prescrição.',
    );
  });

  test('mobile intake keeps the primary action visible without horizontal scroll', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await ensureEmagrecimentoTriageShell(page);

    await expect(page.locator('[data-testid="emagrecimento-intake"]')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Continuar com segurança' })).toBeVisible();

    const hasHorizontalOverflow = await page.evaluate(() => {
      const root = document.documentElement;
      return root.scrollWidth > root.clientWidth + 1;
    });
    expect(hasHorizontalOverflow).toBeFalsy();
  });
});
