'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Package, Moon, Scissors, Activity, Shield, Zap, FileText } from 'lucide-react';

const products = [
  { slug: 'emagrecimento', name: 'Emagrecimento', icon: Activity, color: 'from-purple-500 to-pink-500' },
  { slug: 'sono', name: 'Sono', icon: Moon, color: 'from-indigo-500 to-blue-500' },
  { slug: 'calvicie', name: 'Calvície', icon: Scissors, color: 'from-amber-500 to-orange-500' },
  { slug: 'intestino', name: 'Intestino', icon: Package, color: 'from-brand-400 to-brand-600' },
  { slug: 'figado', name: 'Fígado', icon: Shield, color: 'from-teal-500 to-cyan-500' },
  { slug: 'imunidade', name: 'Imunidade', icon: Zap, color: 'from-yellow-500 to-amber-500' },
];

function ProtocolCard({ product, index }: { product: typeof products[0]; index: number }) {
  const Icon = product.icon;
  return (
    <Link href={`/produtos#${product.slug}`}>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.05 }}
        className={`group relative overflow-hidden rounded-xl bg-gradient-to-br ${product.color} p-2.5 sm:p-3 cursor-pointer hover:scale-[1.02] active:scale-[0.98] transition-transform shadow-md min-w-0`}
      >
        <div className="flex flex-col items-center text-center">
          <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-lg bg-white/20 backdrop-blur-sm flex items-center justify-center mb-1.5 sm:mb-2">
            <Icon className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
          </div>
          <span className="text-[9px] sm:text-[10px] font-semibold text-white leading-tight">{product.name}</span>
        </div>
        {index < 2 && (
          <div className="absolute top-0.5 right-0.5 bg-white/90 rounded-full px-1 sm:px-1.5 py-0.5">
            <span className="text-[7px] sm:text-[8px] font-bold text-gray-800">NOVO</span>
          </div>
        )}
      </motion.div>
    </Link>
  );
}

export default function ProductsPreview() {
  return (
    <div className="w-full lg:w-auto flex flex-col lg:contents">
      {/* Mobile: versão compacta */}
      <div className="lg:hidden mt-4 sm:mt-6">
        <h3 className="text-sm font-semibold text-ink mb-2 sm:mb-3">Nossos Protocolos</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-2.5">
          {products.map((product, index) => (
            <ProtocolCard key={product.slug} product={product} index={index} />
          ))}
        </div>
        <div className="mt-3 pt-3 border-t border-[color:var(--border)] flex items-center justify-between">
          <span className="text-[10px] sm:text-xs text-ink-muted">10 protocolos</span>
          <div className="flex items-center gap-1">
            <div className="w-1.5 h-1.5 rounded-full bg-brand animate-pulse" />
            <span className="text-[10px] sm:text-xs text-ink-muted">Em estoque</span>
          </div>
        </div>
      </div>

      {/* Desktop: versão com frame */}
      <div className="hidden lg:block relative flex justify-end">
      <motion.div
        initial={{ opacity: 0, scale: 0.97 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-3/4 max-w-[720px] rounded-2xl bg-white p-3 shadow-2xl ring-1 ring-[color:var(--border)]/60 sm:rounded-3xl sm:p-4"
      >
        {/* Header do preview */}
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-red-500"></div>
            <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
            <div className="w-2 h-2 rounded-full bg-brand"></div>
            <span className="ml-2 text-xs text-gray-500 font-medium">mejoy.com.br</span>
          </div>
        </div>

        {/* Tabs: Produtos e Triagem */}
        <div className="bg-gradient-to-br from-gray-50 to-white rounded-2xl border border-gray-200 overflow-hidden">
          {/* Tabs */}
          <div className="flex border-b border-gray-200">
            <button className="flex-1 px-4 py-2 text-xs font-semibold text-gray-700 bg-white border-b-2 border-[color:var(--brand-600)]">
              Produtos
            </button>
            <button className="flex-1 px-4 py-2 text-xs font-semibold text-gray-500 hover:text-gray-700">
              Triagem
            </button>
          </div>

          {/* Conteúdo: Grid de produtos */}
          <div className="p-4">
            <h3 className="text-sm font-semibold text-gray-700 mb-3">Nossos Protocolos</h3>
            <div className="grid grid-cols-2 gap-2 mb-3">
              {products.map((product, index) => (
                <ProtocolCard key={product.slug} product={product} index={index} />
              ))}
            </div>
            
            {/* Preview de relatório (triagem) */}
            <div className="mt-3 pt-3 border-t border-gray-200">
              <div className="flex items-center gap-2 mb-2">
                <FileText className="w-4 h-4 text-gray-500" />
                <span className="text-xs font-semibold text-gray-700">Relatório Personalizado</span>
              </div>
              <div className="rounded-lg bg-gradient-to-br from-purple-50 to-pink-50 p-2 border border-purple-200">
                <div className="space-y-1.5">
                  <div className="h-2 bg-purple-300 rounded w-3/4"></div>
                  <div className="h-2 bg-purple-200 rounded w-full"></div>
                  <div className="h-2 bg-purple-200 rounded w-5/6"></div>
                  <div className="flex gap-1 mt-2">
                    <div className="w-1 h-8 bg-purple-400 rounded"></div>
                    <div className="w-1 h-6 bg-pink-400 rounded"></div>
                    <div className="w-1 h-10 bg-purple-400 rounded"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Footer do preview */}
          <div className="px-4 pb-3 border-t border-gray-200 pt-3">
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-500">10 protocolos disponíveis</span>
              <div className="flex items-center gap-1">
                <div className="w-1.5 h-1.5 rounded-full bg-brand animate-pulse"></div>
                <span className="text-xs text-gray-500">Em estoque</span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
    </div>
  );
}
