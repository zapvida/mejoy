'use client';

import { useEffect, useRef } from "react";

import { PartnerCTAs } from "./PartnerCTAs";

import { normalizeBMI } from "@/lib/health/bmi";
import type { ReportViewModel } from "@/lib/report/derive";

type ReportHeroProps = {
  vm: ReportViewModel;
  onHeroVisible?: () => void;
};

export function ReportHero({ vm, onHeroVisible }: ReportHeroProps) {
  const sectionRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!sectionRef.current || !onHeroVisible) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          onHeroVisible();
        }
      },
      { threshold: 0.6 }
    );
    observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, [onHeroVisible]);

  return (
    <section
      ref={sectionRef}
      data-testid="report-hero"
      className={`relative mx-auto w-full max-w-5xl rounded-3xl bg-gradient-to-br ${vm.gradient} px-4 py-6 text-white shadow-2xl ring-1 ring-white/10 backdrop-blur-lg sm:px-6 sm:py-8 lg:px-8 lg:py-10`}
    >
      {/* Mobile Layout */}
      <div className="md:hidden space-y-6">
        <div className="text-center">
          <p className="text-xs uppercase tracking-[0.25em] text-white/70">Relatório personalizado</p>
          <h1 className="hero-title mt-2 text-balance text-2xl font-semibold leading-tight">
            {vm.greeting}
          </h1>
          <p className="hero-subtitle mt-3 text-pretty text-sm text-white/75">
            {/* TODO(backcompat-2025-10-23) - toneAdvice opcional */}
            {(vm as any).toneAdvice || vm.interpretation}
          </p>
          
          {/* Dados demográficos */}
          <div className="mt-4 rounded-xl bg-white/10 p-3 backdrop-blur-sm">
            <div className="text-sm text-white/80">
              {vm.basics.sex === 'M' ? 'Masculino' : vm.basics.sex === 'F' ? 'Feminino' : 'Outro'} • {vm.basics.age} anos • IMC {normalizeBMI(vm.basics.bmi)?.bmi.toFixed(1) ?? '—'}
            </div>
            <div className="text-xs text-white/60 mt-1">
              {vm.basics.bmiCategory}
            </div>
          </div>
        </div>

        {/* Score dinâmico */}
        <div className={`rounded-xl p-4 ${vm.palette.bg} border ${vm.palette.border}`}>
          <div className="flex items-center justify-between mb-2">
            <span className={`text-sm font-medium ${vm.palette.text}`}>
              {vm.icon} Seu momento atual
            </span>
            <span className={`text-lg font-bold ${vm.palette.accent}`}>
              {vm.score}/100
            </span>
          </div>
          <div className="h-3 w-full rounded-full bg-gray-200">
            <div 
              className={`h-3 rounded-full ${vm.palette.bar} transition-all duration-1000 ease-out`} 
              style={{ width: `${vm.score}%` }} 
            />
          </div>
          <div className={`mt-2 text-sm ${vm.palette.text}`}>
            {vm.interpretation}
          </div>
        </div>

        {/* CTAs no topo */}
        <PartnerCTAs />
      </div>

      {/* Desktop Layout */}
      <div className="hidden md:grid md:grid-cols-2 md:gap-8">
        <div className="space-y-6">
          <div className="text-center md:text-left">
            <p className="text-xs uppercase tracking-[0.25em] text-white/70">Relatório personalizado</p>
            <h1 className="mt-2 max-w-xl text-balance text-[clamp(28px,4vw,40px)] font-semibold leading-tight">
              {vm.greeting}
            </h1>
            <p className="mt-3 max-w-xl text-pretty text-[clamp(16px,2vw,20px)] text-white/75">
              {/* TODO(backcompat-2025-10-23) - toneAdvice opcional */}
              {(vm as any).toneAdvice || vm.interpretation}
            </p>
            
            {/* Dados demográficos */}
            <div className="mt-4 rounded-xl bg-white/10 p-4 backdrop-blur-sm">
              <div className="text-base text-white/80">
                {vm.basics.sex === 'M' ? 'Masculino' : vm.basics.sex === 'F' ? 'Feminino' : 'Outro'} • {vm.basics.age} anos • IMC {normalizeBMI(vm.basics.bmi)?.bmi.toFixed(1) ?? '—'}
              </div>
              <div className="text-sm text-white/60 mt-1">
                {vm.basics.bmiCategory}
              </div>
            </div>
          </div>

          {/* CTAs no topo (desktop) */}
          <PartnerCTAs />
        </div>

        <div className="space-y-5">
          {/* Score dinâmico */}
          <div className={`rounded-xl p-6 ${vm.palette.bg} border ${vm.palette.border}`}>
            <div className="flex items-center justify-between mb-3">
              <span className={`text-base font-medium ${vm.palette.text}`}>
                {vm.icon} Seu momento atual
              </span>
              <span className={`text-2xl font-bold ${vm.palette.accent}`}>
                {vm.score}/100
              </span>
            </div>
            <div className="h-4 w-full rounded-full bg-gray-200">
              <div 
                className={`h-4 rounded-full ${vm.palette.bar} transition-all duration-1000 ease-out`} 
                style={{ width: `${vm.score}%` }} 
              />
            </div>
            <div className={`mt-3 text-base ${vm.palette.text}`}>
              {vm.interpretation}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
