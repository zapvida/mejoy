import { useState } from 'react';

interface RelatorioPremiumCardProps {
  titulo: string;
  descricao: string;
  data: string;
  conteudoPremium: {
    analiseSaude?: string;
    riscosPrevisoes?: string;
    planoAcao?: string;
    termos?: string;
  };
}

export default function RelatorioPremiumCard({
  titulo,
  descricao,
  data,
  conteudoPremium,
}: RelatorioPremiumCardProps) {
  const [openSection, setOpenSection] = useState<string | null>(null);

  const toggleSection = (section: string) => {
    setOpenSection(openSection === section ? null : section);
  };

  const sections = [
    {
      id: 'analise',
      label: '🩺 Análise da Saúde Atual',
      content: conteudoPremium.analiseSaude || 'Não disponível',
    },
    {
      id: 'riscos',
      label: '🔮 Riscos e Previsões Futuras',
      content: conteudoPremium.riscosPrevisoes || 'Não disponível',
    },
    {
      id: 'plano',
      label: '🚀 Plano de Ação Completo',
      content: conteudoPremium.planoAcao || 'Não disponível',
    },
    {
      id: 'termos',
      label: '📜 Termos e Condições',
      content: conteudoPremium.termos || 'Não disponível',
    },
  ];

  return (
    <div
      className="bg-gradient-to-br from-[#000000] via-[#000000] to-black 
      p-5 sm:p-6 md:p-8 rounded-2xl sm:rounded-3xl border-2 border-brand 
      shadow-xl hover:scale-[1.02] transition-transform flex flex-col gap-6"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
        <div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-brand">
            {titulo}
          </h2>
          <p className="text-sm sm:text-base text-brand-300">{descricao}</p>
        </div>
        {data && (
          <span className="text-xs sm:text-sm text-brand">
            {new Date(data).toLocaleDateString('pt-BR')}
          </span>
        )}
      </div>

      {/* Sections */}
      <div className="flex flex-col gap-4">
        {sections.map((section) => (
          <div
            key={section.id}
            className="border border-brand rounded-xl overflow-hidden"
          >
            <button
              onClick={() => toggleSection(section.id)}
              className="w-full flex justify-between items-center 
              bg-black/50 px-4 py-3 text-left 
              text-brand-400 font-semibold hover:bg-brand hover:text-black transition"
            >
              <span>{section.label}</span>
              <span className="text-lg">
                {openSection === section.id ? '−' : '+'}
              </span>
            </button>
            {openSection === section.id && (
              <div
                className="bg-black/60 p-4 text-sm sm:text-base 
                text-white leading-relaxed whitespace-pre-line"
              >
                {section.content}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Badge */}
      <div className="flex justify-center">
        <span
          className="px-5 py-2 bg-brand text-black rounded-full 
          text-xs sm:text-sm font-semibold shadow-md"
        >
          🔒 Acesso Exclusivo Premium
        </span>
      </div>
    </div>
  );
}