#!/usr/bin/env node
const { spawnSync } = require('node:child_process');

const productionUrl = process.env.PRODUCTION_URL || 'https://www.mejoy.com.br';

console.log('Executando suite de responsividade (Mobile Chrome + Mobile Safari)...');
console.log(`PRODUCTION_URL=${productionUrl}`);

const result = spawnSync(
  'pnpm',
  [
    'exec',
    'playwright',
    'test',
    'tests/e2e/public/ssr-responsive.pr-regression.spec.ts',
    '--grep=landing remains stable',
    '--project=chromium',
    '--project=webkit'
  ],
  {
    stdio: 'inherit',
    env: {
      ...process.env,
      PLAYWRIGHT_LANE: 'pr-regression',
      PLAYWRIGHT_BASE_URL: productionUrl,
      PRODUCTION_URL: productionUrl,
    },
  }
);

if (result.status !== 0) {
  process.exit(result.status || 1);
}

console.log('Validacao de responsividade concluida com sucesso.');
