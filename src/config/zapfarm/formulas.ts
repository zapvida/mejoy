/**
 * 33 Fórmulas MonJoy — Fonte única de verdade
 * Edite os valores de custoReais; BOM é calculado automaticamente na UI.
 */

export interface FormulaComponent {
  nome: string;
  dose: string;
  custoReais: number;
}

export interface Formula {
  id: string;
  fluxo: string;
  nivel: 'BÁSICO' | 'COMPLETO' | 'PREMIUM' | string;
  sku: string;
  produto: string;
  forma: string;
  componentes: FormulaComponent[];
  obs?: string;
}

/** Cores por fluxo para badges e destaques */
export const FLUXO_CORES: Record<string, string> = {
  Emagrecimento: 'purple',
  Calvície: 'indigo',
  Sono: 'blue',
  Ansiedade: 'green',
  Intestino: 'emerald',
  Fígado: 'amber',
  'Libido Masc.': 'red',
  Menopausa: 'pink',
  Articulações: 'slate',
  Imunidade: 'cyan',
  'Tirzepatida (Rx)': 'violet',
};

export const FORMULAS: Formula[] = [
  // Emagrecimento
  {
    id: 'EMG-B',
    fluxo: 'Emagrecimento',
    nivel: 'BÁSICO',
    sku: 'EMG-B',
    produto: 'Metabólico Core',
    forma: 'Caps 60 / 30d',
    componentes: [
      { nome: 'Cromo (picolinato)', dose: '200 mcg', custoReais: 5 },
      { nome: 'Magnésio (glicinato)', dose: '200 mg', custoReais: 9 },
      { nome: 'Vitamina D3', dose: '2000 UI', custoReais: 4 },
    ],
  },
  {
    id: 'EMG-C',
    fluxo: 'Emagrecimento',
    nivel: 'COMPLETO',
    sku: 'EMG-C',
    produto: 'Glicemia & Apetite',
    forma: 'Caps 60 / 30d',
    componentes: [
      { nome: 'Berberina', dose: '500 mg', custoReais: 18 },
      { nome: 'Psyllium', dose: '3 g', custoReais: 8 },
      { nome: 'Cromo (picolinato)', dose: '200 mcg', custoReais: 4 },
      { nome: 'Magnésio (glicinato)', dose: '200 mg', custoReais: 4 },
    ],
    obs: 'Cautela: DM em uso de hipoglicemiante',
  },
  {
    id: 'EMG-P',
    fluxo: 'Emagrecimento',
    nivel: 'PREMIUM',
    sku: 'EMG-P',
    produto: 'Metabólico Plus',
    forma: 'Caps 60 / 30d',
    componentes: [
      { nome: 'Berberina', dose: '500 mg', custoReais: 18 },
      { nome: 'Psyllium', dose: '3 g', custoReais: 8 },
      { nome: 'Colina', dose: '250 mg', custoReais: 10 },
      { nome: 'Magnésio (glicinato)', dose: '200 mg', custoReais: 6 },
      { nome: 'Vitamina D3', dose: '2000 UI', custoReais: 10 },
    ],
  },
  // Calvície
  {
    id: 'CAL-B',
    fluxo: 'Calvície',
    nivel: 'BÁSICO',
    sku: 'CAL-B',
    produto: 'Micronutrientes Capilares',
    forma: 'Caps 60 / 30d',
    componentes: [
      { nome: 'Biotina', dose: '2,5 mg', custoReais: 6 },
      { nome: 'Zinco (quelato)', dose: '15 mg', custoReais: 6 },
      { nome: 'Vitamina D3', dose: '2000 UI', custoReais: 4 },
    ],
  },
  {
    id: 'CAL-C',
    fluxo: 'Calvície',
    nivel: 'COMPLETO',
    sku: 'CAL-C',
    produto: 'Matriz Capilar',
    forma: 'Caps 60 / 30d',
    componentes: [
      { nome: 'Biotina', dose: '2,5 mg', custoReais: 6 },
      { nome: 'Zinco (quelato)', dose: '15 mg', custoReais: 6 },
      { nome: 'Silício orgânico', dose: '100 mg', custoReais: 10 },
      { nome: 'Complexo B (B5+B6)', dose: 'B5 50 mg / B6 10 mg', custoReais: 6 },
    ],
  },
  {
    id: 'CAL-P',
    fluxo: 'Calvície',
    nivel: 'PREMIUM',
    sku: 'CAL-P',
    produto: 'DHT-Support',
    forma: 'Caps 60 / 30d',
    componentes: [
      { nome: 'Saw Palmetto', dose: '160 mg', custoReais: 22 },
      { nome: 'Silício orgânico', dose: '100 mg', custoReais: 10 },
      { nome: 'Zinco (quelato)', dose: '15 mg', custoReais: 6 },
      { nome: 'Vitamina E', dose: '100 UI', custoReais: 8 },
    ],
    obs: 'Cautela: anticoagulante',
  },
  // Sono
  {
    id: 'SNO-B',
    fluxo: 'Sono',
    nivel: 'BÁSICO',
    sku: 'SNO-B',
    produto: 'Sono Ritual',
    forma: 'Caps 60 / 30d',
    componentes: [
      { nome: 'Magnésio (glicinato)', dose: '200 mg', custoReais: 12 },
      { nome: 'L-teanina', dose: '200 mg', custoReais: 8 },
    ],
  },
  {
    id: 'SNO-C',
    fluxo: 'Sono',
    nivel: 'COMPLETO',
    sku: 'SNO-C',
    produto: 'Início do Sono',
    forma: 'Caps 60 / 30d',
    componentes: [
      { nome: 'Melatonina', dose: '0,21 mg', custoReais: 4 },
      { nome: 'L-teanina', dose: '200 mg', custoReais: 10 },
      { nome: 'Magnésio (glicinato)', dose: '200 mg', custoReais: 12 },
    ],
    obs: '≥19a; advertências ANVISA (melatonina)',
  },
  {
    id: 'SNO-P',
    fluxo: 'Sono',
    nivel: 'PREMIUM',
    sku: 'SNO-P',
    produto: 'Sono Profundo',
    forma: 'Caps 60 / 30d',
    componentes: [
      { nome: 'Melatonina', dose: '0,21 mg', custoReais: 4 },
      { nome: 'Magnésio (glicinato)', dose: '200 mg', custoReais: 12 },
      { nome: 'Glicina', dose: '3 g', custoReais: 16 },
    ],
    obs: '≥19a; advertências ANVISA (melatonina)',
  },
  // Ansiedade
  {
    id: 'ANS-B',
    fluxo: 'Ansiedade',
    nivel: 'BÁSICO',
    sku: 'ANS-B',
    produto: 'Calm Herbs',
    forma: 'Caps 60 / 30d',
    componentes: [
      { nome: 'Passiflora', dose: '400 mg', custoReais: 10 },
      { nome: 'Valeriana', dose: '300 mg', custoReais: 8 },
    ],
    obs: 'Pode causar sonolência',
  },
  {
    id: 'ANS-C',
    fluxo: 'Ansiedade',
    nivel: 'COMPLETO',
    sku: 'ANS-C',
    produto: 'Calm Adapt',
    forma: 'Caps 60 / 30d',
    componentes: [
      { nome: 'Ashwagandha', dose: '300 mg', custoReais: 14 },
      { nome: 'L-teanina', dose: '200 mg', custoReais: 8 },
      { nome: 'Magnésio (glicinato)', dose: '200 mg', custoReais: 8 },
    ],
    obs: 'Cautela: tireoide/bipolar',
  },
  {
    id: 'ANS-P',
    fluxo: 'Ansiedade',
    nivel: 'PREMIUM',
    sku: 'ANS-P',
    produto: 'Calm Focus',
    forma: 'Caps 60 / 30d',
    componentes: [
      { nome: 'Ashwagandha', dose: '300 mg', custoReais: 14 },
      { nome: 'L-teanina', dose: '200 mg', custoReais: 8 },
      { nome: 'Magnésio (glicinato)', dose: '200 mg', custoReais: 10 },
      { nome: 'Vitamina B6', dose: '10 mg', custoReais: 6 },
    ],
    obs: 'Cautela: tireoide/bipolar',
  },
  // Intestino
  {
    id: 'INT-B',
    fluxo: 'Intestino',
    nivel: 'BÁSICO',
    sku: 'INT-B',
    produto: 'Fiber Start',
    forma: 'Caps 60 / 30d',
    componentes: [{ nome: 'Psyllium', dose: '3 g', custoReais: 14 }],
    obs: 'Beber água',
  },
  {
    id: 'INT-C',
    fluxo: 'Intestino',
    nivel: 'COMPLETO',
    sku: 'INT-C',
    produto: 'Microbiota',
    forma: 'Caps 60 / 30d',
    componentes: [
      { nome: 'Probiótico (mix cepas)', dose: '10 bi CFU', custoReais: 26 },
      { nome: 'Inulina (prebiótico)', dose: '2 g', custoReais: 8 },
      { nome: 'Zinco (quelato)', dose: '10 mg', custoReais: 6 },
    ],
    obs: 'Cautela: imunossuprimidos / SII-SIBO',
  },
  {
    id: 'INT-P',
    fluxo: 'Intestino',
    nivel: 'PREMIUM',
    sku: 'INT-P',
    produto: 'Gut Repair',
    forma: 'Caps 60 / 30d',
    componentes: [
      { nome: 'Glutamina', dose: '5 g', custoReais: 18 },
      { nome: 'Probiótico (mix cepas)', dose: '10 bi CFU', custoReais: 26 },
      { nome: 'Zinco (quelato)', dose: '10 mg', custoReais: 8 },
    ],
    obs: 'Cautela: imunossuprimidos',
  },
  // Fígado
  {
    id: 'FIG-B',
    fluxo: 'Fígado',
    nivel: 'BÁSICO',
    sku: 'FIG-B',
    produto: 'Silimarina Core',
    forma: 'Caps 60 / 30d',
    componentes: [
      { nome: 'Silimarina', dose: '200 mg', custoReais: 14 },
      { nome: 'Colina', dose: '250 mg', custoReais: 8 },
    ],
  },
  {
    id: 'FIG-C',
    fluxo: 'Fígado',
    nivel: 'COMPLETO',
    sku: 'FIG-C',
    produto: 'Antioxidante',
    forma: 'Caps 60 / 30d',
    componentes: [
      { nome: 'NAC', dose: '600 mg', custoReais: 18 },
      { nome: 'Silimarina', dose: '200 mg', custoReais: 14 },
      { nome: 'Colina', dose: '250 mg', custoReais: 2 },
    ],
  },
  {
    id: 'FIG-P',
    fluxo: 'Fígado',
    nivel: 'PREMIUM',
    sku: 'FIG-P',
    produto: 'Hepato Plus',
    forma: 'Caps 60 / 30d',
    componentes: [
      { nome: 'Silimarina', dose: '200 mg', custoReais: 14 },
      { nome: 'NAC', dose: '600 mg', custoReais: 18 },
      { nome: 'Vitamina E', dose: '100 UI', custoReais: 10 },
    ],
    obs: 'Cautela: anticoagulante',
  },
  // Libido Masc.
  {
    id: 'LIB-B',
    fluxo: 'Libido Masc.',
    nivel: 'BÁSICO',
    sku: 'LIB-B',
    produto: 'Zinc & D',
    forma: 'Caps 60 / 30d',
    componentes: [
      { nome: 'Zinco (quelato)', dose: '15 mg', custoReais: 8 },
      { nome: 'Vitamina D3', dose: '2000 UI', custoReais: 7 },
    ],
  },
  {
    id: 'LIB-C',
    fluxo: 'Libido Masc.',
    nivel: 'COMPLETO',
    sku: 'LIB-C',
    produto: 'Vitality',
    forma: 'Caps 60 / 30d',
    componentes: [
      { nome: 'Maca peruana', dose: '1 g', custoReais: 12 },
      { nome: 'Magnésio (glicinato)', dose: '200 mg', custoReais: 10 },
      { nome: 'Zinco (quelato)', dose: '15 mg', custoReais: 4 },
    ],
  },
  {
    id: 'LIB-P',
    fluxo: 'Libido Masc.',
    nivel: 'PREMIUM',
    sku: 'LIB-P',
    produto: 'Pump',
    forma: 'Caps 60 / 30d',
    componentes: [
      { nome: 'L-citrulina', dose: '1,5 g', custoReais: 20 },
      { nome: 'Maca peruana', dose: '1 g', custoReais: 12 },
      { nome: 'Magnésio (glicinato)', dose: '200 mg', custoReais: 8 },
    ],
    obs: 'Cautela: nitratos/hipotensão',
  },
  // Menopausa
  {
    id: 'MNP-B',
    fluxo: 'Menopausa',
    nivel: 'BÁSICO',
    sku: 'MNP-B',
    produto: 'Isoflavonas',
    forma: 'Caps 60 / 30d',
    componentes: [{ nome: 'Isoflavonas de soja', dose: '80 mg', custoReais: 22 }],
    obs: 'Rótulo vermelho: CA hormônio-dep',
  },
  {
    id: 'MNP-C',
    fluxo: 'Menopausa',
    nivel: 'COMPLETO',
    sku: 'MNP-C',
    produto: 'Ossos & Músculo',
    forma: 'Caps 60 / 30d',
    componentes: [
      { nome: 'Vitamina D3', dose: '2000 UI', custoReais: 10 },
      { nome: 'Magnésio (glicinato)', dose: '200 mg', custoReais: 12 },
      { nome: 'Vitamina K2', dose: '100 mcg', custoReais: 8 },
    ],
    obs: 'Cautela: anticoagulante (K2)',
  },
  {
    id: 'MNP-P',
    fluxo: 'Menopausa',
    nivel: 'PREMIUM',
    sku: 'MNP-P',
    produto: 'Hot Flash Support',
    forma: 'Caps 60 / 30d',
    componentes: [
      { nome: 'Isoflavonas de soja', dose: '80 mg', custoReais: 22 },
      { nome: 'Magnésio (glicinato)', dose: '200 mg', custoReais: 8 },
      { nome: 'Vitamina E', dose: '100 UI', custoReais: 6 },
    ],
    obs: 'Rótulo vermelho: CA hormônio-dep',
  },
  // Articulações
  {
    id: 'ART-B',
    fluxo: 'Articulações',
    nivel: 'BÁSICO',
    sku: 'ART-B',
    produto: 'Joint Base',
    forma: 'Caps 60 / 30d',
    componentes: [
      { nome: 'Colágeno tipo II', dose: '40 mg', custoReais: 18 },
      { nome: 'Vitamina C', dose: '200 mg', custoReais: 6 },
    ],
  },
  {
    id: 'ART-C',
    fluxo: 'Articulações',
    nivel: 'COMPLETO',
    sku: 'ART-C',
    produto: 'Cartilagem',
    forma: 'Caps 60 / 30d',
    componentes: [
      { nome: 'Glucosamina', dose: '750 mg', custoReais: 18 },
      { nome: 'Condroitina', dose: '600 mg', custoReais: 12 },
      { nome: 'Vitamina C', dose: '200 mg', custoReais: 8 },
    ],
    obs: 'Cautela: alergia crustáceos',
  },
  {
    id: 'ART-P',
    fluxo: 'Articulações',
    nivel: 'PREMIUM',
    sku: 'ART-P',
    produto: 'Anti-Inflam',
    forma: 'Caps 60 / 30d',
    componentes: [
      { nome: 'Curcumina (biodisp.)', dose: '500 mg', custoReais: 26 },
      { nome: 'Boswellia', dose: '300 mg', custoReais: 18 },
      { nome: 'Vitamina D3', dose: '2000 UI', custoReais: 14 },
    ],
    obs: 'Cautela: anticoagulante',
  },
  // Imunidade
  {
    id: 'IMU-B',
    fluxo: 'Imunidade',
    nivel: 'BÁSICO',
    sku: 'IMU-B',
    produto: 'C+D+Zn',
    forma: 'Caps 60 / 30d',
    componentes: [
      { nome: 'Vitamina C', dose: '500 mg', custoReais: 8 },
      { nome: 'Vitamina D3', dose: '2000 UI', custoReais: 6 },
      { nome: 'Zinco (quelato)', dose: '15 mg', custoReais: 4 },
    ],
  },
  {
    id: 'IMU-C',
    fluxo: 'Imunidade',
    nivel: 'COMPLETO',
    sku: 'IMU-C',
    produto: 'Immune +',
    forma: 'Caps 60 / 30d',
    componentes: [
      { nome: 'Vitamina C', dose: '500 mg', custoReais: 8 },
      { nome: 'Vitamina D3', dose: '2000 UI', custoReais: 6 },
      { nome: 'Zinco (quelato)', dose: '15 mg', custoReais: 4 },
      { nome: 'Selênio', dose: '100 mcg', custoReais: 4 },
    ],
  },
  {
    id: 'IMU-P',
    fluxo: 'Imunidade',
    nivel: 'PREMIUM',
    sku: 'IMU-P',
    produto: 'Immune + Gut',
    forma: 'Caps 60 / 30d',
    componentes: [
      { nome: 'Vitamina C', dose: '500 mg', custoReais: 8 },
      { nome: 'Vitamina D3', dose: '2000 UI', custoReais: 6 },
      { nome: 'Zinco (quelato)', dose: '15 mg', custoReais: 4 },
      { nome: 'Probiótico (mix cepas)', dose: '10 bi CFU', custoReais: 26 },
    ],
    obs: 'Cautela: imunossuprimidos',
  },
  // Tirzepatida (Rx)
  {
    id: 'TRZ-2_5',
    fluxo: 'Tirzepatida (Rx)',
    nivel: '2,5 mg/mL',
    sku: 'TRZ-2_5',
    produto: 'Programa Metabólico Rx',
    forma: 'Rx (prescrição)',
    componentes: [
      { nome: 'Tirzepatida (concentração)', dose: '2,5 mg/mL', custoReais: 400 },
    ],
    obs: 'Somente com prescrição/dispensação regular',
  },
  {
    id: 'TRZ-5',
    fluxo: 'Tirzepatida (Rx)',
    nivel: '5 mg/mL',
    sku: 'TRZ-5',
    produto: 'Programa Metabólico Rx',
    forma: 'Rx (prescrição)',
    componentes: [
      { nome: 'Tirzepatida (concentração)', dose: '5 mg/mL', custoReais: 800 },
    ],
    obs: 'Somente com prescrição/dispensação regular',
  },
  {
    id: 'TRZ-20',
    fluxo: 'Tirzepatida (Rx)',
    nivel: '20 mg/mL',
    sku: 'TRZ-20',
    produto: 'Programa Metabólico Rx',
    forma: 'Rx (prescrição)',
    componentes: [
      { nome: 'Tirzepatida (concentração)', dose: '20 mg/mL', custoReais: 1000 },
    ],
    obs: 'Somente com prescrição/dispensação regular',
  },
];

/** Total BOM de uma fórmula (soma dos custos dos componentes) */
export function calcBom(formula: Formula): number {
  return formula.componentes.reduce((s, c) => s + c.custoReais, 0);
}

/** Total BOM de todas as fórmulas */
export function calcBomTotal(formulas: Formula[]): number {
  return formulas.reduce((s, f) => s + calcBom(f), 0);
}

/** Formatar valor em reais */
export function formatReais(val: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(val);
}
