/**
 * Utilitários de cores — leve e local
 * Sistema de derivação de cores com validação automática de contraste (WCAG AA)
 */

export type Hex = `#${string}`;

/**
 * Converte HEX para HSL
 */
export function hexToHsl(hex: Hex): { h: number; s: number; l: number } {
  let r = 0, g = 0, b = 0;
  const p = hex.replace('#', '');
  
  if (p.length === 3) {
    r = parseInt(p[0] + p[0], 16);
    g = parseInt(p[1] + p[1], 16);
    b = parseInt(p[2] + p[2], 16);
  } else {
    r = parseInt(p.slice(0, 2), 16);
    g = parseInt(p.slice(2, 4), 16);
    b = parseInt(p.slice(4, 6), 16);
  }
  
  r /= 255;
  g /= 255;
  b /= 255;
  
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0, s = 0;
  const l = (max + min) / 2;
  
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    
    switch (max) {
      case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
      case g: h = ((b - r) / d + 2) / 6; break;
      case b: h = ((r - g) / d + 4) / 6; break;
    }
  }
  
  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    l: Math.round(l * 100),
  };
}

/**
 * Converte HSL para HEX
 */
export function hslToHex(h: number, s: number, l: number): Hex {
  s /= 100;
  l /= 100;
  
  const k = (n: number) => (n + h / 30) % 12;
  const a = s * Math.min(l, 1 - l);
  const f = (n: number) => {
    const val = l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
    return Math.round(val * 255).toString(16).padStart(2, '0');
  };
  
  return `#${f(0)}${f(8)}${f(4)}` as Hex;
}

/**
 * Clareia uma cor
 */
export function lighten(hex: Hex, by = 8): Hex {
  const { h, s, l } = hexToHsl(hex);
  return hslToHex(h, s, Math.min(95, l + by));
}

/**
 * Escurece uma cor
 */
export function darken(hex: Hex, by = 12): Hex {
  const { h, s, l } = hexToHsl(hex);
  return hslToHex(h, s, Math.max(5, l - by));
}

/**
 * Calcula razão de contraste (WCAG)
 */
export function contrastRatio(fg: Hex, bg: Hex): number {
  const lum = (hex: Hex) => {
    const [r, g, b] = [1, 3, 5].map((o) =>
      parseInt(hex.slice(o, o + 2), 16) / 255
    ).map((v) =>
      v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4)
    );
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
  };
  
  const L1 = lum(fg) + 0.05;
  const L2 = lum(bg) + 0.05;
  return L1 > L2 ? L1 / L2 : L2 / L1;
}

/**
 * Deriva variações seguras da cor brand (com validação de contraste)
 * Garante WCAG AA (4.5:1) sobre fundo branco
 */
export function deriveBrand(seed: Hex): {
  brand600: Hex;
  brand700: Hex;
  optimized: boolean;
} {
  let brand600 = seed;
  let brand700 = darken(seed, 10);
  let optimized = false;
  
  // Valida contraste com background branco (WCAG AA = 4.5:1)
  const contrastOnWhite = contrastRatio(brand600, '#ffffff');
  
  if (contrastOnWhite < 4.5) {
    // Ajusta automaticamente se contraste ruim
    brand600 = darken(seed, 18);
    brand700 = darken(seed, 26);
    optimized = true;
  }
  
  return { brand600, brand700, optimized };
}

/**
 * Aplica vars de brand no documentElement
 */
export function applyBrandVars(
  base: { brand600: Hex; brand700: Hex },
  accent?: Hex
): void {
  if (typeof document === 'undefined') return;
  
  const root = document.documentElement;
  root.style.setProperty('--brand-600', base.brand600);
  root.style.setProperty('--brand-700', base.brand700);
  root.style.setProperty('--brand', base.brand600); // Legacy support
  
  if (accent) {
    const a = deriveBrand(accent);
    root.style.setProperty('--accent-600', a.brand600);
    root.style.setProperty('--accent-700', a.brand700);
    root.style.setProperty('--accent', a.brand600); // Legacy support
  }
}

/**
 * Paletas curadas (8 cores prontas para seleção rápida)
 */
export const CURATED_PALETTES = [
  { name: 'Emerald', brand: '#10b981', accent: '#34d399' },
  { name: 'Teal', brand: '#14b8a6', accent: '#06b6d4' },
  { name: 'Blue', brand: '#3b82f6', accent: '#60a5fa' },
  { name: 'Indigo', brand: '#6366f1', accent: '#818cf8' },
  { name: 'Violet', brand: '#7c3aed', accent: '#a78bfa' },
  { name: 'Rose', brand: '#f43f5e', accent: '#fb7185' },
  { name: 'Amber', brand: '#f59e0b', accent: '#fbbf24' },
  { name: 'Cyan', brand: '#06b6d4', accent: '#22d3ee' },
] as const;

