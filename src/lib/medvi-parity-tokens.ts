/**
 * Tokens alinhados a home.medvi.org (Framer) e glp.medvi.org (Webflow).
 */
export const MEDVI_HOME = {
  /** Verde profundo hero */
  heroBg: '#0B3D2E',
  /** Gradiente vertical hero (top → bottom) */
  heroGradient: 'linear-gradient(180deg, #0B3D2E 0%, #0d4536 38%, #124d3e 100%)',
  /** Destaque no título (mint) */
  mintAccent: '#A3E635',
  heroTextMuted: 'rgba(255,255,255,0.9)',
  cardShadow: '0 24px 80px rgba(0,0,0,0.18)',
  /** Cards horizontais — imagem em pad colorido */
  cardImageH: 120,
  cardMinW: 228,
  cardRadius: 20,
} as const;

export const MEDVI_GLP = {
  pageBg: '#f6f6f4',
  charcoal: '#1a1a1a',
  charcoalSoft: '#303030',
  subheadGray: '#525252',
  /** Sage botão / destaque MedVi Webflow */
  sage: '#708869',
  sageHover: '#5f7460',
  checkGold: '#C4A574',
  bodySizePx: 14,
  bodyLeadingPx: 20,
  ctaHeightPx: 52,
  photoRadiusPx: 32,
  /** Header CTA escuro estilo “Get approved” */
  headerCtaDark: '#2D2926',
} as const;
