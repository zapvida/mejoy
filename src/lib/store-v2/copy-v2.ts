/**
 * Leitura do copy-blueprint-v2.csv para piloto editorial.
 * Usado apenas quando NEXT_PUBLIC_COPY_V2_PILOT=1 e produto está no cluster piloto.
 */

import * as fs from 'fs';
import * as path from 'path';

const BLUEPRINT_PATH = path.join(process.cwd(), 'data', 'store-v2', 'copy', 'copy-blueprint-v2.csv');
const V4_BLUEPRINT_PATH = path.join(process.cwd(), 'data', 'store-v2', 'copy', 'copy-blueprint-v4.csv');

/** PDP Master Template — SKU usado como referência de copy premium para replicar nos demais. */
export const PDP_MASTER_SKU = 'MEJOY-0010'; // L-Teanina 200 mg

/** SKUs do cluster piloto Sono (MEJOY-0152 a MEJOY-0162). */
export const SONO_PILOT_SKUS = [
  'MEJOY-0152', 'MEJOY-0153', 'MEJOY-0154', 'MEJOY-0155', 'MEJOY-0156',
  'MEJOY-0157', 'MEJOY-0158', 'MEJOY-0159', 'MEJOY-0160', 'MEJOY-0161', 'MEJOY-0162',
];

export interface CopyV2Row {
  sku: string;
  hero_benefit: string;
  shortBenefit: string;
  description_md: string;
  faq: string;
  cautions: string;
  seoTitle: string;
  seoDescription: string;
  seo_h1: string;
}

/** Campos extras do v4 (ciência, diferenciação, curiosidades). */
export interface CopyV4Extras {
  dose?: string;
  science_summary?: string;
  evidence_level?: string;
  mechanism_summary?: string;
  what_makes_this_formula_different?: string;
  best_fit_profile?: string;
  /** Grid "Para que serve" — Título1 | Desc1 | Título2 | Desc2 | ... */
  para_que_serve?: string;
  /** Citações científicas — Ref1 | Ref2 | ... */
  references?: string;
  /** Bullets "Como usar" — - item1 | - item2 */
  how_to_use_bullets?: string;
  /** Bloco completo de advertências (como OficialFarma) */
  advertencias_completo?: string;
  /** URL do vídeo YouTube */
  video_url?: string;
  /** Para busca inteligente: sintomas, problemas (ex: "Estresse, foco ou equilíbrio emocional") */
  problem_statement?: string;
  /** Entidades semânticas (ex: "5 HTP;Ansiedade & Humor;Ansiedade e Estresse") */
  semantic_entities?: string;
  /** Palavras-chave primárias para busca */
  keywords_primary?: string;
  /** Palavras-chave secundárias para busca */
  keywords_secondary?: string;
}

let _cache: Map<string, CopyV2Row> | null = null;

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

function loadCopyV2(): Map<string, CopyV2Row> {
  if (_cache) return _cache;
  if (!fs.existsSync(BLUEPRINT_PATH)) {
    _cache = new Map();
    return _cache;
  }
  const content = fs.readFileSync(BLUEPRINT_PATH, 'utf-8');
  const lines = content.split(/\r?\n/).filter((l) => l.length > 0);
  if (lines.length < 2) {
    _cache = new Map();
    return _cache;
  }
  const headers = parseCSVLine(lines[0]);
  const map = new Map<string, CopyV2Row>();
  for (let i = 1; i < lines.length; i++) {
    const values = parseCSVLine(lines[i]);
    const row: Record<string, string> = {};
    headers.forEach((h, j) => {
      row[h] = values[j] ?? '';
    });
    const sku = (row.sku ?? '').trim();
    if (!sku) continue;
    map.set(sku, {
      sku,
      hero_benefit: row.hero_benefit ?? '',
      shortBenefit: row.shortBenefit ?? '',
      description_md: row.description_md ?? '',
      faq: row.faq ?? '',
      cautions: row.cautions ?? '',
      seoTitle: row.seoTitle ?? '',
      seoDescription: row.seoDescription ?? '',
      seo_h1: row.seo_h1 ?? '',
    });
  }
  _cache = map;
  return map;
}

let _cacheV4: Map<string, CopyV2Row & CopyV4Extras> | null = null;

function normalizeDoseField(value: string | undefined): string | undefined {
  const v = value?.trim();
  if (!v) return undefined;
  if (/^[—-]+$/u.test(v)) return undefined;
  return v;
}

function loadCopyV4(): Map<string, CopyV2Row & CopyV4Extras> {
  if (_cacheV4) return _cacheV4;
  if (!fs.existsSync(V4_BLUEPRINT_PATH)) {
    _cacheV4 = new Map();
    return _cacheV4;
  }
  const content = fs.readFileSync(V4_BLUEPRINT_PATH, 'utf-8');
  const lines = content.split(/\r?\n/).filter((l) => l.length > 0);
  if (lines.length < 2) {
    _cacheV4 = new Map();
    return _cacheV4;
  }
  const headers = parseCSVLine(lines[0]);
  const map = new Map<string, CopyV2Row & CopyV4Extras>();
  for (let i = 1; i < lines.length; i++) {
    const values = parseCSVLine(lines[i]);
    const row: Record<string, string> = {};
    headers.forEach((h, j) => {
      row[h] = values[j] ?? '';
    });
    const sku = (row.sku ?? '').trim();
    if (!sku) continue;
    map.set(sku, {
      sku,
      hero_benefit: row.hero_benefit ?? '',
      shortBenefit: row.shortBenefit ?? '',
      description_md: row.description_md ?? '',
      faq: row.faq ?? '',
      cautions: row.cautions ?? '',
      seoTitle: row.seoTitle ?? '',
      seoDescription: row.seoDescription ?? '',
      seo_h1: row.seo_h1 ?? '',
      science_summary: row.science_summary?.trim() || undefined,
      evidence_level: row.evidence_level?.trim() || undefined,
      mechanism_summary: row.mechanism_summary?.trim() || undefined,
      what_makes_this_formula_different: row.what_makes_this_formula_different?.trim() || undefined,
      best_fit_profile: row.best_fit_profile?.trim() || undefined,
      para_que_serve: row.para_que_serve?.trim() || undefined,
      references: row.references?.trim() || undefined,
      how_to_use_bullets: row.how_to_use_bullets?.trim() || undefined,
      advertencias_completo: row.advertencias_completo?.trim() || undefined,
      video_url: row.video_url?.trim() || undefined,
      problem_statement: row.problem_statement?.trim() || undefined,
      semantic_entities: row.semantic_entities?.trim() || undefined,
      keywords_primary: row.keywords_primary?.trim() || undefined,
      keywords_secondary: row.keywords_secondary?.trim() || undefined,
      dose: normalizeDoseField(row.dose),
    });
  }
  _cacheV4 = map;
  return map;
}

/** Retorna dados editoriais do v2 por SKU, ou null se não existir. */
export function getCopyV2BySku(sku: string): CopyV2Row | null {
  return loadCopyV2().get(sku?.trim() ?? '') ?? null;
}

/** Retorna dados editoriais do v4 por SKU (com extras de ciência/diferenciação), ou null se não existir. */
export function getCopyV4BySku(sku: string): (CopyV2Row & CopyV4Extras) | null {
  return loadCopyV4().get(sku?.trim() ?? '') ?? null;
}

/** Retorna mechanism_summary refinado para PDP Master (quando aplicável). */
export function getMechanismSummaryForPdp(
  sku: string | null,
  copy: (CopyV2Row & Partial<CopyV4Extras>) | null
): string | null {
  const closeSentence = (value: string): string => {
    const text = String(value ?? '').replace(/\s+/g, ' ').replace(/[.…]+$/g, '').trim();
    if (!text) return '';
    return /[.!?]$/.test(text) ? text : `${text}.`;
  };
  if (sku && PDP_MASTER_OVERRIDES[sku]) return PDP_MASTER_OVERRIDES[sku].mechanismSummary;
  if (sku && MECHANISM_OVERRIDES[sku]) return MECHANISM_OVERRIDES[sku];
  const ext = copy as Partial<CopyV4Extras> | null | undefined;
  if (ext?.mechanism_summary) return closeSentence(ext.mechanism_summary);
  if (ext?.science_summary) {
    const full = String(ext.science_summary);
    if (full.length <= 180) return closeSentence(full);
    const s = full.slice(0, 177).trimEnd();
    return closeSentence(s);
  }
  const base = copy as CopyV2Row | null | undefined;
  if (base?.hero_benefit && base.hero_benefit.trim().length > 30) {
    const first = base.hero_benefit.split(/[.;]/)[0]?.trim();
    if (first && first.length >= 30 && first.length <= 180) return closeSentence(first);
    const s = base.hero_benefit.slice(0, 177);
    return closeSentence(base.hero_benefit.length > 180 ? s : base.hero_benefit);
  }
  if (base?.shortBenefit && base.shortBenefit.trim().length > 30) {
    const s = base.shortBenefit.slice(0, 177).trimEnd();
    return closeSentence(base.shortBenefit.length > 180 ? s : base.shortBenefit);
  }
  return null;
}

/** Verifica se o SKU está no cluster piloto Sono. */
export function isSonoPilotSku(sku: string): boolean {
  return SONO_PILOT_SKUS.includes(sku?.trim() ?? '');
}

/**
 * Remove o bloco "## Diferenciais da fórmula" do markdown para evitar duplicação
 * na PDP (a seção Diferenciais é exibida separadamente via benefitsStructured).
 */
export function stripDiferenciaisFromDescription(md: string): string {
  if (!md || typeof md !== 'string') return '';
  const re = /\n*##\s*Diferenciais\s+da\s+f[oó]rmula[\s\S]*?(?=\n##\s|$)/gim;
  return md.replace(re, '').replace(/\n{3,}/g, '\n\n').trim();
}

/**
 * Converte description_md do v2 (formato " | " e " || " separadores) para texto
 * compatível com DescriptionRenderer (## headings, - list, parágrafos).
 * - Trata || como quebra de seção
 * - Mantém itens de lista (- item) consecutivos (sem \n\n entre eles)
 */
export function formatDescriptionForRenderer(md: string): string {
  if (!md || typeof md !== 'string') return '';
  const chunks = md
    .split(/\s*\|\s*/)
    .map((s) => s.trim())
    .filter(Boolean);

  let result = '';
  let prevWasListItem = false;
  for (const chunk of chunks) {
    const isListItem = /^[-*]\s+/.test(chunk);
    if (result.length > 0) {
      if (isListItem && prevWasListItem) {
        result += '\n' + chunk;
      } else {
        result += '\n\n' + chunk;
      }
    } else {
      result = chunk;
    }
    prevWasListItem = isListItem;
  }
  return result;
}

const OBJECTIVE_EMOJIS: Record<string, string[]> = {
  'Ansiedade & Humor': ['🧠', '💭', '😌', '✨', '🌿'],
  'Emagrecimento & Metabolismo': ['⚡', '🔥', '💪', '📉', '🎯'],
  Sono: ['🛏️', '🌙', '😴', '✨', '💤'],
  Saúde: ['❤️', '🛡️', '💚', '✨', '🌿'],
  Cabelo: ['💇', '✨', '🌿', '💪', '❤️'],
  Intestino: ['🌿', '💚', '✨', '🛡️', '💪'],
  Imunidade: ['🛡️', '💪', '❤️', '✨', '🌿'],
  Articulações: ['🦴', '💪', '✨', '🏃', '❤️'],
  'Detox & Fígado': ['🌿', '✨', '💚', '🛡️', '💪'],
  'Energia & Performance': ['⚡', '💪', '🔥', '🏃', '✨'],
  'Hormonal & Libido': ['❤️', '💪', '✨', '🌿', '🔥'],
  'Pele & Beleza': ['✨', '💆', '🌿', '❤️', '💪'],
  'Menopausa & TPM': ['❤️', '✨', '🌿', '💪', '😌'],
  Lipedema: ['💪', '✨', '🌿', '❤️', '📉'],
};

/** SKU piloto do Template Mestre — Akkermat 150 mg. */
export const PDP_TEMPLATE_MASTER_SKU = 'MEJOY-0048';

/** Copy premium do PDP Master — template para replicar. L-Teanina e Akkermat. Exportado para freeze/validate. */
export const PDP_MASTER_OVERRIDES: Record<string, { heroBullets: string[]; mechanismSummary: string }> = {
  [PDP_MASTER_SKU]: {
    heroBullets: [
      '✨ Relaxamento eficaz sem sonolência',
      '🧠 Aminoácido do chá verde para calma e foco',
      '💚 Suporte ao equilíbrio emocional',
      '😌 Apoio em momentos de estresse',
      '🌿 Fórmula manipulada com pureza garantida',
    ],
    mechanismSummary:
      'A L-Teanina é um aminoácido do chá verde que promove relaxamento sem sonolência, apoiando o foco e o equilíbrio emocional.',
  },
  [PDP_TEMPLATE_MASTER_SKU]: {
    heroBullets: [
      '🔥 Reduz o apetite e aumenta a saciedade naturalmente',
      '⚡ Apoia o metabolismo e a queima de calorias',
      '✨ Sensação de saciedade prolongada entre as refeições',
      '💪 Apoio à redução de medidas de forma saudável',
      '🌿 Dose eficaz de 150 mg por cápsula para resultados visíveis',
    ],
    mechanismSummary:
      'Coma menos, queime mais. A fórmula que ajuda a controlar o apetite e a acelerar o metabolismo — resultados visíveis quando associada à dieta equilibrada.',
  },
};

/** Overrides completos para Template Mestre (FAQ, advertências, etc.). */
export const PDP_MASTER_FULL_OVERRIDES: Record<
  string,
  {
    faq?: { q: string; a: string }[];
    advertenciasCompleto?: string;
    whatIsIt?: string;
    bestFitProfile?: string;
    whatMakesDifferent?: string;
    scienceSummary?: string;
    paraQueServe?: { title: string; desc: string }[];
    activeIngredients?: string;
  }
> = {
  [PDP_TEMPLATE_MASTER_SKU]: {
    activeIngredients: 'Akkermat 150 mg\nExcipiente q.s.p. 1 cápsula',
    paraQueServe: [
      { title: 'Redução do apetite', desc: 'Promove sensação de saciedade por meio da liberação de GLP-1 e modulação de hormônios como grelina e leptina — menos fome, mais controle no dia a dia.' },
      { title: 'Apoio à compulsão alimentar', desc: 'Pode auxiliar no controle da alimentação emocional e descontrolada, contribuindo para um melhor gerenciamento do peso e mais autonomia.' },
      { title: 'Gerenciamento de peso', desc: 'Combina saciedade, metabolismo acelerado e redução do apetite para facilitar a perda de peso de forma saudável e sustentável.' },
      { title: 'Ação termogênica', desc: 'Aumenta a taxa metabólica e a temperatura corporal, ajudando a queimar calorias adicionais ao longo do dia — mais energia, menos acúmulo.' },
      { title: 'Suporte à saúde intestinal', desc: 'Promove alterações positivas na microbiota, incluindo o aumento de bactérias benéficas que regulam o metabolismo e o bem-estar.' },
      { title: 'Fórmula microencapsulada', desc: 'Tecnologia patenteada que melhora a absorção e reduz efeitos gastrointestinais — resultados com mais conforto e eficácia.' },
    ],
    scienceSummary:
      'O Akkermat atua reduzindo a fome pelo estímulo da saciedade (liberação de GLP-1) e pela modulação hormonal: reduz grelina (hormônio da fome) e aumenta leptina (hormônio da saciedade). Também auxilia no emagrecimento pelo efeito termogênico — aumenta gasto energético e reduz acúmulo de gordura. Além disso, promove alterações positivas na microbiota intestinal e possui ação anti-inflamatória.',
    faq: [
      { q: 'O que é Akkermat 150 mg?', a: 'Akkermat 150 mg é uma fórmula manipulada com capsaicinoides microencapsulados que podem auxiliar no apoio ao metabolismo e no controle do apetite, quando associada a dieta equilibrada e hábitos saudáveis.' },
      { q: 'Como devo usar Akkermat 150 mg?', a: 'Tomar 1 cápsula ao dia, após uma refeição. Apresentação: 30 cápsulas. Siga sempre a orientação do seu médico ou nutricionista.' },
      { q: 'Akkermat 150 mg tem contraindicações?', a: 'Gestantes, lactantes e crianças devem consultar médico antes do uso. Consulte um profissional de saúde antes de iniciar qualquer suplementação.' },
      { q: 'Posso tomar Akkermat com outros suplementos?', a: 'Para segurança e eficácia, consulte um profissional de saúde para orientações personalizadas sobre combinação com outros produtos.' },
      { q: 'Akkermat substitui alimentação equilibrada?', a: 'Não. Este produto é um complemento e não deve substituir uma alimentação equilibrada e hábitos saudáveis.' },
    ],
    advertenciasCompleto: 'Imagens meramente ilustrativas. Manter em local seco, longe da luz e do calor. Manter fora do alcance das crianças. Em caso de persistência dos sintomas, consulte um médico. Os resultados variam de pessoa para pessoa. Não nos responsabilizamos pelo uso incorreto do produto.\n\nGestantes, lactantes e crianças devem consultar médico antes do uso. Consulte um profissional de saúde antes do uso. Este produto não substitui uma alimentação equilibrada e hábitos saudáveis.',
    whatIsIt: 'Akkermat 150 mg é um fitocomplexo de capsaicinoides microencapsulados que pertence à nova geração de estimulantes de GLP-1. Usado para promover saciedade, apoiar o gerenciamento de peso e melhorar o perfil metabólico. Seu aliado no controle da fome, no aumento da saciedade e na ação termogênica — resultados visíveis quando associado a dieta equilibrada.',
    bestFitProfile: 'Ideal para quem busca apoio ao metabolismo e ao controle do apetite, com foco em hábitos saudáveis e orientação profissional.',
    whatMakesDifferent: 'Diferente de outros suplementos, Akkermat 150 mg combina tecnologia microencapsulada patenteada (melhor absorção e menos efeitos gastrointestinais) com ação em múltiplos mecanismos: saciedade, termogênese e saúde intestinal. Uma fórmula que se adapta às suas necessidades e potencializa resultados quando associada a hábitos saudáveis.',
  },
};

/** mechanism_summary real para SKUs sem mechanism/science no blueprint (elevar de funcional para premium). */
const MECHANISM_OVERRIDES: Record<string, string> = {
  'MEJOY-0036': 'Solução tópica com minoxidil, D-pantenol e auxina para apoio à saúde dos fios e do couro cabeludo.',
  'MEJOY-0037': 'Minoxidil 5% com biotina em solução tópica para apoio à saúde dos fios.',
  'MEJOY-0038': 'Minoxidil 5% em solução tópica para apoio à saúde capilar.',
  'MEJOY-0039': 'Minoxidil 10% em solução tópica para apoio à saúde dos fios.',
  'MEJOY-0040': 'Minoxidil 5% com finasterida em solução tópica para apoio capilar.',
  'MEJOY-0057': 'Ioimbina é um alcaloide que pode auxiliar no suporte ao metabolismo com orientação médica.',
  'MEJOY-0058': 'Ioimbina em cápsulas para suporte nutricional com orientação profissional.',
  'MEJOY-0059': 'Ioimbina para suporte ao metabolismo conforme indicação médica.',
  'MEJOY-0060': 'Ioimbina em formulação manipulada para suporte nutricional.',
  'MEJOY-0066': 'Orlistat atua reduzindo a absorção de gordura no intestino, auxiliando no suporte ao metabolismo.',
  'MEJOY-0126': 'Tadalafila é um ativo que pode auxiliar no suporte à circulação e disposição com orientação médica.',
  'MEJOY-0127': 'Tadalafila em cápsulas para suporte conforme indicação profissional.',
  'MEJOY-0128': 'Tadalafila em formulação manipulada para suporte com orientação médica.',
  'MEJOY-0132': 'Centella asiática é uma planta com propriedades que podem auxiliar na saúde da pele e circulação.',
  'MEJOY-0140': 'Dimpless combina ativos que podem auxiliar na circulação e no suporte para quem convive com lipedema.',
  'MEJOY-0141': 'Amora negra contém compostos que podem auxiliar no equilíbrio hormonal e no suporte à menopausa.',
  'MEJOY-0145': 'Composto com fitormônios para suporte aos sintomas da menopausa e equilíbrio hormonal.',
  'MEJOY-0149': 'Progesterona bioidêntica para suporte hormonal conforme orientação médica.',
  'MEJOY-0150': 'Vitex agnus castus é uma planta que pode auxiliar no equilíbrio hormonal e suporte à TPM.',
};

/** how_to_use_bullets override para Template Mestre (Akkermat). */
const HOW_TO_USE_OVERRIDES: Record<string, string[]> = {
  [PDP_TEMPLATE_MASTER_SKU]: ['Tomar 1 cápsula ao dia, após uma refeição.', 'Apresentação: 30 cápsulas.', 'Siga a orientação do seu médico ou nutricionista.'],
};

/** Normaliza bullet para deduplicação (remove emoji, lowercase, trunc). */
function normalizeBulletForDedup(s: string): string {
  return s
    .replace(/[\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu, '')
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 60);
}

/** Deriva hero_bullets (5–7 itens com emojis) a partir de hero_benefit, shortBenefit e objective.
 * Deduplica bullets similares para evitar repetição. */
export function getHeroBullets(
  heroBenefit: string | null | undefined,
  shortBenefit: string | null | undefined,
  objective: string,
  sku?: string | null
): string[] {
  if (sku && PDP_MASTER_OVERRIDES[sku]) return PDP_MASTER_OVERRIDES[sku].heroBullets;
  const bullets: string[] = [];
  const seen = new Set<string>();
  const emojis = OBJECTIVE_EMOJIS[objective] ?? ['✨', '💚', '🌿', '💪', '❤️'];
  const closeSentence = (value: string): string => {
    const text = String(value ?? '')
      .replace(/\s+/g, ' ')
      .replace(/[.…]+$/g, '')
      .trim();
    if (!text) return '';
    return /[.!?]$/.test(text) ? text : `${text}.`;
  };

  const addIfNew = (text: string, emoji: string) => {
    const normalized = normalizeBulletForDedup(text);
    if (normalized && !seen.has(normalized)) {
      seen.add(normalized);
      const sentence = closeSentence(text);
      if (sentence) bullets.push(`${emoji} ${sentence}`);
    }
  };

  const src = (heroBenefit || shortBenefit || '').trim();
  if (src) {
    const splitter = src.includes('|') ? /\s*\|\s*/ : /[.;]\s*/;
    const parts = src
      .split(splitter)
      .map((s) => s.trim())
      .filter((s) => s.length > 12 && s.length < 170);
    for (let i = 0; i < Math.min(parts.length, 5); i++) {
      addIfNew(parts[i], emojis[i % emojis.length]);
    }
  }
  if (bullets.length < 2 && (heroBenefit || shortBenefit)) {
    const fallback = (heroBenefit || shortBenefit || '').trim();
    if (fallback.length > 20) addIfNew(fallback, emojis[0]);
  }
  const generic: Record<string, string[]> = {
    'Ansiedade & Humor': [
      'Suporte ao equilíbrio emocional diário.',
      'Apoio em momentos de estresse da rotina.',
      'Auxílio para manter humor mais estável.',
      'Uso prático com rotina diária orientada.',
      'Fórmula manipulada com controle de qualidade.',
    ],
    'Emagrecimento & Metabolismo': [
      'Apoio ao controle do apetite no dia a dia.',
      'Suporte ao metabolismo e ao gasto energético.',
      'Mais consistência no gerenciamento de peso.',
      'Dose padronizada com uso orientado.',
      'Complemento para hábitos saudáveis e sustentáveis.',
    ],
    Sono: [
      'Suporte para um sono mais reparador.',
      'Apoio ao relaxamento no período noturno.',
      'Auxílio para rotina de descanso consistente.',
      'Fórmula manipulada com padrão de qualidade.',
      'Uso simples e consistente na rotina diária.',
    ],
    Cabelo: [
      'Apoio à saúde dos fios e couro cabeludo.',
      'Suporte ao fortalecimento e qualidade capilar.',
      'Uso contínuo para cuidado dos fios.',
      'Fórmula direcionada ao objetivo capilar.',
      'Complemento para manutenção de resultados.',
    ],
    Intestino: [
      'Apoio ao equilíbrio intestinal diário.',
      'Suporte ao conforto digestivo na rotina.',
      'Auxílio ao bem-estar abdominal contínuo.',
      'Fórmula direcionada para saúde intestinal.',
      'Complemento para hábitos alimentares equilibrados.',
    ],
    Imunidade: [
      'Apoio às defesas naturais do organismo.',
      'Suporte antioxidante para rotina de prevenção.',
      'Auxílio ao bem-estar geral com uso regular.',
      'Fórmula manipulada com dose controlada.',
      'Complemento para sono, alimentação e atividade física.',
    ],
    Articulações: [
      'Apoio à mobilidade no dia a dia.',
      'Suporte ao conforto articular contínuo.',
      'Auxílio para manter rotina ativa com consistência.',
      'Fórmula direcionada para cuidado articular.',
      'Complemento para estratégia global de movimento.',
    ],
    'Detox & Fígado': [
      'Apoio ao suporte funcional do fígado.',
      'Suporte antioxidante para rotina metabólica.',
      'Auxílio ao equilíbrio digestivo e leveza.',
      'Fórmula direcionada para cuidado hepático.',
      'Complemento para hábitos saudáveis no dia a dia.',
    ],
    'Hormonal & Libido': [
      'Apoio ao equilíbrio hormonal da rotina.',
      'Suporte ao bem-estar íntimo e vitalidade.',
      'Auxílio para disposição e qualidade de vida.',
      'Fórmula direcionada ao objetivo hormonal.',
      'Complemento com uso orientado e individualizado.',
    ],
    'Menopausa & TPM': [
      'Apoio ao conforto em fases hormonais desafiadoras.',
      'Suporte ao equilíbrio emocional e físico.',
      'Auxílio à rotina com mais estabilidade e bem-estar.',
      'Fórmula direcionada para sintomas do ciclo feminino.',
      'Complemento para qualidade de vida feminina.',
    ],
    Lipedema: [
      'Apoio ao manejo diário do lipedema.',
      'Suporte ao conforto circulatório na rotina.',
      'Auxílio para bem-estar em pernas e tecidos periféricos.',
      'Fórmula direcionada para estratégia complementar.',
      'Complemento para cuidado multidisciplinar contínuo.',
    ],
    Saúde: [
      'Apoio ao objetivo principal de saúde do produto.',
      'Suporte diário com uso simples e orientado.',
      'Auxílio ao bem-estar geral com rotina consistente.',
      'Fórmula manipulada com dose padronizada.',
      'Complemento para hábitos saudáveis no longo prazo.',
    ],
  };
  const extras = generic[objective] ?? [
    'Fórmula manipulada com qualidade',
    'Apoio ao objetivo de saúde do produto',
    'Uso prático para rotina diária',
    'Complemento para hábitos saudáveis',
    'Entrega para todo o Brasil',
  ];
  for (const g of extras) {
    if (bullets.length >= 7) break;
    if (!seen.has(normalizeBulletForDedup(g))) {
      addIfNew(g, emojis[bullets.length % emojis.length]);
    }
  }
  // Garantia final: remove duplicatas por texto normalizado (sem emoji)
  const final: string[] = [];
  const seenFinal = new Set<string>();
  for (const b of bullets) {
    const key = normalizeBulletForDedup(b);
    if (key && !seenFinal.has(key)) {
      seenFinal.add(key);
      final.push(b);
    }
  }
  const safetyExtras = [
    'Fórmula manipulada com controle de qualidade',
    'Uso conforme orientação profissional',
    'Complemento a hábitos saudáveis',
    'Disponível em apresentação prática',
    'Suporte ao objetivo de saúde do produto',
  ];
  for (const extra of safetyExtras) {
    if (final.length >= 5) break;
    const text = `${emojis[final.length % emojis.length]} ${extra}`;
    const key = normalizeBulletForDedup(text);
    if (!seenFinal.has(key)) {
      seenFinal.add(key);
      final.push(text);
    }
  }
  return final.slice(0, 7);
}

/** Remove caracteres de markdown/separador que não devem aparecer na tela. */
function sanitizeBenefitText(s: string): string {
  return (s ?? '')
    .replace(/\|\|?/g, '')
    .replace(/\s*##\s*/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 150);
}

/** Extrai apenas o bloco "## Diferenciais da fórmula" do description_md. */
function extractDiferenciaisBlock(src: string): string {
  const lower = src.toLowerCase();
  const idx = lower.indexOf('## diferencias');
  if (idx === -1) return src;
  const after = src.slice(idx);
  const endMatch = after.match(/\|\s*\|\s*##\s+(Como usar|Cuidados)/i);
  const endIdx = endMatch ? endMatch.index ?? after.length : after.length;
  return after.slice(0, endIdx);
}

/** Parse de description_md para benefits_structured (title + desc).
 * Extrai apenas o bloco Diferenciais para evitar capturar conteúdo de outras seções.
 * Garante title e desc sempre strings (nunca undefined) para serialização Next.js. */
export function getBenefitsStructured(
  descriptionMd: string | null | undefined,
  heroBenefit: string | null | undefined,
  shortBenefit: string | null | undefined
): { title: string; desc: string }[] {
  const result: { title: string; desc: string }[] = [];
  const block = extractDiferenciaisBlock(descriptionMd || '');

  const boldColon = /\*\*([^*]+)\*\*:\s*([^|]+)/g;
  let m;
  while ((m = boldColon.exec(block)) !== null) {
    const t = sanitizeBenefitText(m[1] ?? '');
    const d = sanitizeBenefitText(m[2] ?? '');
    if (t) result.push({ title: t, desc: d || t });
  }

  const dashColon = /[-•]\s+(.+?):\s+(.+?)(?=\s*[-•]|\s*\|+\s*##|\s*$)/gs;
  while ((m = dashColon.exec(block)) !== null) {
    const t = sanitizeBenefitText(m[1] ?? '');
    const d = sanitizeBenefitText(m[2] ?? '');
    if (t.length > 3 && (d || t).length > 8) result.push({ title: t, desc: d || t });
  }

  const dashOnly = /[-•]\s+([^|]+?)(?=\s*[-•]|\s*\|+\s*##|\s*$)/gs;
  if (result.length < 3) {
    while ((m = dashOnly.exec(block)) !== null) {
      const t = sanitizeBenefitText(m[1] ?? '');
      if (t.length > 5 && t.length < 100 && !/^\d+\s*(mg|mcg|g|ml)/i.test(t)) {
        result.push({ title: t, desc: t });
      }
    }
  }

  if (result.length === 0 && (heroBenefit || shortBenefit)) {
    const text = sanitizeBenefitText((heroBenefit || shortBenefit || '').trim());
    if (text.length > 20) result.push({ title: 'Benefício principal', desc: text });
  }
  return result.slice(0, 6).map((r) => ({
    title: sanitizeBenefitText(r.title) || r.title,
    desc: sanitizeBenefitText(r.desc) || r.desc,
  }));
}

/** Parse para_que_serve (Título1 | Desc1 | Título2 | Desc2) em array { title, desc }. */
export function parseParaQueServe(text: string | null | undefined): { title: string; desc: string }[] {
  if (!text || typeof text !== 'string') return [];
  const parts = text.split(/\s*\|\s*/).map((s) => (s ?? '').trim()).filter(Boolean);
  const result: { title: string; desc: string }[] = [];
  for (let i = 0; i < parts.length - 1; i += 2) {
    const title = parts[i] ?? '';
    const desc = parts[i + 1] ?? '';
    if (title) result.push({ title, desc: desc || title });
  }
  if (parts.length % 2 === 1 && parts[parts.length - 1]) {
    result.push({ title: parts[parts.length - 1]!, desc: parts[parts.length - 1]! });
  }
  return result.slice(0, 6);
}

/** Extrai seções do description_md (formato | separado) para fallback de para_que_serve. */
function extractSectionFromDescriptionMd(md: string, headingPattern: RegExp): string | null {
  if (!md || typeof md !== 'string') return null;
  const chunks = md.split(/\s*\|\s*/).map((s) => (s ?? '').trim()).filter(Boolean);
  for (let i = 0; i < chunks.length; i++) {
    if (headingPattern.test(chunks[i] ?? '')) {
      for (let j = i + 1; j < chunks.length; j++) {
        const next = chunks[j] ?? '';
        if (next.length > 15 && !/^##\s/.test(next)) return next;
      }
      break;
    }
  }
  return null;
}

/** Fallback para para_que_serve quando o blueprint não tem o campo preenchido. */
export function getParaQueServeFallback(
  descriptionMd: string | null | undefined,
  heroBenefit: string | null | undefined,
  shortBenefit: string | null | undefined
): { title: string; desc: string }[] {
  const result: { title: string; desc: string }[] = [];
  const paraQuem = extractSectionFromDescriptionMd(
    descriptionMd ?? '',
    /^##\s*(Para quem pode fazer sentido|Para quem é indicado|Para quem é ideal)/i
  );
  if (paraQuem && paraQuem.length > 20) {
    result.push({ title: 'Para quem é ideal', desc: paraQuem });
  }
  const oQueE = extractSectionFromDescriptionMd(descriptionMd ?? '', /^##\s*O que é/i);
  if (oQueE && oQueE.length > 25 && oQueE.length < 200) {
    result.push({ title: 'O que é', desc: oQueE });
  }
  const hero = (heroBenefit || shortBenefit || '').trim();
  if (hero && hero.length > 20 && !result.some((r) => r.desc.includes(hero.slice(0, 30)))) {
    result.push({ title: 'Benefício principal', desc: hero });
  }
  return result.slice(0, 4).map((r) => ({
    title: r.title.replace(/\|\|?/g, '').trim().slice(0, 80),
    desc: r.desc.replace(/\|\|?/g, '').trim().slice(0, 200),
  }));
}

/** Parse references (Ref1 | Ref2) em array de strings. */
export function parseReferences(text: string | null | undefined): string[] {
  if (!text || typeof text !== 'string') return [];
  return text.split(/\s*\|\s*/).map((s) => (s ?? '').trim()).filter(Boolean).slice(0, 10);
}

/** Retorna how_to_use bullets para PDP, com override para Template Mestre. */
export function getHowToUseBulletsForPdp(sku: string | null, copyV4: { how_to_use_bullets?: string } | null): string[] {
  if (sku && HOW_TO_USE_OVERRIDES[sku]) return HOW_TO_USE_OVERRIDES[sku];
  return copyV4?.how_to_use_bullets ? parseHowToUseBullets(copyV4.how_to_use_bullets) : [];
}

/** Parse how_to_use_bullets (- item1 | - item2) em array de strings. */
export function parseHowToUseBullets(text: string | null | undefined): string[] {
  if (!text || typeof text !== 'string') return [];
  return text
    .split(/\s*\|\s*/)
    .map((s) => (s ?? '').trim())
    .filter((s) => s.length > 2)
    .map((s) => (s.startsWith('- ') || s.startsWith('* ') ? s.slice(2).trim() : s))
    .filter(Boolean)
    .slice(0, 6);
}

/**
 * Converte FAQ do v2 (formato "Q1? | A1 | Q2? | A2") para array { q, a }.
 * Garante q e a sempre strings (nunca undefined) para serialização Next.js.
 */
export function parseFaqFromV2(faq: string): { q: string; a: string }[] {
  if (!faq || typeof faq !== 'string') return [];
  const parts = faq.split(/\s*\|\s*/).map((s) => (s ?? '').trim());
  const result: { q: string; a: string }[] = [];
  for (let i = 0; i < parts.length - 1; i += 2) {
    result.push({ q: parts[i] ?? '', a: parts[i + 1] ?? '' });
  }
  return result;
}

/** Retorna FAQ para PDP, com override para Template Mestre. */
export function getFaqForPdp(sku: string | null, copyV2Faq: { q: string; a: string }[] | null): { q: string; a: string }[] {
  if (sku && PDP_MASTER_FULL_OVERRIDES[sku]?.faq) return PDP_MASTER_FULL_OVERRIDES[sku].faq!;
  return copyV2Faq ?? [];
}

/** Fallback compareAtCents para Template Mestre (ancoragem de preço). R$ 110,70 quando não há no DB. */
export const PDP_MASTER_COMPARE_AT_FALLBACK_CENTS = 11070;
