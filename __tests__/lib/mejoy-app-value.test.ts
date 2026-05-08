/// <reference types="jest" />
/** @jest-environment node */

import {
  buildEntitlementSnapshot,
  buildProductAppValue,
  buildProtocolContext,
} from '@/lib/mejoy-app/value';

describe('mejoy app value and entitlement snapshot', () => {
  it('maps protocol context from slug and keeps related care lane', () => {
    const context = buildProtocolContext({ productSlug: 'sono' });

    expect(context.primaryProtocolSlug).toBe('sono');
    expect(context.careLane).toBe('whole_person_care');
    expect(context.relatedProtocols.length).toBeGreaterThan(0);
  });

  it('builds premium app value with top feature matrix', () => {
    const value = buildProductAppValue({
      productSlug: 'emagrecimento',
      productName: 'Programa MeJoy',
    });

    expect(value.appIncluded).toBe(true);
    expect(value.appTier).toBe('premium_full_access');
    expect(value.featureMatrix).toHaveLength(10);
    expect(value.featureMatrix.some((feature) => feature.id === 'meal-ai')).toBe(true);
  });

  it('personalizes entitlement state and recommended modules from patient context', () => {
    const entitlement = buildEntitlementSnapshot({
      email: 'paciente@mejoy.com.br',
      productSlug: 'emagrecimento',
      recentOrdersCount: 1,
      recentReportsCount: 1,
      riskLevel: 'high',
      hasRecentSleepSignal: true,
      hasRecentExams: true,
      hasRefillFlow: true,
    });

    expect(entitlement.activationState).toBe('care_active');
    expect(entitlement.protocolContext.primaryProtocolSlug).toBe('emagrecimento');
    expect(entitlement.recommendedModules).toContain('consult');
    expect(entitlement.recommendedModules).toContain('sleep');
    expect(entitlement.recommendedActions.some((action) => action.href === '/consult-request')).toBe(true);
  });
});
