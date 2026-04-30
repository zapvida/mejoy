#!/usr/bin/env tsx
/**
 * Crítica por IA — segundo passe que avalia e reescreve campos fracos.
 * Requer OPENAI_API_KEY. Sem API key, pula.
 * Uso: pnpm run copy:critique-ai-batch [--dry-run] [--limit=N]
 */

import * as fs from 'fs';
import * as path from 'path';
import OpenAI from 'openai';
import { parseCSV, writeCSV, HIGH_RISK_SKUS } from './lib/copy-utils';

const V4_PATH = path.join(process.cwd(), 'data', 'store-v2', 'copy', 'copy-blueprint-v4.csv');
const REPORT_PATH = path.join(process.cwd(), 'scripts', 'generated', 'copy-v4-critique-report.json');

const BATCH_SIZE = 2;
const DELAY_MS = 2500;

function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

const CRITIQUE_FIELDS = [
  'hero_benefit',
  'shortBenefit',
  'what_makes_this_formula_different',
  'comparison_note',
  'science_summary',
  'expectation_setting',
  'faq',
  'seo_h1',
  'seoTitle',
  'seoDescription',
  'description_md',
  'top_questions_real',
  'blog_support_topics',
  'cautions',
  'compliance_notes',
];

function buildCritiquePrompt(row: Record<string, string>): string {
  const copy = Object.fromEntries(
    CRITIQUE_FIELDS.filter((f) => row[f]).map((f) => [f, row[f]])
  );

  return `Você é um crítico editorial e regulatório.
Analise o JSON de copy abaixo e reescreva os campos que estiverem:
- genéricos
- repetitivos
- fracos em diferenciação
- fracos em SEO
- vagos
- inseguros regulatoriamente

Dê notas de 0 a 100 para:
- clarity_score
- differentiation_score
- semantic_depth_score
- compliance_score
- organic_potential_score

Se qualquer nota < 80, reescreva os campos fracos até atingir padrão premium.

Copy atual (JSON):
${JSON.stringify(copy, null, 2)}

Retorne APENAS um JSON válido com:
1. Os campos reescritos (hero_benefit, shortBenefit, what_makes_this_formula_different, comparison_note, science_summary, expectation_setting, faq, seo_h1, seoTitle, seoDescription, description_md, top_questions_real, blog_support_topics, cautions, compliance_notes) — inclua todos, reescrevendo os que precisam melhorar
2. As notas: clarity_score, differentiation_score, semantic_depth_score, compliance_score, organic_potential_score (números 0-100)

Formato: JSON válido, sem markdown.`;
}

async function critiqueOne(
  client: OpenAI,
  row: Record<string, string>,
  model: string
): Promise<Record<string, string | number> | null> {
  const prompt = buildCritiquePrompt(row);
  try {
    const res = await client.chat.completions.create({
      model,
      temperature: 0.3,
      response_format: { type: 'json_object' },
      messages: [{ role: 'user', content: prompt }],
    });
    const raw = res.choices[0]?.message?.content?.trim();
    if (!raw) return null;
    return JSON.parse(raw.replace(/```json\s*/g, '').replace(/```\s*/g, '')) as Record<string, string | number>;
  } catch (e) {
    console.error(`  Erro ${row.sku}:`, (e as Error).message);
    return null;
  }
}

async function main() {
  const dryRun = process.argv.includes('--dry-run');
  const limitArg = process.argv.find((a) => a.startsWith('--limit='));
  const limit = limitArg ? parseInt(limitArg.split('=')[1] || '0', 10) : 0;

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    console.log('⚠️ OPENAI_API_KEY não definida. Pulando crítica por IA.');
    process.exit(0);
  }

  if (!fs.existsSync(V4_PATH)) {
    console.error('❌ copy-blueprint-v4.csv não encontrado.');
    process.exit(1);
  }

  const content = fs.readFileSync(V4_PATH, 'utf-8');
  const { headers, rows } = parseCSV(content);
  const model = process.env.OPENAI_MODEL || 'gpt-4o-mini';

  const toProcess = limit > 0 ? rows.slice(0, limit) : rows;
  const report: {
    generatedAt: string;
    totalProcessed: number;
    success: number;
    failed: string[];
    avgScores: Record<string, number>;
    dryRun: boolean;
  } = {
    generatedAt: new Date().toISOString(),
    totalProcessed: 0,
    success: 0,
    failed: [],
    avgScores: {},
    dryRun,
  };

  const scoreKeys = ['clarity_score', 'differentiation_score', 'semantic_depth_score', 'compliance_score', 'organic_potential_score'];
  const scoreSums: Record<string, number> = {};
  scoreKeys.forEach((k) => (scoreSums[k] = 0));

  if (dryRun) {
    console.log(`[dry-run] Criticaria ${toProcess.length} SKUs`);
    process.exit(0);
  }

  const client = new OpenAI({ apiKey });
  const total = toProcess.filter((r) => !HIGH_RISK_SKUS.includes(r.sku?.trim() ?? '')).length;
  console.log(`\n🔍 Criticando ${total} SKUs (batch ${BATCH_SIZE}, ~${Math.ceil(total / BATCH_SIZE) * (DELAY_MS / 1000)}s estimado)...\n`);

  let done = 0;
  for (let i = 0; i < toProcess.length; i += BATCH_SIZE) {
    const batch = toProcess.slice(i, i + BATCH_SIZE);
    const batchSkus = batch.filter((r) => !HIGH_RISK_SKUS.includes(r.sku?.trim() ?? '')).map((r) => r.sku).join(', ');
    if (batchSkus) process.stdout.write(`  [${done + 1}-${Math.min(done + batch.length, total)}/${total}] ${batchSkus}... `);

    for (const row of batch) {
      const sku = row.sku?.trim();
      if (!sku || HIGH_RISK_SKUS.includes(sku)) continue;

      const result = await critiqueOne(client, row, model);
      report.totalProcessed++;
      done++;

      if (result) {
        report.success++;
        for (const [k, v] of Object.entries(result)) {
          if (typeof v === 'number' && scoreKeys.includes(k)) {
            scoreSums[k] += v;
            if (headers.includes(k)) row[k] = String(v);
          } else if (typeof v === 'string' && headers.includes(k)) {
            row[k] = v;
          }
        }
      } else {
        report.failed.push(sku);
      }
    }
    if (batchSkus) console.log(`✓ (${report.success} ok)`);
    await sleep(DELAY_MS);
  }

  if (report.success > 0) {
    scoreKeys.forEach((k) => {
      report.avgScores[k] = Math.round((scoreSums[k] / report.success) * 10) / 10;
    });
  }

  fs.mkdirSync(path.dirname(REPORT_PATH), { recursive: true });
  fs.writeFileSync(V4_PATH, writeCSV(headers, rows), 'utf-8');
  fs.writeFileSync(REPORT_PATH, JSON.stringify(report, null, 2), 'utf-8');

  console.log('✅ Crítica AI concluída');
  console.log(`   Processados: ${report.totalProcessed}`);
  console.log(`   Sucesso: ${report.success}`);
  console.log(`   Médias: ${JSON.stringify(report.avgScores)}`);
  console.log(`   Relatório: ${REPORT_PATH}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
