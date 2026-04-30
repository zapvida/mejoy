/**
 * Utilitários para aplicar cores dinâmicas de produtos em componentes Tailwind
 */

import type { ZapfarmProductConfig } from '@/config/zapfarm/products';

export interface ColorClasses {
  primary: string;
  secondary: string;
  gradient: string;
  gradientCTA: string;
  gradientBg: string;
  border: string;
  bg: string;
  text: string;
  hover: string;
  stepGradient: string;
  connectorGradient: string;
  border500: string;
  border300: string;
  bg600: string;
  bgSecondary50: string;
  borderSecondary200: string;
}

/**
 * Mapeia cores do produto para classes Tailwind válidas
 */
export function getProductColorClasses(colors: ZapfarmProductConfig['colors']): ColorClasses {
  const primary = colors.primary;

  const gradients: Record<string, Record<string, string>> = {
    purple: {
      primary: 'purple',
      secondary: 'orange',
      gradient: 'from-purple-700 via-purple-600 to-orange-600',
      gradientCTA: 'from-purple-600 to-orange-600',
      gradientBg: 'from-purple-50 via-white to-orange-50',
      stepGradient: 'from-purple-600 to-orange-600',
      connectorGradient: 'from-purple-400 to-orange-400',
    },
    indigo: {
      primary: 'indigo',
      secondary: 'blue',
      gradient: 'from-indigo-700 via-indigo-600 to-blue-600',
      gradientCTA: 'from-indigo-600 to-blue-600',
      gradientBg: 'from-indigo-50 via-white to-blue-50',
      stepGradient: 'from-indigo-600 to-blue-600',
      connectorGradient: 'from-indigo-400 to-blue-400',
    },
    blue: {
      primary: 'blue',
      secondary: 'indigo',
      gradient: 'from-blue-700 via-blue-600 to-indigo-600',
      gradientCTA: 'from-blue-600 to-indigo-600',
      gradientBg: 'from-blue-50 via-white to-indigo-50',
      stepGradient: 'from-blue-600 to-indigo-600',
      connectorGradient: 'from-blue-400 to-indigo-400',
    },
    green: {
      primary: 'green',
      secondary: 'teal',
      gradient: 'from-green-700 via-green-600 to-teal-600',
      gradientCTA: 'from-green-600 to-teal-600',
      gradientBg: 'from-green-50 via-white to-teal-50',
      stepGradient: 'from-green-600 to-teal-600',
      connectorGradient: 'from-green-400 to-teal-400',
    },
    emerald: {
      primary: 'emerald',
      secondary: 'green',
      gradient: 'from-emerald-700 via-emerald-600 to-green-600',
      gradientCTA: 'from-emerald-600 to-green-600',
      gradientBg: 'from-emerald-50 via-white to-green-50',
      stepGradient: 'from-emerald-600 to-green-600',
      connectorGradient: 'from-emerald-400 to-green-400',
    },
    amber: {
      primary: 'amber',
      secondary: 'yellow',
      gradient: 'from-amber-700 via-amber-600 to-yellow-600',
      gradientCTA: 'from-amber-600 to-yellow-600',
      gradientBg: 'from-amber-50 via-white to-yellow-50',
      stepGradient: 'from-amber-600 to-yellow-600',
      connectorGradient: 'from-amber-400 to-yellow-400',
    },
    red: {
      primary: 'red',
      secondary: 'rose',
      gradient: 'from-red-700 via-red-600 to-rose-600',
      gradientCTA: 'from-red-600 to-rose-600',
      gradientBg: 'from-red-50 via-white to-rose-50',
      stepGradient: 'from-red-600 to-rose-600',
      connectorGradient: 'from-red-400 to-rose-400',
    },
    pink: {
      primary: 'pink',
      secondary: 'rose',
      gradient: 'from-pink-700 via-pink-600 to-rose-600',
      gradientCTA: 'from-pink-600 to-rose-600',
      gradientBg: 'from-pink-50 via-white to-rose-50',
      stepGradient: 'from-pink-600 to-rose-600',
      connectorGradient: 'from-pink-400 to-rose-400',
    },
    slate: {
      primary: 'slate',
      secondary: 'gray',
      gradient: 'from-slate-700 via-slate-600 to-gray-600',
      gradientCTA: 'from-slate-600 to-gray-600',
      gradientBg: 'from-slate-50 via-white to-gray-50',
      stepGradient: 'from-slate-600 to-gray-600',
      connectorGradient: 'from-slate-400 to-gray-400',
    },
    cyan: {
      primary: 'cyan',
      secondary: 'blue',
      gradient: 'from-cyan-700 via-cyan-600 to-blue-600',
      gradientCTA: 'from-cyan-600 to-blue-600',
      gradientBg: 'from-cyan-50 via-white to-blue-50',
      stepGradient: 'from-cyan-600 to-blue-600',
      connectorGradient: 'from-cyan-400 to-blue-400',
    },
  };

  const config = gradients[primary] || gradients.purple;

  const getBorderClass = (color: string, shade: string) => {
    const borders: Record<string, Record<string, string>> = {
      purple: { '200': 'border-purple-200', '300': 'border-purple-300', '500': 'border-purple-500' },
      indigo: { '200': 'border-indigo-200', '300': 'border-indigo-300', '500': 'border-indigo-500' },
      blue: { '200': 'border-blue-200', '300': 'border-blue-300', '500': 'border-blue-500' },
      green: { '200': 'border-green-200', '300': 'border-green-300', '500': 'border-green-500' },
      emerald: { '200': 'border-emerald-200', '300': 'border-emerald-300', '500': 'border-emerald-500' },
      amber: { '200': 'border-amber-200', '300': 'border-amber-300', '500': 'border-amber-500' },
      red: { '200': 'border-red-200', '300': 'border-red-300', '500': 'border-red-500' },
      pink: { '200': 'border-pink-200', '300': 'border-pink-300', '500': 'border-pink-500' },
      slate: { '200': 'border-slate-200', '300': 'border-slate-300', '500': 'border-slate-500' },
      cyan: { '200': 'border-cyan-200', '300': 'border-cyan-300', '500': 'border-cyan-500' },
    };
    return borders[color]?.[shade] || borders.purple[shade];
  };

  const getBgClass = (color: string, shade: string) => {
    const bgs: Record<string, Record<string, string>> = {
      purple: { '50': 'bg-purple-50', '600': 'bg-purple-600' },
      indigo: { '50': 'bg-indigo-50', '600': 'bg-indigo-600' },
      blue: { '50': 'bg-blue-50', '600': 'bg-blue-600' },
      green: { '50': 'bg-green-50', '600': 'bg-green-600' },
      emerald: { '50': 'bg-emerald-50', '600': 'bg-emerald-600' },
      amber: { '50': 'bg-amber-50', '600': 'bg-amber-600' },
      red: { '50': 'bg-red-50', '600': 'bg-red-600' },
      pink: { '50': 'bg-pink-50', '600': 'bg-pink-600' },
      slate: { '50': 'bg-slate-50', '600': 'bg-slate-600' },
      cyan: { '50': 'bg-cyan-50', '600': 'bg-cyan-600' },
    };
    return bgs[color]?.[shade] || bgs.purple[shade];
  };

  const getSecondaryBgClass = (color: string) => {
    const secondaryBgs: Record<string, string> = {
      orange: 'bg-orange-50',
      blue: 'bg-blue-50',
      teal: 'bg-teal-50',
      green: 'bg-green-50',
      yellow: 'bg-yellow-50',
      rose: 'bg-rose-50',
      gray: 'bg-gray-50',
    };
    return secondaryBgs[color] || 'bg-orange-50';
  };

  const getSecondaryBorderClass = (color: string) => {
    const secondaryBorders: Record<string, string> = {
      orange: 'border-orange-200',
      blue: 'border-blue-200',
      teal: 'border-teal-200',
      green: 'border-green-200',
      yellow: 'border-yellow-200',
      rose: 'border-rose-200',
      gray: 'border-gray-200',
    };
    return secondaryBorders[color] || 'border-orange-200';
  };

  const getTextClass = (color: string) => {
    const texts: Record<string, string> = {
      purple: 'text-purple-600',
      indigo: 'text-indigo-600',
      blue: 'text-blue-600',
      green: 'text-green-600',
      emerald: 'text-emerald-600',
      amber: 'text-amber-600',
      red: 'text-red-600',
      pink: 'text-pink-600',
      slate: 'text-slate-600',
      cyan: 'text-cyan-600',
    };
    return texts[color] || 'text-purple-600';
  };

  return {
    primary: config.primary,
    secondary: config.secondary,
    gradient: config.gradient,
    gradientCTA: config.gradientCTA,
    gradientBg: config.gradientBg,
    stepGradient: config.stepGradient,
    connectorGradient: config.connectorGradient,
    border: getBorderClass(config.primary, '200'),
    border300: getBorderClass(config.primary, '300'),
    border500: getBorderClass(config.primary, '500'),
    bg: getBgClass(config.primary, '50'),
    bg600: getBgClass(config.primary, '600'),
    text: getTextClass(config.primary),
    hover: `hover:${getBgClass(config.primary, '50')}`,
    bgSecondary50: getSecondaryBgClass(config.secondary),
    borderSecondary200: getSecondaryBorderClass(config.secondary),
  };
}

/**
 * Helper para obter classes de texto por cor primária
 */
export function getTextColorClass(primary: string): string {
  const mapping: Record<string, string> = {
    purple: 'text-purple-700',
    indigo: 'text-indigo-700',
    blue: 'text-blue-700',
    green: 'text-green-700',
    emerald: 'text-emerald-700',
    amber: 'text-amber-700',
    red: 'text-red-700',
    pink: 'text-pink-700',
    slate: 'text-slate-700',
    cyan: 'text-cyan-700',
  };
  return mapping[primary] || 'text-purple-700';
}

/**
 * Helper para obter classes de background por cor primária
 */
export function getBgColorClass(primary: string): string {
  const mapping: Record<string, string> = {
    purple: 'bg-purple-50',
    indigo: 'bg-indigo-50',
    blue: 'bg-blue-50',
    green: 'bg-green-50',
    emerald: 'bg-emerald-50',
    amber: 'bg-amber-50',
    red: 'bg-red-50',
    pink: 'bg-pink-50',
    slate: 'bg-slate-50',
    cyan: 'bg-cyan-50',
  };
  return mapping[primary] || 'bg-purple-50';
}

