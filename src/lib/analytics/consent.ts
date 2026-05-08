export const COOKIE_CONSENT_KEY = "zapfarm_cookie_consent";
export const COOKIE_PREFERENCES_KEY = "zapfarm_cookie_preferences";
export const COOKIE_POLICY_VERSION_KEY = "cookie_policy_version";
export const COOKIE_VERSION = "1.0.0";

export type CookiePreferences = {
  essential: boolean;
  analytics: boolean;
  marketing: boolean;
};

export type GoogleConsentState = {
  analytics_storage: "granted" | "denied";
  ad_storage: "granted" | "denied";
  ad_user_data: "granted" | "denied";
  ad_personalization: "granted" | "denied";
};

export const DEFAULT_COOKIE_PREFERENCES: CookiePreferences = {
  essential: true,
  analytics: false,
  marketing: false,
};

function normalizePreferences(
  input?: Partial<CookiePreferences> | null
): CookiePreferences {
  return {
    essential: input?.essential ?? true,
    analytics: input?.analytics ?? false,
    marketing: input?.marketing ?? false,
  };
}

export function buildGoogleConsentState(
  input?: Partial<CookiePreferences> | null
): GoogleConsentState {
  const prefs = normalizePreferences(input);
  return {
    analytics_storage: prefs.analytics ? "granted" : "denied",
    ad_storage: prefs.marketing ? "granted" : "denied",
    ad_user_data: prefs.marketing ? "granted" : "denied",
    ad_personalization: prefs.marketing ? "granted" : "denied",
  };
}

export function publishCookieConsentUpdate(
  input: Partial<CookiePreferences> | null | undefined,
  options: {
    source?: string;
    mode?: "default" | "update";
  } = {}
) {
  if (typeof window === "undefined") return;

  const preferences = normalizePreferences(input);
  const consentState = buildGoogleConsentState(preferences);
  const mode = options.mode || "update";

  window.mejoyCookiePreferences = preferences;
  window.mejoyGoogleConsentState = consentState;
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({
    event: mode === "default" ? "mejoy_consent_bootstrap" : "mejoy_consent_update",
    consent_mode: mode,
    consent_source: options.source || "cookie_banner",
    cookie_preferences: {
      analytics: preferences.analytics,
      marketing: preferences.marketing,
    },
    ...consentState,
  });

  if (window.gtag) {
    window.gtag("consent", mode, consentState);
  }
}

export function buildGoogleConsentBootstrapScript(options: {
  strictMode: boolean;
}) {
  const deniedState = buildGoogleConsentState(DEFAULT_COOKIE_PREFERENCES);
  const deniedStateJson = JSON.stringify(deniedState);
  const preferencesKey = COOKIE_PREFERENCES_KEY;

  return `
    (function () {
      window.dataLayer = window.dataLayer || [];
      window.gtag = window.gtag || function () { window.dataLayer.push(arguments); };

      var strictMode = ${options.strictMode ? "true" : "false"};
      var deniedState = ${deniedStateJson};

      function readCookie(name) {
        var match = document.cookie
          .split(';')
          .map(function (part) { return part.trim(); })
          .find(function (part) { return part.indexOf(name + '=') === 0; });
        if (!match) return null;
        try {
          return decodeURIComponent(match.split('=').slice(1).join('='));
        } catch (error) {
          return match.split('=').slice(1).join('=');
        }
      }

      function buildState(prefs) {
        return {
          analytics_storage: prefs && prefs.analytics ? 'granted' : 'denied',
          ad_storage: prefs && prefs.marketing ? 'granted' : 'denied',
          ad_user_data: prefs && prefs.marketing ? 'granted' : 'denied',
          ad_personalization: prefs && prefs.marketing ? 'granted' : 'denied'
        };
      }

      var rawPrefs = readCookie('${preferencesKey}');
      if (rawPrefs) {
        try {
          var parsedPrefs = JSON.parse(rawPrefs);
          var storedState = buildState(parsedPrefs);
          window.mejoyCookiePreferences = parsedPrefs;
          window.mejoyGoogleConsentState = storedState;
          window.gtag('consent', 'default', storedState);
          window.dataLayer.push({
            event: 'mejoy_consent_bootstrap',
            consent_mode: 'stored',
            consent_source: 'cookie_bootstrap',
            cookie_preferences: {
              analytics: !!parsedPrefs.analytics,
              marketing: !!parsedPrefs.marketing
            },
            analytics_storage: storedState.analytics_storage,
            ad_storage: storedState.ad_storage,
            ad_user_data: storedState.ad_user_data,
            ad_personalization: storedState.ad_personalization
          });
          return;
        } catch (error) {
          // ignore malformed cookie
        }
      }

      if (!strictMode) {
        return;
      }

      window.mejoyCookiePreferences = ${JSON.stringify(DEFAULT_COOKIE_PREFERENCES)};
      window.mejoyGoogleConsentState = deniedState;
      window.gtag('consent', 'default', deniedState);
      window.dataLayer.push({
        event: 'mejoy_consent_bootstrap',
        consent_mode: 'strict_default',
        consent_source: 'cookie_bootstrap',
        cookie_preferences: {
          analytics: false,
          marketing: false
        },
        analytics_storage: deniedState.analytics_storage,
        ad_storage: deniedState.ad_storage,
        ad_user_data: deniedState.ad_user_data,
        ad_personalization: deniedState.ad_personalization
      });
    })();
  `;
}

