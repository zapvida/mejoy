// src/config/partners.ts
// Configuração centralizada dos parceiros MeJoy e ZapVida

import { getOrCreateJourneyContext } from '@/lib/analytics/journey';
import { getUtms } from '@/lib/utm';

export interface PartnerConfig {
  id: string;
  name: string;
  url: string;
  utmParams: Record<string, string>;
  description: string;
  icon: string;
  priority: 'high' | 'medium' | 'low';
}

export interface CTAContext {
  context: string;
  redFlags?: string[];
  hasRedFlag?: boolean;
}

// URLs base dos parceiros
const PARTNER_BASE_URLS = {
  zapfarm: process.env.NEXT_PUBLIC_PARTNER_ZAPFARM_URL || 'https://zapfarm.com.br/',
  zapvida: process.env.NEXT_PUBLIC_PARTNER_ZAPVIDA_URL || 'https://zapvida.com/programas/emagrecimento',
} as const;

// Configuração dos parceiros
export const PARTNERS: Record<string, PartnerConfig> = {
  zapfarm: {
    id: 'zapfarm',
    name: 'MeJoy',
    url: PARTNER_BASE_URLS.zapfarm,
    utmParams: {
      utm_source: 'mejoy',
      utm_medium: 'partner_cta_zapfarm',
      utm_campaign: 'emagrecimento_zapfarm',
    },
    description: 'Suplementos para saúde gastrointestinal',
    icon: '💊',
    priority: 'high',
  },
  zapvida: {
    id: 'zapvida',
    name: 'ZapVida',
    url: PARTNER_BASE_URLS.zapvida,
    utmParams: {
      utm_source: 'mejoy',
      utm_medium: 'partner_cta_zapvida',
      utm_campaign: 'emagrecimento_zapvida',
    },
    description: 'Atendimento médico digital',
    icon: '🩺',
    priority: 'high',
  },
};

// Contextos específicos para ordenação dinâmica
export const CONTEXT_CONFIGS: Record<string, { primary: string; secondary: string }> = {
  landing: { primary: 'zapfarm', secondary: 'zapvida' },
  triage_start: { primary: 'zapfarm', secondary: 'zapvida' },
  triage_done: { primary: 'zapvida', secondary: 'zapfarm' }, // ZapVida primeiro na conclusão
  gi_report: { primary: 'zapvida', secondary: 'zapfarm' }, // ZapVida primeiro no relatório
};

// Ordenação dinâmica baseada em red flags
export function getPartnerOrder(context: string, redFlags: string[] = []): string[] {
  const hasRedFlag = redFlags.length > 0;
  const config = CONTEXT_CONFIGS[context] || CONTEXT_CONFIGS.landing;
  
  // Se há red flags, ZapVida sempre primeiro (urgência médica)
  if (hasRedFlag) {
    return ['zapvida', 'zapfarm'];
  }
  
  // Ordem padrão por contexto
  return config ? [config.primary, config.secondary] : [];
}

// Construir URL completa com UTMs
export function buildPartnerUrl(partnerId: string, context: string, content?: string): string {
  const partner = PARTNERS[partnerId];
  if (!partner) return '#';
  
  const url = new URL(partner.url);
  const storedUtms = typeof window !== 'undefined' ? getUtms() : {};
  const journey = typeof window !== 'undefined' ? getOrCreateJourneyContext() : null;
  
  // Adicionar UTMs base
  Object.entries(partner.utmParams).forEach(([key, value]) => {
    url.searchParams.set(key, value);
  });
  
  // Adicionar contexto específico
  url.searchParams.set('utm_content', content || context);
  url.searchParams.set('partner', partnerId);
  url.searchParams.set('entry_context', context);

  // Preservar origem de aquisição e click IDs sem perder a taxonomia do parceiro.
  Object.entries(storedUtms).forEach(([key, value]) => {
    if (!value) return;
    if (['gclid', 'fbclid', 'ttclid', 'msclkid'].includes(key)) {
      url.searchParams.set(key, String(value));
      return;
    }
    url.searchParams.set(`origin_${key}`, String(value));
  });

  if (journey?.correlationId) {
    url.searchParams.set('correlation_id', journey.correlationId);
  }
  
  return url.toString();
}

// Labels dinâmicos baseados em contexto
export function getPartnerLabel(partnerId: string, context: string): string {
  const partner = PARTNERS[partnerId];
  if (!partner) return 'Saiba mais';
  
  const labels: Record<string, Record<string, string>> = {
    zapfarm: {
      landing: 'Conhecer o MeJoy',
      triage_start: 'Continuar com o MeJoy',
      triage_done: 'Ver protocolos digestivos',
      gi_report: 'Soluções para saúde GI',
    },
    zapvida: {
      landing: 'Falar com médico agora',
      triage_start: 'Agendar avaliação',
      triage_done: 'Falar com médico agora',
      gi_report: 'Atendimento médico imediato',
    },
  };
  
  return labels[partnerId]?.[context] || partner.description;
}
