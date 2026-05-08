// Sistema de Telemetria GA4 para ZapFarm
// Wrapper para eventos padronizados com validação

interface GA4Event {
  event: string;
  parameters?: Record<string, any>;
}

interface GA4Config {
  measurementId?: string;
  enabled: boolean;
  debug: boolean;
}

class GA4Tracker {
  private config: GA4Config;
  private isInitialized = false;

  constructor() {
    this.config = {
      measurementId:
        process.env.NEXT_PUBLIC_GA4_MEASUREMENT_ID || process.env.NEXT_PUBLIC_GA4_ID || undefined,
      enabled: process.env.NODE_ENV === 'production',
      debug: process.env.NODE_ENV === 'development',
    };
  }

  private initialize() {
    if (this.isInitialized || typeof window === 'undefined') return;

    if (this.config.enabled && this.config.measurementId) {
      // Carregar gtag se não estiver disponível
      if (!window.gtag) {
        const script = document.createElement('script');
        script.async = true;
        script.src = `https://www.googletagmanager.com/gtag/js?id=${this.config.measurementId}`;
        document.head.appendChild(script);

        window.dataLayer = window.dataLayer || [];
        window.gtag = function() {
          window.dataLayer.push(arguments);
        };
        window.gtag('js', new Date());
        window.gtag('config', this.config.measurementId);
      }
    }

    this.isInitialized = true;
  }

  private validateEvent(event: string, parameters?: Record<string, any>): boolean {
    // Validação básica de eventos permitidos
    const allowedEvents = [
      'home_view',
      'cta_start_triage',
      'triage_list_view',
      'triage_card_click',
      'triage_start',
      'triage_step_submit',
      'triage_complete',
      'report_view',
      'report_pdf_click',
      'upgrade_click',
      'pricing_view',
      'subscribe_click',
      'billing_view',
      'portal_open',
      'gift_view',
      'gift_created',
      'gift_redeemed',
      'dashboard_view',
      'nav_click',
      'bottom_tab_impression',
      'mobile_menu_open',
      'report_hero_view',
      'report_kpi_view',
      'accordion_open',
      'evidence_open',
      'exam_copy',
      'exam_whatsapp',
      'exam_pdf',
      'grocery_copy',
      'grocery_whatsapp',
      'inline_cta_click',
      'sticky_cta_click',
      'share_open',
      'share_confirm',
    ];

    if (!allowedEvents.includes(event)) {
      if (this.config.debug) {
        console.warn(`GA4: Evento não permitido: ${event}`);
      }
      return false;
    }

    return true;
  }

  track(event: string, parameters?: Record<string, any>): void {
    this.initialize();

    if (!this.validateEvent(event, parameters)) {
      return;
    }

    const ga4Event: GA4Event = {
      event,
      parameters: {
        ...parameters,
        timestamp: Date.now(),
        page_url: typeof window !== 'undefined' ? window.location.href : '',
        page_title: typeof document !== 'undefined' ? document.title : '',
      },
    };

    if (this.config.debug) {
      console.log('GA4 Event:', ga4Event);
    }

    if (this.config.enabled && window.gtag) {
      window.gtag('event', event, parameters);
    }
  }

  // Métodos específicos para eventos comuns
  trackPageView(page: string, title?: string): void {
    this.track('page_view', {
      page_title: title || document.title,
      page_location: typeof window !== 'undefined' ? window.location.href : '',
      page_path: page,
    });
  }

  trackCTAClick(cta: string, context?: string): void {
    this.track('cta_click', {
      cta_name: cta,
      cta_context: context,
    });
  }

  // ===== EVENTOS GI ENHANCED (NOVOS) =====
  // Adicionados para tracking específico da triagem GI melhorada

  trackTriageAnswerGI(slug: string, field: string, value: any): void {
    this.track('triage_answer', {
      slug,
      field,
      value: String(value),
      triage_type: 'gastrointestinal'
    });
  }

  trackTriageSubmitGI(answers: Record<string, any>): void {
    const giAnswers = {
      suplemento_digestivo: answers.suplemento_digestivo,
      acompanhamento_medico: answers.acompanhamento_medico,
      ultima_consulta_gastro: answers.ultima_consulta_gastro,
      endoscopia_feita: answers.endoscopia_feita,
      endoscopia_quantas: answers.endoscopia_quantas,
      endoscopia_ultima: answers.endoscopia_ultima,
      ibp_frequencia: answers.ibp_frequencia,
      sintomas_duracao_meses: answers.sintomas_duracao_meses
    };

    this.track('triage_submit', {
      slug: 'gastrointestinal',
      ...giAnswers,
      gi_enhanced: '1'
    });
  }

  trackReportViewGI(emojiMode: string): void {
    this.track('report_view', {
      slug: 'gastrointestinal',
      emoji_mode: emojiMode,
      gi_enhanced: '1'
    });
  }

  trackInlineCTAClickGI(context: string, brand: string): void {
    this.track('inline_cta_click', {
      context: `report_${context}`,
      brand,
      triage_type: 'gastrointestinal'
    });
  }

  trackTriageStart(slug: string): void {
    this.track('triage_start', {
      triage_slug: slug,
    });
  }

  trackTriageComplete(slug: string, duration?: number): void {
    this.track('triage_complete', {
      triage_slug: slug,
      duration_seconds: duration,
    });
  }

  trackSubscribeClick(plan: string, method: string = 'card'): void {
    this.track('subscribe_click', {
      plan_type: plan,
      payment_method: method,
    });
  }

  trackUpgradeClick(context: string): void {
    this.track('upgrade_click', {
      upgrade_context: context,
    });
  }

  trackNavigationClick(position: 'top' | 'bottom', route: string): void {
    this.track('nav_click', {
      nav_position: position,
      nav_route: route,
    });
  }

  trackReportView(reportId: string): void {
    this.track('report_view', {
      report_id: reportId,
    });
  }

  trackReportPrint(reportId: string): void {
    this.track('report_print', {
      report_id: reportId,
    });
  }

  trackChatInteraction(type: string): void {
    this.track('chat_interaction', {
      interaction_type: type,
    });
  }

  trackPDFDownload(reportId: string): void {
    this.track('pdf_download', {
      report_id: reportId,
    });
  }

  trackPassCheckout(plan: string): void {
    this.track('pass_checkout', {
      plan_type: plan,
    });
  }

  trackPassActivated(plan: string): void {
    this.track('pass_activated', {
      plan_type: plan,
    });
  }

  trackGiftRedeemed(giftCode: string): void {
    this.track('gift_redeemed', {
      gift_code: giftCode,
    });
  }

  trackReportHeroView(reportId: string): void {
    this.track('report_hero_view', { report_id: reportId });
  }

  trackReportKPI(reportId: string): void {
    this.track('report_kpi_view', { report_id: reportId });
  }

  trackPillarOpen(pillarId: string): void {
    this.track('accordion_open', { pillar: pillarId });
  }

  trackEvidenceOpen(citationId: string): void {
    this.track('evidence_open', { citation_id: citationId });
  }

  trackExamCopy(reportId: string): void {
    this.track('exam_copy', { report_id: reportId });
  }

  trackExamWhatsapp(reportId: string): void {
    this.track('exam_whatsapp', { report_id: reportId });
  }

  trackExamPdf(reportId: string): void {
    this.track('exam_pdf', { report_id: reportId });
  }

  trackGroceryCopy(reportId: string): void {
    this.track('grocery_copy', { report_id: reportId });
  }

  trackGroceryWhatsapp(reportId: string): void {
    this.track('grocery_whatsapp', { report_id: reportId });
  }

  trackInlineCta(): void {
    this.track('inline_cta_click');
  }

  trackStickyCta(): void {
    this.track('sticky_cta_click');
  }

  trackShareOpen(reportId: string): void {
    this.track('share_open', { report_id: reportId });
  }

  trackShareConfirm(reportId: string, method: 'native' | 'link'): void {
    this.track('share_confirm', { report_id: reportId, method });
  }

  // BEGIN overlay: eventos aditivos (no-op se GA não configurado)
  trackReportViewGastro(params: { has_red_flag: boolean; cta_order: string }): void {
    try { 
      this.track('report_view_gastro', params); 
    } catch (error) {
      if (this.config.debug) console.warn('GA4: Erro ao trackear report_view_gastro:', error);
    }
  }
  
  trackCTAClickBrand(params: { brand: "alloe"|"zapvida"; position: string }): void {
    try { 
      this.track('cta_click_brand', params); 
    } catch (error) {
      if (this.config.debug) console.warn('GA4: Erro ao trackear cta_click_brand:', error);
    }
  }
  
  trackPDFGenerated(params: { pdf_version: "v1"|"v2" }): void {
    try { 
      this.track('pdf_generated', params); 
    } catch (error) {
      if (this.config.debug) console.warn('GA4: Erro ao trackear pdf_generated:', error);
    }
  }
  // END overlay

  trackProductClick(product: string): void {
    this.track('product_click', {
      product_name: product,
    });
  }

  trackConsultClick(context: string): void {
    this.track('consult_click', {
      consult_context: context,
    });
  }

  persistInitialUTMs(): void {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      const utmParams = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content'];
      
      utmParams.forEach(param => {
        const value = urlParams.get(param);
        if (value) {
          localStorage.setItem(`utm_${param}`, value);
        }
      });
    }
  }

  resetGADeDup(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('ga_de_dup');
    }
  }

  initGA4(): void {
    this.initialize();
  }
}

// Instância singleton
const ga4Tracker = new GA4Tracker();

// Função principal de tracking
export function track(event: string, parameters?: Record<string, any>): void {
  ga4Tracker.track(event, parameters);
}

// Funções específicas exportadas
export const trackPageView = (page: string, title?: string) => ga4Tracker.trackPageView(page, title);
export const trackCTAClick = (cta: string, context?: string) => ga4Tracker.trackCTAClick(cta, context);
export const trackTriageStart = (slug: string) => ga4Tracker.trackTriageStart(slug);
export const trackTriageComplete = (slug: string, duration?: number) => ga4Tracker.trackTriageComplete(slug, duration);
export const trackSubscribeClick = (plan: string, method?: string) => ga4Tracker.trackSubscribeClick(plan, method);
export const trackUpgradeClick = (context: string) => ga4Tracker.trackUpgradeClick(context);
export const trackNavigationClick = (position: 'top' | 'bottom', route: string) => ga4Tracker.trackNavigationClick(position, route);
export const trackReportView = (reportId: string) => ga4Tracker.trackReportView(reportId);
export const trackReportPrint = (reportId: string) => ga4Tracker.trackReportPrint(reportId);
export const trackChatInteraction = (type: string) => ga4Tracker.trackChatInteraction(type);
export const trackPDFDownload = (reportId: string) => ga4Tracker.trackPDFDownload(reportId);
export const trackPassCheckout = (plan: string) => ga4Tracker.trackPassCheckout(plan);
export const trackPassActivated = (plan: string) => ga4Tracker.trackPassActivated(plan);
export const trackGiftRedeemed = (giftCode: string) => ga4Tracker.trackGiftRedeemed(giftCode);
export const trackProductClick = (product: string) => ga4Tracker.trackProductClick(product);
export const trackConsultClick = (context: string) => ga4Tracker.trackConsultClick(context);
export const trackReportHeroView = (reportId: string) => ga4Tracker.trackReportHeroView(reportId);
export const trackReportKPI = (reportId: string) => ga4Tracker.trackReportKPI(reportId);
export const trackPillarOpen = (pillarId: string) => ga4Tracker.trackPillarOpen(pillarId);
export const trackEvidenceOpen = (citationId: string) => ga4Tracker.trackEvidenceOpen(citationId);
export const trackExamCopy = (reportId: string) => ga4Tracker.trackExamCopy(reportId);
export const trackExamWhatsapp = (reportId: string) => ga4Tracker.trackExamWhatsapp(reportId);
export const trackExamPdf = (reportId: string) => ga4Tracker.trackExamPdf(reportId);
export const trackGroceryCopy = (reportId: string) => ga4Tracker.trackGroceryCopy(reportId);
export const trackGroceryWhatsapp = (reportId: string) => ga4Tracker.trackGroceryWhatsapp(reportId);
export const trackInlineCta = () => ga4Tracker.trackInlineCta();
export const trackStickyCta = () => ga4Tracker.trackStickyCta();
export const trackShareOpen = (reportId: string) => ga4Tracker.trackShareOpen(reportId);
export const trackShareConfirm = (reportId: string, method: 'native' | 'link') =>
  ga4Tracker.trackShareConfirm(reportId, method);
export const persistInitialUTMs = () => ga4Tracker.persistInitialUTMs();
export const resetGADeDup = () => ga4Tracker.resetGADeDup();
export const initGA4 = () => ga4Tracker.initGA4();

// BEGIN overlay: exports dos novos eventos aditivos
export const trackReportViewGastro = (params: { has_red_flag: boolean; cta_order: string }) => 
  ga4Tracker.trackReportViewGastro(params);
export const trackCTAClickBrand = (params: { brand: "alloe"|"zapvida"; position: string }) => 
  ga4Tracker.trackCTAClickBrand(params);
export const trackPDFGenerated = (params: { pdf_version: "v1"|"v2" }) => 
  ga4Tracker.trackPDFGenerated(params);
// END overlay

// Hook para tracking automático de páginas
export function useGA4PageTracking(page: string, title?: string) {
  if (typeof window !== 'undefined' && window.React) {
    window.React.useEffect(() => {
      trackPageView(page, title);
    }, [page, title]);
  }
}

// TODO(backcompat-2025-10-23) - Declarações globais movidas para external.d.ts

export default ga4Tracker;
