// src/forms/triagemGeral.ts

// import { getPerguntasComuns } from './perguntasComuns';
import type { Step } from '@/types/triagem';

export const perguntasTriagemGeral: Step[] = [
  {
    type: 'intro',
    name: 'intro',
    label: '🧠 Saúde Integrativa e Preditiva',
    description: 'Este formulário avalia sua saúde geral, hábitos de vida, sintomas e riscos. Ao final, você receberá um relatório personalizado com recomendações baseadas em evidência científica.',
    justification: 'Leva de 5 a 8 minutos para completar.',
  },

  // 👤 Dados Pessoais - REMOVIDO para evitar duplicação
  // Os dados pessoais agora são coletados apenas no cadastro inicial

  // 🧠 Etapa 1 — Saúde Mental e Emocional
  {
    type: 'setor',
    name: 'setor_saude_mental',
    label: '🧠 Saúde Mental e Emocional',
    description:
      'Seu estado emocional afeta diretamente o sono, a imunidade, o metabolismo e a longevidade. Esta seção busca entender seu equilíbrio emocional atual.',
    image: '/triagem/setores/saude_mental.png',
  },
  {
    type: 'select',
    name: 'estresse',
    label: 'Como está seu nível de estresse hoje?',
    options: ['Muito baixo', 'Baixo', 'Moderado', 'Alto'],
    justification:
      'Estresse crônico está associado ao aumento do risco de doenças cardiovasculares, diabetes tipo 2 e imunossupressão. (Lancet, 2022)',
    required: true,
    prioridade: 'alta',
    categoriaIA: 'saude_mental',
  },
  {
    type: 'select',
    name: 'humor',
    label: '🟣 Como você descreveria seu humor predominante nos últimos dias?',
    options: ['Estável', 'Ansioso', 'Triste', 'Irritado'],
    justification:
      'Alterações persistentes no humor podem indicar transtornos ansiosos ou depressivos e devem ser acompanhadas clinicamente. (DSM-5, 2020)',
    required: true,
    prioridade: 'alta',
    categoriaIA: 'saude_mental',
  },
  {
    type: 'select',
    name: 'emocao_frequente',
    label: '🟣 Com que frequência você sente tristeza, ansiedade ou falta de motivação?',
    options: ['Nunca', 'Raramente', 'Frequentemente', 'Quase sempre'],
    justification:
      'Sintomas emocionais frequentes impactam diretamente o sono, apetite, imunidade e bem-estar geral. (JAMA Psychiatry, 2020)',
    required: true,
    prioridade: 'alta',
    categoriaIA: 'saude_mental',
  },
  // 🍽️ Etapa 2 — Nutrição e Suplementação
{
  type: 'setor',
  name: 'setor_nutricao',
  label: '🍽️ Nutrição e Suplementação',
  description:
    'A alimentação impacta diretamente sua saúde metabólica, imunológica e emocional. Aqui buscamos entender seus hábitos alimentares e uso de suplementos.',
  image: '/triagem/setores/nutricao.png',
},
{
  type: 'select',
  name: 'quantidade_refeicoes',
  label: '🟣 Quantas refeições você costuma fazer por dia?',
  options: ['1', '2', '3', '4 ou mais'],
  justification:
    'A frequência das refeições influencia o metabolismo, controle glicêmico e regulação de hormônios como insulina e grelina. (Endocrine Reviews, 2021)',
  example: 'Exemplo: Café da manhã, almoço e jantar.',
  required: true,
  prioridade: 'media',
  categoriaIA: 'nutricao',
},
{
  type: 'select',
  name: 'ultraprocessados',
  label: '🟣 Você consome alimentos ultraprocessados com frequência?',
  options: ['Não', '1 a 2x por semana', '3 ou mais vezes por semana'],
  justification:
    'O consumo de ultraprocessados está ligado ao aumento de obesidade, câncer, depressão e envelhecimento celular acelerado. (BMJ, 2019)',
  example: 'Exemplo: Refrigerantes, salgadinhos, embutidos.',
  required: true,
  prioridade: 'alta',
  categoriaIA: 'nutricao',
},
{
  type: 'multiselect',
  name: 'suplementos',
  label: '🟣 Quais suplementos ou vitaminas você utiliza atualmente?',
  isMulti: true,
  options: [
    { value: 'Nenhum', label: 'Nenhum' },
    { value: 'Vitamina D', label: 'Vitamina D' },
    { value: 'Ômega 3', label: 'Ômega 3' },
    { value: 'Whey protein', label: 'Whey protein' },
    { value: 'Multivitamínico', label: 'Multivitamínico' },
    { value: 'Creatina', label: 'Creatina' },
    { value: 'Outros', label: 'Outros' },
  ],
  justification:
    'O uso de suplementos influencia exames laboratoriais, metabolismo e decisões clínicas. (Nutrients, 2020)',
  example: 'Exemplo: Tomo ômega 3 e vitamina D diariamente.',
  required: true,
  prioridade: 'media',
  categoriaIA: 'nutricao',
},

// 😴 Etapa 3 — Qualidade do Sono
{
  type: 'setor',
  name: 'setor_sono',
  label: '😴 Qualidade do Sono',
  description:
    'O sono regula funções hormonais, cognitivas e imunológicas. Avaliamos aqui seus padrões e qualidade do descanso.',
  image: '/triagem/setores/sono.png',
},
{
  type: 'select',
  name: 'qualidade_sono',
  label: '🟣 Como você avalia sua qualidade de sono?',
  options: ['Excelente', 'Boa', 'Regular', 'Ruim'],
  justification:
    'Baixa qualidade de sono está associada à fadiga, resistência à insulina, ansiedade e menor expectativa de vida. (Sleep Health, 2022)',
  example: 'Exemplo: Dorme 8h por noite com despertares tranquilos.',
  required: true,
  prioridade: 'alta',
  categoriaIA: 'sono',
},
{
  type: 'select',
  name: 'tempo_sono',
  label: '🟣 Quantas horas você dorme em media por noite?',
  options: ['Menos de 5h', '5-6h', '7-8h', 'Mais de 8h'],
  justification:
    'Dormir pouco ou em excesso aumenta o risco de hipertensão, diabetes tipo 2 e distúrbios do humor. (JAMA, 2018)',
  example: 'Exemplo: 6h nos dias de semana, 8h nos finais de semana.',
  required: true,
  prioridade: 'alta',
  categoriaIA: 'sono',
},
{
  type: 'select',
  name: 'insonia',
  label: '🟣 Você tem dificuldade para dormir ou acorda frequentemente à noite?',
  options: ['Sim', 'Não'],
  justification:
    'A insônia afeta cognição, humor, imunidade e aumenta o risco de depressão e síndrome metabólica. (Sleep Medicine, 2020)',
  example: 'Exemplo: Demoro a pegar no sono e acordo 2x por noite.',
  required: true,
  prioridade: 'alta',
  categoriaIA: 'sono',
},

// 🏃 Etapa 4 — Atividade Física
{
  type: 'select',
  name: 'atividade_fisica',
  label: '🟣 Qual seu nível atual de atividade física?',
  options: [
    { value: 'Sedentário', label: 'Sedentário (não pratica exercícios)' },
    { value: 'Leve', label: 'Leve (1-2x por semana)' },
    { value: 'Moderado', label: 'Moderado (3-4x por semana)' },
    { value: 'Intenso', label: 'Intenso (5x ou mais por semana)' },
  ],
  justification:
    'A prática regular de exercícios reduz risco de doenças crônicas, melhora sono, humor e disposição. (CDC, 2022)',
  example: 'Exemplo: Caminho 3x na semana e faço musculação leve.',
  required: true,
  prioridade: 'alta',
  categoriaIA: 'atividade',
},
// 🚬 Etapa 5 — Substâncias e Medicamentos
{
  type: 'setor',
  name: 'setor_substancias',
  label: '🚬 Substâncias e Hábitos de Saúde',
  description:
    'Alguns hábitos como o uso de álcool, cigarros ou substâncias recreativas afetam diretamente o metabolismo, o humor e o risco de doenças.',
  image: '/triagem/setores/habitos_substancias.png',
},
{
  type: 'multiselect',
  name: 'uso_substancias',
  label: '🟣 Você faz uso de alguma destas substâncias?',
  isMulti: true,
  options: [
    { value: 'Nenhuma', label: 'Nenhuma' },
    { value: 'Álcool', label: 'Álcool' },
    { value: 'Cigarro', label: 'Cigarro' },
    { value: 'Maconha', label: 'Maconha' },
    { value: 'Outras substâncias recreativas', label: 'Outras substâncias recreativas' },
  ],
  justification:
    'O uso dessas substâncias está ligado ao aumento de doenças hepáticas, cardiovasculares e psiquiátricas. (The Lancet Psychiatry, 2021)',
  example: 'Exemplo: Consumo álcool socialmente e já fumei no passado.',
  required: true,
  prioridade: 'alta',
  categoriaIA: 'habitos',
},
{
  type: 'select',
  name: 'medicamentos',
  label: '🟣 Você utiliza algum medicamento atualmente?',
  options: ['Não', 'Sim, uso contínuo', 'Sim, uso esporádico'],
  justification:
    'Medicamentos impactam o metabolismo, os sintomas e as condutas clínicas, e devem ser sempre considerados na avaliação. (UpToDate, 2022)',
  example: 'Exemplo: Uso diário de losartana e metformina.',
  required: true,
  prioridade: 'alta',
  categoriaIA: 'medicacao',
},

// ⚠️ Etapa 6 — Doenças Crônicas e Histórico Familiar
{
  type: 'setor',
  name: 'setor_doencas',
  label: '⚠️ Doenças Crônicas e Histórico Familiar',
  description:
    'Entender quais doenças você possui ou quais estão presentes na sua família permite planejar ações preventivas, rastreios e cuidados direcionados.',
  image: '/triagem/setores/doencas_cronicas.png',
},
{
  type: 'multiselect',
  name: 'doenca_cronica',
  label: '🟣 Você tem alguma doença crônica diagnosticada? (Selecione todas que se aplicam)',
  isMulti: true,
  options: [
    { value: 'Nenhuma', label: 'Nenhuma' },
    { value: 'Diabetes', label: 'Diabetes' },
    { value: 'Hipertensão', label: 'Hipertensão' },
    { value: 'Dislipidemia', label: 'Colesterol/Triglicerídeos altos' },
    { value: 'Doença cardiovascular', label: 'Doença cardiovascular' },
    { value: 'Doença renal', label: 'Doença renal' },
    { value: 'Doença autoimune', label: 'Doença autoimune' },
    { value: 'Câncer', label: 'Câncer' },
    { value: 'Outra', label: 'Outra' },
  ],
  justification:
    'A presença de doenças crônicas modifica metas clínicas, necessidade de exames, medicações e acompanhamento regular. (American Heart Association, 2022)',
  example: 'Exemplo: Diabetes tipo 2 e hipertensão.',
  required: true,
  prioridade: 'alta',
  categoriaIA: 'cronicas',
},
{
  type: 'multiselect',
  name: 'historico_familiar',
  label: '🟣 Algum familiar possui doenças crônicas importantes? (Selecione todas que se aplicam)',
  isMulti: true,
  options: [
    { value: 'Nenhuma', label: 'Nenhuma' },
    { value: 'Diabetes', label: 'Diabetes' },
    { value: 'Hipertensão', label: 'Hipertensão' },
    { value: 'Câncer', label: 'Câncer' },
    { value: 'Doença cardiovascular', label: 'Doença cardiovascular' },
    { value: 'Outra', label: 'Outra' },
  ],
  justification:
    'Histórico familiar é um preditor importante para rastreamento precoce e intervenções personalizadas. (Lancet, 2021)',
  example: 'Exemplo: Mãe com hipertensão, pai com diabetes.',
  required: true,
  prioridade: 'alta',
  categoriaIA: 'familia',
},

// 💼 Etapa 7 — Rotina, Trabalho e Satisfação
{
  type: 'setor',
  name: 'setor_trabalho',
  label: '💼 Trabalho, Rotina e Satisfação de Vida',
  description:
    'Sua rotina influencia diretamente sua saúde física, mental e emocional. Vamos entender melhor seu contexto de vida.',
  image: '/triagem/setores/trabalho_rotina.png',
},
{
  type: 'select',
  name: 'trabalho',
  label: '🟣 Você trabalha atualmente?',
  options: ['Sim', 'Não'],
  justification:
    'O trabalho impacta diretamente os níveis de estresse, sono, alimentação e atividade física. (CDC, 2022)',
  example: 'Exemplo: Trabalho remoto como analista de dados.',
  required: true,
  prioridade: 'media',
  categoriaIA: 'rotina',
},
{
  type: 'select',
  name: 'satisfacao_vida',
  label: '🟣 Você sente satisfação com sua vida atualmente?',
  options: ['Sim, totalmente', 'Parcialmente', 'Não muito', 'Nada satisfeito(a)'],
  justification:
    'Satisfação de vida está ligada à saúde emocional, imunidade, longevidade e menor risco de depressão. (WHOQOL, 2021)',
  example: 'Exemplo: Satisfeito com a carreira, mas insatisfeito com saúde.',
  required: true,
  prioridade: 'alta',
  categoriaIA: 'bem_estar',
},

// 🎯 Etapa 8 — Objetivos e Barreiras
{
  type: 'setor',
  name: 'setor_objetivos',
  label: '🎯 Objetivos, Barreiras e Autopercepção',
  description:
    'Saber seus objetivos e dificuldades ajuda a IA a traçar recomendações personalizadas e estratégias mais eficazes.',
  image: '/triagem/setores/objetivos_barreiras.png',
},
{
  type: 'multiselect',
  name: 'objetivo_saude',
  label: '🟣 Qual é seu principal objetivo de saúde neste momento?',
  isMulti: true,
  options: [
    { value: 'Emagrecimento', label: 'Emagrecimento' },
    { value: 'Melhorar energia/disposição', label: 'Melhorar energia/disposição' },
    { value: 'Reduzir estresse/ansiedade', label: 'Reduzir estresse/ansiedade' },
    { value: 'Ganhar massa muscular', label: 'Ganhar massa muscular' },
    { value: 'Controlar doenças crônicas', label: 'Controlar doenças crônicas' },
    { value: 'Melhorar sono', label: 'Melhorar sono' },
    { value: 'Outro', label: 'Outro' },
  ],
  justification:
    'Objetivos bem definidos aumentam adesão às recomendações e permitem condutas mais específicas. (J Clin Psychol, 2021)',
  example: 'Exemplo: Reduzir ansiedade e melhorar o sono.',
  required: true,
  prioridade: 'alta',
  categoriaIA: 'objetivos',
},
{
  type: 'multiselect',
  name: 'barreiras',
  label: '🟣 Qual sua principal dificuldade para alcançar seus objetivos de saúde?',
  isMulti: true,
  options: [
    { value: 'Falta de tempo', label: 'Falta de tempo' },
    { value: 'Falta de motivação', label: 'Falta de motivação' },
    { value: 'Rotina estressante', label: 'Rotina estressante' },
    { value: 'Problemas financeiros', label: 'Problemas financeiros' },
    { value: 'Falta de apoio', label: 'Falta de apoio' },
    { value: 'Outro', label: 'Outro' },
  ],
  justification:
    'Identificar barreiras permite criar planos mais realistas e personalizados. (BMC Public Health, 2022)',
  example: 'Exemplo: Falta de tempo por jornada dupla.',
  required: true,
  prioridade: 'media',
  categoriaIA: 'objetivos',
},
// 🕰️ Etapa 5 — Linha do Tempo da Saúde
{
  type: 'setor',
  name: 'setor_linha_do_tempo',
  label: '🕰️ Linha do Tempo da Saúde',
  description:
    'Vamos montar juntos sua linha do tempo da saúde: os momentos que mais marcaram sua jornada. Isso ajuda muito nosso sistema a entender você de forma mais humana.',
  image: '/triagem/setores/linha_do_tempo.png',
},
{
  type: 'multiselect',
  name: 'eventos_marcantes',
  label: '🟣 Quais fases da sua vida tiveram eventos de saúde importantes?',
  isMulti: true,
  options: [
    { value: 'infancia', label: 'Infância (0 a 12 anos)' },
    { value: 'adolescencia', label: 'Adolescência (13 a 19 anos)' },
    { value: 'vida_adulta_jovem', label: 'Vida adulta jovem (20 a 35 anos)' },
    { value: 'meia_idade', label: 'Meia-idade (36 a 60 anos)' },
    { value: 'atualidade', label: 'Agora / Atualidade' },
    { value: 'nenhuma', label: 'Nenhuma / Nada relevante' },
  ],
  justification:
    'Momentos críticos de saúde moldam risco futuro e a percepção de bem-estar. (Lancet, 2021)',
  required: true,
  prioridade: 'alta',
  categoriaIA: 'linha_do_tempo',
},
{
  type: 'input',
  name: 'evento_mais_marcante',
  label: '📌 Qual foi o momento de saúde mais marcante da sua vida?',
  placeholder: 'Ex: cirurgia, diagnóstico difícil, internação, crise emocional...',
  example: 'Aos 22 anos tive um acidente de moto e fraturei a coluna.',
  justification:
    'O evento mais marcante oferece pistas importantes sobre traumas, limitações e prioridades do paciente. (BMJ, 2020)',
  required: false,
  prioridade: 'alta',
  categoriaIA: 'linha_do_tempo',
},
{
  type: 'select',
  name: 'saude_atual_linha_do_tempo',
  label: '🧭 Como você avaliaria sua saúde hoje em comparação a 5 anos atrás?',
  options: [
    { value: 'Melhorou muito', label: 'Melhorou muito' },
    { value: 'Melhorou um pouco', label: 'Melhorou um pouco' },
    { value: 'Está igual', label: 'Está igual' },
    { value: 'Piorou um pouco', label: 'Piorou um pouco' },
    { value: 'Piorou muito', label: 'Piorou muito' },
  ],
  justification:
    'A percepção de mudança ao longo do tempo é um dos melhores preditores subjetivos de risco (WHO, 2023)',
  required: true,
  prioridade: 'alta',
  categoriaIA: 'linha_do_tempo',
},
{
  type: 'textarea',
  name: 'linha_do_tempo_livre_refinada',
  label: '📝 Deseja escrever com suas palavras algum trecho da sua jornada de saúde?',
  placeholder: 'Conte livremente algo que marcou sua saúde ou que sente que precisa ser ouvido...',
  example:
    'Desde adolescente luto contra ansiedade. Recentemente isso voltou a me atrapalhar no sono e trabalho.',
  justification:
    'Relatos livres trazem nuances que nem sempre são captadas por múltipla escolha. (Narrative Medicine, 2020)',
  required: false,
  prioridade: 'alta',
  categoriaIA: 'linha_do_tempo',
},
];