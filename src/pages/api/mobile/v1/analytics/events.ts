import type { NextApiRequest, NextApiResponse } from 'next';

import { getUserEmailFromRequest } from '@/lib/api/auth-helper';
import { methodNotAllowed, parseBody } from '@/lib/mobile/http';
import { resolveMobileActor } from '@/lib/mobile/service';
import { prisma } from '@/lib/prisma';
import { mobileAnalyticsEventInputSchema } from '@mejoy/api-contracts/mobile';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return methodNotAllowed(res, ['POST']);
  }

  const parsedBody = parseBody(mobileAnalyticsEventInputSchema, req.body);
  if ('error' in parsedBody) {
    return res.status(400).json({ error: parsedBody.error, issues: parsedBody.issues });
  }

  const email = await getUserEmailFromRequest(req);
  const actor = await resolveMobileActor({ email });
  const userAgent = req.headers['user-agent'];
  const forwardedFor = req.headers['x-forwarded-for'];
  const ipAddress = Array.isArray(forwardedFor) ? forwardedFor[0] : forwardedFor || req.socket.remoteAddress || null;

  await prisma.auditLog.create({
    data: {
      userId: actor.actorId,
      action: `mobile.analytics.${parsedBody.data.event}`,
      details: {
        screen: parsedBody.data.screen || null,
        status: parsedBody.data.status,
        metadata: parsedBody.data.metadata,
        occurredAt: new Date().toISOString(),
      },
      ipAddress,
      userAgent: userAgent || null,
    },
  });

  return res.status(200).json({ ok: true });
}
