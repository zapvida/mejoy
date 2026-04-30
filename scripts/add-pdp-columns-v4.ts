#!/usr/bin/env tsx
/**
 * Adiciona colunas para_que_serve, references, how_to_use_bullets, advertencias_completo, video_url ao copy-blueprint-v4.csv
 */

import * as fs from 'fs';
import * as path from 'path';

const BLUEPRINT_PATH = path.join(process.cwd(), 'data', 'store-v2', 'copy', 'copy-blueprint-v4.csv');

const NEW_COLUMNS = ['para_que_serve', 'references', 'how_to_use_bullets', 'advertencias_completo', 'video_url'];

// Conteúdo para MEJOY-0001 (5-HTP 100 mg) - alinhado ao OficialFarma
const MEJOY_0001_VALUES: Record<string, string> = {
  para_que_serve:
    'Melhora do Humor | Promove o aumento dos níveis de serotonina, aliviando sintomas de depressão e ansiedade. | Regulação do Sono | Contribui para a melhora da qualidade do sono, ajudando a combater a insônia. | Controle do Apetite | Reduz o desejo por alimentos ricos em carboidratos e ajuda no controle de calorias. | Alívio do Estresse | Ajuda a reduzir o estresse e promove sensação de calma e relaxamento. | Bem-Estar Emocional | Contribui para equilíbrio emocional e controle do humor.',
  references:
    'Bird et al. (2005). 5-HTP and depression. J Psychopharmacol. | Birm et al. (2014). 5-HTP supplementation and sleep quality. Sleep Med Rev.',
  how_to_use_bullets: '- Tomar 1 cápsula ao dia. | - Preferencialmente antes de dormir.',
  advertencias_completo: '',
  video_url: '',
};

function escapeCsv(val: string): string {
  if (val.includes(',') || val.includes('"') || val.includes('\n')) {
    return `"${val.replace(/"/g, '""')}"`;
  }
  return val;
}

function main() {
  const content = fs.readFileSync(BLUEPRINT_PATH, 'utf-8');
  const lines = content.split(/\r?\n/);
  if (lines.length < 2) {
    console.error('CSV inválido');
    process.exit(1);
  }

  const header = lines[0];
  if (header.includes('para_que_serve')) {
    console.log('Colunas já existem. Nada a fazer.');
    return;
  }

  const newHeader = header + ',' + NEW_COLUMNS.join(',');
  const output: string[] = [newHeader];

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i];
    if (!line.trim()) continue;
    const sku = line.split(',')[0]?.trim() ?? '';
    const values = NEW_COLUMNS.map((col) => {
      if (sku === 'MEJOY-0001' && MEJOY_0001_VALUES[col]) {
        return escapeCsv(MEJOY_0001_VALUES[col]);
      }
      return '';
    });
    output.push(line + ',' + values.join(','));
  }

  fs.writeFileSync(BLUEPRINT_PATH, output.join('\n') + '\n', 'utf-8');
  console.log(`Adicionadas colunas: ${NEW_COLUMNS.join(', ')}`);
  console.log(`MEJOY-0001 preenchido com conteúdo para Para que serve, Referências e Como usar.`);
}

main();
