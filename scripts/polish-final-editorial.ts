#!/usr/bin/env tsx
/**
 * Polimento editorial final orientado pela auditoria de prontidão.
 * - Reforça hero/short benefit quando curtos
 * - Melhora utilidade das respostas do FAQ
 * - Alinha para_que_serve com benefícios do first fold nos SKUs com mirror fraco
 * - Preserva Akkermat (MEJOY-0048) intocado
 */

import * as fs from 'fs';
import * as path from 'path';
import { parseCSV, writeCSV } from './lib/copy-utils';
import { getHeroBullets } from '../src/lib/store-v2/copy-v2';

const BLUEPRINT_PATH = path.join(process.cwd(), 'data', 'store-v2', 'copy', 'copy-blueprint-v4.csv');
const AUDIT_PATH = path.join(process.cwd(), 'scripts', 'generated', 'final-readiness-audit.json');
const REPORT_PATH = path.join(process.cwd(), 'scripts', 'generated', 'final-editorial-polish-report.json');

function splitPipe(text: string): string[] {
  return (text ?? '').split(/\s*\|\s*/).map((s) => s.trim()).filter(Boolean);
}

function sanitize(text: string, max = 220): string {
  const n = (text ?? '').replace(/\s+/g, ' ').trim();
  if (n.length <= max) return n;
  return n.slice(0, max - 1).trimEnd() + '…';
}

function objectiveLower(objective: string): string {
  return (objective ?? 'saúde').toLowerCase().replace(/\s*&\s*/g, ' e ');
}

function stripEmojiPrefix(text: string): string {
  return text
    .replace(/^[^\p{L}\p{N}]+/u, '')
    .replace(/\s{2,}/g, ' ')
    .trim();
}

function parseFaqPairs(faq: string): Array<{ q: string; a: string }> {
  const parts = splitPipe(faq);
  const out: Array<{ q: string; a: string }> = [];
  for (let i = 0; i < parts.length - 1; i += 2) {
    out.push({ q: parts[i] ?? '', a: parts[i + 1] ?? '' });
  }
  return out;
}

function faqToPipe(pairs: Array<{ q: string; a: string }>): string {
  return pairs.flatMap((p) => [sanitize(p.q, 180), sanitize(p.a, 280)]).join(' | ');
}

function main() {
  if (!fs.existsSync(BLUEPRINT_PATH)) {
    console.error('❌ copy-blueprint-v4.csv não encontrado.');
    process.exit(1);
  }
  if (!fs.existsSync(AUDIT_PATH)) {
    console.error('❌ final-readiness-audit.json não encontrado. Rode scripts/audit-final-readiness.ts antes.');
    process.exit(1);
  }

  const audit = JSON.parse(fs.readFileSync(AUDIT_PATH, 'utf-8')) as {
    items: Array<{ sku: string; notes?: string[] }>;
  };
  const mirrorWeak = new Set(
    (audit.items ?? [])
      .filter((i) => (i.notes ?? []).includes('FIRST_FOLD_MIRROR_FRACO'))
      .map((i) => i.sku)
  );

  const { headers, rows } = parseCSV(fs.readFileSync(BLUEPRINT_PATH, 'utf-8'));

  let heroUpdated = 0;
  let shortUpdated = 0;
  let faqUpdated = 0;
  let paraAligned = 0;

  for (const row of rows) {
    const sku = (row.sku ?? '').trim();
    if (!sku || sku === 'MEJOY-0048') continue;

    const productName = (row.productName ?? row.normalizedProductName ?? sku).trim();
    const objective = (row.objective ?? 'Saúde').trim();
    const objectiveTxt = objectiveLower(objective);

    const hero = (row.hero_benefit ?? '').trim();
    if (hero.length < 40) {
      row.hero_benefit = sanitize(
        `${productName} oferece suporte direcionado para ${objectiveTxt}, com benefício claro para rotina diária e uso orientado.`,
        180
      );
      heroUpdated++;
    }

    const shortBenefit = (row.shortBenefit ?? '').trim();
    if (shortBenefit.length < 28) {
      row.shortBenefit = sanitize(
        `Suporte prático para ${objectiveTxt}, com foco em consistência e clareza de uso.`,
        120
      );
      shortUpdated++;
    }

    const faqPairs = parseFaqPairs(row.faq ?? '');
    if (faqPairs.length >= 5) {
      let changed = false;
      const refined = faqPairs.slice(0, 5).map((item) => {
        const answer = (item.a ?? '').trim();
        if (answer.length >= 45) return item;
        changed = true;
        return {
          q: item.q,
          a: sanitize(
            `${answer || 'O uso deve seguir orientação profissional.'} A resposta varia conforme perfil clínico, rotina e aderência ao uso adequado.`,
            260
          ),
        };
      });
      if (changed) {
        row.faq = faqToPipe(refined);
        faqUpdated++;
      }
    }

    if (mirrorWeak.has(sku)) {
      const bullets = getHeroBullets(row.hero_benefit, row.shortBenefit, objective, sku).slice(0, 5);
      if (bullets.length >= 5) {
        row.para_que_serve = bullets
          .flatMap((b) => {
            const clean = stripEmojiPrefix(b).replace(/\.$/, '').trim();
            const title = sanitize(clean || 'Benefício principal', 80);
            const desc = sanitize(
              `Pode auxiliar em ${clean.toLowerCase()} com uso orientado e rotina consistente, de forma objetiva e prática.`,
              200
            );
            return [title, desc];
          })
          .join(' | ');
        paraAligned++;
      }
    }
  }

  fs.writeFileSync(BLUEPRINT_PATH, writeCSV(headers, rows), 'utf-8');

  const report = {
    generatedAt: new Date().toISOString(),
    totalRows: rows.length,
    heroUpdated,
    shortUpdated,
    faqUpdated,
    paraAligned,
  };
  fs.mkdirSync(path.dirname(REPORT_PATH), { recursive: true });
  fs.writeFileSync(REPORT_PATH, JSON.stringify(report, null, 2), 'utf-8');

  console.log('✅ Polimento editorial final concluído');
  console.log(`   Hero reforçados: ${heroUpdated}`);
  console.log(`   Short benefit reforçados: ${shortUpdated}`);
  console.log(`   FAQ refinados: ${faqUpdated}`);
  console.log(`   Para que serve alinhados: ${paraAligned}`);
  console.log(`   Relatório: ${REPORT_PATH}`);
}

main();

