import type { StepDef } from '@/lib/triage/schema';

const isArray = (value: unknown): value is any[] => Array.isArray(value);

export const isStepVisible = (step: StepDef, answers: Record<string, any>) => {
  if (!step.dependsOn || step.dependsOn.length === 0) return true;
  return step.dependsOn.every(condition => {
    const current = answers?.[condition.key];
    if (current === undefined || current === null) return false;
    const acceptedValues = Array.isArray(condition.value) ? condition.value : [condition.value];
    const result = isArray(current)
      ? acceptedValues.some(v => current.includes(v))
      : acceptedValues.includes(current);
    return condition.not ? !result : result;
  });
};

export const findDependentSteps = (steps: StepDef[], fieldKey: string): StepDef[] =>
  steps.filter(step => step.dependsOn?.some(condition => condition.key === fieldKey));

export const clearDependentAnswers = (
  steps: StepDef[],
  answers: Record<string, any>,
  changedField: string
): Record<string, any> => {
  const dependentSteps = findDependentSteps(steps, changedField);
  const cleanedAnswers = { ...answers };
  dependentSteps.forEach(step => {
    if (!isStepVisible(step, answers) && cleanedAnswers[step.key] !== undefined) {
      delete cleanedAnswers[step.key];
    }
  });
  return cleanedAnswers;
};

export const isValueEmpty = (value: any) => {
  if (value === null || value === undefined) return true;
  if (typeof value === 'string') return value.trim().length === 0;
  if (isArray(value)) return value.length === 0;
  return false;
};

const isMatrixAnswer = (v: unknown): v is Record<string, number | string | boolean | null | undefined> =>
  !!v && typeof v === 'object' && !Array.isArray(v);

export const isStepAnswered = (step: StepDef, answers: Record<string, any>) => {
  const value = answers?.[step.key];
  const SEEN_VALUE = '__seen__';
  const SKIPPED_VALUE = '__skipped__';
  if (step.type === 'info') return value === SEEN_VALUE;
  if (value === SKIPPED_VALUE && !step.required) return true;
  if (isValueEmpty(value)) return false;
  if (step.type === 'matrix') {
    if (!isMatrixAnswer(value)) return false;
    if (!Object.values(value).some(x => x !== null && x !== undefined && x !== '')) return false;
  }
  return true;
};

const totalVisibleQuestions = (steps: StepDef[], answers: Record<string, any>) =>
  steps.filter(step => step.type !== 'info' && isStepVisible(step, answers)).length;

const completedQuestions = (steps: StepDef[], answers: Record<string, any>) =>
  steps.filter(
    step => step.type !== 'info' && isStepVisible(step, answers) && isStepAnswered(step, answers)
  ).length;

export const computeProgress = (steps: StepDef[], answers: Record<string, any>) => {
  const total = totalVisibleQuestions(steps, answers);
  if (total === 0) return 0;
  const completed = completedQuestions(steps, answers);
  return Math.round((completed / total) * 100);
};

export const deriveInitialValue = (step: StepDef | undefined, answers: Record<string, any>) => {
  if (!step) return '';
  const answer = answers?.[step.key];
  if (answer !== undefined) return answer;
  if (step.type === 'multiselect' || step.type === 'checkbox') return [];
  if (step.type === 'scale' || step.type === 'slider') return step.min ?? 0;
  return '';
};
