import type { StepDef } from '@/lib/triage/schema';

export function coerceStringArray(value: unknown): string[] {
  if (Array.isArray(value)) {
    return Array.from(new Set(value.map(item => String(item).trim()).filter(Boolean)));
  }

  if (typeof value === 'string') {
    const trimmed = value.trim();
    if (!trimmed) return [];

    try {
      const parsed = JSON.parse(trimmed);
      if (Array.isArray(parsed)) {
        return Array.from(new Set(parsed.map(item => String(item).trim()).filter(Boolean)));
      }
    } catch {
      /* fall through to comma-separated parsing */
    }

    return Array.from(new Set(trimmed.split(',').map(item => item.trim()).filter(Boolean)));
  }

  return [];
}

export function normalizePersistedStepValue(step: StepDef, value: unknown): unknown {
  if (value == null) return null;
  if (step.type === 'multiselect') return coerceStringArray(value);
  if (typeof value === 'number' || typeof value === 'string' || typeof value === 'boolean') return value;
  if (Array.isArray(value)) return value;
  if (typeof value === 'object') return value;
  return String(value);
}

export function normalizeAnswersForSteps(
  steps: StepDef[],
  answers: Record<string, any>
): Record<string, any> {
  if (!answers || typeof answers !== 'object') return {};

  const normalized = { ...answers };
  for (const step of steps) {
    if (!(step.key in normalized)) continue;
    normalized[step.key] = normalizePersistedStepValue(step, normalized[step.key]);
  }

  return normalized;
}
