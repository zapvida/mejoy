/**
 * Utilitários compartilhados para scripts de copy.
 */

export const NL = ' | ';

export function parseCSVLine(line: string): string[] {
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

export function parseCSV(content: string): { headers: string[]; rows: Record<string, string>[] } {
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

export function escapeCSV(val: string): string {
  const v = (val || '').replace(/\r?\n/g, NL).replace(/"/g, '""');
  if (v.includes(',') || v.includes('"')) return `"${v}"`;
  return v;
}

export function writeCSV(headers: string[], rows: Record<string, string>[]): string {
  const lines = [headers.join(',')];
  for (const row of rows) {
    lines.push(headers.map((h) => escapeCSV(row[h] ?? '')).join(','));
  }
  return lines.join('\n');
}

export const HIGH_RISK_SKUS = [
  'MEJOY-0036', 'MEJOY-0037', 'MEJOY-0038', 'MEJOY-0039', 'MEJOY-0040',
  'MEJOY-0057', 'MEJOY-0058', 'MEJOY-0059', 'MEJOY-0060',
  'MEJOY-0066',
  'MEJOY-0126', 'MEJOY-0127', 'MEJOY-0128',
  'MEJOY-0149',
];

export const FORBIDDEN_TERMS = /\bcura\b|\btrata\b|\bgarante\b|100%|\breverte\b|resultado em \d|sem efeitos colaterais/i;

export const V4_REQUIRED_FIELDS = [
  'hero_benefit', 'shortBenefit', 'problem_statement', 'who_is_it_for', 'when_to_consider',
  'what_makes_this_formula_different', 'comparison_note', 'science_summary', 'evidence_level',
  'best_fit_profile', 'not_for_whom', 'top_questions_real', 'faq', 'seo_h1', 'seoTitle',
  'seoDescription', 'description_md', 'blog_support_topics', 'cautions', 'compliance_notes',
  'editorial_score', 'differentiation_score', 'semantic_depth_score', 'compliance_score',
  'organic_potential_score', 'clarity_score', 'needs_human_review', 'publish_ready',
];
