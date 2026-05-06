import { createClient } from "@supabase/supabase-js";
import type { GetServerSideProps } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import { useCallback, useEffect, useRef } from "react";

import { ReportView } from "@/components/report/ReportView";
import {
  trackReportView,
  trackReportPrint,
  trackReportHeroView,
} from "@/lib/ga4";
import type { ReportViewModel } from "@/lib/report/derive";
import { deriveReport } from "@/lib/report/derive";
import type { PatientProfile } from "@/lib/report/types";
import { getSupabaseServerConfig } from "@/lib/supabase/runtime-config";

interface RelatorioPageProps {
  vm: ReportViewModel | null;
  safePatient: PatientProfile | null;
  reportId: string | null;
  shouldPrint?: boolean;
  error?: string;
}

export default function RelatorioPage({ vm, safePatient, reportId, shouldPrint }: RelatorioPageProps) {
  const router = useRouter();
  const heroTracked = useRef(false);

  useEffect(() => {
    if (!reportId) return;
    trackReportView(reportId);
  }, [reportId]);

  const handleHeroVisible = useCallback(() => {
    if (!heroTracked.current && reportId) {
      trackReportHeroView(reportId);
      heroTracked.current = true;
    }
  }, [reportId]);

  const handleRequestPrint = useCallback(() => {
    if (!reportId) return;
    trackReportPrint(reportId);
    const url = `/api/pdf/report?id=${encodeURIComponent(reportId)}`;
    window.open(url, "_blank", "noopener");
  }, [reportId]);

  const handleCTAClick = useCallback((ctaId: string) => {
    // Implementar tracking de CTAs se necessário
    console.log('CTA clicked:', ctaId);
  }, []);

  if (!vm) {
    return (
      <>
        <Head>
          <title>Relatório não encontrado | MeJoy</title>
          <meta name="robots" content="noindex" />
        </Head>
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 flex items-center justify-center">
          <div className="text-center text-white">
            <h1 className="text-2xl font-semibold mb-4">Relatório não encontrado</h1>
            <p className="text-white/70 mb-6">O relatório solicitado não foi encontrado.</p>
            <button 
              onClick={() => router.push('/triagem')}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Fazer Nova Triagem
            </button>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Head>
        <title>{vm.greeting} | MeJoy</title>
        <meta name="description" content={`Relatório personalizado de saúde para ${vm.basics.firstName}`} />
        <meta name="robots" content="noindex" />
      </Head>
      
      <ReportView 
        vm={vm}
        onHeroVisible={handleHeroVisible}
        onRequestPrint={handleRequestPrint}
        onCTAClick={handleCTAClick}
      />
    </>
  );
}

export const getServerSideProps: GetServerSideProps<RelatorioPageProps> = async ({ params, query }) => {
  const { id } = params as { id: string };
  const shouldPrint = query.print === "true";

  try {
    const { url: supabaseUrl, readKey: supabaseKey } = getSupabaseServerConfig();

    if (!supabaseUrl || !supabaseKey) {
      console.error("[relatorio] Ambiente Supabase não configurado");
      return { props: { vm: null, safePatient: null, reportId: id, error: "Ambiente não configurado" } };
    }

    const supabase = createClient(supabaseUrl, supabaseKey);
    const { data: reportRow, error: reportError } = await supabase
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
      .eq("triage_id", id)
      .single();

    if (reportError || !reportRow) {
      console.error(`[relatorio] Report não encontrado para triageId: ${id}`, reportError);
      return { props: { vm: null, safePatient: null, reportId: id, error: "Relatório não encontrado" } };
    }

    const triageSession = reportRow.triage_sessions;
    const patientSnapshot = triageSession?.profile_snapshot || {};

    const safePatient: PatientProfile = {
      id: patientSnapshot.id || id,
      name: patientSnapshot.name || "Paciente",
      sex: patientSnapshot.sex || "undisclosed",
      age: patientSnapshot.age ?? null,
      birthDate: patientSnapshot.birthDate ?? null,
      bmi: patientSnapshot.bmi ?? null,
      whatsapp: patientSnapshot.whatsapp ?? "",
      weightKg: patientSnapshot.weightKg ?? null,
      heightCm: patientSnapshot.heightCm ?? null,
    };

    // Usar o novo pipeline de derivação
    const vm = await deriveReport({
      triageId: reportRow.triage_id,
      sessionData: {
        answers: triageSession?.answers || {},
        profile: safePatient,
        triageSlug: triageSession?.triage_slug || "geral",
      },
      options: {
        forceRegenerate: false,
        includeAudio: false,
      },
    }, { persist: false });

    return {
      props: {
        vm,
        safePatient,
        reportId: vm.id,
        shouldPrint,
      },
    };
  } catch (error) {
    console.error("[relatorio] Erro ao carregar relatório:", error);
    return { 
      props: { 
        vm: null, 
        safePatient: null, 
        reportId: id, 
        error: "Erro interno do servidor" 
      } 
    };
  }
};
