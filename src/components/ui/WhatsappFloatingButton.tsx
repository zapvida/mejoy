'use client';

import { useRouter } from 'next/router';
import { track } from '@/lib/analytics';

const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_CONTACT_WHATSAPP || '554797789479';
const WHATSAPP_URL = `https://wa.me/${WHATSAPP_NUMBER}?text=Olá!%20Gostaria%20de%20saber%20mais%20sobre%20os%20produtos%20Me%20Joy%20Farma`;

/** Páginas onde o botão NÃO aparece (PDP tem CTA integrado na barra fixa) */
const HIDE_ON_PATHS = ['/admin', '/b2b', '/login', '/auth', '/dashboard', '/checkout', '/triagem', '/cart', '/p', '/emagrecimento'];

/** Ícone oficial do WhatsApp (SVG) */
function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden
    >
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.865 9.865 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}

export function WhatsappFloatingButton() {
  const router = useRouter();
  const pathname = router?.pathname || '';

  const shouldHide = HIDE_ON_PATHS.some((p) => pathname.startsWith(p));
  if (shouldHide) return null;

  const handleClick = () => {
    track('whatsapp_floating_cta_click', { section: 'floating', path: pathname });
  };

  return (
    <>
      {/* Mobile: pill fixo no rodapé, full-width com margens, safe-area */}
      <a
        href={WHATSAPP_URL}
        target="_blank"
        rel="noopener noreferrer"
        onClick={handleClick}
        aria-label="Individualize a sua fórmula de saúde"
        className="fixed left-4 right-4 z-50 md:hidden flex items-center justify-center gap-2 rounded-full bg-[#25D366] hover:bg-[#20BA5A] text-white font-bold text-base py-4 shadow-xl hover:shadow-2xl transition-all active:scale-[0.98] pointer-events-auto"
        style={{ bottom: 'calc(16px + env(safe-area-inset-bottom, 0px))' }}
      >
        <WhatsAppIcon className="w-5 h-5 shrink-0" />
        <span>Individualize a sua fórmula de saúde</span>
      </a>

      {/* Desktop: floating menor canto inferior direito - só o símbolo */}
      <a
        href={WHATSAPP_URL}
        target="_blank"
        rel="noopener noreferrer"
        onClick={handleClick}
        aria-label="Falar no WhatsApp"
        className="hidden md:flex fixed bottom-8 right-8 z-50 items-center justify-center w-14 h-14 rounded-full bg-[#25D366] text-white shadow-xl hover:bg-[#20BA5A] hover:scale-105 transition-all duration-200 border-2 border-white/30 pointer-events-auto"
      >
        <WhatsAppIcon className="w-8 h-8" />
      </a>
    </>
  );
}
