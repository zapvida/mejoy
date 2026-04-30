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
    'tests/e2e/emagrecimento-completo.spec.ts',
    '--project=Mobile Chrome',
    '--project=Mobile Safari'
  ],
  {
    stdio: 'inherit',
    env: {
      ...process.env,
      PRODUCTION_URL: productionUrl,
    },
  }
);

if (result.status !== 0) {
  process.exit(result.status || 1);
}

console.log('Validacao de responsividade concluida com sucesso.');
