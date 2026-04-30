// src/components/calculators/HealthCalculators.tsx
// Sistema de calculadoras de saúde integradas

import React, { useState, useEffect } from 'react';

// Calculadora de IMC
interface BMICalculatorProps {
  onResult?: (result: BMIResult) => void;
  className?: string;
}

interface BMIResult {
  bmi: number;
  category: string;
  color: string;
  recommendations: string[];
}

export function BMICalculator({ onResult, className = '' }: BMICalculatorProps) {
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const [result, setResult] = useState<BMIResult | null>(null);

  const calculateBMI = () => {
    const w = parseFloat(weight);
    const h = parseFloat(height) / 100; // Converter cm para m

    if (w && h && h > 0) {
      const bmi = w / (h * h);
      const category = getBMICategory(bmi);
      const color = getBMIColor(bmi);
      const recommendations = getBMIRecommendations(bmi);

      const bmiResult: BMIResult = {
        bmi: Math.round(bmi * 10) / 10,
        category,
        color,
        recommendations
      };

      setResult(bmiResult);
      if (onResult) onResult(bmiResult);
    }
  };

  const getBMICategory = (bmi: number) => {
    if (bmi < 18.5) return 'Abaixo do peso';
    if (bmi < 25) return 'Peso normal';
    if (bmi < 30) return 'Sobrepeso';
    return 'Obesidade';
  };

  const getBMIColor = (bmi: number) => {
    if (bmi < 18.5) return 'text-blue-600';
    if (bmi < 25) return 'text-green-600';
    if (bmi < 30) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getBMIRecommendations = (bmi: number) => {
    if (bmi < 18.5) {
      return [
        'Consulte um nutricionista para ganho de peso saudável',
        'Inclua exercícios de força na sua rotina',
        'Monitore sua ingestão calórica'
      ];
    } else if (bmi < 25) {
      return [
        'Mantenha seus hábitos saudáveis',
        'Continue com exercícios regulares',
        'Monitore seu peso periodicamente'
      ];
    } else if (bmi < 30) {
      return [
        'Reduza a ingestão calórica',
        'Aumente a atividade física',
        'Consulte um nutricionista'
      ];
    } else {
      return [
        'Procure orientação médica especializada',
        'Implemente mudanças graduais no estilo de vida',
        'Considere acompanhamento multidisciplinar'
      ];
    }
  };

  useEffect(() => {
    if (weight && height) {
      calculateBMI();
    }
  }, [weight, height]);

  return (
    <div className={`bg-white rounded-lg shadow-md p-6 ${className}`}>
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        🧮 Calculadora de IMC
      </h3>
      
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Peso (kg)
          </label>
          <input
            type="number"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            placeholder="70"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Altura (cm)
          </label>
          <input
            type="number"
            value={height}
            onChange={(e) => setHeight(e.target.value)}
            placeholder="175"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>
      </div>

      {result && (
        <div className="mt-4 p-4 bg-gray-50 rounded-lg">
          <div className="text-center">
            <div className={`text-3xl font-bold ${result.color}`}>
              {result.bmi}
            </div>
            <div className="text-lg font-medium text-gray-700">
              {result.category}
            </div>
          </div>
          
          <div className="mt-4">
            <h4 className="font-medium text-gray-900 mb-2">Recomendações:</h4>
            <ul className="text-sm text-gray-600 space-y-1">
              {result.recommendations.map((rec, index) => (
                <li key={index} className="flex items-start">
                  <span className="mr-2">•</span>
                  {rec}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}

// Calculadora de Calorias
interface CalorieCalculatorProps {
  onResult?: (result: CalorieResult) => void;
  className?: string;
}

interface CalorieResult {
  bmr: number;
  tdee: number;
  goals: {
    maintain: number;
    lose: number;
    gain: number;
  };
}

export function CalorieCalculator({ onResult, className = '' }: CalorieCalculatorProps) {
  const [age, setAge] = useState('');
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const [sex, setSex] = useState<'M' | 'F'>('M');
  const [activityLevel, setActivityLevel] = useState('1.2');
  const [result, setResult] = useState<CalorieResult | null>(null);

  const activityLevels = [
    { value: '1.2', label: 'Sedentário (pouco ou nenhum exercício)' },
    { value: '1.375', label: 'Levemente ativo (exercício leve 1-3 dias/semana)' },
    { value: '1.55', label: 'Moderadamente ativo (exercício moderado 3-5 dias/semana)' },
    { value: '1.725', label: 'Muito ativo (exercício intenso 6-7 dias/semana)' },
    { value: '1.9', label: 'Extremamente ativo (exercício muito intenso, trabalho físico)' }
  ];

  const calculateCalories = () => {
    const a = parseFloat(age);
    const w = parseFloat(weight);
    const h = parseFloat(height);
    const activity = parseFloat(activityLevel);

    if (a && w && h && activity) {
      // Fórmula de Harris-Benedict
      let bmr;
      if (sex === 'M') {
        bmr = 88.362 + (13.397 * w) + (4.799 * h) - (5.677 * a);
      } else {
        bmr = 447.593 + (9.247 * w) + (3.098 * h) - (4.330 * a);
      }

      const tdee = bmr * activity;
      const calorieResult: CalorieResult = {
        bmr: Math.round(bmr),
        tdee: Math.round(tdee),
        goals: {
          maintain: Math.round(tdee),
          lose: Math.round(tdee - 500), // Déficit de 500 cal/dia
          gain: Math.round(tdee + 500)  // Superávit de 500 cal/dia
        }
      };

      setResult(calorieResult);
      if (onResult) onResult(calorieResult);
    }
  };

  useEffect(() => {
    if (age && weight && height && activityLevel) {
      calculateCalories();
    }
  }, [age, weight, height, sex, activityLevel]);

  return (
    <div className={`bg-white rounded-lg shadow-md p-6 ${className}`}>
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        🔥 Calculadora de Calorias
      </h3>
      
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Idade
          </label>
          <input
            type="number"
            value={age}
            onChange={(e) => setAge(e.target.value)}
            placeholder="30"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Peso (kg)
          </label>
          <input
            type="number"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            placeholder="70"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Altura (cm)
          </label>
          <input
            type="number"
            value={height}
            onChange={(e) => setHeight(e.target.value)}
            placeholder="175"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Sexo
          </label>
          <select
            value={sex}
            onChange={(e) => setSex(e.target.value as 'M' | 'F')}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            <option value="M">Masculino</option>
            <option value="F">Feminino</option>
          </select>
        </div>
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Nível de Atividade
        </label>
        <select
          value={activityLevel}
          onChange={(e) => setActivityLevel(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
        >
          {activityLevels.map(level => (
            <option key={level.value} value={level.value}>
              {level.label}
            </option>
          ))}
        </select>
      </div>

      {result && (
        <div className="mt-4 p-4 bg-gray-50 rounded-lg">
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {result.bmr}
              </div>
              <div className="text-sm text-gray-600">TMB (cal/dia)</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {result.tdee}
              </div>
              <div className="text-sm text-gray-600">TDEE (cal/dia)</div>
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between items-center p-2 bg-green-50 rounded">
              <span className="text-sm font-medium">Manter peso:</span>
              <span className="font-bold text-green-600">{result.goals.maintain} cal</span>
            </div>
            <div className="flex justify-between items-center p-2 bg-yellow-50 rounded">
              <span className="text-sm font-medium">Perder peso:</span>
              <span className="font-bold text-yellow-600">{result.goals.lose} cal</span>
            </div>
            <div className="flex justify-between items-center p-2 bg-blue-50 rounded">
              <span className="text-sm font-medium">Ganhar peso:</span>
              <span className="font-bold text-blue-600">{result.goals.gain} cal</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Calculadora de Água
interface WaterCalculatorProps {
  onResult?: (result: WaterResult) => void;
  className?: string;
}

interface WaterResult {
  dailyWater: number;
  hourlyWater: number;
  tips: string[];
}

export function WaterCalculator({ onResult, className = '' }: WaterCalculatorProps) {
  const [weight, setWeight] = useState('');
  const [activityLevel, setActivityLevel] = useState('moderate');
  const [climate, setClimate] = useState('temperate');
  const [result, setResult] = useState<WaterResult | null>(null);

  const calculateWater = () => {
    const w = parseFloat(weight);

    if (w) {
      // Base: 35ml por kg de peso corporal
      let baseWater = w * 35;

      // Ajuste por atividade
      const activityMultipliers = {
        low: 1.0,
        moderate: 1.2,
        high: 1.5,
        extreme: 1.8
      };

      // Ajuste por clima
      const climateMultipliers = {
        cold: 1.0,
        temperate: 1.1,
        hot: 1.3,
        very_hot: 1.5
      };

      const dailyWater = Math.round(
        baseWater * 
        activityMultipliers[activityLevel as keyof typeof activityMultipliers] *
        climateMultipliers[climate as keyof typeof climateMultipliers]
      );

      const hourlyWater = Math.round(dailyWater / 16); // 16 horas acordado

      const tips = [
        'Beba água ao acordar para hidratar após o jejum noturno',
        'Mantenha uma garrafa de água sempre próxima',
        'Beba água antes das refeições para melhor digestão',
        'Monitore a cor da urina - deve ser clara',
        'Aumente a ingestão durante exercícios'
      ];

      const waterResult: WaterResult = {
        dailyWater,
        hourlyWater,
        tips
      };

      setResult(waterResult);
      if (onResult) onResult(waterResult);
    }
  };

  useEffect(() => {
    if (weight && activityLevel && climate) {
      calculateWater();
    }
  }, [weight, activityLevel, climate]);

  return (
    <div className={`bg-white rounded-lg shadow-md p-6 ${className}`}>
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        💧 Calculadora de Água
      </h3>
      
      <div className="space-y-4 mb-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Peso (kg)
          </label>
          <input
            type="number"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            placeholder="70"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Nível de Atividade
          </label>
          <select
            value={activityLevel}
            onChange={(e) => setActivityLevel(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            <option value="low">Baixa (escritório)</option>
            <option value="moderate">Moderada (caminhadas)</option>
            <option value="high">Alta (exercícios regulares)</option>
            <option value="extreme">Extrema (atletas)</option>
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Clima
          </label>
          <select
            value={climate}
            onChange={(e) => setClimate(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            <option value="cold">Frio</option>
            <option value="temperate">Temperado</option>
            <option value="hot">Quente</option>
            <option value="very_hot">Muito quente</option>
          </select>
        </div>
      </div>

      {result && (
        <div className="mt-4 p-4 bg-blue-50 rounded-lg">
          <div className="text-center mb-4">
            <div className="text-3xl font-bold text-blue-600">
              {result.dailyWater}ml
            </div>
            <div className="text-lg text-gray-700">
              por dia
            </div>
            <div className="text-sm text-gray-600">
              ({result.hourlyWater}ml por hora)
            </div>
          </div>
          
          <div>
            <h4 className="font-medium text-gray-900 mb-2">💡 Dicas de Hidratação:</h4>
            <ul className="text-sm text-gray-600 space-y-1">
              {result.tips.map((tip, index) => (
                <li key={index} className="flex items-start">
                  <span className="mr-2">•</span>
                  {tip}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}

// Container principal das calculadoras
interface HealthCalculatorsProps {
  className?: string;
}

export function HealthCalculators({ className = '' }: HealthCalculatorsProps) {
  return (
    <div className={`space-y-6 ${className}`}>
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          🧮 Calculadoras de Saúde
        </h2>
        <p className="text-gray-600">
          Ferramentas práticas para monitorar sua saúde
        </p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <BMICalculator />
        <CalorieCalculator />
        <div className="lg:col-span-2">
          <WaterCalculator />
        </div>
      </div>
    </div>
  );
}
