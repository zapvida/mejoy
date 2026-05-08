import {
  buildGoogleConsentState,
  publishCookieConsentUpdate,
} from '@/lib/analytics/consent';

describe('analytics consent', () => {
  beforeEach(() => {
    (window as any).dataLayer = [];
    (window as any).gtag = jest.fn();
  });

  it('builds separate analytics and marketing consent state', () => {
    expect(
      buildGoogleConsentState({
        essential: true,
        analytics: true,
        marketing: false,
      })
    ).toEqual({
      analytics_storage: 'granted',
      ad_storage: 'denied',
      ad_user_data: 'denied',
      ad_personalization: 'denied',
    });
  });

  it('publishes consent updates for GTM and Google tags', () => {
    publishCookieConsentUpdate(
      {
        essential: true,
        analytics: true,
        marketing: true,
      },
      {
        source: 'test_suite',
        mode: 'update',
      }
    );

    expect((window as any).gtag).toHaveBeenCalledWith('consent', 'update', {
      analytics_storage: 'granted',
      ad_storage: 'granted',
      ad_user_data: 'granted',
      ad_personalization: 'granted',
    });

    expect((window as any).dataLayer?.[0]).toMatchObject({
      event: 'mejoy_consent_update',
      consent_mode: 'update',
      consent_source: 'test_suite',
      analytics_storage: 'granted',
      ad_storage: 'granted',
      ad_user_data: 'granted',
      ad_personalization: 'granted',
      cookie_preferences: {
        analytics: true,
        marketing: true,
      },
    });
  });
});
