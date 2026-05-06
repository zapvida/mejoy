// src/features/triage/ctas.ts
// Sistema de CTAs contextuais com UTM por triagem

import { EMOJI_MODE } from "@/lib/flags";
import { withUtm } from "@/lib/utm";
import type { BrandAffinity } from "@/types/triage-gastro";

export type Motivator = "dor"|"risco"|"estetica"|"bem-estar"|"performance";

export type CTAType = "zapvida"|"zapfarm"|"internal";

export interface CTAConfig {
  type: CTAType;
  url: string;
  text: string;
  priority: "high"|"medium"|"low";
  emoji?: string;
  description?: string;
  target?: "_blank"|"_self";
}

export interface CTAContext {
  slug: string;
  motivator: Motivator;
  hasRedFlag: boolean;
  patientAge?: number;
  patientSex?: "M"|"F"|"Outro";
}

/**
 * URLs base dos CTAs
 */
const CTA_BASE_URLS = {
  zapvida: process.env.NEXT_PUBLIC_ZAPVIDA_URL || "https://zapvida.com/",
  zapfarm: process.env.NEXT_PUBLIC_URL_ZAPFARM || "https://zapfarm.com.br/",
  internal: "/atendimento"
} as const;

/**
 * Mapeamento de motivadores para tipos de CTA
 */
const MOTIVATOR_CTA_MAP: Record<Motivator, CTAType> = {
  "dor": "zapvida",
  "risco": "zapvida", 
  "estetica": "zapfarm",
  "bem-estar": "zapfarm",
  "performance": "zapfarm"
};

/**
 * Configurações de CTAs por tipo
 */
const CTA_CONFIGS: Record<CTAType, Partial<CTAConfig>> = {
  zapvida: {
    text: "Falar com um médico agora",
    description: "Teleconsulta 24h com especialistas",
    priority: "high",
    target: "_blank"
  },
  zapfarm: {
    text: "Ver planos de saúde",
    description: "Planos personalizados e suplementos",
    priority: "medium", 
    target: "_blank"
  },
  internal: {
    text: "Agendar consulta",
    description: "Agendamento direto",
    priority: "medium",
    target: "_self"
  }
};

/**
 * Gera parâmetros UTM para tracking
 */
export function buildUTMParams(slug: string, context: string = "report"): string {
  const params = new URLSearchParams({
    utm_source: "triage",
    utm_medium: `${context}_${slug}`,
    utm_campaign: "2025Q4",
    utm_content: slug
  });
  
  return params.toString();
}

/**
 * Constrói URL completa do CTA com UTM
 */
export function buildCTAUrl(type: CTAType, slug: string, context: string = "report"): string {
  const baseUrl = CTA_BASE_URLS[type];
  const utmParams = buildUTMParams(slug, context);
  
  return `${baseUrl}?${utmParams}`;
}

/**
 * Determina o tipo de CTA baseado no contexto
 */
export function determineCTAType(context: CTAContext): CTAType {
  // Red flag sempre vai para ZapVida (urgência)
  if (context.hasRedFlag) {
    return "zapvida";
  }
  
  // Usar mapeamento por motivador
  return MOTIVATOR_CTA_MAP[context.motivator] || "zapfarm";
}

/**
 * Gera CTA contextual completo
 */
export function getContextualCTA(context: CTAContext): CTAConfig {
  const type = determineCTAType(context);
  const baseConfig = CTA_CONFIGS[type];
  const url = buildCTAUrl(type, context.slug);
  
  // Ajustar texto baseado no contexto
  let text = baseConfig.text || "";
  let description = baseConfig.description || "";
  
  if (context.hasRedFlag) {
    text = "🚨 Falar com um médico agora";
    description = "Atenção: Procure avaliação médica imediata";
  } else if (context.patientAge && context.patientAge < 18) {
    text = "Falar com um pediatra";
    description = "Consulta especializada para crianças e adolescentes";
  } else if (context.patientSex === "F" && ["mulher", "mama", "gestante"].includes(context.slug)) {
    text = "Falar com um ginecologista";
    description = "Consulta especializada em saúde da mulher";
  }
  
  return {
    type,
    url,
    text,
    description,
    priority: baseConfig.priority || "medium",
    target: baseConfig.target || "_blank"
  };
}

/**
 * Utilitário para tracking de CTA
 */
export function trackCTAClick(context: CTAContext, cta: CTAConfig) {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'cta_click', {
      cta_name: cta.text,
      cta_context: `report_${context.slug}`,
      cta_type: cta.type,
      triage_slug: context.slug,
      has_red_flag: context.hasRedFlag
    });
  }
}

/**
 * Hook para usar CTAs contextuais
 */
export function useContextualCTA(context: CTAContext) {
  const cta = getContextualCTA(context);
  
  const trackClick = () => {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'cta_click', {
        cta_name: cta.text,
        cta_context: `report_${context.slug}`,
        cta_type: cta.type,
        triage_slug: context.slug,
        has_red_flag: context.hasRedFlag
      });
    }
  };
  
  return {
    cta,
    trackClick,
    url: cta.url,
    text: cta.text,
    type: cta.type,
    priority: cta.priority
  };
}

/**
 * Utilitário para criar contexto de CTA a partir de dados da triagem
 */
export function createCTAContext(
  slug: string,
  motivator: Motivator,
  hasRedFlag: boolean = false,
  patientProfile?: { age?: number; sex?: "M"|"F"|"Outro" }
): CTAContext {
  return {
    slug,
    motivator,
    hasRedFlag,
    patientAge: patientProfile?.age,
    patientSex: patientProfile?.sex
  };
}

/**
 * Configurações de CTAs por slug específico
 */
export const SLUG_SPECIFIC_CTAS: Record<string, Partial<CTAConfig>> = {
  "cardiovascular": {
    text: "Falar com um cardiologista",
    description: "Consulta especializada em saúde cardiovascular"
  },
  "diabetes-metabolismo": {
    text: "Falar com um endocrinologista", 
    description: "Consulta especializada em diabetes e metabolismo"
  },
  "dor-cronica": {
    text: "Falar com um reumatologista",
    description: "Consulta especializada em dor crônica"
  },
  "coluna": {
    text: "Falar com um ortopedista",
    description: "Consulta especializada em problemas de coluna"
  },
  "respiratoria": {
    text: "Falar com um pneumologista",
    description: "Consulta especializada em saúde respiratória"
  },
  "mulher": {
    text: "Falar com um ginecologista",
    description: "Consulta especializada em saúde da mulher"
  },
  "prostata": {
    text: "Falar com um urologista",
    description: "Consulta especializada em saúde da próstata"
  },
  "crianca": {
    text: "Falar com um pediatra",
    description: "Consulta especializada para crianças"
  },
  "idoso": {
    text: "Falar com um geriatra",
    description: "Consulta especializada para idosos"
  }
};

/**
 * Aplica configurações específicas por slug
 */
export function applySlugSpecificConfig(slug: string, baseCTA: CTAConfig): CTAConfig {
  const specificConfig = SLUG_SPECIFIC_CTAS[slug];
  
  if (!specificConfig) return baseCTA;
  
  return {
    ...baseCTA,
    ...specificConfig
  };
}

// ===== SISTEMA DE CTAs GI (NOVO) =====
// Adicionado sem conflitar com sistema existente

export type UTM = { source: string; medium: string; campaign: string; content?: string };
export type BuildCTAsGIInput = { slug: string; redFlag: boolean; brandAffinity: BrandAffinity; utm?: Partial<UTM> };
export type CTA = { id: "zapvidaPrimary"|"zapvidaSecondary"|"zapfarmPrimary"|"zapfarmSecondary"; label: string; href: string; track: { brand: "zapvida"|"zapfarm"; variant: "primary"|"secondary" } };
export type BuildCTAsGIResult = { zapvidaPrimary: CTA; zapvidaSecondary: CTA; zapfarmPrimary: CTA; zapfarmSecondary: CTA; ordered: CTA[] };

const ZAP_BASE = process.env.NEXT_PUBLIC_URL_ZAPVIDA || "/zapvida/atendimento";
const ZAPFARM_BASE = process.env.NEXT_PUBLIC_URL_ZAPFARM || "/zapfarm/protocolos/digestivo";
const GI_DEFAULT_UTM: UTM = { source:"triage", medium:"report_gastrointestinal", campaign:"2025Q4" };

function mergeUtm(base:UTM, o?:Partial<UTM>):UTM { return { ...base, ...(o||{}) }; }
function appendUtm(url:string, utm:UTM & {content?:string}) {
  const u = new URL(url, "https://example.local");
  const p = u.searchParams;
  p.set("utm_source", utm.source); p.set("utm_medium", utm.medium); p.set("utm_campaign", utm.campaign);
  if (utm.content) p.set("utm_content", utm.content);
  return u.pathname + (u.search ? `?${p.toString()}` : "");
}
function withEmoji(label:string, brand:"zapvida"|"zapfarm", emph:"primary"|"secondary", red:boolean) {
  if (EMOJI_MODE !== "smart") return label;
  if (brand==="zapvida") return red ? `🚨 ${label}` : `❤️ ${label}`;
  return emph==="primary" ? `🌿 ${label}` : `✨ ${label}`;
}

// BEGIN flag-guard: ordem dinâmica de CTAs
const CTA_ORDER_DYNAMIC = process.env.NEXT_PUBLIC_CTA_ORDER_DYNAMIC === "1";

export function buildCTAsGI(input: BuildCTAsGIInput): BuildCTAsGIResult {
  const { slug, redFlag, brandAffinity } = input;
  const utm = mergeUtm(GI_DEFAULT_UTM, input.utm);

  const zapvidaPrimary: CTA = {
    id:"zapvidaPrimary",
    label: withEmoji(redFlag ? "Fale com um médico agora (WhatsApp)" : "Falar com um médico agora","zapvida","primary",redFlag),
    href: appendUtm(`${ZAP_BASE}`, { ...utm, content: `${slug}_zapvida_primary` }),
    track: { brand:"zapvida", variant:"primary" },
  };
  const zapvidaSecondary: CTA = {
    id:"zapvidaSecondary",
    label: withEmoji("Agendar avaliação","zapvida","secondary",redFlag),
    href: appendUtm(`${ZAP_BASE}`, { ...utm, content: `${slug}_zapvida_secondary` }),
    track: { brand:"zapvida", variant:"secondary" },
  };
  const zapfarmPrimary: CTA = {
    id:"zapfarmPrimary",
    label: withEmoji(redFlag ? "Plano digestivo com base no seu caso" : (brandAffinity==="zapfarm" ? "Continuar com o MeJoy" : "Conhecer o MeJoy"),"zapfarm","primary",redFlag),
    href: appendUtm(`${ZAPFARM_BASE}`, { ...utm, content: `${slug}_zapfarm_primary` }),
    track: { brand:"zapfarm", variant:"primary" },
  };
  const zapfarmSecondary: CTA = {
    id:"zapfarmSecondary",
    label: withEmoji("Ver protocolos digestivos","zapfarm","secondary",redFlag),
    href: appendUtm(`${ZAPFARM_BASE}`, { ...utm, content: `${slug}_zapfarm_secondary` }),
    track: { brand:"zapfarm", variant:"secondary" },
  };

  // BEGIN flag-guard: ordem dinâmica baseada em red flags com UTMs
  let ordered: CTA[];
  if (!CTA_ORDER_DYNAMIC) {
    // Comportamento atual (legacy)
    ordered = redFlag
      ? [zapvidaPrimary, zapfarmPrimary, zapvidaSecondary, zapfarmSecondary]
      : [zapfarmPrimary, zapvidaPrimary, zapfarmSecondary, zapvidaSecondary];
  } else {
    // Nova lógica: red flag → ZapVida primeiro, senão ZapFarm primeiro
    ordered = redFlag
      ? [zapvidaPrimary, zapfarmPrimary, zapvidaSecondary, zapfarmSecondary]
      : [zapfarmPrimary, zapvidaPrimary, zapfarmSecondary, zapvidaSecondary];
  }

  // Reforçar UTMs em todos os CTAs sem perder query existente
  ordered = ordered.map((cta) => ({
    ...cta,
    href: withUtm(cta.href, redFlag ? "cta_redflag" : "cta_standard", "gastro")
  }));
  // END flag-guard

  return { zapvidaPrimary, zapvidaSecondary, zapfarmPrimary, zapfarmSecondary, ordered };
}

/**
 * Determina ordem dos CTAs baseado em red flags e contexto
 * @param session - Dados da sessão da triagem
 * @returns Array ordenado de CTAs
 */
export function getPartnerOrder(session: any): string[] {
  const hasRedFlag = session?.red_flags && 
    Array.isArray(session.red_flags) && 
    session.red_flags.some((flag: string) => flag !== 'nenhuma');
  
  // Se tem red flag → ZapVida primeiro, senão ZapFarm primeiro
  return hasRedFlag 
    ? ['zapvida', 'zapfarm'] 
    : ['zapfarm', 'zapvida'];
}
// END flag-guard