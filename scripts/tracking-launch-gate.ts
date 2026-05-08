#!/usr/bin/env tsx

import * as fs from 'fs';
import * as path from 'path';

import { buildZapVidaHandoffUrl } from '../src/lib/handoff/envelope';
import { mapStatusToAnalyticsEvent, type HandoffStatus } from '../src/lib/handoff/schema';
import { CANONICAL_LAUNCH_EVENT_NAMES } from '../src/lib/funnel/events-client';

type StepResult = {
  name: string;
  passed: boolean;
  detail: string;
};

const OUTPUT = path.join(process.cwd(), 'scripts', 'generated', 'tracking-launch-gate-report.json');
const REQUIRED_EVENTS = [
  'lp_view',
  'cta_start_triage',
  'triage_started',
  'triage_completed',
  'report_viewed',
  'cta_clinical_handoff',
  'handoff_created',
  'handoff_opened',
  'handoff_failed',
  'clinical_payment_started',
  'clinical_payment_success',
  'consult_completed',
  'pharmacy_order_created',
] as const;

function record(name: string, passed: boolean, detail: string): StepResult {
  return { name, passed, detail };
}

function runChecks() {
  const results: StepResult[] = [];

  const missingEvents = REQUIRED_EVENTS.filter(
    (event) => !CANONICAL_LAUNCH_EVENT_NAMES.includes(event)
  );
  results.push(
    record(
      'Canonical launch events',
      missingEvents.length === 0,
      missingEvents.length === 0
        ? 'Taxonomia canônica contém todos os eventos obrigatórios do launch.'
        : `Eventos ausentes: ${missingEvents.join(', ')}`
    )
  );

  const ga4MeasurementId = process.env.NEXT_PUBLIC_GA4_MEASUREMENT_ID || '';
  const ga4LegacyId = process.env.NEXT_PUBLIC_GA4_ID || '';
  const gaIdsConsistent =
    !ga4MeasurementId || !ga4LegacyId || ga4MeasurementId === ga4LegacyId;
  results.push(
    record(
      'GA4 env consistency',
      gaIdsConsistent,
      gaIdsConsistent
        ? 'NEXT_PUBLIC_GA4_MEASUREMENT_ID e NEXT_PUBLIC_GA4_ID não conflitam.'
        : 'NEXT_PUBLIC_GA4_MEASUREMENT_ID difere de NEXT_PUBLIC_GA4_ID.'
    )
  );

  const handoffAcceptMappings = (['opened', 'accepted', 'completed'] as HandoffStatus[]).every(
    (status) => mapStatusToAnalyticsEvent(status) === 'handoff_accept'
  );
  results.push(
    record(
      'Handoff accept mapping',
      handoffAcceptMappings,
      handoffAcceptMappings
        ? 'opened/accepted/completed convergem para handoff_accept.'
        : 'Mapeamento de handoff_accept divergente.'
    )
  );

  const redirectUrl = buildZapVidaHandoffUrl('signed.token', 'emagrecimento', 'handoff-123', 'corr-123', {
    source: 'google',
    medium: 'cpc',
    campaign: 'launch',
    content: 'hero',
    term: 'mejoy',
    gclid: 'gclid-123',
    msclkid: 'msclkid-123',
  });
  const redirect = new URL(redirectUrl);
  const redirectPreservesTracking =
    redirect.searchParams.get('handoff_id') === 'handoff-123' &&
    redirect.searchParams.get('correlation_id') === 'corr-123' &&
    redirect.searchParams.get('gclid') === 'gclid-123' &&
    redirect.searchParams.get('msclkid') === 'msclkid-123' &&
    redirect.searchParams.get('origin_utm_source') === 'google' &&
    redirect.searchParams.get('origin_utm_medium') === 'cpc' &&
    redirect.searchParams.get('origin_utm_campaign') === 'launch';
  results.push(
    record(
      'Redirect preserves attribution',
      redirectPreservesTracking,
      redirectPreservesTracking
        ? 'redirectUrl preserva correlation_id, click IDs e origin_utm_*.'
        : 'redirectUrl não preserva todos os sinais de atribuição obrigatórios.'
    )
  );

  return results;
}

async function main() {
  const results = runChecks();
  const allPassed = results.every((result) => result.passed);
  const manualChecklist = [
    'Validar fluxo completo com gclid de teste no GTM Preview.',
    'Confirmar lp_view -> triage_started -> triage_completed -> report_viewed -> cta_clinical_handoff -> handoff_created no GA4 DebugView.',
    'Verificar redirectUrl real com handoff, handoff_id, correlation_id e click IDs.',
    'Confirmar handoff_events/admin-handoff com o mesmo correlation_id do fluxo.',
    'Registrar se handoff_accept chegou; se não, documentar a lacuna do callback externo.',
  ];

  const verdict = !allPassed
    ? 'NÃO LANÇAR'
    : process.env.TRACKING_MANUAL_APPROVED === '1'
      ? 'PRONTO PARA GO-LIVE DE TRACKING'
      : 'PRONTO PARA VALIDACAO MANUAL DE TRACKING';

  const report = {
    generatedAt: new Date().toISOString(),
    baseUrl: process.env.BASE_URL || null,
    verdict,
    allPassed,
    automatedChecks: results,
    manualChecklist,
  };

  const outDir = path.dirname(OUTPUT);
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });
  fs.writeFileSync(OUTPUT, JSON.stringify(report, null, 2), 'utf-8');

  console.log('\n📡 TRACKING LAUNCH GATE\n');
  for (const result of results) {
    console.log(result.passed ? `✅ ${result.name}` : `❌ ${result.name}`);
    console.log(`   ${result.detail}`);
  }

  console.log('\nManual checklist pendente:');
  for (const item of manualChecklist) {
    console.log(`- ${item}`);
  }

  console.log('\n' + '─'.repeat(50));
  console.log('VEREDICTO:', verdict);
  console.log('Relatório:', OUTPUT);

  if (!allPassed) process.exit(1);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
