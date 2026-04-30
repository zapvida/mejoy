#!/usr/bin/env tsx
/**
 * Endurece os 14 produtos high risk no copy-blueprint-v2.csv.
 * Substitui linguagem sensível por versões mais seguras.
 * Uso: pnpm run copy:harden-high-risk
 */

import * as fs from 'fs';
import * as path from 'path';

const V2_PATH = path.join(process.cwd(), 'data', 'store-v2', 'copy', 'copy-blueprint-v2.csv');
const REPORT_PATH = path.join(process.cwd(), 'scripts', 'generated', 'copy-high-risk-review-report.json');

const HIGH_RISK_SKUS = [
  'MEJOY-0036', 'MEJOY-0037', 'MEJOY-0038', 'MEJOY-0039', 'MEJOY-0040',
  'MEJOY-0057', 'MEJOY-0058', 'MEJOY-0059', 'MEJOY-0060',
  'MEJOY-0066',
  'MEJOY-0126', 'MEJOY-0127', 'MEJOY-0128',
  'MEJOY-0149',
];

const HARDENINGS: Record<string, Partial<Record<string, string>>> = {
  'MEJOY-0036': {
    hero_benefit: 'Solução tópica com minoxidil, D-pantenol e auxina para apoio à saúde dos fios.',
    shortBenefit: 'Solução tópica para apoio à saúde dos fios e do couro cabeludo.',
    problem_statement: 'Preocupação com saúde dos fios e do couro cabeludo.',
    when_to_consider: 'Quando o médico indicar o uso e houver interesse em suporte capilar.',
    compliance_notes: 'Produto sob prescrição. Requer avaliação médica. Linguagem endurecida.',
  },
  'MEJOY-0037': {
    hero_benefit: 'Minoxidil 5% com biotina em solução tópica para apoio à saúde dos fios.',
    shortBenefit: 'Solução tópica para apoio à saúde dos fios.',
    problem_statement: 'Preocupação com saúde dos fios e do couro cabeludo.',
    when_to_consider: 'Quando o médico indicar o uso e houver interesse em suporte capilar.',
    compliance_notes: 'Produto sob prescrição. Requer avaliação médica. Linguagem endurecida.',
  },
  'MEJOY-0038': {
    hero_benefit: 'Minoxidil 5% com propilenoglicol em solução tópica.',
    shortBenefit: 'Solução tópica para apoio à saúde dos fios.',
    problem_statement: 'Preocupação com saúde dos fios e do couro cabeludo.',
    when_to_consider: 'Quando o médico indicar o uso e houver interesse em suporte capilar.',
    compliance_notes: 'Produto sob prescrição. Requer avaliação médica. Linguagem endurecida.',
  },
  'MEJOY-0039': {
    hero_benefit: 'Minoxidil em trichosol, fórmula leve para couro sensível.',
    shortBenefit: 'Solução tópica para apoio à saúde dos fios.',
    problem_statement: 'Preocupação com saúde dos fios e do couro cabeludo.',
    when_to_consider: 'Quando o médico indicar o uso e houver interesse em suporte capilar.',
    compliance_notes: 'Produto sob prescrição. Requer avaliação médica. Linguagem endurecida.',
  },
  'MEJOY-0040': {
    hero_benefit: 'Minoxidil turbinado em solução tópica para apoio à saúde dos fios.',
    shortBenefit: 'Solução tópica para apoio à saúde dos fios.',
    problem_statement: 'Preocupação com saúde dos fios e do couro cabeludo.',
    when_to_consider: 'Quando o médico indicar o uso e houver interesse em suporte capilar.',
    compliance_notes: 'Produto sob prescrição. Requer avaliação médica. Linguagem endurecida.',
  },
  'MEJOY-0057': {
    hero_benefit: 'Ioimbina 5 mg em cápsulas para suporte nutricional.',
    shortBenefit: 'Suporte nutricional com orientação médica.',
    problem_statement: 'Busca por apoio ao metabolismo com orientação profissional.',
    when_to_consider: 'Quando o profissional de saúde indicar o uso.',
    compliance_notes: 'Produto sensível. Requer avaliação médica. Linguagem endurecida.',
  },
  'MEJOY-0058': {
    hero_benefit: 'Ioimbina 5 mg em cápsulas para suporte nutricional.',
    shortBenefit: 'Suporte nutricional com orientação médica.',
    problem_statement: 'Busca por apoio ao metabolismo com orientação profissional.',
    when_to_consider: 'Quando o profissional de saúde indicar o uso.',
    compliance_notes: 'Produto sensível. Requer avaliação médica. Linguagem endurecida.',
  },
  'MEJOY-0059': {
    hero_benefit: 'Ioimbina 5 mg em cápsulas para suporte nutricional.',
    shortBenefit: 'Suporte nutricional com orientação médica.',
    problem_statement: 'Busca por apoio ao metabolismo com orientação profissional.',
    when_to_consider: 'Quando o profissional de saúde indicar o uso.',
    compliance_notes: 'Produto sensível. Requer avaliação médica. Linguagem endurecida.',
  },
  'MEJOY-0060': {
    hero_benefit: 'Ioimbina 10 mg em cápsulas para suporte nutricional.',
    shortBenefit: 'Suporte nutricional com orientação médica.',
    problem_statement: 'Busca por apoio ao metabolismo com orientação profissional.',
    when_to_consider: 'Quando o profissional de saúde indicar o uso.',
    compliance_notes: 'Produto sensível. Requer avaliação médica. Linguagem endurecida.',
  },
  'MEJOY-0066': {
    hero_benefit: 'Orlistat 120 mg para suporte ao metabolismo com orientação médica.',
    shortBenefit: 'Suporte ao metabolismo com orientação médica.',
    problem_statement: 'Busca por apoio ao metabolismo com orientação profissional.',
    when_to_consider: 'Quando o médico indicar o uso para apoio ao metabolismo.',
    compliance_notes: 'Produto sob prescrição. Requer avaliação médica. Linguagem endurecida.',
  },
  'MEJOY-0126': {
    hero_benefit: 'Tadalafila 10 mg em cápsulas para suporte com orientação médica.',
    shortBenefit: 'Suporte com orientação médica.',
    problem_statement: 'Bem-estar geral com orientação profissional.',
    when_to_consider: 'Quando o médico indicar o uso.',
    compliance_notes: 'Produto sob prescrição. Requer avaliação médica. Linguagem endurecida.',
  },
  'MEJOY-0127': {
    hero_benefit: 'Tadalafila 10 mg em cápsulas para suporte com orientação médica.',
    shortBenefit: 'Suporte com orientação médica.',
    problem_statement: 'Bem-estar geral com orientação profissional.',
    when_to_consider: 'Quando o médico indicar o uso.',
    compliance_notes: 'Produto sob prescrição. Requer avaliação médica. Linguagem endurecida.',
  },
  'MEJOY-0128': {
    hero_benefit: 'Tadalafila 5 mg em cápsulas para suporte com orientação médica.',
    shortBenefit: 'Suporte com orientação médica.',
    problem_statement: 'Bem-estar geral com orientação profissional.',
    when_to_consider: 'Quando o médico indicar o uso.',
    compliance_notes: 'Produto sob prescrição. Requer avaliação médica. Linguagem endurecida.',
  },
  'MEJOY-0149': {
    hero_benefit: 'Progesterona em creme transdérmico para apoio durante a menopausa.',
    shortBenefit: 'Apoio durante a menopausa com orientação médica.',
    problem_statement: 'Desconfortos do ciclo hormonal ou sintomas da menopausa.',
    when_to_consider: 'Quando o médico indicar o uso para apoio hormonal.',
    compliance_notes: 'Produto hormonal. Requer avaliação médica. Linguagem endurecida.',
  },
};

function parseCSVLine(line: string): string[] {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const c = line[i];
    if (c === '"') inQuotes = !inQuotes;
    else if (c === ',' && !inQuotes) {
      result.push(current.trim());
      current = '';
    } else if (c !== '\n' && c !== '\r') current += c;
  }
  result.push(current.trim());
  return result;
}

function parseCSV(content: string): { headers: string[]; rows: Record<string, string>[] } {
  const lines = content.split(/\r?\n/).filter((l) => l.length > 0);
  if (lines.length < 2) return { headers: [], rows: [] };
  const headers = parseCSVLine(lines[0]);
  const rows: Record<string, string>[] = [];
  for (let i = 1; i < lines.length; i++) {
    const values = parseCSVLine(lines[i]);
    const row: Record<string, string> = {};
    headers.forEach((h, j) => {
      row[h] = values[j] ?? '';
    });
    rows.push(row);
  }
  return { headers, rows };
}

function escapeCSV(val: string): string {
  const v = (val || '').replace(/\r?\n/g, ' | ').replace(/"/g, '""');
  if (v.includes(',') || v.includes('"')) return `"${v}"`;
  return v;
}

function main() {
  if (!fs.existsSync(V2_PATH)) {
    console.error('❌ copy-blueprint-v2.csv não encontrado');
    process.exit(1);
  }

  const content = fs.readFileSync(V2_PATH, 'utf-8');
  const { headers, rows } = parseCSV(content);

  const changes: { sku: string; field: string; before: string; after: string }[] = [];

  for (const row of rows) {
    const sku = row.sku?.trim();
    if (!sku || !HIGH_RISK_SKUS.includes(sku)) continue;

    const hardening = HARDENINGS[sku];
    if (!hardening) continue;

    for (const [field, value] of Object.entries(hardening)) {
      if (!headers.includes(field)) continue;
      const before = row[field] ?? '';
      if (before !== value) {
        row[field] = value;
        changes.push({ sku, field, before, after: value });
      }
    }

    row.cautions = 'Produto sob prescrição. Requer avaliação médica. Gestantes, lactantes e crianças devem consultar médico antes do uso.';
  }

  const csvLines = [headers.join(',')];
  for (const row of rows) {
    csvLines.push(headers.map((h) => escapeCSV(row[h] ?? '')).join(','));
  }
  fs.writeFileSync(V2_PATH, csvLines.join('\n'), 'utf-8');

  fs.mkdirSync(path.dirname(REPORT_PATH), { recursive: true });
  fs.writeFileSync(
    REPORT_PATH,
    JSON.stringify(
      {
        generatedAt: new Date().toISOString(),
        skusReviewed: HIGH_RISK_SKUS.length,
        changesCount: changes.length,
        changes,
      },
      null,
      2
    ),
    'utf-8'
  );

  console.log('✅ High risk endurecidos');
  console.log(`   SKUs: ${HIGH_RISK_SKUS.length}`);
  console.log(`   Alterações: ${changes.length}`);
  console.log(`   Relatório: ${REPORT_PATH}`);
}

main();
