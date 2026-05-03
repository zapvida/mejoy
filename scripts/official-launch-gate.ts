#!/usr/bin/env tsx
/**
 * OFFICIAL LAUNCH GATE — Gate final para lançamento oficial.
 *
 * Considera:
 * - estabilidade técnica (lint, typecheck, build)
 * - runtime limpo (verify:clean-runtime)
 * - checkout técnico (smoke:checkout)
 * - lote âncora (launch:gate)
 * - Akkermat intacto
 *
 * Saída: NÃO LANÇAR | PRONTO PARA TESTE FINAL | PRONTO PARA SOFT LAUNCH | PRONTO PARA LANÇAMENTO OFICIAL
 *
 * Uso: pnpm run official-launch:gate
 *      BASE_URL=http://localhost:3000 pnpm run official-launch:gate
 */

import { execSync } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';
import { config } from 'dotenv';
import { launchTaskCommands, withEnv } from './lib/local-cli';
config({ path: path.join(process.cwd(), '.env.local') });

const BASE_URL = process.env.BASE_URL || '';
const OUTPUT = path.join(process.cwd(), 'scripts', 'generated', 'official-launch-gate-report.json');
const commands = launchTaskCommands();

interface StepResult {
  name: string;
  passed: boolean;
  output?: string;
}

function run(name: string, cmd: string): StepResult {
  try {
    const out = execSync(cmd, {
      cwd: process.cwd(),
      encoding: 'utf-8',
      stdio: ['pipe', 'pipe', 'pipe'],
    });
    return { name, passed: true, output: out.slice(-300) };
  } catch {
    return { name, passed: false };
  }
}

async function main() {
  const results: StepResult[] = [];

  console.log('\n🚀 OFFICIAL LAUNCH GATE\n');

  const steps = [
    ['Soft Launch Gate', commands.softLaunchGate],
  ];

  for (const [name, cmd] of steps) {
    const r = run(name, cmd);
    results.push(r);
    console.log(r.passed ? `✅ ${name}` : `❌ ${name}`);
  }

  let checkoutOk = true;
  if (BASE_URL) {
    const checkout = run(
      'Smoke Checkout',
      withEnv(commands.smokeCheckout, { BASE_URL })
    );
    results.push(checkout);
    checkoutOk = checkout.passed;
    console.log(checkout.passed ? '✅ Smoke Checkout' : '❌ Smoke Checkout');
  } else {
    results.push({ name: 'Smoke Checkout', passed: true, output: 'SKIPPED (BASE_URL)' });
    console.log('⚠️ Smoke Checkout SKIPPED (set BASE_URL)');
  }

  const allPassed = results.every((r) => r.passed);

  let verdict: string;
  if (!allPassed) {
    verdict = 'NÃO LANÇAR';
  } else if (!BASE_URL || !checkoutOk) {
    verdict = 'PRONTO PARA TESTE FINAL';
  } else {
    verdict = 'PRONTO PARA LANÇAMENTO OFICIAL';
  }

  const report = {
    generatedAt: new Date().toISOString(),
    baseUrl: BASE_URL || null,
    verdict,
    allPassed,
    steps: results,
  };

  const outDir = path.dirname(OUTPUT);
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });
  fs.writeFileSync(OUTPUT, JSON.stringify(report, null, 2), 'utf-8');

  console.log('\n' + '─'.repeat(50));
  console.log('VEREDICTO:', verdict);
  console.log('Relatório:', OUTPUT);

  if (verdict === 'NÃO LANÇAR') process.exit(1);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
