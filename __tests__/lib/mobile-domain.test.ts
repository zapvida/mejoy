/// <reference types="jest" />
/** @jest-environment node */

import {
  buildAdherenceScore,
  buildGoalProgressItems,
  buildHealthScore,
  buildPreventionChecklist,
  buildReferralGamificationStatus,
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

  it('builds score, prevention and referral artifacts for preventive premium flows', () => {
    const goals = buildGoalProgressItems({
      tierDurationMonths: 6,
      completionMap: {
        'weight-log': true,
        'dose-log': true,
        'sleep-sync': true,
        'prevention-review': true,
      },
    });

    const score = buildHealthScore({
      goals,
      sleepScore: 82,
      adherenceScore: 88,
      preventionDueCount: 1,
    });
    const prevention = buildPreventionChecklist({
      birthDate: '1980-03-12',
      sexAtBirth: 'female',
      protocolSlug: 'emagrecimento',
      riskLevel: 'attention',
      hasExamDocuments: false,
    });
    const referral = buildReferralGamificationStatus({
      profileId: 'profile-123456',
      planDurationMonths: 6,
    });

    expect(goals.some((goal) => goal.id === 'prevention-checkup')).toBe(true);
    expect(score.overallScore).toBeGreaterThan(0);
    expect(score.nextBestActions.length).toBeGreaterThan(0);
    expect(prevention.dueTasks.length).toBeGreaterThan(0);
    expect(referral.inviteCode).toContain('MEJOY-');
  });
});
