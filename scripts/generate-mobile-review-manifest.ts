import fs from 'node:fs';
import path from 'node:path';

import { reviewScreenDefinitions } from '../apps/mobile/src/review/screen-definitions';

const artifactDir = path.join(process.cwd(), 'artifacts', 'mejoy-native-release-review');
const iphoneSvgDir = path.join(artifactDir, 'screenshots', 'iphone');
const iphonePngDir = path.join(artifactDir, 'screenshots', 'iphone-png');

function ensureDir(target: string) {
  fs.mkdirSync(target, { recursive: true });
}

function buildFlowMap() {
  return `# Fluxos auditados

## Entrada do paciente
- 00-splash-premium -> 01-onboarding-premium -> 02-checkup-inicial -> 03-checkup-resultado -> 04-hoje-dashboard

## Rotina diária
- 04-hoje-dashboard -> 09-meal-photo -> 10-meal-result -> 13-glp1-journey -> 15-symptom-checkin -> 21-metabolic-monitor

## Plano e comportamento
- 05-plano-90-dias -> 13-glp1-journey -> 20-nutrition-coach -> 22-mind-sleep -> 23-ritual-player

## Cuidado médico
- 06-medico-tab -> 17-telemedicine -> 18-doctor-queue -> 19-doctor-chat
- 15-symptom-checkin -> 16-symptom-alert -> 17-telemedicine

## Farmácia e continuidade
- 07-farmacia-tab -> 24-prescriptions -> 25-order-status -> 26-reorder

## Conta e assinatura
- 08-profile -> 27-integrations -> 28-plan-membership

## Estados de robustez
- 29-empty-state
- 30-loading-state
- 31-error-state
- 32-success-state
`;
}

function buildApprovalChecklist() {
  const lines = [
    '# Approval checklist',
    '',
    '| screenId | copy review | UX review | clinical review | flow review | status |',
    '| --- | --- | --- | --- | --- | --- |',
  ];

  for (const screen of reviewScreenDefinitions) {
    lines.push(`| ${screen.screenId} | pending | pending | pending | pending | ${screen.reviewStatus} |`);
  }

  return lines.join('\n');
}

function buildCsv() {
  const header = ['screenId', 'route', 'tier', 'state', 'device', 'build', 'reviewStatus', 'svgFile', 'pngFile', 'htmlFile'];
  const rows = reviewScreenDefinitions.map((screen) => [
    screen.screenId,
    screen.route,
    screen.tier,
    screen.state,
    screen.device,
    screen.build,
    screen.reviewStatus,
    `screenshots/iphone/${screen.screenId}.svg`,
    `screenshots/iphone-png/${screen.screenId}.png`,
    `html/${screen.screenId}.html`,
  ]);

  return [header, ...rows]
    .map((row) => row.map((value) => `"${String(value).replaceAll('"', '""')}"`).join(','))
    .join('\n');
}

function buildManifest() {
  return {
    generatedAt: new Date().toISOString(),
    reviewPack: 'mejoy-native-release-review',
    totalScreens: reviewScreenDefinitions.length,
    screens: reviewScreenDefinitions.map((screen) => ({
      ...screen,
      svgFile: `screenshots/iphone/${screen.screenId}.svg`,
      pngFile: `screenshots/iphone-png/${screen.screenId}.png`,
      htmlFile: `html/${screen.screenId}.html`,
    })),
  };
}

ensureDir(iphoneSvgDir);
ensureDir(iphonePngDir);

fs.writeFileSync(path.join(artifactDir, 'manifest.json'), JSON.stringify(buildManifest(), null, 2));
fs.writeFileSync(path.join(artifactDir, 'screen-index.csv'), buildCsv());
fs.writeFileSync(path.join(artifactDir, 'flow-map.md'), buildFlowMap());
fs.writeFileSync(path.join(artifactDir, 'approval-checklist.md'), buildApprovalChecklist());

console.log(`Review pack metadata generated in ${artifactDir}`);
