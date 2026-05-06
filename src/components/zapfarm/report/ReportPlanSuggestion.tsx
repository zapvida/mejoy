import type { ReportViewModel } from '@/lib/report/derive';
import { getRecommendedPlan } from '@/lib/emagrecimento/planRecommendation';

interface Props {
  vm: ReportViewModel;
}

export function ReportPlanSuggestion({ vm }: Props) {
  // Extrair dados do VM
  const classification = (vm as any).classification as 'candidato_glp1' | 'nao_indicado' | 'contraindicado' | undefined;
  const answers = (vm as any).answers || {};
  const impactoVida = answers.impacto_vida;
  const comorbidades = Array.isArray(answers.comorbidades)
    ? answers.comorbidades.filter((c: string) => c !== 'nenhuma')
    : [];
  
  // Usar lógica inteligente de recomendação
  const recommendedPlan = getRecommendedPlan(
    classification || 'nao_indicado',
    impactoVida,
    comorbidades
  );
  
  // Gerar justificativa detalhada
  const getDetailedReason = () => {
    const comorbidadesText = comorbidades.length > 0 
      ? `você já apresenta ${comorbidades.length > 1 ? comorbidades.slice(0, 2).join(' e ') : comorbidades[0]}`
      : 'seu quadro atual';
    
    if (classification === 'contraindicado') {
      return {
        main: `Para seu perfil, recomendamos começar com acompanhamento médico presencial antes de considerar qualquer tratamento medicamentoso.`,
        detail: `O plano mensal permite uma avaliação inicial mais próxima e ajustes rápidos conforme necessário.`
      };
    } else if (classification === 'candidato_glp1' && (impactoVida === 'muito' || comorbidades.length >= 2)) {
      return {
        main: `Indicamos o plano semestral porque ${comorbidadesText} e o impacto no seu dia a dia é significativo.`,
        detail: `Assim, conseguimos acompanhar de perto esse início de mudança, com múltiplas consultas e suporte contínuo para resultados sustentáveis e controle adequado das condições de saúde.`
      };
    } else if (classification === 'candidato_glp1') {
      return {
        main: `Recomendamos o plano trimestral porque ${comorbidadesText} e o impacto no seu dia a dia é moderado.`,
        detail: `Esse período permite acompanhamento próximo nos primeiros meses, com consultas médicas e nutricionais para garantir que o tratamento está funcionando bem e fazer ajustes quando necessário.`
      };
    } else {
      return {
        main: `Para seu perfil atual, o plano mensal é ideal para começar e avaliar como seu corpo responde às mudanças.`,
        detail: `Você pode ajustar para um plano mais longo conforme sentir necessidade e conforme seu médico recomendar.`
      };
    }
  };

  const reason = getDetailedReason();

  return (
    <section className="bg-white rounded-xl sm:rounded-2xl shadow-xl p-5 sm:p-6 md:p-8 border border-purple-100">
      <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3 sm:mb-4">Plano Recomendado MeJoy</h2>
      
      <div className="bg-gradient-to-r from-purple-50 to-orange-50 rounded-lg sm:rounded-xl p-4 sm:p-6 border-2 border-purple-300 mb-4">
        <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
          <span className="text-xl sm:text-2xl">⭐</span>
          <h3 className="text-xl sm:text-2xl font-bold text-gray-900">
            Plano {recommendedPlan === 'mensal' ? 'Mensal' : recommendedPlan === 'trimestral' ? 'Trimestral' : 'Semestral'}
          </h3>
        </div>
        <p className="text-sm sm:text-base text-gray-700 leading-relaxed mb-2 font-medium">
          {reason.main}
        </p>
        <p className="text-sm text-gray-600 leading-relaxed">
          {reason.detail}
        </p>
      </div>
      
      <p className="text-xs sm:text-sm text-gray-500 italic leading-relaxed">
        💡 Você pode escolher outro plano se preferir. Esta é apenas uma recomendação baseada no seu perfil atual.
      </p>
    </section>
  );
}

