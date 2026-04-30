/**
 * Paleta de cores monocromática para ZapFarm
 * Apenas 3 cores: Preto, Branco e Verde ZapFarm
 */

export const Palette = {
  black: "#000000",
  white: "#ffffff",
  brand: "#00C853", // Verde ZapFarm
} as const;

// Para uso em React-PDF e emails (onde não há CSS vars)
export const PDFPalette = {
  black: Palette.black,
  white: Palette.white,
  brand: Palette.brand,
} as const;

// Para uso em Chart.js e outras bibliotecas
export const ChartPalette = {
  primary: Palette.brand,
  background: Palette.white,
  text: Palette.black,
  grid: "#ffffff", // cinza claro para grids
} as const;

// Validação de cores permitidas
export const ALLOWED_COLORS = [
  Palette.black,
  Palette.white,
  Palette.brand,
] as const;

export function isValidColor(color: string): boolean {
  return ALLOWED_COLORS.includes(color as any);
}

export function getBrandColor(): string {
  return Palette.brand;
}
