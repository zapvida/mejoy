import { trackFunnelEvent } from '@/lib/funnel/events-client';

jest.mock('@/lib/analytics/journey', () => ({
  getOrCreateJourneyContext: () => ({
    correlationId: 'corr-123',
    sessionPseudoId: 'sess-456',
  }),
}));

function expireCookie(name: string) {
  document.cookie = `${name}=; Max-Age=0; path=/;`;
}

describe('funnel events client', () => {
  beforeEach(() => {
    (window as any).dataLayer = [];
    (window as any).gtag = jest.fn();
    (window as any).analytics = {
      track: jest.fn(),
    };

    expireCookie('utm_source');
    expireCookie('gclid');

    document.cookie = 'utm_source=google; path=/;';
    document.cookie = 'gclid=test-gclid-123; path=/;';
    window.history.pushState({}, '', '/emagrecimento/relatorio?id=report-1');
  });

  it('enriches launch events with attribution ids and strips PII', () => {
    trackFunnelEvent('handoff_created', {
      report_id: 'report-1',
      source: 'report_primary',
      email: 'patient@example.com',
      phone: '+5511999999999',
    });

    expect((window as any).dataLayer?.[0]).toMatchObject({
      event: 'handoff_created',
      report_id: 'report-1',
      source: 'report_primary',
      origin: 'report_primary',
      correlation_id: 'corr-123',
      session_pseudo_id: 'sess-456',
      program_slug: 'emagrecimento',
      utm_source: 'google',
      gclid: 'test-gclid-123',
    });

    expect((window as any).dataLayer?.[0]).not.toHaveProperty('email');
    expect((window as any).dataLayer?.[0]).not.toHaveProperty('phone');
    expect((window as any).gtag).toHaveBeenCalledWith(
      'event',
      'handoff_created',
      expect.objectContaining({
        correlation_id: 'corr-123',
        session_pseudo_id: 'sess-456',
        gclid: 'test-gclid-123',
      })
    );
  });
});
