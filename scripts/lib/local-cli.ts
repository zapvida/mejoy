import { existsSync } from 'fs';
import * as path from 'path';

function shellEscape(value: string): string {
  if (/^[A-Za-z0-9_./:=+-]+$/.test(value)) return value;
  return `'${value.replace(/'/g, `'\"'\"'`)}'`;
}

export function localBin(name: string): string {
  const suffix = process.platform === 'win32' ? '.cmd' : '';
  const candidate = path.join(process.cwd(), 'node_modules', '.bin', `${name}${suffix}`);
  return existsSync(candidate) ? candidate : name;
}

export function withEnv(command: string, env: Record<string, string | undefined>): string {
  const prefix = Object.entries(env)
    .filter(([, value]) => typeof value === 'string' && value.length > 0)
    .map(([key, value]) => `${key}=${shellEscape(value as string)}`)
    .join(' ');

  return prefix ? `${prefix} ${command}` : command;
}

export function launchTaskCommands() {
  const eslint = localBin('eslint');
  const next = localBin('next');
  const tsx = localBin('tsx');
  const tsc = localBin('tsc');

  return {
    lint: `${eslint} src/ --max-warnings=0`,
    typecheck: `${tsc} --noEmit`,
    build: withEnv(`${next} build`, { NEXT_TELEMETRY_DISABLED: '1' }),
    softLaunchGate: `${tsx} scripts/soft-launch-gate.ts`,
    validateAkkermat: `${tsx} scripts/validate-akkermat-regression.ts`,
    validateScientificReferences: `${tsx} scripts/validate-scientific-references.ts`,
    validatePdp: `${tsx} scripts/validate-pdp-launch.ts`,
    launchGate: `${tsx} scripts/launch-gate-lote-ancora.ts`,
    smokeLaunch: `${tsx} scripts/smoke-launch.ts`,
    smokeCheckout: `${tsx} scripts/smoke-checkout-store-v2.ts`,
  };
}
