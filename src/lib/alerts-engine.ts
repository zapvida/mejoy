// src/lib/alerts-engine.ts
// Engine de avaliação e geração de alertas

import { PrismaClient } from '@/lib/prisma-client';
import { getKPIs, getFunnelData, getTechData } from './admin-queries';

export interface AlertRule {
  id: string;
  name: string;
  key: string;
  threshold: number;
  windowMin: number;
  channel: string;
  enabled: boolean;
}

export interface Alert {
  id: string;
  ruleId: string;
  at: Date;
  severity: 'P0' | 'P1';
  message: string;
  status: 'open' | 'acked' | 'closed';
  metadata?: any;
}

// Regras padrão de alertas
const DEFAULT_ALERT_RULES: Omit<AlertRule, 'id'>[] = [
  {
    name: 'Queda na Conversão',
    key: 'conversion_drop',
    threshold: 30, // 30% de queda
    windowMin: 60, // janela de 60 minutos
    channel: 'console',
    enabled: true,
  },
  {
    name: 'Pico de Erros',
    key: 'error_spike',
    threshold: 5, // 5% de taxa de erro
    windowMin: 15, // janela de 15 minutos
    channel: 'console',
    enabled: true,
  },
  {
    name: 'Webhook Stripe Falhando',
    key: 'webhook_dead',
    threshold: 3, // 3 falhas consecutivas
    windowMin: 30, // janela de 30 minutos
    channel: 'console',
    enabled: true,
  },
  {
    name: 'Receita Abaixo do Esperado',
    key: 'revenue_low',
    threshold: 50, // 50% abaixo da média
    windowMin: 60, // janela de 60 minutos
    channel: 'console',
    enabled: true,
  },
];

export async function initializeDefaultRules(): Promise<void> {
  for (const rule of DEFAULT_ALERT_RULES) {
    // Mock implementation - em produção usar Prisma real
    console.log('Initializing rule:', rule.key);
  }
}

export async function evaluateAlerts(): Promise<Alert[]> {
  // Mock implementation - em produção usar Prisma real
  const rules = DEFAULT_ALERT_RULES.filter(rule => rule.enabled);
  const newAlerts: Alert[] = [];

  for (const rule of rules) {
    try {
      const alert = await evaluateRule(rule);
      if (alert) {
        // Mock alert creation
        const mockAlert: Alert = {
          id: `alert-${Date.now()}`,
          ruleId: rule.key,
          at: new Date(),
          severity: alert.severity,
          message: alert.message,
          status: 'open',
          metadata: alert.metadata,
        };

        newAlerts.push(mockAlert);

        // Notificar (console por enquanto)
        console.log(`🚨 ALERTA ${alert.severity}: ${alert.message}`);
      }
    } catch (error) {
      console.error(`Erro ao avaliar regra ${rule.key}:`, error);
    }
  }

  return newAlerts;
}

async function evaluateRule(rule: AlertRule): Promise<Alert | null> {
  switch (rule.key) {
    case 'conversion_drop':
      return await evaluateConversionDrop(rule);
    case 'error_spike':
      return await evaluateErrorSpike(rule);
    case 'webhook_dead':
      return await evaluateWebhookDead(rule);
    case 'revenue_low':
      return await evaluateRevenueLow(rule);
    default:
      return null;
  }
}

async function evaluateConversionDrop(rule: AlertRule): Promise<Alert | null> {
  const funnelData = await getFunnelData('7d');
  const currentConversion = funnelData.pricingToCheckout;
  
  // Buscar conversão média dos últimos 7 dias
  const avgConversion = await getAverageConversion(7);
  
  if (avgConversion > 0 && currentConversion < avgConversion * (1 - rule.threshold / 100)) {
    return {
      id: '',
      ruleId: rule.id,
      at: new Date(),
      severity: 'P1',
      message: `Queda na conversão: ${currentConversion.toFixed(1)}% vs média ${avgConversion.toFixed(1)}%`,
      status: 'open',
      metadata: {
        currentConversion,
        avgConversion,
        threshold: rule.threshold,
      }
    };
  }

  return null;
}

async function evaluateErrorSpike(rule: AlertRule): Promise<Alert | null> {
  const techData = await getTechData();
  
  if (techData.errorRate > rule.threshold) {
    return {
      id: '',
      ruleId: rule.id,
      at: new Date(),
      severity: 'P0',
      message: `Taxa de erro alta: ${techData.errorRate}% (limite: ${rule.threshold}%)`,
      status: 'open',
      metadata: {
        errorRate: techData.errorRate,
        threshold: rule.threshold,
      }
    };
  }

  return null;
}

async function evaluateWebhookDead(rule: AlertRule): Promise<Alert | null> {
  // Simular verificação de webhook (em produção, verificar logs reais)
  const webhookFailures = await getWebhookFailures(rule.windowMin);
  
  if (webhookFailures >= rule.threshold) {
    return {
      id: '',
      ruleId: rule.id,
      at: new Date(),
      severity: 'P0',
      message: `Webhook Stripe falhando: ${webhookFailures} falhas consecutivas`,
      status: 'open',
      metadata: {
        failures: webhookFailures,
        threshold: rule.threshold,
      }
    };
  }

  return null;
}

async function evaluateRevenueLow(rule: AlertRule): Promise<Alert | null> {
  const kpis = await getKPIs('today');
  const avgRevenue = await getAverageRevenue(7);
  
  if (avgRevenue > 0 && kpis.revenueToday < avgRevenue * (1 - rule.threshold / 100)) {
    return {
      id: '',
      ruleId: rule.id,
      at: new Date(),
      severity: 'P1',
      message: `Receita baixa hoje: R$ ${kpis.revenueToday.toFixed(2)} vs média R$ ${avgRevenue.toFixed(2)}`,
      status: 'open',
      metadata: {
        currentRevenue: kpis.revenueToday,
        avgRevenue,
        threshold: rule.threshold,
      }
    };
  }

  return null;
}

// Funções auxiliares
async function getAverageConversion(days: number): Promise<number> {
  // Simular cálculo de conversão média (em produção, usar dados reais)
  return 8.5; // 8.5% de conversão média
}

async function getWebhookFailures(windowMin: number): Promise<number> {
  // Simular contagem de falhas de webhook (em produção, verificar logs)
  return Math.random() < 0.1 ? 3 : 0; // 10% de chance de falha
}

async function getAverageRevenue(days: number): Promise<number> {
  // Simular receita média (em produção, usar dados reais)
  return 1500; // R$ 1500 por dia em média
}

export async function getActiveAlerts(): Promise<Alert[]> {
  // Mock implementation - em produção usar Prisma real
  return [
    {
      id: 'mock-alert-1',
      ruleId: 'conversion_drop',
      at: new Date(),
      severity: 'P1',
      message: 'Taxa de conversão abaixo do esperado',
      status: 'open',
      metadata: { currentConversion: 5.2, avgConversion: 8.5 },
    },
  ];
}

export async function acknowledgeAlert(alertId: string): Promise<void> {
  // Mock implementation - em produção usar Prisma real
  console.log(`Acknowledging alert: ${alertId}`);
}

export async function closeAlert(alertId: string): Promise<void> {
  // Mock implementation - em produção usar Prisma real
  console.log(`Closing alert: ${alertId}`);
}
