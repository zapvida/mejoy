import { createClient } from '@supabase/supabase-js';
import type { GetServerSideProps } from 'next';
import Head from 'next/head';
import { useEffect, useState } from 'react';
import { deriveReport } from '@/lib/report/derive';
import type { ReportViewModel } from '@/lib/report/derive';
import { HeaderZapfarm } from '@/components/zapfarm/emagrecimento/HeaderZapfarm';
import { ReportHeroEmagrecimentoEnhanced } from '@/components/zapfarm/report/ReportHeroEmagrecimentoEnhanced';
import { ReportActionPlanStructured } from '@/components/zapfarm/report/ReportActionPlanStructured';
import { ReportAnalysisEmagrecimento } from '@/components/zapfarm/report/ReportAnalysisEmagrecimento';
import { ReportPlanSuggestion } from '@/components/zapfarm/report/ReportPlanSuggestion';
import { ReportEvidenceEmagrecimento } from '@/components/zapfarm/report/ReportEvidenceEmagrecimento';
import { ReportCtasEmagrecimento } from '@/components/zapfarm/report/ReportCtasEmagrecimento';
import { ReportScientificFactsEmagrecimento } from '@/components/zapfarm/report/ReportScientificFactsEmagrecimento';
import { ReportRedFlagsBanner } from '@/components/zapfarm/report/ReportRedFlagsBanner';
import { ReportPrePrescription } from '@/components/zapfarm/report/ReportPrePrescription';
import { ReportWhatsappBanner } from '@/components/zapfarm/emagrecimento/ReportWhatsappBanner';
import { ReportDecisionFold } from '@/components/zapfarm/emagrecimento/ReportDecisionFold';
import { buildZapVidaPlantaoUrl } from '@/config/zapfarm/emagrecimento-plans';
import { isEmagrecimentoReportCompact } from '@/lib/emagrecimento/config';
import { trackFunnelEvent } from '@/lib/funnel/events-client';
import { createClinicalHandoff } from '@/lib/handoff/client';
import { buildEmagrecimentoReportWhatsappUrl } from '@/lib/emagrecimento/whatsappCta';

interface RelatorioEmagrecimentoProps {
  vm: ReportViewModel | null;
  reportId: string | null;
  error?: string;
}

async function resolveTriageId(
  supabase: any,
  id: string
): Promise<string> {
  const sessionQuery = await supabase
    .from('triage_sessions')
    .select('triage_id')
    .eq('triage_id', id)
    .maybeSingle();
  const sessionMatch = sessionQuery.data as { triage_id?: string } | null;

  if (sessionMatch?.triage_id) return sessionMatch.triage_id;

  const reportQuery = await supabase
    .from('triage_reports')
    .select('triage_id')
    .eq('id', id)
    .maybeSingle();
  const reportMatch = reportQuery.data as { triage_id?: string } | null;

  return reportMatch?.triage_id || id;
}

export default function RelatorioEmagrecimentoPage({ vm, reportId, error }: RelatorioEmagrecimentoProps) {
  const [stickyHandoffLoading, setStickyHandoffLoading] = useState(false);
  const [stickyHandoffError, setStickyHandoffError] = useState<string | null>(null);
  const reportCompact = isEmagrecimentoReportCompact();

  useEffect(() => {
    if (!reportId) return;
    trackFunnelEvent('report_viewed', { report_id: reportId });
  }, [reportId]);

  const handleStickyClinicalHandoff = async () => {
    if (!reportId || stickyHandoffLoading) return;
    setStickyHandoffLoading(true);
    setStickyHandoffError(null);

    trackFunnelEvent('cta_clinical_handoff', {
      report_id: reportId,
      origin: 'sticky_report'
    });

    try {
      const data = await createClinicalHandoff({
        triageId: vm?.triageId || reportId,
        reportId,
        sourceJourney: 'emagrecimento.report',
        sourceOrigin: 'sticky_report'
      });

      trackFunnelEvent('handoff_created', { report_id: reportId });
      trackFunnelEvent('handoff_opened', { report_id: reportId });
      window.location.href = data.redirectUrl;
    } catch (handoffError: any) {
      trackFunnelEvent('handoff_failed', {
        report_id: reportId,
        origin: 'sticky_report',
        surface: 'relatorio_sticky'
      });
      setStickyHandoffError(handoffError?.message || 'Falha ao iniciar avaliação clínica.');
      setStickyHandoffLoading(false);
    }
  };

  if (error || !vm) {
    return (
      <>
        <Head>
          <title>Relatório não encontrado | Me Joy</title>
        </Head>
        <div className="flex min-h-screen items-center justify-center bg-[#f7f6f2] px-4 text-slate-900">
          <div className="max-w-lg rounded-[2rem] border border-slate-200 bg-white p-8 text-center shadow-[0_20px_60px_rgba(15,23,42,0.08)]">
            <h1 className="text-3xl font-semibold tracking-[-0.04em] text-[#2f2925]">Relatório não encontrado</h1>
            <p className="mt-3 text-base leading-7 text-slate-600">O relatório solicitado não foi encontrado.</p>
            <a
              href="/emagrecimento"
              className="mt-6 inline-flex rounded-full bg-[#93b28d] px-6 py-3 font-semibold text-white transition-colors hover:bg-[#7e9f79]"
            >
              Voltar para início
            </a>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Head>
        <title>Relatório de Emagrecimento | Me Joy</title>
        <meta name="description" content={`Relatório personalizado de emagrecimento para ${vm.basics.firstName}`} />
      </Head>

        <div className="min-h-screen bg-[#f7f6f2]">
        <div className="relative z-50">
          <HeaderZapfarm mode="report" primaryCtaLabel="Ver programa sugerido" primaryCtaMobileLabel="Programa" />
        </div>

        {reportId && (
          <ReportWhatsappBanner
            reportId={reportId}
            firstName={vm.basics.firstName}
            triageSlug="emagrecimento"
          />
        )}

        {reportId && <ReportDecisionFold vm={vm} reportId={reportId} />}

        {/* Banner de Red Flags se houver */}
        {vm.context.redFlags && vm.context.redFlags.length > 0 && (
          <ReportRedFlagsBanner 
            redFlags={vm.context.redFlags.map((r: any) => typeof r === 'string' ? r : r.title || r.message || String(r))} 
            classification={(vm as any).classification}
          />
        )}

        <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/96 p-3.5 sm:p-4 shadow-[0_-12px_40px_rgba(15,23,42,0.16)] backdrop-blur md:hidden space-y-2 border-t border-emerald-100">
          <button
            type="button"
            onClick={() => {
              const el = document.getElementById('cta-clinico');
              el?.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }}
            className="inline-flex items-center justify-center w-full rounded-full bg-emerald-600 text-white font-bold py-2.5 sm:py-3 px-4 sm:px-6 shadow-md text-sm sm:text-base"
          >
            Ver opções e fechar meu programa →
          </button>
          <a
            href={buildEmagrecimentoReportWhatsappUrl({
              reportId: reportId || '',
              firstName: vm.basics.firstName,
              triageSlug: 'emagrecimento',
            })}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() =>
              trackFunnelEvent('whatsapp_report_cta', { report_id: reportId, surface: 'sticky_mobile' })
            }
            className="inline-flex items-center justify-center w-full rounded-full border border-emerald-200 bg-white text-emerald-800 font-semibold py-2.5 sm:py-3 px-4 sm:px-6 text-sm sm:text-base"
          >
            WhatsApp oficial — tirar dúvidas →
          </a>
          <button
            type="button"
            onClick={handleStickyClinicalHandoff}
            disabled={stickyHandoffLoading}
            className="inline-flex items-center justify-center w-full rounded-full bg-slate-900 text-white font-semibold py-2 px-4 text-xs sm:text-sm disabled:opacity-70 disabled:cursor-not-allowed border border-slate-900"
          >
            {stickyHandoffLoading ? 'Conectando com o ZapVida...' : 'Ou: continuar avaliação clínica →'}
          </button>
          {stickyHandoffError && (
            <div className="mt-1 text-center">
              <p className="text-xs text-slate-600">{stickyHandoffError}</p>
              <a
                href={buildZapVidaPlantaoUrl('relatorio_sticky_fallback')}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackFunnelEvent('clinical_payment_started', { report_id: reportId, source: 'sticky_report_fallback' })}
                className="inline-block mt-1 text-xs font-semibold text-emerald-700 underline underline-offset-2"
              >
                Abrir ZapVida direto
              </a>
            </div>
          )}
        </div>

        <div className="pt-20 sm:pt-16 md:pt-20 pb-20 md:pb-0">
          <ReportHeroEmagrecimentoEnhanced vm={vm} reportId={reportId || undefined} />
          
          <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-10 md:py-12">
            <div className="space-y-8 sm:space-y-10 md:space-y-12">
            {reportCompact ? (
              <details className="group rounded-2xl border border-emerald-100 bg-white/80 p-4 open:bg-white open:shadow-md">
                <summary className="cursor-pointer list-none text-lg font-bold text-gray-900 after:ml-2 after:text-emerald-500 after:content-['+'] group-open:after:content-['−']">
                  Ver análise detalhada do relatório
                </summary>
                <div className="mt-4">
                  <ReportAnalysisEmagrecimento vm={vm} />
                </div>
              </details>
            ) : (
              <ReportAnalysisEmagrecimento vm={vm} />
            )}
            
            <ReportPrePrescription vm={vm} />
            
            <ReportActionPlanStructured vm={vm} />
            
            {reportCompact ? (
              <details className="group rounded-2xl border border-emerald-100 bg-white/80 p-4 open:bg-white open:shadow-md">
                <summary className="cursor-pointer list-none text-lg font-bold text-gray-900 after:ml-2 after:text-emerald-500 after:content-['+'] group-open:after:content-['−']">
                  Evidências e referências (opcional)
                </summary>
                <div className="mt-4 space-y-8">
                  <ReportEvidenceEmagrecimento vm={vm} />
                  <ReportScientificFactsEmagrecimento vm={vm} reportId={reportId || undefined} />
                </div>
              </details>
            ) : (
              <>
                <ReportEvidenceEmagrecimento vm={vm} />
                <ReportScientificFactsEmagrecimento vm={vm} reportId={reportId || undefined} />
              </>
            )}
            
            <ReportPlanSuggestion vm={vm} />
            
            <div id="cta-clinico">
              <ReportCtasEmagrecimento 
                reportId={reportId || ''} 
                preferenciaPrincipioAtivo={(vm as any).answers?.preferencia_principio_ativo}
                vm={vm}
              />
            </div>
            </div>
          </div>

          <section className="border-t border-slate-200 bg-white py-12 sm:py-16 md:py-20">
            <div className="mx-auto max-w-4xl px-4 text-center sm:px-6">
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#4d6d56]">Pronto para seguir</p>
              <h2 className="mt-3 text-[clamp(2rem,5vw,3.7rem)] font-semibold tracking-[-0.05em] text-[#2f2925]">
                Seu próximo passo está pronto
              </h2>
              <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-slate-600 sm:text-lg">
                Escolha a trilha, confirme seus dados e siga com revisão médica obrigatória antes de qualquer prescrição.
              </p>
              <a
                href="#cta-clinico"
                className="mt-7 inline-flex w-full max-w-xs items-center justify-center rounded-full bg-[#93b28d] px-8 py-4 text-sm font-bold uppercase tracking-[0.08em] text-white transition-colors hover:bg-[#7e9f79] sm:w-auto sm:max-w-none sm:text-base"
              >
                Ir para as opções do programa →
              </a>
            </div>
          </section>

          <div className="mx-auto max-w-5xl px-4 pb-8 pt-8 text-center sm:px-6 sm:pb-10 md:pb-12">
            <a
              href={`/api/pdf/report?id=${reportId}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex rounded-full border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50 sm:text-base"
            >
              Baixar relatório em PDF
            </a>
          </div>
        </div>
      </div>
    </>
  );
}

export const getServerSideProps: GetServerSideProps<RelatorioEmagrecimentoProps> = async ({ query }) => {
  const id = query.id as string | undefined;

  if (!id) {
    return { props: { vm: null, reportId: null, error: 'ID não fornecido' } };
  }

  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    // Modo mock para desenvolvimento
    if (!supabaseUrl || !supabaseKey) {
      if (process.env.NODE_ENV === 'development') {
        console.warn('[relatorio] Supabase não configurado, usando modo mock');
        
        // Em modo mock, os dados já foram processados no finalize
        // O relatório foi gerado lá, então aqui apenas retornamos erro
        // para forçar o usuário a passar pelo fluxo correto
        // OU podemos tentar gerar novamente com dados padrão
        
        // Por enquanto, usar dados padrão mas avisar que em produção precisa Supabase
        const mockProfile = {
          name: "Paciente",
          sex: "M" as const,
          age: 35,
          birthDateISO: "1990-01-01",
          weightKg: 75,
          heightCm: 170,
          whatsapp: "",
        };

        console.warn('[relatorio] ⚠️ MODO MOCK: Usando dados padrão. Em produção, configure Supabase para usar dados reais.');
        console.warn('[relatorio] 💡 Dica: Em desenvolvimento, os dados reais são usados quando você finaliza a triagem (não ao acessar o relatório diretamente).');

        const vm = await deriveReport({
          triageId: id,
          sessionData: {
            answers: {},
            profile: {
              name: mockProfile.name,
              sex: mockProfile.sex,
              age: mockProfile.age,
              birthDate: mockProfile.birthDateISO,
              weightKg: mockProfile.weightKg,
              heightCm: mockProfile.heightCm,
              whatsapp: mockProfile.whatsapp,
            },
            triageSlug: 'emagrecimento',
          },
          options: {
            includeAudio: false,
          },
        }, { persist: false });

        (vm as any).answers = {};
        return { props: { vm, reportId: id } };
      }
      
      return { props: { vm: null, reportId: id, error: 'Ambiente não configurado' } };
    }

    const supabase = createClient(supabaseUrl, supabaseKey);
    const resolvedId = await resolveTriageId(supabase, id);
    const { data: sessionRow, error: sessionError } = await supabase
      .from('triage_sessions')
      .select('*')
      .eq('triage_id', resolvedId)
      .single();

    if (sessionError || !sessionRow) {
      return { props: { vm: null, reportId: id, error: 'Sessão não encontrada' } };
    }

    const patientSnapshot = sessionRow.profile_snapshot || {};
    const answers = sessionRow.answers || {};
    
    // Extrair dados do snapshot e answers (priorizar snapshot)
    const weightKg = patientSnapshot.weight_kg ?? answers.peso ?? answers.weight ?? null;
    const heightCm = patientSnapshot.height_cm ?? answers.altura ?? answers.height ?? null;
    const name = patientSnapshot.name ?? answers.name ?? 'Paciente';
    
    // Calcular idade se necessário
    let age: number | null = null;
    if (patientSnapshot.age) {
      age = patientSnapshot.age;
    } else if (patientSnapshot.birth_date) {
      const birthDate = new Date(patientSnapshot.birth_date);
      const today = new Date();
      age = Math.floor((today.getTime() - birthDate.getTime()) / (1000 * 60 * 60 * 24 * 365.25));
    } else if (answers.idade_faixa) {
      // Converter faixa etária para idade média
      const faixaMap: Record<string, number> = {
        '18-30': 24,
        '31-45': 38,
        '46-60': 53,
        '61+': 70
      };
      age = faixaMap[answers.idade_faixa] ?? null;
    }
    
    // Calcular IMC se tivermos peso e altura
    let bmi: number | null = null;
    if (weightKg && heightCm && heightCm > 0 && weightKg > 0) {
      const heightM = heightCm / 100;
      bmi = Math.round((weightKg / (heightM * heightM)) * 10) / 10;
    } else if (patientSnapshot.bmi) {
      // Se já existe IMC calculado, usar ele
      bmi = typeof patientSnapshot.bmi === 'number' 
        ? patientSnapshot.bmi 
        : (patientSnapshot.bmi as any)?.bmi ?? null;
    }
    
    console.log('[relatorio] Dados recuperados:', {
      name,
      weightKg,
      heightCm,
      bmi,
      age,
      sex: patientSnapshot.sex || answers.sex
    });
    
    const vm = await deriveReport({
      triageId: resolvedId,
      sessionData: {
        answers,
        profile: {
          id: resolvedId,
          name: name,
          sex: patientSnapshot.sex ?? answers.sex ?? 'undisclosed',
          age: age ?? null,
          birthDate: patientSnapshot.birth_date ?? patientSnapshot.birthDate ?? null,
          bmi: bmi ?? null,
          whatsapp: patientSnapshot.whatsapp ?? answers.whatsapp ?? '',
          weightKg: weightKg ? Number(weightKg) : null,
          heightCm: heightCm ? Number(heightCm) : null,
        },
        triageSlug: sessionRow.triage_slug || 'emagrecimento',
      },
      options: {
        includeAudio: false,
      },
    }, { persist: false });

    // Adicionar preferência ao contexto do VM para passar para o componente
    (vm as any).answers = answers;

    return { props: { vm, reportId: resolvedId } };
  } catch (error: any) {
    console.error('[relatorio] Error:', error);
    return { props: { vm: null, reportId: id, error: error?.message || 'Erro ao gerar relatório' } };
  }
};
