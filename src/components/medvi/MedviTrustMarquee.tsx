'use client';

const items = [
  {
    label: 'PREÇOS CLAROS',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
        <rect x="3" y="5" width="18" height="14" rx="2" />
        <path d="M8 9h2M12 9h4M8 13h1M12 13h4" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    label: 'ENVIO ACOMPANHADO',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
        <path d="M4 8h12l2 4h3v5h-3.5M8 17a2 2 0 110 4 2 2 0 010-4zM18 17a2 2 0 110 4 2 2 0 010-4z" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    label: 'PROFISSIONAIS CREDENCIADOS',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
        <path d="M4.5 12.5c0-2.5 2-4.5 4.5-4.5V6a6 6 0 016 6v2M9 14v4M9 14h6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    label: '100% ONLINE',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
        <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
] as const;

function MarqueeStrip() {
  return (
    <div className="flex w-max shrink-0 items-center gap-[2.5rem] pr-[2.5rem] sm:gap-12 sm:pr-12">
      {items.map(({ label, icon }) => (
        <span key={label} className="flex items-center gap-2.5 whitespace-nowrap">
          <span className="flex shrink-0 text-black" aria-hidden>
            {icon}
          </span>
          <span className="text-[11px] font-semibold uppercase tracking-[0.12em] text-black sm:text-[12px] sm:tracking-[0.14em]">
            {label}
          </span>
        </span>
      ))}
    </div>
  );
}

/** Faixa branca estilo home.medvi.org — ticker contínuo com ícones line-art e texto em caixa alta. */
export function MedviTrustMarquee({ variant = 'default' }: { variant?: 'default' | 'bordered' }) {
  return (
    <div
      className={`relative w-full overflow-hidden bg-white ${
        variant === 'bordered' ? 'border-y border-neutral-200' : ''
      }`}
      data-testid="medvi-trust-marquee"
      data-home-section="trust-marquee"
    >
      <div className="flex min-h-[48px] items-center py-2.5 text-black sm:min-h-[52px]" role="presentation">
        <div className="medvi-marquee-track flex w-max">
          <MarqueeStrip />
          <MarqueeStrip />
        </div>
      </div>
    </div>
  );
}
