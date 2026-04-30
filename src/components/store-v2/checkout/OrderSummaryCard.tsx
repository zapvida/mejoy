'use client';

import { useState } from 'react';
import { ChevronDown, FileText } from 'lucide-react';
import ProductPackShot, { shouldUsePackShot } from '@/components/store-v2/ProductPackShot';

function formatPrice(cents: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(cents / 100);
}

interface CartItem {
  id: string;
  quantity: number;
  product?: {
    name: string;
    slug: string;
    priceCents: number | null;
    images: string[];
    title?: string;
  };
}

interface OrderSummaryCardProps {
  items: CartItem[];
  subtotalCents: number;
  shippingCents: number;
  totalCents: number;
  shippingDays?: number;
  className?: string;
}

export default function OrderSummaryCard({
  items,
  subtotalCents,
  shippingCents,
  totalCents,
  shippingDays,
  className = '',
}: OrderSummaryCardProps) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div
      className={`bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden ${className}`}
    >
      {/* Header - sempre visível, clicável no mobile */}
      <button
        type="button"
        onClick={() => setExpanded(!expanded)}
        className="w-full lg:cursor-default flex items-center justify-between p-4 lg:p-6 border-b border-gray-100"
      >
        <div className="flex items-center gap-2">
          <FileText className="w-5 h-5 text-gray-500" />
          <h3 className="font-semibold text-gray-900">Resumo do Pedido</h3>
        </div>
        <ChevronDown
          className={`w-5 h-5 text-gray-500 lg:hidden transition-transform ${expanded ? 'rotate-180' : ''}`}
        />
      </button>

      {/* Conteúdo - colapsável no mobile */}
      <div className={`${expanded ? 'block' : 'hidden'} lg:block`}>
        <div className="p-4 lg:p-6 space-y-4">
          <div className="space-y-3 max-h-48 overflow-y-auto">
            {items.map((item) => (
              <div key={item.id} className="flex gap-3">
                <div className="w-12 h-12 rounded-lg bg-gray-100 flex-shrink-0 overflow-hidden relative">
                  {item.product?.images?.[0] && !shouldUsePackShot(item.product.images[0]) ? (
                    <img
                      src={item.product.images[0]}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <ProductPackShot
                      title={item.product?.title ?? item.product?.name ?? ''}
                      variant="cart"
                      className="absolute inset-0"
                    />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 line-clamp-2">
                    {item.product?.name}
                  </p>
                  <p className="text-sm text-gray-600">
                    {item.quantity} × {formatPrice(item.product?.priceCents ?? 0)}
                  </p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-sm font-semibold text-gray-900">
                    {formatPrice((item.product?.priceCents ?? 0) * item.quantity)}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="border-t border-gray-100 pt-4 space-y-2">
            <div className="flex justify-between text-sm text-gray-600">
              <span>Subtotal</span>
              <span>{formatPrice(subtotalCents)}</span>
            </div>
            <div className="flex justify-between text-sm text-gray-600">
              <span>Frete</span>
              <span>{formatPrice(shippingCents)}</span>
            </div>
            {shippingDays && shippingCents > 0 && (
              <p className="text-xs text-gray-500">Entrega em até {shippingDays} dias úteis</p>
            )}
            <div className="flex justify-between font-semibold text-lg pt-2 border-t border-gray-100">
              <span>Total</span>
              <span className="text-orange-600">{formatPrice(totalCents)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
