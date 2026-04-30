// src/components/report/ReportHeroEnhanced.tsx
// Hero section melhorado com elementos interativos

'use client';

import { useEffect, useRef, useState } from 'react';
import { ScoreCard } from './interactive/ScoreCard';
import { normalizeBMI } from '@/lib/health/bmi';
import type { ReportViewModel } from '@/lib/report/derive';

type ReportHeroEnhancedProps = {
  vm: ReportViewModel;
  onHeroVisible?: () => void;
};

export function ReportHeroEnhanced({ vm, onHeroVisible }: ReportHeroEnhancedProps) {
  const sectionRef = useRef<HTMLElement | null>(null);
  const [isVisible, setIsVisible] = useState(true); // Sempre visível inicialmente

  useEffect(() => {
    // Sempre mostrar o hero, sem esperar intersection observer
    setIsVisible(true);
    
    if (onHeroVisible) {
      // Chamar callback imediatamente
      onHeroVisible();
    }
    
    // Opcional: ainda observar para analytics, mas não para visibilidade
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

  // Determinar cor baseada no score
  const getScoreColor = (score: number): 'green' | 'blue' | 'purple' | 'orange' | 'red' => {
    if (score >= 80) return 'green';
    if (score >= 60) return 'blue';
    if (score >= 40) return 'purple';
    if (score >= 20) return 'orange';
    return 'red';
  };

  return (
    <section
      ref={sectionRef}
      data-testid="report-hero-enhanced"
      className={`
        relative mx-auto w-full max-w-6xl rounded-3xl 
        bg-gradient-to-br ${vm.gradient} 
        px-4 py-8 text-white shadow-2xl ring-1 ring-white/10 
        backdrop-blur-lg overflow-hidden
        transition-all duration-1000 ease-out
        opacity-100 scale-100
        sm:px-6 sm:py-10 lg:px-8 lg:py-12
      `}
    >
      {/* Efeito de partículas de fundo */}
      <div className="absolute inset-0 opacity-10">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-white rounded-full animate-pulse"
            style={{
              left: `${(i * 37) % 100}%`,
              top: `${(i * 23 + 11) % 100}%`,
              animationDelay: `${((i * 17) % 20) / 10}s`,
              animationDuration: `${2 + (((i * 29) % 20) / 10)}s`,
            }}
          />
        ))}
      </div>

      {/* Conteúdo */}
      <div className="relative z-10">
        {/* Mobile Layout */}
        <div className="md:hidden space-y-6">
          <div className="text-center">
            <p className="text-xs uppercase tracking-[0.25em] text-white/70 mb-2">
              Relatório Personalizado
            </p>
            <h1 className="hero-title mt-2 text-balance text-3xl font-bold leading-tight mb-3">
              {vm.greeting}
            </h1>
            <p className="hero-subtitle mt-3 text-pretty text-base text-white/80 leading-relaxed">
              {(vm as any).toneAdvice || vm.interpretation}
            </p>
            
            {/* Dados demográficos */}
            <div className="mt-4 rounded-xl bg-white/10 p-4 backdrop-blur-sm border border-white/20">
              <div className="text-sm text-white/90 font-medium">
                {vm.basics.sex === 'M' ? 'Masculino' : vm.basics.sex === 'F' ? 'Feminino' : 'Outro'} • {vm.basics.age} anos • IMC {normalizeBMI(vm.basics.bmi)?.bmi.toFixed(1) ?? '—'}
              </div>
              <div className="text-xs text-white/70 mt-1">
                {vm.basics.bmiCategory}
              </div>
            </div>
          </div>

          {/* Score Card Mobile */}
          <ScoreCard
            score={vm.score}
            label="Seu Momento Atual"
            icon={vm.icon}
            color={getScoreColor(vm.score)}
            interpretation={vm.interpretation}
          />
        </div>

        {/* Desktop Layout */}
        <div className="hidden md:grid md:grid-cols-2 md:gap-8 lg:gap-12">
          <div className="space-y-6">
            <div>
              <p className="text-xs uppercase tracking-[0.25em] text-white/70 mb-2">
                Relatório Personalizado
              </p>
              <h1 className="mt-2 max-w-xl text-balance text-[clamp(32px,5vw,48px)] font-bold leading-tight mb-4">
                {vm.greeting}
              </h1>
              <p className="mt-3 max-w-xl text-pretty text-[clamp(18px,2.5vw,22px)] text-white/85 leading-relaxed">
                {(vm as any).toneAdvice || vm.interpretation}
              </p>
              
              {/* Dados demográficos */}
              <div className="mt-6 rounded-xl bg-white/10 p-5 backdrop-blur-sm border border-white/20">
                <div className="text-base text-white/90 font-medium">
                  {vm.basics.sex === 'M' ? 'Masculino' : vm.basics.sex === 'F' ? 'Feminino' : 'Outro'} • {vm.basics.age} anos • IMC {normalizeBMI(vm.basics.bmi)?.bmi.toFixed(1) ?? '—'}
                </div>
                <div className="text-sm text-white/70 mt-1">
                  {vm.basics.bmiCategory}
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            {/* Score Card Desktop */}
            <ScoreCard
              score={vm.score}
              label="Seu Momento Atual"
              icon={vm.icon}
              color={getScoreColor(vm.score)}
              interpretation={vm.interpretation}
            />
          </div>
        </div>
      </div>

      {/* Gradiente de brilho animado */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shimmer pointer-events-none" />
    </section>
  );
}
