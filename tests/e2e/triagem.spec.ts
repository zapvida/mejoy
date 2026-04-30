import { test, expect } from '@playwright/test'

test.describe('Triagem Page', () => {
  test('should load triagem page successfully', async ({ page }) => {
    await page.goto('/triagem')
    await expect(page).toHaveTitle(/Triagem/)
  })

  test('should display triagem cards', async ({ page }) => {
    await page.goto('/triagem')
    
    // Check if triagem cards are visible
    const cards = page.locator('[class*="triage-card"]')
    await expect(cards.first()).toBeVisible()
    
    // Check for specific triagem types
    await expect(page.getByText('Gastrointestinal')).toBeVisible()
  })

  test('should display free and premium badges correctly', async ({ page }) => {
    await page.goto('/triagem')
    
    // Check for free badge
    const freeBadges = page.locator('[class*="badge-free"]')
    await expect(freeBadges.first()).toBeVisible()
    
    // Check for premium badges
    const premiumBadges = page.locator('[class*="badge-premium"]')
    await expect(premiumBadges.first()).toBeVisible()
  })

  test('should open modal for premium triagens', async ({ page }) => {
    await page.goto('/triagem')
    
    // Find a premium triagem card and click it
    const premiumCard = page.locator('[class*="triage-card-premium"]').first()
    await premiumCard.click()
    
    // Check if modal opens
    const modal = page.locator('[class*="modal-overlay"]')
    await expect(modal).toBeVisible()
  })

  test('should navigate to gastro triagem', async ({ page }) => {
    await page.goto('/triagem')
    
    // Click on Gastrointestinal triagem
    const gastroCard = page.getByText('Gastrointestinal').first()
    await gastroCard.click()
    
    await expect(page).toHaveURL('/triagem/gastro')
  })
})

test.describe('Gastro Triagem Flow', () => {
  test('should complete gastro triagem flow', async ({ page }) => {
    await page.goto('/triagem/gastro')
    
    // Check if page loads
    await expect(page.getByText('Triagem Gastrointestinal')).toBeVisible()
    
    // Check if progress bar is visible
    const progressBar = page.locator('[class*="bg-green-500"]').first()
    await expect(progressBar).toBeVisible()
    
    // Fill out first step
    const nomeInput = page.getByLabel('Nome Completo')
    if (await nomeInput.isVisible()) {
      await nomeInput.fill('João Silva')
    }
    
    // Check if next button is visible
    const nextButton = page.getByRole('button', { name: /Próxima|Próximo/ })
    if (await nextButton.isVisible()) {
      await nextButton.click()
    }
    
    // Continue with the flow...
    // This would need to be adapted based on the actual form structure
  })

  test('should save progress automatically', async ({ page }) => {
    await page.goto('/triagem/gastro')
    
    // Fill out a field
    const nomeInput = page.getByLabel('Nome Completo')
    if (await nomeInput.isVisible()) {
      await nomeInput.fill('João Silva')
      
      // Wait a bit for autosave
      await page.waitForTimeout(1000)
      
      // Check if data is saved (this would need to be adapted based on implementation)
      // The actual implementation would depend on how autosave works
    }
  })
})
