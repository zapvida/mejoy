#!/usr/bin/env node

import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';

const reportPath = process.argv[2] || path.join('playwright-report', 'report.json');
const outputDir = process.argv[3] || 'playwright-report';
const summaryJsonPath = path.join(outputDir, 'summary.json');
const summaryMarkdownPath = path.join(outputDir, 'summary.md');

function safeReadJson(filePath) {
  if (!fs.existsSync(filePath)) return null;
  try {
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
  } catch {
    return null;
  }
}

function collectFailures(report) {
  const failures = [];

  function walkSuite(suite, ancestry = []) {
    const nextAncestry = suite.title ? [...ancestry, suite.title] : ancestry;

    for (const childSuite of suite.suites || []) {
      walkSuite(childSuite, nextAncestry);
    }

    for (const spec of suite.specs || []) {
      for (const specTest of spec.tests || []) {
        const failingResult = (specTest.results || []).find((result) =>
          ['failed', 'timedOut', 'interrupted'].includes(result.status),
        );

        if (!failingResult) continue;

        failures.push({
          title: [...nextAncestry, spec.title].filter(Boolean).join(' › '),
          file: spec.file || suite.file || 'unknown',
          project: specTest.projectName || 'unknown',
          status: failingResult.status,
          error:
            failingResult.error?.message ||
            failingResult.errors?.map((error) => error.message).filter(Boolean).join('\n') ||
            'Unknown failure',
        });
      }
    }
  }

  for (const suite of report?.suites || []) {
    walkSuite(suite, []);
  }

  return failures;
}

function buildDigest(failures, stats) {
  const input =
    failures.length > 0
      ? failures
          .map((failure) => `${failure.project}|${failure.file}|${failure.title}|${failure.status}`)
          .sort()
          .join('\n')
      : `passed:${stats.expected ?? 0}:${stats.skipped ?? 0}`;

  return crypto.createHash('sha256').update(input).digest('hex');
}

const report = safeReadJson(reportPath);
const stats = report?.stats || {};
const failures = collectFailures(report || {});
const digest = buildDigest(failures, stats);

const summary = {
  generatedAt: new Date().toISOString(),
  reportPath,
  stats: {
    expected: stats.expected ?? 0,
    unexpected: stats.unexpected ?? failures.length,
    flaky: stats.flaky ?? 0,
    skipped: stats.skipped ?? 0,
    duration: stats.duration ?? 0,
  },
  failures,
  digest,
};

const markdown = [
  '# Playwright MeJoy Summary',
  '',
  `- Expected: ${summary.stats.expected}`,
  `- Unexpected: ${summary.stats.unexpected}`,
  `- Flaky: ${summary.stats.flaky}`,
  `- Skipped: ${summary.stats.skipped}`,
  `- Digest: \`${summary.digest}\``,
  '',
  failures.length > 0 ? '## Failures' : '## Result',
  failures.length > 0 ? '' : 'No failures detected.',
  ...failures.flatMap((failure) => [
    `- [${failure.project}] ${failure.title}`,
    `  - File: ${failure.file}`,
    `  - Status: ${failure.status}`,
    `  - Error: ${failure.error.split('\n')[0]}`,
  ]),
].join('\n');

fs.mkdirSync(outputDir, { recursive: true });
fs.writeFileSync(summaryJsonPath, `${JSON.stringify(summary, null, 2)}\n`);
fs.writeFileSync(summaryMarkdownPath, `${markdown}\n`);

process.stdout.write(`${markdown}\n`);
