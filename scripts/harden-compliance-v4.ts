#!/usr/bin/env tsx
/**
 * Compliance hardening para v4 — aplica linguagem endurecida aos high-risk.
 * Usa as mesmas regras do harden-high-risk-copy (v2).
 * Uso: pnpm run copy:harden-compliance-v4
 */

import * as fs from 'fs';
import * as path from 'path';
import { parseCSV, writeCSV, HIGH_RISK_SKUS } from './lib/copy-utils';

const V4_PATH = path.join(process.cwd(), 'data', 'store-v2', 'copy', 'copy-blueprint-v4.csv');
const REPORT_PATH = path.join(process.cwd(), 'scripts', 'generated', 'copy-v4-compliance-report.json');

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

const HARDEN_CAUTIONS =
  'Produto sob prescrição. Requer avaliação médica. Gestantes, lactantes e crianças devem consultar médico antes do uso.';

function main() {
  if (!fs.existsSync(V4_PATH)) {
    console.error('❌ copy-blueprint-v4.csv não encontrado.');
    process.exit(1);
  }

  const content = fs.readFileSync(V4_PATH, 'utf-8');
  const { headers, rows } = parseCSV(content);

  const report: {
    generatedAt: string;
    skusHardened: number;
    changes: { sku: string; field: string }[];
  } = {
    generatedAt: new Date().toISOString(),
    skusHardened: 0,
    changes: [],
  };

  for (const row of rows) {
    const sku = row.sku?.trim();
    if (!sku || !HIGH_RISK_SKUS.includes(sku)) continue;

    const h = HARDENINGS[sku];
    if (!h) continue;

    report.skusHardened++;
    for (const [field, value] of Object.entries(h)) {
      if (headers.includes(field) && row[field] !== value) {
        row[field] = value;
        report.changes.push({ sku, field });
      }
    }
    row.cautions = HARDEN_CAUTIONS;
    row.needs_human_review = 'yes';
    row.publish_ready = 'no';
  }

  fs.mkdirSync(path.dirname(REPORT_PATH), { recursive: true });
  fs.writeFileSync(V4_PATH, writeCSV(headers, rows), 'utf-8');
  fs.writeFileSync(REPORT_PATH, JSON.stringify(report, null, 2), 'utf-8');

  console.log('✅ Compliance hardening v4 concluído');
  console.log(`   SKUs endurecidos: ${report.skusHardened}`);
  console.log(`   Alterações: ${report.changes.length}`);
  console.log(`   Relatório: ${REPORT_PATH}`);
}

main();
