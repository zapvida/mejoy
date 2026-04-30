import type { NextApiRequest, NextApiResponse } from "next";
import { deriveReport } from "@/lib/report/derive";
import { serverEnv } from "@/lib/env";
import { prisma } from "@/lib/prisma";
import { setSentryTriageTag } from "@/lib/observability";
import { z } from "zod";
import { track } from '@/lib/analytics';

// Legacy response type for backward compatibility
type ReportResponse = {
  status: "completed" | "running" | "failed";
  triageId?: string;
  error?: string;
  report?: any;
  summary?: string;
  redFlags?: any[];
};

const requestSchema = z.object({
  triageId: z.string().min(6),
  force: z.boolean().optional(),
});

const makeIdempotencyKey = (triageId: string, clientId: string) => 
  `report:${triageId}:${clientId}`;

const assertRateLimit = async (clientId: string, endpoint: string, maxRequests: number) => {
  // Simple rate limiting implementation
  // In production, use Redis or similar
  return Promise.resolve();
};

const toCompletedResponse = (reportRecord: any): ReportResponse | null => {
  if (!reportRecord?.report_data) return null;
  
  const reportData = reportRecord.report_data;
  return {
    status: "completed",
    triageId: reportRecord.triage_id,
    report: reportData,
    summary: reportData.sections?.summary ?? "",
    redFlags: reportData.risks ?? [],
  };
};

export default async function handler(req: NextApiRequest, res: NextApiResponse<ReportResponse>) {
  if (req.method !== "POST") {
    return res.status(405).json({ status: "failed", error: "Use POST" });
  }

  // Log deprecation warning
  console.warn("[DEPRECATED] /api/gerarRelatorio is deprecated. Use deriveReport() directly.");

  if (!serverEnv.PDF_V2) {
    console.error("[gerarRelatorio] PDF_V2 disabled, check OPENAI_API_KEY configuration");
    return res.status(503).json({ status: "failed", error: "IA indisponível. Configure OPENAI_API_KEY." });
  }

  if (!prisma) {
    return res.status(503).json({ status: "failed", error: "Banco de dados indisponível." });
  }

  const parsed = requestSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ status: "failed", error: "Payload inválido." });
  }

  const { triageId, force } = parsed.data;
  setSentryTriageTag(triageId);

  const clientId = req.cookies["client_id"] ?? "anonymous";

  try {
    await assertRateLimit(clientId, "/api/gerarRelatorio", 50); // Very generous limit for report generation
  } catch (error: any) {
    if (error?.status === 429) {
      console.warn(`[gerarRelatorio] Rate limit exceeded for client: ${clientId}`);
      return res
        .status(429)
        .json({ status: "failed", error: "Muitas requisições. Tente novamente em alguns minutos." });
    }
    throw error;
  }

  const idempotencyKey = makeIdempotencyKey(triageId, clientId);

  if (!force) {
    try {
      const existingRequest = await prisma.reportRequest.findUnique({
        where: { key: idempotencyKey },
      });

      if (existingRequest) {
        console.log(`[gerarRelatorio] Returning cached response for triageId: ${triageId}`);
        return res.status(200).json(existingRequest.payload as ReportResponse);
      }
    } catch (cacheError) {
      console.warn(`[gerarRelatorio] Cache lookup failed for triageId ${triageId}:`, cacheError);
      // Continue without cache if lookup fails
    }
  }

  let reportRecord;
  try {
    reportRecord = await prisma.triageReport.findUnique({
      where: { triage_id: triageId },
    });
  } catch (dbError) {
    console.error(`[gerarRelatorio] Database error for triageId ${triageId}:`, dbError);
    return res.status(500).json({ 
      status: "failed", 
      error: "Erro de conexão com o banco de dados" 
    });
  }

  if (reportRecord?.status === "completed" && !force) {
    try {
      const completed = toCompletedResponse(reportRecord);
      if (completed) {
        const completedPayload = completed as unknown as any;
        await prisma.reportRequest.upsert({
          where: { key: idempotencyKey },
          update: { payload: completedPayload },
          create: { key: idempotencyKey, payload: completedPayload },
        });
        console.log(`[gerarRelatorio] Returning completed report for triageId: ${triageId}`);
        return res.status(200).json(completed);
      }
    } catch (cacheError) {
      console.warn(`[gerarRelatorio] Cache update failed for triageId ${triageId}:`, cacheError);
      // Continue without cache if update fails
    }
  }

  if (reportRecord?.status === "running" && !force) {
    console.log(`[gerarRelatorio] Report already running for triageId: ${triageId}`);
    return res.status(200).json({ status: "running", triageId });
  }

  if (!reportRecord) {
    try {
      reportRecord = await prisma.triageReport.create({
        data: { triage_id: triageId, status: "running" },
      });
      console.log(`[gerarRelatorio] Created new report record for triageId: ${triageId}`);
    } catch (createError) {
      console.error(`[gerarRelatorio] Failed to create report record for triageId ${triageId}:`, createError);
      return res.status(500).json({ 
        status: "failed", 
        error: "Erro ao criar registro de relatório" 
      });
    }
  } else if (reportRecord.status !== "running") {
    try {
      reportRecord = await prisma.triageReport.update({
        where: { triage_id: triageId },
        data: { status: "running", error: null },
      });
      console.log(`[gerarRelatorio] Updated report status to running for triageId: ${triageId}`);
    } catch (updateError) {
      console.error(`[gerarRelatorio] Failed to update report status for triageId ${triageId}:`, updateError);
      // Continue even if update fails
    }
  }

  const session = await prisma.triageSession.findUnique({
    where: { triage_id: triageId },
  });

  if (!session) {
    console.error(`[gerarRelatorio] Session not found for triageId: ${triageId}`);
    try {
      await prisma.triageReport.update({
        where: { triage_id: triageId },
        data: { status: "failed", error: "Sessão não encontrada." },
      });
    } catch (updateError) {
      console.error(`[gerarRelatorio] Failed to update report status for triageId ${triageId}:`, updateError);
    }
    return res.status(404).json({ status: "failed", error: "Sessão não encontrada." });
  }

  const profileSnapshot = (session.profile_snapshot as Record<string, any> | null) ?? {};
  const answers = (session.answers as Record<string, any> | null) ?? {};

  const profile = {
    name: profileSnapshot.name ?? answers.name ?? "Paciente",
    sex: profileSnapshot.sex ?? answers.sex ?? "não informado",
    whatsapp: profileSnapshot.whatsapp ?? answers.whatsapp,
    dob: profileSnapshot.birth_date ?? answers.dob,
    weight: profileSnapshot.weight_kg ?? answers.weight,
    height: profileSnapshot.height_cm ?? answers.height,
    email: profileSnapshot.email ?? answers.email,
  };

  try {
    // Use new unified pipeline
    const reportDTO = await deriveReport({
      triageId,
      sessionData: {
        answers,
        profile: {
          name: profile.name,
          sex: profile.sex,
          age: profile.dob ? Math.floor((Date.now() - new Date(profile.dob).getTime()) / (1000 * 60 * 60 * 24 * 365.25)) : undefined,
          bmi: profile.weight && profile.height ? {
            bmi: Number((profile.weight / ((profile.height / 100) ** 2)).toFixed(1)),
            classification: "normal" // TODO: implement classification
          } : undefined,
          whatsapp: profile.whatsapp,
          weightKg: profile.weight,
          heightCm: profile.height,
        },
        triageSlug: session.triage_slug || "geral",
      },
      options: {
        includeAudio: serverEnv.TTS_ENABLED,
      }
    }, { persist: true });

    // Convert ReportDTO to legacy format
    const legacyResponse: ReportResponse = {
      status: "completed",
      triageId,
      report: reportDTO,
      summary: reportDTO.sections.summary,
      redFlags: reportDTO.risks,
    };

    // Cache the response
    const completedPayload = legacyResponse as unknown as any;
    try {
      await prisma.reportRequest.upsert({
        where: { key: idempotencyKey },
        update: { payload: completedPayload },
        create: { key: idempotencyKey, payload: completedPayload },
      });
      console.log(`[gerarRelatorio] Cached response for triageId: ${triageId}`);
    } catch (cacheError) {
      console.warn(`[gerarRelatorio] Failed to cache response for triageId ${triageId}:`, cacheError);
      // Continue even if cache fails
    }

    console.log(`[gerarRelatorio] Successfully generated report for triageId: ${triageId}`);
    
    // Track PDF generation event
    track('pdf_generated', { 
      report_id: triageId, 
      sections: reportDTO.sections ? Object.keys(reportDTO.sections).length : 0 
    });
    
    return res.status(200).json(legacyResponse);

  } catch (error: any) {
    console.error("[gerarRelatorio] Error:", error);
    
    // Try to update the report status, but don't fail if this fails
    try {
      await prisma.triageReport.update({
        where: { triage_id: triageId },
        data: { 
          status: "failed", 
          error: error.message || "Erro interno na geração do relatório" 
        },
      });
    } catch (updateError) {
      console.error("[gerarRelatorio] Failed to update report status:", updateError);
    }

    const errorMessage = error.message || "Erro interno na geração do relatório";
    console.error(`[gerarRelatorio] Returning error for triageId ${triageId}:`, errorMessage);
    
    return res.status(500).json({ 
      status: "failed", 
      error: errorMessage 
    });
  }
}