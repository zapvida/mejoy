// src/components/admin/Revenue.tsx
// Componente de análise de receita

import { motion } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

interface RevenueData {
  revenueToday: number;
  revenueThisWeek: number;
  revenueThisMonth: number;
  revenueThisYear: number;
  basicMonthly: number;
  plusMonthly: number;
  basicYearly: number;
  plusYearly: number;
  stripeRevenue: number;
  projectedMonthlyRevenue: number;
  projectedYearlyRevenue: number;
}

interface RevenueProps {
  data: RevenueData | null;
  loading: boolean;
  variant?: 'light' | 'dark';
}

export function Revenue({ data, loading, variant = 'dark' }: RevenueProps) {
  const card = variant === 'light' ? 'bg-white border border-gray-200 shadow-sm' : 'bg-white/5 backdrop-blur-md border border-white/10';
  if (loading) {
    return (
      <div className={`${card} rounded-xl p-6 mb-8`}>
        <div className="h-6 bg-white/20 rounded mb-4 animate-pulse"></div>
        <div className="h-64 bg-white/20 rounded animate-pulse"></div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-xl p-6 mb-8">
        <p className="text-red-600">Erro ao carregar dados de receita</p>
      </div>
    );
  }

  // Dados para gráfico de linha (simulado para últimos 30 dias)
  const revenueHistory = Array.from({ length: 30 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (29 - i));
    return {
      date: date.toISOString().split('T')[0],
      revenue: Math.floor(Math.random() * 2000) + 500, // Simulado
    };
  });

  // Dados para gráfico de pizza por plano
  const planData = [
    { name: 'Básico Mensal', value: data.basicMonthly, color: '#10B981' },
    { name: 'Plus Mensal', value: data.plusMonthly, color: '#3B82F6' },
    { name: 'Básico Anual', value: data.basicYearly, color: '#8B5CF6' },
    { name: 'Plus Anual', value: data.plusYearly, color: '#F59E0B' },
  ].filter(item => item.value > 0);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={`${card} rounded-xl p-6 mb-8`}
    >
      <h2 className="text-xl font-bold text-white mb-6">Análise de Receita</h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Gráfico de linha - Receita por período */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-4">Receita Diária (30 dias)</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={revenueHistory}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis 
                dataKey="date" 
                stroke="#9CA3AF"
                fontSize={12}
                tickFormatter={(value) => new Date(value).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })}
              />
              <YAxis stroke="#9CA3AF" fontSize={12} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1F2937',
                  border: '1px solid #374151',
                  borderRadius: '8px',
                  color: '#F9FAFB'
                }}
                formatter={(value: any) => [`R$ ${value.toLocaleString('pt-BR')}`, 'Receita']}
                labelFormatter={(value) => new Date(value).toLocaleDateString('pt-BR')}
              />
              <Line 
                type="monotone" 
                dataKey="revenue" 
                stroke="#10B981" 
                strokeWidth={2}
                dot={{ fill: '#10B981', strokeWidth: 2, r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Gráfico de pizza - Distribuição por plano */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-4">Distribuição por Plano</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={planData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }: any) => `${name}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {planData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1F2937',
                  border: '1px solid #374151',
                  borderRadius: '8px',
                  color: '#F9FAFB'
                }}
                formatter={(value: any) => [`R$ ${value.toLocaleString('pt-BR')}`, 'Receita']}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Cards de métricas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4">
          <h4 className="text-sm font-medium text-green-400 mb-2">Receita Hoje</h4>
          <p className="text-xl font-bold text-white">
            R$ {data.revenueToday.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </p>
        </div>
        <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
          <h4 className="text-sm font-medium text-blue-400 mb-2">Receita Esta Semana</h4>
          <p className="text-xl font-bold text-white">
            R$ {data.revenueThisWeek.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </p>
        </div>
        <div className="bg-purple-500/10 border border-purple-500/20 rounded-lg p-4">
          <h4 className="text-sm font-medium text-purple-400 mb-2">Receita Este Mês</h4>
          <p className="text-xl font-bold text-white">
            R$ {data.revenueThisMonth.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </p>
        </div>
        <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4">
          <h4 className="text-sm font-medium text-yellow-400 mb-2">Receita Este Ano</h4>
          <p className="text-xl font-bold text-white">
            R$ {data.revenueThisYear.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </p>
        </div>
      </div>

      {/* Projeções */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white/5 rounded-lg p-4">
          <h4 className="text-sm font-medium text-white mb-2">Projeção Mensal</h4>
          <p className="text-lg font-bold text-green-400">
            R$ {data.projectedMonthlyRevenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </p>
        </div>
        <div className="bg-white/5 rounded-lg p-4">
          <h4 className="text-sm font-medium text-white mb-2">Projeção Anual</h4>
          <p className="text-lg font-bold text-blue-400">
            R$ {data.projectedYearlyRevenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </p>
        </div>
      </div>
    </motion.div>
  );
}
