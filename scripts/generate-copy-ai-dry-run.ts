#!/usr/bin/env tsx
/**
 * DRY-RUN do pipeline IA — gera copy para 5 SKUs e salva em arquivo intermediário.
 * NÃO aplica ao blueprint. Permite auditoria antes de aplicar em massa.
 *
 * OBRIGATÓRIO antes de aplicar geração em massa:
 * 1. Executar este script
 * 2. Auditar scripts/generated/copy-v4-ai-dry-run-preview.json
 * 3. Validar formato (para_que_serve, how_to_use_bullets, faq, mechanism_summary)
 * 4. Só depois rodar enrich-copy-ai-batch com --limit=N
 *
 * Uso: pnpm tsx scripts/generate-copy-ai-dry-run.ts [--limit=N]
 *      OPENAI_API_KEY=sk-... pnpm tsx scripts/generate-copy-ai-dry-run.ts --limit=5
 */

import * as fs from 'fs';
import * as path from 'path';
import OpenAI from 'openai';
import { parseCSV, HIGH_RISK_SKUS, FORBIDDEN_TERMS } from './lib/copy-utils';
import { PDP_TEMPLATE_MASTER_SKU } from '../src/lib/store-v2/copy-v2';

const V4_PATH = path.join(process.cwd(), 'data', 'store-v2', 'copy', 'copy-blueprint-v4.csv');
const OUTPUT = path.join(process.cwd(), 'scripts', 'generated', 'copy-v4-ai-dry-run-preview.json');

const DEFAULT_LIMIT = 5;

function getSiblings(rows: Record<string, string>[], objective: string, excludeSku: string): string[] {
  return rows
    .filter((r) => r.objective === objective && r.sku?.trim() !== excludeSku)
    .map((r) => `${r.productName} (${r.sku})`)
    .slice(0, 8);
}

function buildPromptV4(row: Record<string, string>, siblings: string[]): string {
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

  return `Você é o melhor copywriter de e-commerce de saúde do Brasil. Copy que CONVERTE.

PRINCÍPIOS: FATOS NUNCA FAKE. Benefícios sempre em evidência. Cada frase deve estimular a compra e a melhora da saúde. Use "pode", "auxiliar", "apoiar". NUNCA: cura, trata, garante, 100%.

Contexto:
- sku: ${ctx.sku}
- nome: ${ctx.name}
- objetivo: ${ctx.objective}
- categoria: ${ctx.category}
- ativo/dose: ${ctx.ingredients} ${ctx.dose}
- forma: ${ctx.form}
- pack: ${ctx.pack}
- risco: ${ctx.risk}
- irmãos: ${ctx.siblings}

FORMATO OBRIGATÓRIO DE SAÍDA (JSON válido). Cada produto deve parecer ÚNICO.

{
  "hero_benefit": "Frase de impacto com ativo + dose + benefício principal (ex: '5-HTP 100 mg: suporte ao equilíbrio emocional pela produção natural de serotonina.')",
  "mechanism_summary": "Subtítulo ≤180 chars. Explica o COMO em linguagem acessível. Mecanismo + benefício.",
  "para_que_serve": "Benefício1 | Descrição com mecanismo e benefício. | Benefício2 | Descrição. | Benefício3 | Descrição. | Benefício4 | Descrição. | Benefício5 | Descrição. | Benefício6 | Descrição.",
  "science_summary": "Mecanismo científico: hormônios, vias, efeitos. Linguagem acessível. 2-4 frases.",
  "what_makes_this_formula_different": "O que torna ESTA fórmula única: dose, forma, biodisponibilidade.",
  "best_fit_profile": "Ideal para quem busca X, com foco em Y e orientação Z.",
  "how_to_use_bullets": "- Tomar 1 cápsula ao dia. | - Apresentação: 60 cápsulas. | - Siga orientação do médico ou nutricionista.",
  "faq": "O que é [PRODUTO]? | Resposta. | Como usar [PRODUTO]? | Resposta. | [PRODUTO] tem contraindicações? | Resposta. | Posso tomar [PRODUTO] com outros? | Resposta. | [PRODUTO] substitui alimentação? | Resposta.",
  "advertencias_completo": "Imagens meramente ilustrativas. Manter em local seco, longe da luz e do calor. Manter fora do alcance das crianças. Gestantes, lactantes e crianças devem consultar médico antes do uso. Este produto não substitui uma alimentação equilibrada e hábitos saudáveis.",
  "seo_h1": "...",
  "seoTitle": "...",
  "seoDescription": "...",
  "description_md": "Parágrafo: o que é + para que serve + benefícios principais + resultados quando associado a..."
}

Regras:
- mechanism_summary: MÁXIMO 180 caracteres
- para_que_serve: exatamente 6 pares (Título | Desc). Benefícios em evidência.
- how_to_use_bullets: 3 itens no formato "- item"
- faq: 5 pares (Pergunta | Resposta). Perguntas reais de comprador hesitante.
- benefício + mecanismo + aplicação prática em cada campo

Retorne APENAS o JSON, sem markdown.`;
}

async function generateOne(
  client: OpenAI,
  row: Record<string, string>,
  siblings: string[],
  model: string
): Promise<Record<string, string> | null> {
  const prompt = buildPromptV4(row, siblings);
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

function validateFormat(result: Record<string, string>, sku: string): string[] {
  const errs: string[] = [];
  const allText = Object.values(result).filter(Boolean).join(' ');
  if (FORBIDDEN_TERMS.test(allText)) errs.push('FORBIDDEN_TERMS detectado');
  if (result.mechanism_summary && result.mechanism_summary.length > 180) {
    errs.push(`mechanism_summary > 180 chars (${result.mechanism_summary.length})`);
  }
  const pq = result.para_que_serve?.split(/\s*\|\s*/) ?? [];
  if (pq.length < 6) errs.push(`para_que_serve: esperado 6+ pares, atual ${pq.length / 2}`);
  const faq = result.faq?.split(/\s*\|\s*/) ?? [];
  if (faq.length < 10) errs.push(`faq: esperado 5 pares (10 partes), atual ${faq.length}`);
  const how = result.how_to_use_bullets?.split(/\s*\|\s*/) ?? [];
  if (how.length < 2) errs.push(`how_to_use_bullets: esperado 2+ itens, atual ${how.length}`);
  return errs;
}

async function main() {
  const limitArg = process.argv.find((a) => a.startsWith('--limit='));
  const limit = limitArg ? parseInt(limitArg.split('=')[1] || String(DEFAULT_LIMIT), 10) : DEFAULT_LIMIT;

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    console.error('❌ OPENAI_API_KEY não definida. Execute: export OPENAI_API_KEY=sk-...');
    process.exit(1);
  }

  if (!fs.existsSync(V4_PATH)) {
    console.error('❌ copy-blueprint-v4.csv não encontrado.');
    process.exit(1);
  }

  const content = fs.readFileSync(V4_PATH, 'utf-8');
  const { headers, rows } = parseCSV(content);

  const toProcess = rows
    .filter((r) => r.sku?.trim() && r.sku !== PDP_TEMPLATE_MASTER_SKU && !HIGH_RISK_SKUS.includes(r.sku?.trim() ?? ''))
    .slice(0, limit);

  if (toProcess.length === 0) {
    console.error('❌ Nenhum SKU elegível para processar.');
    process.exit(1);
  }

  console.log(`\n📦 DRY-RUN: Gerando copy para ${toProcess.length} SKUs (NÃO aplica ao blueprint)\n`);

  const client = new OpenAI({ apiKey });
  const model = process.env.OPENAI_MODEL || 'gpt-4o-mini';

  const preview: Array<{
    sku: string;
    productName: string;
    objective: string;
    generated: Record<string, string>;
    validationErrors: string[];
  }> = [];

  for (const row of toProcess) {
    const sku = row.sku?.trim() ?? '';
    const siblings = getSiblings(rows, row.objective ?? '', sku);
    const generated = await generateOne(client, row, siblings, model);
    const validationErrors = generated ? validateFormat(generated, sku) : ['Falha na geração'];
    preview.push({
      sku,
      productName: row.productName ?? '',
      objective: row.objective ?? '',
      generated: generated ?? {},
      validationErrors,
    });
    console.log(`  ${sku} ${row.productName} — ${generated ? (validationErrors.length ? '⚠️ ' + validationErrors.join('; ') : '✓') : '❌ falha'}`);
  }

  const outDir = path.dirname(OUTPUT);
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });
  fs.writeFileSync(
    OUTPUT,
    JSON.stringify(
      {
        generatedAt: new Date().toISOString(),
        limit,
        totalGenerated: preview.filter((p) => Object.keys(p.generated).length > 0).length,
        totalWithErrors: preview.filter((p) => p.validationErrors.length > 0).length,
        preview,
      },
      null,
      2
    ),
    'utf-8'
  );

  console.log(`\n✅ Dry-run concluído. Preview salvo em: ${OUTPUT}`);
  console.log('   Audite o arquivo antes de aplicar ao blueprint.');
  console.log('   Para aplicar: pnpm run copy:enrich-ai-batch -- --limit=N');
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
