#!/usr/bin/env tsx
/**
 * SOFT LAUNCH GATE — Gate unificado para lançamento controlado.
 *
 * Só passa se:
 * - lint OK
 * - typecheck OK
 * - build OK
 * - validate Akkermat OK
 * - referências científicas validadas (>=3 clicáveis por SKU)
 * - validação PDP/copy OK
 * - lote âncora strict OK
 * - smoke HTTP OK (quando BASE_URL disponível)
 *
 * Saída: NÃO LANÇAR | PRONTO PARA TESTE FINAL | PRONTO PARA SOFT LAUNCH
 *
 * Uso: pnpm run soft-launch:gate
 *      BASE_URL=http://localhost:3000 pnpm run soft-launch:gate
 */

import { execSync } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';
import { config } from 'dotenv';
config({ path: path.join(process.cwd(), '.env.local') });

const BASE_URL = process.env.BASE_URL || '';
const OUTPUT = path.join(process.cwd(), 'scripts', 'generated', 'soft-launch-gate-report.json');

interface StepResult {
  name: string;
  passed: boolean;
  output?: string;
  error?: string;
}

function run(name: string, cmd: string): StepResult {
  try {
    const out = execSync(cmd, {
      cwd: process.cwd(),
      encoding: 'utf-8',
      stdio: ['pipe', 'pipe', 'pipe'],
    });
    return { name, passed: true, output: out.slice(-500) };
  } catch (e: unknown) {
    const err = e as { stdout?: string; stderr?: string };
    return {
      name,
      passed: false,
      output: err.stdout?.slice(-500),
      error: err.stderr?.slice(-500) ?? String(e),
    };
  }
}

async function main() {
  const results: StepResult[] = [];
  let allPassed = true;

  console.log('\n🚀 SOFT LAUNCH GATE\n');

  // 1. Lint
  const lint = run('Lint', 'pnpm run lint');
  results.push(lint);
  if (!lint.passed) allPassed = false;
  console.log(lint.passed ? '✅ Lint OK' : '❌ Lint FAILED');

  // 2. Typecheck
  const tc = run('Typecheck', 'pnpm run typecheck');
  results.push(tc);
  if (!tc.passed) allPassed = false;
  console.log(tc.passed ? '✅ Typecheck OK' : '❌ Typecheck FAILED');

  // 3. Build
  const build = run('Build', 'pnpm run build');
  results.push(build);
  if (!build.passed) allPassed = false;
  console.log(build.passed ? '✅ Build OK' : '❌ Build FAILED');

  // 4. Validate Akkermat (contra baseline versionado)
  const validate = run('Validate Akkermat', 'pnpm run validate:akkermat');
  results.push(validate);
  if (!validate.passed) allPassed = false;
  console.log(validate.passed ? '✅ Validate Akkermat OK' : '❌ Validate Akkermat FAILED');

  // 5. Validate scientific references
  const refs = run('Validate Scientific References', 'pnpm run copy:validate:references');
  results.push(refs);
  if (!refs.passed) allPassed = false;
  console.log(refs.passed ? '✅ Scientific References OK' : '❌ Scientific References FAILED');

  // 6. Validate PDP copy
  const pdp = run('Validate PDP Copy', 'pnpm run copy:validate:pdp');
  results.push(pdp);
  if (!pdp.passed) allPassed = false;
  console.log(pdp.passed ? '✅ Validate PDP Copy OK' : '❌ Validate PDP Copy FAILED');

  // 7. Launch gate lote âncora (strict)
  const launch = run('Launch Gate Lote Âncora', 'pnpm run launch:gate');
  results.push(launch);
  if (!launch.passed) allPassed = false;
  console.log(launch.passed ? '✅ Launch Gate OK' : '❌ Launch Gate FAILED');

  // 8. Smoke HTTP (se BASE_URL)
  let smokePassed = true;
  if (BASE_URL) {
    const smoke = run('Smoke HTTP', `PDP_LIMIT=4 BASE_URL=${BASE_URL} pnpm tsx scripts/smoke-launch.ts`);
    results.push(smoke);
    if (!smoke.passed) {
      smokePassed = false;
      allPassed = false;
    }
    console.log(smoke.passed ? '✅ Smoke HTTP OK' : '❌ Smoke HTTP FAILED');
  } else {
    results.push({ name: 'Smoke HTTP', passed: true, output: 'SKIPPED (BASE_URL not set)' });
    console.log('⚠️ Smoke HTTP SKIPPED (set BASE_URL to run)');
  }

  // Determinar veredicto
  const techOk = results.slice(0, 7).every((r) => r.passed);
  const verdict =
    !techOk || !allPassed
      ? 'NÃO LANÇAR'
      : !BASE_URL || !smokePassed
        ? 'PRONTO PARA TESTE FINAL'
        : 'PRONTO PARA SOFT LAUNCH';

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
  console.log('');

  if (verdict === 'NÃO LANÇAR') {
    process.exit(1);
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
