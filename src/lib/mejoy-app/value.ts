export type MejoyProtocolSlug =
  | 'emagrecimento'
  | 'sono'
  | 'ansiedade'
  | 'intestino'
  | 'figado'
  | 'menopausa'
  | 'imunidade'
  | 'articulacoes'
  | 'calvicie'
  | 'libido-masculina';

export type MejoyRecommendedModule =
  | 'dashboard'
  | 'journey'
  | 'glp1'
  | 'meal-ai'
  | 'sleep'
  | 'rituals'
  | 'notifications'
  | 'exams'
  | 'consult'
  | 'bundle'
  | 'refill'
  | 'reports';

export type MejoyActivationState =
  | 'visitor'
  | 'buyer'
  | 'activated_patient'
  | 'care_active';

export type MejoyCareLane = 'glp1_integral' | 'whole_person_care';

export type ProductAppFeatureMatrixItem = {
  id: string;
  title: string;
  webValue: string;
  appValue: string;
  summary: string;
  featured: boolean;
};

export type ProductAppValue = {
  appIncluded: boolean;
  appTier: 'premium_full_access';
  headline: string;
  summary: string;
  featureMatrix: ProductAppFeatureMatrixItem[];
};

export type ProtocolContext = {
  primaryProtocolSlug: MejoyProtocolSlug;
  primaryProtocolTitle: string;
  careLane: MejoyCareLane;
  relatedProtocols: string[];
};

export type RecommendedAction = {
  label: string;
  href: string;
  reason: string;
};

export type EntitlementSnapshot = {
  generatedAt: string;
  accessLevel: 'full_app';
  activationState: MejoyActivationState;
  protocolContext: ProtocolContext;
  recommendedModules: MejoyRecommendedModule[];
  recommendedActions: RecommendedAction[];
  productAppValue: ProductAppValue;
};

const PROTOCOL_TITLES: Record<MejoyProtocolSlug, string> = {
  emagrecimento: 'Emagrecimento + saúde integral',
  sono: 'Sono e recuperação',
  ansiedade: 'Regulação emocional',
  intestino: 'Conforto digestivo',
  figado: 'Suporte hepatometabólico',
  menopausa: 'Hormonal feminino',
  imunidade: 'Base preventiva',
  articulacoes: 'Mobilidade e articulações',
  calvicie: 'Cuidado capilar',
  'libido-masculina': 'Vitalidade masculina',
};

const PROTOCOL_RELATED: Record<MejoyProtocolSlug, MejoyProtocolSlug[]> = {
  emagrecimento: ['sono', 'ansiedade', 'intestino', 'figado'],
  sono: ['ansiedade', 'emagrecimento', 'imunidade', 'intestino'],
  ansiedade: ['sono', 'emagrecimento', 'intestino', 'imunidade'],
  intestino: ['emagrecimento', 'figado', 'sono', 'ansiedade'],
  figado: ['emagrecimento', 'intestino', 'sono', 'imunidade'],
  menopausa: ['sono', 'emagrecimento', 'articulacoes', 'ansiedade'],
  imunidade: ['sono', 'intestino', 'emagrecimento', 'ansiedade'],
  articulacoes: ['emagrecimento', 'sono', 'imunidade', 'ansiedade'],
  calvicie: ['sono', 'ansiedade', 'imunidade', 'emagrecimento'],
  'libido-masculina': ['sono', 'emagrecimento', 'ansiedade', 'imunidade'],
};

const PRODUCT_SLUG_PROTOCOL_MAP: Partial<Record<string, MejoyProtocolSlug>> = {
  emagrecimento: 'emagrecimento',
  sono: 'sono',
  ansiedade: 'ansiedade',
  intestino: 'intestino',
  figado: 'figado',
  menopausa: 'menopausa',
  imunidade: 'imunidade',
  articulacoes: 'articulacoes',
  calvicie: 'calvicie',
  'libido-masculina': 'libido-masculina',
};

const OBJECTIVE_PROTOCOL_MAP: Partial<Record<string, MejoyProtocolSlug>> = {
  'emagrecimento metabolismo': 'emagrecimento',
  'emagrecimento & metabolismo': 'emagrecimento',
  sono: 'sono',
  'ansiedade humor': 'ansiedade',
  'ansiedade & humor': 'ansiedade',
  intestino: 'intestino',
  'detox figado': 'figado',
  'detox & figado': 'figado',
  'menopausa tpm': 'menopausa',
  'menopausa & tpm': 'menopausa',
  imunidade: 'imunidade',
  articulacoes: 'articulacoes',
  cabelo: 'calvicie',
  'hormonal libido': 'libido-masculina',
  'hormonal & libido': 'libido-masculina',
};

const APP_FEATURE_LIBRARY: ProductAppFeatureMatrixItem[] = [
  {
    id: 'dashboard',
    title: 'Dashboard adaptativo premium',
    webValue: 'Compra, triagem e jornada definidas com clareza.',
    appValue: 'Painel diário com score, risco, CTA e timeline viva.',
    summary: 'A home organiza o que fazer hoje e reduz dúvida clínica e operacional.',
    featured: true,
  },
  {
    id: 'glp1',
    title: 'Companion GLP-1 completo',
    webValue: 'Seu protocolo já nasce amarrado ao tratamento.',
    appValue: 'Peso, dose, titulação, sintomas, adesão e proteção de massa magra.',
    summary: 'A medicação deixa de ser isolada e passa a viver dentro da continuidade do cuidado.',
    featured: true,
  },
  {
    id: 'meal-ai',
    title: 'Meal AI e leitura de cardápio',
    webValue: 'A recomendação do produto conversa com alimentação real.',
    appValue: 'Foto, texto ou menu viram calorias, macros, risco e melhor escolha.',
    summary: 'Nutrição prática e contextual sem depender de planilhas ou apps paralelos.',
    featured: true,
  },
  {
    id: 'sleep',
    title: 'Sono e recuperação',
    webValue: 'Seu protocolo considera descanso e energia como parte do resultado.',
    appValue: 'Sync com wearable, score de recuperação e coaching de sono.',
    summary: 'Sono entra no tratamento como alavanca clínica, não como acessório.',
    featured: true,
  },
  {
    id: 'rituals',
    title: 'Rituais curtos guiados',
    webValue: 'O produto vende uma rotina, não só uma fórmula.',
    appValue: 'Protocolos de foco, craving, ansiedade e pré-sono em 2–10 minutos.',
    summary: 'Regulação emocional e consistência comportamental com baixa fricção.',
    featured: true,
  },
  {
    id: 'notifications',
    title: 'Notificações clínicas inteligentes',
    webValue: 'O cliente entende que existe continuidade real depois da compra.',
    appValue: 'Lembretes de dose, pesagem, refill, exames, sono e handoff.',
    summary: 'A experiência continua presente sem virar spam.',
    featured: true,
  },
  {
    id: 'exams',
    title: 'Hub de exames e documentos',
    webValue: 'A compra já promete organização clínica real.',
    appValue: 'Upload, OCR, resumo, checklist e timeline de exames.',
    summary: 'Documentos deixam de ficar perdidos em WhatsApp e galeria.',
    featured: false,
  },
  {
    id: 'consult',
    title: 'Concierge clínico e handoff',
    webValue: 'O produto mostra que existe cuidado assistido.',
    appValue: 'Solicitação de consulta, SLA, contexto clínico e continuidade segura.',
    summary: 'O cliente compra com confiança porque sabe qual é o próximo passo.',
    featured: true,
  },
  {
    id: 'bundle',
    title: 'Bundle clínico compartilhável',
    webValue: 'Mais valor para quem já tem médico ou quer segunda opinião.',
    appValue: 'Link seguro com exames, peso, sintomas, adesão e síntese.',
    summary: 'A informação do paciente vira contexto clínico utilizável.',
    featured: false,
  },
  {
    id: 'activation',
    title: 'Ativação web para app sem fricção',
    webValue: 'Todo produto vendido no web já entrega acesso ao app premium.',
    appValue: 'Checkout, deep link, ativação e painel personalizado no mesmo ecossistema.',
    summary: 'O app aumenta valor percebido do produto e sustenta retenção depois da compra.',
    featured: true,
  },
];

function normalizeKey(value: string | null | undefined) {
  return String(value ?? '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9- ]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

export function resolveProtocolSlug(params: {
  productSlug?: string | null;
  objective?: string | null;
  protocolSlug?: string | null;
}): MejoyProtocolSlug {
  const directProtocol = normalizeKey(params.protocolSlug);
  if (directProtocol && PRODUCT_SLUG_PROTOCOL_MAP[directProtocol]) {
    return PRODUCT_SLUG_PROTOCOL_MAP[directProtocol] as MejoyProtocolSlug;
  }

  const productSlug = normalizeKey(params.productSlug);
  if (productSlug && PRODUCT_SLUG_PROTOCOL_MAP[productSlug]) {
    return PRODUCT_SLUG_PROTOCOL_MAP[productSlug] as MejoyProtocolSlug;
  }

  const objective = normalizeKey(params.objective);
  if (objective && OBJECTIVE_PROTOCOL_MAP[objective]) {
    return OBJECTIVE_PROTOCOL_MAP[objective] as MejoyProtocolSlug;
  }

  return 'emagrecimento';
}

export function buildProtocolContext(params: {
  productSlug?: string | null;
  objective?: string | null;
  protocolSlug?: string | null;
}): ProtocolContext {
  const primaryProtocolSlug = resolveProtocolSlug(params);
  return {
    primaryProtocolSlug,
    primaryProtocolTitle: PROTOCOL_TITLES[primaryProtocolSlug],
    careLane: primaryProtocolSlug === 'emagrecimento' ? 'glp1_integral' : 'whole_person_care',
    relatedProtocols: PROTOCOL_RELATED[primaryProtocolSlug],
  };
}

export function buildProductAppValue(params: {
  productSlug?: string | null;
  objective?: string | null;
  protocolSlug?: string | null;
  productName?: string | null;
}): ProductAppValue {
  const protocolContext = buildProtocolContext(params);
  const label = params.productName?.trim() || PROTOCOL_TITLES[protocolContext.primaryProtocolSlug];

  return {
    appIncluded: true,
    appTier: 'premium_full_access',
    headline: 'Ganhe acesso ao App MeJoy Premium em cada compra.',
    summary: `${label} não entrega só o produto: entrega também o app nativo MeJoy com dashboard adaptativo, continuidade clínica, saúde integral e acompanhamento individualizado.`,
    featureMatrix: APP_FEATURE_LIBRARY,
  };
}

export function buildRecommendedModules(params: {
  protocolContext: ProtocolContext;
  riskLevel?: 'low' | 'attention' | 'high' | null;
  hasRecentSleepSignal?: boolean;
  hasRecentExams?: boolean;
  hasRefillFlow?: boolean;
}): MejoyRecommendedModule[] {
  const modules: MejoyRecommendedModule[] = ['dashboard', 'journey', 'notifications', 'reports', 'consult'];

  if (params.protocolContext.primaryProtocolSlug === 'emagrecimento') {
    modules.push('glp1', 'meal-ai', 'sleep', 'rituals', 'refill', 'exams', 'bundle');
  } else {
    modules.push('sleep', 'rituals', 'meal-ai', 'exams', 'bundle');
  }

  if (params.hasRecentSleepSignal) {
    modules.push('sleep', 'rituals');
  }

  if (params.hasRecentExams) {
    modules.push('exams', 'bundle');
  }

  if (params.hasRefillFlow) {
    modules.push('refill');
  }

  if (params.riskLevel === 'high') {
    modules.unshift('consult');
  }

  return [...new Set(modules)];
}

export function buildRecommendedActions(params: {
  activationState: MejoyActivationState;
  protocolContext: ProtocolContext;
  riskLevel?: 'low' | 'attention' | 'high' | null;
  hasRefillFlow?: boolean;
}): RecommendedAction[] {
  if (params.activationState === 'visitor') {
    return [
      {
        label: 'Fazer avaliação gratuita',
        href: '/onboarding',
        reason: 'Comece pela triagem e pela recomendação do melhor programa para o seu momento.',
      },
      {
        label: 'Abrir checkout do programa',
        href: '/onboarding',
        reason: 'Seu acesso ao app premium já nasce junto com a compra do produto MeJoy.',
      },
    ];
  }

  const actions: RecommendedAction[] = [
    {
      label: 'Abrir minha jornada',
      href: '/journey',
      reason: 'Veja peso, adesão, sinais e próximos passos no mesmo lugar.',
    },
    {
      label: 'Abrir rituais',
      href: '/rituals',
      reason: 'Use micro-práticas para foco, craving, ansiedade ou proteção do sono.',
    },
  ];

  if (params.riskLevel === 'high') {
    actions.unshift({
      label: 'Solicitar concierge clínico',
      href: '/consult-request',
      reason: 'Seu cenário atual pede revisão humana antes do próximo ajuste.',
    });
  }

  if (params.protocolContext.primaryProtocolSlug === 'emagrecimento') {
    actions.unshift({
      label: 'Registrar peso e dose',
      href: '/journey',
      reason: 'A jornada metabólica ganha precisão quando peso, dose e sintomas ficam atualizados.',
    });
  }

  if (params.hasRefillFlow) {
    actions.push({
      label: 'Solicitar refill',
      href: '/refill-request',
      reason: 'Evite interrupções do plano com reposição pedida no momento certo.',
    });
  }

  return actions.slice(0, 4);
}

export function buildEntitlementSnapshot(params: {
  email?: string | null;
  productSlug?: string | null;
  objective?: string | null;
  protocolSlug?: string | null;
  productName?: string | null;
  recentOrdersCount?: number;
  recentReportsCount?: number;
  riskLevel?: 'low' | 'attention' | 'high' | null;
  hasRecentSleepSignal?: boolean;
  hasRecentExams?: boolean;
  hasRefillFlow?: boolean;
}): EntitlementSnapshot {
  const protocolContext = buildProtocolContext(params);
  const recentOrdersCount = params.recentOrdersCount ?? 0;
  const recentReportsCount = params.recentReportsCount ?? 0;

  const activationState: MejoyActivationState = !params.email
    ? 'visitor'
    : recentReportsCount > 0
      ? 'care_active'
      : recentOrdersCount > 0
        ? 'activated_patient'
        : 'buyer';

  const productAppValue = buildProductAppValue({
    productSlug: params.productSlug,
    objective: params.objective,
    protocolSlug: params.protocolSlug,
    productName: params.productName,
  });

  const recommendedModules = buildRecommendedModules({
    protocolContext,
    riskLevel: params.riskLevel,
    hasRecentSleepSignal: params.hasRecentSleepSignal,
    hasRecentExams: params.hasRecentExams,
    hasRefillFlow: params.hasRefillFlow,
  });

  return {
    generatedAt: new Date().toISOString(),
    accessLevel: 'full_app',
    activationState,
    protocolContext,
    recommendedModules,
    recommendedActions: buildRecommendedActions({
      activationState,
      protocolContext,
      riskLevel: params.riskLevel,
      hasRefillFlow: params.hasRefillFlow,
    }),
    productAppValue,
  };
}
