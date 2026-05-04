import Image from 'next/image';
import type { ReportViewModel } from '@/lib/report/derive';
import { RefinedCard } from '@/components/ui/RefinedCard';
import { RefinedButton } from '@/components/ui/RefinedButton';
import {
  buildZapVidaPlantaoUrl,
  emagrecimentoLegalNote,
  emagrecimentoPlans,
  planIdMapping,
} from '@/config/zapfarm/emagrecimento-plans';
import {
  estimateWeightLossRangeKg,
  getMedicationTrackCard,
} from '@/lib/emagrecimento/medicationCards';
import { getRecommendedPlan } from '@/lib/emagrecimento/planRecommendation';
import { TREATMENT_TRACKS_BY_ID } from '@/lib/emagrecimento/treatmentTracks';
import { trackFunnelEvent } from '@/lib/funnel/events-client';
import { buildEmagrecimentoReportWhatsappUrl } from '@/lib/emagrecimento/whatsappCta';
import type { EmagrecimentoTrilha } from '@/lib/emagrecimento/checkoutUrls';

interface Props {
  reportId: string;
  preferenciaPrincipioAtivo?: string;
  vm?: ReportViewModel;
  selectedPlanId: string;
  selectedTrilha: EmagrecimentoTrilha;
  onSelectPlan?: (planId: string) => void;
  onOpenInlineCheckout?: () => void;
}

const FRAME_TWO_IMAGES = [
  {
    src: '/images/emagrecimento/medvi/treatment-injetavel.webp',
    alt: 'Trilha injetavel',
    title: 'Maior potencia',
  },
  {
    src: '/images/emagrecimento/medvi/treatment-comprimidos.avif',
    alt: 'Trilha oral',
    title: 'Opcao em comprimido',
  },
  {
    src: '/images/emagrecimento/medvi/treatment-escolha.avif',
    alt: 'Escolha orientada',
    title: 'Escolha guiada',
  },
];

export function ReportCtasEmagrecimento({
  reportId,
  preferenciaPrincipioAtivo,
  vm,
  selectedPlanId,
  selectedTrilha,
  onSelectPlan,
  onOpenInlineCheckout,
}: Props) {
  const triageContextId = vm?.triageId || reportId;
  const classification = vm
    ? ((vm as any).classification as 'candidato_glp1' | 'nao_indicado' | 'contraindicado' | undefined)
    : undefined;
  const answers = vm ? (vm as any).answers || {} : {};
  const impactoVida = answers.impacto_vida;
  const comorbidades = Array.isArray(answers.comorbidades)
    ? answers.comorbidades.filter((item: string) => item !== 'nenhuma')
    : [];
  const recommendedPlanLegacy = classification
    ? getRecommendedPlan(classification, impactoVida, comorbidades)
    : 'trimestral';
  const recommendedPlanId =
    planIdMapping[recommendedPlanLegacy as keyof typeof planIdMapping] || 'programa-3m';

  const selectedTrackCard = getMedicationTrackCard(selectedTrilha);
  const selectedTrack = TREATMENT_TRACKS_BY_ID[selectedTrilha];
  const estimatedRange = estimateWeightLossRangeKg(
    vm?.basics.weightKg,
    selectedTrackCard.efficacyRangePercent
  );
  const preferenciaTexto =
    preferenciaPrincipioAtivo === 'tirzepatida'
      ? 'Tirzepatida'
      : preferenciaPrincipioAtivo === 'semaglutida'
        ? 'Semaglutida'
        : preferenciaPrincipioAtivo === 'contrave'
          ? 'Contrave'
          : 'Definicao clinica guiada';

  const handleSelectPlan = (planId: string) => {
    trackFunnelEvent('report_plan_selected', {
      report_id: reportId,
      triage_id: triageContextId,
      plano: planId,
      trilha: selectedTrilha,
      preferencia: preferenciaPrincipioAtivo,
    });
    onSelectPlan?.(planId);
    onOpenInlineCheckout?.();
  };

  return (
    <section className="rounded-[32px] border border-[#d7e3da] bg-white p-5 shadow-[0_30px_90px_rgba(15,23,42,0.08)] sm:p-6 md:p-8">
      <div className="mx-auto max-w-3xl text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-emerald-700">
          Frame 2
        </p>
        <h2 className="mt-3 text-3xl font-bold tracking-[-0.04em] text-slate-950 sm:text-4xl">
          Escolha o plano do seu fechamento
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-slate-600 sm:text-base">
          A trilha clinica ja esta definida acima. Aqui voce escolhe somente a duracao do acompanhamento e abre o checkout inline.
        </p>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-[0.96fr_1.04fr]">
        <div className="rounded-[28px] border border-emerald-100 bg-[#f6fbf7] p-5 sm:p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-700">
            Trilha selecionada
          </p>
          <h3 className="mt-2 text-2xl font-bold text-slate-950">{selectedTrackCard.title}</h3>
          <p className="mt-2 text-sm leading-relaxed text-slate-700 sm:text-base">
            {selectedTrackCard.plainLanguageFit}
          </p>

          <div className="mt-4 flex flex-wrap gap-2">
            <span className="rounded-full bg-white px-3 py-1.5 text-xs font-semibold text-emerald-800 shadow-sm">
              {selectedTrackCard.potencyLabel}
            </span>
            <span className="rounded-full bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-sm">
              {selectedTrackCard.certaintyLabel}
            </span>
            <span className="rounded-full bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-sm">
              Preferencia atual: {preferenciaTexto}
            </span>
          </div>

          <div className="mt-5 grid gap-3 sm:grid-cols-3">
            <div className="rounded-[22px] bg-white p-4 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-zinc-500">Eficacia media</p>
              <p className="mt-2 text-sm leading-relaxed text-slate-700">{selectedTrackCard.efficacyText}</p>
            </div>
            <div className="rounded-[22px] bg-white p-4 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-zinc-500">Traduzindo em peso</p>
              <p className="mt-2 text-sm leading-relaxed text-slate-700">
                {estimatedRange
                  ? `Faixa media observada: ${estimatedRange.label}.`
                  : selectedTrack?.estimate || 'A faixa real depende do seu ponto de partida e da resposta individual.'}
              </p>
            </div>
            <div className="rounded-[22px] bg-white p-4 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-zinc-500">Seguranca clinica</p>
              <p className="mt-2 text-sm leading-relaxed text-slate-700">{selectedTrackCard.safetyText}</p>
            </div>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          {FRAME_TWO_IMAGES.map((image) => (
            <div
              key={image.src}
              className="overflow-hidden rounded-[28px] border border-zinc-200 bg-[#f7f8f7] shadow-[0_18px_40px_rgba(15,23,42,0.05)]"
            >
              <div className="relative aspect-[0.88] overflow-hidden">
                <Image
                  src={image.src}
                  alt={image.alt}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 18vw"
                />
              </div>
              <div className="p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">
                  Opcoes teraputicas
                </p>
                <p className="mt-2 text-base font-bold text-slate-900">{image.title}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-8 grid gap-4 lg:grid-cols-3">
        {emagrecimentoPlans.map((plan) => {
          const recommended = plan.id === recommendedPlanId;
          const selected = plan.id === selectedPlanId;
          return (
            <RefinedCard
              key={plan.id}
              padding="lg"
              rounded="xl"
              hover
              className={`border ${
                selected
                  ? 'border-emerald-500 bg-[#f6fbf7] shadow-[0_20px_55px_rgba(5,150,105,0.12)]'
                  : recommended
                    ? 'border-emerald-300 bg-emerald-50/60'
                    : 'border-zinc-200 bg-white'
              }`}
            >
              <div className="flex flex-wrap gap-2">
                {recommended && (
                  <span className="rounded-full bg-emerald-600 px-3 py-1 text-xs font-bold text-white">
                    Recomendado
                  </span>
                )}
                {selected && (
                  <span className="rounded-full border border-emerald-300 bg-white px-3 py-1 text-xs font-bold text-emerald-700">
                    Selecionado
                  </span>
                )}
              </div>

              <h3 className="mt-4 text-2xl font-bold text-slate-900">{plan.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">{plan.subtitle}</p>

              <div className="mt-5">
                <p className="text-3xl font-bold text-slate-900">{plan.priceMain}</p>
                <p className="mt-1 text-xs text-slate-500">{plan.priceDetail}</p>
              </div>

              <div className="mt-4 rounded-2xl border border-zinc-100 bg-white/90 p-4 text-sm text-slate-700">
                <p>
                  <strong>Duracao:</strong> {plan.duration}
                </p>
                <p className="mt-2">
                  <strong>Trilha ativa:</strong> {selectedTrackCard.shortTitle}
                </p>
                <p className="mt-3 leading-relaxed text-slate-600">
                  {selected
                    ? 'Este e o plano ativo para abrir o checkout inline agora.'
                    : `Ao escolher este plano, o checkout abre na mesma pagina com ${plan.duration} de acompanhamento.`}
                </p>
              </div>

              <ul className="mt-5 space-y-2">
                {plan.bullets.slice(0, 4).map((feature) => (
                  <li key={feature} className="flex items-start gap-2 text-sm leading-relaxed text-slate-700">
                    <span className="mt-0.5 text-emerald-600">✓</span>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-6">
                <RefinedButton
                  onClick={() => handleSelectPlan(plan.id)}
                  fullWidth
                  className="rounded-full"
                  variant={selected || recommended ? 'primary' : 'secondary'}
                >
                  Escolher e seguir nesta pagina
                </RefinedButton>
              </div>
            </RefinedCard>
          );
        })}
      </div>

      <div className="mt-6 flex flex-col gap-4 rounded-[24px] border border-zinc-200 bg-zinc-50 px-4 py-4 text-sm leading-relaxed text-slate-600 md:flex-row md:items-center md:justify-between">
        <div className="max-w-2xl">
          {emagrecimentoLegalNote}
        </div>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <a
            href={buildEmagrecimentoReportWhatsappUrl({
              reportId,
              firstName: vm?.basics.firstName,
              triageSlug: 'emagrecimento',
            })}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() =>
              trackFunnelEvent('whatsapp_report_cta', {
                report_id: reportId,
                surface: 'report_plan_help',
              })
            }
            className="inline-flex items-center justify-center rounded-full border border-emerald-200 bg-white px-5 py-2.5 font-semibold text-emerald-800 transition hover:bg-emerald-50"
          >
            WhatsApp oficial
          </a>
          <a
            href={buildZapVidaPlantaoUrl('report_footer_support')}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() =>
              trackFunnelEvent('cta_clinical_handoff', {
                report_id: reportId,
                origin: 'report_footer_support',
              })
            }
            className="text-center text-sm font-semibold text-slate-700 underline underline-offset-2"
          >
            Se preferir, seguir direto para avaliacao clinica
          </a>
        </div>
      </div>
    </section>
  );
}
