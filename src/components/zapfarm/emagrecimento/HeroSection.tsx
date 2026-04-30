import { cn } from '@/lib/utils';
import { useMemo } from 'react';
import { trackFunnelEvent } from '@/lib/funnel/events-client';
import { buildZapVidaPlantaoUrl } from '@/config/zapfarm/emagrecimento-plans';

type LpVariant = 'A' | 'B' | 'C';

interface HeroSectionProps {
  variant?: LpVariant;
}

const variants = {
  A: {
    title: 'Sua jornada de emagrecimento começa com clareza clínica e plano personalizado',
    subtitle: 'Triagem inteligente no MeJoy, avaliação médica no ZapVida e continuidade guiada. Tudo 100% online, com decisão médica quando indicada.',
  },
  B: {
    title: 'Sua jornada de emagrecimento começa com clareza clínica e plano personalizado',
    subtitle: 'Triagem inteligente no MeJoy, avaliação médica no ZapVida e continuidade guiada. Tudo 100% online, com decisão médica quando indicada.',
  },
  C: {
    title: 'Sua jornada de emagrecimento começa com clareza clínica e plano personalizado',
    subtitle: 'Triagem inteligente no MeJoy, avaliação médica no ZapVida e continuidade guiada. Tudo 100% online, com decisão médica quando indicada.',
  },
};

export function HeroSection({ variant = 'A' }: HeroSectionProps) {
  const variantContent = variants[variant];

  // Gerar partículas uma única vez - já começam em posições aleatórias
  const particles = useMemo(() => {
    return Array.from({ length: 25 }, (_, i) => {
      const animationType = i % 3 === 0 ? 'floatDown' : i % 3 === 1 ? 'floatDown2' : 'floatDown3';
      const duration = 8 + Math.random() * 7;
      // Começar em posição aleatória ao longo da altura (-100vh a 100vh)
      // A animação vai de -100vh até 200vh (300vh total)
      const initialY = -100 + Math.random() * 200;
      // Delay negativo calculado para que a animação já esteja no initialY quando carrega
      // Progresso = (initialY - start) / (end - start) = (initialY + 100) / 300
      const progress = (initialY + 100) / 300;
      const delay = -progress * duration;
      
      return {
        id: i,
        animationType,
        delay,
        duration,
        left: Math.random() * 100,
        size: 2.5 + Math.random() * 3.5,
        initialY,
        progress,
      };
    });
  }, []);

  return (
    <section className="relative min-h-screen flex items-start justify-center overflow-hidden bg-gradient-to-br from-emerald-700 via-emerald-600 to-orange-600 text-white pt-12 sm:pt-16 md:pt-0 md:items-center">
      <style dangerouslySetInnerHTML={{
        __html: `
          @keyframes floatDown {
            0% {
              transform: translateY(-100vh) translateX(0px) rotate(0deg);
              opacity: 0;
            }
            2% {
              opacity: 0.6;
            }
            98% {
              opacity: 0.6;
            }
            100% {
              transform: translateY(200vh) translateX(40px) rotate(360deg);
              opacity: 0;
            }
          }
          @keyframes floatDown2 {
            0% {
              transform: translateY(-100vh) translateX(0px) rotate(0deg);
              opacity: 0;
            }
            2% {
              opacity: 0.55;
            }
            98% {
              opacity: 0.55;
            }
            100% {
              transform: translateY(200vh) translateX(-35px) rotate(-360deg);
              opacity: 0;
            }
          }
          @keyframes floatDown3 {
            0% {
              transform: translateY(-100vh) translateX(0px) rotate(0deg);
              opacity: 0;
            }
            2% {
              opacity: 0.65;
            }
            98% {
              opacity: 0.65;
            }
            100% {
              transform: translateY(200vh) translateX(20px) rotate(180deg);
              opacity: 0;
            }
          }
        `
      }} />
        {/* Background effects */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(249,115,22,0.15),_transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_right,_rgba(217,119,6,0.12),_transparent_50%)]" />
        
        {/* Floating particles animation - flocos sutis */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
          {particles.map((particle) => {
            // Calcular opacidade inicial baseado no progresso da animação
            // Se está entre 2% e 98% do progresso, já aparece visível
            const isVisible = particle.progress >= 0.02 && particle.progress <= 0.98;
            const baseOpacity = particle.id % 3 === 0 ? 0.6 : particle.id % 3 === 1 ? 0.55 : 0.65;
            const initialOpacity = isVisible ? baseOpacity : 0;
            
            return (
              <div
                key={particle.id}
                className="absolute rounded-full bg-white/40 shadow-[0_0_2px_rgba(255,255,255,0.5)]"
                style={{
                  left: `${particle.left}%`,
                  width: `${particle.size}px`,
                  height: `${particle.size}px`,
                  transform: `translateY(${particle.initialY}vh) translateX(0px)`,
                  opacity: initialOpacity,
                  animation: `${particle.animationType} ${particle.duration}s linear infinite`,
                  animationDelay: `${particle.delay}s`,
                  willChange: 'transform, opacity',
                }}
              />
            );
          })}
        </div>
      
      <div className="relative z-10 container mx-auto px-4 sm:px-6 pt-16 pb-12 sm:pt-14 sm:pb-16 md:py-20 text-center">
        <div className="max-w-4xl mx-auto">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-4 py-2 text-xs sm:text-sm font-semibold text-white/95">
            <span>MeJoy</span>
            <span className="text-white/70">→</span>
            <span>ZapVida</span>
            <span className="text-white/70">→</span>
            <span>ZapFarm (quando indicado)</span>
          </div>

          {/* Selo mobile */}
          <div className="mb-8 md:mb-8 md:hidden">
            <h1 className="text-4xl sm:text-4xl font-bold mb-3 text-white tracking-tight">Triagem Inteligente</h1>
            <p className="text-white/90 text-xs sm:text-sm uppercase tracking-[0.15em] font-medium">Emagrecimento com Ciência</p>
          </div>

          {/* Main headline - Mobile-first com tipografia refinada */}
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold mb-6 sm:mb-6 md:mb-8 leading-tight tracking-tight text-white px-2 break-words">
            {variantContent.title}
          </h2>

          {/* Subtitle - Responsivo com tipografia refinada */}
          <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-white/90 mb-8 sm:mb-10 md:mb-12 max-w-3xl mx-auto px-2 leading-relaxed break-words">
            {variantContent.subtitle}
          </p>

          {/* Trust badges - Grid responsivo melhorado */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-8 sm:mb-10 max-w-2xl mx-auto px-2">
            <div className="flex items-center gap-2 sm:gap-2.5 text-left bg-white/5 backdrop-blur-sm border-2 border-white/25 rounded-lg px-3 sm:px-4 py-2 sm:py-2.5">
              <span className="text-lg sm:text-xl flex-shrink-0">🔒</span>
              <span className="text-xs sm:text-sm text-white/95 leading-relaxed">Pagamento seguro</span>
            </div>
            <div className="flex items-center gap-2 sm:gap-2.5 text-left bg-white/5 backdrop-blur-sm border-2 border-white/25 rounded-lg px-3 sm:px-4 py-2 sm:py-2.5">
              <span className="text-lg sm:text-xl flex-shrink-0">👨‍⚕️</span>
              <span className="text-xs sm:text-sm text-white/95 leading-relaxed">Médicos registrados (CRM)</span>
            </div>
            <div className="flex items-center gap-2 sm:gap-2.5 text-left bg-white/5 backdrop-blur-sm border-2 border-white/25 rounded-lg px-3 sm:px-4 py-2 sm:py-2.5">
              <span className="text-lg sm:text-xl flex-shrink-0">🧪</span>
              <span className="text-xs sm:text-sm text-white/95 leading-relaxed">Baseado em evidências científicas</span>
            </div>
            <div className="flex items-center gap-2 sm:gap-2.5 text-left bg-white/5 backdrop-blur-sm border-2 border-white/25 rounded-lg px-3 sm:px-4 py-2 sm:py-2.5">
              <span className="text-lg sm:text-xl flex-shrink-0">📋</span>
              <span className="text-xs sm:text-sm text-white/95 leading-relaxed">Tratamento sob prescrição médica, seguindo normas da ANVISA</span>
            </div>
          </div>

          {/* CTAs - Responsivo com design system refinado */}
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-4 items-center justify-center mb-6 sm:mb-8">
            <a
              href="/triagem/emagrecimento"
              onClick={() => trackFunnelEvent('cta_start_triage', { source: 'hero_primary' })}
              className={cn(
                "inline-flex items-center justify-center",
                "h-11 sm:h-12 md:h-14 px-6 sm:px-8 md:px-10",
                "text-sm sm:text-base md:text-lg font-semibold text-white",
                "rounded-full shadow-lg transition-all duration-200",
                "bg-gradient-to-r from-emerald-500 via-emerald-600 to-orange-500",
                "hover:from-emerald-600 hover:via-emerald-700 hover:to-orange-600",
                "hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0",
                "w-full sm:w-auto max-w-xs sm:max-w-none"
              )}
            >
              Iniciar minha triagem
            </a>
            <a
              href={buildZapVidaPlantaoUrl('hero_secondary')}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackFunnelEvent('clinical_payment_started', { source: 'hero_secondary' })}
              className={cn(
                "inline-flex items-center justify-center",
                "h-11 sm:h-12 px-5 sm:px-6 md:px-8",
                "text-sm sm:text-base font-semibold text-white/90",
                "rounded-full border-2 border-white/30",
                "hover:border-white/50 hover:bg-white/10",
                "transition-all duration-200",
                "w-full sm:w-auto max-w-xs sm:max-w-none"
              )}
            >
              👨‍⚕️ Falar com médico antes
            </a>
            <a
              href="#como-funciona"
              onClick={() => trackFunnelEvent('cta_start_triage', { source: 'hero_anchor' })}
              className={cn(
                "inline-flex items-center justify-center",
                "h-11 sm:h-12 px-5 sm:px-6 md:px-8",
                "text-sm sm:text-base font-semibold text-white/90",
                "rounded-full border-2 border-white/30",
                "hover:border-white/50 hover:bg-white/10",
                "transition-all duration-200",
                "w-full sm:w-auto max-w-xs sm:max-w-none"
              )}
            >
              Ver como funciona em 2 minutos
            </a>
          </div>

          <p className="text-white/80 text-xs sm:text-sm px-2 break-words">
            Triagem rápida • Relatório de valor • Encaminhamento clínico seguro
          </p>
        </div>
      </div>

      {/* Scroll indicator - apenas desktop */}
      <div className="hidden md:block absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <svg className="w-6 h-6 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
      </div>
    </section>
  );
}
