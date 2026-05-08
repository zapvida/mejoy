export const colors = {
  background: '#F3F4EF',
  backgroundAccent: '#E6ECE6',
  ink: '#0C1A16',
  inkSoft: '#10231D',
  surface: '#F6FBF8',
  surfaceMuted: '#EEF3F0',
  surfaceStrong: '#E8F3ED',
  surfaceElevated: '#FCFDFC',
  surfaceWarm: '#F8F0E8',
  surfaceOverlay: 'rgba(12, 26, 22, 0.72)',
  card: '#FFFFFF',
  cardSubtle: '#F9FBFA',
  brand: '#167C5A',
  brandStrong: '#0E5B41',
  brandSoft: '#DDEFE7',
  accent: '#FF8A3D',
  accentSoft: '#FBE8DA',
  success: '#18794E',
  successSoft: '#E8F6EE',
  warning: '#B7791F',
  warningSoft: '#FBF1D8',
  danger: '#C53030',
  dangerSoft: '#FCEAEA',
  text: '#10231D',
  textStrong: '#09140F',
  textMuted: '#557468',
  textSoft: '#7A9187',
  border: '#D4E4DC',
  borderStrong: '#B6CCC0',
  white: '#FFFFFF',
} as const;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
  xxxl: 40,
} as const;

export const radii = {
  sm: 12,
  md: 18,
  lg: 24,
  xl: 32,
  pill: 999,
} as const;

export const typography = {
  display: 34,
  title: 28,
  section: 22,
  body: 16,
  bodyStrong: 17,
  caption: 13,
  micro: 11,
} as const;

export const shadows = {
  soft: '0 10px 28px rgba(12, 26, 22, 0.06)',
  medium: '0 18px 42px rgba(12, 26, 22, 0.12)',
  focus: '0 12px 28px rgba(22, 124, 90, 0.14)',
  elevation1: '0 8px 24px rgba(12, 26, 22, 0.06)',
  elevation2: '0 18px 42px rgba(12, 26, 22, 0.1)',
  elevation3: '0 28px 68px rgba(12, 26, 22, 0.14)',
} as const;

export const motion = {
  immediate: 120,
  quick: 180,
  regular: 260,
  slow: 420,
  lingering: 560,
} as const;

export const haptics = {
  selection: 'selection',
  success: 'success',
  warning: 'warning',
  impact: 'impact',
} as const;

export const emphasis = {
  brandSurface: colors.brandSoft,
  accentSurface: colors.accentSoft,
  successSurface: colors.successSoft,
  warningSurface: colors.warningSoft,
  brandText: colors.brandStrong,
  accentText: colors.ink,
  successText: colors.success,
  warningText: colors.warning,
} as const;
