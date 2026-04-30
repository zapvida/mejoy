/**
 * Mocks completos para o admin - 5000 leads, 10000 vendas, funil completo
 * Usado quando APIs falham (401, 500) para demonstração
 */

const PRODUCTS = [
  'emagrecimento',
  'calvicie',
  'sono',
  'ansiedade',
  'intestino',
  'figado',
  'libido-masculina',
  'menopausa',
  'articulacoes',
  'imunidade',
  'geral',
];

const PRODUCT_LABELS: Record<string, string> = {
  emagrecimento: 'Emagrecimento',
  calvicie: 'Calvície',
  sono: 'Sono',
  ansiedade: 'Ansiedade',
  intestino: 'Intestino',
  figado: 'Fígado',
  'libido-masculina': 'Libido Masculina',
  menopausa: 'Menopausa',
  articulacoes: 'Articulações',
  imunidade: 'Imunidade',
  geral: 'Geral',
};

const STEPS = [
  'triage_started',
  'triage_completed',
  'report_ready',
  'checkout_started',
  'paid',
];

const STEP_LABELS: Record<string, string> = {
  triage_started: 'Triagem iniciada',
  triage_completed: 'Triagem concluída',
  report_ready: 'Relatório pronto',
  checkout_started: 'Checkout iniciado',
  paid: 'Pago',
};

const NOMES = [
  'Ana', 'Bruno', 'Carla', 'Diego', 'Elena', 'Felipe', 'Gabriela', 'Henrique',
  'Isabela', 'João', 'Karina', 'Lucas', 'Mariana', 'Nicolas', 'Olivia', 'Pedro',
  'Rafaela', 'Samuel', 'Tatiana', 'Vitor', 'Amanda', 'Bernardo', 'Camila',
];

function randomItem<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function getMockLeads(count = 5000): Array<{
  profileId: string;
  name: string;
  email: string;
  whatsapp: string;
  productSlug: string;
  productLabel: string;
  currentStep: string;
  currentStepLabel: string;
  enteredAt: string;
  updatedAt: string;
}> {
  const leads: Array<any> = [];
  const now = Date.now();
  for (let i = 0; i < Math.min(count, 200); i++) {
    const product = randomItem(PRODUCTS);
    const step = randomItem(STEPS);
    const daysAgo = randomInt(0, 90);
    const updated = new Date(now - daysAgo * 24 * 60 * 60 * 1000);
    leads.push({
      profileId: `mock-${i + 1}`,
      name: `${randomItem(NOMES)} ${randomItem(NOMES)}`,
      email: `lead${i + 1}***@email.com`,
      whatsapp: `11****${String(i).padStart(4, '0')}`,
      productSlug: product,
      productLabel: PRODUCT_LABELS[product] || product,
      currentStep: step,
      currentStepLabel: STEP_LABELS[step] || step,
      enteredAt: updated.toISOString(),
      updatedAt: updated.toISOString(),
    });
  }
  return leads.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
}

export function getMockKPIs(period: string) {
  const mult = period === 'today' ? 0.05 : period === '7d' ? 0.25 : 1;
  const mrr = 847000 * mult;
  const subs = 1247 * mult;
  return {
    mrr,
    revenueToday: 4200 * (period === 'today' ? 1 : 0.1),
    revenueThisMonth: 847000 * mult,
    revenueGrowth: 12.4,
    activeSubscriptions: Math.round(subs),
    newSubscriptionsToday: period === 'today' ? 23 : 0,
    churnRate: 2.1,
    arpu: 679,
    ltv: 8148,
    totalUsers: 12450,
    newUsersToday: period === 'today' ? 156 : 0,
    activeUsersToday: period === 'today' ? 892 : 0,
    retentionRate: 87.3,
    totalTriages: 28450 * mult,
    triagesToday: period === 'today' ? 342 : 0,
    completionRate: 68.5,
    totalReports: 19500 * mult,
    reportsToday: period === 'today' ? 234 : 0,
    avgReportScore: 78.2,
  };
}

export function getMockFunnel(period: string) {
  const mult = period === 'today' ? 0.03 : period === '7d' ? 0.2 : 1;
  const homepageViews = Math.round(125000 * mult);
  const triageStarts = Math.round(45000 * mult);
  const triageCompletions = Math.round(30800 * mult);
  const reportViews = Math.round(28500 * mult);
  const pricingViews = Math.round(14200 * mult);
  const checkoutStarts = Math.round(8500 * mult);
  const subscriptions = Math.round(4200 * mult);

  return {
    homepageViews,
    triageStarts,
    triageCompletions,
    reportViews,
    pricingViews,
    checkoutStarts,
    subscriptions,
    homepageToTriage: triageStarts > 0 ? (triageStarts / homepageViews) * 100 : 0,
    triageToCompletion: triageStarts > 0 ? (triageCompletions / triageStarts) * 100 : 0,
    completionToReport: triageCompletions > 0 ? (reportViews / triageCompletions) * 100 : 0,
    reportToPricing: reportViews > 0 ? (pricingViews / reportViews) * 100 : 0,
    pricingToCheckout: pricingViews > 0 ? (checkoutStarts / pricingViews) * 100 : 0,
    checkoutToSubscription: checkoutStarts > 0 ? (subscriptions / checkoutStarts) * 100 : 0,
    avgTimeToTriage: 2.4,
    avgTimeToCompletion: 8.7,
    avgTimeToSubscription: 45.2,
  };
}

export function getMockRevenue(period: string) {
  const mult = period === 'today' ? 0.02 : period === '7d' ? 0.25 : 1;
  return {
    revenueToday: 4200 * (period === 'today' ? 1 : 0.1),
    revenueThisWeek: 29500 * (period === '7d' ? 1 : 0.3),
    revenueThisMonth: 847000 * mult,
    revenueThisYear: 10164000 * mult,
    basicMonthly: 254000 * mult,
    plusMonthly: 593000 * mult,
    basicYearly: 120000 * mult,
    plusYearly: 280000 * mult,
    stripeRevenue: 847000 * mult,
    projectedMonthlyRevenue: 932000,
    projectedYearlyRevenue: 11184000,
  };
}

export function getMockProduct(_period: string) {
  const types = PRODUCTS.filter((p) => p !== 'geral');
  return {
    period: _period,
    triagesByType: types.map((t) => ({
      type: PRODUCT_LABELS[t] || t,
      count: randomInt(800, 3500),
      completionRate: randomInt(55, 85),
      avgScore: randomInt(70, 88),
    })),
    completionRate: 68.5,
    avgTriageTime: 6.2,
    reportsPerDay: 234,
    cohorts: { d7: 72.3, d30: 58.1 },
  };
}

export function getMockTech() {
  return {
    apiUptime: 99.97,
    avgResponseTime: 142,
    errorRate: 0.12,
    dbConnections: 12,
    dbResponseTime: 8,
    dbSize: 2.4 * 1024 * 1024 * 1024,
    openaiStatus: 'healthy' as const,
    stripeStatus: 'healthy' as const,
    supabaseStatus: 'healthy' as const,
    lighthouseScore: 94,
  };
}

export function getMockActivities(limit = 10) {
  const activities: Array<{ id: string; type: string; title: string; status: string; statusLabel: string; at: string }> = [];
  const now = Date.now();
  for (let i = 0; i < limit; i++) {
    const product = randomItem(PRODUCTS);
    const completed = Math.random() > 0.3;
    const minsAgo = randomInt(5, 180);
    activities.push({
      id: `act-${i}`,
      type: 'triage',
      title: `${randomItem(NOMES)} • ${PRODUCT_LABELS[product] || product}`,
      status: completed ? 'completed' : 'started',
      statusLabel: completed ? 'Concluído' : 'Em andamento',
      at: new Date(now - minsAgo * 60 * 1000).toISOString(),
    });
  }
  return activities.sort((a, b) => new Date(b.at).getTime() - new Date(a.at).getTime());
}

export function getMockAlerts() {
  return [
    { id: 'a1', ruleId: 'r1', at: new Date(), severity: 'P1' as const, message: 'Taxa de conclusão 2% abaixo da média', status: 'open' as const },
  ];
}

/** Funil por produto: chegada → início triagem → triagem preenchida → compra */
export function getMockFunnelsByProduct(period: string) {
  const mult = period === 'today' ? 0.03 : period === '7d' ? 0.2 : 1;
  const products = PRODUCTS.filter((p) => p !== 'geral');
  const bases = [4200, 3800, 3500, 2900, 2600, 2400, 1800, 1500, 1200, 900];
  return products.map((slug, i) => {
    const base = (bases[i % bases.length] || 2000) * mult;
    const chegada = Math.round(base * 4.2);
    const inicioTriagem = Math.round(chegada * 0.36);
    const triagemPreenchida = Math.round(inicioTriagem * 0.72);
    const compra = Math.round(triagemPreenchida * 0.12);
    return {
      productSlug: slug,
      productLabel: PRODUCT_LABELS[slug] || slug,
      chegada,
      inicioTriagem,
      triagemPreenchida,
      compra,
      taxaChegadaTriagem: chegada > 0 ? (inicioTriagem / chegada) * 100 : 0,
      taxaTriagemPreenchida: inicioTriagem > 0 ? (triagemPreenchida / inicioTriagem) * 100 : 0,
      taxaPreenchidaCompra: triagemPreenchida > 0 ? (compra / triagemPreenchida) * 100 : 0,
    };
  });
}
