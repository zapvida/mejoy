import { test, expect } from '@playwright/test';

test.describe('Triage → Report Flow', () => {
  test('should complete triage and generate report', async ({ page }) => {
    // 1. Start triage
    await page.goto('/triagem/gastro');
    
    // 2. Fill patient info
    await page.fill('input[name="name"]', 'João Silva');
    await page.selectOption('select[name="sex"]', 'masculino');
    await page.fill('input[name="age"]', '35');
    await page.fill('input[name="weight"]', '80');
    await page.fill('input[name="height"]', '175');
    
    // 3. Complete triage steps
    await page.click('button[type="submit"]');
    
    // 4. Answer triage questions
    // This would need to be adapted based on actual triage structure
    await page.waitForSelector('[data-testid="triage-question"]');
    
    // 5. Verify completion
    await expect(page.locator('text=Triagem concluída')).toBeVisible();
    
    // 6. Check report generation
    await page.waitForURL(/relatorio/);
    await expect(page.locator('text=Relatório')).toBeVisible();
  });

  test('should handle PDF generation', async ({ page }) => {
    // 1. Visit a report page
    await page.goto('/relatorio/demo');
    
    // 2. Click PDF download
    await page.click('text=Baixar PDF');
    
    // 3. Verify PDF generation (check for download or redirect)
    await page.waitForEvent('download');
  });
});
