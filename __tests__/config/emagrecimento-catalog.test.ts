import {
  buildEmagrecimentoPlans,
  getEmagrecimentoPlanByApiKey,
  resolveEmagrecimentoCommercialSelection,
} from '@/config/zapfarm/emagrecimento-plans';
import { ZAPFARM_PRODUCTS } from '@/config/zapfarm/products';

describe('emagrecimento commercial catalog', () => {
  it('uses the approved default entry price for the public obesity funnel', () => {
    const plans = buildEmagrecimentoPlans({
      trilha: 'alternativas_clinicas',
      principio: 'rybelsus',
    });

    expect(plans[0]?.molecule).toBe('rybelsus');
    expect(plans[0]?.totalAmount).toBe(1200);
    expect(plans[0]?.priceMain).toMatch(/12x de R\$.*100,00/);
    expect(plans[1]?.totalAmount).toBe(3300);
    expect(plans[2]?.totalAmount).toBe(6500);
  });

  it('maps tirzepatida journeys to the Mounjaro commercial catalog', () => {
    const selection = resolveEmagrecimentoCommercialSelection({
      trilha: 'tirzepatida',
      principio: 'tirzepatida',
    });

    expect(selection.molecule).toBe('mounjaro');

    const premium = getEmagrecimentoPlanByApiKey('premium', {
      trilha: 'tirzepatida',
      principio: 'mounjaro',
    });

    expect(premium.moleculeLabel).toBe('Mounjaro');
    expect(premium.totalAmount).toBe(14000);
    expect(premium.installment12Cents).toBe(116667);
  });

  it('maps semaglutida journeys to Wegovy unless Rybelsus was explicitly chosen', () => {
    const wegovy = getEmagrecimentoPlanByApiKey('basico', {
      trilha: 'semaglutida',
      principio: 'wegovy',
    });
    const rybelsus = getEmagrecimentoPlanByApiKey('basico', {
      trilha: 'semaglutida',
      principio: 'rybelsus',
    });

    expect(wegovy.molecule).toBe('wegovy');
    expect(wegovy.totalAmount).toBe(1500);
    expect(rybelsus.molecule).toBe('rybelsus');
    expect(rybelsus.totalAmount).toBe(1200);
  });
});

describe('emagrecimento public copy guardrails', () => {
  const obesityProduct = ZAPFARM_PRODUCTS.emagrecimento;
  const serialized = JSON.stringify(obesityProduct).toLowerCase();

  it('keeps the public obesity product aligned with the new pricing source of truth', () => {
    expect(obesityProduct.plans.basico.description).toMatch(/1\.200,00/);
    expect(obesityProduct.plans.completo.description).toMatch(/3\.300,00/);
    expect(obesityProduct.plans.premium.description).toMatch(/6\.500,00/);
  });

  it('blocks prohibited public claims in the hero obesity product', () => {
    expect(serialized).not.toContain('cura do envelhecimento');
    expect(serialized).not.toContain('reversão do envelhecimento');
    expect(serialized).not.toContain('glp-1 a partir de r$ 99');
    expect(serialized).not.toContain('resultado garantido');
    expect(serialized).not.toContain('prescrição garantida');
    expect(serialized).not.toContain('emagrecimento garantido');
  });
});
