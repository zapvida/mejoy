import { test, expect } from '@playwright/test'

test.describe('Homepage', () => {
  test('should load homepage successfully', async ({ page }) => {
    await page.goto('/')
    await expect(page).toHaveTitle(/Alloe Health/)
  })

  test('should display main navigation', async ({ page }) => {
    await page.goto('/')
    
    await expect(page.getByText('Alloe Health')).toBeVisible()
    await expect(page.getByText('Triagem')).toBeVisible()
    await expect(page.getByText('Sobre')).toBeVisible()
    await expect(page.getByText('FAQ')).toBeVisible()
  })

  test('should display hero section', async ({ page }) => {
    await page.goto('/')
    
    const heroHeading = page.getByRole('heading', { level: 1 })
    await expect(heroHeading).toBeVisible()
    
    const ctaButton = page.getByRole('button', { name: /Fazer Triagem|Começar Minha Avaliação/ })
    await expect(ctaButton).toBeVisible()
  })

  test('should display how it works section', async ({ page }) => {
    await page.goto('/')
    
    await expect(page.getByText('Como funciona?')).toBeVisible()
    
    const processSteps = [
      'Inicie sua triagem',
      'Responda em menos de 5 minutos',
      'Veja seu diagnóstico',
      'Descubra como melhorar',
      'Compartilhe com seus médicos',
      'Consulte um médico'
    ]
    
    for (const step of processSteps) {
      await expect(page.getByText(step)).toBeVisible()
    }
  })

  test('should display business section', async ({ page }) => {
    await page.goto('/')
    
    await expect(page.getByText('É dono de empresa, clínica ou farmácia?')).toBeVisible()
    await expect(page.getByText('Fale com nosso time Agora')).toBeVisible()
  })

  test('should display mission/vision/values section', async ({ page }) => {
    await page.goto('/')
    
    await expect(page.getByText('Por que o Alloe Health foi criado?')).toBeVisible()
    await expect(page.getByText('Nossa Missão')).toBeVisible()
    await expect(page.getByText('Nossa Visão')).toBeVisible()
    await expect(page.getByText('O Que Valorizamos')).toBeVisible()
  })

  test('should display testimonials section', async ({ page }) => {
    await page.goto('/')
    
    await expect(page.getByText('O que as pessoas estão dizendo?')).toBeVisible()
  })

  test('should display authority section', async ({ page }) => {
    await page.goto('/')
    
    await expect(page.getByText('Autoridade e Confiança')).toBeVisible()
  })

  test('should display guarantee section', async ({ page }) => {
    await page.goto('/')
    
    await expect(page.getByText('Garantia de Confiança Total')).toBeVisible()
  })

  test('should display FAQ section', async ({ page }) => {
    await page.goto('/')
    
    await expect(page.getByText('Perguntas Frequentes')).toBeVisible()
  })

  test('should display final CTA section', async ({ page }) => {
    await page.goto('/')
    
    await expect(page.getByText('Entenda sua saúde agora')).toBeVisible()
  })

  test('should have working navigation links', async ({ page }) => {
    await page.goto('/')
    
    // Test Triagem link
    await page.getByText('Triagem').click()
    await expect(page).toHaveURL('/triagem')
    
    await page.goto('/')
    
    // Test Sobre link
    await page.getByText('Sobre').click()
    await expect(page).toHaveURL('/quem-somos')
    
    await page.goto('/')
    
    // Test FAQ link
    await page.getByText('FAQ').click()
    await expect(page).toHaveURL('/faq')
  })

  test('should have working CTA buttons', async ({ page }) => {
    await page.goto('/')
    
    const ctaButton = page.getByRole('button', { name: /Fazer Triagem|Começar Minha Avaliação/ })
    await ctaButton.click()
    await expect(page).toHaveURL('/triagem')
  })

  test('should have working WhatsApp button', async ({ page }) => {
    await page.goto('/')
    
    const whatsappButton = page.getByTitle('Fale com um médico agora')
    await expect(whatsappButton).toBeVisible()
    
    const href = await whatsappButton.getAttribute('href')
    expect(href).toContain('zapvida.com')
  })

  test('should be responsive on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 })
    await page.goto('/')
    
    // Check if mobile menu button is visible
    const menuButton = page.getByRole('button').first()
    await expect(menuButton).toBeVisible()
    
    // Check if main content is visible
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
  })

  test('should have correct color scheme', async ({ page }) => {
    await page.goto('/')
    
    // Check if page has dark background
    const body = page.locator('body')
    await expect(body).toHaveClass(/bg-black/)
    
    // Check if text is white
    const mainHeading = page.getByRole('heading', { level: 1 })
    await expect(mainHeading).toHaveClass(/text-white|text-green/)
  })
})
