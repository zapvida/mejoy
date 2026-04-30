import type { ReportViewModel } from '@/lib/report/derive';

interface Props {
  vm: ReportViewModel;
}

export function ReportHeroEmagrecimento({ vm }: Props) {
  const bmi = vm.basics.bmi;
  
  const getBMIClassification = (bmi: number | null | undefined): string => {
    if (!bmi) return 'Não calculado';
    if (bmi < 18.5) return 'Abaixo do peso';
    if (bmi < 25) return 'Peso normal';
    if (bmi < 30) return 'Sobrepeso';
    if (bmi < 35) return 'Obesidade Grau I';
    if (bmi < 40) return 'Obesidade Grau II';
    return 'Obesidade Grau III';
  };

  const classification = bmi ? getBMIClassification(bmi) : 'Não calculado';

  return (
    <section className="bg-gradient-to-r from-purple-700 via-purple-800 to-orange-700 text-white py-10 sm:py-12 md:py-16">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-3 sm:mb-4 px-2 text-white">
            Relatório de Avaliação - Emagrecimento
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-purple-100 mb-6 sm:mb-8 px-2">
            {vm.greeting}
          </p>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mt-8 sm:mt-10 md:mt-12">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl sm:rounded-2xl p-4 sm:p-6">
              <div className="text-2xl sm:text-3xl font-bold text-white">{bmi ? bmi.toFixed(1) : '--'}</div>
              <div className="text-purple-200 text-xs sm:text-sm mt-1 sm:mt-2">IMC</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl sm:rounded-2xl p-4 sm:p-6">
              <div className="text-base sm:text-lg font-semibold text-white leading-tight">{classification}</div>
              <div className="text-purple-200 text-xs sm:text-sm mt-1 sm:mt-2">Classificação</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl sm:rounded-2xl p-4 sm:p-6">
              <div className="text-base sm:text-lg font-semibold text-white">
                {bmi && bmi >= 27 ? '✅ Indicação' : '⚠️ Avaliação'}
              </div>
              <div className="text-purple-200 text-xs sm:text-sm mt-1 sm:mt-2">Tratamento</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

