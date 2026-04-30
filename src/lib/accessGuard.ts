// src/lib/accessGuard.ts
// Sistema unificado de controle de acesso para relatórios gratuitos vs pagos

import { prisma } from '@/lib/prisma';

export type AccessInput = {
  reportId?: string;
  triageId?: string;
  userId?: string | null; // pode ser null para fluxo anônimo
};

// 🔧 MODO TESTE: Liberar todas as triagens temporariamente
const TEST_MODE_ALL_FREE = process.env.NEXT_PUBLIC_TEST_MODE_ALL_FREE === 'true';

const FREE_TRIAGES = TEST_MODE_ALL_FREE 
  ? new Set([
      'gastro', 'testeSaude', 'geral', 'geralRapida', 'mental', 'cancer', 'sono', 'enxaqueca', 
      'obesidade', 'gestante', 'tabagismo', 'quimica', 'saudeMasculina', 'estiloVidaModerna', 
      'estresseBurnout', 'jogosAzar', 'depressao', 'tdah',
      // Novas triagens
      'cardiovascular', 'diabetes-metabolismo', 'dor-cronica', 'coluna', 'respiratoria', 
      'renal', 'hepatica', 'mulher', 'prostata', 'tireoide', 'mama', 'ocular', 'auditiva', 
      'pele', 'alergias', 'sexual', 'idoso', 'bucal', 'crianca', 'trabalhador', 
      'longevidade', 'vitalidade', 'microbioma', 'micronutrientes', 'biohacking'
    ])
  : new Set(['gastro', 'testeSaude']);

export async function canViewReport({ reportId, triageId, userId }: AccessInput) {
  try {
    if (!prisma) {
      return { allow: false, reason: 'DB_OFFLINE' };
    }

    const report = reportId
      ? await prisma.report.findUnique({ 
          where: { id: reportId }, 
          include: { triage: true } 
        })
      : null;

    const triage = triageId
      ? await prisma.triage.findUnique({ where: { id: triageId } })
      : report?.triage ?? null;

    if (!triage) return { allow: false, reason: 'TRIAGE_NOT_FOUND' };

    const isFree = FREE_TRIAGES.has((triage.type || '').toLowerCase());
    const isSubmitted = triage.status === 'submitted';

    // Caminho gratuito: triagem gastro/testeSaude + status submitted
    if (isFree && isSubmitted) {
      return { allow: true, reason: 'FREE_TRIAGE' };
    }

    // Caminho pago: verificar passe ativo ou gift válido
    if (!userId) {
      return { allow: false, reason: 'LOGIN_REQUIRED' };
    }

    const user = await prisma.patient.findUnique({ 
      where: { id: userId }, 
      include: { 
        subscriptions: true, 
        giftTokensRedeemed: true 
      } 
    });

    if (!user) return { allow: false, reason: 'USER_NOT_FOUND' };

    // Verificar passe ativo (30 dias)
    const hasActivePass = user.subscriptions?.some(s => 
      s.status === 'active' && 
      s.activeUntil && 
      new Date(s.activeUntil) > new Date()
    );

    // Verificar gift válido
    const hasValidGift = user.giftTokensRedeemed?.some(g => 
      g.redeemedAt && 
      g.expiresAt && 
      new Date(g.expiresAt) > new Date()
    );

    if (hasActivePass || hasValidGift) {
      return { allow: true, reason: 'PAID_ACCESS' };
    }

    return { allow: false, reason: 'PAYWALL' };
  } catch (error) {
    console.error('❌ Erro no accessGuard:', error);
    return { allow: false, reason: 'ERROR' };
  }
}

// Helper para verificar se uma triagem é gratuita
export function isFreeTriage(triageType: string): boolean {
  return FREE_TRIAGES.has(triageType.toLowerCase());
}

// Helper para obter a URL de redirecionamento do paywall
export function getPaywallRedirectUrl(from?: string): string {
  const baseUrl = '/assinatura';
  return from ? `${baseUrl}?from=${encodeURIComponent(from)}` : baseUrl;
}

// Helper para verificar se deve mostrar paywall no cliente
export function shouldShowPaywall(triageType: string, status: string): boolean {
  return !isFreeTriage(triageType) || status !== 'submitted';
}
