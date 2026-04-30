// src/components/admin/Funnel.tsx
// Componente de visualização do funil de conversão

import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface FunnelData {
  homepageViews: number;
  triageStarts: number;
  triageCompletions: number;
  reportViews: number;
  pricingViews: number;
  checkoutStarts: number;
  subscriptions: number;
  homepageToTriage: number;
  triageToCompletion: number;
  completionToReport: number;
  reportToPricing: number;
  pricingToCheckout: number;
  checkoutToSubscription: number;
  avgTimeToTriage: number;
  avgTimeToCompletion: number;
  avgTimeToSubscription: number;
}

interface FunnelProps {
  data: FunnelData | null;
  loading: boolean;
  variant?: 'light' | 'dark';
}

export function Funnel({ data, loading, variant = 'dark' }: FunnelProps) {
  const card = variant === 'light' ? 'bg-white border border-gray-200 shadow-sm' : 'bg-white/5 backdrop-blur-md border border-white/10';
  const title = variant === 'light' ? 'text-gray-900' : 'text-white';

  if (loading) {
    return (
      <div className={`${card} rounded-xl p-6 mb-8`}>
        <div className={`h-6 ${variant === 'light' ? 'bg-gray-200' : 'bg-white/20'} rounded mb-4 animate-pulse`}></div>
        <div className={`h-64 ${variant === 'light' ? 'bg-gray-200' : 'bg-white/20'} rounded animate-pulse`}></div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-xl p-6 mb-8">
        <p className="text-red-600">Erro ao carregar dados do funil</p>
      </div>
    );
  }

  const funnelSteps = [
    { name: 'Homepage', value: data.homepageViews, conversion: 100 },
    { name: 'Início Triagem', value: data.triageStarts, conversion: data.homepageToTriage },
    { name: 'Triagem Concluída', value: data.triageCompletions, conversion: data.triageToCompletion },
    { name: 'Visualização Relatório', value: data.reportViews, conversion: data.completionToReport },
    { name: 'Página Pricing', value: data.pricingViews, conversion: data.reportToPricing },
    { name: 'Início Checkout', value: data.checkoutStarts, conversion: data.pricingToCheckout },
    { name: 'Assinatura', value: data.subscriptions, conversion: data.checkoutToSubscription },
  ];

  const conversionData = funnelSteps.map(step => ({
    step: step.name,
    users: step.value,
    conversion: step.conversion,
  }));

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={`${card} rounded-xl p-6 mb-8`}
    >
      <h2 className={`text-xl font-bold ${title} mb-6`}>Funil de Conversão</h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <h3 className={`text-lg font-semibold ${title} mb-4`}>Usuários por Etapa</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={conversionData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis 
                dataKey="step" 
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
                  name === 'users' ? value.toLocaleString('pt-BR') : `${value.toFixed(1)}%`,
                  name === 'users' ? 'Usuários' : 'Conversão'
                ]}
              />
              <Bar dataKey="users" fill="#10B981" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div>
          <h3 className={`text-lg font-semibold ${title} mb-4`}>Taxas de Conversão</h3>
          <div className="space-y-3">
            {funnelSteps.map((step, index) => {
              const isLast = index === funnelSteps.length - 1;
              const nextStep = !isLast ? funnelSteps[index + 1] : null;
              const conversion = nextStep ? step.conversion : 100;
              const stepCard = variant === 'light' ? 'bg-gray-50' : 'bg-white/5';
              const stepText = variant === 'light' ? 'text-gray-900' : 'text-white';
              const stepMuted = variant === 'light' ? 'text-gray-500' : 'text-white/60';
              
              return (
                <div key={step.name} className={`flex items-center justify-between p-3 ${stepCard} rounded-lg`}>
                  <div className="flex-1">
                    <p className={`text-sm font-medium ${stepText}`}>{step.name}</p>
                    <p className={`text-xs ${stepMuted}`}>
                      {step.value.toLocaleString('pt-BR')} usuários
                    </p>
                  </div>
                  <div className="text-right">
                    <p className={`text-sm font-bold ${
                      conversion >= 80 ? 'text-green-400' :
                      conversion >= 60 ? 'text-yellow-400' :
                      conversion >= 40 ? 'text-orange-400' : 'text-red-400'
                    }`}>
                      {conversion.toFixed(1)}%
                    </p>
                    {nextStep && (
                      <p className="text-xs text-white/60">
                        → {nextStep.name}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className={`${variant === 'light' ? 'bg-gray-50' : 'bg-white/5'} rounded-lg p-4`}>
          <h4 className={`text-sm font-medium ${variant === 'light' ? 'text-gray-700' : 'text-white'} mb-2`}>Tempo Médio até Triagem</h4>
          <p className="text-lg font-bold text-blue-400">
            {data.avgTimeToTriage > 0 ? `${data.avgTimeToTriage.toFixed(1)}min` : 'N/A'}
          </p>
        </div>
        <div className={`${variant === 'light' ? 'bg-gray-50' : 'bg-white/5'} rounded-lg p-4`}>
          <h4 className={`text-sm font-medium ${variant === 'light' ? 'text-gray-700' : 'text-white'} mb-2`}>Tempo Médio até Conclusão</h4>
          <p className="text-lg font-bold text-green-400">
            {data.avgTimeToCompletion > 0 ? `${data.avgTimeToCompletion.toFixed(1)}min` : 'N/A'}
          </p>
        </div>
        <div className={`${variant === 'light' ? 'bg-gray-50' : 'bg-white/5'} rounded-lg p-4`}>
          <h4 className={`text-sm font-medium ${variant === 'light' ? 'text-gray-700' : 'text-white'} mb-2`}>Tempo Médio até Assinatura</h4>
          <p className="text-lg font-bold text-purple-400">
            {data.avgTimeToSubscription > 0 ? `${data.avgTimeToSubscription.toFixed(1)}min` : 'N/A'}
          </p>
        </div>
      </div>
    </motion.div>
  );
}
