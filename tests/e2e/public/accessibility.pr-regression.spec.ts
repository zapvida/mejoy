import AxeBuilder from '@axe-core/playwright';

import { createEmagrecimentoReportViaApi } from '../support/triage';
import { expect, test } from '../support/test';

test.describe('MeJoy critical accessibility @pr-regression', () => {
  test('home, triage and report have no critical axe violations', async ({ page, request }) => {
    const report = await createEmagrecimentoReportViaApi(request);

    for (const path of ['/', '/triagem/emagrecimento', report.reportPath]) {
      await page.goto(path);
      const results = await new AxeBuilder({ page })
        .disableRules(['color-contrast'])
        .withTags(['wcag2a', 'wcag2aa'])
        .analyze();

      const criticalViolations = results.violations.filter((violation) => violation.impact === 'critical');
      expect(criticalViolations, `Critical accessibility violations detected on ${path}`).toEqual([]);
    }
  });
});
