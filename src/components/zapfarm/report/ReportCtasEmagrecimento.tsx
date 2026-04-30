import { useState } from 'react';
import { getRecommendedPlan } from '@/lib/emagrecimento/planRecommendation';
import type { ReportViewModel } from '@/lib/report/derive';
import { RefinedCard } from '@/components/ui/RefinedCard';
import { RefinedButton } from '@/components/ui/RefinedButton';
import { buildZapVidaPlantaoUrl, emagrecimentoPlans, emagrecimentoLegalNote, planIdMapping } from '@/config/zapfarm/emagrecimento-plans';
import { trackFunnelEvent } from '@/lib/funnel/events-client';
import { createClinicalHandoff } from '@/lib/handoff/client';
import { buildEmagrecimentoReportWhatsappUrl } from '@/lib/emagrecimento/whatsappCta';
import { trilhaFromPreferencia } from '@/lib/emagrecimento/checkoutUrls';

interface Props {
  reportId: string;
  preferenciaPrincipioAtivo?: string;
  vm?: ReportViewModel;
}

export function ReportCtasEmagrecimento({ reportId, preferenciaPrincipioAtivo, vm }: Props) {
  const [handoffLoading, setHandoffLoading] = useState(false);
  const [handoffError, setHandoffError] = useState<string | null>(null);
  const triageContextId = vm?.triageId || reportId;

  // Normalizar preferência
  const principio =
    preferenciaPrincipioAtivo === 'tirzepatida'
      ? 'tirzepatida'
      : preferenciaPrincipioAtivo === 'semaglutida'
        ? 'semaglutida'
        : preferenciaPrincipioAtivo === 'contrave'
          ? 'contrave'
          : undefined;
  
  const preferenciaTexto =
    principio === 'tirzepatida'
      ? 'Tirzepatida'
      : principio === 'semaglutida'
        ? 'Semaglutida'
        : principio === 'contrave'
          ? 'Contrave®'
          : undefined;

  const trilhaCheckout = trilhaFromPreferencia(preferenciaPrincipioAtivo);
  
  // Determinar plano recomendado inteligente
  const classification = vm ? (vm as any).classification as 'candidato_glp1' | 'nao_indicado' | 'contraindicado' | undefined : undefined;
  const answers = vm ? (vm as any).answers || {} : {};
  const impactoVida = answers.impacto_vida;
  const comorbidades = Array.isArray(answers.comorbidades)
    ? answers.comorbidades.filter((c: string) => c !== 'nenhuma')
    : [];
  
  // Obter plano recomendado (retorna: 'mensal'|'trimestral'|'semestral')
  const recommendedPlanIdOld = classification 
    ? getRecommendedPlan(classification, impactoVida, comorbidades)
    : 'trimestral';
  
  // Mapear para ID do plano (programa-1m, programa-3m, programa-6m)
  const recommendedPlanId = planIdMapping[recommendedPlanIdOld as keyof typeof planIdMapping] || 'programa-3m';
  
  // Usar planos centralizados
  const plans = emagrecimentoPlans.map((plan) => ({
    id: plan.id,
    name: plan.title,
    badge: plan.badge,
    price: plan.priceMain,
    priceDetail: plan.priceDetail,
    features: plan.bullets,
    recommended: plan.recommended,
    highlight: plan.highlight,
  }));

  const handleClinicalHandoff = async () => {
    if (handoffLoading) return;
    setHandoffLoading(true);
    setHandoffError(null);
    trackFunnelEvent('cta_clinical_handoff', {
      report_id: reportId,
      origin: 'report_primary'
    });

    try {
      const data = await createClinicalHandoff({
        triageId: triageContextId,
        reportId,
        sourceJourney: 'emagrecimento.report',
        sourceOrigin: 'report_primary'
      });

      trackFunnelEvent('handoff_created', {
        report_id: reportId
      });
      trackFunnelEvent('handoff_opened', {
        report_id: reportId
      });

      window.location.href = data.redirectUrl;
    } catch (error: any) {
      trackFunnelEvent('handoff_failed', {
        report_id: reportId,
        origin: 'report_primary',
        surface: 'report_ctas'
      });
      setHandoffError(error?.message || 'Falha ao iniciar avaliação clínica.');
      setHandoffLoading(false);
    }
  };

  return (
    <section className="bg-white rounded-xl sm:rounded-2xl shadow-xl p-5 sm:p-6 md:p-8 border border-emerald-100">
      <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3 sm:mb-4 text-center px-2">
        Escolha como deseja começar o seu programa
      </h2>
      <p className="text-sm sm:text-base text-gray-600 mb-4 text-center px-2">
        O valor do programa fica claro aqui, com continuidade médica e suporte pelo canal oficial após a compra.
      </p>

      <div className="mb-6 rounded-xl border border-emerald-200 bg-gradient-to-r from-emerald-50 to-teal-50 p-4 sm:p-5">
        <h3 className="text-base sm:text-lg font-bold text-gray-900 text-center">
          Precisa de ajuda antes de pagar?
        </h3>
        <p className="mt-2 text-xs sm:text-sm text-gray-700 text-center">
          Se quiser, nosso time pode revisar seu contexto com você antes do fechamento. A decisão médica final acontece apenas na consulta.
        </p>
        <div className="mt-4 flex flex-col gap-3">
          <button
            type="button"
            onClick={handleClinicalHandoff}
            disabled={handoffLoading}
            className="inline-flex items-center justify-center rounded-full bg-slate-900 px-5 py-3 text-sm sm:text-base font-bold text-white shadow-lg transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {handoffLoading ? 'Conectando com o ZapVida...' : 'Continuar avaliação clínica →'}
          </button>
          <a
            href={buildEmagrecimentoReportWhatsappUrl({
              reportId,
              firstName: vm?.basics?.firstName,
              triageSlug: 'emagrecimento',
            })}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() =>
              trackFunnelEvent('whatsapp_report_cta', {
                report_id: reportId,
                surface: 'report_plan_zapvida_card',
              })
            }
            className="inline-flex items-center justify-center rounded-full border border-emerald-200 bg-white px-5 py-3 text-sm sm:text-base font-bold text-emerald-800 shadow-sm transition hover:bg-emerald-50"
          >
            WhatsApp oficial — falar com o time →
          </a>
          {handoffError && (
            <div className="space-y-2 text-center">
              <p className="text-xs sm:text-sm text-red-600">{handoffError}</p>
              <a
                href={buildZapVidaPlantaoUrl('report_primary_fallback')}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() =>
                  trackFunnelEvent('clinical_payment_started', {
                    report_id: reportId,
                    source: 'report_primary_fallback'
                  })
                }
                className="inline-block text-xs sm:text-sm font-semibold text-emerald-700 underline underline-offset-2"
              >
                Abrir ZapVida direto
              </a>
            </div>
          )}
        </div>
      </div>

      <a
        href={buildZapVidaPlantaoUrl('report_primary_direct')}
        target="_blank"
        rel="noopener noreferrer"
        className="mb-6 flex items-center justify-center gap-2 text-sm text-emerald-700 hover:text-emerald-800 font-semibold underline underline-offset-2"
        onClick={() => trackFunnelEvent('clinical_payment_started', { report_id: reportId, entry: 'direct_plantao' })}
      >
        👨‍⚕️ Falar com um médico antes de escolher
      </a>

      {preferenciaTexto && (
        <div className="mb-6 p-4 bg-emerald-50 rounded-xl border border-emerald-200 text-center">
          <p className="text-sm sm:text-base text-gray-700">
            <strong>Sua preferência declarada:</strong> {preferenciaTexto} 
            <span className="text-gray-500 text-xs sm:text-sm block mt-1">
              (o médico irá avaliar se essa é a melhor opção para o seu caso)
            </span>
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {plans.map((plan) => {
          const isRecommended = plan.id === recommendedPlanId || plan.recommended;
          return (
          <RefinedCard
            key={plan.id}
            variant={isRecommended ? "elevated" : "default"}
            padding="lg"
            rounded="xl"
            hover
            className={`${
              isRecommended
                ? 'border-emerald-300 bg-gradient-to-br from-emerald-50 to-teal-50/70 sm:scale-105'
                : ''
            }`}
          >
            <div className="flex flex-wrap gap-2 mb-3 sm:mb-4">
              {isRecommended && (
                <div className="inline-block px-2 sm:px-3 py-1 rounded-full bg-emerald-600 text-white text-xs sm:text-sm font-bold">
                  ⭐ Recomendado para você
                </div>
              )}
              {plan.badge && !isRecommended && (
                <div className="inline-block px-2 sm:px-3 py-1 rounded-full bg-slate-900 text-white text-xs sm:text-sm font-bold">
                  {plan.badge}
                </div>
              )}
              {preferenciaTexto && (
                <div className="inline-block px-2 sm:px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs sm:text-sm font-semibold border border-emerald-300">
                  Preferência: {preferenciaTexto}
                </div>
              )}
            </div>
            <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 mb-2 leading-tight">{plan.name}</h3>
            <div className="mb-3 sm:mb-4">
              <div className="text-2xl sm:text-3xl font-bold text-emerald-700 mb-1">{plan.price}</div>
              {plan.priceDetail && (
                <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">{plan.priceDetail}</p>
              )}
            </div>
            <ul className="space-y-1.5 sm:space-y-2 mb-4 sm:mb-6">
              {plan.features.map((feature, index) => (
                <li key={index} className="flex items-start gap-2 text-xs sm:text-sm text-gray-700 leading-relaxed">
                  <span className="text-emerald-600 mt-0.5 flex-shrink-0">✓</span>
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
            <RefinedButton
              variant={isRecommended ? "primary" : "secondary"}
              size="md"
              fullWidth
              asChild
            >
              <a
                href={`/emagrecimento/checkout?plano=${plan.id}&reportId=${reportId}&trilha=${trilhaCheckout}${principio ? `&principio=${principio}` : ''}`}
              >
                Iniciar com este plano →
              </a>
            </RefinedButton>
          </RefinedCard>
        );
        })}
      </div>

      <div className="mt-6 sm:mt-8 p-4 sm:p-6 bg-emerald-50 rounded-lg sm:rounded-xl border border-emerald-200">
        <p className="text-xs sm:text-sm text-gray-700 text-center leading-relaxed">
          {emagrecimentoLegalNote}
        </p>
      </div>

      <div className="mt-4 text-center">
        <a
          href={buildZapVidaPlantaoUrl('report_footer_direct')}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-sm text-emerald-700 hover:text-emerald-800 font-medium"
        >
          👨‍⚕️ Dúvidas? Fale com um médico no plantão ZapVida
        </a>
      </div>
    </section>
  );
}
