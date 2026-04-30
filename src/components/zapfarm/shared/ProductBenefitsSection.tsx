import type { ZapfarmProductConfig } from '@/config/zapfarm/products';

interface ProductBenefitsSectionProps {
  config?: ZapfarmProductConfig['lpac']['benefits'];
  colors?: ZapfarmProductConfig['colors'];
  title?: string;
  subtitle?: string;
}

export function ProductBenefitsSection({ 
  config, 
  colors,
  title = 'Por que a Me Joy',
  subtitle = 'Curadoria médica. Segurança. Resultados reais.'
}: ProductBenefitsSectionProps) {
  // Se não tiver config, usar valores padrão (backward compatibility)
  const benefits = config || [
    { icon: '🩺', title: 'Aprovado e Seguro', description: 'Anvisa. Prescrição médica. Monitoramento.' },
    { icon: '👨‍⚕️', title: 'Médicos Especialistas', description: 'Acompanhamento experiente e humanizado.' },
    { icon: '💉', title: 'Medicação de Ponta', description: 'Medicamentos modernos com resultados comprovados.' },
    { icon: '📊', title: 'Resultados Reais', description: 'Sustentáveis com acompanhamento contínuo.' },
    { icon: '🍎', title: 'Programa Completo', description: 'Plano alimentar e exercícios incluso.' },
    { icon: '📱', title: 'Facilidade', description: '100% online. Entrega em casa. Suporte WhatsApp.' },
  ];

  // Mapear cores para classes Tailwind válidas
  const getColorClasses = (color?: string) => {
    switch (color) {
      case 'indigo': return { border: 'border-indigo-100', bg: 'to-indigo-50/30', hover: 'hover:bg-indigo-50' };
      case 'blue': return { border: 'border-blue-100', bg: 'to-blue-50/30', hover: 'hover:bg-blue-50' };
      case 'green': return { border: 'border-green-100', bg: 'to-green-50/30', hover: 'hover:bg-green-50' };
      case 'emerald': return { border: 'border-emerald-100', bg: 'to-emerald-50/30', hover: 'hover:bg-emerald-50' };
      case 'amber': return { border: 'border-amber-100', bg: 'to-amber-50/30', hover: 'hover:bg-amber-50' };
      case 'red': return { border: 'border-red-100', bg: 'to-red-50/30', hover: 'hover:bg-red-50' };
      case 'pink': return { border: 'border-pink-100', bg: 'to-pink-50/30', hover: 'hover:bg-pink-50' };
      case 'slate': return { border: 'border-slate-100', bg: 'to-slate-50/30', hover: 'hover:bg-slate-50' };
      case 'cyan': return { border: 'border-cyan-100', bg: 'to-cyan-50/30', hover: 'hover:bg-cyan-50' };
      default: return { border: 'border-purple-100', bg: 'to-purple-50/30', hover: 'hover:bg-purple-50' };
    }
  };
  
  const colorClasses = getColorClasses(colors?.primary);

  return (
    <section className="py-12 sm:py-16 md:py-20 bg-white">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="text-center mb-10 sm:mb-12 md:mb-16">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-3 sm:mb-4 px-2">
            {title}
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-2xl mx-auto px-2">
            {subtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
          {benefits.map((benefit, index) => (
            <div
              key={index}
              className={`
                p-5 sm:p-6 rounded-xl sm:rounded-2xl border bg-gradient-to-br shadow-sm hover:shadow-xl 
                transition-all hover:scale-[1.02] sm:hover:scale-105
                ${colorClasses.border} from-white ${colorClasses.bg}
              `}
            >
              <div className="text-3xl sm:text-4xl mb-3 sm:mb-4">{benefit.icon}</div>
              <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2 leading-tight">{benefit.title}</h3>
              <p className="text-sm sm:text-base text-gray-600 leading-relaxed">{benefit.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

