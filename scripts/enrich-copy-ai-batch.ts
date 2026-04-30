#!/usr/bin/env tsx
/**
 * Enriquecimento por IA em lote — gera copy premium para SKUs do v4.
 * Requer OPENAI_API_KEY. Sem API key, pula a geração e mantém v4 intacto.
 * Uso: pnpm run copy:enrich-ai-batch [--dry-run] [--limit=N]
 */

import * as fs from 'fs';
import * as path from 'path';
import OpenAI from 'openai';
import { parseCSV, writeCSV, HIGH_RISK_SKUS, FORBIDDEN_TERMS } from './lib/copy-utils';
import { PDP_TEMPLATE_MASTER_SKU } from '../src/lib/store-v2/copy-v2';

const V4_PATH = path.join(process.cwd(), 'data', 'store-v2', 'copy', 'copy-blueprint-v4.csv');
const REPORT_PATH = path.join(process.cwd(), 'scripts', 'generated', 'copy-v4-enrich-report.json');

const BATCH_SIZE = 3;
const DELAY_MS = 2000;

function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

function getSiblings(rows: Record<string, string>[], objective: string, excludeSku: string): string[] {
  return rows
    .filter((r) => r.objective === objective && r.sku?.trim() !== excludeSku)
    .map((r) => `${r.productName} (${r.sku})`)
    .slice(0, 8);
}

function buildPrompt(row: Record<string, string>, siblings: string[]): string {
  const ctx = {
    sku: row.sku,
    name: row.productName,
    objective: row.objective,
    category: row.niche,
    ingredients: row.primaryActive,
    dose: row.dose,
    form: row.normalizedFormDisplay,
    pack: row.pack,
    risk: row.compliance_risk || 'low',
    siblings: siblings.join('; '),
  };

  return `Você é o melhor copywriter de e-commerce de saúde do mundo. Copy que CONVERTE ao máximo.

PRINCÍPIOS OBRIGATÓRIOS:
- FATOS, NUNCA FAKE: use apenas mecanismos científicos reais e linguagem precisa. Nunca invente estudos.
- BENEFÍCIOS EM EVIDÊNCIA: cada frase deve destacar um benefício claro que estimule a compra e a melhora da saúde.
- CONVERSÃO: cada campo deve reduzir objeção e aproximar o leitor da decisão de compra.
- COMPLIANCE: use "pode", "auxiliar", "apoiar". NUNCA: cura, trata, garante, 100%, resultado garantido.

Contexto do SKU:
- sku: ${ctx.sku}
- nome: ${ctx.name}
- objetivo: ${ctx.objective}
- categoria: ${ctx.category}
- fórmula/ativos: ${ctx.ingredients}
- dose/concentração: ${ctx.dose}
- forma: ${ctx.form}
- quantidade: ${ctx.pack}
- risco regulatório: ${ctx.risk}
- produtos irmãos: ${ctx.siblings}

REGRAS DE OURO:
- hero_benefit: frase de impacto 10-15 palavras. Benefício principal em evidência.
- para_que_serve: 6 pares (Título | Descrição). Ex: "Equilíbrio Emocional | O 5-HTP pode auxiliar na produção de serotonina..."
- mechanism_summary: ≤180 chars. Explica o COMO em linguagem acessível.
- how_to_use_bullets: 3 itens. Ex: "- Tomar 1 cápsula ao dia. | - Apresentação: 60 cápsulas. | - Siga orientação do médico."
- faq: 5 pares (Pergunta | Resposta). Perguntas reais de comprador hesitante.
- science_summary: mecanismo + 1 curiosidade que gera confiança.
- what_makes_this_formula_different: ângulo único que DIFERENCIA dos irmãos.

Campos obrigatórios (JSON válido):
{
  "hero_benefit": "...",
  "shortBenefit": "...",
  "mechanism_summary": "...",
  "para_que_serve": "Benefício1 | Desc. | Benefício2 | Desc. | Benefício3 | Desc. | Benefício4 | Desc. | Benefício5 | Desc. | Benefício6 | Desc.",
  "how_to_use_bullets": "- item1. | - item2. | - item3.",
  "problem_statement": "...",
  "who_is_it_for": "...",
  "when_to_consider": "...",
  "what_makes_this_formula_different": "...",
  "comparison_note": "...",
  "science_summary": "...",
  "evidence_level": "low|moderate|strong",
  "expectation_setting": "...",
  "faq": "Pergunta 1? | Resposta 1 | Pergunta 2? | Resposta 2 | ...",
  "seo_h1": "...",
  "seoTitle": "...",
  "seoDescription": "...",
  "description_md": "Parágrafo: o que é + para que serve + benefícios + resultados quando associado a hábitos saudáveis.",
  "top_questions_real": "...",
  "blog_support_topics": "...",
  "cautions": "...",
  "compliance_notes": "...",
  "best_fit_profile": "...",
  "not_for_whom": "...",
  "advertencias_completo": "Imagens meramente ilustrativas. Manter em local seco, longe da luz e do calor. Manter fora do alcance das crianças. Gestantes, lactantes e crianças devem consultar médico antes do uso. Este produto não substitui uma alimentação equilibrada e hábitos saudáveis."
}

Retorne APENAS o JSON, sem markdown.`;
}

async function enrichOne(
  client: OpenAI,
  row: Record<string, string>,
  siblings: string[],
  model: string
): Promise<Record<string, string> | null> {
  const prompt = buildPrompt(row, siblings);
  try {
    const res = await client.chat.completions.create({
      model,
      temperature: 0.5,
      response_format: { type: 'json_object' },
      messages: [{ role: 'user', content: prompt }],
    });
    const raw = res.choices[0]?.message?.content?.trim();
    if (!raw) return null;
    const parsed = JSON.parse(raw.replace(/```json\s*/g, '').replace(/```\s*/g, ''));
    return parsed as Record<string, string>;
  } catch (e) {
    console.error(`  Erro ${row.sku}:`, (e as Error).message);
    return null;
  }
}

async function main() {
  const dryRun = process.argv.includes('--dry-run');
  const limitArg = process.argv.find((a) => a.startsWith('--limit='));
  const limit = limitArg ? parseInt(limitArg.split('=')[1] || '0', 10) : 0;
  const skipArg = process.argv.find((a) => a.startsWith('--skip='));
  const skip = skipArg ? parseInt(skipArg.split('=')[1] || '0', 10) : 0;

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    console.log('⚠️ OPENAI_API_KEY não definida. Pulando enriquecimento por IA.');
    console.log('   Execute: export OPENAI_API_KEY=sk-...');
    process.exit(0);
  }

  if (!fs.existsSync(V4_PATH)) {
    console.error('❌ copy-blueprint-v4.csv não encontrado. Rode copy:blueprint:v4 antes.');
    process.exit(1);
  }

  const content = fs.readFileSync(V4_PATH, 'utf-8');
  const { headers, rows } = parseCSV(content);
  const model = process.env.OPENAI_MODEL || 'gpt-4o-mini';

  const toProcess = limit > 0 ? rows.slice(skip, skip + limit) : rows.slice(skip);
  const report: {
    generatedAt: string;
    totalProcessed: number;
    success: number;
    failed: string[];
    dryRun: boolean;
  } = {
    generatedAt: new Date().toISOString(),
    totalProcessed: 0,
    success: 0,
    failed: [],
    dryRun,
  };

  if (dryRun) {
    console.log(`[dry-run] Processaria ${toProcess.length} SKUs com ${model}`);
    process.exit(0);
  }

  const client = new OpenAI({ apiKey });
  const updates: Record<string, Record<string, string>> = {};
  const total = toProcess.filter(
    (r) => r.sku?.trim() !== PDP_TEMPLATE_MASTER_SKU && !HIGH_RISK_SKUS.includes(r.sku?.trim() ?? '')
  ).length;

  console.log(`\n📦 Processando ${total} SKUs (batch ${BATCH_SIZE}, ~${Math.ceil(total / BATCH_SIZE) * (DELAY_MS / 1000)}s estimado)...\n`);

  let done = 0;
  for (let i = 0; i < toProcess.length; i += BATCH_SIZE) {
    const batch = toProcess.slice(i, i + BATCH_SIZE);
    const batchSkus = batch
      .filter((r) => r.sku?.trim() !== PDP_TEMPLATE_MASTER_SKU && !HIGH_RISK_SKUS.includes(r.sku?.trim() ?? ''))
      .map((r) => r.sku)
      .join(', ');
    if (batchSkus) process.stdout.write(`  [${done + 1}-${Math.min(done + batch.length, total)}/${total}] ${batchSkus}... `);

    for (const row of batch) {
      const sku = row.sku?.trim();
      if (!sku) continue;
      if (sku === PDP_TEMPLATE_MASTER_SKU || HIGH_RISK_SKUS.includes(sku)) continue;
      const siblings = getSiblings(rows, row.objective ?? '', sku);
      const result = await enrichOne(client, row, siblings, model);
      report.totalProcessed++;
      done++;
      if (result) {
        report.success++;
        for (const [k, v] of Object.entries(result)) {
          if (headers.includes(k) && typeof v === 'string') {
            if (FORBIDDEN_TERMS.test(v)) continue;
            if (!updates[sku]) updates[sku] = {};
            updates[sku][k] = v;
          }
        }
      } else {
        report.failed.push(sku);
      }
    }
    if (batchSkus) console.log(`✓ (${report.success} ok)`);
    await sleep(DELAY_MS);
  }

  for (const row of rows) {
    const sku = row.sku?.trim();
    const u = updates[sku];
    if (u) {
      for (const [k, v] of Object.entries(u)) {
        row[k] = v;
      }
    }
  }

  fs.mkdirSync(path.dirname(REPORT_PATH), { recursive: true });
  fs.writeFileSync(V4_PATH, writeCSV(headers, rows), 'utf-8');
  fs.writeFileSync(REPORT_PATH, JSON.stringify(report, null, 2), 'utf-8');

  console.log('✅ Enriquecimento AI concluído');
  console.log(`   Processados: ${report.totalProcessed}`);
  console.log(`   Sucesso: ${report.success}`);
  console.log(`   Falhas: ${report.failed.length}`);
  console.log(`   Relatório: ${REPORT_PATH}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
