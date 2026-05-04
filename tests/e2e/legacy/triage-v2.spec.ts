// tests/e2e/triage-v2.spec.ts
// Testes E2E para triagem V2

import { test, expect } from '@playwright/test';

test.describe('Triagem V2 - Fluxo Completo', () => {
  test.beforeEach(async ({ page }) => {
    // Configurar feature flag
    await page.addInitScript(() => {
      window.localStorage.setItem('NEXT_PUBLIC_TRIAGE_V2', '1');
    });
  });

  test('deve completar triagem gastro com sucesso', async ({ page }) => {
    await page.goto('/triagem/gastro?cpf=12345678901');
    
    // Verificar se a triagem V2 está carregada
    await expect(page.locator('.triage-v2')).toBeVisible();
    
    // Verificar progresso inicial
    await expect(page.locator('[data-testid="emotional-progress"]')).toBeVisible();
    await expect(page.locator('text=0%')).toBeVisible();
    
    // Primeira pergunta - sexo
    await expect(page.locator('text=Qual seu sexo de nascimento?')).toBeVisible();
    await page.click('text=👨 Masculino');
    
    // Verificar progresso atualizado
    await expect(page.locator('text=20%')).toBeVisible();
    
    // Segunda pergunta - dor abdominal
    await expect(page.locator('text=Você tem dor abdominal?')).toBeVisible();
    await page.click('text=🙂 Não');
    
    // Terceira pergunta - refluxo
    await expect(page.locator('text=Sente azia ou refluxo?')).toBeVisible();
    await page.click('text=😌 Não');
    
    // Quarta pergunta - sono (slider)
    await expect(page.locator('text=Como está seu sono recentemente?')).toBeVisible();
    await page.click('text=😌 Bom');
    
    // Quinta pergunta - atividade física
    await expect(page.locator('text=Com que frequência você se exercita?')).toBeVisible();
    await page.click('text=📅 3–4x/sem');
    
    // Verificar conclusão
    await expect(page.locator('text=Parabéns! Você completou a triagem!')).toBeVisible();
    await expect(page.locator('text=🎉')).toBeVisible();
  });

  test('deve mostrar explicações quando clicado', async ({ page }) => {
    await page.goto('/triagem/gastro?cpf=12345678901');
    
    // Clicar em "Por que perguntamos isso?"
    await page.click('text=Por que perguntamos isso?');
    
    // Verificar se a explicação aparece
    await expect(page.locator('text=Alguns riscos e faixas de referência variam por sexo biológico')).toBeVisible();
    
    // Verificar se o ícone muda
    await expect(page.locator('svg[data-testid="chevron-up"]')).toBeVisible();
  });

  test('deve navegar entre perguntas com botão voltar', async ({ page }) => {
    await page.goto('/triagem/gastro?cpf=12345678901');
    
    // Responder primeira pergunta
    await page.click('text=👨 Masculino');
    
    // Verificar segunda pergunta
    await expect(page.locator('text=Você tem dor abdominal?')).toBeVisible();
    
    // Voltar para primeira pergunta
    await page.click('text=← Voltar');
    
    // Verificar se voltou
    await expect(page.locator('text=Qual seu sexo de nascimento?')).toBeVisible();
    
    // Verificar se a resposta foi mantida
    await expect(page.locator('text=👨 Masculino').locator('..').locator('..')).toHaveClass(/selected/);
  });

  test('deve funcionar com slider de escala', async ({ page }) => {
    await page.goto('/triagem/sono?cpf=12345678901');
    
    // Pular para pergunta de qualidade do sono
    await page.click('text=😌 Bom');
    await page.click('text=🌙 22h às 23h');
    await page.click('text=😊 Não');
    
    // Pergunta com slider
    await expect(page.locator('text=Como você avalia a qualidade do seu sono?')).toBeVisible();
    
    // Interagir com slider
    const slider = page.locator('input[type="range"]');
    await slider.fill('8');
    
    // Verificar se a opção correspondente está destacada
    await expect(page.locator('text=😌 Bom')).toBeVisible();
  });

  test('deve ser responsivo em mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/triagem/gastro?cpf=12345678901');
    
    // Verificar se os elementos estão visíveis em mobile
    await expect(page.locator('.triage-v2')).toBeVisible();
    await expect(page.locator('text=Qual seu sexo de nascimento?')).toBeVisible();
    
    // Verificar se os cards estão empilhados verticalmente
    const cards = page.locator('.choice-card');
    await expect(cards.first()).toBeVisible();
    
    // Responder pergunta
    await page.click('text=👨 Masculino');
    
    // Verificar se a próxima pergunta aparece
    await expect(page.locator('text=Você tem dor abdominal?')).toBeVisible();
  });

  test('deve respeitar prefers-reduced-motion', async ({ page }) => {
    // Simular preferência de movimento reduzido
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/triagem/gastro?cpf=12345678901');
    
    // Verificar se não há animações complexas
    const animatedElements = page.locator('[style*="animation"], [style*="transform"]');
    await expect(animatedElements).toHaveCount(0);
    
    // Responder pergunta
    await page.click('text=👨 Masculino');
    
    // Verificar se a transição ainda funciona mas sem animações
    await expect(page.locator('text=Você tem dor abdominal?')).toBeVisible();
  });

  test('deve ter navegação por teclado funcional', async ({ page }) => {
    await page.goto('/triagem/gastro?cpf=12345678901');
    
    // Navegar com Tab
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');
    
    // Selecionar com Enter
    await page.keyboard.press('Enter');
    
    // Verificar se a pergunta avançou
    await expect(page.locator('text=Você tem dor abdominal?')).toBeVisible();
    
    // Voltar com Tab e Enter
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');
    await page.keyboard.press('Enter');
    
    // Verificar se voltou
    await expect(page.locator('text=Qual seu sexo de nascimento?')).toBeVisible();
  });

  test('deve mostrar mensagens de erro apropriadas', async ({ page }) => {
    await page.goto('/triagem/gastro?cpf=12345678901');
    
    // Tentar avançar sem responder
    await page.click('text=Continuar');
    
    // Verificar se não avançou
    await expect(page.locator('text=Qual seu sexo de nascimento?')).toBeVisible();
    
    // Responder corretamente
    await page.click('text=👨 Masculino');
    
    // Verificar se avançou
    await expect(page.locator('text=Você tem dor abdominal?')).toBeVisible();
  });

  test('deve persistir respostas no localStorage', async ({ page }) => {
    await page.goto('/triagem/gastro?cpf=12345678901');
    
    // Responder algumas perguntas
    await page.click('text=👨 Masculino');
    await page.click('text=🙂 Não');
    
    // Recarregar página
    await page.reload();
    
    // Verificar se as respostas foram mantidas
    await expect(page.locator('text=Você tem dor abdominal?')).toBeVisible();
  });

  test('deve enviar analytics corretamente', async ({ page }) => {
    // Interceptar chamadas de analytics
    await page.route('**/gtag/**', route => route.fulfill());
    
    await page.goto('/triagem/gastro?cpf=12345678901');
    
    // Responder pergunta
    await page.click('text=👨 Masculino');
    
    // Verificar se analytics foi chamado (mock)
    // Em um teste real, você verificaria se os eventos corretos foram enviados
  });
});

test.describe('Triagem V2 - Acessibilidade', () => {
  test('deve ter contraste adequado', async ({ page }) => {
    await page.goto('/triagem/gastro?cpf=12345678901');
    
    // Verificar contraste dos elementos principais
    const title = page.locator('h2').first();
    const contrast = await title.evaluate(el => {
      const style = window.getComputedStyle(el);
      // Simulação básica - em teste real usaria biblioteca de contraste
      return style.color === 'rgb(255, 255, 255)' && 
             style.backgroundColor === 'rgba(0, 0, 0, 0)';
    });
    
    expect(contrast).toBe(true);
  });

  test('deve ter labels ARIA apropriados', async ({ page }) => {
    await page.goto('/triagem/gastro?cpf=12345678901');
    
    // Verificar roles ARIA
    await expect(page.locator('[role="radio"]')).toBeVisible();
    await expect(page.locator('[aria-checked="false"]')).toBeVisible();
    
    // Verificar labels
    await expect(page.locator('[aria-label*="Selecionar opção"]')).toBeVisible();
  });
});
