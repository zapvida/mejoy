#!/usr/bin/env node
/**
 * Push vars from .env.local to the linked Vercel project (production + preview).
 * Uses vercel CLI; requires prior `vercel link`. Does not print secret values.
 */
const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');
const dotenv = require('dotenv');

const root = path.join(__dirname, '..');
const envPath = path.join(root, '.env.local');

if (!fs.existsSync(envPath)) {
  console.error('sync-env-vercel-from-local: .env.local not found');
  process.exit(1);
}

const parsed = dotenv.parse(fs.readFileSync(envPath));

function isSensitive(key) {
  if (/ADMIN_SECRET|SERVICE_ROLE|WEBHOOK|PASSWORD|PRIVATE/i.test(key)) return true;
  if (key.startsWith('NEXT_PUBLIC_')) return false;
  return /SECRET|TOKEN|KEY|DATABASE_URL|API_KEY|_KEY$/i.test(key);
}

const environments = ['production', 'preview'];
let ok = 0;
let failed = 0;

for (const [key, value] of Object.entries(parsed)) {
  const trimmedKey = key.trim();
  if (!trimmedKey || trimmedKey.startsWith('#')) continue;
  if (value === undefined || value === '') continue;

  for (const envName of environments) {
    const args = ['env', 'add', trimmedKey, envName];
    if (isSensitive(trimmedKey)) args.push('--sensitive');
    args.push('--value', String(value), '--yes', '--force');

    const r = spawnSync('vercel', args, {
      cwd: root,
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'pipe'],
    });

    if (r.status !== 0) {
      console.error(`  ✗ ${trimmedKey} (${envName}): ${(r.stderr || r.stdout || '').trim().slice(0, 200)}`);
      failed++;
    } else {
      ok++;
    }
  }
}

console.log(`sync-env-vercel-from-local: done (${ok} ok, ${failed} errors)`);
process.exit(failed > 0 ? 1 : 0);
