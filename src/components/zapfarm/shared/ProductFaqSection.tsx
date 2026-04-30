'use client';

import { useState } from 'react';
import type { ZapfarmProductConfig } from '@/config/zapfarm/products';

interface ProductFaqSectionProps {
  config?: ZapfarmProductConfig['lpac']['faq'];
  colors?: ZapfarmProductConfig['colors'];
  title?: string;
  subtitle?: string;
}

export function ProductFaqSection({ 
  config, 
  colors,
  title = 'Perguntas Frequentes',
  subtitle = 'Tire suas dúvidas sobre o programa Me Joy'
}: ProductFaqSectionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  // Se não tiver config, usar valores padrão (backward compatibility)
  const faqs = config || [
    {
      question: 'Como funciona o check-up gratuito?',
      answer: 'O check-up é um formulário online rápido com perguntas sobre sua saúde e objetivos. Leva apenas alguns minutos e não tem custo.',
    },
    {
      question: 'Preciso de receita médica?',
      answer: 'Sim, quando há indicação de medicação, nosso médico prescreve eletronicamente após avaliação completa.',
    },
    {
      question: 'Quanto tempo para ver resultados?',
      answer: 'Os resultados variam conforme o tratamento. Nossa equipe médica orienta sobre prazos esperados para seu caso específico.',
    },
    {
      question: 'Posso cancelar?',
      answer: 'Sim, você pode cancelar planos com reembolso proporcional das doses não utilizadas, conforme nossos termos de uso.',
    },
  ];

  // Mapear cores para classes Tailwind válidas
  const getColorClasses = (color?: string) => {
    switch (color) {
      case 'indigo': return { 
        border: 'border-indigo-200', 
        bg: 'bg-indigo-50', 
        text: 'text-indigo-600', 
        hover: 'hover:bg-indigo-50',
        bgGradient: 'from-indigo-50 to-blue-50'
      };
      case 'blue': return { 
        border: 'border-blue-200', 
        bg: 'bg-blue-50', 
        text: 'text-blue-600', 
        hover: 'hover:bg-blue-50',
        bgGradient: 'from-blue-50 to-indigo-50'
      };
      case 'green': return { 
        border: 'border-green-200', 
        bg: 'bg-green-50', 
        text: 'text-green-600', 
        hover: 'hover:bg-green-50',
        bgGradient: 'from-green-50 to-teal-50'
      };
      case 'emerald': return { 
        border: 'border-emerald-200', 
        bg: 'bg-emerald-50', 
        text: 'text-emerald-600', 
        hover: 'hover:bg-emerald-50',
        bgGradient: 'from-emerald-50 to-green-50'
      };
      case 'amber': return { 
        border: 'border-amber-200', 
        bg: 'bg-amber-50', 
        text: 'text-amber-600', 
        hover: 'hover:bg-amber-50',
        bgGradient: 'from-amber-50 to-yellow-50'
      };
      case 'red': return { 
        border: 'border-red-200', 
        bg: 'bg-red-50', 
        text: 'text-red-600', 
        hover: 'hover:bg-red-50',
        bgGradient: 'from-red-50 to-rose-50'
      };
      case 'pink': return { 
        border: 'border-pink-200', 
        bg: 'bg-pink-50', 
        text: 'text-pink-600', 
        hover: 'hover:bg-pink-50',
        bgGradient: 'from-pink-50 to-rose-50'
      };
      case 'slate': return { 
        border: 'border-slate-200', 
        bg: 'bg-slate-50', 
        text: 'text-slate-600', 
        hover: 'hover:bg-slate-50',
        bgGradient: 'from-slate-50 to-gray-50'
      };
      case 'cyan': return { 
        border: 'border-cyan-200', 
        bg: 'bg-cyan-50', 
        text: 'text-cyan-600', 
        hover: 'hover:bg-cyan-50',
        bgGradient: 'from-cyan-50 to-blue-50'
      };
      default: return { 
        border: 'border-purple-200', 
        bg: 'bg-purple-50', 
        text: 'text-purple-600', 
        hover: 'hover:bg-purple-50',
        bgGradient: 'from-purple-50 to-orange-50'
      };
    }
  };
  
  const colorClasses = getColorClasses(colors?.primary);

  return (
    <section className={`py-12 sm:py-16 md:py-20 bg-gradient-to-br ${colorClasses.bgGradient}`}>
      <div className="container mx-auto px-4 sm:px-6">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-8 sm:mb-10 md:mb-12">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-3 sm:mb-4 px-2">
              {title}
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-gray-600 px-2">
              {subtitle}
            </p>
          </div>

          <div className="space-y-3 sm:space-y-4">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className={`border rounded-xl sm:rounded-2xl overflow-hidden bg-white shadow-sm hover:shadow-md transition-shadow ${colorClasses.border}`}
              >
                <button
                  onClick={() => setOpenIndex(openIndex === index ? null : index)}
                  className={`w-full px-4 sm:px-6 py-3 sm:py-4 text-left flex items-center justify-between transition-colors gap-3 ${colorClasses.hover}`}
                >
                  <span className="text-base sm:text-lg font-semibold text-gray-900 flex-1 leading-tight">{faq.question}</span>
                  <svg
                    className={`w-5 h-5 transition-transform flex-shrink-0 ${colorClasses.text} ${
                      openIndex === index ? 'rotate-180' : ''
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {openIndex === index && (
                  <div className={`px-4 sm:px-6 py-3 sm:py-4 border-t ${colorClasses.bg} ${colorClasses.border}`}>
                    <p className="text-sm sm:text-base text-gray-700 leading-relaxed">{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

