// src/lib/admin-queries.ts
// Queries otimizadas e agregadas para o dashboard admin

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export interface KPIData {
  // Receita
  mrr: number;
  revenueToday: number;
  revenueThisMonth: number;
  revenueGrowth: number;
  
  // Assinaturas
  activeSubscriptions: number;
  newSubscriptionsToday: number;
  churnRate: number;
  
  // ARPU/LTV
  arpu: number;
  ltv: number;
  
  // Usuários
  totalUsers: number;
  newUsersToday: number;
  activeUsersToday: number;
  retentionRate: number;
  
  // Triagens
  totalTriages: number;
  triagesToday: number;
  completionRate: number;
  
  // Relatórios
  totalReports: number;
  reportsToday: number;
  avgReportScore: number;
}

export async function getKPIs(period: string = '30d'): Promise<KPIData> {
  const now = new Date();
  const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  
  let periodStart: Date;
  switch (period) {
    case 'today':
      periodStart = startOfDay;
      break;
    case '7d':
      periodStart = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      break;
    case '30d':
      periodStart = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      break;
    default:
      periodStart = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
  }

  // Executar queries em paralelo
  const [
    // Receita
    revenueToday,
    revenueThisMonth,
    revenuePreviousMonth,
    
    // Assinaturas
    activeSubscriptions,
    newSubscriptionsToday,
    cancelledSubscriptions,
    
    // Usuários
    totalUsers,
    newUsersToday,
    activeUsersToday,
    
    // Triagens
    totalTriages,
    triagesToday,
    completedTriages,
    
    // Relatórios
    totalReports,
    reportsToday,
    avgScoreData,
  ] = await Promise.all([
    // Receita hoje
    prisma.subscription.aggregate({
      _sum: { amount: true },
      where: {
        status: 'active',
        created_at: { gte: startOfDay }
      }
    }),
    
    // Receita este mês
    prisma.subscription.aggregate({
      _sum: { amount: true },
      where: {
        status: 'active',
        created_at: { gte: startOfMonth }
      }
    }),
    
    // Receita mês anterior
    prisma.subscription.aggregate({
      _sum: { amount: true },
      where: {
        status: 'active',
        created_at: {
          gte: new Date(startOfMonth.getTime() - 30 * 24 * 60 * 60 * 1000),
          lt: startOfMonth
        }
      }
    }),
    
    // Assinaturas ativas
    prisma.subscription.count({
      where: { status: 'active' }
    }),
    
    // Novas assinaturas hoje
    prisma.subscription.count({
      where: {
        status: 'active',
        created_at: { gte: startOfDay }
      }
    }),
    
    // Assinaturas canceladas
    prisma.subscription.count({
      where: {
        status: 'cancelled',
        cancelledAt: { gte: periodStart }
      }
    }),
    
    // Total de usuários
    prisma.patient.count(),
    
    // Novos usuários hoje
    prisma.patient.count({
      where: { created_at: { gte: startOfDay } }
    }),
    
    // Usuários ativos hoje (com triagem ou relatório)
    prisma.patient.count({
      where: {
        OR: [
          { triages: { some: { created_at: { gte: startOfDay } } } },
          { reports: { some: { created_at: { gte: startOfDay } } } }
        ]
      }
    }),
    
    // Total de triagens
    prisma.triage.count(),
    
    // Triagens hoje
    prisma.triage.count({
      where: { created_at: { gte: startOfDay } }
    }),
    
    // Triagens concluídas
    prisma.triage.count({
      where: { status: 'submitted' }
    }),
    
    // Total de relatórios
    prisma.report.count(),
    
    // Relatórios hoje
    prisma.report.count({
      where: { created_at: { gte: startOfDay } }
    }),
    
    // Score médio dos relatórios
    prisma.report.aggregate({
      _avg: { score: true },
      where: { score: { not: null } }
    }),
  ]);

  // Calcular métricas derivadas
  const revenueTodayValue = Number(revenueToday._sum.amount || 0);
  const revenueThisMonthValue = Number(revenueThisMonth._sum.amount || 0);
  const revenuePreviousMonthValue = Number(revenuePreviousMonth._sum.amount || 0);
  
  const revenueGrowth = revenuePreviousMonthValue > 0 
    ? ((revenueThisMonthValue - revenuePreviousMonthValue) / revenuePreviousMonthValue) * 100
    : 0;

  const churnRate = activeSubscriptions > 0 
    ? (cancelledSubscriptions / activeSubscriptions) * 100
    : 0;

  const completionRate = totalTriages > 0 
    ? (completedTriages / totalTriages) * 100
    : 0;

  const arpu = activeSubscriptions > 0 
    ? revenueThisMonthValue / activeSubscriptions
    : 0;

  const ltv = churnRate > 0 ? arpu / (churnRate / 100) : 0;

  const retentionRate = totalUsers > 0 
    ? (activeUsersToday / totalUsers) * 100
    : 0;

  return {
    mrr: revenueThisMonthValue,
    revenueToday: revenueTodayValue,
    revenueThisMonth: revenueThisMonthValue,
    revenueGrowth,
    activeSubscriptions,
    newSubscriptionsToday,
    churnRate,
    arpu,
    ltv,
    totalUsers,
    newUsersToday,
    activeUsersToday,
    retentionRate,
    totalTriages,
    triagesToday,
    completionRate,
    totalReports,
    reportsToday,
    avgReportScore: Number(avgScoreData._avg.score || 0),
  };
}

export interface FunnelData {
  homepageViews: number;
  triageStarts: number;
  triageCompletions: number;
  reportViews: number;
  pricingViews: number;
  checkoutStarts: number;
  subscriptions: number;
  
  // Taxas de conversão
  homepageToTriage: number;
  triageToCompletion: number;
  completionToReport: number;
  reportToPricing: number;
  pricingToCheckout: number;
  checkoutToSubscription: number;
  
  // Tempo médio entre etapas
  avgTimeToTriage: number;
  avgTimeToCompletion: number;
  avgTimeToSubscription: number;
}

export async function getFunnelData(period: string = '30d'): Promise<FunnelData> {
  const now = new Date();
  let periodStart: Date;
  
  switch (period) {
    case 'today':
      periodStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      break;
    case '7d':
      periodStart = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      break;
    case '30d':
      periodStart = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      break;
    default:
      periodStart = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
  }

  // Buscar dados do funil
  const [
    triageStarts,
    triageCompletions,
    reportViews,
    subscriptions,
  ] = await Promise.all([
    prisma.triage.count({
      where: { created_at: { gte: periodStart } }
    }),
    
    prisma.triage.count({
      where: { 
        status: 'submitted',
        created_at: { gte: periodStart }
      }
    }),
    
    prisma.report.count({
      where: { created_at: { gte: periodStart } }
    }),
    
    prisma.subscription.count({
      where: { 
        status: 'active',
        created_at: { gte: periodStart }
      }
    }),
  ]);

  // Estimativas baseadas em dados disponíveis
  const homepageViews = triageStarts * 3; // Estimativa: 3 views por start
  const pricingViews = subscriptions * 5; // Estimativa: 5 views por conversão
  const checkoutStarts = subscriptions * 1.2; // Estimativa: 20% de abandono

  // Calcular taxas de conversão
  const homepageToTriage = homepageViews > 0 ? (triageStarts / homepageViews) * 100 : 0;
  const triageToCompletion = triageStarts > 0 ? (triageCompletions / triageStarts) * 100 : 0;
  const completionToReport = triageCompletions > 0 ? (reportViews / triageCompletions) * 100 : 0;
  const reportToPricing = reportViews > 0 ? (pricingViews / reportViews) * 100 : 0;
  const pricingToCheckout = pricingViews > 0 ? (checkoutStarts / pricingViews) * 100 : 0;
  const checkoutToSubscription = checkoutStarts > 0 ? (subscriptions / checkoutStarts) * 100 : 0;

  return {
    homepageViews,
    triageStarts,
    triageCompletions,
    reportViews,
    pricingViews,
    checkoutStarts,
    subscriptions,
    homepageToTriage,
    triageToCompletion,
    completionToReport,
    reportToPricing,
    pricingToCheckout,
    checkoutToSubscription,
    avgTimeToTriage: 0, // TODO: Implementar cálculo de tempo
    avgTimeToCompletion: 0,
    avgTimeToSubscription: 0,
  };
}

export interface RevenueData {
  revenueToday: number;
  revenueThisWeek: number;
  revenueThisMonth: number;
  revenueThisYear: number;
  
  // Por plano
  basicMonthly: number;
  plusMonthly: number;
  basicYearly: number;
  plusYearly: number;
  
  // Por método de pagamento
  stripeRevenue: number;
  
  // Projeções
  projectedMonthlyRevenue: number;
  projectedYearlyRevenue: number;
}

export async function getRevenueData(period: string = '30d'): Promise<RevenueData> {
  const now = new Date();
  const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const startOfWeek = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const startOfYear = new Date(now.getFullYear(), 0, 1);

  const [
    revenueToday,
    revenueThisWeek,
    revenueThisMonth,
    revenueThisYear,
    revenueByPlan,
  ] = await Promise.all([
    prisma.subscription.aggregate({
      _sum: { amount: true },
      where: {
        status: 'active',
        created_at: { gte: startOfDay }
      }
    }),
    
    prisma.subscription.aggregate({
      _sum: { amount: true },
      where: {
        status: 'active',
        created_at: { gte: startOfWeek }
      }
    }),
    
    prisma.subscription.aggregate({
      _sum: { amount: true },
      where: {
        status: 'active',
        created_at: { gte: startOfMonth }
      }
    }),
    
    prisma.subscription.aggregate({
      _sum: { amount: true },
      where: {
        status: 'active',
        created_at: { gte: startOfYear }
      }
    }),
    
    prisma.subscription.groupBy({
      by: ['planType', 'planPrice'],
      _sum: { amount: true },
      where: { status: 'active' }
    }),
  ]);

  // Calcular receita por plano
  let basicMonthly = 0;
  let plusMonthly = 0;
  let basicYearly = 0;
  let plusYearly = 0;

  revenueByPlan.forEach(item => {
    const amount = Number(item._sum.amount || 0);
    if (item.planType === 'monthly' && item.planPrice === '29') {
      basicMonthly = amount;
    } else if (item.planType === 'monthly' && item.planPrice === '49') {
      plusMonthly = amount;
    } else if (item.planType === 'yearly' && item.planPrice === '290') {
      basicYearly = amount;
    } else if (item.planType === 'yearly' && item.planPrice === '490') {
      plusYearly = amount;
    }
  });

  // Projeções baseadas na média mensal
  const projectedMonthlyRevenue = Number(revenueThisMonth._sum.amount || 0);
  const projectedYearlyRevenue = projectedMonthlyRevenue * 12;

  return {
    revenueToday: Number(revenueToday._sum.amount || 0),
    revenueThisWeek: Number(revenueThisWeek._sum.amount || 0),
    revenueThisMonth: Number(revenueThisMonth._sum.amount || 0),
    revenueThisYear: Number(revenueThisYear._sum.amount || 0),
    basicMonthly,
    plusMonthly,
    basicYearly,
    plusYearly,
    stripeRevenue: Number(revenueThisMonth._sum.amount || 0), // Assumindo que tudo é Stripe
    projectedMonthlyRevenue,
    projectedYearlyRevenue,
  };
}

export interface ProductData {
  triagesByType: Array<{
    type: string;
    count: number;
    completionRate: number;
    avgScore: number;
  }>;
  completionRate: number;
  avgTriageTime: number;
  reportsPerDay: number;
  cohorts: {
    d7: number;
    d30: number;
  };
}

export async function getProductData(period: string = '30d'): Promise<ProductData> {
  const now = new Date();
  let periodStart: Date;
  
  switch (period) {
    case 'today':
      periodStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      break;
    case '7d':
      periodStart = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      break;
    case '30d':
      periodStart = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      break;
    default:
      periodStart = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
  }

  const [
    triagesByType,
    totalTriages,
    completedTriages,
    reportsPerDay,
  ] = await Promise.all([
    prisma.triage.groupBy({
      by: ['type'],
      _count: { id: true },
      where: { created_at: { gte: periodStart } }
    }),
    
    prisma.triage.count({
      where: { created_at: { gte: periodStart } }
    }),
    
    prisma.triage.count({
      where: { 
        status: 'submitted',
        created_at: { gte: periodStart }
      }
    }),
    
    prisma.report.count({
      where: { created_at: { gte: periodStart } }
    }) / (period === 'today' ? 1 : period === '7d' ? 7 : 30),
  ]);

  const completionRate = totalTriages > 0 ? (completedTriages / totalTriages) * 100 : 0;

  // Calcular cohorts (simplificado)
  const d7Cohort = await prisma.patient.count({
    where: {
      created_at: { gte: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000) },
      triages: { some: { created_at: { gte: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000) } } }
    }
  });

  const d30Cohort = await prisma.patient.count({
    where: {
      created_at: { gte: new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000) },
      triages: { some: { created_at: { gte: new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000) } } }
    }
  });

  return {
    triagesByType: triagesByType.map(item => ({
      type: item.type,
      count: item._count.id,
      completionRate: 0, // TODO: Calcular por tipo
      avgScore: 0, // TODO: Calcular por tipo
    })),
    completionRate,
    avgTriageTime: 0, // TODO: Implementar cálculo de tempo
    reportsPerDay,
    cohorts: {
      d7: d7Cohort,
      d30: d30Cohort,
    },
  };
}

export interface TechData {
  apiUptime: number;
  avgResponseTime: number;
  errorRate: number;
  dbConnections: number;
  dbResponseTime: number;
  dbSize: number;
  openaiStatus: 'healthy' | 'degraded' | 'down';
  stripeStatus: 'healthy' | 'degraded' | 'down';
  supabaseStatus: 'healthy' | 'degraded' | 'down';
  lighthouseScore: number;
}

export async function getTechData(): Promise<TechData> {
  // Dados simulados para MVP (em produção, integrar com métricas reais)
  return {
    apiUptime: 99.9,
    avgResponseTime: 250,
    errorRate: 0.1,
    dbConnections: 5,
    dbResponseTime: 50,
    dbSize: 1024 * 1024 * 100, // 100MB
    openaiStatus: 'healthy',
    stripeStatus: 'healthy',
    supabaseStatus: 'healthy',
    lighthouseScore: 92,
  };
}
