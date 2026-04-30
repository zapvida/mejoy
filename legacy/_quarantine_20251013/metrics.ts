// src/lib/metrics.ts
// Sistema de tracking de métricas e eventos

import { 
  trackTriageEvent,
  trackReportView,
  trackPDFDownload,
  trackPassCheckout,
  trackPassActivated,
  trackGiftRedeemed,
  trackProductClick,
  trackConsultClick
} from './ga4';

export interface MetricEvent {
  event: string;
  timestamp: number;
  data?: Record<string, any>;
  userId?: string;
  sessionId?: string;
}

class MetricsTracker {
  private events: MetricEvent[] = [];
  private isEnabled = process.env.NODE_ENV === 'production';

  track(event: string, data?: Record<string, any>, userId?: string, sessionId?: string) {
    const metricEvent: MetricEvent = {
      event,
      timestamp: Date.now(),
      data,
      userId,
      sessionId
    };

    this.events.push(metricEvent);

    // Enviar para GA4
    if (this.isEnabled) {
      trackTriageEvent(event, 0, 1, data);
    } else {
      // Em desenvolvimento, apenas log
      console.log('📊 Metric:', event, data);
    }
  }

  // Métodos específicos para eventos do funil conforme plano
  trackTriageStart(sessionId: string, tipo: string) {
    this.track('triage_start', { triage: tipo }, undefined, sessionId);
    if (this.isEnabled) {
      trackTriageEvent(tipo, 1, 1);
    }
  }

  trackTriageProgress(sessionId: string, tipo: string, step: number, progressPct: number) {
    this.track('triage_progress', { 
      triage: tipo, 
      step, 
      progressPct 
    }, undefined, sessionId);
    if (this.isEnabled) {
      trackTriageEvent(tipo, step, Math.round(100/progressPct), { progressPct });
    }
  }

  trackTriageComplete(sessionId: string, tipo: string, durationSec: number) {
    this.track('triage_complete', { 
      triage: tipo, 
      durationSec 
    }, undefined, sessionId);
    if (this.isEnabled) {
      trackTriageEvent(tipo, 100, 100, { durationSec });
    }
  }

  trackReportView(reportId: string, tipo: string, score: number, redFlagsCount: number, userId?: string, sessionId?: string) {
    this.track('report_view', { 
      triage: tipo, 
      score, 
      redFlagsCount 
    }, userId, sessionId);
    if (this.isEnabled) {
      trackReportView({ 
        report_id: reportId, 
        triage_type: tipo, 
        score, 
        redFlagsCount 
      });
    }
  }

  trackPdfDownload(reportId: string, tipo: string, userId?: string, sessionId?: string) {
    this.track('pdf_download', { triage: tipo }, userId, sessionId);
    if (this.isEnabled) {
      trackPDFDownload(tipo, reportId);
    }
  }

  // CTAs específicos conforme plano
  trackPassCheckout(price: number, userId?: string, sessionId?: string) {
    this.track('pass_checkout', { price }, userId, sessionId);
    if (this.isEnabled) {
      trackPassCheckout('pass', price);
    }
  }

  trackPassActivated(days: number, userId?: string, sessionId?: string) {
    this.track('pass_activated', { days }, userId, sessionId);
    if (this.isEnabled) {
      trackPassActivated('pass', 49);
    }
  }

  trackGiftCheckout(price: number, userId?: string, sessionId?: string) {
    this.track('gift_checkout', { price }, userId, sessionId);
    if (this.isEnabled) {
      trackPassCheckout('gift', price);
    }
  }

  trackGiftSent(channel: string, userId?: string, sessionId?: string) {
    this.track('gift_sent', { channel }, userId, sessionId);
    if (this.isEnabled) {
      trackGiftRedeemed('gift_code');
    }
  }

  trackGiftRedeemed(userId?: string, sessionId?: string) {
    this.track('gift_redeemed', {}, userId, sessionId);
    if (this.isEnabled) {
      trackGiftRedeemed('gift_code');
    }
  }

  // Integrações externas
  trackConsultClick(tipo: string, userId?: string, sessionId?: string) {
    this.track('consult_click', { triage: tipo }, userId, sessionId);
    if (this.isEnabled) {
      trackConsultClick(tipo);
    }
  }

  trackProductClick(tipo: string, kit?: string, userId?: string, sessionId?: string) {
    this.track('product_click', { triage: tipo, kit }, userId, sessionId);
    if (this.isEnabled) {
      trackProductClick(tipo, { kit });
    }
  }

  // Compartilhamento
  trackShareWhatsapp(tipo: string, userId?: string, sessionId?: string) {
    this.track('share_whatsapp', { triage: tipo }, userId, sessionId);
    if (this.isEnabled) {
      trackTriageEvent(tipo, 0, 1, { action: 'share_whatsapp' });
    }
  }

  // Métodos para análise de funil
  getFunnelMetrics(): Record<string, number> {
    const metrics: Record<string, number> = {};
    
    this.events.forEach(event => {
      metrics[event.event] = (metrics[event.event] || 0) + 1;
    });

    return metrics;
  }

  getConversionRate(): number {
    const starts = this.events.filter(e => e.event === 'triage_start').length;
    const completions = this.events.filter(e => e.event === 'triage_100').length;
    
    return starts > 0 ? (completions / starts) * 100 : 0;
  }

  getDropOffPoints(): Record<string, number> {
    const dropOffs: Record<string, number> = {};
    
    // Analisar pontos de abandono
    const starts = this.events.filter(e => e.event === 'triage_start').length;
    const field50 = this.events.filter(e => e.event === 'field_saved' && e.data?.step === 5).length;
    const field100 = this.events.filter(e => e.event === 'field_saved' && e.data?.step === 10).length;
    
    dropOffs['step_1_to_5'] = starts - field50;
    dropOffs['step_5_to_10'] = field50 - field100;
    
    return dropOffs;
  }
}

export const metrics = new MetricsTracker();

// Hook para uso em componentes React
export function useMetrics() {
  return {
    track: metrics.track.bind(metrics),
    trackTriageStart: metrics.trackTriageStart.bind(metrics),
    trackTriageProgress: metrics.trackTriageProgress.bind(metrics),
    trackTriageComplete: metrics.trackTriageComplete.bind(metrics),
    trackReportView: metrics.trackReportView.bind(metrics),
    trackPdfDownload: metrics.trackPdfDownload.bind(metrics),
    trackPassCheckout: metrics.trackPassCheckout.bind(metrics),
    trackPassActivated: metrics.trackPassActivated.bind(metrics),
    trackGiftCheckout: metrics.trackGiftCheckout.bind(metrics),
    trackGiftSent: metrics.trackGiftSent.bind(metrics),
    trackGiftRedeemed: metrics.trackGiftRedeemed.bind(metrics),
    trackConsultClick: metrics.trackConsultClick.bind(metrics),
    trackProductClick: metrics.trackProductClick.bind(metrics),
    trackShareWhatsapp: metrics.trackShareWhatsapp.bind(metrics),
  };
}
