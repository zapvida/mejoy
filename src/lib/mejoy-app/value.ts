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
  | 'reports'
  | 'prevention'
  | 'goals'
  | 'referral'
  | 'specialist';

export type MejoyActivationState =
  | 'visitor'
  | 'buyer'
  | 'activated_patient'
  | 'care_active';

export type MejoyCareLane = 'glp1_integral' | 'whole_person_care';

export type MejoyPlanId = 'visitor_preview' | 'programa_1m' | 'programa_3m' | 'programa_6m';

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

export type TierEntitlement = {
  planId: MejoyPlanId;
  durationMonths: number;
  unlockedFeatures: MejoyRecommendedModule[];
  includedCare: string[];
  deviceRewardEligible: boolean;
  specialistChannelEligible: boolean;
};

export type EntitlementSnapshot = {
  generatedAt: string;
  accessLevel: 'full_app';
  activationState: MejoyActivationState;
  protocolContext: ProtocolContext;
  recommendedModules: MejoyRecommendedModule[];
  recommendedActions: RecommendedAction[];
  productAppValue: ProductAppValue;
  planId: MejoyPlanId;
  durationMonths: number;
  unlockedFeatures: MejoyRecommendedModule[];
  includedCare: string[];
  specialistChannelEligible: boolean;
  deviceRewardEligible: boolean;
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
    title: 'Dashboard adaptativo + índice 0–100',
    webValue: 'A compra no web já prepara uma jornada com objetivo e contexto.',
    appValue: 'Painel diário com score, risco, próximo passo e evolução longitudinal em linguagem clara.',
    summary: 'A home vira o cockpit do paciente, com direção visível em vez de caos clínico.',
    featured: true,
  },
  {
    id: 'glp1',
    title: 'Jornada GLP-1 longitudinal',
    webValue: 'Produto e protocolo deixam de ser isolados.',
    appValue: 'Peso, dose, sintomas, adesão e refill vivem em uma linha contínua de cuidado.',
    summary: 'A jornada metabólica ganha estrutura, frequência e feedback útil.',
    featured: true,
  },
  {
    id: 'meal-ai',
    title: 'Meal AI com foto, texto e cardápio',
    webValue: 'A continuidade do produto conversa com a vida real do paciente.',
    appValue: 'Foto ou texto viram leitura prática de calorias, risco e melhor escolha para a fase atual.',
    summary: 'Nutrição deixa de ser teoria e entra no momento real da decisão.',
    featured: true,
  },
  {
    id: 'sleep',
    title: 'Sono + recuperação',
    webValue: 'O tratamento passa a considerar energia e recuperação como base de resultado.',
    appValue: 'Sono sincronizado, score de recuperação e coaching com linguagem simples.',
    summary: 'O app mostra como sono muda fome, energia e capacidade de seguir o plano.',
    featured: true,
  },
  {
    id: 'rituals',
    title: 'Rituais guiados curtos',
    webValue: 'O web não vende só fórmula: vende rotina utilizável.',
    appValue: 'Micro-áudios para foco, craving, ansiedade e pré-sono em poucos minutos.',
    summary: 'Baixa fricção para regulação emocional e aderência diária.',
    featured: true,
  },
  {
    id: 'consult',
    title: 'Consulta e concierge clínico',
    webValue: 'Mais confiança porque o cliente enxerga continuidade assistida.',
    appValue: 'Solicitação com SLA, contexto clínico, handoff e próxima ação clara.',
    summary: 'O paciente sabe onde pedir ajuda e o que esperar.',
    featured: true,
  },
  {
    id: 'notifications',
    title: 'Notificações clínicas inteligentes',
    webValue: 'A jornada continua viva depois da compra.',
    appValue: 'Pesagem, dose, refill, sono, exame e rituais chegam no timing certo.',
    summary: 'Presença útil sem virar spam ou ruído.',
    featured: true,
  },
  {
    id: 'prevention',
    title: 'Checklist de prevenção e rastreio',
    webValue: 'A proposta evolui de tratamento para saúde integral preventiva.',
    appValue: 'Rastreios, checkups e revisões por idade, sexo e risco com linguagem governada.',
    summary: 'O app ensina a cuidar quando a pessoa ainda está bem, não só quando já piorou.',
    featured: true,
  },
  {
    id: 'exams',
    title: 'Hub de exames',
    webValue: 'Documentos passam a fazer parte do valor percebido do produto.',
    appValue: 'Upload, resumo, OCR assistivo e timeline clínica no mesmo lugar.',
    summary: 'Exames deixam de ficar espalhados em WhatsApp e galeria.',
    featured: true,
  },
  {
    id: 'reports',
    title: 'Relatórios + bundle clínico',
    webValue: 'O ecossistema web ganha poder de continuidade e compartilhamento.',
    appValue: 'Relatórios MeJoy, bundle seguro e contexto pronto para médico externo.',
    summary: 'A informação vira material clínico utilizável e reaproveitável.',
    featured: true,
  },
];

const LOCKABLE_MODULES: MejoyRecommendedModule[] = [
  'dashboard',
  'journey',
  'glp1',
  'meal-ai',
  'sleep',
  'rituals',
  'consult',
  'notifications',
  'prevention',
  'exams',
  'reports',
  'goals',
  'referral',
  'specialist',
  'bundle',
  'refill',
];

const PLAN_UNLOCKS: Record<MejoyPlanId, TierEntitlement> = {
  visitor_preview: {
    planId: 'visitor_preview',
    durationMonths: 0,
    unlockedFeatures: ['dashboard'],
    includedCare: [],
    deviceRewardEligible: false,
    specialistChannelEligible: false,
  },
  programa_1m: {
    planId: 'programa_1m',
    durationMonths: 1,
    unlockedFeatures: ['dashboard', 'journey', 'glp1', 'meal-ai', 'goals', 'refill'],
    includedCare: ['rotina guiada pelo app', 'suporte operacional básico'],
    deviceRewardEligible: false,
    specialistChannelEligible: false,
  },
  programa_3m: {
    planId: 'programa_3m',
    durationMonths: 3,
    unlockedFeatures: ['dashboard', 'journey', 'glp1', 'meal-ai', 'sleep', 'rituals', 'consult', 'goals', 'refill'],
    includedCare: ['concierge clínico', 'continuidade assistida', 'rituais e recuperação'],
    deviceRewardEligible: false,
    specialistChannelEligible: false,
  },
  programa_6m: {
    planId: 'programa_6m',
    durationMonths: 6,
    unlockedFeatures: [
      'dashboard',
      'journey',
      'glp1',
      'meal-ai',
      'sleep',
      'rituals',
      'consult',
      'notifications',
      'prevention',
      'exams',
      'reports',
      'bundle',
      'refill',
      'goals',
      'referral',
      'specialist',
    ],
    includedCare: [
      'concierge multidisciplinar',
      'canal premium ativado pela equipe',
      'hub preventivo com rastreio governado',
    ],
    deviceRewardEligible: true,
    specialistChannelEligible: true,
  },
};

function normalizeKey(value: string | null | undefined) {
  return String(value ?? '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9- ]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function matchesPlan(value: string, variants: string[]) {
  return variants.some((variant) => value.includes(variant));
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

export function resolvePlanId(params: {
  activationState?: MejoyActivationState;
  planSlug?: string | null;
  productName?: string | null;
}) {
  const candidate = normalizeKey([params.planSlug, params.productName].filter(Boolean).join(' '));

  if (matchesPlan(candidate, ['6 meses', '6m', 'programa 6m', 'plano 6m'])) {
    return 'programa_6m' as const;
  }

  if (matchesPlan(candidate, ['3 meses', '3m', 'programa 3m', 'plano 3m'])) {
    return 'programa_3m' as const;
  }

  if (matchesPlan(candidate, ['1 mes', '1m', 'um mes', 'programa 1m', 'plano 1m'])) {
    return 'programa_1m' as const;
  }

  if (params.activationState === 'visitor') {
    return 'visitor_preview' as const;
  }

  return 'programa_3m' as const;
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

export function buildTierEntitlement(params: {
  activationState: MejoyActivationState;
  planSlug?: string | null;
  productName?: string | null;
}): TierEntitlement {
  const planId = resolvePlanId({
    activationState: params.activationState,
    planSlug: params.planSlug,
    productName: params.productName,
  });

  if (params.activationState === 'visitor') {
    return PLAN_UNLOCKS.visitor_preview;
  }

  return PLAN_UNLOCKS[planId];
}

export function buildLockedFeatures(tier: TierEntitlement) {
  return LOCKABLE_MODULES.filter((feature) => !tier.unlockedFeatures.includes(feature));
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
    summary: `${label} entrega produto, protocolo e continuidade nativa no mesmo ecossistema, com score diário, prevenção, concierge e leitura prática da rotina.`,
    featureMatrix: APP_FEATURE_LIBRARY,
  };
}

export function buildRecommendedModules(params: {
  protocolContext: ProtocolContext;
  tier: TierEntitlement;
  riskLevel?: 'low' | 'attention' | 'high' | null;
  hasRecentSleepSignal?: boolean;
  hasRecentExams?: boolean;
  hasRefillFlow?: boolean;
}): MejoyRecommendedModule[] {
  const modules: MejoyRecommendedModule[] = ['dashboard'];

  if (params.tier.unlockedFeatures.includes('journey')) {
    modules.push('journey');
  }

  if (params.protocolContext.primaryProtocolSlug === 'emagrecimento') {
    modules.push('glp1', 'meal-ai', 'goals');
  } else {
    modules.push('goals', 'sleep', 'rituals');
  }

  if (params.hasRecentSleepSignal) {
    modules.push('sleep');
  }

  if (params.riskLevel === 'high') {
    modules.unshift('consult');
  }

  if (params.hasRecentExams) {
    modules.push('exams', 'reports', 'bundle');
  }

  if (params.hasRefillFlow) {
    modules.push('refill');
  }

  if (params.tier.durationMonths >= 3) {
    modules.push('sleep', 'rituals', 'consult');
  }

  if (params.tier.durationMonths >= 6) {
    modules.push('notifications', 'prevention', 'exams', 'reports', 'bundle', 'referral');
    if (params.tier.specialistChannelEligible) {
      modules.push('specialist');
    }
  }

  const unlocked = new Set(params.tier.unlockedFeatures);
  return [...new Set(modules)].filter((module) => unlocked.has(module));
}

export function buildRecommendedActions(params: {
  activationState: MejoyActivationState;
  protocolContext: ProtocolContext;
  tier: TierEntitlement;
  riskLevel?: 'low' | 'attention' | 'high' | null;
  hasRefillFlow?: boolean;
}): RecommendedAction[] {
  if (params.activationState === 'visitor') {
    return [
      {
        label: 'Fazer avaliação gratuita',
        href: '/onboarding',
        reason: 'Comece pela leitura clínica para descobrir qual programa e qual janela fazem mais sentido agora.',
      },
      {
        label: 'Ver benefícios do plano de 6 meses',
        href: '/premium-benefits',
        reason: 'Compare o valor do cuidado contínuo antes de entrar no checkout.',
      },
    ];
  }

  const actions: RecommendedAction[] = [];

  if (params.riskLevel === 'high' && params.tier.unlockedFeatures.includes('consult')) {
    actions.push({
      label: 'Solicitar concierge clínico',
      href: '/consult-request',
      reason: 'Seu cenário atual pede revisão humana antes do próximo ajuste.',
    });
  }

  if (params.protocolContext.primaryProtocolSlug === 'emagrecimento') {
    actions.push({
      label: 'Registrar peso e dose',
      href: '/journey',
      reason: 'Atualizar peso, dose e sinais melhora a precisão do score e da jornada longitudinal.',
    });
  }

  if (params.tier.unlockedFeatures.includes('prevention')) {
    actions.push({
      label: 'Revisar checklist preventivo',
      href: '/prevention-checklist',
      reason: 'O cuidado preventivo do mês precisa estar visível e sem fricção.',
    });
  } else if (params.tier.planId !== 'programa_6m') {
    actions.push({
      label: 'Desbloquear cuidado preventivo completo',
      href: '/premium-benefits',
      reason: 'Os planos mais longos liberam rastreio, exames, notificações e continuidade premium.',
    });
  }

  if (params.hasRefillFlow && params.tier.unlockedFeatures.includes('refill')) {
    actions.push({
      label: 'Solicitar refill',
      href: '/refill-request',
      reason: 'Abra a reposição cedo para manter a rotina sem interrupção operacional.',
    });
  }

  if (params.tier.specialistChannelEligible) {
    actions.push({
      label: 'Pedir ativação do canal premium',
      href: '/specialist-request',
      reason: 'Quando o plano já cobre cuidado premium, a equipe pode ativar a melhor linha para seu caso.',
    });
  }

  if (!actions.length) {
    actions.push({
      label: 'Abrir minha jornada',
      href: '/journey',
      reason: 'A jornada organiza o que fazer hoje e reduz atrito entre intenção e execução.',
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
  planSlug?: string | null;
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

  const tier = buildTierEntitlement({
    activationState,
    planSlug: params.planSlug,
    productName: params.productName,
  });

  const productAppValue = buildProductAppValue({
    productSlug: params.productSlug,
    objective: params.objective,
    protocolSlug: params.protocolSlug,
    productName: params.productName,
  });

  const recommendedModules = buildRecommendedModules({
    protocolContext,
    tier,
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
      tier,
      riskLevel: params.riskLevel,
      hasRefillFlow: params.hasRefillFlow,
    }),
    productAppValue,
    planId: tier.planId,
    durationMonths: tier.durationMonths,
    unlockedFeatures: tier.unlockedFeatures,
    includedCare: tier.includedCare,
    specialistChannelEligible: tier.specialistChannelEligible,
    deviceRewardEligible: tier.deviceRewardEligible,
  };
}
