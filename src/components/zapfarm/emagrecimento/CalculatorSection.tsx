'use client';

import { useState } from 'react';

export function CalculatorSection() {
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const [bmi, setBmi] = useState<number | null>(null);
  const [classification, setClassification] = useState<string>('');

  const calculateBMI = () => {
    const weightNum = parseFloat(weight);
    const heightNum = parseFloat(height) / 100; // converter cm para m

    if (weightNum > 0 && heightNum > 0) {
      const bmiValue = weightNum / (heightNum * heightNum);
      setBmi(Math.round(bmiValue * 10) / 10);

      if (bmiValue < 18.5) {
        setClassification('Abaixo do peso');
      } else if (bmiValue < 25) {
        setClassification('Peso normal');
      } else if (bmiValue < 30) {
        setClassification('Sobrepeso');
      } else if (bmiValue < 35) {
        setClassification('Obesidade grau I');
      } else if (bmiValue < 40) {
        setClassification('Obesidade grau II');
      } else {
        setClassification('Obesidade grau III');
      }
    }
  };

  const handleCalculate = (e: React.FormEvent) => {
    e.preventDefault();
    calculateBMI();
  };

  const estimatedWeightLoss = weight ? Math.round(parseFloat(weight) * 0.20) : 0;

  return (
    <section className="py-12 sm:py-16 md:py-20 bg-gradient-to-br from-emerald-50 to-orange-50">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-8 sm:mb-10 md:mb-12">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-3 sm:mb-4 px-2">
              Descubra seu IMC e potencial de resultados
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-gray-600 px-2">
              Calcule seu índice de massa corporal e veja o que isso significa para você
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8 md:p-10 border border-emerald-100">
            <form onSubmit={handleCalculate} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                <div>
                  <label htmlFor="weight" className="block text-sm font-semibold text-gray-700 mb-2">
                    Peso (kg)
                  </label>
                  <input
                    id="weight"
                    type="number"
                    value={weight}
                    onChange={(e) => setWeight(e.target.value)}
                    placeholder="Ex: 85"
                    min="1"
                    max="300"
                    step="0.1"
                    className="w-full px-4 py-3 rounded-lg border-2 border-emerald-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none transition-colors text-gray-900"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="height" className="block text-sm font-semibold text-gray-700 mb-2">
                    Altura (cm)
                  </label>
                  <input
                    id="height"
                    type="number"
                    value={height}
                    onChange={(e) => setHeight(e.target.value)}
                    placeholder="Ex: 170"
                    min="100"
                    max="250"
                    step="0.1"
                    className="w-full px-4 py-3 rounded-lg border-2 border-emerald-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none transition-colors text-gray-900"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-emerald-600 to-orange-600 text-white font-bold py-3 sm:py-4 rounded-lg hover:shadow-lg transition-all hover:scale-[1.02] text-base sm:text-lg"
              >
                Calcular meu IMC
              </button>
            </form>

            {bmi !== null && (
              <div className="mt-8 p-6 bg-gradient-to-br from-emerald-50 to-orange-50 rounded-xl border-2 border-emerald-200">
                <div className="text-center mb-4">
                  <p className="text-sm text-gray-600 mb-2">Seu IMC é</p>
                  <p className="text-4xl sm:text-5xl font-bold text-emerald-700 mb-2">{bmi}</p>
                  <p className="text-lg sm:text-xl font-semibold text-gray-900">{classification}</p>
                </div>

                <div className="mt-6 p-4 bg-white rounded-lg border border-emerald-100">
                  <p className="text-sm sm:text-base text-gray-700 leading-relaxed mb-4">
                    Seu resultado é compatível com <strong>{classification.toLowerCase()}</strong>.
                    Veja em detalhes o que isso significa e qual o seu risco no seu relatório inicial.
                  </p>
                  <a
                    href="/triagem/emagrecimento"
                    className="inline-flex items-center justify-center w-full bg-gradient-to-r from-emerald-600 to-orange-600 text-white font-bold py-3 rounded-lg hover:shadow-lg transition-all hover:scale-[1.02]"
                  >
                    Gerar meu relatório inicial agora
                  </a>
                </div>
              </div>
            )}

            {weight && parseFloat(weight) > 0 && (
              <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <p className="text-sm sm:text-base text-gray-700 leading-relaxed mb-2">
                  <strong>Estimativa baseada em estudos:</strong> Em estudos com medicações modernas para obesidade, pessoas com quadro semelhante ao seu chegaram a perder até ~{estimatedWeightLoss} kg (cerca de 20% do peso corporal) em 1-2 anos, com acompanhamento médico.
                </p>
                <p className="text-xs text-gray-600 italic mt-2">
                  Resultados individuais variam. Este dado não garante resultado individual.
                </p>
              </div>
            )}

            <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
              <p className="text-xs text-gray-600 text-center leading-relaxed">
                <strong>Disclaimer:</strong> Estimativa baseada em estudos clínicos. Resultados individuais variam. Tratamento sob prescrição médica.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
