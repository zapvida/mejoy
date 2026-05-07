/// <reference types="jest" />
/** @jest-environment node */

import {
  buildAdherenceScore,
  calculateBmi,
  classifyWeightTrend,
  estimateMealFromText,
  getSleepCoachingTip,
  resolveMobileFeatureFlags,
  scoreSleepSnapshot,
} from '@mejoy/domain';

describe('mobile domain foundation', () => {
  it('resolves mobile feature flags with env overrides', () => {
    expect(
      resolveMobileFeatureFlags({
        MEJOY_MOBILE_FLAG_MEAL_AI: '0',
        MEJOY_MOBILE_FLAG_PUSH: 'true',
      })
    ).toMatchObject({
      dashboard: true,
      mealAi: false,
      push: true,
    });
  });

  it('derives bmi, adherence and trend for glp1 tracking', () => {
    expect(calculateBmi(98, 175)).toBe(32);
    expect(
      classifyWeightTrend([
        { occurredAt: '2026-05-01T10:00:00.000Z', weightKg: 100 },
        { occurredAt: '2026-05-06T10:00:00.000Z', weightKg: 98.4 },
      ])
    ).toBe('down');
    expect(
      buildAdherenceScore({
        dosesTaken: 3,
        dosesExpected: 4,
        weighInsLast14Days: 2,
      })
    ).toBe(73);
  });

  it('builds meal and sleep heuristics for mobile retention loops', () => {
    const meal = estimateMealFromText('hamburguer, batata frita e refrigerante');
    expect(meal.riskLevel).toBe('high');
    expect(meal.flags.length).toBeGreaterThan(0);

    expect(
      scoreSleepSnapshot({
        durationHours: 5.5,
        latencyMinutes: 42,
        awakenings: 3,
      })
    ).toBeLessThan(60);
    expect(getSleepCoachingTip(5.5)).toContain('cafeína');
  });
});
