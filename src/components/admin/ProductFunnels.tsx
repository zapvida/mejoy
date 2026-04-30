// src/components/admin/ProductFunnels.tsx
// Funil por produto: chegada → início triagem → triagem preenchida → compra

import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface ProductFunnelItem {
  productSlug: string;
  productLabel: string;
  chegada: number;
  inicioTriagem: number;
  triagemPreenchida: number;
  compra: number;
  taxaChegadaTriagem: number;
  taxaTriagemPreenchida: number;
  taxaPreenchidaCompra: number;
}

interface ProductFunnelsProps {
  data: ProductFunnelItem[] | null;
  loading: boolean;
  variant?: 'light' | 'dark';
}

const STEPS = ['Chegada no site', 'Início triagem', 'Triagem preenchida', 'Compra'];
const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#8B5CF6'];

export function ProductFunnels({ data, loading, variant = 'light' }: ProductFunnelsProps) {
  const card = variant === 'light' ? 'bg-white border border-gray-200 shadow-sm' : 'bg-white/5 backdrop-blur-md border border-white/10';
  const title = variant === 'light' ? 'text-gray-900' : 'text-white';
  const muted = variant === 'light' ? 'text-gray-500' : 'text-white/60';

  if (loading) {
    return (
      <div className={`${card} rounded-xl p-6 mb-8`}>
        <div className={`h-6 ${variant === 'light' ? 'bg-gray-200' : 'bg-white/20'} rounded mb-4 animate-pulse`} />
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className={`h-32 ${variant === 'light' ? 'bg-gray-100' : 'bg-white/10'} rounded-lg animate-pulse`} />
          ))}
        </div>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-6 mb-8">
        <p className="text-amber-800">Nenhum funil por produto disponível. Use dados mock para validar.</p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={`${card} rounded-xl p-6 mb-8`}
    >
      <h2 className={`text-xl font-bold ${title} mb-2`}>Funil por Produto</h2>
      <p className={`text-sm ${muted} mb-6`}>
        Chegada no site → Início da triagem → Triagem preenchida → Compra realizada
      </p>

      <div className="space-y-8">
        {data.map((product, idx) => {
          const chartData = [
            { name: 'Chegada', value: product.chegada, fill: COLORS[0] },
            { name: 'Início triagem', value: product.inicioTriagem, fill: COLORS[1] },
            { name: 'Triagem preenchida', value: product.triagemPreenchida, fill: COLORS[2] },
            { name: 'Compra', value: product.compra, fill: COLORS[3] },
          ];
          return (
            <div
              key={product.productSlug}
              className={`rounded-xl border ${variant === 'light' ? 'bg-gray-50 border-gray-200' : 'bg-white/5 border-white/10'} p-4`}
            >
              <h3 className={`text-lg font-semibold ${title} mb-4`}>{product.productLabel}</h3>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <h4 className={`text-sm font-medium ${muted} mb-3`}>Usuários por etapa</h4>
                  <ResponsiveContainer width="100%" height={200}>
                    <BarChart data={chartData} layout="vertical" margin={{ left: 20, right: 20 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke={variant === 'light' ? '#e5e7eb' : '#374151'} />
                      <XAxis type="number" stroke={variant === 'light' ? '#6b7280' : '#9CA3AF'} fontSize={11} />
                      <YAxis type="category" dataKey="name" stroke={variant === 'light' ? '#6b7280' : '#9CA3AF'} fontSize={11} width={100} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: variant === 'light' ? '#fff' : '#1F2937',
                          border: `1px solid ${variant === 'light' ? '#e5e7eb' : '#374151'}`,
                          borderRadius: '8px',
                        }}
                        formatter={(value: number) => [value.toLocaleString('pt-BR'), 'Usuários']}
                      />
                      <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                        {chartData.map((entry, i) => (
                          <Cell key={i} fill={entry.fill} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                <div>
                  <h4 className={`text-sm font-medium ${muted} mb-3`}>Taxas de conversão</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className={muted}>Chegada → Triagem</span>
                      <span className="font-medium">{product.taxaChegadaTriagem.toFixed(1)}%</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className={muted}>Triagem → Preenchida</span>
                      <span className="font-medium">{product.taxaTriagemPreenchida.toFixed(1)}%</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className={muted}>Preenchida → Compra</span>
                      <span className="font-medium">{product.taxaPreenchidaCompra.toFixed(1)}%</span>
                    </div>
                  </div>
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <p className={`text-xs ${muted}`}>
                      {product.chegada.toLocaleString('pt-BR')} → {product.inicioTriagem.toLocaleString('pt-BR')} → {product.triagemPreenchida.toLocaleString('pt-BR')} → {product.compra.toLocaleString('pt-BR')}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
}
