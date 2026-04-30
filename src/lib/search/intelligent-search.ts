// src/lib/search/intelligent-search.ts
// Sistema de busca inteligente para triagens

export interface SearchResult {
  triagem: any;
  score: number;
  matchType: 'exact' | 'partial' | 'synonym' | 'tag' | 'category';
  matchedField: string;
}

// Dicionário de sinônimos e palavras-chave relacionadas
export const SEARCH_SYNONYMS: Record<string, string[]> = {
  // Tabagismo
  'cigarro': ['tabagismo', 'fumar', 'fumo', 'nicotina', 'parar de fumar', 'cessação'],
  'fumar': ['tabagismo', 'cigarro', 'fumo', 'nicotina', 'parar de fumar', 'cessação'],
  'tabagismo': ['cigarro', 'fumar', 'fumo', 'nicotina', 'parar de fumar', 'cessação'],
  'fumo': ['tabagismo', 'cigarro', 'fumar', 'nicotina', 'parar de fumar', 'cessação'],
  'nicotina': ['tabagismo', 'cigarro', 'fumar', 'fumo', 'parar de fumar', 'cessação'],
  'parar de fumar': ['tabagismo', 'cigarro', 'fumar', 'fumo', 'nicotina', 'cessação'],
  'cessação': ['tabagismo', 'cigarro', 'fumar', 'fumo', 'nicotina', 'parar de fumar'],

  // Cardiovascular
  'coração': ['cardiovascular', 'cardíaco', 'pressão', 'pressão arterial', 'hipertensão', 'palpitação'],
  'cardiovascular': ['coração', 'cardíaco', 'pressão', 'pressão arterial', 'hipertensão', 'palpitação'],
  'pressão': ['cardiovascular', 'coração', 'cardíaco', 'pressão arterial', 'hipertensão'],
  'hipertensão': ['cardiovascular', 'coração', 'cardíaco', 'pressão', 'pressão arterial'],
  'palpitação': ['cardiovascular', 'coração', 'cardíaco', 'arritmia'],

  // Diabetes
  'diabetes': ['glicemia', 'açúcar', 'insulina', 'metabolismo', 'pré-diabetes'],
  'glicemia': ['diabetes', 'açúcar', 'insulina', 'metabolismo', 'pré-diabetes'],
  'açúcar': ['diabetes', 'glicemia', 'insulina', 'metabolismo', 'pré-diabetes'],
  'insulina': ['diabetes', 'glicemia', 'açúcar', 'metabolismo', 'pré-diabetes'],
  'metabolismo': ['diabetes', 'glicemia', 'açúcar', 'insulina', 'pré-diabetes'],

  // Dor
  'dor': ['dor crônica', 'fibromialgia', 'coluna', 'lombalgia', 'cervicalgia', 'dor nas costas'],
  'dor crônica': ['dor', 'fibromialgia', 'coluna', 'lombalgia', 'cervicalgia', 'dor nas costas'],
  'fibromialgia': ['dor', 'dor crônica', 'coluna', 'lombalgia', 'cervicalgia', 'dor nas costas'],
  'coluna': ['dor', 'dor crônica', 'fibromialgia', 'lombalgia', 'cervicalgia', 'dor nas costas'],
  'lombalgia': ['dor', 'dor crônica', 'fibromialgia', 'coluna', 'cervicalgia', 'dor nas costas'],
  'dor nas costas': ['dor', 'dor crônica', 'fibromialgia', 'coluna', 'lombalgia', 'cervicalgia'],

  // Saúde Mental
  'ansiedade': ['mental', 'estresse', 'burnout', 'depressão', 'psicológico'],
  'depressão': ['mental', 'ansiedade', 'estresse', 'burnout', 'psicológico'],
  'estresse': ['mental', 'ansiedade', 'depressão', 'burnout', 'psicológico'],
  'burnout': ['mental', 'ansiedade', 'depressão', 'estresse', 'psicológico'],
  'mental': ['ansiedade', 'depressão', 'estresse', 'burnout', 'psicológico'],

  // Sono
  'sono': ['insônia', 'dormir', 'sonolência', 'qualidade do sono', 'higiene do sono'],
  'insônia': ['sono', 'dormir', 'sonolência', 'qualidade do sono', 'higiene do sono'],
  'dormir': ['sono', 'insônia', 'sonolência', 'qualidade do sono', 'higiene do sono'],

  // Peso
  'peso': ['obesidade', 'emagrecer', 'perder peso', 'ganhar peso', 'metabolismo'],
  'obesidade': ['peso', 'emagrecer', 'perder peso', 'ganhar peso', 'metabolismo'],
  'emagrecer': ['peso', 'obesidade', 'perder peso', 'ganhar peso', 'metabolismo'],
  'perder peso': ['peso', 'obesidade', 'emagrecer', 'ganhar peso', 'metabolismo'],

  // Mulher
  'mulher': ['feminino', 'ginecologia', 'menopausa', 'sop', 'endometriose', 'menstruação'],
  'feminino': ['mulher', 'ginecologia', 'menopausa', 'sop', 'endometriose', 'menstruação'],
  'ginecologia': ['mulher', 'feminino', 'menopausa', 'sop', 'endometriose', 'menstruação'],
  'menopausa': ['mulher', 'feminino', 'ginecologia', 'sop', 'endometriose', 'menstruação'],
  'sop': ['mulher', 'feminino', 'ginecologia', 'menopausa', 'endometriose', 'menstruação'],

  // Homem
  'homem': ['masculino', 'urologia', 'próstata', 'testosterona', 'andropausa'],
  'masculino': ['homem', 'urologia', 'próstata', 'testosterona', 'andropausa'],
  'urologia': ['homem', 'masculino', 'próstata', 'testosterona', 'andropausa'],
  'próstata': ['homem', 'masculino', 'urologia', 'testosterona', 'andropausa'],

  // Criança
  'criança': ['pediatria', 'infantil', 'bebê', 'adolescente', 'desenvolvimento'],
  'pediatria': ['criança', 'infantil', 'bebê', 'adolescente', 'desenvolvimento'],
  'infantil': ['criança', 'pediatria', 'bebê', 'adolescente', 'desenvolvimento'],

  // Idoso
  'idoso': ['geriatria', 'terceira idade', 'idosos', 'envelhecimento', 'memória'],
  'geriatria': ['idoso', 'terceira idade', 'idosos', 'envelhecimento', 'memória'],
  'terceira idade': ['idoso', 'geriatria', 'idosos', 'envelhecimento', 'memória'],

  // Respiratória
  'respiração': ['respiratória', 'pulmão', 'asma', 'dpoc', 'tosse', 'falta de ar'],
  'respiratória': ['respiração', 'pulmão', 'asma', 'dpoc', 'tosse', 'falta de ar'],
  'pulmão': ['respiração', 'respiratória', 'asma', 'dpoc', 'tosse', 'falta de ar'],
  'asma': ['respiração', 'respiratória', 'pulmão', 'dpoc', 'tosse', 'falta de ar'],

  // Pele
  'pele': ['dermatologia', 'dermatológica', 'acne', 'eczema', 'psoríase', 'manchas'],
  'dermatologia': ['pele', 'dermatológica', 'acne', 'eczema', 'psoríase', 'manchas'],
  'acne': ['pele', 'dermatologia', 'dermatológica', 'eczema', 'psoríase', 'manchas'],

  // Olhos
  'olhos': ['ocular', 'oftalmologia', 'visão', 'glaucoma', 'catarata', 'miopia'],
  'ocular': ['olhos', 'oftalmologia', 'visão', 'glaucoma', 'catarata', 'miopia'],
  'oftalmologia': ['olhos', 'ocular', 'visão', 'glaucoma', 'catarata', 'miopia'],
  'visão': ['olhos', 'ocular', 'oftalmologia', 'glaucoma', 'catarata', 'miopia'],

  // Ouvidos
  'ouvidos': ['auditiva', 'otorrinolaringologia', 'audição', 'zumbido', 'labirintite'],
  'auditiva': ['ouvidos', 'otorrinolaringologia', 'audição', 'zumbido', 'labirintite'],
  'audição': ['ouvidos', 'auditiva', 'otorrinolaringologia', 'zumbido', 'labirintite'],
  'zumbido': ['ouvidos', 'auditiva', 'otorrinolaringologia', 'audição', 'labirintite'],

  // Boca
  'boca': ['bucal', 'odontologia', 'dentes', 'gengiva', 'bruxismo', 'cáries'],
  'bucal': ['boca', 'odontologia', 'dentes', 'gengiva', 'bruxismo', 'cáries'],
  'dentes': ['boca', 'bucal', 'odontologia', 'gengiva', 'bruxismo', 'cáries'],
  'gengiva': ['boca', 'bucal', 'odontologia', 'dentes', 'bruxismo', 'cáries'],

  // Rim
  'rim': ['renal', 'nefrologia', 'rins', 'pedras', 'função renal'],
  'renal': ['rim', 'nefrologia', 'rins', 'pedras', 'função renal'],
  'rins': ['rim', 'renal', 'nefrologia', 'pedras', 'função renal'],

  // Fígado
  'fígado': ['hepática', 'hepatologia', 'esteatose', 'hepatite', 'cirrose'],
  'hepática': ['fígado', 'hepatologia', 'esteatose', 'hepatite', 'cirrose'],
  'esteatose': ['fígado', 'hepática', 'hepatologia', 'hepatite', 'cirrose'],

  // Tireoide
  'tireoide': ['tireoidiana', 'hipotireoidismo', 'hipertireoidismo', 'hormônio'],
  'tireoidiana': ['tireoide', 'hipotireoidismo', 'hipertireoidismo', 'hormônio'],

  // Mama
  'mama': ['mamária', 'mastologia', 'mamas', 'nódulos', 'câncer de mama'],
  'mamária': ['mama', 'mastologia', 'mamas', 'nódulos', 'câncer de mama'],
  'mamas': ['mama', 'mamária', 'mastologia', 'nódulos', 'câncer de mama'],

  // Sexual
  'sexual': ['sexo', 'libido', 'disfunção erétil', 'intimidade'],
  'sexo': ['sexual', 'libido', 'disfunção erétil', 'intimidade'],
  'libido': ['sexual', 'sexo', 'disfunção erétil', 'intimidade'],

  // Alergia
  'alergia': ['alérgica', 'alergias', 'rinite', 'intolerância', 'alérgico'],
  'alérgica': ['alergia', 'alergias', 'rinite', 'intolerância', 'alérgico'],
  'rinite': ['alergia', 'alérgica', 'alergias', 'intolerância', 'alérgico'],

  // Trabalho
  'trabalho': ['trabalhador', 'ocupacional', 'ler', 'dort', 'ergonomia', 'burnout'],
  'trabalhador': ['trabalho', 'ocupacional', 'ler', 'dort', 'ergonomia', 'burnout'],
  'ler': ['trabalho', 'trabalhador', 'ocupacional', 'dort', 'ergonomia'],
  'dort': ['trabalho', 'trabalhador', 'ocupacional', 'ler', 'ergonomia'],

  // Longevidade
  'longevidade': ['anti-aging', 'envelhecimento', 'longa vida', 'vitalidade'],
  'anti-aging': ['longevidade', 'envelhecimento', 'longa vida', 'vitalidade'],
  'envelhecimento': ['longevidade', 'anti-aging', 'longa vida', 'vitalidade'],

  // Energia
  'energia': ['vitalidade', 'fadiga', 'cansaço', 'disposição'],
  'vitalidade': ['energia', 'fadiga', 'cansaço', 'disposição'],
  'fadiga': ['energia', 'vitalidade', 'cansaço', 'disposição'],

  // Intestino
  'intestino': ['intestinal', 'microbioma', 'digestão', 'sibo', 'permeabilidade'],
  'intestinal': ['intestino', 'microbioma', 'digestão', 'sibo', 'permeabilidade'],
  'microbioma': ['intestino', 'intestinal', 'digestão', 'sibo', 'permeabilidade'],
  'digestão': ['intestino', 'intestinal', 'microbioma', 'sibo', 'permeabilidade'],

  // Nutrição
  'nutrição': ['nutricional', 'vitaminas', 'minerais', 'micronutrientes', 'deficiência'],
  'nutricional': ['nutrição', 'vitaminas', 'minerais', 'micronutrientes', 'deficiência'],
  'vitaminas': ['nutrição', 'nutricional', 'minerais', 'micronutrientes', 'deficiência'],
  'minerais': ['nutrição', 'nutricional', 'vitaminas', 'micronutrientes', 'deficiência'],

  // Performance
  'performance': ['biohacking', 'otimização', 'alta performance', 'melhoria'],
  'biohacking': ['performance', 'otimização', 'alta performance', 'melhoria'],
  'otimização': ['performance', 'biohacking', 'alta performance', 'melhoria']
};

// Função para normalizar texto de busca
function normalizeSearchTerm(term: string): string {
  return term
    .toLowerCase()
    .trim()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove acentos
    .replace(/[^\w\s]/g, '') // Remove caracteres especiais
    .replace(/\s+/g, ' '); // Normaliza espaços
}

// Função para calcular score de relevância
function calculateScore(
  triagem: any, 
  searchTerm: string, 
  matchType: SearchResult['matchType'],
  matchedField: string
): number {
  let score = 0;
  
  // Scores baseados no tipo de match
  switch (matchType) {
    case 'exact':
      score = 100;
      break;
    case 'partial':
      score = 80;
      break;
    case 'synonym':
      score = 70;
      break;
    case 'tag':
      score = 60;
      break;
    case 'category':
      score = 50;
      break;
  }
  
  // Bonus por campo específico
  if (matchedField === 'titulo') score += 20;
  if (matchedField === 'subtitulo') score += 15;
  if (matchedField === 'tags') score += 10;
  if (matchedField === 'categoria') score += 5;
  
  // Bonus por triagem gratuita (prioridade)
  if (triagem.isFree) score += 10;
  
  // Bonus por rating alto
  if (triagem.rating && triagem.rating >= 4.5) score += 5;
  
  return score;
}

// Função principal de busca inteligente
export function intelligentSearch(triagens: any[], searchTerm: string): SearchResult[] {
  if (!searchTerm.trim()) {
    return triagens.map(triagem => ({
      triagem,
      score: 0,
      matchType: 'exact' as const,
      matchedField: 'all'
    }));
  }
  
  const normalizedSearchTerm = normalizeSearchTerm(searchTerm);
  const searchWords = normalizedSearchTerm.split(' ').filter(word => word.length > 0);
  const results: SearchResult[] = [];
  
  for (const triagem of triagens) {
    let bestScore = 0;
    let bestMatchType: SearchResult['matchType'] = 'exact';
    let bestMatchedField = '';
    
    // Busca exata no título
    const normalizedTitulo = normalizeSearchTerm(triagem.titulo);
    if (normalizedTitulo.includes(normalizedSearchTerm)) {
      const score = calculateScore(triagem, searchTerm, 'exact', 'titulo');
      if (score > bestScore) {
        bestScore = score;
        bestMatchType = 'exact';
        bestMatchedField = 'titulo';
      }
    }
    
    // Busca exata no subtítulo
    if (triagem.subtitulo) {
      const normalizedSubtitulo = normalizeSearchTerm(triagem.subtitulo);
      if (normalizedSubtitulo.includes(normalizedSearchTerm)) {
        const score = calculateScore(triagem, searchTerm, 'exact', 'subtitulo');
        if (score > bestScore) {
          bestScore = score;
          bestMatchType = 'exact';
          bestMatchedField = 'subtitulo';
        }
      }
    }
    
    // Busca exata no slug
    const normalizedSlug = normalizeSearchTerm(triagem.slug);
    if (normalizedSlug.includes(normalizedSearchTerm)) {
      const score = calculateScore(triagem, searchTerm, 'exact', 'slug');
      if (score > bestScore) {
        bestScore = score;
        bestMatchType = 'exact';
        bestMatchedField = 'slug';
      }
    }
    
    // Busca parcial (palavras individuais)
    for (const word of searchWords) {
      if (normalizedTitulo.includes(word)) {
        const score = calculateScore(triagem, searchTerm, 'partial', 'titulo');
        if (score > bestScore) {
          bestScore = score;
          bestMatchType = 'partial';
          bestMatchedField = 'titulo';
        }
      }
      
      if (triagem.subtitulo && normalizeSearchTerm(triagem.subtitulo).includes(word)) {
        const score = calculateScore(triagem, searchTerm, 'partial', 'subtitulo');
        if (score > bestScore) {
          bestScore = score;
          bestMatchType = 'partial';
          bestMatchedField = 'subtitulo';
        }
      }
    }
    
    // Busca por sinônimos
    for (const [key, synonyms] of Object.entries(SEARCH_SYNONYMS)) {
      if (normalizedSearchTerm.includes(key) || searchWords.some(word => word === key)) {
        for (const synonym of synonyms) {
          const normalizedSynonym = normalizeSearchTerm(synonym);
          
          if (normalizedTitulo.includes(normalizedSynonym)) {
            const score = calculateScore(triagem, searchTerm, 'synonym', 'titulo');
            if (score > bestScore) {
              bestScore = score;
              bestMatchType = 'synonym';
              bestMatchedField = 'titulo';
            }
          }
          
          if (triagem.subtitulo && normalizeSearchTerm(triagem.subtitulo).includes(normalizedSynonym)) {
            const score = calculateScore(triagem, searchTerm, 'synonym', 'subtitulo');
            if (score > bestScore) {
              bestScore = score;
              bestMatchType = 'synonym';
              bestMatchedField = 'subtitulo';
            }
          }
        }
      }
    }
    
    // Busca por tags
    if (triagem.tags && Array.isArray(triagem.tags)) {
      for (const tag of triagem.tags) {
        const normalizedTag = normalizeSearchTerm(tag);
        if (normalizedTag.includes(normalizedSearchTerm) || 
            searchWords.some(word => normalizedTag.includes(word))) {
          const score = calculateScore(triagem, searchTerm, 'tag', 'tags');
          if (score > bestScore) {
            bestScore = score;
            bestMatchType = 'tag';
            bestMatchedField = 'tags';
          }
        }
      }
    }
    
    // Busca por categoria
    if (triagem.categoria) {
      const normalizedCategoria = normalizeSearchTerm(triagem.categoria);
      if (normalizedCategoria.includes(normalizedSearchTerm) || 
          searchWords.some(word => normalizedCategoria.includes(word))) {
        const score = calculateScore(triagem, searchTerm, 'category', 'categoria');
        if (score > bestScore) {
          bestScore = score;
          bestMatchType = 'category';
          bestMatchedField = 'categoria';
        }
      }
    }
    
    // Se encontrou alguma correspondência, adiciona ao resultado
    if (bestScore > 0) {
      results.push({
        triagem,
        score: bestScore,
        matchType: bestMatchType,
        matchedField: bestMatchedField
      });
    }
  }
  
  // Ordena por score (maior primeiro) e depois por rating
  return results.sort((a, b) => {
    if (a.score !== b.score) {
      return b.score - a.score;
    }
    return (b.triagem.rating || 0) - (a.triagem.rating || 0);
  });
}

// Função para obter sugestões de busca
export function getSearchSuggestions(searchTerm: string): string[] {
  if (!searchTerm.trim()) return [];
  
  const normalizedSearchTerm = normalizeSearchTerm(searchTerm);
  const suggestions: string[] = [];
  
  // Busca por sinônimos que contenham o termo de busca
  for (const [key, synonyms] of Object.entries(SEARCH_SYNONYMS)) {
    if (key.includes(normalizedSearchTerm)) {
      suggestions.push(key);
      suggestions.push(...synonyms.slice(0, 2)); // Limita para não sobrecarregar
    }
    
    for (const synonym of synonyms) {
      if (synonym.includes(normalizedSearchTerm) && !suggestions.includes(synonym)) {
        suggestions.push(synonym);
      }
    }
  }
  
  return suggestions.slice(0, 5); // Máximo 5 sugestões
}
