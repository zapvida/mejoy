'use client';

import Image from 'next/image';
import type { ReportViewModel } from '@/lib/report/derive';
import { getRecommendedPlan } from '@/lib/emagrecimento/planRecommendation';
import { planIdMapping } from '@/config/zapfarm/emagrecimento-plans';
import { getResultsInvestmentBand } from '@/lib/emagrecimento/launchPricing';
import {
  trilhaFromPreferencia,
  type EmagrecimentoTrilha,
} from '@/lib/emagrecimento/checkoutUrls';
import {
  estimateWeightLossRangeKg,
  getMedicationTrackCard,
  medicationTrackCards,
} from '@/lib/emagrecimento/medicationCards';
import { buildEmagrecimentoReportWhatsappUrl } from '@/lib/emagrecimento/whatsappCta';
import { trackFunnelEvent } from '@/lib/funnel/events-client';
import { cn } from '@/lib/utils';

interface Props {
  vm: ReportViewModel;
  reportId: string;
  selectedTrilha: EmagrecimentoTrilha;
  onSelectTrack?: (trilha: EmagrecimentoTrilha) => void;
  onOpenInlineCheckout?: () => void;
}

const NEXT_STEPS = [
  'Voce revisa a trilha recomendada e segue com o pagamento sem sair desta pagina.',
  'O time oficial acompanha a continuidade por WhatsApp.',
  'A avaliacao medica confirma ou ajusta a conduta; nada e prescrito automaticamente.',
];

function getEligibilityCopy(
  classification: string | undefined
): { title: string; body: string; tone: string } {
  switch (classification) {
    case 'candidato_glp1':
      return {
        title: 'Elegibilidade preliminar favoravel',
        body: 'Sua triagem sugere continuidade para avaliacao medica com programa e possivel medicacao, sempre confirmada pelo profissional na consulta.',
        tone: 'border-emerald-200 bg-emerald-50 text-emerald-900',
      };
    case 'contraindicado':
      return {
        title: 'Avaliacao prioritaria antes de qualquer prescricao',
        body: 'Algumas respostas exigem revisao medica cuidadosa antes de qualquer programa com medicacao. O fechamento continua disponivel, mas a decisao clinica vem primeiro.',
        tone: 'border-amber-200 bg-amber-50 text-amber-950',
      };
    default:
      return {
        title: 'Seu caso segue para definicao medica',
        body: 'O relatorio organizou a melhor direcao inicial, mas a trilha final e sempre confirmada na consulta.',
        tone: 'border-slate-200 bg-slate-50 text-slate-900',
      };
  }
}

export function ReportDecisionFold({
  vm,
  reportId,
  selectedTrilha,
  onSelectTrack,
  onOpenInlineCheckout,
}: Props) {
  const answers = (vm as any).answers || {};
  const classification = (vm as any).classification as
    | 'candidato_glp1'
    | 'nao_indicado'
    | 'contraindicado'
    | undefined;
  const preferencia = answers.preferencia_principio_ativo as string | undefined;
  const impactoVida = answers.impacto_vida;
  const comorbidades = Array.isArray(answers.comorbidades)
    ? answers.comorbidades.filter((item: string) => item !== 'nenhuma')
    : [];
  const recommendedLegacyPlan = classification
    ? getRecommendedPlan(classification, impactoVida, comorbidades)
    : 'trimestral';
  const recommendedPlan =
    planIdMapping[recommendedLegacyPlan as keyof typeof planIdMapping] || 'programa-3m';
  const investment = getResultsInvestmentBand();
  const eligibility = getEligibilityCopy(classification);
  const preferredTrack = trilhaFromPreferencia(preferencia);
  const selectedTrackCard = getMedicationTrackCard(selectedTrilha);
  const estimatedRange = estimateWeightLossRangeKg(
    vm.basics.weightKg,
    selectedTrackCard.efficacyRangePercent
  );

  const recommendation =
    preferencia === 'tirzepatida'
      ? 'A preferencia declarada aponta para a linha com tirzepatida, sujeito a confirmacao medica.'
      : preferencia === 'semaglutida'
        ? 'A preferencia declarada aponta para a linha com semaglutida, sujeito a confirmacao medica.'
        : preferencia === 'contrave'
          ? 'A preferencia declarada aponta para a linha com Contrave, sujeito a confirmacao medica.'
          : 'Seu relatorio sugere manter a decisao orientada pela consulta, com fechamento do programa ja pronto.';

  const handleSelectTrack = (trilha: EmagrecimentoTrilha) => {
    trackFunnelEvent('trilha_selected', {
      report_id: reportId,
      triage_id: vm.triageId || reportId,
      trilha,
    });
    onSelectTrack?.(trilha);
  };

  return (
    <section className="container mx-auto px-4 sm:px-6 pt-4 pb-4" aria-label="Decisao do programa">
      <div className="overflow-hidden rounded-[32px] border border-[#d8e9df] bg-white shadow-[0_30px_90px_rgba(15,23,42,0.08)]">
        <div className="grid gap-0 lg:grid-cols-[1.15fr_0.85fr]">
          <div className="p-6 sm:p-8 lg:p-10">
            <div className="inline-flex items-center gap-2 rounded-full bg-[#f7efe9] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-amber-950">
              Relatorio pos-triagem
            </div>

            <h1 className="mt-4 max-w-3xl text-3xl font-bold tracking-[-0.04em] text-slate-950 sm:text-4xl lg:text-[3.2rem] lg:leading-[1.02]">
              Seu programa esta pronto para fechar aqui, na mesma pagina
            </h1>

            <p className="mt-4 max-w-2xl text-base leading-relaxed text-slate-600 sm:text-lg">
              Elegibilidade, recomendacao, plano sugerido e checkout ficam alinhados no mesmo fluxo. O dashboard da Me Joy so libera depois da confirmacao do pagamento.
            </p>

            <div className={cn('mt-6 rounded-[28px] border p-5', eligibility.tone)}>
              <p className="text-xs font-semibold uppercase tracking-[0.18em]">Leitura do relatorio</p>
              <h2 className="mt-2 text-xl font-bold">{eligibility.title}</h2>
              <p className="mt-2 text-sm leading-relaxed sm:text-base">{eligibility.body}</p>
            </div>

            <div className="mt-6 grid gap-4 md:grid-cols-2">
              <div className="rounded-[24px] border border-zinc-100 bg-[#f8faf9] p-5">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">
                  Recomendacao principal
                </p>
                <p className="mt-2 text-sm leading-relaxed text-slate-700 sm:text-base">
                  {recommendation}
                </p>
              </div>
              <div className="rounded-[24px] border border-zinc-100 bg-[#f8faf9] p-5">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">
                  Faixa de investimento
                </p>
                <p className="mt-2 text-sm leading-relaxed text-slate-700 sm:text-base">{investment}</p>
                <p className="mt-3 text-xs font-semibold text-emerald-700">
                  Plano-base sugerido: {recommendedPlan.replace('programa-', '').replace('m', ' meses')}
                </p>
              </div>
            </div>

            <div className="mt-6">
              <div className="mb-3 flex items-center justify-between gap-3">
                <p className="text-sm font-semibold text-slate-900">Escolha a trilha de fechamento</p>
                <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                  Preferencia atual: {medicationTrackCards.find((track) => track.id === preferredTrack)?.title || 'Clinica'}
                </span>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                {medicationTrackCards.map((track) => {
                  const selected = selectedTrilha === track.id;
                  const range = estimateWeightLossRangeKg(vm.basics.weightKg, track.efficacyRangePercent);
                  return (
                    <button
                      key={track.id}
                      type="button"
                      onClick={() => handleSelectTrack(track.id)}
                      className={cn(
                        'rounded-[22px] border p-4 text-left transition-all',
                        selected
                          ? 'border-emerald-500 bg-emerald-50 shadow-[0_12px_35px_rgba(5,150,105,0.12)]'
                          : 'border-zinc-200 bg-white hover:border-emerald-300'
                      )}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="text-sm font-bold text-slate-900">{track.title}</p>
                          <p className="mt-1 text-xs leading-relaxed text-slate-600">{track.subtitle}</p>
                        </div>
                        <span className="rounded-full bg-white/80 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-emerald-700">
                          {track.potencyLabel}
                        </span>
                      </div>
                      <div className="mt-3 grid gap-2 text-xs text-slate-700">
                        <div className="rounded-2xl bg-white/70 p-3">
                          <p className="font-semibold text-slate-900">O que costuma entregar</p>
                          <p className="mt-1 leading-relaxed">{track.efficacyText}</p>
                        </div>
                        <div className="grid gap-2 sm:grid-cols-2">
                          <div className="rounded-2xl bg-white/70 p-3">
                            <p className="font-semibold text-slate-900">Grau de certeza</p>
                            <p className="mt-1 leading-relaxed">{track.certaintyLabel}</p>
                          </div>
                          <div className="rounded-2xl bg-white/70 p-3">
                            <p className="font-semibold text-slate-900">Quanto isso pode significar</p>
                            <p className="mt-1 leading-relaxed">
                              {range ? range.label : 'A faixa real depende da dose, adesao e resposta individual.'}
                            </p>
                          </div>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="mt-6 rounded-[28px] border border-emerald-100 bg-[linear-gradient(180deg,#f7fbf8_0%,#eef8f2_100%)] p-5">
              <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-700">
                    Leitura inteligente da trilha selecionada
                  </p>
                  <h3 className="mt-2 text-2xl font-bold text-slate-950">{selectedTrackCard.title}</h3>
                  <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-700 sm:text-base">
                    {selectedTrackCard.plainLanguageFit}
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <span className="rounded-full bg-white px-3 py-1.5 text-xs font-semibold text-emerald-800 shadow-sm">
                    {selectedTrackCard.potencyLabel}
                  </span>
                  <span className="rounded-full bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-sm">
                    {selectedTrackCard.certaintyLabel}
                  </span>
                </div>
              </div>

              <div className="mt-4 grid gap-3 md:grid-cols-3">
                <div className="rounded-[22px] bg-white p-4 shadow-sm">
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-zinc-500">Perda media de peso</p>
                  <p className="mt-2 text-sm leading-relaxed text-slate-700">{selectedTrackCard.efficacyText}</p>
                </div>
                <div className="rounded-[22px] bg-white p-4 shadow-sm">
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-zinc-500">Traduzindo para o seu caso</p>
                  <p className="mt-2 text-sm leading-relaxed text-slate-700">
                    {estimatedRange
                      ? `Se o seu peso atual for a referencia usada no relatorio, essa faixa media pode representar ${estimatedRange.label}.`
                      : 'Quando temos peso, mostramos aqui uma traducao em quilos. Ainda assim, isso nunca e promessa individual.'}
                  </p>
                </div>
                <div className="rounded-[22px] bg-white p-4 shadow-sm">
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-zinc-500">Seguranca clinica</p>
                  <p className="mt-2 text-sm leading-relaxed text-slate-700">{selectedTrackCard.safetyText}</p>
                </div>
              </div>

              <p className="mt-4 text-xs leading-relaxed text-slate-500">
                Faixas baseadas em medias de estudos pivotais com tratamento + orientacao de estilo de vida. Resultado individual varia bastante por adesao, dose, tolerancia e contexto clinico.
              </p>
            </div>

            <div className="mt-6 grid gap-4 md:grid-cols-[1fr_auto] md:items-center">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">
                  Proximos passos
                </p>
                <ol className="mt-3 space-y-2 text-sm leading-relaxed text-slate-700">
                  {NEXT_STEPS.map((step) => (
                    <li key={step} className="flex gap-3">
                      <span className="mt-0.5 inline-flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-emerald-600 text-[11px] font-bold text-white">
                        ✓
                      </span>
                      <span>{step}</span>
                    </li>
                  ))}
                </ol>
              </div>

              <div className="flex flex-col gap-3 md:min-w-[260px]">
                <button
                  type="button"
                  onClick={onOpenInlineCheckout}
                  className="inline-flex items-center justify-center rounded-full bg-emerald-600 px-6 py-3 text-sm font-bold text-white shadow-lg transition hover:bg-emerald-700"
                >
                  Continuar nesta pagina
                </button>
                <a
                  href={buildEmagrecimentoReportWhatsappUrl({
                    reportId,
                    firstName: vm.basics.firstName,
                    triageSlug: 'emagrecimento',
                  })}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() =>
                    trackFunnelEvent('whatsapp_report_cta', {
                      report_id: reportId,
                      surface: 'decision_fold',
                    })
                  }
                  className="inline-flex items-center justify-center rounded-full border border-emerald-200 bg-white px-6 py-3 text-sm font-bold text-emerald-800 transition hover:bg-emerald-50"
                >
                  WhatsApp oficial
                </a>
              </div>
            </div>
          </div>

          <div className="relative min-h-[320px] overflow-hidden border-t border-[#d8e9df] bg-[linear-gradient(180deg,#ecf7ef_0%,#dff1e5_48%,#f7fbf8_100%)] lg:min-h-full lg:border-l lg:border-t-0">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(16,185,129,0.22),transparent_42%),radial-gradient(circle_at_bottom_right,rgba(15,23,42,0.08),transparent_38%)]" />
            <div className="relative flex h-full flex-col justify-between p-6 sm:p-8">
              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-[28px] bg-white p-3 shadow-[0_25px_50px_rgba(15,23,42,0.10)]">
                  <div className="relative aspect-[0.92] overflow-hidden rounded-[22px]">
                    <Image
                      src="/images/emagrecimento/medvi/hero-main.webp"
                      alt="Programa Me Joy"
                      fill
                      className="object-cover"
                      sizes="(max-width: 1024px) 50vw, 26vw"
                      priority
                    />
                  </div>
                </div>
                <div className="mt-8 rounded-[28px] bg-white p-3 shadow-[0_25px_50px_rgba(15,23,42,0.10)]">
                  <div className="relative aspect-[0.78] overflow-hidden rounded-[22px]">
                    <Image
                      src="/images/emagrecimento/medvi/hero-secondary.webp"
                      alt="Suporte do programa"
                      fill
                      className="object-cover"
                      sizes="(max-width: 1024px) 50vw, 22vw"
                    />
                  </div>
                </div>
              </div>

              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <div className="rounded-[24px] bg-white p-4 shadow-[0_15px_35px_rgba(15,23,42,0.08)]">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">
                    Frame 1
                  </p>
                  <p className="mt-2 text-base font-bold text-slate-900">
                    Decisao clinica + fechamento na mesma estrutura
                  </p>
                </div>
                <div className="rounded-[24px] bg-white p-4 shadow-[0_15px_35px_rgba(15,23,42,0.08)]">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">
                    Frame 2
                  </p>
                  <p className="mt-2 text-base font-bold text-slate-900">
                    Checkout inline com redirecionamento so apos o pagamento
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
