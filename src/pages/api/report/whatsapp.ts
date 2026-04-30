import type { NextApiRequest, NextApiResponse } from "next";
import { createClient } from "@supabase/supabase-js";
import type { PatientProfile, Report } from "@/lib/report/types";
import type { ReportData } from "@/types/report";
import { deriveReport as deriveLegacyReport } from "@/lib/report/derive";
import { toReportDataFromLegacy, buildExamTexts, deriveReport as enrichReportData } from "@/lib/report/deriveReport";
import { readJson } from "@/lib/http/parse";
import { z } from "zod";

const BodySchema = z.object({
  id: z.string().uuid("ID deve ser um UUID válido"),
  phone: z.string().min(8).optional(),
  message: z.string().optional(),
  section: z.string().optional(),
});

type WhatsappResponse = {
  text: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<WhatsappResponse | { error: string }>
) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Método não permitido" });
  }

  try {
    // BEGIN patch whatsapp-report
    const body = readJson(req, res, BodySchema);
    if (!body.ok) return;

    const { id, phone, message, section } = body.data;

    // Verificar se Supabase está configurado
    const hasDeps = !!process.env.SUPABASE_SERVICE_ROLE_KEY && 
                   !!process.env.NEXT_PUBLIC_SUPABASE_URL;

    if (!hasDeps) {
      return res.status(200).json({ 
        ok: true, 
        sent: false, 
        reason: "integrations-not-configured" 
      });
    }

    const reportData = await loadReportData(id);
    if (!reportData) {
      return res.status(404).json({ error: "Relatório não encontrado" });
    }

    const whatsappMessage = buildWhatsappMessage(reportData.data, reportData.patient, section);
    return res.status(200).json({ text: whatsappMessage });
  } catch (error) {
    console.warn("[whatsapp] soft-fail:", error?.message);
    return res.status(202).json({ 
      ok: true, 
      sent: false, 
      reason: "soft-fail" 
    });
  }
}

async function loadReportData(triageId: string): Promise<{ data: ReportData; patient: PatientProfile } | null> {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseKey) {
    console.error("[api/report/whatsapp] Supabase não configurado");
    return null;
  }

  const supabase = createClient(supabaseUrl, supabaseKey);
  const { data: reportRow, error } = await supabase
    .from("triage_reports")
    .select(
      `
      *,
      triage_sessions (
        triage_slug,
        answers,
        profile_snapshot
      )
    `
    )
    .eq("triage_id", triageId)
    .maybeSingle(); // Usar maybeSingle() em vez de single()

  if (error) {
    console.error("[api/report/whatsapp] Erro ao buscar relatório:", error);
    return null;
  }

  if (!reportRow) {
    console.log("[api/report/whatsapp] Relatório não encontrado para ID:", triageId);
    return null;
  }

  const triageSession = reportRow.triage_sessions;
  const patientSnapshot = triageSession?.profile_snapshot || {};

  const safePatient: PatientProfile = {
    id: patientSnapshot.id || triageId,
    name: patientSnapshot.name || "Paciente",
    sex: patientSnapshot.sex || "undisclosed",
    age: patientSnapshot.age ?? null,
    birthDate: patientSnapshot.birthDate ?? null,
    bmi: patientSnapshot.bmi ?? null,
    whatsapp: patientSnapshot.whatsapp ?? "",
    weightKg: patientSnapshot.weightKg ?? null,
    heightCm: patientSnapshot.heightCm ?? null,
  };

  let finalReport: Report;

  if (reportRow.sections && reportRow.status === "completed") {
    finalReport = reportRow.sections as Report;
  } else {
    const derived = await deriveLegacyReport(
      {
        triageId,
        sessionData: {
          answers: triageSession?.answers || {},
          profile: safePatient,
          triageSlug: triageSession?.triage_slug || "geral",
        },
      },
      { persist: false }
    );

    finalReport = {
      id: triageId,
      triage: derived.triage,
      createdAt: reportRow.created_at ?? derived.createdAt,
      narrative: derived.sections.summary
        ? {
            headline: derived.sections.summary,
            heroSummary: derived.sections.summary,
            healthStatement: derived.sections.summary,
          }
        : {
            headline: `Relatório de saúde para ${safePatient.name}`,
            heroSummary: "Resumo personalizado de saúde.",
          },
      scores: derived.sections.scores,
      patient: {
        ...derived.patient,
        ...safePatient,
      },
      alerts: derived.sections.alerts,
      roadmap: derived.sections.roadmap,
      exams: derived.sections.exams,
      supplements: derived.sections.supplements ?? [],
      evidence: [],
      timeline: derived.sections.timeline,
      summary: derived.sections.summary,
      media: {},
      features: {
        enableShare: true,
        enablePremiumUpsell: true,
      },
    };
  }

  const reportData = toReportDataFromLegacy(finalReport);
  return { data: reportData, patient: safePatient };
}

function buildWhatsappMessage(report: ReportData, patient: PatientProfile, section?: string): string {
  const normalized = normalizePatient(patient);
  const enriched = enrichReportData({
    ...report,
    patient: normalized ?? undefined,
  });

  if (section === "preventiveExams" && normalized && enriched.preventiveExams?.length) {
    const { whatsapp } = buildExamTexts(normalized, enriched.preventiveExams);
    return whatsapp;
  }

  if (section === "grocery" && enriched.grocery) {
    return formatGroceryMessage(enriched.grocery);
  }

  return formatSummaryMessage(enriched, normalized);
}

function normalizePatient(patient: PatientProfile | null): { nome: string; idade: number; sexo: "masculino" | "feminino"; imc?: number } | null {
  if (!patient || typeof patient.age !== "number") return null;
  const sexNormalized = normalizeSex(patient.sex);
  if (!sexNormalized) return null;
  return {
    nome: patient.name || "Paciente",
    idade: patient.age,
    sexo: sexNormalized,
    imc: patient.bmi?.bmi ?? undefined,
  };
}

function normalizeSex(sex?: string | null): "masculino" | "feminino" | null {
  if (!sex) return null;
  const value = sex.toLowerCase();
  if (value.startsWith("f")) return "feminino";
  if (value.startsWith("m")) return "masculino";
  return null;
}

function formatGroceryMessage(grocery: ReportData["grocery"]): string {
  if (!grocery) return "";
  const buy = grocery.buy.map((item) => `• ${item}`).join("\n");
  const avoid = grocery.avoid.map((item) => `• ${item}`).join("\n");
  const notes = (grocery.notes ?? []).map((item) => `• ${item}`).join("\n");
  return `Lista inteligente — foque esta semana:\n\nComprar:\n${buy}\n\nEvitar:\n${avoid}\n\nNotas:\n${notes}`;
}

function formatSummaryMessage(report: ReportData, patient: { nome: string } | null): string {
  const actions = (report.topActions ?? []).map((action, index) => `${index + 1}. ${action}`).join("\n");
  const alert = report.alertSignals?.[0]
    ? `⚠️ ${report.alertSignals[0]}`
    : "⚠️ Atenção aos ultraprocessados esta semana.";
  const greeting = patient ? `${patient.nome}, aqui está seu resumo:` : "Seu resumo atualizado:";
  return `${greeting}\n\nPrioridades de hoje:\n${actions}\n\n${alert}\n\nTempo de leitura ~${report.readingTimeMin ?? 3} min.`;
}
