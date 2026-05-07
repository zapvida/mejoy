import type { MobileAnalyticsEventInput } from '@mejoy/api-contracts/mobile';

type SessionLike = {
  apiBaseUrl: string;
  email: string;
};

export async function trackMobileEvent(
  session: SessionLike,
  input: MobileAnalyticsEventInput
) {
  try {
    await fetch(`${session.apiBaseUrl}/api/mobile/v1/analytics/events`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(session.email ? { 'X-User-Email': session.email } : {}),
      },
      body: JSON.stringify(input),
    });
  } catch {
    // analytics should never block the patient flow
  }
}
