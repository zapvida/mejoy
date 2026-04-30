// src/features/triage/emojis.ts
// Sistema Emoji Smart - emojis contextuais e inteligentes

import React from 'react';

export type EmojiContext = {
  slug: string;
  motivator?: "dor"|"risco"|"estetica"|"bem-estar"|"performance";
  hasRedFlag?: boolean;
  location?: "hero"|"section"|"cta"|"list"|"title";
  device?: "mobile"|"desktop";
  print?: boolean;
  age?: number;
};

export type EmojiMode = "legacy"|"smart"|"off";

/**
 * Mapa de emojis por slug de triagem
 */
const EMOJI_MAP: Record<string, string> = {
  // P0 - Alta demanda/urgência
  "cardiovascular": "❤️",
  "diabetes-metabolismo": "🍯", 
  "dor-cronica": "🩹",
  "coluna": "🦴",
  "respiratoria": "🫁",
  "renal": "🫘",
  "hepatica": "🫀",
  "mulher": "👩",
  "prostata": "🎯",
  "tireoide": "🦋",
  
  // P1 - Conversão média-alta
  "mama": "🌸",
  "ocular": "👁️",
  "auditiva": "👂",
  "pele": "🧴",
  "alergias": "🤧",
  "sexual": "💕",
  "idoso": "👴",
  "bucal": "🦷",
  "crianca": "👶",
  "trabalhador": "💼",
  
  // P2 - Tendências
  "longevidade": "⏰",
  "vitalidade": "⚡",
  "microbioma": "🦠",
  "micronutrientes": "🧪",
  "biohacking": "🧬",
  
  // Triagens existentes
  "gastro": "🟢",
  "testeSaude": "🧪",
  "geral": "🧬",
  "mental": "🧠",
  "sono": "😴",
  "enxaqueca": "🤕",
  "obesidade": "⚖️",
  "gestante": "🤱",
  "tabagismo": "🚭",
  "depressao": "😔",
  "tdah": "🎯"
};

/**
 * Mapa de emojis por motivador
 */
const MOTIVATOR_EMOJI_MAP: Record<string, string[]> = {
  "dor": ["🩹", "💊", "🏥", "🚨"],
  "risco": ["⚠️", "🚨", "❤️", "🫀"],
  "estetica": ["✨", "💅", "🌸", "🧴"],
  "bem-estar": ["🌟", "💚", "⚡", "🧘"],
  "performance": ["🏃", "💪", "🧬", "⚡"]
};

/**
 * Renderiza emoji baseado no contexto e modo
 */
export function renderEmoji(
  metaEmoji: string | undefined, 
  ctx: EmojiContext, 
  mode: EmojiMode = "legacy"
): string | null {
  // Modo off - nunca exibe emojis
  if (mode === "off") return null;
  
  // Modo legacy - comportamento atual (usa metaEmoji)
  if (mode === "legacy") return metaEmoji || "";
  
  // Modo smart - lógica contextual
  if (mode === "smart") {
    return renderSmartEmoji(metaEmoji, ctx);
  }
  
  return null;
}

/**
 * Lógica do modo smart para renderização de emojis
 */
function renderSmartEmoji(metaEmoji: string | undefined, ctx: EmojiContext): string | null {
  // Não exibir emojis na impressão
  if (ctx.print) return null;
  
  // Red flag tem prioridade máxima - apenas em hero e cta
  if (ctx.hasRedFlag && ["hero", "cta"].includes(ctx.location || "")) {
    return "🚨";
  }
  
  // Evitar emojis em títulos se mobile (pode truncar)
  if (ctx.location === "title" && ctx.device === "mobile") {
    return null;
  }
  
  // Máximo 1 emoji por bloco em mobile
  if (ctx.device === "mobile" && ctx.location === "list") {
    return null;
  }
  
  // Emoji específico por slug
  const slugEmoji = EMOJI_MAP[ctx.slug];
  if (slugEmoji) {
    return slugEmoji;
  }
  
  // Fallback por motivador
  if (ctx.motivator && MOTIVATOR_EMOJI_MAP[ctx.motivator]) {
    const motivatorEmojis = MOTIVATOR_EMOJI_MAP[ctx.motivator];
    return motivatorEmojis[0]; // Primeiro emoji do motivador
  }
  
  // Fallback para metaEmoji se disponível
  return metaEmoji || null;
}

/**
 * Componente React para emoji com acessibilidade
 */
export function Emoji({ 
  char, 
  label, 
  className = "" 
}: { 
  char: string; 
  label: string;
  className?: string;
}): React.ReactElement | null {
  if (!char) return null;
  
  // Retorna um span com o emoji para acessibilidade
  return React.createElement('span', {
    role: 'img',
    'aria-label': label,
    className: className
  }, char);
}

/**
 * Hook para usar emojis com contexto
 */
export function useEmoji(
  metaEmoji: string | undefined,
  ctx: EmojiContext
): string | null {
  const mode = (process.env.NEXT_PUBLIC_EMOJI_MODE as EmojiMode) || "legacy";
  return renderEmoji(metaEmoji, ctx, mode);
}

/**
 * Utilitário para detectar dispositivo
 */
export function detectDevice(): "mobile"|"desktop" {
  if (typeof window === 'undefined') return 'desktop';
  
  return window.innerWidth < 768 ? 'mobile' : 'desktop';
}

/**
 * Utilitário para detectar se está em modo impressão
 */
export function isPrintMode(): boolean {
  if (typeof window === 'undefined') return false;
  
  return window.matchMedia('print').matches;
}

/**
 * Configuração de emojis por contexto
 */
export const EMOJI_CONFIG = {
  // Máximo de emojis por contexto
  maxPerContext: {
    hero: 1,
    section: 2,
    cta: 1,
    list: 0, // Evitar poluição em listas
    title: 0  // Evitar truncamento
  },
  
  // Emojis proibidos em certos contextos
  forbidden: {
    mobile: ["🦠", "🧬", "🧪"], // Muito pequenos
    print: ["🚨", "⚠️", "💊"] // Podem ser confundidos
  }
};

/**
 * Cria contexto de emoji baseado em dados da triagem
 */
export function createEmojiContext(
  slug: string,
  motivator?: string,
  hasRedFlag?: boolean,
  location?: string,
  age?: number
): EmojiContext {
  return {
    slug,
    motivator: motivator as any,
    hasRedFlag,
    location: location as any,
    device: detectDevice(),
    print: isPrintMode(),
    age
  };
}