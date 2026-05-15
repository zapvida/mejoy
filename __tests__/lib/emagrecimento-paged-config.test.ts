/// <reference types="jest" />
/** @jest-environment node */

import type { StepDef } from '@/lib/triage/schema';
import {
  EMAGRECIMENTO_INTAKE_PAGES,
  EMAGRECIMENTO_TOTAL_SECTIONS,
  getFirstIncompleteEmagrecimentoPageIndex,
} from '@/components/triage/emagrecimentoPagedConfig';

const field = (key: string, type: StepDef['type'] = 'text', required = true): StepDef => ({
  key,
  type,
  label: key,
  required,
});

const steps: StepDef[] = [
  field('aceita_termos', 'select'),
  field('altura', 'number'),
  field('peso', 'number'),
  field('peso_meta', 'number'),
  field('sexo', 'select'),
  {
    ...field('gestacao', 'select'),
    dependsOn: [{ key: 'sexo', value: ['F'] }],
  },
  field('data_nascimento', 'date'),
  field('contraindicacoes_glp1', 'multiselect'),
  field('comorbidades', 'multiselect'),
  field('cirurgia_bariatrica_previa', 'select'),
  field('uso_opioides_3meses', 'select'),
  field('medicamentos_prescritos_atual', 'select'),
  field('uso_medicacao_emagrecimento_recente', 'select'),
  {
    ...field('efeitos_colaterais_previos', 'select'),
    dependsOn: [{ key: 'uso_medicacao_emagrecimento_recente', value: ['glp1', 'outro'] }],
  },
  field('pressao_arterial_faixa', 'select'),
  field('frequencia_cardiaca_repouso', 'select'),
  field('impacto_vida', 'select'),
  field('objetivo_principal', 'select'),
  field('preferencia_principio_ativo', 'select_cards'),
  field('primeiro_nome', 'text'),
  field('whatsapp', 'text'),
  field('consentimento_whatsapp', 'select'),
];

describe('emagrecimento paged intake config helpers', () => {
  it('keeps the expected number of pages and sections', () => {
    expect(EMAGRECIMENTO_INTAKE_PAGES).toHaveLength(3);
    expect(new Set(EMAGRECIMENTO_INTAKE_PAGES.map(page => page.section)).size).toBe(
      EMAGRECIMENTO_TOTAL_SECTIONS
    );
  });

  it('starts from the first page when no answers were provided', () => {
    expect(getFirstIncompleteEmagrecimentoPageIndex(EMAGRECIMENTO_INTAKE_PAGES, steps, {})).toBe(0);
  });

  it('resumes from the clinical page when profile is complete and clinical answers are incomplete', () => {
    const answers = {
      aceita_termos: 'aceito',
      altura: 170,
      peso: 92,
      peso_meta: 75,
      sexo: 'M',
      data_nascimento: '1990-04-25',
      contraindicacoes_glp1: ['nenhuma'],
    };

    expect(
      getFirstIncompleteEmagrecimentoPageIndex(EMAGRECIMENTO_INTAKE_PAGES, steps, answers)
    ).toBe(1);
  });

  it('skips gestation when sex is male and lands on contact when the rest is complete', () => {
    const answers = {
      aceita_termos: 'aceito',
      altura: 170,
      peso: 92,
      peso_meta: 75,
      sexo: 'M',
      data_nascimento: '1990-04-25',
      contraindicacoes_glp1: ['nenhuma'],
      comorbidades: ['hipertensao'],
      cirurgia_bariatrica_previa: 'nao',
      uso_opioides_3meses: 'nao',
      medicamentos_prescritos_atual: 'sim',
      uso_medicacao_emagrecimento_recente: 'nao',
      pressao_arterial_faixa: 'elevada',
      frequencia_cardiaca_repouso: '60_80',
      impacto_vida: 'moderado',
      objetivo_principal: 'ambos',
      preferencia_principio_ativo: 'nao_sei',
    };

    expect(
      getFirstIncompleteEmagrecimentoPageIndex(EMAGRECIMENTO_INTAKE_PAGES, steps, answers)
    ).toBe(2);
  });
});
