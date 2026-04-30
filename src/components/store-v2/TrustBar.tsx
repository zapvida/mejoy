'use client';

import { Truck, Shield, RotateCcw, Package } from 'lucide-react';

const ITEMS: Array<{ icon: typeof Truck; title: string; sub: string; highlight?: boolean }> = [
  { icon: Truck, title: 'Despacho em até 24h', sub: 'Entrega para todo o Brasil' },
  { icon: Shield, title: 'Manipulação segura', sub: 'Farmácia certificada ANVISA' },
  { icon: RotateCcw, title: 'Satisfação garantida', sub: 'Troca em até 7 dias' },
  { icon: Package, title: 'Frete grátis acima de R$ 190', sub: 'Varia por região', highlight: true },
];

export default function TrustBar() {
  const items = ITEMS;

  return (
    <section className="bg-gray-50/50 border-y border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {items.map((item, i) => {
            const Icon = item.icon;
            const isHighlight = item.highlight;
            return (
              <div
                key={i}
                className={`group flex items-center gap-3 p-3 sm:p-4 rounded-xl border transition-all duration-200 ${
                  isHighlight
                    ? 'bg-amber-50/90 border-amber-200/80 hover:border-amber-300'
                    : 'bg-white border-gray-100 hover:border-orange-200/80 hover:bg-orange-50/40'
                }`}
              >
                <div className={`w-10 h-10 sm:w-11 sm:h-11 rounded-lg flex items-center justify-center shrink-0 ${
                  isHighlight ? 'bg-amber-100' : 'bg-gray-50 border border-gray-100'
                }`}>
                  <Icon className={`w-5 h-5 sm:w-5 sm:h-5 ${isHighlight ? 'text-amber-700' : 'text-brand-600'}`} />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-semibold text-gray-900 text-xs sm:text-sm leading-tight line-clamp-2">
                    {item.title}
                  </p>
                  <p className="text-[11px] sm:text-xs text-gray-600 mt-0.5 leading-snug">
                    {item.sub}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
