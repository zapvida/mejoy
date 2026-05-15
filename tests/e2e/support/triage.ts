import type { APIRequestContext, Page } from '@playwright/test';

import { isExternalBaseURL } from './env';
import { expect } from './test';
import { dismissCookieBanner } from './auth';

export const DEFAULT_EMAGRECIMENTO_ANSWERS: Record<string, unknown> = {
  aceita_termos: 'aceito',
  altura: 168,
  peso: 82,
  peso_meta: 70,
  sexo: 'F',
  gestacao: 'nao',
  data_nascimento: '1990-01-01',
  contraindicacoes_glp1: ['nenhuma'],
  comorbidades: ['nenhuma'],
  cirurgia_bariatrica_previa: 'nao',
  uso_opioides_3meses: 'nao',
  medicamentos_prescritos_atual: 'nao',
  uso_medicacao_emagrecimento_recente: 'nao',
  efeitos_colaterais_previos: 'nao_aplicavel',
  pressao_arterial_faixa: 'otima',
  frequencia_cardiaca_repouso: '60_80',
  impacto_vida: 'moderado',
  objetivo_principal: 'ambos',
  preferencia_principio_ativo: 'semaglutida',
  primeiro_nome: 'Patricia',
  whatsapp: '11999998888',
  consentimento_whatsapp: 'autorizo',
};

export async function ensureEmagrecimentoTriageShell(page: Page) {
  await page.goto('/triagem/emagrecimento');
  await dismissCookieBanner(page);
  await expect(page.getByRole('heading', { level: 1 })).toContainText(
    /programa continua|Triagem clínica MeJoy/i,
  );
}

export async function createEmagrecimentoReportViaApi(
  request: APIRequestContext,
  overrides?: Partial<typeof DEFAULT_EMAGRECIMENTO_ANSWERS>,
) {
  const sessionResponse = await request.post('/api/triage/session', {
    data: {
      triageSlug: 'emagrecimento',
      forceNew: true,
    },
  });
  expect(sessionResponse.ok()).toBeTruthy();
  const session = (await sessionResponse.json()) as { triageId: string };
  const triageId = session.triageId;
  const answers = { ...DEFAULT_EMAGRECIMENTO_ANSWERS, ...(overrides ?? {}) };
  const entries = Object.entries(answers);

  for (const [index, [stepKey, value]] of entries.entries()) {
    const progress = Math.round(((index + 1) / entries.length) * 100);
    const answerResponse = await request.post('/api/triage/answer', {
      data: {
        triageId,
        stepKey,
        value,
        progress,
      },
    });
    expect(answerResponse.ok(), `Answer step ${stepKey} should be persisted.`).toBeTruthy();
  }

  const redirect = await finalizeEmagrecimentoReport(request, triageId, answers);
  return {
    triageId,
    answers,
    reportPath: redirect,
  };
}

export async function finalizeEmagrecimentoReport(
  request: APIRequestContext,
  triageId: string,
  answers: Record<string, unknown>,
) {
  const payload: Record<string, unknown> = {
    triageId,
    triageSlug: 'emagrecimento',
  };

  if (!isExternalBaseURL) {
    payload.answers = answers;
  }

  for (let attempt = 0; attempt < 20; attempt += 1) {
    const response = await request.post('/api/triage/finalize', {
      headers: {
        'Content-Type': 'application/json',
        'X-Idempotency-Key': triageId,
      },
      data: payload,
    });

    expect(response.ok()).toBeTruthy();
    const result = (await response.json()) as { ok?: boolean; status?: string; redirect?: string };

    if (result.ok && result.redirect) {
      return result.redirect;
    }

    await new Promise((resolve) => setTimeout(resolve, 2_000));
  }

  throw new Error(`Timed out waiting for relatório finalization for triage ${triageId}.`);
}
