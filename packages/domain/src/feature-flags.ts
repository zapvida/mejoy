export const MOBILE_FEATURE_FLAG_KEYS = [
  'dashboard',
  'wearables',
  'mealAi',
  'sleep',
  'meditation',
  'clinicalShare',
  'consultRequest',
  'glp1Tracking',
  'push',
] as const;

export type MobileFeatureFlagKey = (typeof MOBILE_FEATURE_FLAG_KEYS)[number];

export type MobileFeatureFlags = Record<MobileFeatureFlagKey, boolean>;

export const DEFAULT_MOBILE_FEATURE_FLAGS: MobileFeatureFlags = {
  dashboard: true,
  wearables: true,
  mealAi: true,
  sleep: true,
  meditation: true,
  clinicalShare: true,
  consultRequest: true,
  glp1Tracking: true,
  push: true,
};

function parseBooleanFlag(value: string | undefined, fallback: boolean): boolean {
  if (value == null) return fallback;
  return value === '1' || value === 'true';
}

export function resolveMobileFeatureFlags(
  env?: Record<string, string | undefined>
): MobileFeatureFlags {
  const source =
    env ??
    ((globalThis as { process?: { env?: Record<string, string | undefined> } }).process?.env ?? {});

  return {
    dashboard: parseBooleanFlag(source.MEJOY_MOBILE_FLAG_DASHBOARD, DEFAULT_MOBILE_FEATURE_FLAGS.dashboard),
    wearables: parseBooleanFlag(source.MEJOY_MOBILE_FLAG_WEARABLES, DEFAULT_MOBILE_FEATURE_FLAGS.wearables),
    mealAi: parseBooleanFlag(source.MEJOY_MOBILE_FLAG_MEAL_AI, DEFAULT_MOBILE_FEATURE_FLAGS.mealAi),
    sleep: parseBooleanFlag(source.MEJOY_MOBILE_FLAG_SLEEP, DEFAULT_MOBILE_FEATURE_FLAGS.sleep),
    meditation: parseBooleanFlag(source.MEJOY_MOBILE_FLAG_MEDITATION, DEFAULT_MOBILE_FEATURE_FLAGS.meditation),
    clinicalShare: parseBooleanFlag(source.MEJOY_MOBILE_FLAG_CLINICAL_SHARE, DEFAULT_MOBILE_FEATURE_FLAGS.clinicalShare),
    consultRequest: parseBooleanFlag(source.MEJOY_MOBILE_FLAG_CONSULT_REQUEST, DEFAULT_MOBILE_FEATURE_FLAGS.consultRequest),
    glp1Tracking: parseBooleanFlag(source.MEJOY_MOBILE_FLAG_GLP1_TRACKING, DEFAULT_MOBILE_FEATURE_FLAGS.glp1Tracking),
    push: parseBooleanFlag(source.MEJOY_MOBILE_FLAG_PUSH, DEFAULT_MOBILE_FEATURE_FLAGS.push),
  };
}
