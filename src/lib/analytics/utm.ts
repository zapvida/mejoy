import type { NextApiRequest } from 'next';

export type UTM = {
  source?: string; medium?: string; campaign?: string;
  content?: string; term?: string; gclid?: string; fbclid?: string; ttclid?: string; msclkid?: string; ref?: string;
  handoff?: string; handoffId?: string;
};

export type TrackingContext = UTM & {
  correlationId?: string;
  sessionPseudoId?: string;
  sourceUrl?: string;
};

function getFirst(value: string | string[] | undefined): string | undefined {
  if (Array.isArray(value)) return value[0];
  return value;
}

export function readUtmFromReq(req: NextApiRequest): UTM {
  const c = (req as any).cookies || {};
  const q = req.query || {};
  return {
    source: c.utm_source || getFirst(q.utm_source as any),
    medium: c.utm_medium || getFirst(q.utm_medium as any),
    campaign: c.utm_campaign || getFirst(q.utm_campaign as any),
    content: c.utm_content || getFirst(q.utm_content as any),
    term: c.utm_term || getFirst(q.utm_term as any),
    gclid: c.gclid || getFirst(q.gclid as any),
    fbclid: c.fbclid || getFirst(q.fbclid as any),
    ttclid: c.ttclid || getFirst(q.ttclid as any),
    msclkid: c.msclkid || getFirst(q.msclkid as any),
    ref: c.ref || getFirst(q.ref as any),
    handoff: c.handoff || getFirst(q.handoff as any),
    handoffId: c.handoff_id || getFirst(q.handoff_id as any)
  };
}

export function readTrackingContextFromReq(req: NextApiRequest): TrackingContext {
  const cookies = (req as any).cookies || {};
  const query = req.query || {};
  const utm = readUtmFromReq(req);
  const sourceUrl = typeof req.headers.referer === "string" ? req.headers.referer : undefined;

  return {
    ...utm,
    correlationId:
      cookies.mejoy_correlation_id ||
      getFirst(query.correlation_id as any) ||
      getFirst(query.correlationId as any),
    sessionPseudoId:
      cookies.mejoy_session_id ||
      getFirst(query.session_pseudo_id as any) ||
      getFirst(query.sessionPseudoId as any),
    sourceUrl
  };
}
