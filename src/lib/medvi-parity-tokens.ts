/**
 * Tokens alinhados a home.medvi.org (Framer) e glp.medvi.org (Webflow).
 */
export const MEDVI_HOME = {
  /** Verde profundo hero */
  heroBg: '#0B3D2E',
  /** Gradiente vertical hero (top → bottom) */
  heroGradient: 'linear-gradient(180deg, #1a4731 0%, #1e4432 42%, #235d3d 100%)',
  /** Destaque no título (mint) */
  mintAccent: '#A3E635',
  heroTextMuted: 'rgba(255,255,255,0.9)',
  /** Painel branco — lista vertical de filas (home.medvi.org) */
  stackOuterRadiusTop: 36,
  stackRowRadius: 18,
  /** Área da imagem — quadrado (mobile full-bleed MedVi) */
  stackThumbPx: 88,
  /** Raio canto direito do thumb; esquerda herda flush com a fila */
  stackThumbInnerRadius: 12,
  stackRowMinH: 88,
  stackCardBg: '#f0f2f1',
  /** Gap entre linhas do painel mobile (px) */
  stackRowGapPx: 12,
  /** Sombra do painel branco sobre o hero */
  cardShadow: '0 24px 80px rgba(0,0,0,0.18)',
  /** Medidas espelhando home.medvi.org (Framer) — revisar com DevTools se necessário */
  heroPaddingTopMobileRem: 5.25,
  heroPaddingTopSmRem: 5.75,
  heroPaddingTopMdRem: 6,
  heroPaddingBottomMobileRem: 0.5,
  heroPaddingBottomMdRem: 3,
  heroHeadlineMaxWidthPx: 680,
  /** Sobreposição do painel branco no verde (mobile); ~0.75rem espelha MedVi */
  stackPanelOverlapRem: 0.75,
  /** Espaçamento vertical “respirado” entre blocos principais */
  sectionStackGapPx: 60,
  desktopCardWidthPx: 180,
  desktopCardGapPx: 20,
  desktopCardRadiusPx: 22,
  desktopCardShadow: '0 16px 48px rgba(0,0,0,0.14)',
  /** Destaque em título H2 (ex.: “com cuidado personalizado”) */
  headlineHighlightGreen: '#16a34a',
  /** Painel decorativo atrás do asset GLP */
  glpMintPanelBg: '#d8f0e8',
  glpBlockRadiusPx: 28,
  glpImageRadiusPx: 20,
  /** Triptico editorial */
  editorialTriptychRadiusPx: 40,
  editorialTriptychGapPx: 14,
  editorialTriptychStaggerPx: 22,
  editorialTriptychShadow: '0 20px 50px rgba(15,23,42,0.12)',
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
  /** Retângulos arredondados no hero (glp.medvi.org — não capsule / óvalo) */
  heroProofPhotoRadiusPx: 14,
  /** Largura máxima de cada retrato no trio (px) — paridade ~glp.medvi.org em container 1100px */
  heroProofPhotoMaxPx: 132,
  /** Gaps da fileira de retratos (px): base ≈ Tailwind gap-2, sm+ ≈ gap-3 */
  heroProofRowGapPx: 8,
  heroProofRowGapSmPx: 12,
  /** Zoom-out inicial no load (Ken Burns): escala antes da transição */
  heroProofPhotoZoomFrom: 1.1,
  /** Duração da transição de zoom (ms) */
  heroProofPhotoZoomMs: 1200,
  /** Padding-top da seção hero com header fixo sem faixa promo (abaixo do header h-14 / sm:h-[60px]) */
  heroPaddingTopBaseRem: 4.75,
  heroPaddingTopSmRem: 5,
  heroPaddingTopLgRem: 5.25,
  /** Header CTA escuro estilo “Get approved” */
  headerCtaDark: '#2D2926',
} as const;
