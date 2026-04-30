import { test, expect } from '@playwright/test';

test.describe('Admin Dashboard', () => {
  test('should load admin dashboard', async ({ page }) => {
    // 1. Visit admin page
    await page.goto('/admin');
    
    // 2. Should redirect to login or show admin interface
    await expect(page).toHaveURL(/admin/);
    
    // 3. Verify admin elements are present
    await expect(page.locator('text=Dashboard')).toBeVisible();
  });

  test('should handle admin API endpoints', async ({ page }) => {
    // 1. Test health endpoint
    const healthResponse = await page.request.get('/api/health');
    expect(healthResponse.status()).toBe(200);
    
    // 2. Test admin stats endpoint (should require auth)
    const statsResponse = await page.request.get('/api/admin/stats');
    expect(statsResponse.status()).toBeGreaterThanOrEqual(401); // Should require auth
  });
});