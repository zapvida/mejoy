/// <reference types="jest" />
/** @jest-environment node */

import type { StepDef } from '@/lib/triage/schema';
import {
  coerceStringArray,
  normalizeAnswersForSteps,
  normalizePersistedStepValue,
} from '@/components/triage/emagrecimentoAnswerNormalization';

const multiselectStep: StepDef = {
  key: 'comorbidades',
  type: 'multiselect',
  label: 'Comorbidades',
  required: true,
};

const textStep: StepDef = {
  key: 'primeiro_nome',
  type: 'text',
  label: 'Primeiro nome',
  required: true,
};

describe('emagrecimento answer normalization', () => {
  it('coerces comma-separated multiselect strings back into arrays', () => {
    expect(coerceStringArray('hipertensao, refluxo, hipertensao')).toEqual([
      'hipertensao',
      'refluxo',
    ]);
  });

  it('preserves multiselect answers as arrays for persistence', () => {
    expect(normalizePersistedStepValue(multiselectStep, ['hipertensao', 'refluxo'])).toEqual([
      'hipertensao',
      'refluxo',
    ]);
  });

  it('normalizes hydrated answers without changing scalar fields', () => {
    expect(
      normalizeAnswersForSteps([multiselectStep, textStep], {
        comorbidades: 'hipertensao,refluxo',
        primeiro_nome: 'Teo',
      })
    ).toEqual({
      comorbidades: ['hipertensao', 'refluxo'],
      primeiro_nome: 'Teo',
    });
  });
});
