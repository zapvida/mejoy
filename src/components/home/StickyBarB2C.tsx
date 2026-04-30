'use client';

import Link from 'next/link';
import { MessageCircle, Stethoscope } from 'lucide-react';
import { track } from '@/lib/analytics';

export default function StickyBarB2C() {
  const handleCtaCheckup = () => {
    track('sticky_cta_click', { section: 'sticky', action: 'checkup' });
  };

  const handleCtaProdutos = () => {
    track('sticky_cta_click', { section: 'sticky', action: 'produtos' });
  };

  const handleWhatsAppClick = () => {
    track('whatsapp_cta_click', { section: 'sticky' });
  };

  return (
    <div className="sticky-bottom md:hidden bg-popover/95 backdrop-blur-md border-t border-[color:var(--border)]">
      <div className="mx-auto max-w-md px-4 py-3 flex items-center gap-2">
        <Link
          href="/protocolos"
          data-testid="sticky-cta-checkup"
          data-analytics="lpac_sticky_cta_checkup"
          onClick={handleCtaCheckup}
          className="flex-1 inline-flex h-12 items-center justify-center gap-2 rounded-xl px-4 font-semibold text-white bg-gradient-to-r from-[color:var(--brand-700)] to-[color:var(--brand-600)] shadow-brand transition-transform active:scale-[0.99] focus-visible:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[color:var(--brand-600)] ring-offset-white"
        >
          <Stethoscope className="w-4 h-4" />
          Check-up grátis
        </Link>
        <Link
          href="/produtos"
          data-testid="sticky-cta-produtos"
          onClick={handleCtaProdutos}
          className="flex-1 inline-flex h-12 items-center justify-center rounded-xl px-4 font-semibold text-ink border-2 border-[color:var(--brand-600)]/40 bg-white/80 hover:bg-white transition-colors"
        >
          Ver produtos
        </Link>
        <a
          href={`https://wa.me/${process.env.NEXT_PUBLIC_CONTACT_WHATSAPP || '554797789479'}?text=Quero%20saber%20mais%20sobre%20os%20protocolos%20Me%20Joy`}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Falar no WhatsApp"
          onClick={handleWhatsAppClick}
          className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg hover:bg-[#20BA5A] transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#25D366] ring-offset-white"
          data-analytics="lpac_whatsapp_cta"
        >
          <MessageCircle className="w-6 h-6" />
        </a>
      </div>
    </div>
  );
}

