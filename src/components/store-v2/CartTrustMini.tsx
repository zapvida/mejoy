'use client';

import { Shield, Package, MessageCircle } from 'lucide-react';

const WHATSAPP_CTA = process.env.NEXT_PUBLIC_WHATSAPP_CTA ?? 'https://wa.me/5511999999999';

const ITEMS = [
  { icon: Shield, text: 'Compra segura' },
  { icon: Package, text: 'Manipulação em até 2 dias' },
  { icon: MessageCircle, text: 'Suporte no WhatsApp' },
];

export default function CartTrustMini() {
  return (
    <div
      data-testid="cart-trust"
      className="flex flex-wrap gap-3 justify-center py-3 border-t border-gray-200"
    >
      {ITEMS.map((item, i) => {
        const Icon = item.icon;
        return (
          <div key={i} className="flex items-center gap-2 text-sm text-gray-600">
            <Icon className="w-4 h-4 text-brand-600 shrink-0" />
            <span>{item.text}</span>
          </div>
        );
      })}
      <a
        href={WHATSAPP_CTA}
        target="_blank"
        rel="noopener noreferrer"
        className="text-brand-600 hover:underline text-sm"
      >
        Falar com suporte
      </a>
    </div>
  );
}
