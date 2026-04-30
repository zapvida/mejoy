#!/usr/bin/env tsx
/**
 * Valida referências científicas do copy-blueprint-v4.
 * Regras:
 * - cada SKU deve ter >= 3 referências
 * - as 3 primeiras devem ser clicáveis (URL/DOI/PubMed)
 * - links devem responder HTTP 2xx/3xx
 */

import * as fs from 'fs';
import * as path from 'path';
import { parseCSV } from './lib/copy-utils';

const BLUEPRINT_PATH = path.join(process.cwd(), 'data', 'store-v2', 'copy', 'copy-blueprint-v4.csv');
const REPORT_PATH = path.join(process.cwd(), 'scripts', 'generated', 'scientific-references-report.json');

function parsePipe(text: string): string[] {
  return (text ?? '').split(/\s*\|\s*/).map((s) => s.trim()).filter(Boolean);
}

function extractUrl(reference: string): string | null {
  const safe = String(reference ?? '').trim();
  const explicitUrl = safe.match(/https?:\/\/[^\s)]+/i)?.[0];
  if (explicitUrl) return explicitUrl.replace(/[.,;]+$/, '');

  const doiUrl = safe.match(/doi\.org\/[^\s)]+/i)?.[0];
  if (doiUrl) return `https://${doiUrl.replace(/[.,;]+$/, '')}`;

  const doiCode = safe.match(/\b10\.\d{4,9}\/[-._;()/:A-Z0-9]+\b/i)?.[0];
  if (doiCode) return `https://doi.org/${doiCode.replace(/[.,;]+$/, '')}`;

  return null;
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function extractPubmedId(url: string): string | null {
  const match = url.match(/pubmed\.ncbi\.nlm\.nih\.gov\/(\d+)\//i);
  return match?.[1] ?? null;
}

async function verifyPubmedById(pmid: string): Promise<boolean> {
  const endpoint = `https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esummary.fcgi?db=pubmed&id=${encodeURIComponent(pmid)}&retmode=json`;
  try {
    const res = await fetch(endpoint, {
      method: 'GET',
      redirect: 'follow',
      headers: {
        Accept: 'application/json',
        'User-Agent': 'MeJoyScientificValidator/1.0 (+https://www.mejoy.com.br)',
      },
    });
    if (!res.ok) return false;
    const data = await res.json() as { result?: Record<string, unknown> };
    return Boolean(data?.result?.[pmid]);
  } catch {
    return false;
  }
}

async function checkUrl(url: string): Promise<{ ok: boolean; status: number }> {
  const headers = {
    Accept: 'text/html,application/json',
    'User-Agent': 'MeJoyScientificValidator/1.0 (+https://www.mejoy.com.br)',
  };
  const attempts = 3;

  for (let attempt = 0; attempt < attempts; attempt++) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 12000);
    try {
      const head = await fetch(url, {
        method: 'HEAD',
        redirect: 'follow',
        signal: controller.signal,
        headers,
      });
      if (head.status >= 200 && head.status < 400) return { ok: true, status: head.status };
      if (head.status !== 429 && head.status !== 503) {
        clearTimeout(timeout);
        return { ok: false, status: head.status };
      }
    } catch {
      // fallback para GET no mesmo ciclo
    } finally {
      clearTimeout(timeout);
    }

    const controllerGet = new AbortController();
    const timeoutGet = setTimeout(() => controllerGet.abort(), 12000);
    try {
      const get = await fetch(url, {
        method: 'GET',
        redirect: 'follow',
        signal: controllerGet.signal,
        headers,
      });
      if (get.status >= 200 && get.status < 400) return { ok: true, status: get.status };
      if (get.status !== 429 && get.status !== 503) {
        return { ok: false, status: get.status };
      }
      if (attempt < attempts - 1) {
        await sleep(700 * (attempt + 1));
      }
    } catch {
      if (attempt < attempts - 1) {
        await sleep(700 * (attempt + 1));
      }
    } finally {
      clearTimeout(timeoutGet);
    }
  }

  // Fallback específico para PubMed quando houver rate limit/instabilidade HTTP.
  const pmid = extractPubmedId(url);
  if (pmid) {
    const verified = await verifyPubmedById(pmid);
    if (verified) {
      return { ok: true, status: 200 };
    }
  }

  return { ok: false, status: 0 };
}

async function main() {
  if (!fs.existsSync(BLUEPRINT_PATH)) {
    console.error('❌ copy-blueprint-v4.csv não encontrado.');
    process.exit(1);
  }

  const { rows } = parseCSV(fs.readFileSync(BLUEPRINT_PATH, 'utf-8'));
  const errors: string[] = [];
  const warnings: string[] = [];
  const linkToSku = new Map<string, string[]>();

  for (const row of rows) {
    const sku = (row.sku ?? '').trim() || 'SKU_DESCONHECIDO';
    const refs = parsePipe(row.references ?? '');
    if (refs.length < 3) {
      errors.push(`${sku}: references com ${refs.length} itens (mínimo 3)`);
      continue;
    }

    const firstThree = refs.slice(0, 3);
    for (const ref of firstThree) {
      const url = extractUrl(ref);
      if (!url) {
        errors.push(`${sku}: referência sem link clicável: "${ref.slice(0, 90)}"`);
        continue;
      }
      const skus = linkToSku.get(url) ?? [];
      skus.push(sku);
      linkToSku.set(url, skus);
    }
  }

  const uniqueUrls = [...linkToSku.keys()];
  for (const url of uniqueUrls) {
    const check = await checkUrl(url);
    if (!check.ok) {
      const skus = [...new Set(linkToSku.get(url) ?? [])].slice(0, 6).join(', ');
      errors.push(`URL inválida/inacessível (${check.status}): ${url} [SKUs: ${skus}]`);
    } else if (check.status >= 300) {
      warnings.push(`URL com redirecionamento (${check.status}): ${url}`);
    }
  }

  const report = {
    validatedAt: new Date().toISOString(),
    totalSkus: rows.length,
    totalUniqueUrlsChecked: uniqueUrls.length,
    errors,
    warnings,
    passed: errors.length === 0,
  };

  fs.mkdirSync(path.dirname(REPORT_PATH), { recursive: true });
  fs.writeFileSync(REPORT_PATH, JSON.stringify(report, null, 2), 'utf-8');

  if (errors.length > 0) {
    console.error('❌ Validação de referências científicas falhou');
    errors.slice(0, 30).forEach((e) => console.error(`   ${e}`));
    if (errors.length > 30) console.error(`   ... e mais ${errors.length - 30} erros`);
    console.error(`   Relatório: ${REPORT_PATH}`);
    process.exit(1);
  }

  console.log('✅ Validação de referências científicas OK');
  console.log(`   SKUs: ${rows.length}`);
  console.log(`   URLs verificadas: ${uniqueUrls.length}`);
  if (warnings.length > 0) console.log(`   Avisos: ${warnings.length}`);
  console.log(`   Relatório: ${REPORT_PATH}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
