// src/lib/http/parse.ts
// Helper universal para parsing seguro de JSON e validação

import type { NextApiRequest, NextApiResponse } from "next";
import { z } from "zod";

export function badRequest(res: NextApiResponse, msg = "Invalid JSON") {
  return res.status(400).json({ error: msg });
}

export function readJson<T>(
  req: NextApiRequest,
  res: NextApiResponse,
  schema: z.ZodSchema<T>
): { ok: true; data: T } | { ok: false } {
  try {
    let data: any = req.body;
    
    // Se body é string, tentar parsear
    if (typeof data === "string") {
      try {
        data = JSON.parse(data);
      } catch {
        return badRequest(res, "JSON malformado"), { ok: false };
      }
    }
    
    if (!data || typeof data !== "object") {
      return badRequest(res, "Body deve ser um objeto JSON"), { ok: false };
    }

    const parsed = schema.safeParse(data);
    if (!parsed.success) {
      return res.status(400).json({ 
        error: "Dados inválidos", 
        issues: parsed.error.issues 
      }) as any, { ok: false };
    }
    
    return { ok: true, data: parsed.data };
  } catch {
    return badRequest(res, "Erro ao processar JSON"), { ok: false };
  }
}

// Configuração para garantir que bodyParser está ativo
export const apiBodyConfig = {
  api: { bodyParser: { sizeLimit: "1mb" as const } },
};