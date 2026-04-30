// src/components/admin/KPIBar.tsx
// Componente de barra de KPIs principais

import { motion } from 'framer-motion';
import { FiTrendingUp, FiTrendingDown, FiUsers, FiCreditCard, FiDollarSign, FiActivity } from 'react-icons/fi';

interface KPIData {
  mrr: number;
  revenueToday: number;
  revenueThisMonth: number;
  revenueGrowth: number;
  activeSubscriptions: number;
  newSubscriptionsToday: number;
  churnRate: number;
  arpu: number;
  ltv: number;
  totalUsers: number;
  newUsersToday: number;
  activeUsersToday: number;
  retentionRate: number;
  totalTriages: number;
  triagesToday: number;
  completionRate: number;
  totalReports: number;
  reportsToday: number;
  avgReportScore: number;
}

interface KPIBarProps {
  data: KPIData | null;
  loading: boolean;
  variant?: 'light' | 'dark';
}

const lightCard = 'bg-white border border-gray-200 shadow-sm';
const darkCard = 'bg-white/5 backdrop-blur-md border border-white/10';

export function KPIBar({ data, loading, variant = 'dark' }: KPIBarProps) {
  const card = variant === 'light' ? lightCard : darkCard;
  const textMuted = variant === 'light' ? 'text-gray-500' : 'text-white/80';
  const textMain = variant === 'light' ? 'text-gray-900' : 'text-white';

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className={`${card} rounded-xl p-6 animate-pulse`}>
            <div className={`h-4 ${variant === 'light' ? 'bg-gray-200' : 'bg-white/20'} rounded mb-2`}></div>
            <div className={`h-8 ${variant === 'light' ? 'bg-gray-200' : 'bg-white/20'} rounded mb-2`}></div>
            <div className={`h-3 ${variant === 'light' ? 'bg-gray-200' : 'bg-white/20'} rounded w-2/3`}></div>
          </div>
        ))}
      </div>
    );
  }

  if (!data) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-xl p-6 mb-8">
        <p className="text-red-600">Erro ao carregar KPIs</p>
      </div>
    );
  }

  const kpis = [
    {
      title: 'MRR',
      value: `R$ ${data.mrr.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`,
      change: data.revenueGrowth,
      icon: FiDollarSign,
      color: variant === 'light' ? 'text-green-600' : 'text-green-400',
      bgColor: variant === 'light' ? 'bg-green-50' : 'bg-green-500/10',
      borderColor: variant === 'light' ? 'border-green-200' : 'border-green-500/20',
    },
    {
      title: 'Assinaturas Ativas',
      value: data.activeSubscriptions.toLocaleString('pt-BR'),
      change: data.newSubscriptionsToday,
      icon: FiCreditCard,
      color: variant === 'light' ? 'text-blue-600' : 'text-blue-400',
      bgColor: variant === 'light' ? 'bg-blue-50' : 'bg-blue-500/10',
      borderColor: variant === 'light' ? 'border-blue-200' : 'border-blue-500/20',
    },
    {
      title: 'Churn Rate',
      value: `${data.churnRate.toFixed(1)}%`,
      change: -data.churnRate,
      icon: FiTrendingDown,
      color: variant === 'light' ? 'text-red-600' : 'text-red-400',
      bgColor: variant === 'light' ? 'bg-red-50' : 'bg-red-500/10',
      borderColor: variant === 'light' ? 'border-red-200' : 'border-red-500/20',
    },
    {
      title: 'ARPU',
      value: `R$ ${data.arpu.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`,
      change: 0,
      icon: FiTrendingUp,
      color: variant === 'light' ? 'text-purple-600' : 'text-purple-400',
      bgColor: variant === 'light' ? 'bg-purple-50' : 'bg-purple-500/10',
      borderColor: variant === 'light' ? 'border-purple-200' : 'border-purple-500/20',
    },
    {
      title: 'LTV',
      value: `R$ ${data.ltv.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`,
      change: 0,
      icon: FiTrendingUp,
      color: variant === 'light' ? 'text-amber-600' : 'text-yellow-400',
      bgColor: variant === 'light' ? 'bg-amber-50' : 'bg-yellow-500/10',
      borderColor: variant === 'light' ? 'border-amber-200' : 'border-yellow-500/20',
    },
    {
      title: 'Usuários Totais',
      value: data.totalUsers.toLocaleString('pt-BR'),
      change: data.newUsersToday,
      icon: FiUsers,
      color: variant === 'light' ? 'text-cyan-600' : 'text-cyan-400',
      bgColor: variant === 'light' ? 'bg-cyan-50' : 'bg-cyan-500/10',
      borderColor: variant === 'light' ? 'border-cyan-200' : 'border-cyan-500/20',
    },
    {
      title: 'Taxa de Conclusão',
      value: `${data.completionRate.toFixed(1)}%`,
      change: 0,
      icon: FiActivity,
      color: variant === 'light' ? 'text-emerald-600' : 'text-emerald-400',
      bgColor: variant === 'light' ? 'bg-emerald-50' : 'bg-emerald-500/10',
      borderColor: variant === 'light' ? 'border-emerald-200' : 'border-emerald-500/20',
    },
    {
      title: 'Score Médio',
      value: data.avgReportScore.toFixed(1),
      change: 0,
      icon: FiTrendingUp,
      color: variant === 'light' ? 'text-orange-600' : 'text-orange-400',
      bgColor: variant === 'light' ? 'bg-orange-50' : 'bg-orange-500/10',
      borderColor: variant === 'light' ? 'border-orange-200' : 'border-orange-500/20',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {kpis.map((kpi, index) => {
        const Icon = kpi.icon;
        const isPositive = kpi.change > 0;
        const isNegative = kpi.change < 0;
        
        return (
          <motion.div
            key={kpi.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className={`${kpi.bgColor} backdrop-blur-md rounded-xl ${kpi.borderColor} border p-6`}
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`${kpi.color} p-2 rounded-lg ${variant === 'light' ? 'bg-gray-100' : 'bg-white/10'}`}>
                <Icon size={20} />
              </div>
              {kpi.change !== 0 && (
                <div className={`flex items-center text-sm ${
                  isPositive ? (variant === 'light' ? 'text-green-600' : 'text-green-400') : isNegative ? (variant === 'light' ? 'text-red-600' : 'text-red-400') : 'text-gray-400'
                }`}>
                  {isPositive ? <FiTrendingUp size={14} /> : <FiTrendingDown size={14} />}
                  <span className="ml-1">
                    {Math.abs(kpi.change).toFixed(1)}
                    {typeof kpi.change === 'number' && kpi.change % 1 !== 0 ? '%' : ''}
                  </span>
                </div>
              )}
            </div>
            
            <div className="space-y-1">
              <h3 className={`text-sm font-medium ${textMuted}`}>{kpi.title}</h3>
              <p className={`text-2xl font-bold ${textMain}`}>{kpi.value}</p>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
