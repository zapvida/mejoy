import { createClient } from '@supabase/supabase-js';
import type { GetServerSideProps } from 'next';
import Head from 'next/head';
import { useEffect, useState } from 'react';
import type { ReportViewModel } from '@/lib/report/derive';
import { HeaderZapfarm } from '@/components/zapfarm/emagrecimento/HeaderZapfarm';
import { EmagrecimentoCheckoutExperience } from '@/components/checkout/EmagrecimentoCheckoutExperience';
import { ReportHeroEmagrecimentoEnhanced } from '@/components/zapfarm/report/ReportHeroEmagrecimentoEnhanced';
import { ReportActionPlanGamified } from '@/components/zapfarm/report/ReportActionPlanGamified';
import { ReportAnalysisEmagrecimento } from '@/components/zapfarm/report/ReportAnalysisEmagrecimento';
import { ReportPlanSuggestion } from '@/components/zapfarm/report/ReportPlanSuggestion';
import { ReportEvidenceEmagrecimento } from '@/components/zapfarm/report/ReportEvidenceEmagrecimento';
import { ReportCtasEmagrecimento } from '@/components/zapfarm/report/ReportCtasEmagrecimento';
import { ReportScientificFactsEmagrecimento } from '@/components/zapfarm/report/ReportScientificFactsEmagrecimento';
import { ReportAIBadge } from '@/components/zapfarm/report/ReportAIBadge';
import { ReportRedFlagsBanner } from '@/components/zapfarm/report/ReportRedFlagsBanner';
import { ReportPrePrescription } from '@/components/zapfarm/report/ReportPrePrescription';
import { ReportWhatsappBanner } from '@/components/zapfarm/emagrecimento/ReportWhatsappBanner';
import { ReportDecisionFold } from '@/components/zapfarm/emagrecimento/ReportDecisionFold';
import {
  buildZapVidaPlantaoUrl,
  getPlanById,
  planIdMapping,
} from '@/config/zapfarm/emagrecimento-plans';
import { isEmagrecimentoReportCompact } from '@/lib/emagrecimento/config';
import { getMedicationTrackCard } from '@/lib/emagrecimento/medicationCards';
import { getRecommendedPlan } from '@/lib/emagrecimento/planRecommendation';
import {
  trilhaFromPreferencia,
  type EmagrecimentoTrilha,
} from '@/lib/emagrecimento/checkoutUrls';
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

  const answers = vm ? (vm as any).answers || {} : {};
  const classification = vm
    ? ((vm as any).classification as 'candidato_glp1' | 'nao_indicado' | 'contraindicado' | undefined)
    : undefined;
  const preferenciaPrincipioAtivo = answers.preferencia_principio_ativo as string | undefined;
  const impactoVida = answers.impacto_vida;
  const comorbidades = Array.isArray(answers.comorbidades)
    ? answers.comorbidades.filter((item: string) => item !== 'nenhuma')
    : [];
  const defaultTrilha = trilhaFromPreferencia(preferenciaPrincipioAtivo);
  const recommendedPlanLegacy = classification
    ? getRecommendedPlan(classification, impactoVida, comorbidades)
    : 'trimestral';
  const defaultPlanId =
    planIdMapping[recommendedPlanLegacy as keyof typeof planIdMapping] || 'programa-3m';

  const [selectedTrilha, setSelectedTrilha] = useState<EmagrecimentoTrilha>(defaultTrilha);
  const [selectedPlanId, setSelectedPlanId] = useState<string>(defaultPlanId);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const selectedPlan = getPlanById(selectedPlanId);
  const selectedTrackCard = getMedicationTrackCard(selectedTrilha);

  useEffect(() => {
    if (!reportId) return;
    trackFunnelEvent('report_viewed', { report_id: reportId });
  }, [reportId]);

  useEffect(() => {
    setSelectedTrilha(defaultTrilha);
  }, [defaultTrilha]);

  useEffect(() => {
    setSelectedPlanId(defaultPlanId);
  }, [defaultPlanId]);

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

  const openInlineCheckout = () => {
    if (!reportId) return;
    if (!checkoutOpen) {
      trackFunnelEvent('report_inline_checkout_opened', {
        report_id: reportId,
        triage_id: vm?.triageId || reportId,
        plano: selectedPlanId,
        trilha: selectedTrilha,
      });
    }
    setCheckoutOpen(true);

    window.setTimeout(() => {
      const element = document.getElementById('report-inline-checkout');
      element?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 80);
  };

  if (error || !vm) {
    return (
      <>
        <Head>
          <title>Relatório não encontrado | Me Joy</title>
        </Head>
        <div className="min-h-screen bg-gradient-to-br from-emerald-900 via-teal-900 to-slate-900 flex items-center justify-center text-white">
          <div className="text-center">
            <h1 className="text-2xl font-semibold mb-4">Relatório não encontrado</h1>
            <p className="text-emerald-50 mb-6">O relatório solicitado não foi encontrado.</p>
            <a
              href="/emagrecimento"
              className="inline-block px-6 py-3 bg-white text-emerald-800 rounded-lg hover:bg-emerald-50 transition-colors font-semibold"
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

      <div className="min-h-screen bg-[linear-gradient(180deg,#f6fbf7_0%,#edf7f0_28%,#f8fafc_100%)]">
        <div className="relative z-50">
          <HeaderZapfarm
            primaryCtaHref="#report-inline-checkout"
            primaryCtaLabel="Continuar nesta pagina"
            primaryCtaOnClick={openInlineCheckout}
          />
        </div>

        <ReportAIBadge />

        {reportId && (
          <ReportWhatsappBanner
            reportId={reportId}
            firstName={vm.basics.firstName}
            triageSlug="emagrecimento"
          />
        )}

        {reportId && (
          <ReportDecisionFold
            vm={vm}
            reportId={reportId}
            selectedTrilha={selectedTrilha}
            onSelectTrack={setSelectedTrilha}
            onOpenInlineCheckout={openInlineCheckout}
          />
        )}

        {vm.context.redFlags && vm.context.redFlags.length > 0 && (
          <ReportRedFlagsBanner
            redFlags={vm.context.redFlags.map((r: any) => typeof r === 'string' ? r : r.title || r.message || String(r))}
            classification={(vm as any).classification}
          />
        )}

        <div className="fixed bottom-0 left-0 right-0 z-40 space-y-2 border-t border-emerald-100 bg-white/96 p-3.5 shadow-[0_-12px_40px_rgba(15,23,42,0.16)] backdrop-blur md:hidden">
          <button
            type="button"
            onClick={openInlineCheckout}
            className="inline-flex w-full items-center justify-center rounded-full bg-emerald-600 px-4 py-2.5 text-sm font-bold text-white shadow-md sm:px-6 sm:py-3 sm:text-base"
          >
            Abrir checkout nesta pagina →
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
            className="inline-flex w-full items-center justify-center rounded-full border border-emerald-200 bg-white px-4 py-2.5 text-sm font-semibold text-emerald-800 sm:px-6 sm:py-3 sm:text-base"
          >
            WhatsApp oficial — tirar dúvidas →
          </a>
          <button
            type="button"
            onClick={handleStickyClinicalHandoff}
            disabled={stickyHandoffLoading}
            className="inline-flex w-full items-center justify-center rounded-full border border-slate-900 bg-slate-900 px-4 py-2 text-xs font-semibold text-white disabled:cursor-not-allowed disabled:opacity-70 sm:text-sm"
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

        <div className="pb-28 pt-20 sm:pt-16 md:pb-12 md:pt-20">
          <div className="container mx-auto space-y-8 px-4 py-8 sm:px-6 sm:py-10 md:space-y-10 md:py-12">
            <div id="cta-clinico">
              <ReportCtasEmagrecimento
                reportId={reportId || ''}
                preferenciaPrincipioAtivo={preferenciaPrincipioAtivo}
                vm={vm}
                selectedPlanId={selectedPlanId}
                selectedTrilha={selectedTrilha}
                onSelectPlan={setSelectedPlanId}
                onOpenInlineCheckout={openInlineCheckout}
              />
            </div>

            <section id="report-inline-checkout" className="scroll-mt-28">
              {!checkoutOpen ? (
                <div className="rounded-[32px] border border-[#d8e9df] bg-white p-6 shadow-[0_30px_90px_rgba(15,23,42,0.08)] sm:p-8">
                  <p className="text-xs font-semibold uppercase tracking-[0.24em] text-emerald-700">
                    Checkout inline
                  </p>
                  <h2 className="mt-3 text-3xl font-bold tracking-[-0.04em] text-slate-950 sm:text-4xl">
                    Pagamento no mesmo fluxo do relatorio
                  </h2>
                  <p className="mt-3 max-w-3xl text-sm leading-relaxed text-slate-600 sm:text-base">
                    Ao abrir esta etapa, seus dados da triagem entram no fechamento, o PIX aparece aqui e o dashboard so e liberado depois da confirmacao do pagamento.
                  </p>

                  <div className="mt-6 grid gap-4 md:grid-cols-3">
                    <div className="rounded-[24px] border border-zinc-100 bg-[#f8faf9] p-5">
                      <p className="text-sm font-bold text-slate-900">Plano ativo</p>
                      <p className="mt-2 text-slate-600">{selectedPlan?.title || selectedPlanId}</p>
                    </div>
                    <div className="rounded-[24px] border border-zinc-100 bg-[#f8faf9] p-5">
                      <p className="text-sm font-bold text-slate-900">Trilha ativa</p>
                      <p className="mt-2 text-slate-600">{selectedTrackCard.title}</p>
                      <p className="mt-2 text-xs font-semibold text-emerald-700">
                        {selectedTrackCard.potencyLabel}
                      </p>
                    </div>
                    <div className="rounded-[24px] border border-zinc-100 bg-[#f8faf9] p-5">
                      <p className="text-sm font-bold text-slate-900">Liberação do dashboard</p>
                      <p className="mt-2 text-slate-600">Somente apos confirmacao real do pagamento.</p>
                    </div>
                  </div>

                  <div className="mt-6">
                    <button
                      type="button"
                      onClick={openInlineCheckout}
                      className="inline-flex items-center justify-center rounded-full bg-emerald-600 px-6 py-3 text-sm font-bold text-white shadow-lg transition hover:bg-emerald-700"
                    >
                      Abrir checkout agora
                    </button>
                  </div>
                </div>
              ) : (
                <EmagrecimentoCheckoutExperience
                  mode="inline"
                  reportId={reportId}
                  triageId={vm.triageId || reportId}
                  defaultPlanId={selectedPlanId}
                  defaultTrilha={selectedTrilha}
                  defaultPrincipio={preferenciaPrincipioAtivo}
                  prefillProfile={{
                    name: vm.basics.name || vm.basics.firstName || '',
                    weightKg: vm.basics.weightKg,
                  }}
                  onSelectPlan={setSelectedPlanId}
                  onSelectTrack={setSelectedTrilha}
                />
              )}
            </section>

            <ReportHeroEmagrecimentoEnhanced vm={vm} reportId={reportId || undefined} />

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
            <ReportActionPlanGamified vm={vm} reportId={reportId || ''} />

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
          </div>

          <section className="py-12 sm:py-16 md:py-20 bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-900 text-white">
            <div className="container mx-auto px-4 sm:px-6 text-center">
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-3 sm:mb-4 px-2 text-white">
                Seu próximo passo está pronto
              </h2>
              <p className="text-base sm:text-lg md:text-xl text-emerald-50 mb-6 sm:mb-8 max-w-2xl mx-auto px-2">
                Escolha a trilha, confirme seus dados e siga com revisão médica obrigatória antes de qualquer prescrição.
              </p>
              <a
                href="#report-inline-checkout"
                onClick={openInlineCheckout}
                className="inline-block rounded-full px-6 sm:px-8 md:px-10 py-3 sm:py-3.5 md:py-4 text-sm sm:text-base md:text-lg font-bold text-emerald-800 bg-white shadow-2xl transition-all hover:scale-105 hover:shadow-white/50 w-full sm:w-auto max-w-xs sm:max-w-none"
              >
                Ir para o checkout inline →
              </a>
            </div>
          </section>

          <div className="container mx-auto px-4 sm:px-6 pb-8 sm:pb-10 md:pb-12 text-center">
            <a
              href={`/api/pdf/report?id=${reportId}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block px-5 sm:px-6 py-2.5 sm:py-3 bg-emerald-600 text-white rounded-full font-semibold text-sm sm:text-base hover:shadow-lg transition-all"
            >
              ⬇️ Baixar relatório em PDF
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
        const { deriveReport } = await import('@/lib/report/derive');
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
      .select(`
        *,
        triage_reports(status, sections)
      `)
      .eq('triage_id', resolvedId)
      .single();

    if (sessionError || !sessionRow) {
      return { props: { vm: null, reportId: id, error: 'Sessão não encontrada' } };
    }

    const reportRow = Array.isArray(sessionRow.triage_reports)
      ? sessionRow.triage_reports[0]
      : sessionRow.triage_reports;
    const patientSnapshot = sessionRow.profile_snapshot || {};
    const answers = sessionRow.answers || {};
    const triageSlug = sessionRow.triage_slug || 'emagrecimento';

    if (reportRow?.status === 'completed' && reportRow?.sections && typeof reportRow.sections === 'object') {
      const cached = reportRow.sections as ReportViewModel;
      if (cached?.id && cached?.basics && cached?.content) {
        (cached as any).answers = answers;
        return { props: { vm: cached, reportId: resolvedId } };
      }
    }
    
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

    const { deriveReport } = await import('@/lib/report/derive');
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
        triageSlug,
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
