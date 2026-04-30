#!/usr/bin/env tsx
/**
 * Valida copy-blueprint-v4.csv com Quality Gates.
 * Uso: pnpm run copy:validate:v4
 */

import * as fs from 'fs';
import * as path from 'path';
import { parseCSV, FORBIDDEN_TERMS } from './lib/copy-utils';

const BLUEPRINT_PATH = path.join(process.cwd(), 'data', 'store-v2', 'copy', 'copy-blueprint-v4.csv');
const REPORT_PATH = path.join(process.cwd(), 'scripts', 'generated', 'copy-v4-validate-report.json');

const REQUIRED_COLUMNS = [
  'sku',
  'productName',
  'hero_benefit',
  'shortBenefit',
  'description_md',
  'faq',
  'cautions',
  'seoTitle',
  'seoDescription',
  'seo_h1',
  'editorial_score',
  'compliance_score',
  'needs_human_review',
  'publish_ready',
  'para_que_serve',
  'references',
  'how_to_use_bullets',
  'advertencias_completo',
];

const REQUIRED_SECTIONS = ['## O que é', '## Para quem pode fazer sentido', '## Diferenciais da fórmula', '## Como usar', '## Cuidados'];

function countFaqPairs(faq: string): number {
  const parts = (faq ?? '').split(/\s*\|\s*/).map((s) => s.trim()).filter(Boolean);
  return Math.floor(parts.length / 2);
}

function parsePipeItems(text: string): string[] {
  return (text ?? '').split(/\s*\|\s*/).map((s) => s.trim()).filter(Boolean);
}

function main() {
  if (!fs.existsSync(BLUEPRINT_PATH)) {
    console.error('❌ copy-blueprint-v4.csv não encontrado.');
    process.exit(1);
  }

  const content = fs.readFileSync(BLUEPRINT_PATH, 'utf-8');
  const { headers, rows } = parseCSV(content);

  const errors: string[] = [];
  const warnings: string[] = [];

  if (rows.length !== 162) {
    errors.push(`Linhas de dados: ${rows.length} (esperado: 162)`);
  }

  for (const col of REQUIRED_COLUMNS) {
    if (!headers.includes(col)) {
      errors.push(`Coluna obrigatória ausente: ${col}`);
    }
  }

  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];
    const sku = row.sku ?? `linha ${i + 2}`;

    for (const col of REQUIRED_COLUMNS) {
      if (!headers.includes(col)) continue;
      const val = (row[col] ?? '').trim();
      if (!val) {
        errors.push(`${sku}: campo obrigatório vazio: ${col}`);
      }
    }

    const desc = row.description_md ?? '';
    for (const sec of REQUIRED_SECTIONS) {
      if (!desc.includes(sec)) {
        warnings.push(`${sku}: description_md sem seção "${sec}"`);
      }
    }

    const fullText = JSON.stringify(row);
    if (FORBIDDEN_TERMS.test(fullText)) {
      errors.push(`${sku}: contém termo proibido (cura, trata, garante, etc.)`);
    }

    const seoDesc = row.seoDescription ?? '';
    if (seoDesc.length > 155) {
      errors.push(`${sku}: seoDescription > 155 caracteres (${seoDesc.length})`);
    }

    const score = parseInt(row.editorial_score ?? '0', 10);
    if (isNaN(score) || score < 0 || score > 100) {
      warnings.push(`${sku}: editorial_score inválido: ${row.editorial_score}`);
    }

    const faqPairs = countFaqPairs(row.faq ?? '');
    if (faqPairs < 5) {
      errors.push(`${sku}: FAQ com ${faqPairs} pares (mínimo 5)`);
    }

    const paraItems = Math.floor(parsePipeItems(row.para_que_serve ?? '').length / 2);
    if (paraItems < 5) {
      errors.push(`${sku}: para_que_serve com ${paraItems} pares (mínimo 5)`);
    }

    const howToUseItems = parsePipeItems(row.how_to_use_bullets ?? '').length;
    if (howToUseItems < 3) {
      errors.push(`${sku}: how_to_use_bullets com ${howToUseItems} itens (mínimo 3)`);
    }

    const references = parsePipeItems(row.references ?? '');
    const clickableReferences = references.filter((r) =>
      /(https?:\/\/|doi\.org|pubmed\.ncbi\.nlm\.nih\.gov|ncbi\.nlm\.nih\.gov)/i.test(r)
    );
    if (references.length < 3) {
      errors.push(`${sku}: references com ${references.length} itens (mínimo 3)`);
    }
    if (clickableReferences.length < 3) {
      errors.push(`${sku}: references clicáveis com ${clickableReferences.length} itens (mínimo 3)`);
    }
  }

  const report = {
    validatedAt: new Date().toISOString(),
    totalRows: rows.length,
    errors,
    warnings,
    passed: errors.length === 0,
  };

  fs.mkdirSync(path.dirname(REPORT_PATH), { recursive: true });
  fs.writeFileSync(REPORT_PATH, JSON.stringify(report, null, 2), 'utf-8');

  if (errors.length > 0) {
    console.error('❌ Validação falhou');
    errors.forEach((e) => console.error(`   ${e}`));
    process.exit(1);
  }

  console.log('✅ Validação v4 OK');
  console.log(`   SKUs: ${rows.length}`);
  if (warnings.length > 0) {
    console.log(`   Avisos: ${warnings.length}`);
  }
  console.log(`   Relatório: ${REPORT_PATH}`);
}

main();
