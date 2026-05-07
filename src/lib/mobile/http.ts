import type { NextApiResponse } from 'next';
import { z } from 'zod';

export function methodNotAllowed(res: NextApiResponse, allowed: string[]) {
  res.setHeader('Allow', allowed.join(', '));
  return res.status(405).json({ error: 'Method not allowed' });
}

export function parseBody<T extends z.ZodTypeAny>(
  schema: T,
  body: unknown
): { ok: true; data: z.infer<T> } | { ok: false; error: string; issues: z.ZodIssue[] } {
  const result = schema.safeParse(body ?? {});
  if (!result.success) {
    return {
      ok: false,
      error: 'Payload inválido',
      issues: result.error.issues,
    };
  }

  return { ok: true, data: result.data };
}
