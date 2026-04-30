import type { ZapfarmProductConfig } from '@/config/zapfarm/products';

interface ProductHowItWorksSectionProps {
  config?: ZapfarmProductConfig['lpac']['howItWorks'];
  colors?: ZapfarmProductConfig['colors'];
  title?: string;
  subtitle?: string;
}

export function ProductHowItWorksSection({ 
  config, 
  colors,
  title = 'Como funciona',
  subtitle = 'Um processo simples e guiado em 4 etapas'
}: ProductHowItWorksSectionProps) {
  // Se não tiver config, usar valores padrão (backward compatibility)
  const steps = config || [
    {
      step: 1,
      title: 'Check-up online gratuito',
      description: 'Responda perguntas sobre você em alguns minutos',
    },
    {
      step: 2,
      title: 'Plano personalizado imediato',
      description: 'Veja seu relatório com recomendações médicas baseadas em evidências científicas',
    },
    {
      step: 3,
      title: 'Início do tratamento',
      description: 'Escolha um plano, fale com nosso médico e receba seu tratamento em casa',
    },
    {
      step: 4,
      title: 'Acompanhe seus resultados',
      description: 'Acompanhamento contínuo com reavaliações, ajustes e suporte 24h',
    },
  ];

  // Mapear cores para classes Tailwind válidas
  const getGradientClasses = (primary?: string) => {
    const p = primary || 'purple';
    
    const gradients: Record<string, Record<string, string>> = {
      purple: { 
        step: 'from-purple-600 to-orange-600', 
        connector: 'from-purple-400 to-orange-400',
        bg: 'from-purple-50 to-orange-50'
      },
      indigo: { 
        step: 'from-indigo-600 to-blue-600', 
        connector: 'from-indigo-400 to-blue-400',
        bg: 'from-indigo-50 to-blue-50'
      },
      blue: { 
        step: 'from-blue-600 to-indigo-600', 
        connector: 'from-blue-400 to-indigo-400',
        bg: 'from-blue-50 to-indigo-50'
      },
      green: { 
        step: 'from-green-600 to-teal-600', 
        connector: 'from-green-400 to-teal-400',
        bg: 'from-green-50 to-teal-50'
      },
      emerald: { 
        step: 'from-emerald-600 to-green-600', 
        connector: 'from-emerald-400 to-green-400',
        bg: 'from-emerald-50 to-green-50'
      },
      amber: { 
        step: 'from-amber-600 to-yellow-600', 
        connector: 'from-amber-400 to-yellow-400',
        bg: 'from-amber-50 to-yellow-50'
      },
      red: { 
        step: 'from-red-600 to-rose-600', 
        connector: 'from-red-400 to-rose-400',
        bg: 'from-red-50 to-rose-50'
      },
      pink: { 
        step: 'from-pink-600 to-rose-600', 
        connector: 'from-pink-400 to-rose-400',
        bg: 'from-pink-50 to-rose-50'
      },
      slate: { 
        step: 'from-slate-600 to-gray-600', 
        connector: 'from-slate-400 to-gray-400',
        bg: 'from-slate-50 to-gray-50'
      },
      cyan: { 
        step: 'from-cyan-600 to-blue-600', 
        connector: 'from-cyan-400 to-blue-400',
        bg: 'from-cyan-50 to-blue-50'
      },
    };
    
    return gradients[p] || gradients.purple;
  };
  
  const gradientClasses = getGradientClasses(colors?.primary);

  return (
    <section className={`py-12 sm:py-16 md:py-20 bg-gradient-to-br ${gradientClasses.bg}`}>
      <div className="container mx-auto px-4 sm:px-6">
        <div className="text-center mb-10 sm:mb-12 md:mb-16">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-3 sm:mb-4 px-2">
            {title}
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-2xl mx-auto px-2">
            {subtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {steps.map((step, index) => (
            <div key={index} className="relative">
              <div className="text-center bg-white rounded-xl sm:rounded-2xl p-5 sm:p-6 shadow-md hover:shadow-lg transition-all">
                <div className={`inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-gradient-to-r ${gradientClasses.step} text-white text-xl sm:text-2xl font-bold mb-3 sm:mb-4`}>
                  {step.step}
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2 leading-tight">{step.title}</h3>
                <p className="text-sm sm:text-base text-gray-600 leading-relaxed">{step.description}</p>
              </div>
              {index < steps.length - 1 && (
                <div className={`hidden lg:block absolute top-8 left-full w-full h-0.5 bg-gradient-to-r ${gradientClasses.connector} transform translate-x-4`} />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

