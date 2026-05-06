'use client';

import Link from 'next/link';
import { MessageCircle } from 'lucide-react';
import { track } from '@/lib/analytics';

export default function StickyBar() {
  const handleCtaClick = () => {
    track('sticky_cta_click', { section: 'sticky' });
  };

  const handleWhatsAppClick = () => {
    track('whatsapp_cta_click', { section: 'sticky' });
  };

  return (
    <div className="sticky-bottom md:hidden bg-popover/80 backdrop-blur border-t border-[color:var(--border)]">
      <div className="mx-auto max-w-md px-4 py-3 flex items-center gap-3">
        <Link
          href="/b2b/configurar"
          data-testid="sticky-cta"
          data-analytics="lpac_sticky_cta"
          onClick={handleCtaClick}
          className="flex-1 inline-flex h-12 items-center justify-center rounded-2xl px-5 font-semibold text-white bg-gradient-to-r from-[color:var(--brand-700)] to-[color:var(--brand-600)] shadow-brand transition-transform active:scale-[0.99] focus-visible:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[color:var(--brand-600)] ring-offset-white"
        >
          Personalizar grátis
        </Link>
        <a
          href="https://wa.me/5547999009923?text=Quero%20saber%20mais%20sobre%20o%20MeJoy"
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
