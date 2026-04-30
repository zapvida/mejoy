import { cn } from '@/lib/utils';
import { useMemo } from 'react';
import type { ZapfarmProductConfig } from '@/config/zapfarm/products';
import { getTriageUrl } from '@/lib/zapfarm/product-loader';
import { getProductColorClasses } from '@/lib/zapfarm/color-utils';

type LpVariant = 'A' | 'B' | 'C';

interface ProductHeroSectionProps {
  productConfig: ZapfarmProductConfig;
  variant?: LpVariant;
}

export function ProductHeroSection({ productConfig }: ProductHeroSectionProps) {
  const { colors, lpac } = productConfig;
  const triageUrl = getTriageUrl(productConfig.slug);
  const colorClasses = getProductColorClasses(colors);
  
  // Usar conteúdo do productConfig
  const heroContent = lpac.hero;
  const gradientClasses = `bg-gradient-to-br ${colorClasses.gradient}`;
  const ctaGradientClasses = `bg-gradient-to-r ${colorClasses.gradientCTA}`;

  // Gerar partículas uma única vez
  const particles = useMemo(() => {
    return Array.from({ length: 25 }, (_, i) => {
      const animationType = i % 3 === 0 ? 'floatDown' : i % 3 === 1 ? 'floatDown2' : 'floatDown3';
      const duration = 8 + Math.random() * 7;
      const initialY = -100 + Math.random() * 200;
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
    <section className={`relative min-h-screen flex items-center justify-center overflow-hidden ${gradientClasses} text-white pt-10 md:pt-0`}>
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
      
      {/* Partículas animadas */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {particles.map((particle) => {
          const animationName = particle.animationType === 'floatDown' ? 'floatDown' :
                               particle.animationType === 'floatDown2' ? 'floatDown2' : 'floatDown3';
          
          return (
            <div
              key={particle.id}
              className="absolute rounded-full bg-white/30"
              style={{
                left: `${particle.left}%`,
                width: `${particle.size}px`,
                height: `${particle.size}px`,
                top: `${particle.initialY}vh`,
                animation: `${animationName} ${particle.duration}s linear infinite`,
                animationDelay: `${particle.delay}s`,
              }}
            />
          );
        })}
      </div>
    
      <div className="relative z-10 container mx-auto px-4 sm:px-6 py-6 sm:py-16 md:py-20 text-center">
        <div className="max-w-4xl mx-auto">
          {/* Logo placeholder - apenas mobile */}
          <div className="mb-3 md:mb-8 md:hidden">
            <h1 className="text-4xl sm:text-4xl font-bold mb-1.5 text-white tracking-tight">Check-up Gratuito</h1>
            <p className="text-white/90 text-xs sm:text-sm uppercase tracking-[0.15em] font-medium">{productConfig.displayName}</p>
          </div>

          {/* Main headline */}
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold mb-4 sm:mb-6 leading-snug text-white px-2">
            {heroContent.headline}
          </h2>

          {/* Subtitle */}
          <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-white/90 mb-5 sm:mb-8 max-w-3xl mx-auto px-2 leading-relaxed">
            {heroContent.subheadline}
          </p>

          {/* Bullets - Grid responsivo */}
          {heroContent.bullets && heroContent.bullets.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-6 sm:mb-10 max-w-2xl mx-auto px-2">
              {heroContent.bullets.map((bullet, index) => (
                <div key={index} className="flex items-center gap-2.5 sm:gap-3 text-left bg-white/5 backdrop-blur-sm border-2 border-white/25 rounded-lg px-3.5 sm:px-4 py-2.5 sm:py-3">
                  <span className="text-xl sm:text-2xl flex-shrink-0">{bullet.icon}</span>
                  <span className="text-sm sm:text-base text-white/95 leading-relaxed">{bullet.text}</span>
                </div>
              ))}
            </div>
          )}

          {/* CTA Button */}
          <a
            href={triageUrl}
            className={cn(
              "inline-block rounded-full px-6 sm:px-8 md:px-10 py-3 sm:py-3.5 md:py-4",
              "text-sm sm:text-base md:text-lg font-bold text-white shadow-2xl transition-all hover:scale-105",
              ctaGradientClasses,
              "w-full sm:w-auto max-w-xs sm:max-w-none mx-auto"
            )}
          >
            {heroContent.ctaText} →
          </a>

          <p className="mt-4 sm:mt-6 text-white/80 text-xs sm:text-sm px-2">
            Relatório completo de saúde grátis
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

