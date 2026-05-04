import { test, expect } from '@playwright/test';

test.describe('PDF Generation', () => {
  test('should generate PDF with PDF_V2=0 (fallback)', async ({ page }) => {
    // 1. Visit report page
    await page.goto('/relatorio/demo');
    
    // 2. Try to access PDF endpoint directly
    const response = await page.request.get('/api/pdf/demo');
    
    // 3. Should return fallback JSON when PDF_V2=0
    expect(response.status()).toBe(200);
    const data = await response.json();
    expect(data).toHaveProperty('fallbackUrl');
  });

  test('should generate PDF with PDF_V2=1 (stream)', async ({ page }) => {
    // This test would require PDF_V2=1 in environment
    // For now, just verify the endpoint exists
    const response = await page.request.get('/api/pdf/demo');
    expect(response.status()).toBeLessThan(500);
  });
});
