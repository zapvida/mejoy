'use client';

/**
 * Ajustes globais leves de renderização para imagens da landing de emagrecimento.
 */
export function ObesidadeImageGlobalStyles() {
  return (
    <style jsx global>{`
      .emagrecimento-lp {
        --lp-bg-soft: #f0fdf8;
        --lp-brand: #047857;
        --lp-brand-strong: #065f46;
        --lp-ink: #0f172a;
        --lp-muted: #475569;
        --lp-accent: #d97706;
      }
      .emagrecimento-lp h1,
      .emagrecimento-lp h2,
      .emagrecimento-lp h3,
      .emagrecimento-lp h4 {
        font-family: var(--font-emagrecimento-display), system-ui, sans-serif;
        letter-spacing: -0.02em;
      }
      .emagrecimento-lp,
      .emagrecimento-lp p,
      .emagrecimento-lp li,
      .emagrecimento-lp a,
      .emagrecimento-lp span {
        font-family: var(--font-emagrecimento-body), system-ui, sans-serif;
      }
      img[src*='images/emagrecimento/medvi/'] {
        object-fit: cover !important;
        transition: opacity 0.3s ease;
      }
      .image-fallback {
        transition: opacity 0.3s ease;
        z-index: 1;
      }
      @media (max-width: 640px) {
        .emagrecimento-lp h1,
        .emagrecimento-lp h2 {
          letter-spacing: -0.015em;
        }
      }
    `}</style>
  );
}
