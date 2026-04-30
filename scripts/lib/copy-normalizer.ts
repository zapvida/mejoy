/**
 * Normalizador robusto para copy blueprint v2.
 * Corrige capitalização, acentuação, unidades, formas farmacêuticas.
 */

export interface NormalizationIssue {
  sku: string;
  field: string;
  original: string;
  normalized: string;
  type: 'capitalization' | 'unit' | 'form' | 'duplication' | 'spacing' | 'other';
}

const NORMALIZE_MAP: [RegExp | string, string][] = [
  // Capitalização e acentuação
  [/\bSelêNio\b/gi, 'Selênio'],
  [/\bCafeíNa\b/gi, 'Cafeína'],
  [/\bôMega\b/gi, 'Ômega'],
  [/\bSachêS\b/gi, 'Sachês'],
  [/\bTransdéRmica\b/gi, 'Transdérmica'],
  [/\bTricóGena\b/gi, 'Tricógena'],
  [/\bAc Málico\b/gi, 'Ácido Málico'],
  [/\bUc Ii\b/gi, 'UC II'],
  [/\bUC II\b/g, 'UC II'],
  [/\bóLeo\b/gi, 'Óleo'],
  [/\bOLEO\b/gi, 'Óleo'],
  [/\bPrimula\b/g, 'Prímula'],
  [/\bOréGano\b/gi, 'Orégano'],
  [/\bProbióTico\b/gi, 'Probiótico'],
  [/\bGINSENG Indiano\b/g, 'Ginseng indiano'],
  [/\bGINSENG INDIANDO\b/gi, 'Ginseng indiano'],
  [/\bASWHAGANDA\b/gi, 'Ashwagandha'],
  [/\bINDIANDO\b/gi, 'Indiano'],
  [/\bPalmeto\b/g, 'Palmetto'],
  [/\bSaw Palmeto\b/gi, 'Saw Palmetto'],
  [/\bMáLico\b/g, 'Málico'],
  [/\bMagnéSio\b/g, 'Magnésio'],
  [/\bColáGeno\b/g, 'Colágeno'],
  [/\bTrimagnéSio\b/g, 'Trimagnésio'],
  [/\bEquilíBrio\b/g, 'Equilíbrio'],
  [/\bFóRmula\b/g, 'Fórmula'],
  [/\bHialurôNico\b/gi, 'Hialurônico'],
  [/\bAC HIALURONICO\b/gi, 'Ácido Hialurônico'],
  [/\bN ACETILCISTEINA\b/gi, 'N-Acetilcisteína'],
  [/\bL TEANINE\b/gi, 'L-Teanina'],
  [/\bL TEANINA\b/gi, 'L-Teanina'],
  [/\bIOMBINA\b/gi, 'Ioimbina'],
  [/\bIOIMBINA\b/gi, 'Ioimbina'],
  [/\bTRIBULLUS\b/gi, 'Tribulus'],
  [/\bMINOXDIL\b/gi, 'Minoxidil'],
  [/\bOL SEMENTE DE ABÓORA\b/gi, 'Óleo de Semente de Abóbora'],
  [/\bABÓORA\b/gi, 'Abóbora'],
  [/\bBETAÍNA HCL\b/gi, 'Betaína HCl'],
  [/\bTRANS RESVERATROL\b/gi, 'Trans-Resveratrol'],
  [/\bCHA VERDE \(EXT S\)\b/gi, 'Chá Verde (Extrato Seco)'],
  [/\bTipo Ii\b/gi, 'Tipo II'],
  [/\bTIPO II\b/g, 'Tipo II'],
];

function applyNormalizeMap(s: string): string {
  let out = s;
  for (const [from, to] of NORMALIZE_MAP) {
    out = out.replace(from as RegExp, to);
  }
  return out;
}

/** Normaliza unidades: 100  g → 100 g, 300g → 300 g */
function normalizeUnits(s: string): string {
  return (s || '')
    .replace(/(\d+)\s{2,}(\d*)\s*(g|mg|mcg|mL|ml|G|MG|MCG)\b/gi, (_, n, n2, u) => {
      if (n2) return `${n} ${n2} ${u.toLowerCase()}`;
      return `${n} ${u.toLowerCase().replace('ml', 'mL')}`;
    })
    .replace(/(\d+)(g|mg|mcg)(?=\s|$|,)/gi, (_, n, u) => `${n} ${u.toLowerCase().replace('ml', 'mL')}`)
    .replace(/\b(\d+)\s{2,}(g|mg|mcg|mL)\b/gi, (_, n, u) => `${n} ${u.toLowerCase()}`)
    .trim();
}

/** Elimina duplicações como "50 g 50 g" */
function fixDuplications(s: string): string {
  const dupMatch = s.match(/(\d+)\s*(g|mg|mL)\s+\d+\s*\2\b/i);
  if (dupMatch) {
    return s.replace(/(\d+)\s*(g|mg|mL)\s+\d+\s*\2/gi, `$1 $2`);
  }
  if (/\b50\s*g\s+50\s*g\b/i.test(s) || /\b50G\s+50\s*g\b/i.test(s)) {
    return s.replace(/\b50G?\s*50\s*g\b/gi, '50 g');
  }
  if (/\b100\s{2,}g\b/i.test(s)) {
    return s.replace(/\b100\s{2,}g\b/gi, '100 g');
  }
  return s;
}

/** Normaliza formKey para display legível */
export function normalizeFormDisplay(formKey: string): string {
  const map: Record<string, string> = {
    caps: 'cápsulas',
    sachet: 'sachês',
    powder: 'pó',
    cream: 'creme',
    topical: 'solução tópica',
    drops: 'gotas',
    shampoo: 'shampoo',
  };
  return map[(formKey || 'caps').toLowerCase()] || 'cápsulas';
}

/** Normaliza nome do produto */
export function normalizeProductName(name: string, issues: NormalizationIssue[], sku: string): string {
  const original = name;
  let out = applyNormalizeMap(name);
  out = normalizeUnits(out);
  out = fixDuplications(out);
  out = out.replace(/\s{2,}/g, ' ').trim();
  if (out !== original) {
    issues.push({ sku, field: 'productName', original, normalized: out, type: 'capitalization' });
  }
  return out;
}

/** Normaliza primaryActive */
export function normalizePrimaryActive(active: string, issues: NormalizationIssue[], sku: string): string {
  const original = active;
  const out = applyNormalizeMap(active).replace(/\s{2,}/g, ' ').trim();
  if (out !== original) {
    issues.push({ sku, field: 'primaryActive', original, normalized: out, type: 'capitalization' });
  }
  return out;
}

/** Normaliza dose */
export function normalizeDose(dose: string, issues: NormalizationIssue[], sku: string): string {
  if (!dose || dose === '—') return dose;
  const original = dose;
  const out = normalizeUnits(applyNormalizeMap(dose)).replace(/\s{2,}/g, ' ').trim();
  if (out !== original) {
    issues.push({ sku, field: 'dose', original, normalized: out, type: 'unit' });
  }
  return out;
}

/** Normaliza pack */
export function normalizePack(pack: string, issues: NormalizationIssue[], sku: string): string {
  const original = pack;
  let out = applyNormalizeMap(pack);
  out = out.replace(/\b300g\b/gi, '300 g').replace(/\b100\s{2,}g\b/gi, '100 g');
  out = out.replace(/\s{2,}/g, ' ').trim();
  if (out !== original) {
    issues.push({ sku, field: 'pack', original, normalized: out, type: 'unit' });
  }
  return out;
}

/** Detecta conflitos de catálogo (nome vs dose vs pack inconsistentes) */
export function detectCatalogConflict(
  name: string,
  dose: string,
  pack: string,
  formKey: string,
  sku: string
): boolean {
  if (/50\s*g\s+50\s*g|50G\s+50\s*g/i.test(name)) return true;
  if (formKey === 'caps' && /\d+\s*g\b/i.test(pack) && !/cápsulas|sachês/.test(pack)) return true;
  if (formKey === 'powder' && pack.includes('cápsulas')) return true;
  return false;
}
