#!/usr/bin/env tsx
/**
 * Enriquece copy-blueprint-v2.csv com copy premium para cluster Sono.
 * Substitui hero_benefit, description_md, faq por versões mais sofisticadas.
 * Uso: pnpm run copy:enrich-premium
 */

import * as fs from 'fs';
import * as path from 'path';

const V2_PATH = path.join(process.cwd(), 'data', 'store-v2', 'copy', 'copy-blueprint-v2.csv');
const NL = ' | ';

const PREMIUM_SONO: Record<string, { hero_benefit: string; shortBenefit: string; description_md: string; faq: string; seoDescription: string }> = {
  'MEJOY-0152': {
    hero_benefit: 'GABA 200 mg: o neurotransmissor que ajuda a desligar a mente e preparar o corpo para um sono reparador.',
    shortBenefit: 'Dose inicial de GABA para quem quer começar suave e construir uma rotina noturna mais tranquila.',
    description_md: `## O que é ${NL} ${NL} GABA (ácido gama-aminobutírico) é o principal neurotransmissor inibitório do cérebro. Em dose de 200 mg, esta fórmula pode auxiliar no relaxamento e na transição para o sono, especialmente para quem ainda não conhece o suplemento. ${NL} ${NL} ## Para quem pode fazer sentido ${NL} ${NL} Pessoas que demoram a desligar à noite, que acordam com a mente acelerada ou que buscam uma dose inicial para testar a resposta ao GABA. ${NL} ${NL} ## Diferenciais da fórmula ${NL} ${NL} - GABA 200 mg — dose de entrada ${NL} - 60 cápsulas — cerca de 2 meses de uso ${NL} - Fórmula manipulada com controle de qualidade ${NL} - Ponto de partida antes de considerar 400 mg ${NL} ${NL} ## Como usar ${NL} ${NL} Conforme orientação do profissional de saúde. Geralmente à noite, antes de dormir. Apresentação: 60 cápsulas. ${NL} ${NL} ## Cuidados ${NL} ${NL} Gestantes, lactantes e crianças devem consultar médico antes do uso. Não substitui acompanhamento médico para insônia crônica. Consulte um profissional de saúde. Este produto não substitui uma alimentação equilibrada e hábitos saudáveis.`,
    faq: `O que é GABA? | GABA é um neurotransmissor natural que ajuda a acalmar o sistema nervoso. A suplementação pode auxiliar no relaxamento e na preparação para o sono. | GABA 200 mg ou 400 mg? | 200 mg é ideal para iniciantes. Se após algumas semanas sentir que precisa de mais suporte, considere a versão 400 mg com orientação profissional. | GABA tem efeito colateral? | Em geral é bem tolerado. Sonolência diurna pode ocorrer se a dose for alta. Consulte seu médico. | Quando tomar GABA? | À noite, 30–60 min antes de dormir, conforme orientação. | GABA substitui melatonina? | Não. São mecanismos diferentes. GABA atua no relaxamento; melatonina no ciclo do sono. Podem ser complementares.`,
    seoDescription: 'GABA 200 mg para relaxamento e sono. Dose inicial, 60 cápsulas. Fórmula manipulada. Entrega nacional. Me Joy.',
  },
  'MEJOY-0153': {
    hero_benefit: 'GABA 400 mg: dose concentrada para quem já conhece o ativo e busca um relaxamento mais profundo antes de dormir.',
    shortBenefit: 'Dose dupla de GABA para noites mais tranquilas quando 200 mg não é suficiente.',
    description_md: `## O que é ${NL} ${NL} GABA 400 mg oferece o dobro da dose da versão 200 mg. Indicado para quem já usa GABA e sente que precisa de mais suporte, ou para quem tem maior dificuldade para relaxar à noite. ${NL} ${NL} ## Para quem pode fazer sentido ${NL} ${NL} Quem já experimentou GABA 200 mg e quer intensificar o efeito, ou quem tem rotina noturna muito agitada e busca uma dose mais concentrada desde o início (com orientação). ${NL} ${NL} ## Diferenciais da fórmula ${NL} ${NL} - GABA 400 mg — dose concentrada ${NL} - 60 cápsulas ${NL} - Mesma qualidade da linha, maior concentração ${NL} - Para relaxamento mais intenso ${NL} ${NL} ## Como usar ${NL} ${NL} Conforme orientação do profissional de saúde. À noite, antes de dormir. Apresentação: 60 cápsulas. ${NL} ${NL} ## Cuidados ${NL} ${NL} Gestantes, lactantes e crianças devem consultar médico. Iniciantes podem preferir 200 mg. Este produto não substitui uma alimentação equilibrada e hábitos saudáveis.`,
    faq: `GABA 400 mg é forte? | É o dobro da dose da versão 200 mg. Pode ser mais eficaz para quem já usa GABA ou tem maior necessidade. | Diferença entre GABA 200 e 400? | 200 mg é para início; 400 mg para quem precisa de mais suporte. A resposta é individual. | Posso tomar GABA 400 de dia? | Não recomendado — pode causar sonolência. Use à noite. | GABA 400 mg dura quanto? | 60 cápsulas = cerca de 2 meses com 1 cápsula/dia.`,
    seoDescription: 'GABA 400 mg para sono e relaxamento profundo. Dose concentrada, 60 cápsulas. Fórmula manipulada. Me Joy.',
  },
  'MEJOY-0154': {
    hero_benefit: 'Melatonina 3 mg: a dose de referência para quem quer regular o relógio biológico e retomar o ritmo natural do sono.',
    shortBenefit: 'Dose padrão de melatonina para regular o ciclo do sono — ideal para jet lag e rotinas irregulares.',
    description_md: `## O que é ${NL} ${NL} Melatonina é o hormônio que o corpo produz naturalmente para sinalizar que é hora de dormir. A dose de 3 mg é a mais estudada e recomendada como ponto de partida para auxiliar na regulação do ciclo circadiano. ${NL} ${NL} ## Para quem pode fazer sentido ${NL} ${NL} Quem trabalha em turnos, viaja muito (jet lag), tem horários irregulares ou simplesmente quer uma dose padrão para ajudar a "reprogramar" o sono. ${NL} ${NL} ## Diferenciais da fórmula ${NL} ${NL} - Melatonina 3 mg — dose de referência ${NL} - 100 cápsulas — maior duração ${NL} - Evidência científica robusta para regulação do ciclo ${NL} - Ponto de partida antes de considerar 5 mg ${NL} ${NL} ## Como usar ${NL} ${NL} Conforme orientação. Geralmente 30–60 min antes de dormir. Apresentação: 100 cápsulas. ${NL} ${NL} ## Cuidados ${NL} ${NL} Gestantes, lactantes e crianças devem consultar médico. Evite dirigir após o uso. Este produto não substitui uma alimentação equilibrada e hábitos saudáveis.`,
    faq: `Melatonina 3 mg é suficiente? | Para muitas pessoas, sim. É a dose mais estudada. Se não sentir efeito após 1–2 semanas, converse com seu médico sobre 5 mg. | Melatonina regula o sono? | Ajuda a sinalizar ao corpo que é hora de dormir. Funciona melhor com rotina (horário fixo, ambiente escuro). | Melatonina 3 ou 5 mg? | Comece com 3 mg. 5 mg é para quem precisa de mais suporte ou já usa melatonina. | Posso tomar melatonina todo dia? | Conforme orientação. Uso prolongado deve ser acompanhado por profissional.`,
    seoDescription: 'Melatonina 3 mg para regular o ciclo do sono. 100 cápsulas. Dose de referência. Fórmula manipulada. Me Joy.',
  },
  'MEJOY-0155': {
    hero_benefit: 'Melatonina 5 mg em 100 cápsulas: dose mais alta + embalagem econômica para quem já conhece o ativo e quer praticidade.',
    shortBenefit: 'Melatonina 5 mg com 100 cápsulas — dose reforçada e maior duração para noites mais consistentes.',
    description_md: `## O que é ${NL} ${NL} Melatonina 5 mg em embalagem de 100 cápsulas. Combina dose mais alta (útil quando 3 mg não é suficiente) com economia: até 3 meses de uso. ${NL} ${NL} ## Para quem pode fazer sentido ${NL} ${NL} Quem já usa melatonina e sabe que 5 mg funciona melhor, ou quem quer testar dose mais alta com orientação. A embalagem grande evita recompra frequente. ${NL} ${NL} ## Diferenciais da fórmula ${NL} ${NL} - Melatonina 5 mg — dose reforçada ${NL} - 100 cápsulas — até 3 meses ${NL} - Melhor custo-benefício para uso contínuo ${NL} - Para quem precisa de indução mais forte do sono ${NL} ${NL} ## Como usar ${NL} ${NL} Conforme orientação. À noite, antes de dormir. Apresentação: 100 cápsulas. ${NL} ${NL} ## Cuidados ${NL} ${NL} Gestantes, lactantes e crianças devem consultar médico. Iniciantes podem preferir 3 mg. Este produto não substitui uma alimentação equilibrada e hábitos saudáveis.`,
    faq: `Melatonina 5 mg funciona? | Sim. É uma das doses mais usadas. A resposta varia por pessoa. | 100 cápsulas dura quanto? | Cerca de 3 meses com 1 cápsula/dia. | Melatonina 5 mg dá efeito colateral? | Em geral é bem tolerada. Sonolência diurna pode ocorrer se tomar tarde. | Diferença 3 mg e 5 mg? | 5 mg pode induzir o sono mais rapidamente. Algumas pessoas respondem melhor a uma ou outra.`,
    seoDescription: 'Melatonina 5 mg, 100 cápsulas. Dose reforçada para sono. Fórmula manipulada. Entrega nacional. Me Joy.',
  },
  'MEJOY-0156': {
    hero_benefit: 'Melatonina 5 mg em 30 cápsulas: a embalagem ideal para testar a dose sem comprometer com 100 cápsulas.',
    shortBenefit: 'Melatonina 5 mg em 30 cápsulas — perfeita para viagem, teste ou uso pontual.',
    description_md: `## O que é ${NL} ${NL} Mesma dose de 5 mg da versão grande, em embalagem de 30 cápsulas. Ideal para quem quer experimentar a dose antes de comprar 100, para viagens ou para uso esporádico. ${NL} ${NL} ## Para quem pode fazer sentido ${NL} ${NL} Quem quer testar melatonina 5 mg sem comprometer com embalagem grande, quem viaja com frequência ou quem usa apenas em noites específicas (antes de reunião importante, viagem, etc.). ${NL} ${NL} ## Diferenciais da fórmula ${NL} ${NL} - Melatonina 5 mg — mesma dose da versão 100 caps ${NL} - 30 cápsulas — 1 mês ou uso pontual ${NL} - Embalagem compacta para viagem ${NL} - Sem compromisso com uso prolongado ${NL} ${NL} ## Como usar ${NL} ${NL} Conforme orientação. À noite. Apresentação: 30 cápsulas. ${NL} ${NL} ## Cuidados ${NL} ${NL} Gestantes, lactantes e crianças devem consultar médico. Este produto não substitui uma alimentação equilibrada e hábitos saudáveis.`,
    faq: `Melatonina 5 mg 30 caps vale a pena? | Sim, se você quer testar ou usar pontualmente. Para uso contínuo, 100 cápsulas é mais econômico. | Posso levar no avião? | Sim. 30 cápsulas cabem na bagagem de mão. | Dura quanto? | Cerca de 1 mês com 1 cápsula/dia.`,
    seoDescription: 'Melatonina 5 mg, 30 cápsulas. Para teste ou viagem. Fórmula manipulada. Me Joy.',
  },
  'MEJOY-0157': {
    hero_benefit: 'Mulungu 200 mg: a planta brasileira que a tradição usa para acalmar a mente e preparar o corpo para o descanso.',
    shortBenefit: 'Mulungu — fitoterapia nacional para relaxamento e sono, com raízes na medicina tradicional.',
    description_md: `## O que é ${NL} ${NL} Mulungu (Erythrina mulungu) é uma planta nativa do Brasil, usada há gerações para relaxamento e bem-estar. Estudos preliminares sugerem potencial para auxiliar no relaxamento. A tradição popular reforça seu uso à noite. ${NL} ${NL} ## Para quem pode fazer sentido ${NL} ${NL} Quem prefere fitoterápicos a sintéticos, quem valoriza plantas brasileiras ou quem quer uma alternativa mais suave antes de considerar melatonina ou GABA. ${NL} ${NL} ## Diferenciais da fórmula ${NL} ${NL} - Mulungu 200 mg — extrato da casca ${NL} - 60 cápsulas ${NL} - Planta tradicional brasileira ${NL} - Abordagem mais suave que melatonina ${NL} ${NL} ## Como usar ${NL} ${NL} Conforme orientação. Geralmente à noite. Apresentação: 60 cápsulas. ${NL} ${NL} ## Cuidados ${NL} ${NL} Gestantes, lactantes e crianças devem consultar médico. Evidência científica ainda em construção. Este produto não substitui uma alimentação equilibrada e hábitos saudáveis.`,
    faq: `Mulungu ajuda a dormir? | A tradição e estudos preliminares sugerem benefício para relaxamento. A resposta é individual. | Mulungu é natural? | Sim. É extrato de planta. | Mulungu ou melatonina? | Mulungu atua mais no relaxamento; melatonina no ciclo do sono. São complementares. | Mulungu tem contraindicação? | Gestantes, lactantes e crianças devem evitar. Consulte médico.`,
    seoDescription: 'Mulungu 200 mg para relaxamento e sono. Planta brasileira. 60 cápsulas. Fórmula manipulada. Me Joy.',
  },
  'MEJOY-0158': {
    hero_benefit: 'Passiflora 200 mg: o toque suave da maracujá para quem busca sono leve, sem sedação forte.',
    shortBenefit: 'Passiflora para ansiedade noturna e sono leve — efeito mais delicado que valeriana.',
    description_md: `## O que é ${NL} ${NL} Passiflora (maracujá) é uma das plantas mais usadas para relaxamento e sono leve. Diferente da valeriana, tende a ter efeito mais suave — ideal para quem não quer sensação de "peso" ao acordar. ${NL} ${NL} ## Para quem pode fazer sentido ${NL} ${NL} Quem tem ansiedade leve à noite, quem acorda facilmente ou quem prefere algo mais delicado. Também para quem já tentou valeriana e achou forte demais. ${NL} ${NL} ## Diferenciais da fórmula ${NL} ${NL} - Passiflora 200 mg ${NL} - 60 cápsulas ${NL} - Efeito suave, sem sedação pesada ${NL} - Tradição de uso para ansiedade noturna ${NL} ${NL} ## Como usar ${NL} ${NL} Conforme orientação. À noite. Apresentação: 60 cápsulas. ${NL} ${NL} ## Cuidados ${NL} ${NL} Gestantes, lactantes e crianças devem consultar médico. Insônia severa pode exigir avaliação médica. Este produto não substitui uma alimentação equilibrada e hábitos saudáveis.`,
    faq: `Passiflora dá sono? | Ajuda a relaxar e pode facilitar a chegada do sono. O efeito é mais suave que valeriana. | Passiflora ou valeriana? | Passiflora = mais suave. Valeriana = mais sedativa. Escolha conforme sua necessidade. | Passiflora é maracujá? | Sim. Passiflora incarnata é uma espécie de maracujá usada na fitoterapia. | Passiflora causa dependência? | Não. É considerada segura para uso conforme orientação.`,
    seoDescription: 'Passiflora 200 mg para sono leve e relaxamento. Efeito suave. 60 cápsulas. Fórmula manipulada. Me Joy.',
  },
  'MEJOY-0159': {
    hero_benefit: 'Proslepp 130 mg: melatonina natural da cereja Montmorency para quem prefere fontes botânicas.',
    shortBenefit: 'Extrato de cereja com melatonina natural — indução do sono a partir da fruta.',
    description_md: `## O que é ${NL} ${NL} Proslepp é extrato padronizado de cereja Montmorency, que contém melatonina natural além de outros compostos (antocianinas, triptofano) que podem auxiliar na indução do sono. Para quem prefere "melatonina da fruta" à sintética. ${NL} ${NL} ## Para quem pode fazer sentido ${NL} ${NL} Quem prefere fontes naturais, quem quer combinar melatonina com antioxidantes da cereja ou quem busca uma abordagem mais "integral" para o sono. ${NL} ${NL} ## Diferenciais da fórmula ${NL} ${NL} - Proslepp 130 mg — extrato de cereja ${NL} - 60 cápsulas ${NL} - Melatonina + compostos da fruta ${NL} - Fonte botânica vs. sintética ${NL} ${NL} ## Como usar ${NL} ${NL} Conforme orientação. À noite. Apresentação: 60 cápsulas. ${NL} ${NL} ## Cuidados ${NL} ${NL} Gestantes, lactantes e crianças devem consultar médico. A dose de melatonina varia conforme o lote da cereja. Este produto não substitui uma alimentação equilibrada e hábitos saudáveis.`,
    faq: `O que é Proslepp? | Extrato de cereja Montmorency com melatonina natural. | Proslepp funciona? | Estudos sugerem que a cereja pode auxiliar no sono. A resposta é individual. | Proslepp ou melatonina sintética? | Proslepp = fonte natural. Melatonina sintética = dose exata e controlada. | Proslepp tem açúcar? | O extrato é concentrado. Verifique a fórmula com o farmacêutico.`,
    seoDescription: 'Proslepp 130 mg — melatonina natural da cereja. Para indução do sono. 60 cápsulas. Me Joy.',
  },
  'MEJOY-0160': {
    hero_benefit: 'Relora 250 mg: magnolia + phellodendron para quem não consegue desligar por causa do cortisol e do estresse.',
    shortBenefit: 'Relora para estresse noturno — quando a mente não para e o cortisol atrapalha o sono.',
    description_md: `## O que é ${NL} ${NL} Relora é a combinação de magnolia e phellodendron. Estudos sugerem que pode auxiliar na modulação do cortisol e no relaxamento. Ideal para quem fica "ligado" à noite por estresse, trabalho ou ansiedade. ${NL} ${NL} ## Para quem pode fazer sentido ${NL} ${NL} Quem tem dificuldade para desligar, quem acorda à noite com a mente acelerada ou quem sente que o estresse atrapalha o sono. Diferente de sedativos — atua mais na causa (cortisol/estresse). ${NL} ${NL} ## Diferenciais da fórmula ${NL} ${NL} - Relora 250 mg — dose padrão ${NL} - 60 cápsulas ${NL} - Magnolia + phellodendron ${NL} - Foco em estresse e cortisol ${NL} ${NL} ## Como usar ${NL} ${NL} Conforme orientação. À noite ou no fim da tarde. Apresentação: 60 cápsulas. ${NL} ${NL} ## Cuidados ${NL} ${NL} Gestantes, lactantes e crianças devem consultar médico. Não é sedativo imediato — pode levar alguns dias para efeito. Este produto não substitui uma alimentação equilibrada e hábitos saudáveis.`,
    faq: `Relora ajuda a dormir? | Pode auxiliar ao reduzir estresse e cortisol. O efeito é gradual. | Relora 250 ou 500? | Comece com 250 mg. 500 mg para quem precisa de mais suporte. | Relora é natural? | Sim. É combinação de extratos de plantas. | Relora e melatonina juntos? | Podem ser complementares. Consulte profissional.`,
    seoDescription: 'Relora 250 mg para estresse e sono. Magnolia + phellodendron. 60 cápsulas. Fórmula manipulada. Me Joy.',
  },
  'MEJOY-0161': {
    hero_benefit: 'Relora 500 mg: dose concentrada para quando o estresse é intenso e 250 mg não basta.',
    shortBenefit: 'Relora em dose dupla — para noites em que o cortisol teima em não baixar.',
    description_md: `## O que é ${NL} ${NL} Relora 500 mg oferece o dobro da dose da versão 250 mg. Para quem já usa Relora e sente que precisa de mais suporte, ou para quem tem estresse/cortisol alto e quer começar com dose mais forte (com orientação). ${NL} ${NL} ## Para quem pode fazer sentido ${NL} ${NL} Quem já experimentou 250 mg e quer intensificar, ou quem tem rotina muito estressante e busca dose concentrada desde o início. ${NL} ${NL} ## Diferenciais da fórmula ${NL} ${NL} - Relora 500 mg — dose concentrada ${NL} - 30 cápsulas ${NL} - Para estresse mais intenso ${NL} - Mesma combinação magnolia + phellodendron ${NL} ${NL} ## Como usar ${NL} ${NL} Conforme orientação. À noite. Apresentação: 30 cápsulas. ${NL} ${NL} ## Cuidados ${NL} ${NL} Gestantes, lactantes e crianças devem consultar médico. Iniciantes podem preferir 250 mg. Este produto não substitui uma alimentação equilibrada e hábitos saudáveis.`,
    faq: `Relora 500 mg é forte? | Sim. É o dobro da dose padrão. | Para quem é Relora 500? | Quem já usa 250 e precisa de mais, ou quem tem estresse intenso. | Relora 500 mg causa sonolência de dia? | Em geral não. Mas a resposta é individual. | Quantas cápsulas por noite? | Conforme orientação. Geralmente 1.`,
    seoDescription: 'Relora 500 mg para estresse e sono. Dose concentrada. 30 cápsulas. Fórmula manipulada. Me Joy.',
  },
  'MEJOY-0162': {
    hero_benefit: 'Valeriana 100 mg: a planta mais estudada para indução do sono, com séculos de uso e evidência moderada.',
    shortBenefit: 'Valeriana — fitoterápico com boa base científica para quem quer induzir o sono de forma natural.',
    description_md: `## O que é ${NL} ${NL} Valeriana é uma das plantas mais pesquisadas para sono. Metanálises sugerem que pode auxiliar na indução e na qualidade do sono. Usada há séculos na Europa, tem tradição longa e evidência científica moderada. ${NL} ${NL} ## Para quem pode fazer sentido ${NL} ${NL} Quem busca fitoterápico com boa base de estudos, quem quer algo mais sedativo que passiflora (mas natural) ou quem prefere plantas a melatonina sintética. ${NL} ${NL} ## Diferenciais da fórmula ${NL} ${NL} - Valeriana 100 mg ${NL} - 60 cápsulas ${NL} - Evidência científica moderada ${NL} - Mais sedativa que passiflora; mais suave que alguns sintéticos ${NL} ${NL} ## Como usar ${NL} ${NL} Conforme orientação. À noite, 30–60 min antes de dormir. Apresentação: 60 cápsulas. ${NL} ${NL} ## Cuidados ${NL} ${NL} Gestantes e lactantes devem evitar. Crianças somente com orientação médica. Não dirigir após o uso. Este produto não substitui uma alimentação equilibrada e hábitos saudáveis.`,
    faq: `Valeriana induz sono? | Estudos sugerem que pode auxiliar na indução e na qualidade. A resposta varia. | Valeriana ou melatonina? | Valeriana = fitoterápico sedativo. Melatonina = hormônio do ciclo. Mecanismos diferentes. | Valeriana dá efeito colateral? | Em geral é bem tolerada. Algumas pessoas relatam sonolência ao acordar. | Valeriana ou passiflora? | Valeriana é mais sedativa. Passiflora é mais suave.`,
    seoDescription: 'Valeriana 100 mg para indução do sono. Planta com evidência científica. 60 cápsulas. Me Joy.',
  },
};

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

function parseCSV(content: string): { headers: string[]; rows: Record<string, string>[] } {
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

function escapeCSV(val: string): string {
  const v = (val || '').replace(/\r?\n/g, NL).replace(/"/g, '""');
  if (v.includes(',') || v.includes('"')) return `"${v}"`;
  return v;
}

function main() {
  if (!fs.existsSync(V2_PATH)) {
    console.error('❌ copy-blueprint-v2.csv não encontrado');
    process.exit(1);
  }

  const content = fs.readFileSync(V2_PATH, 'utf-8');
  const { headers, rows } = parseCSV(content);
  let updated = 0;

  for (const row of rows) {
    const sku = row.sku?.trim();
    const premium = sku ? PREMIUM_SONO[sku] : null;
    if (!premium) continue;

    row.hero_benefit = premium.hero_benefit;
    row.shortBenefit = premium.shortBenefit;
    row.description_md = premium.description_md;
    row.faq = premium.faq;
    row.seoDescription = premium.seoDescription;
    updated++;
  }

  const csvLines = [headers.join(',')];
  for (const row of rows) {
    csvLines.push(headers.map((h) => escapeCSV(row[h] ?? '')).join(','));
  }
  fs.writeFileSync(V2_PATH, csvLines.join('\n'), 'utf-8');

  console.log('✅ Copy v2 premium aplicado');
  console.log(`   Produtos enriquecidos: ${updated} (Sono)`);
  console.log(`   Campos: hero_benefit, shortBenefit, description_md, faq, seoDescription`);
}

main();
