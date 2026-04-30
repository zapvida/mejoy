#!/usr/bin/env tsx
/**
 * Corrige automaticamente falhas de validação no v4:
 * - Substitui termos proibidos por alternativas seguras
 * - Trunca seoDescription > 155 caracteres
 * Uso: pnpm run copy:fix-validation-v4
 */

import * as fs from 'fs';
import * as path from 'path';
import { parseCSV, writeCSV, FORBIDDEN_TERMS } from './lib/copy-utils';

const V4_PATH = path.join(process.cwd(), 'data', 'store-v2', 'copy', 'copy-blueprint-v4.csv');

const REPLACEMENTS: [RegExp, string][] = [
  [/sem efeitos colaterais\s*(de medicamentos)?/gi, 'alternativa natural'],
  [/sem efeitos colaterais indesejados?/gi, 'abordagem natural'],
  [/\btrata\b/gi, 'auxilia'],
  [/\bcura\b/gi, 'apoia'],
  [/\bgarante\b/gi, 'proporciona'],
  [/\breverte\b/gi, 'apoia'],
  [/100%/g, 'totalmente'],
];

function fixRow(row: Record<string, string>): { changed: boolean; fixes: string[] } {
  const fixes: string[] = [];
  let changed = false;

  const textFields = ['hero_benefit', 'shortBenefit', 'problem_statement', 'who_is_it_for', 'when_to_consider', 'description_md', 'faq', 'seoTitle', 'seoDescription', 'seo_h1', 'best_fit_profile', 'not_for_whom', 'what_makes_this_formula_different', 'comparison_note', 'science_summary', 'expectation_setting', 'top_questions_real', 'blog_support_topics', 'cautions', 'compliance_notes'];

  for (const field of textFields) {
    let val = row[field] ?? '';
    if (!val) continue;

    for (const [regex, replacement] of REPLACEMENTS) {
      const newVal = val.replace(new RegExp(regex.source, regex.flags), replacement);
      if (newVal !== val) {
        val = newVal;
        fixes.push(`${field}: termo proibido substituído`);
        changed = true;
      }
    }

    if (field === 'seoDescription' && val.length > 155) {
      val = val.slice(0, 152) + '...';
      fixes.push('seoDescription: truncado para 155 chars');
      changed = true;
    }

    row[field] = val;
  }

  return { changed, fixes };
}

function main() {
  if (!fs.existsSync(V4_PATH)) {
    console.error('❌ copy-blueprint-v4.csv não encontrado.');
    process.exit(1);
  }

  const content = fs.readFileSync(V4_PATH, 'utf-8');
  const { headers, rows } = parseCSV(content);

  let fixed = 0;
  for (const row of rows) {
    const { changed, fixes } = fixRow(row);
    if (changed) {
      fixed++;
      console.log(`  ${row.sku}: ${fixes.join('; ')}`);
    }
  }

  fs.writeFileSync(V4_PATH, writeCSV(headers, rows), 'utf-8');

  console.log(`\n✅ ${fixed} SKUs corrigidos`);
  if (fixed > 0) {
    console.log('   Rode: pnpm run copy:validate:v4');
  }
}

main();
