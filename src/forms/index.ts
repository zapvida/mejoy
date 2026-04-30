import { perguntasAlergias } from './alergias';
import { perguntasAuditiva } from './auditiva';
import { perguntasBiohacking } from './biohacking';
import { perguntasBucal } from './bucal';
import { perguntasCancer } from './cancer';
import { perguntasEnxaqueca } from './enxaqueca';
import { perguntasObesidade } from './obesidade';
import { perguntasGestante } from './gestante';
import { perguntasTabagismo } from './tabagismo';
import { perguntasQuimica } from './quimica';
import { perguntasSaudeMasculina } from './saudeMasculina';
import { perguntasEstiloVidaModerna } from './estiloVidaModerna';
import { perguntasEstresseBurnout } from './estresseBurnout';
import { perguntasJogosAzar } from './jogosAzar';
import { perguntasDepressao } from './depressao';
import { perguntasTDAH } from './tdah';
// import { perguntasTeste } from './teste';
import { perguntasTesteSaude } from './testeSaude';
import { gastro } from './gastro';

// Novas triagens geradas automaticamente
import { perguntasCardiovascular } from './cardiovascular';
import { perguntasDiabetesMetabolismo } from './diabetes-metabolismo';
import { perguntasDorCronica } from './dor-cronica';
import { perguntascoluna } from './coluna';
import { perguntasRespiratoria } from './respiratoria';
import { perguntasrenal } from './renal';
import { perguntasHepatica } from './hepatica';
import { perguntasmulher } from './mulher';
import { perguntasProstata } from './prostata';
import { perguntasTireoide } from './tireoide';
import { perguntasmama } from './mama';
import { perguntasocular } from './ocular';
import { perguntaspele } from './pele';
import { perguntasSexual } from './sexual';
import { perguntasidoso } from './idoso';
import { perguntasCrianca } from './crianca';
import { perguntasTrabalhador } from './trabalhador';
import { perguntasLongevidade } from './longevidade';
import { perguntasMental } from './mental';
import { perguntasVitalidade } from './vitalidade';
import { perguntasMicrobioma } from './microbioma';
import { perguntasMicronutrientes } from './micronutrientes';
// import { perguntasSono as perguntasSonoLegacy } from './sono'; // Não usado mais - substituído por perguntasSono do zapfarm
import { perguntasTriagemGeral } from './triagemGeral';
import { perguntasTriagemGeralRapida } from './triagemGeralRapida';
import { perguntasEmagrecimento } from './emagrecimento';
// Formulários ZapFarm
import { perguntasCalvicie } from './zapfarm/calvicie';
import { perguntasSono } from './zapfarm/sono';
import { perguntasAnsiedade } from './zapfarm/ansiedade';
import { perguntasIntestino } from './zapfarm/intestino';
import { perguntasFigado } from './zapfarm/figado';
import { perguntasLibidoMasculina } from './zapfarm/libido-masculina';
import { perguntasMenopausa } from './zapfarm/menopausa';
import { perguntasArticulacoes } from './zapfarm/articulacoes';
import { perguntasImunidade } from './zapfarm/imunidade';

import type { Step } from '@/types/triagem';

export type TipoTriagem =
  | 'gastro'
  | 'testeSaude'
  | 'geral'
  | 'geralRapida'
  | 'mental'
  | 'cancer'
  | 'sono'
  | 'enxaqueca'
  | 'obesidade'
  | 'gestante'
  | 'tabagismo'
  | 'quimica'
  | 'saudeMasculina'
  | 'estiloVidaModerna'
  | 'estresseBurnout'
  | 'jogosAzar'
  | 'depressao'
  | 'tdah'
  // Novas triagens
  | 'cardiovascular'
  | 'diabetes-metabolismo'
  | 'dor-cronica'
  | 'coluna'
  | 'respiratoria'
  | 'renal'
  | 'hepatica'
  | 'mulher'
  | 'prostata'
  | 'tireoide'
  | 'mama'
  | 'ocular'
  | 'auditiva'
  | 'pele'
  | 'alergias'
  | 'sexual'
  | 'idoso'
  | 'bucal'
  | 'crianca'
  | 'trabalhador'
  | 'longevidade'
  | 'vitalidade'
  | 'microbioma'
  | 'micronutrientes'
  | 'biohacking'
  | 'emagrecimento'
  // Formulários ZapFarm
  | 'calvicie'
  | 'ansiedade'
  | 'intestino'
  | 'figado'
  | 'libido-masculina'
  | 'menopausa'
  | 'articulacoes'
  | 'imunidade'
  // | 'teste';

export type Formulario = {
  titulo: string;
  subtitulo?: string;
  perguntas?: Step[];
  steps?: any[]; // para gastro
  descricao?: string;
  descricaoDetalhada?: string;
  isFree?: boolean;
  icon?: string;
  duracao?: string;
  rating?: number;
  participantes?: number;
  tags?: string[];
  categoria?: string;
};

// 🔧 MODO TESTE: Liberar todas as triagens temporariamente
const TEST_MODE_ALL_FREE = process.env.NEXT_PUBLIC_TEST_MODE_ALL_FREE === 'true';

// Marcação explícita: qual é FREE
const FREE_SLUG = (TEST_MODE_ALL_FREE ? 'ALL_FREE' : 'gastro,testeSaude') as TipoTriagem | 'ALL_FREE';

export const formularios: Record<TipoTriagem, Formulario> = {
  gastro: {
    ...gastro,
    subtitulo: 'Saúde Gastrointestinal',
    descricaoDetalhada: 'Triagem clínica inteligente para digestão, intestino, refluxo, dor abdominal e hábitos. Gratuita.',
    duracao: '2-5 min',
    rating: 4.8,
    participantes: 1250,
    tags: ['Digestão', 'Intestino', 'Refluxo'],
    categoria: 'Gastroenterologia',
    isFree: TEST_MODE_ALL_FREE || (FREE_SLUG as string).includes('gastro'),
    icon: '🟢'
  },
  testeSaude: {
    titulo: 'Teste Saúde',
    subtitulo: 'Triagem Rápida de Teste',
    descricao: 'Inicie sua triagem agora.',
    descricaoDetalhada: 'Triagem rápida de teste com 7 perguntas essenciais para validação do sistema.',
    duracao: '1-2 min',
    rating: 4.5,
    participantes: 50,
    tags: ['Teste', 'Rápida', 'Validação'],
    categoria: 'Teste',
    perguntas: perguntasTesteSaude,
    isFree: TEST_MODE_ALL_FREE || (FREE_SLUG as string).includes('testeSaude'),
    icon: '🧪'
  },
  geral: {
    titulo: 'Saúde Integrativa e Preditiva',
    subtitulo: 'Avaliação Completa',
    descricao: 'Inicie sua triagem agora.',
    descricaoDetalhada: 'Avaliação completa da saúde com foco em prevenção e medicina integrativa.',
    duracao: '5-8 min',
    rating: 4.9,
    participantes: 2100,
    tags: ['Prevenção', 'Integrativa', 'Preditiva'],
    categoria: 'Medicina Geral',
    perguntas: perguntasTriagemGeral,
    isFree: TEST_MODE_ALL_FREE || (FREE_SLUG as string) === 'geral',
    icon: '🧬'
  },
  geralRapida: {
    titulo: 'Triagem Rápida de Saúde',
    subtitulo: 'Avaliação Express',
    descricao: 'Inicie sua triagem agora.',
    descricaoDetalhada: 'Avaliação rápida e eficiente do estado geral de saúde.',
    duracao: '1-3 min',
    rating: 4.7,
    participantes: 1800,
    tags: ['Rápida', 'Express', 'Geral'],
    categoria: 'Medicina Geral',
    perguntas: perguntasTriagemGeralRapida,
    isFree: TEST_MODE_ALL_FREE || (FREE_SLUG as string) === 'geralRapida',
    icon: '⚡'
  },
  mental: {
    titulo: 'Saúde Mental',
    subtitulo: 'Bem-estar Psicológico',
    descricao: 'Inicie sua triagem agora.',
    descricaoDetalhada: 'Avaliação completa da saúde mental e bem-estar psicológico.',
    duracao: '3-5 min',
    rating: 4.8,
    participantes: 1650,
    tags: ['Psicologia', 'Bem-estar', 'Mental'],
    categoria: 'Psiquiatria',
    perguntas: perguntasMental,
    isFree: TEST_MODE_ALL_FREE || (FREE_SLUG as string) === 'mental',
    icon: '🧠'
  },
  cancer: {
    titulo: 'Prevenção de Câncer',
    subtitulo: 'Detecção Precoce',
    descricao: 'Inicie sua triagem agora.',
    descricaoDetalhada: 'Triagem focada na prevenção e detecção precoce de câncer.',
    duracao: '4-6 min',
    rating: 4.9,
    participantes: 1200,
    tags: ['Oncologia', 'Prevenção', 'Detecção'],
    categoria: 'Oncologia',
    perguntas: perguntasCancer,
    isFree: TEST_MODE_ALL_FREE || (FREE_SLUG as string) === 'cancer',
    icon: '🎗️'
  },
  sono: {
    titulo: 'Sono Profundo & Ansiedade Noturna',
    subtitulo: 'Tratamento Personalizado Me Joy',
    descricao: 'Check-up gratuito para avaliar sua elegibilidade',
    descricaoDetalhada: 'Avaliação completa para tratamento de insônia e distúrbios do sono com suplemento natural e acompanhamento médico especializado.',
    duracao: '1-3 min',
    rating: 4.7,
    participantes: 0,
    tags: ['Sono', 'Insônia', 'Neurologia'],
    categoria: 'Neurologia',
    perguntas: perguntasSono,
    isFree: true,
    icon: '🌙'
  },
  enxaqueca: {
    titulo: 'Prevenção de Enxaqueca',
    subtitulo: 'Cefaleia',
    descricao: 'Inicie sua triagem agora.',
    descricaoDetalhada: 'Triagem especializada para prevenção e controle de enxaquecas.',
    duracao: '3-5 min',
    rating: 4.7,
    participantes: 800,
    tags: ['Enxaqueca', 'Cefaleia', 'Dor'],
    categoria: 'Neurologia',
    perguntas: perguntasEnxaqueca,
    isFree: TEST_MODE_ALL_FREE || (FREE_SLUG as string) === 'enxaqueca',
    icon: '💢'
  },
  obesidade: {
    titulo: 'Controle de Peso e Obesidade',
    subtitulo: 'Metabolismo',
    descricao: 'Inicie sua triagem agora.',
    descricaoDetalhada: 'Avaliação completa para controle de peso e obesidade.',
    duracao: '4-6 min',
    rating: 4.8,
    participantes: 1400,
    tags: ['Peso', 'Obesidade', 'Metabolismo'],
    categoria: 'Endocrinologia',
    perguntas: perguntasObesidade,
    isFree: TEST_MODE_ALL_FREE || (FREE_SLUG as string) === 'obesidade',
    icon: '🍽️'
  },
  gestante: {
    titulo: 'Saúde da Gestante',
    subtitulo: 'Pré-natal',
    descricao: 'Inicie sua triagem agora.',
    descricaoDetalhada: 'Triagem especializada para gestantes e acompanhamento pré-natal.',
    duracao: '5-7 min',
    rating: 4.9,
    participantes: 600,
    tags: ['Gestação', 'Pré-natal', 'Maternidade'],
    categoria: 'Ginecologia',
    perguntas: perguntasGestante,
    isFree: TEST_MODE_ALL_FREE || (FREE_SLUG as string) === 'gestante',
    icon: '🤰'
  },
  tabagismo: {
    titulo: 'Cessação do Tabagismo',
    subtitulo: 'Parar de Fumar',
    descricao: 'Inicie sua triagem agora.',
    descricaoDetalhada: 'Programa especializado para cessação do tabagismo.',
    duracao: '3-4 min',
    rating: 4.6,
    participantes: 750,
    tags: ['Tabagismo', 'Cessação', 'Pulmão'],
    categoria: 'Pneumologia',
    perguntas: perguntasTabagismo,
    isFree: TEST_MODE_ALL_FREE || (FREE_SLUG as string) === 'tabagismo',
    icon: '🚭'
  },
  quimica: {
    titulo: 'Dependência Química',
    subtitulo: 'Substâncias',
    descricao: 'Inicie sua triagem agora.',
    descricaoDetalhada: 'Avaliação e apoio para dependência química.',
    duracao: '4-5 min',
    rating: 4.5,
    participantes: 400,
    tags: ['Dependência', 'Substâncias', 'Recuperação'],
    categoria: 'Psiquiatria',
    perguntas: perguntasQuimica,
    isFree: TEST_MODE_ALL_FREE || (FREE_SLUG as string) === 'quimica',
    icon: '💊'
  },
  saudeMasculina: {
    titulo: 'Saúde Masculina',
    subtitulo: 'Urologia',
    descricao: 'Inicie sua triagem agora.',
    descricaoDetalhada: 'Triagem especializada para saúde masculina e urologia.',
    duracao: '3-5 min',
    rating: 4.7,
    participantes: 900,
    tags: ['Urologia', 'Masculina', 'Prostata'],
    categoria: 'Urologia',
    perguntas: perguntasSaudeMasculina,
    isFree: TEST_MODE_ALL_FREE || (FREE_SLUG as string) === 'saudeMasculina',
    icon: '👨'
  },
  estiloVidaModerna: {
    titulo: 'Estilo de Vida Moderna',
    subtitulo: 'Hábitos Urbanos',
    descricao: 'Inicie sua triagem agora.',
    descricaoDetalhada: 'Avaliação do estilo de vida moderno e seus impactos na saúde.',
    duracao: '4-6 min',
    rating: 4.6,
    participantes: 1100,
    tags: ['Estilo de Vida', 'Urbanismo', 'Hábitos'],
    categoria: 'Medicina Preventiva',
    perguntas: perguntasEstiloVidaModerna,
    isFree: TEST_MODE_ALL_FREE || (FREE_SLUG as string) === 'estiloVidaModerna',
    icon: '🏙️'
  },
  estresseBurnout: {
    titulo: 'Estresse e Burnout',
    subtitulo: 'Esgotamento',
    descricao: 'Inicie sua triagem agora.',
    descricaoDetalhada: 'Avaliação de estresse, ansiedade e síndrome de burnout.',
    duracao: '3-4 min',
    rating: 4.8,
    participantes: 1300,
    tags: ['Estresse', 'Burnout', 'Ansiedade'],
    categoria: 'Psiquiatria',
    perguntas: perguntasEstresseBurnout,
    isFree: TEST_MODE_ALL_FREE || (FREE_SLUG as string) === 'estresseBurnout',
    icon: '😰'
  },
  jogosAzar: {
    titulo: 'Vício em Jogos de Azar',
    subtitulo: 'Ludopatia',
    descricao: 'Inicie sua triagem agora.',
    descricaoDetalhada: 'Avaliação e apoio para dependência em jogos de azar.',
    duracao: '3-4 min',
    rating: 4.4,
    participantes: 300,
    tags: ['Jogos', 'Azar', 'Ludopatia'],
    categoria: 'Psiquiatria',
    perguntas: perguntasJogosAzar,
    isFree: TEST_MODE_ALL_FREE || (FREE_SLUG as string) === 'jogosAzar',
    icon: '🎰'
  },
  depressao: {
    titulo: 'Triagem de Depressão',
    subtitulo: 'Transtorno Depressivo',
    descricao: 'Inicie sua triagem agora.',
    descricaoDetalhada: 'Avaliação especializada para transtornos depressivos.',
    duracao: '4-5 min',
    rating: 4.7,
    participantes: 850,
    tags: ['Depressão', 'Humor', 'Tristeza'],
    categoria: 'Psiquiatria',
    perguntas: perguntasDepressao,
    isFree: TEST_MODE_ALL_FREE || (FREE_SLUG as string) === 'depressao',
    icon: '😔'
  },
  tdah: {
    titulo: 'Triagem de TDAH',
    subtitulo: 'Atenção e Hiperatividade',
    descricao: 'Inicie sua triagem agora.',
    descricaoDetalhada: 'Avaliação para Transtorno de Déficit de Atenção e Hiperatividade.',
    duracao: '5-6 min',
    rating: 4.6,
    participantes: 650,
    tags: ['TDAH', 'Atenção', 'Hiperatividade'],
    categoria: 'Psiquiatria',
    perguntas: perguntasTDAH,
    isFree: TEST_MODE_ALL_FREE || (FREE_SLUG as string) === 'tdah',
    icon: '🎯'
  },

  // Novas triagens P0 - Alta demanda/urgência
  cardiovascular: {
    titulo: 'Saúde Cardiovascular',
    subtitulo: 'Pressão, palpitações, risco cardíaco',
    descricao: 'Inicie sua triagem agora.',
    descricaoDetalhada: 'Avaliação completa do risco cardiovascular, pressão arterial, palpitações e sintomas cardíacos.',
    duracao: '4-5 min',
    rating: 4.9,
    participantes: 2000,
    tags: ['Coração', 'Pressão', 'Risco'],
    categoria: 'Cardiologia',
    perguntas: perguntasCardiovascular,
    isFree: TEST_MODE_ALL_FREE,
    icon: '❤️'
  },
  'diabetes-metabolismo': {
    titulo: 'Diabetes e Metabolismo',
    subtitulo: 'Glicemia, resistência insulínica',
    descricao: 'Inicie sua triagem agora.',
    descricaoDetalhada: 'Triagem para diabetes tipo 2, pré-diabetes e distúrbios metabólicos.',
    duracao: '4-5 min',
    rating: 4.8,
    participantes: 1800,
    tags: ['Diabetes', 'Glicemia', 'Metabolismo'],
    categoria: 'Endocrinologia',
    perguntas: perguntasDiabetesMetabolismo,
    isFree: TEST_MODE_ALL_FREE,
    icon: '🍯'
  },
  'dor-cronica': {
    titulo: 'Dor Crônica & Fibromialgia',
    subtitulo: 'Mapa de dor e gatilhos',
    descricao: 'Inicie sua triagem agora.',
    descricaoDetalhada: 'Avaliação de dor crônica, fibromialgia e condições dolorosas persistentes.',
    duracao: '5-6 min',
    rating: 4.7,
    participantes: 1500,
    tags: ['Dor', 'Fibromialgia', 'Crônica'],
    categoria: 'Reumatologia',
    perguntas: perguntasDorCronica,
    isFree: TEST_MODE_ALL_FREE,
    icon: '🩹'
  },
  coluna: {
    titulo: 'Dor na Coluna',
    subtitulo: 'Lombalgia, hérnia, sinais neurológicos',
    descricao: 'Inicie sua triagem agora.',
    descricaoDetalhada: 'Triagem para problemas de coluna, lombalgia, cervicalgia e hérnia de disco.',
    duracao: '4-5 min',
    rating: 4.8,
    participantes: 1600,
    tags: ['Coluna', 'Lombalgia', 'Hérnia'],
    categoria: 'Ortopedia',
    perguntas: perguntascoluna,
    isFree: TEST_MODE_ALL_FREE,
    icon: '🦴'
  },
  respiratoria: {
    titulo: 'Saúde Respiratória',
    subtitulo: 'Asma, DPOC, apneia do sono',
    descricao: 'Inicie sua triagem agora.',
    descricaoDetalhada: 'Avaliação de condições respiratórias como asma, DPOC e apneia do sono.',
    duracao: '3-4 min',
    rating: 4.6,
    participantes: 1200,
    tags: ['Respiração', 'Asma', 'DPOC'],
    categoria: 'Pneumologia',
    perguntas: perguntasRespiratoria,
    isFree: TEST_MODE_ALL_FREE,
    icon: '🫁'
  },
  renal: {
    titulo: 'Saúde Renal',
    subtitulo: 'Pedras, função renal',
    descricao: 'Inicie sua triagem agora.',
    descricaoDetalhada: 'Triagem para problemas renais, pedras nos rins e função renal.',
    duracao: '3-4 min',
    rating: 4.5,
    participantes: 800,
    tags: ['Rim', 'Pedras', 'Função'],
    categoria: 'Nefrologia',
    perguntas: perguntasrenal,
    isFree: TEST_MODE_ALL_FREE,
    icon: '🫘'
  },
  hepatica: {
    titulo: 'Saúde do Fígado',
    subtitulo: 'Esteatose, hepatites',
    descricao: 'Inicie sua triagem agora.',
    descricaoDetalhada: 'Avaliação da saúde hepática, esteatose e hepatites.',
    duracao: '3-4 min',
    rating: 4.5,
    participantes: 700,
    tags: ['Fígado', 'Esteatose', 'Hepatite'],
    categoria: 'Gastroenterologia',
    perguntas: perguntasHepatica,
    isFree: TEST_MODE_ALL_FREE,
    icon: '🫀'
  },
  mulher: {
    titulo: 'Saúde da Mulher',
    subtitulo: 'SOP, endometriose, menopausa',
    descricao: 'Inicie sua triagem agora.',
    descricaoDetalhada: 'Triagem especializada para saúde feminina, SOP, endometriose e menopausa.',
    duracao: '5-6 min',
    rating: 4.8,
    participantes: 1400,
    tags: ['Mulher', 'SOP', 'Menopausa'],
    categoria: 'Ginecologia',
    perguntas: perguntasmulher,
    isFree: TEST_MODE_ALL_FREE,
    icon: '👩'
  },
  prostata: {
    titulo: 'Saúde da Próstata',
    subtitulo: 'LUTS, PSA, hiperplasia',
    descricao: 'Inicie sua triagem agora.',
    descricaoDetalhada: 'Avaliação da saúde prostática, sintomas urinários e fatores de risco.',
    duracao: '3-4 min',
    rating: 4.6,
    participantes: 900,
    tags: ['Próstata', 'Urinário', 'PSA'],
    categoria: 'Urologia',
    perguntas: perguntasProstata,
    isFree: TEST_MODE_ALL_FREE,
    icon: '🎯'
  },
  tireoide: {
    titulo: 'Saúde da Tireoide',
    subtitulo: 'Hipo/hiper, nódulos',
    descricao: 'Inicie sua triagem agora.',
    descricaoDetalhada: 'Triagem para distúrbios da tireoide, hipo/hipertireoidismo e nódulos.',
    duracao: '3-4 min',
    rating: 4.7,
    participantes: 1100,
    tags: ['Tireoide', 'Hormônio', 'Nódulos'],
    categoria: 'Endocrinologia',
    perguntas: perguntasTireoide,
    isFree: TEST_MODE_ALL_FREE,
    icon: '🦋'
  },

  // Novas triagens P1 - Conversão média-alta
  mama: {
    titulo: 'Saúde da Mama',
    subtitulo: 'Dor, nódulos, rastreio',
    descricao: 'Inicie sua triagem agora.',
    descricaoDetalhada: 'Triagem para saúde mamária, detecção de nódulos e fatores de risco.',
    duracao: '3-4 min',
    rating: 4.8,
    participantes: 1300,
    tags: ['Mama', 'Nódulos', 'Rastreio'],
    categoria: 'Mastologia',
    perguntas: perguntasmama,
    isFree: TEST_MODE_ALL_FREE,
    icon: '🌸'
  },
  ocular: {
    titulo: 'Saúde Ocular',
    subtitulo: 'Visão, glaucoma, catarata',
    descricao: 'Inicie sua triagem agora.',
    descricaoDetalhada: 'Avaliação da saúde ocular, problemas de visão e doenças oculares.',
    duracao: '2-3 min',
    rating: 4.5,
    participantes: 600,
    tags: ['Olhos', 'Visão', 'Glaucoma'],
    categoria: 'Oftalmologia',
    perguntas: perguntasocular,
    isFree: TEST_MODE_ALL_FREE,
    icon: '👁️'
  },
  auditiva: {
    titulo: 'Saúde Auditiva',
    subtitulo: 'Perda, zumbido, labirintite',
    descricao: 'Inicie sua triagem agora.',
    descricaoDetalhada: 'Triagem para problemas auditivos, perda de audição e zumbido.',
    duracao: '2-3 min',
    rating: 4.4,
    participantes: 500,
    tags: ['Audição', 'Zumbido', 'Perda'],
    categoria: 'Otorrinolaringologia',
    perguntas: perguntasAuditiva,
    isFree: TEST_MODE_ALL_FREE,
    icon: '👂'
  },
  pele: {
    titulo: 'Saúde da Pele',
    subtitulo: 'Acne, eczema, psoríase',
    descricao: 'Inicie sua triagem agora.',
    descricaoDetalhada: 'Avaliação de condições da pele, acne, eczema e psoríase.',
    duracao: '3-4 min',
    rating: 4.6,
    participantes: 1000,
    tags: ['Pele', 'Acne', 'Eczema'],
    categoria: 'Dermatologia',
    perguntas: perguntaspele,
    isFree: TEST_MODE_ALL_FREE,
    icon: '🧴'
  },
  alergias: {
    titulo: 'Alergias & Intolerâncias',
    subtitulo: 'Rinite, alimentos, medicamentos',
    descricao: 'Inicie sua triagem agora.',
    descricaoDetalhada: 'Triagem para alergias respiratórias, alimentares e intolerâncias.',
    duracao: '3-4 min',
    rating: 4.5,
    participantes: 800,
    tags: ['Alergia', 'Rinite', 'Intolerância'],
    categoria: 'Alergologia',
    perguntas: perguntasAlergias,
    isFree: TEST_MODE_ALL_FREE,
    icon: '🤧'
  },
  sexual: {
    titulo: 'Saúde Sexual',
    subtitulo: 'DE, libido, ISTs',
    descricao: 'Inicie sua triagem agora.',
    descricaoDetalhada: 'Avaliação da saúde sexual, disfunções e educação preventiva.',
    duracao: '4-5 min',
    rating: 4.4,
    participantes: 600,
    tags: ['Sexual', 'Libido', 'Prevenção'],
    categoria: 'Sexologia',
    perguntas: perguntasSexual,
    isFree: TEST_MODE_ALL_FREE,
    icon: '💕'
  },
  idoso: {
    titulo: 'Saúde do Idoso',
    subtitulo: 'Quedas, fragilidade, memória',
    descricao: 'Inicie sua triagem agora.',
    descricaoDetalhada: 'Triagem especializada para saúde do idoso, quedas e declínio cognitivo.',
    duracao: '5-6 min',
    rating: 4.7,
    participantes: 700,
    tags: ['Idoso', 'Quedas', 'Memória'],
    categoria: 'Geriatria',
    perguntas: perguntasidoso,
    isFree: TEST_MODE_ALL_FREE,
    icon: '👴'
  },
  bucal: {
    titulo: 'Saúde Bucal',
    subtitulo: 'Gengiva, bruxismo, cáries',
    descricao: 'Inicie sua triagem agora.',
    descricaoDetalhada: 'Avaliação da saúde bucal, problemas gengivais e bruxismo.',
    duracao: '2-3 min',
    rating: 4.3,
    participantes: 400,
    tags: ['Boca', 'Gengiva', 'Bruxismo'],
    categoria: 'Odontologia',
    perguntas: perguntasBucal,
    isFree: TEST_MODE_ALL_FREE,
    icon: '🦷'
  },
  crianca: {
    titulo: 'Saúde da Criança',
    subtitulo: 'Sono, alimentação, marcos',
    descricao: 'Inicie sua triagem agora.',
    descricaoDetalhada: 'Triagem pediátrica para desenvolvimento, alimentação e marcos.',
    duracao: '4-5 min',
    rating: 4.8,
    participantes: 500,
    tags: ['Criança', 'Desenvolvimento', 'Pediatria'],
    categoria: 'Pediatria',
    perguntas: perguntasCrianca,
    isFree: TEST_MODE_ALL_FREE,
    icon: '👶'
  },
  trabalhador: {
    titulo: 'Saúde do Trabalhador',
    subtitulo: 'LER, ergonomia, burnout',
    descricao: 'Inicie sua triagem agora.',
    descricaoDetalhada: 'Avaliação de saúde ocupacional, LER/DORT e estresse no trabalho.',
    duracao: '3-4 min',
    rating: 4.5,
    participantes: 600,
    tags: ['Trabalho', 'LER', 'Ergonomia'],
    categoria: 'Medicina do Trabalho',
    perguntas: perguntasTrabalhador,
    isFree: TEST_MODE_ALL_FREE,
    icon: '💼'
  },

  // Novas triagens P2 - Tendências
  longevidade: {
    titulo: 'Longevidade & Anti-Aging',
    subtitulo: 'Hábitos que retardam o declínio',
    descricao: 'Inicie sua triagem agora.',
    descricaoDetalhada: 'Triagem para envelhecimento saudável, longevidade e medicina anti-aging.',
    duracao: '5-6 min',
    rating: 4.9,
    participantes: 800,
    tags: ['Longevidade', 'Anti-aging', 'Envelhecimento'],
    categoria: 'Medicina Preventiva',
    perguntas: perguntasLongevidade,
    isFree: TEST_MODE_ALL_FREE,
    icon: '⏰'
  },
  vitalidade: {
    titulo: 'Vitalidade & Energia',
    subtitulo: 'Fadiga, mitocôndria, energia',
    descricao: 'Inicie sua triagem agora.',
    descricaoDetalhada: 'Avaliação de energia, vitalidade e fadiga crônica.',
    duracao: '4-5 min',
    rating: 4.7,
    participantes: 900,
    tags: ['Energia', 'Vitalidade', 'Fadiga'],
    categoria: 'Medicina Funcional',
    perguntas: perguntasVitalidade,
    isFree: TEST_MODE_ALL_FREE,
    icon: '⚡'
  },
  microbioma: {
    titulo: 'Intestinal & Microbioma',
    subtitulo: 'SIBO, permeabilidade, flora',
    descricao: 'Inicie sua triagem agora.',
    descricaoDetalhada: 'Triagem para saúde intestinal, microbioma e permeabilidade.',
    duracao: '4-5 min',
    rating: 4.6,
    participantes: 700,
    tags: ['Intestino', 'Microbioma', 'SIBO'],
    categoria: 'Gastroenterologia',
    perguntas: perguntasMicrobioma,
    isFree: TEST_MODE_ALL_FREE,
    icon: '🦠'
  },
  micronutrientes: {
    titulo: 'Deficiências de Micronutrientes',
    subtitulo: 'Vitamina D, B12, ferro',
    descricao: 'Inicie sua triagem agora.',
    descricaoDetalhada: 'Avaliação de deficiências nutricionais e micronutrientes.',
    duracao: '4-5 min',
    rating: 4.5,
    participantes: 600,
    tags: ['Vitaminas', 'Minerais', 'Deficiência'],
    categoria: 'Nutrição',
    perguntas: perguntasMicronutrientes,
    isFree: TEST_MODE_ALL_FREE,
    icon: '🧪'
  },
  biohacking: {
    titulo: 'Biohacking & Performance',
    subtitulo: 'Rotinas de alta performance',
    descricao: 'Inicie sua triagem agora.',
    descricaoDetalhada: 'Triagem para otimização corporal, biohacking e alta performance.',
    duracao: '4-5 min',
    rating: 4.8,
    participantes: 400,
    tags: ['Biohacking', 'Performance', 'Otimização'],
    categoria: 'Medicina Funcional',
    perguntas: perguntasBiohacking,
    isFree: TEST_MODE_ALL_FREE,
    icon: '🧬'
  },
  emagrecimento: {
    titulo: 'Emagrecimento com inteligência',
    subtitulo: 'Tratamento Personalizado',
    descricao: 'Check-up gratuito para avaliar sua elegibilidade',
    descricaoDetalhada: 'Avaliação completa para tratamento de emagrecimento com acompanhamento médico especializado e medicação sob prescrição, seguindo as normas da ANVISA.',
    duracao: '3-5 min',
    rating: 4.9,
    participantes: 0,
    tags: ['Emagrecimento', 'Tirzepatida', 'Endocrinologia'],
    categoria: 'Endocrinologia',
    perguntas: perguntasEmagrecimento,
    isFree: true, // Check-up gratuito
    icon: '💊'
  },
  // Formulários ZapFarm - Produtos de e-commerce
  calvicie: {
    titulo: 'Calvície & Saúde Capilar',
    subtitulo: 'Tratamento Personalizado',
    descricao: 'Check-up gratuito para avaliar sua elegibilidade',
    descricaoDetalhada: 'Avaliação completa para tratamento de queda de cabelo e calvície com suplemento manipulado e acompanhamento médico especializado.',
    duracao: '1-3 min',
    rating: 4.8,
    participantes: 0,
    tags: ['Calvície', 'Queda de Cabelo', 'Tricologia'],
    categoria: 'Dermatologia',
    perguntas: perguntasCalvicie,
    isFree: true,
    icon: '💇'
  },
  ansiedade: {
    titulo: 'Ansiedade & Estresse Diurno',
    subtitulo: 'Tratamento Personalizado',
    descricao: 'Check-up gratuito para avaliar sua elegibilidade',
    descricaoDetalhada: 'Avaliação completa para tratamento de ansiedade e estresse com fitoterápicos naturais e acompanhamento médico especializado.',
    duracao: '1-3 min',
    rating: 4.7,
    participantes: 0,
    tags: ['Ansiedade', 'Estresse', 'Saúde Mental'],
    categoria: 'Saúde Mental',
    perguntas: perguntasAnsiedade,
    isFree: true,
    icon: '🌿'
  },
  intestino: {
    titulo: 'Intestino & Microbiota',
    subtitulo: 'Tratamento Personalizado',
    descricao: 'Check-up gratuito para avaliar sua elegibilidade',
    descricaoDetalhada: 'Avaliação completa para tratamento de constipação, inchaço e saúde intestinal com probióticos e fibras manipuladas.',
    duracao: '1-3 min',
    rating: 4.6,
    participantes: 0,
    tags: ['Intestino', 'Probióticos', 'Gastroenterologia'],
    categoria: 'Gastroenterologia',
    perguntas: perguntasIntestino,
    isFree: true,
    icon: '🦠'
  },
  figado: {
    titulo: 'Fígado & Detox Metabólico',
    subtitulo: 'Tratamento Personalizado',
    descricao: 'Check-up gratuito para avaliar sua elegibilidade',
    descricaoDetalhada: 'Avaliação completa para tratamento de fígado gorduroso e sobrecarga hepática com fitoterápicos e acompanhamento médico.',
    duracao: '1-3 min',
    rating: 4.6,
    participantes: 0,
    tags: ['Fígado', 'Detox', 'Gastroenterologia'],
    categoria: 'Gastroenterologia',
    perguntas: perguntasFigado,
    isFree: true,
    icon: '🫀'
  },
  'libido-masculina': {
    titulo: 'Libido & Testosterona Masculina',
    subtitulo: 'Tratamento Personalizado',
    descricao: 'Check-up gratuito para avaliar sua elegibilidade',
    descricaoDetalhada: 'Avaliação completa para tratamento de libido e testosterona com suplementos e acompanhamento médico especializado.',
    duracao: '1-3 min',
    rating: 4.7,
    participantes: 0,
    tags: ['Libido', 'Testosterona', 'Saúde Masculina'],
    categoria: 'Saúde Masculina',
    perguntas: perguntasLibidoMasculina,
    isFree: true,
    icon: '💪'
  },
  menopausa: {
    titulo: 'Menopausa & TPM 360',
    subtitulo: 'Tratamento Personalizado',
    descricao: 'Check-up gratuito para avaliar sua elegibilidade',
    descricaoDetalhada: 'Avaliação completa para tratamento de menopausa e TPM com fitormônios e acompanhamento médico especializado.',
    duracao: '1-3 min',
    rating: 4.8,
    participantes: 0,
    tags: ['Menopausa', 'TPM', 'Saúde Feminina'],
    categoria: 'Saúde Feminina',
    perguntas: perguntasMenopausa,
    isFree: true,
    icon: '🌸'
  },
  articulacoes: {
    titulo: 'Articulações & Coluna',
    subtitulo: 'Tratamento Personalizado',
    descricao: 'Check-up gratuito para avaliar sua elegibilidade',
    descricaoDetalhada: 'Avaliação completa para tratamento de dor articular e problemas de coluna com colágeno e anti-inflamatórios naturais.',
    duracao: '1-3 min',
    rating: 4.6,
    participantes: 0,
    tags: ['Articulações', 'Coluna', 'Ortopedia'],
    categoria: 'Ortopedia',
    perguntas: perguntasArticulacoes,
    isFree: true,
    icon: '🦴'
  },
  imunidade: {
    titulo: 'Imunidade 360 & Fadiga Recorrente',
    subtitulo: 'Tratamento Personalizado',
    descricao: 'Check-up gratuito para avaliar sua elegibilidade',
    descricaoDetalhada: 'Avaliação completa para fortalecer imunidade e reduzir infecções recorrentes com vitaminas e probióticos.',
    duracao: '1-3 min',
    rating: 4.7,
    participantes: 0,
    tags: ['Imunidade', 'Vitaminas', 'Imunologia'],
    categoria: 'Imunologia',
    perguntas: perguntasImunidade,
    isFree: true,
    icon: '🛡️'
  },
};

// Ordem: põe a free primeiro na grid
export const listaTriagens = Object.entries(formularios)
  .sort((a, b) => Number(!a[1].isFree) - Number(!b[1].isFree))
  .map(([slug, form]) => ({ slug, ...form }));
