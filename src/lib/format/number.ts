// src/lib/format/number.ts
// Utilitários para formatação e conversão de números

/**
 * Converte string para número, tratando separadores brasileiros
 */
export const toNumber = (s: string | number): number => {
  if (typeof s === 'number') return s;
  if (!s) return 0;
  
  // Remove pontos de milhares e substitui vírgula por ponto
  const cleaned = String(s)
    .replace(/\./g, '') // Remove pontos de milhares
    .replace(',', '.')  // Substitui vírgula por ponto decimal
    .trim();
  
  const num = Number(cleaned);
  return isNaN(num) ? 0 : num;
};

/**
 * Formata número para exibição brasileira
 */
export const formatNumber = (num: number, decimals: number = 0): string => {
  return num.toLocaleString('pt-BR', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  });
};

/**
 * Formata peso em kg
 */
export const formatWeight = (weightKg: number): string => {
  return `${formatNumber(weightKg, 1)} kg`;
};

/**
 * Formata altura em cm
 */
export const formatHeight = (heightCm: number): string => {
  return `${formatNumber(heightCm, 0)} cm`;
};

/**
 * Máscara para peso
 */
export const maskWeight = (value: string): string => {
  return value.replace(/[^\d.,]/g, '').replace(',', '.');
};

/**
 * Máscara para altura
 */
export const maskHeight = (value: string): string => {
  return value.replace(/[^\d]/g, '');
};