#!/usr/bin/env tsx
/**
 * Aplica shortBenefit individualizados e factuais por produto.
 * Fato, não fake. Conversão máxima. Sucinto.
 * Uso: pnpm tsx scripts/apply-individual-short-benefits.ts
 */

import * as fs from 'fs';
import * as path from 'path';

const PRICING_PATH = path.join(process.cwd(), 'data', 'store-v2', 'pricing-content-v3-validado.csv');

// Mapeamento SKU -> shortBenefit individualizado (factual, conversão, sucinto)
const SHORT_BENEFITS: Record<string, string> = {
  // Ansiedade & Humor
  'MEJOY-0001': 'Precursor da serotonina para humor e bem-estar.',
  'MEJOY-0002': 'Dose menor de 5-HTP para início suave.',
  'MEJOY-0003': 'Magnésio quelato + ácido málico para energia e relaxamento.',
  'MEJOY-0004': 'Adaptógeno para estresse e foco (30 caps).',
  'MEJOY-0005': 'Ashwagandha para equilíbrio e disposição (60 caps).',
  'MEJOY-0006': 'Combo de ativos para sono e relaxamento.',
  'MEJOY-0007': 'Cognição e memória com bacopa.',
  'MEJOY-0008': 'Energia e resistência com ginseng coreano.',
  'MEJOY-0009': 'Inositol para equilíbrio emocional e ovário.',
  'MEJOY-0010': 'Aminoácido do chá verde para calma sem sonolência.',
  'MEJOY-0011': 'Passiflora para relaxamento e sono leve.',
  'MEJOY-0012': 'Adaptógeno para energia e resistência ao estresse.',
  'MEJOY-0013': 'Três formas de magnésio para absorção máxima.',
  // Articulações
  'MEJOY-0014': 'Colágeno tipo II para cartilagem e mobilidade.',
  'MEJOY-0015': 'Boro para saúde óssea e articular.',
  'MEJOY-0016': 'Anti-inflamatório natural para articulações.',
  'MEJOY-0017': 'Condroitina para cartilagem e amortecimento.',
  'MEJOY-0018': 'Colágeno UC-II para resposta articular.',
  'MEJOY-0019': 'Diacerina para conforto e mobilidade articular.',
  'MEJOY-0020': 'Garra-do-diabo para articulações e costas.',
  'MEJOY-0021': 'Superóxido dismutase para proteção articular.',
  'MEJOY-0022': 'Fibra que auxilia saciedade e metabolismo.',
  'MEJOY-0023': 'Glucosamina para cartilagem e articulações.',
  'MEJOY-0024': 'Combo completo: glucosamina, condroitina, CT2 e ácido hialurônico.',
  'MEJOY-0025': 'Glucosamina + condroitina + MSM em sachês práticos.',
  'MEJOY-0026': 'Enxofre orgânico para articulações e tecidos.',
  'MEJOY-0027': 'SAME para cartilagem e humor.',
  'MEJOY-0028': 'Selênio para antioxidante e articulações.',
  'MEJOY-0029': 'Sucupira para articulações e bem-estar.',
  'MEJOY-0030': 'Colágeno UC-II 30 caps para articulações.',
  'MEJOY-0031': 'Colágeno UC-II 60 caps, maior duração.',
  'MEJOY-0032': 'Urtiga para articulações e bem-estar.',
  'MEJOY-0033': 'Óleo de borragem para conforto articular.',
  // Cabelo
  'MEJOY-0034': 'Actrisave: ativo antienvelhecimento para fios e couro cabeludo.',
  'MEJOY-0035': 'Complexo vitamínico para nutrir e fortalecer os fios.',
  'MEJOY-0036': 'Minoxidil + D-pantenol + auxina para crescimento e força.',
  'MEJOY-0037': 'Minoxidil 5% com biotina para fios mais fortes.',
  'MEJOY-0038': 'Minoxidil 5% com propilenoglicol, fórmula clássica.',
  'MEJOY-0039': 'Minoxidil em trichosol, leve para couro sensível.',
  'MEJOY-0040': 'Minoxidil turbinado para crescimento capilar.',
  'MEJOY-0041': 'Biotina, queratina e nutrientes para fios e unhas.',
  'MEJOY-0042': 'Pill Food turbinado 120 caps, maior duração.',
  'MEJOY-0043': 'Pill Food turbinado 60 caps para cabelos e unhas.',
  'MEJOY-0044': 'Saw palmeto para saúde capilar e bem-estar.',
  'MEJOY-0045': 'Solução tópica 2,5% para fortalecimento dos fios.',
  'MEJOY-0046': 'Completo feminino: fios, unhas e pele.',
  'MEJOY-0047': 'Completo masculino para fios e unhas.',
  // Emagrecimento & Metabolismo
  'MEJOY-0048': 'Akkermat 150 mg para controle de gordura corporal.',
  'MEJOY-0049': 'Antioxidante que auxilia metabolismo energético.',
  'MEJOY-0050': 'Cactina para saciedade e metabolismo.',
  'MEJOY-0051': 'Cafeína para energia e termogênese.',
  'MEJOY-0052': 'Cavalinha para retenção e digestão.',
  'MEJOY-0053': 'Chá verde EGCG para metabolismo e termogênese.',
  'MEJOY-0054': 'Creatina para energia muscular e performance.',
  'MEJOY-0055': 'Curcuma anti-inflamatória para metabolismo.',
  'MEJOY-0056': 'Garcinia para controle de apetite e saciedade.',
  'MEJOY-0057': 'Ioimbina 5 mg 120 caps para metabolismo.',
  'MEJOY-0058': 'Ioimbina 5 mg 60 caps para energia.',
  'MEJOY-0059': 'Ioimbina 5 mg 90 caps para suporte metabólico.',
  'MEJOY-0060': 'Ioimbina 10 mg para maior suporte.',
  'MEJOY-0061': 'L-carnitina transporta gordura para energia.',
  'MEJOY-0062': 'Mitburn 30 caps para metabolismo mitocondrial.',
  'MEJOY-0063': 'Mitburn 60 caps para suporte metabólico.',
  'MEJOY-0064': 'Morosil 30 caps: extrato de laranja para metabolismo de gordura.',
  'MEJOY-0065': 'Morosil 60 caps para maior duração.',
  'MEJOY-0066': 'Orlistat 120 mg para redução de absorção de gordura.',
  'MEJOY-0067': 'Cromo 100 mcg para controle de açúcar e apetite.',
  'MEJOY-0068': 'Cromo 350 mcg para maior suporte.',
  'MEJOY-0069': 'Spirulina: superalimento para saciedade e energia.',
  // Detox & Fígado
  'MEJOY-0070': 'Acetil L-carnitina + alfa lipoico para energia e detox.',
  'MEJOY-0071': 'Curcuma + pimenta preta para fígado e detox.',
  'MEJOY-0072': 'Resveratrol antioxidante para fígado e proteção.',
  'MEJOY-0073': 'Silimarina 120 caps para função hepática.',
  'MEJOY-0074': 'Silimarina 60 caps para suporte ao fígado.',
  'MEJOY-0075': 'Silimarina + metionina para detox hepático.',
  // Imunidade
  'MEJOY-0076': 'Astaxantina: antioxidante potente para proteção.',
  'MEJOY-0077': 'CoQ10 100 mg 120 caps para energia e coração.',
  'MEJOY-0078': 'CoQ10 100 mg 60 caps para suporte celular.',
  'MEJOY-0079': 'CoQ10 200 mg para dose mais alta.',
  'MEJOY-0080': 'Complexo B para energia e metabolismo.',
  'MEJOY-0081': 'Ferro 18 mg para energia e vitalidade.',
  'MEJOY-0082': 'Probiótico Lactobacillus reuteri para intestino e imunidade.',
  'MEJOY-0083': 'Lisina para imunidade e suporte.',
  'MEJOY-0084': 'Multivitamínico para imunidade e energia.',
  'MEJOY-0085': 'NAC para antioxidante e detox.',
  'MEJOY-0086': 'Óleo de abóbora para próstata e bem-estar.',
  'MEJOY-0087': 'Pinus pinaster para circulação e antioxidante.',
  'MEJOY-0088': 'Trans-resveratrol para proteção e longevidade.',
  'MEJOY-0089': 'Vitamina A para visão e imunidade.',
  'MEJOY-0090': 'Multivitamínico A, C, D, E & zinco para imunidade.',
  'MEJOY-0091': 'Vitamina B6 para metabolismo e energia.',
  'MEJOY-0092': 'Ácido fólico para saúde celular e gestação.',
  'MEJOY-0093': 'Vitamina C 500 mg para imunidade e antioxidante.',
  'MEJOY-0094': 'Vitamina C + zinco para defesa imune.',
  'MEJOY-0095': 'Vitamina D 10.000 UI para ossos e imunidade.',
  'MEJOY-0096': 'Vitamina D 5.000 UI para manutenção.',
  'MEJOY-0097': 'Vitamina D 50.000 UI semanal para correção.',
  'MEJOY-0098': 'Vitamina E 400 UI para antioxidante.',
  'MEJOY-0099': 'Zinco 50 mg para imunidade e pele.',
  'MEJOY-0100': 'Ômega 3 para coração, cérebro e anti-inflamatório.',
  // Intestino
  'MEJOY-0101': 'Betaína HCl para digestão e ácido estomacal.',
  'MEJOY-0102': 'Biointestil: probiótico para microbiota intestinal.',
  'MEJOY-0103': 'Boldo para digestão e bem-estar do fígado.',
  'MEJOY-0104': 'Bromelina: enzima do abacaxi para digestão de proteínas.',
  'MEJOY-0105': 'Complexo de enzimas para digestão completa.',
  'MEJOY-0106': 'Probióticos para microbiota e conforto intestinal.',
  'MEJOY-0107': 'Gengibre 250 mg para digestão e náusea.',
  'MEJOY-0108': 'Gengibre 400 mg para maior suporte digestivo.',
  'MEJOY-0109': 'Glicina para intestino e sono.',
  'MEJOY-0110': 'Goma guar: fibra para saciedade e trânsito.',
  'MEJOY-0111': 'Intest Booster para microbiota e conforto.',
  'MEJOY-0112': 'Lactobacillus clausii para equilíbrio intestinal.',
  'MEJOY-0113': 'Lactobacillus gasseri para microbiota.',
  'MEJOY-0114': 'Mix digestivo: enzimas e probióticos.',
  'MEJOY-0115': 'Óleo de orégano para microbiota e equilíbrio.',
  'MEJOY-0116': 'Piperina para absorção de nutrientes.',
  'MEJOY-0117': 'Pré e pro bióticos para intestino saudável.',
  'MEJOY-0118': 'Psyllium: fibra solúvel para trânsito intestinal.',
  'MEJOY-0119': 'Sais biliares para digestão de gorduras.',
  'MEJOY-0120': 'Simeticona para desconforto por gases.',
  // Hormonal & Libido
  'MEJOY-0121': 'Cindura para energia e bem-estar feminino.',
  'MEJOY-0122': 'Feno-grego para energia e libido.',
  'MEJOY-0123': 'KSM-66 Ashwagandha para estresse e libido.',
  'MEJOY-0124': 'Maca peruana 120 caps para energia e libido.',
  'MEJOY-0125': 'Maca peruana 60 caps para disposição.',
  'MEJOY-0126': 'Tadalafila 10 mg 30 caps para suporte.',
  'MEJOY-0127': 'Tadalafila 10 mg 60 caps para maior duração.',
  'MEJOY-0128': 'Tadalafila 5 mg para uso contínuo.',
  'MEJOY-0129': 'Testofen para suporte hormonal masculino.',
  'MEJOY-0130': 'Tribulus 120 caps para energia e libido.',
  'MEJOY-0131': 'Tribulus 60 caps para disposição.',
  // Lipedema
  'MEJOY-0132': 'Centella asiática para circulação e pele.',
  'MEJOY-0133': 'Colágeno + ácido hialurônico + biotina + hibisco para pele.',
  'MEJOY-0134': 'Colágeno hidrolisado para pele, unhas e cabelo.',
  'MEJOY-0135': 'Colágeno + vitamina C para absorção.',
  'MEJOY-0136': 'Colágeno Verisol em sachês para pele.',
  'MEJOY-0137': 'Composto anti-celulite para circulação.',
  'MEJOY-0138': 'Composto Angela Borges para lipedema.',
  'MEJOY-0139': 'Creme firmador com CoQ10 para corpo.',
  'MEJOY-0140': 'Dimpless para circulação e lipedema.',
  // Menopausa & TPM
  'MEJOY-0141': 'Amora negra para equilíbrio hormonal e menopausa.',
  'MEJOY-0142': 'Cimicifuga para ondas de calor e menopausa.',
  'MEJOY-0143': 'Composto equilíbrio hormonal feminino.',
  'MEJOY-0144': 'Composto libido feminina.',
  'MEJOY-0145': 'Composto menopausa para bem-estar.',
  'MEJOY-0146': 'Isoflavona de soja para menopausa.',
  'MEJOY-0147': 'Óleo de prímula para TPM e menopausa.',
  'MEJOY-0148': 'Ormonelle para equilíbrio hormonal.',
  'MEJOY-0149': 'Progesterona transdérmica para reposição.',
  'MEJOY-0150': 'Vitex para TPM e ciclo menstrual.',
  'MEJOY-0151': 'Yam mexicano para equilíbrio hormonal.',
  // Sono
  'MEJOY-0152': 'GABA 200 mg: aminoácido para relaxamento e sono.',
  'MEJOY-0153': 'GABA 400 mg: dose maior para sono mais profundo.',
  'MEJOY-0154': 'Melatonina 3 mg para regular o ciclo do sono.',
  'MEJOY-0155': 'Melatonina 5 mg 100 caps para maior duração.',
  'MEJOY-0156': 'Melatonina 5 mg 30 caps para suporte ao sono.',
  'MEJOY-0157': 'Mulungu: planta tradicional para relaxamento e sono.',
  'MEJOY-0158': 'Passiflora para relaxamento e sono leve.',
  'MEJOY-0159': 'Proslepp para indução natural do sono.',
  'MEJOY-0160': 'Relora 250 mg para relaxamento e sono.',
  'MEJOY-0161': 'Relora 500 mg: dose concentrada para sono.',
  'MEJOY-0162': 'Valeriana para relaxamento e indução do sono.',
};

function parseCSVLine(line: string): string[] {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const c = line[i];
    if (c === '"') inQuotes = !inQuotes;
    else if (c === ',' && !inQuotes) {
      result.push(current.trim().replace(/^"|"$/g, '').replace(/""/g, '"'));
      current = '';
    } else if (c !== '\n' && c !== '\r') current += c;
  }
  result.push(current.trim().replace(/^"|"$/g, '').replace(/""/g, '"'));
  return result;
}

function parseCSV(content: string): Record<string, string>[] {
  const lines = content.split(/\r?\n/).filter((l) => l.length > 0);
  if (lines.length < 2) return [];
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
  return rows;
}

function escapeCsv(s: string): string {
  const t = (s || '').replace(/"/g, '""');
  return `"${t}"`;
}

function main() {
  const content = fs.readFileSync(PRICING_PATH, 'utf-8');
  const rows = parseCSV(content);
  const header = 'sku,priceCents,nome,compareAtCents,shortBenefit,description,seoTitle,seoDescription';

  let updated = 0;
  const out: string[] = [header];

  for (const row of rows) {
    const sku = row.sku?.trim();
    if (!sku) continue;

    const newBenefit = SHORT_BENEFITS[sku];
    if (newBenefit) {
      row.shortBenefit = newBenefit;
      updated++;
    }

    const line = [
      row.sku,
      row.priceCents,
      (row.nome || '').includes(',') ? escapeCsv(row.nome) : row.nome,
      row.compareAtCents ?? '',
      escapeCsv(row.shortBenefit || ''),
      escapeCsv(row.description || ''),
      escapeCsv(row.seoTitle || ''),
      escapeCsv(row.seoDescription || ''),
    ].join(',');
    out.push(line);
  }

  fs.writeFileSync(PRICING_PATH, out.join('\n') + '\n', 'utf-8');
  console.log(`✅ ${updated} shortBenefit individualizados aplicados em ${PRICING_PATH}`);
}

main();
