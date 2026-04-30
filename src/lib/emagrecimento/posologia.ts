/**
 * Protocolo de Posologia - Tirzepatida
 * 
 * Este módulo implementa a lógica de cálculo de posologia baseada no protocolo
 * clínico interno Me Joy para tirzepatida 40mg e 60mg em pó.
 * 
 * IMPORTANTE: Esta é uma função auxiliar que calcula posologia SUGERIDA.
 * A prescrição final sempre deve ser validada por um médico endocrinologista.
 */

export interface PosologiaTirzepatida {
  apresentacao: '40mg' | '60mg';
  concentracaoMgMl: number; // Sempre 20mg/mL após diluição padrão
  doseInicialMg: number;
  volumeInicialMl: number;
  titulacao: {
    semana: number;
    doseMg: number;
    volumeMl: number;
    fase: string;
  }[];
  duracaoEstimadaSemanas: number;
  orientacoesDilucao: string;
  resultadosEsperados: {
    tresMeses: string;
    seisMeses: string;
  };
}

/**
 * Calcula posologia sugerida para tirzepatida baseada no perfil do paciente
 */
export function calcularPosologiaTirzepatida(
  imc: number,
  comorbidades: string[],
  idade?: number,
  preferenciaApresentacao?: '40mg' | '60mg'
): PosologiaTirzepatida {
  // Determinar apresentação baseada em IMC e comorbidades
  const temMultiplasComorbidades = comorbidades.length >= 2;
  const imcAlto = imc >= 35;
  
  // Selecionar apresentação
  let apresentacao: '40mg' | '60mg';
  if (preferenciaApresentacao) {
    apresentacao = preferenciaApresentacao;
  } else if (imcAlto || temMultiplasComorbidades) {
    // IMC ≥35 ou múltiplas comorbidades → 60mg (maior volume disponível)
    apresentacao = '60mg';
  } else {
    // IMC 30-35 com poucas comorbidades → 40mg
    apresentacao = '40mg';
  }
  
  // Configuração de diluição
  const concentracaoMgMl = 20; // Sempre 20mg/mL após diluição padrão
  
  // Esquema de titulação padrão (6 meses = 24 semanas)
  const titulacao = [
    { semana: 1, doseMg: 2.5, volumeMl: 0.125, fase: 'Início' },
    { semana: 2, doseMg: 2.5, volumeMl: 0.125, fase: 'Início' },
    { semana: 3, doseMg: 2.5, volumeMl: 0.125, fase: 'Início' },
    { semana: 4, doseMg: 2.5, volumeMl: 0.125, fase: 'Início' },
    { semana: 5, doseMg: 5.0, volumeMl: 0.25, fase: 'Titulação' },
    { semana: 6, doseMg: 5.0, volumeMl: 0.25, fase: 'Titulação' },
    { semana: 7, doseMg: 5.0, volumeMl: 0.25, fase: 'Titulação' },
    { semana: 8, doseMg: 5.0, volumeMl: 0.25, fase: 'Titulação' },
    { semana: 9, doseMg: 7.5, volumeMl: 0.375, fase: 'Manutenção Inicial' },
    { semana: 10, doseMg: 7.5, volumeMl: 0.375, fase: 'Manutenção Inicial' },
    { semana: 11, doseMg: 7.5, volumeMl: 0.375, fase: 'Manutenção Inicial' },
    { semana: 12, doseMg: 7.5, volumeMl: 0.375, fase: 'Manutenção Inicial' },
    { semana: 13, doseMg: 10.0, volumeMl: 0.5, fase: 'Manutenção' },
    { semana: 14, doseMg: 10.0, volumeMl: 0.5, fase: 'Manutenção' },
    { semana: 15, doseMg: 10.0, volumeMl: 0.5, fase: 'Manutenção' },
    { semana: 16, doseMg: 10.0, volumeMl: 0.5, fase: 'Manutenção' },
    { semana: 17, doseMg: 10.0, volumeMl: 0.5, fase: 'Manutenção' },
    { semana: 18, doseMg: 10.0, volumeMl: 0.5, fase: 'Manutenção' },
    { semana: 19, doseMg: 10.0, volumeMl: 0.5, fase: 'Manutenção' },
    { semana: 20, doseMg: 10.0, volumeMl: 0.5, fase: 'Manutenção' },
    { semana: 21, doseMg: 10.0, volumeMl: 0.5, fase: 'Manutenção' },
    { semana: 22, doseMg: 10.0, volumeMl: 0.5, fase: 'Manutenção' },
    { semana: 23, doseMg: 10.0, volumeMl: 0.5, fase: 'Manutenção' },
    { semana: 24, doseMg: 10.0, volumeMl: 0.5, fase: 'Manutenção' },
  ];
  
  // Ajustar para idosos (titulação mais lenta)
  if (idade && idade >= 65) {
    // Manter cada fase por 6 semanas ao invés de 4
    const titulacaoIdoso = [
      { semana: 1, doseMg: 2.5, volumeMl: 0.125, fase: 'Início' },
      { semana: 2, doseMg: 2.5, volumeMl: 0.125, fase: 'Início' },
      { semana: 3, doseMg: 2.5, volumeMl: 0.125, fase: 'Início' },
      { semana: 4, doseMg: 2.5, volumeMl: 0.125, fase: 'Início' },
      { semana: 5, doseMg: 2.5, volumeMl: 0.125, fase: 'Início' },
      { semana: 6, doseMg: 2.5, volumeMl: 0.125, fase: 'Início' },
      { semana: 7, doseMg: 5.0, volumeMl: 0.25, fase: 'Titulação' },
      { semana: 8, doseMg: 5.0, volumeMl: 0.25, fase: 'Titulação' },
      { semana: 9, doseMg: 5.0, volumeMl: 0.25, fase: 'Titulação' },
      { semana: 10, doseMg: 5.0, volumeMl: 0.25, fase: 'Titulação' },
      { semana: 11, doseMg: 5.0, volumeMl: 0.25, fase: 'Titulação' },
      { semana: 12, doseMg: 5.0, volumeMl: 0.25, fase: 'Titulação' },
      { semana: 13, doseMg: 7.5, volumeMl: 0.375, fase: 'Manutenção Inicial' },
      { semana: 14, doseMg: 7.5, volumeMl: 0.375, fase: 'Manutenção Inicial' },
      { semana: 15, doseMg: 7.5, volumeMl: 0.375, fase: 'Manutenção Inicial' },
      { semana: 16, doseMg: 7.5, volumeMl: 0.375, fase: 'Manutenção Inicial' },
      { semana: 17, doseMg: 7.5, volumeMl: 0.375, fase: 'Manutenção Inicial' },
      { semana: 18, doseMg: 7.5, volumeMl: 0.375, fase: 'Manutenção Inicial' },
      { semana: 19, doseMg: 10.0, volumeMl: 0.5, fase: 'Manutenção' },
      { semana: 20, doseMg: 10.0, volumeMl: 0.5, fase: 'Manutenção' },
      { semana: 21, doseMg: 10.0, volumeMl: 0.5, fase: 'Manutenção' },
      { semana: 22, doseMg: 10.0, volumeMl: 0.5, fase: 'Manutenção' },
      { semana: 23, doseMg: 10.0, volumeMl: 0.5, fase: 'Manutenção' },
      { semana: 24, doseMg: 10.0, volumeMl: 0.5, fase: 'Manutenção' },
    ];
    return {
      apresentacao,
      concentracaoMgMl,
      doseInicialMg: 2.5,
      volumeInicialMl: 0.125,
      titulacao: titulacaoIdoso,
      duracaoEstimadaSemanas: 24,
      orientacoesDilucao: apresentacao === '40mg' 
        ? 'Diluir 40mg em 2mL de água destilada. Agitar suavemente até completa dissolução.'
        : 'Diluir 60mg em 3mL de água destilada. Agitar suavemente até completa dissolução.',
      resultadosEsperados: {
        tresMeses: '5-8% do peso inicial (titulação mais lenta em idosos)',
        seisMeses: '10-12% do peso inicial'
      }
    };
  }
  
  // Orientação de diluição
  const orientacoesDilucao = apresentacao === '40mg'
    ? 'Diluir 40mg em 2mL de água destilada. Agitar suavemente até completa dissolução. Aguardar 5 minutos antes de usar.'
    : 'Diluir 60mg em 3mL de água destilada. Agitar suavemente até completa dissolução. Aguardar 5 minutos antes de usar.';
  
  // Resultados esperados baseados em IMC e comorbidades
  const temDiabetes = comorbidades.includes('diabetes_tipo_2');
  const resultadosEsperados = {
    tresMeses: imcAlto || temDiabetes 
      ? '5-10% do peso inicial'
      : '6-10% do peso inicial',
    seisMeses: imcAlto || temDiabetes
      ? '12-15% do peso inicial'
      : '10-15% do peso inicial'
  };
  
  return {
    apresentacao,
    concentracaoMgMl,
    doseInicialMg: 2.5,
    volumeInicialMl: 0.125,
    titulacao,
    duracaoEstimadaSemanas: 24,
    orientacoesDilucao,
    resultadosEsperados
  };
}

/**
 * Formata posologia em texto legível para o relatório
 */
export function formatarPosologiaTexto(posologia: PosologiaTirzepatida): string {
  const { apresentacao, doseInicialMg, volumeInicialMl, titulacao, duracaoEstimadaSemanas, orientacoesDilucao } = posologia;
  
  const semanas = duracaoEstimadaSemanas;
  const meses = Math.floor(semanas / 4);
  
  let texto = `**Apresentação:** Tirzepatida ${apresentacao} em pó\n\n`;
  texto += `**Dose inicial:** ${doseInicialMg}mg semanalmente (${volumeInicialMl}mL após diluição)\n\n`;
  texto += `**Esquema de titulação:**\n`;
  texto += `- Semanas 1-4: ${titulacao[0].doseMg}mg semanalmente (${titulacao[0].volumeMl}mL)\n`;
  texto += `- Semanas 5-8: ${titulacao[4].doseMg}mg semanalmente (${titulacao[4].volumeMl}mL)\n`;
  texto += `- Semanas 9-12: ${titulacao[8].doseMg}mg semanalmente (${titulacao[8].volumeMl}mL)\n`;
  texto += `- Semanas 13-24: ${titulacao[12].doseMg}mg semanalmente (${titulacao[12].volumeMl}mL)\n\n`;
  texto += `**Duração do tratamento:** ${meses} meses (${semanas} semanas)\n\n`;
  texto += `**Preparo:** ${orientacoesDilucao}\n\n`;
  texto += `**Aplicação:** Subcutânea, 1x por semana, sempre no mesmo dia da semana. Rotacionar locais de aplicação (abdome, coxa ou braço).\n\n`;
  
  return texto;
}

