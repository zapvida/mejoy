'use client';

/**
 * Grid "Para que serve" — 3 colunas (1 em mobile), título + descrição por célula.
 * Espelha o OficialFarma.
 */

interface Item {
  title: string;
  desc: string;
}

interface PdpParaQueServeGridProps {
  items: Item[];
  productName?: string;
  className?: string;
}

export default function PdpParaQueServeGrid({
  items,
  productName = 'este produto',
  className = '',
}: PdpParaQueServeGridProps) {
  if (!items || items.length === 0) return null;

  return (
    <div className={`bg-white rounded-2xl border border-gray-100 p-6 sm:p-8 shadow-sm ${className}`}>
      <h2 className="text-lg md:text-xl font-bold text-gray-900 mb-3 tracking-tight">
        Para que serve o {productName}
      </h2>
      <p className="text-gray-600 mb-5 text-sm md:text-[15px] leading-relaxed">
        Principais benefícios:
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
        {items.map((item, i) => (
          <div
            key={i}
            className="p-4 md:p-5 rounded-xl bg-gray-50/70 border border-gray-100/80"
          >
            <h3 className="font-semibold text-gray-900 mb-1.5 text-[15px]">{item.title}</h3>
            <p className="text-sm text-gray-700 leading-relaxed">{item.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
