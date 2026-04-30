import type { ReportViewModel } from '@/lib/report/derive';
import { getEvidenceForProfile, type Classification } from '@/lib/emagrecimento/evidence';

interface Props {
  vm?: ReportViewModel;
}

export function ReportEvidenceEmagrecimento({ vm }: Props) {
  // Se não há vm, usar evidências genéricas
  let evidence;
  
  if (vm) {
    const answers = (vm as any).answers || {};
    const classification = (vm as any).classification as Classification | undefined;
    const comorbidades = Array.isArray(answers.comorbidades)
      ? answers.comorbidades.filter((c: string) => c !== 'nenhuma')
      : [];
    
    evidence = getEvidenceForProfile(
      { age: vm.basics.age, sex: vm.basics.sex, bmi: vm.basics.bmi },
      classification || 'any',
      comorbidades
    );
  } else {
    // Fallback: evidências genéricas
    evidence = [
      {
        id: 'lifestyle-generic',
        title: 'Mudanças de estilo de vida reduzem risco de diabetes',
        summary: 'Grandes estudos mostram que pessoas que perderam cerca de 7% do peso e fizeram atividade física regular reduziram de forma importante o risco de desenvolver diabetes tipo 2.',
        source: 'Estudo clínico randomizado',
        appliesTo: { classification: 'any' }
      },
      {
        id: 'weight-loss-benefits-generic',
        title: 'Perder 5-10% do peso traz grandes benefícios',
        summary: 'Mesmo perdas modestas de peso (5-10% do peso corporal) já melhoram de forma importante o controle da glicose, pressão arterial e saúde do fígado.',
        source: 'Diretrizes de tratamento de obesidade',
        appliesTo: { classification: 'any' }
      }
    ];
  }

  return (
    <section className="bg-gradient-to-br from-purple-50 to-orange-50 rounded-xl sm:rounded-2xl shadow-xl p-5 sm:p-6 md:p-8 border border-purple-100">
      <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4 sm:mb-6">Evidências Científicas</h2>
      <p className="text-sm sm:text-base text-gray-600 mb-6 sm:mb-8 leading-relaxed">
        As recomendações deste relatório são baseadas em evidências científicas robustas:
      </p>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
        {evidence.map((item) => (
          <div key={item.id} className="bg-white rounded-lg sm:rounded-xl p-4 sm:p-6 border border-purple-100">
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2 sm:mb-3 leading-tight">{item.title}</h3>
            <p className="text-xs sm:text-sm text-gray-700 leading-relaxed mb-3">{item.summary}</p>
            <p className="text-xs text-gray-500 italic">Fonte: {item.source}</p>
          </div>
        ))}
      </div>

      <div className="mt-6 sm:mt-8 p-4 sm:p-6 bg-white rounded-lg sm:rounded-xl border-l-4 border-purple-600">
        <p className="text-sm sm:text-base text-gray-700 italic leading-relaxed">
          "Obesidade é uma doença crônica tratável. Pessoas com obesidade merecem opções eficazes e seguras."
        </p>
        <p className="text-xs sm:text-sm text-gray-500 mt-2">— Dr. Ania Jastreboff, Yale School of Medicine</p>
      </div>
    </section>
  );
}

