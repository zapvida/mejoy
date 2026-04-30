import { Step } from '@/types/triagem';

/**
 * Triagem de emagrecimento - versão otimizada para menor fricção.
 * Estrutura focada em clareza leiga e geração de relatório personalizado.
 */
export const perguntasEmagrecimento: Step[] = [
  {
    name: 'aceita_termos',
    type: 'select',
    label: 'Consentimento inicial',
    description: 'Para continuar, confirme que leu e concorda com os documentos legais.',
    required: true,
    options: [
      {
        value: 'aceito',
        label:
          'Li e concordo com os Termos de Uso, a Política de Privacidade (LGPD), o uso de IA nos relatórios e a telemedicina conforme normas vigentes.',
      },
    ],
    helperText: 'Triagem rápida; seus dados de saúde são tratados com cuidado (LGPD).',
    justification: 'Conformidade LGPD e telemedicina.',
    legalLinks: [
      { label: 'Termos de Uso', href: '/termos' },
      { label: 'Política de Privacidade (LGPD)', href: '/politicas-lgpd' },
      { label: 'Uso de Inteligência Artificial', href: '/uso-ia' },
      { label: 'Telemedicina', href: '/telemedicina' },
    ],
  },

  {
    name: 'altura',
    type: 'input',
    label: 'Qual sua altura?',
    placeholder: 'Ex: 170',
    required: true,
    helperText: 'Centímetros (ex.: 170 para 1,70 m).',
    justification: 'IMC e elegibilidade.',
  },
  {
    name: 'peso',
    type: 'input',
    label: 'Qual seu peso atual?',
    placeholder: 'Ex: 85',
    required: true,
    helperText: 'Quilogramas.',
    justification: 'IMC e elegibilidade.',
  },
  {
    name: 'peso_meta',
    type: 'input',
    label: 'Qual seu peso-meta (objetivo)?',
    placeholder: 'Ex: 72',
    required: true,
    helperText: 'Quilogramas — estimativa de prazo no relatório depende da consulta.',
    justification: 'Personalização do relatório.',
  },

  {
    name: 'sexo',
    type: 'select',
    label: 'Sexo biológico',
    options: [
      { value: 'M', label: 'Masculino' },
      { value: 'F', label: 'Feminino' },
    ],
    required: true,
    helperText: 'Usado para critérios de segurança e gestação.',
    justification: 'Condicionais clínicas.',
  },

  {
    name: 'gestacao',
    type: 'select',
    label: 'Você está grávida ou planejando engravidar nos próximos 6 meses?',
    options: [
      { value: 'nao', label: 'Não' },
      { value: 'sim', label: 'Sim, estou grávida' },
      { value: 'planejando', label: 'Sim, estou planejando engravidar' },
    ],
    required: true,
    helperText: 'Medicações GLP-1 não são indicadas na gestação.',
    evidenceNote: 'Contraindicação importante para agonistas GLP-1.',
    justification: 'Segurança.',
    conditional: { field: 'sexo', value: 'F' },
  },

  {
    name: 'data_nascimento',
    type: 'date',
    label: 'Data de nascimento',
    required: true,
    helperText: 'Usamos para idade e adequação do programa.',
    justification: 'Perfil clínico.',
  },

  {
    name: 'comorbidades',
    type: 'multiselect',
    label: 'Condições de saúde (marque todas que se aplicam)',
    options: [
      { value: 'diabetes_tipo_2', label: 'Diabetes tipo 2' },
      { value: 'pre_diabetes', label: 'Pré-diabetes' },
      { value: 'hipertensao', label: 'Hipertensão' },
      { value: 'dislipidemia', label: 'Colesterol ou triglicerídeos altos' },
      { value: 'apneia_sono', label: 'Apneia do sono' },
      { value: 'artrose', label: 'Artrose ou artrite' },
      { value: 'depressao', label: 'Depressão ou ansiedade' },
      { value: 'refluxo', label: 'Refluxo gastroesofágico' },
      { value: 'asma', label: 'Asma / vias aéreas reativas' },
      { value: 'pcos', label: 'Síndrome dos ovários policísticos (PCOS)' },
      { value: 'hepatite_esteatose', label: 'Doença hepática gordurosa (esteatose)' },
      { value: 'nenhuma', label: 'Nenhuma dessas' },
    ],
    required: true,
    helperText: 'Ajuda a definir risco e caminhos mais seguros.',
    justification: 'Elegibilidade e relatório.',
  },

  {
    name: 'contraindicacoes_glp1',
    type: 'multiselect',
    label: 'Histórico importante — marque o que se aplica',
    options: [
      { value: 'pancreatite', label: 'Pancreatite prévia' },
      { value: 'neoplasia_endocrina', label: 'Neoplasia endócrina múltipla tipo 2 (MEN2)' },
      { value: 'cancer_tireoide', label: 'Câncer de tireoide medular ou histórico familiar relevante' },
      { value: 'doenca_renal_grave', label: 'Doença renal grave' },
      { value: 'alergia_glp1', label: 'Alergia conhecida a GLP-1' },
      { value: 'tireoide_nodulo_familiar', label: 'Histórico familiar de nódulo/câncer de tireoide (avaliar com médico)' },
      { value: 'nenhuma', label: 'Nenhuma dessas' },
    ],
    required: true,
    helperText: 'Contraindicações clássicas a agonistas GLP-1 — transparência para sua segurança.',
    justification: 'Segurança.',
  },

  {
    name: 'cirurgia_bariatrica_previa',
    type: 'select',
    label: 'Já fez cirurgia bariátrica ou outra cirurgia de emagrecimento?',
    options: [
      { value: 'nao', label: 'Não' },
      { value: 'sim', label: 'Sim' },
    ],
    required: true,
    helperText: 'O médico precisa desse contexto na consulta.',
    justification: 'Histórico cirúrgico.',
  },

  {
    name: 'uso_opioides_3meses',
    type: 'select',
    label: 'Nos últimos 3 meses, usou opioides prescritos ou substâncias opioides?',
    options: [
      { value: 'nao', label: 'Não' },
      { value: 'sim', label: 'Sim' },
    ],
    required: true,
    helperText: 'Informação de segurança; o médico avaliará na consulta.',
    justification: 'Triagem de segurança.',
  },

  {
    name: 'medicamentos_prescritos_atual',
    type: 'select',
    label: 'Usa medicamentos prescritos atualmente (para qualquer condição)?',
    options: [
      { value: 'nao', label: 'Não' },
      { value: 'sim', label: 'Sim' },
    ],
    required: true,
    justification: 'Interações e segurança.',
  },

  {
    name: 'uso_medicacao_emagrecimento_recente',
    type: 'select',
    label: 'Nos últimos 4 semanas, usou medicamento para emagrecimento?',
    options: [
      { value: 'nao', label: 'Não' },
      { value: 'glp1', label: 'Sim — linha GLP-1 (ex.: agonista injetável semanal)' },
      { value: 'outro', label: 'Sim — outro medicamento para peso' },
    ],
    required: true,
    helperText: 'Substitui lista antiga; alimenta o mesmo raciocínio clínico do relatório.',
    justification: 'Histórico terapêutico.',
  },

  {
    name: 'efeitos_colaterais_previos',
    type: 'select',
    label: 'Se já usou medicação para peso: teve efeitos que fizeram parar o tratamento?',
    options: [
      { value: 'nao_aplicavel', label: 'Não se aplica' },
      { value: 'nao_teve', label: 'Não tive efeitos relevantes' },
      { value: 'teve_mas_continuou', label: 'Tive, mas continuei' },
      { value: 'sim_parou', label: 'Sim — precisei parar' },
    ],
    required: true,
    conditional: {
      field: 'uso_medicacao_emagrecimento_recente',
      value: ['glp1', 'outro'],
    },
    justification: 'Tolerância prévia.',
  },

  {
    name: 'pressao_arterial_faixa',
    type: 'select',
    label: 'Como você classifica sua pressão arterial (última medição que lembra)?',
    options: [
      { value: 'otima', label: 'Melhor que 120/80 (ótima / normal)' },
      { value: 'elevada', label: '120–129 por menos de 80 (elevada)' },
      { value: 'estagio1', label: '130–139 ou 80–89 (hipertensão estágio 1)' },
      { value: 'estagio2', label: '140/90 ou maior (hipertensão estágio 2)' },
      { value: 'nao_sei', label: 'Não sei / não meço com frequência' },
    ],
    required: true,
    helperText: 'Não substitui aferição médica; ajuda o relatório e o médico no contexto.',
    justification: 'Risco cardiometabólico.',
  },

  {
    name: 'frequencia_cardiaca_repouso',
    type: 'select',
    label: 'Frequência cardíaca em repouso (batimentos por minuto), se souber',
    options: [
      { value: 'menos_60', label: 'Menos de 60 bpm' },
      { value: '60_80', label: '60–80 bpm' },
      { value: '81_100', label: '81–100 bpm' },
      { value: 'mais_100', label: 'Mais de 100 bpm' },
      { value: 'nao_sei', label: 'Não sei' },
    ],
    required: true,
    justification: 'Contexto clínico.',
  },

  {
    name: 'impacto_vida',
    type: 'select',
    label: 'O peso limita suas atividades do dia a dia?',
    options: [
      { value: 'muito', label: 'Muito' },
      { value: 'moderado', label: 'Moderado' },
      { value: 'pouco', label: 'Pouco' },
      { value: 'nenhum', label: 'Quase nada' },
    ],
    required: true,
    justification: 'Priorização no relatório.',
  },

  {
    name: 'objetivo_principal',
    type: 'select',
    label: 'Objetivo principal',
    options: [
      { value: 'perder_peso', label: 'Perder peso' },
      { value: 'melhorar_saude_metabolica', label: 'Melhorar saúde metabólica' },
      { value: 'ambos', label: 'Perder peso e saúde metabólica' },
      { value: 'outro', label: 'Outro — detalho na consulta' },
    ],
    required: true,
    justification: 'Foco do relatório.',
  },

  {
    name: 'preferencia_principio_ativo',
    type: 'select_cards',
    label: 'Preferência inicial de linha (a decisão final é sempre do médico)',
    helperText: 'Programa com avaliação; medicação original somente se indicada.',
    required: true,
    cardOptions: [
      {
        value: 'tirzepatida',
        title: 'Tirzepatida (original)',
        subtitle: 'Quando indicada na consulta.',
        priceHint: 'Estratégia de maior potência clínica, quando indicada.',
        badge: 'Potência em estudos',
      },
      {
        value: 'semaglutida',
        title: 'Semaglutida (original)',
        subtitle: 'Injetável ou oral conforme indicação médica.',
        priceHint: 'Estratégia intermediária, quando indicada.',
        badge: 'Amplamente estudada',
      },
      {
        value: 'contrave',
        title: 'Contrave® (bupropiona + naltrexona)',
        subtitle: 'Via oral, quando indicada — não é GLP-1.',
        priceHint: 'Alternativa oral para controle de apetite, quando indicada.',
        badge: 'Alternativa oral',
      },
      {
        value: 'nao_sei',
        title: 'Prefiro que o médico escolha',
        subtitle: 'Especialista define após histórico e exames.',
        priceHint: 'Recomendado se você quer neutralidade clínica.',
        badge: 'Decisão médica',
      },
    ],
  },
  {
    name: 'primeiro_nome',
    type: 'text',
    label: 'Como podemos te chamar?',
    placeholder: 'Como podemos te chamar?',
    required: true,
    helperText:
      'Agora vamos gerar seu relatório digital Me Joy. Informe seu nome para receber seu resumo personalizado e os próximos passos pelo canal oficial.',
    justification: 'Personalização.',
  },

  {
    name: 'whatsapp',
    type: 'input',
    label: 'WhatsApp (com DDD)',
    placeholder: '11999998888',
    required: true,
    helperText: 'Canal oficial Me Joy para envio do relatório e próximos passos.',
    justification: 'Contato pós-triagem.',
  },

  {
    name: 'consentimento_whatsapp',
    type: 'select',
    label: 'Autorização de contato pelo WhatsApp',
    description: 'Confirme para receber relatório e próximos passos no canal oficial.',
    required: true,
    options: [
      {
        value: 'autorizo',
        label:
          'Autorizo a Me Joy a enviar meu relatório, orientações e próximos passos pelo WhatsApp, conforme a Política de Privacidade.',
      },
    ],
    helperText: 'Você pode exercer seus direitos LGPD a qualquer momento.',
    justification: 'LGPD — contato no canal.',
    legalLinks: [
      { label: 'Política de Privacidade', href: '/politicas-lgpd' },
      { label: 'Telemedicina', href: '/telemedicina' },
    ],
  },
];
