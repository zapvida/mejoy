'use client';

import { useEffect, useMemo, useState } from 'react';
import { getRecommendedPlan } from '@/lib/emagrecimento/planRecommendation';
import { normalizeBMI } from '@/lib/health/bmi';
import type { ReportViewModel } from '@/lib/report/derive';

interface Props {
  vm: ReportViewModel;
  reportId?: string;
}

const PLAN_LABEL: Record<string, string> = {
  mensal: 'mensal',
  trimestral: 'trimestral',
  semestral: 'semestral',
};

function formatCountdown(totalSeconds: number) {
  const safeSeconds = Math.max(totalSeconds, 0);
  const minutes = Math.floor(safeSeconds / 60);
  const seconds = safeSeconds % 60;
  return `${minutes}:${String(seconds).padStart(2, '0')}`;
}

export function ReportHeroEmagrecimentoEnhanced({ vm }: Props) {
  const [secondsLeft, setSecondsLeft] = useState(4 * 60 + 16);
  const bmi = normalizeBMI(vm.basics.bmi, vm.basics.age);
  const answers = (vm as any).answers || {};
  const classification = (vm as any).classification as
    | 'candidato_glp1'
    | 'nao_indicado'
    | 'contraindicado'
    | undefined;
  const comorbidades = Array.isArray(answers.comorbidades)
    ? answers.comorbidades.filter((item: string) => item !== 'nenhuma')
    : [];
  const recommendedPlan = getRecommendedPlan(classification || 'nao_indicado', answers.impacto_vida, comorbidades);
  const goalWeight = Number(answers.peso_meta || answers.goal_weight || 0) || null;
  const currentWeight = vm.basics.weightKg || null;
  const goalText = goalWeight ? `${goalWeight} kg` : 'Meta definida';
  const metabolismText = classification === 'candidato_glp1' ? 'Elegível' : classification === 'contraindicado' ? 'Revisão prioritária' : 'Avaliação médica';
  const sexText = vm.basics.sex === 'M' ? 'Masculino' : vm.basics.sex === 'F' ? 'Feminino' : 'Perfil';

  useEffect(() => {
    const interval = window.setInterval(() => {
      setSecondsLeft(current => (current > 0 ? current - 1 : current));
    }, 1000);
    return () => window.clearInterval(interval);
  }, []);

  const synthesis = useMemo(() => {
    if (classification === 'contraindicado') {
      return 'Seu relatório mostra pontos que pedem avaliação médica mais próxima antes de qualquer programa com medicação.';
    }
    if (classification === 'candidato_glp1') {
      return 'Você já pode seguir para avaliação clínica do programa com boa compatibilidade preliminar para linha medicamentosa, quando indicada.';
    }
    return 'Seu perfil merece uma leitura clínica cuidadosa para definir a melhor conduta e o ritmo mais seguro de acompanhamento.';
  }, [classification]);

  return (
    <section className="border-b border-slate-200 bg-white">
      <div className="mx-auto max-w-5xl px-4 pb-12 pt-10 sm:px-6 sm:pb-16 sm:pt-12">
        <div className="text-center">
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400">
            Aprovação preliminar ativa por
            <span className="ml-2 text-[#7da06f]">{formatCountdown(secondsLeft)}</span>
          </p>
          <h1 className="mx-auto mt-5 max-w-4xl text-[clamp(2rem,5vw,4rem)] font-semibold tracking-[-0.06em] text-[#2f2925]">
            {vm.basics.firstName}, seu plano de acompanhamento para emagrecimento está em
            <span className="text-[#4d6d56]"> aprovação preliminar.</span>
          </h1>
        </div>

        <div className="mt-8 grid gap-3 sm:grid-cols-3">
          <div className="rounded-[1.7rem] border border-slate-200 bg-[#fbfaf7] px-5 py-4 text-center">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">Meta</p>
            <p className="mt-2 text-2xl font-semibold tracking-[-0.04em] text-slate-900">{goalText}</p>
          </div>
          <div className="rounded-[1.7rem] border border-slate-200 bg-[#fbfaf7] px-5 py-4 text-center">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">Leitura clínica</p>
            <p className="mt-2 text-2xl font-semibold tracking-[-0.04em] text-slate-900">{metabolismText}</p>
          </div>
          <div className="rounded-[1.7rem] border border-slate-200 bg-[#fbfaf7] px-5 py-4 text-center">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">Perfil</p>
            <p className="mt-2 text-2xl font-semibold tracking-[-0.04em] text-slate-900">{sexText}</p>
          </div>
        </div>

        <div className="mt-8 grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div>
            <p className="text-lg leading-8 text-slate-700">
              Você recebe uma leitura inicial construída a partir da sua triagem, com
              <strong className="text-slate-900"> avaliação clínica individual</strong>, direção terapêutica coerente
              e continuidade organizada pelo canal oficial da MeJoy.
            </p>
            <p className="mt-4 text-xl font-semibold leading-8 tracking-[-0.03em] text-[#2f2925]">
              {synthesis}
            </p>
            <div className="mt-6 rounded-[2rem] border border-[#d9e8d3] bg-[#f5faf3] p-5">
              <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#4d6d56]">Nossa recomendação inicial</p>
              <p className="mt-3 text-2xl font-semibold tracking-[-0.04em] text-[#2f2925]">
                Programa {PLAN_LABEL[recommendedPlan] || 'personalizado'}
              </p>
              <p className="mt-3 text-sm leading-7 text-slate-600">
                O plano sugerido considera IMC, impacto no dia a dia, histórico clínico e preferência terapêutica,
                sempre com revisão obrigatória do médico antes de qualquer prescrição.
              </p>
            </div>
          </div>

          <div className="rounded-[2.3rem] border border-slate-200 bg-[#fbfaf7] p-5 shadow-[0_20px_60px_rgba(15,23,42,0.06)] sm:p-6">
            <div className="flex items-start justify-between gap-4">
              <div className="rounded-full border border-slate-200 bg-white px-4 py-2 text-center">
                <p className="text-2xl font-semibold tracking-[-0.04em] text-slate-900">
                  {currentWeight ? `${currentWeight} kg` : 'Hoje'}
                </p>
                <p className="text-xs uppercase tracking-[0.16em] text-slate-500">Agora</p>
              </div>
              <div className="rounded-[1.5rem] border border-[#8cd11e] bg-white px-4 py-3 text-center shadow-sm">
                <p className="text-2xl font-semibold tracking-[-0.04em] text-slate-900">{goalText}</p>
                <p className="text-xs uppercase tracking-[0.16em] text-slate-500">Objetivo</p>
              </div>
            </div>

            <div className="mt-6 overflow-hidden rounded-[1.8rem] border border-slate-100 bg-white px-4 py-5">
              <svg viewBox="0 0 360 180" className="h-auto w-full" aria-hidden="true">
                <defs>
                  <linearGradient id="mejoyReportFill" x1="0%" x2="0%" y1="0%" y2="100%">
                    <stop offset="0%" stopColor="#c9ec8b" stopOpacity="0.55" />
                    <stop offset="100%" stopColor="#c9ec8b" stopOpacity="0.05" />
                  </linearGradient>
                </defs>
                <line x1="38" y1="28" x2="38" y2="150" stroke="#d8e0da" strokeDasharray="4 6" />
                <line x1="180" y1="28" x2="180" y2="150" stroke="#d8e0da" strokeDasharray="4 6" />
                <line x1="320" y1="28" x2="320" y2="150" stroke="#d8e0da" strokeDasharray="4 6" />
                <line x1="38" y1="72" x2="340" y2="72" stroke="#eef2ef" />
                <line x1="38" y1="124" x2="340" y2="124" stroke="#eef2ef" />
                <path
                  d="M38 36 C88 40 120 58 180 82 C220 98 268 110 320 118 L320 150 L38 150 Z"
                  fill="url(#mejoyReportFill)"
                />
                <path
                  d="M38 36 C88 40 120 58 180 82 C220 98 268 110 320 118"
                  fill="none"
                  stroke="#8cd11e"
                  strokeWidth="5"
                  strokeLinecap="round"
                />
              </svg>

              <div className="mt-1 grid grid-cols-3 text-center text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                <span>Hoje</span>
                <span>8 semanas</span>
                <span>4 meses</span>
              </div>
            </div>

            <div className="mt-5 rounded-[1.8rem] border border-slate-200 bg-white p-5">
              <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#4d6d56]">Resumo biométrico</p>
              <div className="mt-3 grid gap-3 sm:grid-cols-2">
                <div>
                  <p className="text-xs uppercase tracking-[0.16em] text-slate-500">IMC</p>
                  <p className="mt-1 text-lg font-semibold text-slate-900">
                    {bmi?.bmi?.toFixed(1) || vm.basics.bmi.toFixed(1)}
                  </p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.16em] text-slate-500">Classificação</p>
                  <p className="mt-1 text-lg font-semibold text-slate-900">{bmi?.classification || vm.basics.bmiCategory}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
