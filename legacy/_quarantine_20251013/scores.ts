// src/utils/scores.ts
// Sistema de scores inteligentes baseado em evidências clínicas

export interface ScoreFactors {
  formData: Record<string, any>;
  idade?: number | null;
  sexo?: string | null;
  imc?: number | null;
}

export function calcHealthScores({ formData, idade, sexo, imc }: ScoreFactors): { atual: number; potencial: number } {
  let score = 70; // Base neutra

  // === FATORES NEGATIVOS (Red Flags) ===
  
  // Red flags críticas
  if (formData.queixas?.includes('sangue_fezes')) score -= 20;
  if (formData.perda_peso === 'sim' || formData.perda_peso_6m === 'sim') score -= 15;
  if (formData.febre === 'sim') score -= 10;
  if (formData.diarreia_noturna === 'sim') score -= 10;
  
  // Sintomas gastrointestinais
  if (formData.queixas?.includes('dor_abdominal') && formData.dor_nivel > 7) score -= 8;
  if (formData.queixas?.includes('nausea_vomito')) score -= 5;
  if (formData.queixas?.includes('fadiga_febre')) score -= 5;
  
  // Padrão de fezes (Bristol)
  if (formData.bristol === '1' || formData.bristol === '2') score -= 5; // Constipação
  if (formData.bristol === '6' || formData.bristol === '7') score -= 5; // Diarreia
  
  // Frequência evacuatória
  if (formData.freq_evacuacao === '<3_semana') score -= 5;
  if (formData.freq_evacuacao === '>=3_dia') score -= 3;
  
  // Sensibilidades alimentares
  if (formData.sens_gluten === 'sim') score -= 3;
  if (formData.sens_lactose === 'sim') score -= 3;
  
  // === FATORES DE ESTILO DE VIDA NEGATIVOS ===
  
  // Hidratação inadequada
  if (formData.agua === '<1l') score -= 5;
  
  // Baixa ingestão de fibras
  if (formData.fibras === 'baixa') score -= 5;
  
  // Alto consumo de ultraprocessados
  if (formData.ultraprocessados === 'alto') score -= 5;
  
  // Sedentarismo
  if (formData.atividade === 'sedentario') score -= 8;
  
  // Sono ruim
  if (formData.sono === 'ruim') score -= 5;
  
  // Alto estresse
  if (formData.estresse > 7) score -= 5;
  
  // Consumo excessivo de álcool
  if (formData.alcool === '>7') score -= 5;
  
  // Consumo excessivo de cafeína
  if (formData.cafeina === '>3') score -= 3;
  
  // === FATORES POSITIVOS ===
  
  // Hidratação adequada
  if (formData.agua === '>2l') score += 5;
  
  // Alta ingestão de fibras
  if (formData.fibras === 'alta') score += 5;
  
  // Baixo consumo de ultraprocessados
  if (formData.ultraprocessados === 'raro') score += 5;
  
  // Atividade física regular
  if (formData.atividade === 'moderado') score += 8;
  if (formData.atividade === 'intenso') score += 10;
  
  // Sono de qualidade
  if (formData.sono === 'boa') score += 5;
  
  // Baixo estresse
  if (formData.estresse < 4) score += 5;
  
  // Consumo moderado de álcool
  if (formData.alcool === '1-7') score += 2;
  
  // === AJUSTES POR PERFIL DEMOGRÁFICO ===
  
  // Idade
  if (idade && idade > 60) score -= 5; // Maior risco com idade
  if (idade && idade < 30) score += 3; // Menor risco em jovens
  
  // IMC
  if (imc && imc > 30) score -= 5; // Obesidade
  if (imc && imc < 18.5) score -= 3; // Baixo peso
  if (imc && imc >= 18.5 && imc <= 25) score += 3; // Peso ideal
  
  // === AJUSTES POR SEXO ===
  
  // Mulheres: considerar fatores hormonais
  if (sexo === 'Feminino' && formData.gravidez === 'sim') score -= 3; // Gravidez pode afetar digestão
  
  // === IMPACTO NA QUALIDADE DE VIDA ===
  
  if (formData.impacto > 7) score -= 5; // Alto impacto na vida
  
  // === CLAMP FINAL ===
  
  const scoreAtual = Math.max(30, Math.min(95, score));
  
  // Score potencial (com intervenção adequada)
  const potencial = Math.min(95, scoreAtual + 12); // Melhoria esperada com conduta adequada
  
  return {
    atual: Math.round(scoreAtual),
    potencial: Math.round(potencial)
  };
}

export function getScoreInterpretation(score: number): { nivel: string; cor: string; descricao: string } {
  if (score >= 85) {
    return {
      nivel: "Excelente",
      cor: "green",
      descricao: "Sua saúde gastrointestinal está em excelente estado!"
    };
  } else if (score >= 75) {
    return {
      nivel: "Boa",
      cor: "blue",
      descricao: "Sua saúde gastrointestinal está boa, com pequenos ajustes pode melhorar ainda mais."
    };
  } else if (score >= 65) {
    return {
      nivel: "Regular",
      cor: "yellow",
      descricao: "Há alguns pontos de atenção que merecem cuidado e acompanhamento."
    };
  } else if (score >= 50) {
    return {
      nivel: "Atenção",
      cor: "orange",
      descricao: "É importante buscar orientação médica e fazer mudanças no estilo de vida."
    };
  } else {
    return {
      nivel: "Crítico",
      cor: "red",
      descricao: "Procure atendimento médico imediatamente para avaliação completa."
    };
  }
}

export function getRedFlags(formData: Record<string, any>): string[] {
  const redFlags: string[] = [];
  
  if (formData.queixas?.includes('sangue_fezes')) {
    redFlags.push("Sangue nas fezes - requer avaliação médica urgente");
  }
  
  if (formData.perda_peso === 'sim' || formData.perda_peso_6m === 'sim') {
    redFlags.push("Perda de peso não intencional - pode indicar problema sério");
  }
  
  if (formData.febre === 'sim') {
    redFlags.push("Febre recorrente - pode indicar processo inflamatório");
  }
  
  if (formData.diarreia_noturna === 'sim') {
    redFlags.push("Diarreia noturna - pode indicar doença inflamatória intestinal");
  }
  
  if (formData.queixas?.includes('dor_abdominal') && formData.dor_nivel > 8) {
    redFlags.push("Dor abdominal intensa - requer avaliação médica");
  }
  
  return redFlags;
}

// Sistema de red flags universal por tipo de triagem
export function getRedFlagsByType(tipo: string, formData: Record<string, any>): string[] {
  const redFlags: string[] = [];
  
  switch (tipo) {
    case 'gastro':
      if (formData.queixas?.includes('sangue_fezes')) {
        redFlags.push("🚨 Sangue nas fezes - procure atendimento médico urgente");
      }
      if (formData.perda_peso === 'sim' || formData.perda_peso_6m === 'sim') {
        redFlags.push("⚠️ Perda de peso não intencional - pode indicar problema sério");
      }
      if (formData.febre === 'sim') {
        redFlags.push("🌡️ Febre persistente - pode indicar processo inflamatório");
      }
      if (formData.diarreia_noturna === 'sim') {
        redFlags.push("🌙 Diarreia noturna - pode indicar doença inflamatória intestinal");
      }
      if (formData.queixas?.includes('dor_abdominal') && formData.dor_nivel > 8) {
        redFlags.push("💢 Dor abdominal intensa - requer avaliação médica");
      }
      break;
      
    case 'depressao':
      if (formData.ideacao_suicida === 'sim') {
        redFlags.push("🚨 Ideação suicida - procure ajuda imediata: CVV 188");
      }
      if (formData.tentativa_suicida === 'sim') {
        redFlags.push("🚨 Histórico de tentativa de suicídio - acompanhamento especializado urgente");
      }
      if (formData.planos_suicidas === 'sim') {
        redFlags.push("🚨 Planos suicidas - procure ajuda imediata: CVV 188");
      }
      break;
      
    case 'gestante':
      if (formData.sangramento === 'sim') {
        redFlags.push("🚨 Sangramento vaginal - procure atendimento obstétrico urgente");
      }
      if (formData.dor_abdominal_intensa === 'sim') {
        redFlags.push("💢 Dor abdominal intensa - pode indicar complicação obstétrica");
      }
      if (formData.movimentos_fetais_reduzidos === 'sim') {
        redFlags.push("👶 Movimentos fetais reduzidos - procure atendimento obstétrico");
      }
      if (formData.contracoes_prematuras === 'sim') {
        redFlags.push("⏰ Contrações prematuras - procure atendimento obstétrico");
      }
      break;
      
    case 'cancer':
      if (formData.perda_peso_nao_intencional === 'sim') {
        redFlags.push("⚠️ Perda de peso não intencional - pode indicar neoplasia");
      }
      if (formData.sangramento_inexplicado === 'sim') {
        redFlags.push("🩸 Sangramento inexplicado - requer investigação médica");
      }
      if (formData.massa_palpavel === 'sim') {
        redFlags.push("🔍 Massa palpável - requer avaliação médica urgente");
      }
      if (formData.alteracao_pele === 'sim') {
        redFlags.push("🦠 Alteração na pele - pode indicar câncer de pele");
      }
      break;
      
    case 'mental':
      if (formData.ideacao_suicida === 'sim') {
        redFlags.push("🚨 Ideação suicida - procure ajuda imediata: CVV 188");
      }
      if (formData.alucinacoes === 'sim') {
        redFlags.push("👁️ Alucinações - requer avaliação psiquiátrica urgente");
      }
      if (formData.delirios === 'sim') {
        redFlags.push("🧠 Delírios - requer avaliação psiquiátrica urgente");
      }
      break;
      
    case 'sono':
      if (formData.apneia_suspeita === 'sim') {
        redFlags.push("😴 Suspeita de apneia do sono - procure avaliação médica");
      }
      if (formData.paralisia_sono === 'sim') {
        redFlags.push("🛌 Paralisia do sono - pode indicar distúrbio do sono");
      }
      break;
      
    case 'enxaqueca':
      if (formData.cefaleia_trovoada === 'sim') {
        redFlags.push("⚡ Cefaleia em trovoada - pode indicar hemorragia cerebral");
      }
      if (formData.alteracao_visao === 'sim') {
        redFlags.push("👁️ Alteração visual - pode indicar complicação neurológica");
      }
      break;
      
    case 'obesidade':
      if (formData.imc > 40) {
        redFlags.push("⚠️ Obesidade mórbida - requer acompanhamento médico especializado");
      }
      if (formData.diabetes_suspeita === 'sim') {
        redFlags.push("🍯 Suspeita de diabetes - procure avaliação médica");
      }
      if (formData.hipertensao_suspeita === 'sim') {
        redFlags.push("🩸 Suspeita de hipertensão - procure avaliação médica");
      }
      break;
      
    case 'tabagismo':
      if (formData.tosse_sangue === 'sim') {
        redFlags.push("🩸 Tosse com sangue - pode indicar câncer de pulmão");
      }
      if (formData.dificuldade_respirar === 'sim') {
        redFlags.push("🫁 Dificuldade para respirar - pode indicar DPOC");
      }
      break;
      
    case 'quimica':
      if (formData.overdose_historia === 'sim') {
        redFlags.push("💊 Histórico de overdose - risco de recaída");
      }
      if (formData.sintomas_abstinencia === 'sim') {
        redFlags.push("🔄 Sintomas de abstinência - requer acompanhamento médico");
      }
      break;
      
    case 'saudeMasculina':
      if (formData.sangue_urina === 'sim') {
        redFlags.push("🩸 Sangue na urina - pode indicar problema urológico");
      }
      if (formData.massa_testicular === 'sim') {
        redFlags.push("🔍 Massa testicular - pode indicar câncer de testículo");
      }
      break;
      
    case 'estresseBurnout':
      if (formData.ideacao_suicida === 'sim') {
        redFlags.push("🚨 Ideação suicida - procure ajuda imediata: CVV 188");
      }
      if (formData.incapacidade_trabalhar === 'sim') {
        redFlags.push("💼 Incapacidade de trabalhar - requer afastamento médico");
      }
      break;
      
    case 'jogosAzar':
      if (formData.perda_controle_total === 'sim') {
        redFlags.push("🎰 Perda total de controle - procure ajuda especializada");
      }
      if (formData.tentativa_suicida_jogos === 'sim') {
        redFlags.push("🚨 Ideação suicida relacionada aos jogos - procure ajuda: CVV 188");
      }
      break;
      
    case 'tdah':
      if (formData.impulsividade_extrema === 'sim') {
        redFlags.push("⚡ Impulsividade extrema - pode indicar TDAH grave");
      }
      if (formData.agressividade === 'sim') {
        redFlags.push("👊 Agressividade - pode indicar comorbidade");
      }
      break;
      
    default:
      // Red flags gerais
      if (formData.ideacao_suicida === 'sim') {
        redFlags.push("🚨 Ideação suicida - procure ajuda imediata: CVV 188");
      }
      if (formData.perda_peso_nao_intencional === 'sim') {
        redFlags.push("⚠️ Perda de peso não intencional - pode indicar problema sério");
      }
      if (formData.febre_persistente === 'sim') {
        redFlags.push("🌡️ Febre persistente - pode indicar processo inflamatório");
      }
  }
  
  return redFlags;
}
