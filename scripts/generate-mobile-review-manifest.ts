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

## Onboarding e ativação
- 00-onboarding -> 01-sign-in -> 02-activation -> 03-home-score

## Uso diário
- 03-home-score -> 06-journey-glp1 -> 08-meal-ai -> 09-sleep -> 10-rituals -> 11-goals

## Prevenção e clínica
- 03-home-prevencao -> 12-prevention-checklist -> 13-consult-concierge -> 14-exams -> 15-reports-bundle

## Conta e retenção
- 16-profile -> 17-notifications -> 18-referral-gamification -> 19-tier-locked-states -> 20-premium-6m-benefits -> 21-specialist-request

## Estados críticos
- 22-empty-states
- 23-error-states
- 24-permission-fallbacks

## Fluxos premium e retenção
- 18-referral-gamification -> 20-premium-6m-benefits -> 21-specialist-request
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
