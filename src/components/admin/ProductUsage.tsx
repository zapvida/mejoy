// src/components/admin/ProductUsage.tsx
// Componente de análise de uso do produto

import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface ProductData {
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

interface ProductUsageProps {
  data: ProductData | null;
  loading: boolean;
  variant?: 'light' | 'dark';
}

export function ProductUsage({ data, loading, variant = 'dark' }: ProductUsageProps) {
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
        <p className="text-red-600">Erro ao carregar dados de produto</p>
      </div>
    );
  }

  // Preparar dados para gráfico de barras
  const triageData = data.triagesByType.map(triage => ({
    type: triage.type.replace(/([A-Z])/g, ' $1').trim(), // Converter camelCase para espaços
    count: triage.count,
    completionRate: triage.completionRate,
    avgScore: triage.avgScore,
  }));

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={`${card} rounded-xl p-6 mb-8`}
    >
      <h2 className="text-xl font-bold text-white mb-6">Uso do Produto</h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Gráfico de triagens por tipo */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-4">Triagens por Tipo</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={triageData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis 
                dataKey="type" 
                stroke="#9CA3AF"
                fontSize={12}
                angle={-45}
                textAnchor="end"
                height={80}
              />
              <YAxis stroke="#9CA3AF" fontSize={12} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1F2937',
                  border: '1px solid #374151',
                  borderRadius: '8px',
                  color: '#F9FAFB'
                }}
                formatter={(value: any, name: string) => [
                  name === 'count' ? value.toLocaleString('pt-BR') : `${value.toFixed(1)}%`,
                  name === 'count' ? 'Triagens' : 'Taxa de Conclusão'
                ]}
              />
              <Bar dataKey="count" fill="#10B981" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Métricas de engajamento */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-4">Métricas de Engajamento</h3>
          <div className="space-y-4">
            <div className="bg-white/5 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-medium text-white">Taxa de Conclusão Geral</h4>
                  <p className="text-xs text-white/60">Triagens concluídas / iniciadas</p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-green-400">
                    {data.completionRate.toFixed(1)}%
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white/5 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-medium text-white">Tempo Médio de Triagem</h4>
                  <p className="text-xs text-white/60">Duração média por triagem</p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-blue-400">
                    {data.avgTriageTime > 0 ? `${data.avgTriageTime.toFixed(1)}min` : 'N/A'}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white/5 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-medium text-white">Relatórios por Dia</h4>
                  <p className="text-xs text-white/60">Média de relatórios gerados</p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-purple-400">
                    {data.reportsPerDay.toFixed(1)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Cohorts de retenção */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-white mb-4">Cohorts de Retenção</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4">
            <h4 className="text-sm font-medium text-green-400 mb-2">Retenção D7</h4>
            <p className="text-xl font-bold text-white">
              {data.cohorts.d7.toLocaleString('pt-BR')} usuários
            </p>
            <p className="text-xs text-white/60 mt-1">
              Usuários ativos após 7 dias
            </p>
          </div>
          <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
            <h4 className="text-sm font-medium text-blue-400 mb-2">Retenção D30</h4>
            <p className="text-xl font-bold text-white">
              {data.cohorts.d30.toLocaleString('pt-BR')} usuários
            </p>
            <p className="text-xs text-white/60 mt-1">
              Usuários ativos após 30 dias
            </p>
          </div>
        </div>
      </div>

      {/* Tabela detalhada de triagens */}
      <div>
        <h3 className="text-lg font-semibold text-white mb-4">Detalhes por Tipo de Triagem</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/10">
                <th className="text-left py-3 px-4 text-white/80">Tipo</th>
                <th className="text-right py-3 px-4 text-white/80">Triagens</th>
                <th className="text-right py-3 px-4 text-white/80">Taxa Conclusão</th>
                <th className="text-right py-3 px-4 text-white/80">Score Médio</th>
              </tr>
            </thead>
            <tbody>
              {data.triagesByType.map((triage, _index) => (
                <tr key={triage.type} className="border-b border-white/5">
                  <td className="py-3 px-4 text-white">
                    {triage.type.replace(/([A-Z])/g, ' $1').trim()}
                  </td>
                  <td className="py-3 px-4 text-right text-white">
                    {triage.count.toLocaleString('pt-BR')}
                  </td>
                  <td className="py-3 px-4 text-right">
                    <span className={`font-medium ${
                      triage.completionRate >= 80 ? 'text-green-400' :
                      triage.completionRate >= 60 ? 'text-yellow-400' :
                      triage.completionRate >= 40 ? 'text-orange-400' : 'text-red-400'
                    }`}>
                      {triage.completionRate.toFixed(1)}%
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right text-white">
                    {triage.avgScore > 0 ? triage.avgScore.toFixed(1) : 'N/A'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </motion.div>
  );
}
