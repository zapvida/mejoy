import clsx from 'clsx';
import { motion, AnimatePresence } from 'framer-motion';
import React, { useState, useMemo } from 'react';

type CalculatorType = 'bmi' | 'hydration' | 'sleep' | 'calories';

type CalculatorProps = {
  className?: string;
};

const bmiCategories = {
  underweight: { min: 0, max: 18.5, label: 'Abaixo do peso', color: 'text-blue-400', advice: 'Consulte um nutricionista para ganho de peso saudável' },
  normal: { min: 18.5, max: 25, label: 'Peso normal', color: 'text-emerald-400', advice: 'Parabéns! Mantenha hábitos saudáveis' },
  overweight: { min: 25, max: 30, label: 'Sobrepeso', color: 'text-amber-400', advice: 'Foque em alimentação equilibrada e exercícios' },
  obese1: { min: 30, max: 35, label: 'Obesidade Grau I', color: 'text-orange-400', advice: 'Busque orientação médica e nutricional' },
  obese2: { min: 35, max: 40, label: 'Obesidade Grau II', color: 'text-red-400', advice: 'Procure acompanhamento médico especializado' },
  obese3: { min: 40, max: 100, label: 'Obesidade Grau III', color: 'text-red-500', advice: 'Acompanhamento médico multidisciplinar necessário' }
};

const sleepRecommendations = {
  '0-2': { hours: '14-17h', description: 'Recém-nascidos precisam de muito sono para desenvolvimento' },
  '3-5': { hours: '10-13h', description: 'Crianças pequenas ainda precisam de muito descanso' },
  '6-13': { hours: '9-11h', description: 'Crianças em idade escolar precisam de sono adequado' },
  '14-17': { hours: '8-10h', description: 'Adolescentes precisam de mais sono que adultos' },
  '18-25': { hours: '7-9h', description: 'Jovens adultos precisam de sono reparador' },
  '26-64': { hours: '7-9h', description: 'Adultos precisam de sono consistente' },
  '65+': { hours: '7-8h', description: 'Idosos podem precisar de menos sono, mas ainda importante' }
};

const activityLevels = {
  sedentary: { factor: 1.2, label: 'Sedentário', description: 'Pouco ou nenhum exercício' },
  light: { factor: 1.375, label: 'Levemente ativo', description: 'Exercício leve 1-3 dias/semana' },
  moderate: { factor: 1.55, label: 'Moderadamente ativo', description: 'Exercício moderado 3-5 dias/semana' },
  active: { factor: 1.725, label: 'Muito ativo', description: 'Exercício intenso 6-7 dias/semana' },
  veryActive: { factor: 1.9, label: 'Extremamente ativo', description: 'Exercício muito intenso + trabalho físico' }
};

export function HealthCalculators({ className }: CalculatorProps) {
  const [activeCalculator, setActiveCalculator] = useState<CalculatorType>('bmi');
  
  // BMI Calculator State
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  
  // Hydration Calculator State
  const [hydrationWeight, setHydrationWeight] = useState('');
  const [hydrationActivity, setHydrationActivity] = useState<'low' | 'moderate' | 'high'>('moderate');
  
  // Sleep Calculator State
  const [sleepAge, setSleepAge] = useState('');
  
  // Calories Calculator State
  const [caloriesWeight, setCaloriesWeight] = useState('');
  const [caloriesHeight, setCaloriesHeight] = useState('');
  const [caloriesAge, setCaloriesAge] = useState('');
  const [caloriesGender, setCaloriesGender] = useState<'male' | 'female'>('male');
  const [caloriesActivity, setCaloriesActivity] = useState<keyof typeof activityLevels>('moderate');

  const bmiResult = useMemo(() => {
    const w = parseFloat(weight);
    const h = parseFloat(height) / 100;
    if (!w || !h) return null;
    
    const bmi = w / (h * h);
    const category = Object.entries(bmiCategories).find(([, cat]) => 
      bmi >= cat.min && bmi < cat.max
    )?.[0] as keyof typeof bmiCategories;
    
    return { bmi: bmi.toFixed(1), category, ...bmiCategories[category!] };
  }, [weight, height]);

  const hydrationResult = useMemo(() => {
    const w = parseFloat(hydrationWeight);
    if (!w) return null;
    
    const baseWater = w * 35; // 35ml por kg
    const activityMultiplier = hydrationActivity === 'low' ? 1 : hydrationActivity === 'moderate' ? 1.2 : 1.5;
    const totalWater = baseWater * activityMultiplier;
    
    return {
      base: Math.round(baseWater),
      total: Math.round(totalWater),
      glasses: Math.round(totalWater / 250),
      bottles: Math.round(totalWater / 500)
    };
  }, [hydrationWeight, hydrationActivity]);

  const sleepResult = useMemo(() => {
    const age = parseInt(sleepAge);
    if (!age) return null;
    
    let range = '7-9h';
    let description = 'Sono adequado para adultos';
    
    if (age <= 2) { range = sleepRecommendations['0-2'].hours; description = sleepRecommendations['0-2'].description; }
    else if (age <= 5) { range = sleepRecommendations['3-5'].hours; description = sleepRecommendations['3-5'].description; }
    else if (age <= 13) { range = sleepRecommendations['6-13'].hours; description = sleepRecommendations['6-13'].description; }
    else if (age <= 17) { range = sleepRecommendations['14-17'].hours; description = sleepRecommendations['14-17'].description; }
    else if (age <= 25) { range = sleepRecommendations['18-25'].hours; description = sleepRecommendations['18-25'].description; }
    else if (age <= 64) { range = sleepRecommendations['26-64'].hours; description = sleepRecommendations['26-64'].description; }
    else { range = sleepRecommendations['65+'].hours; description = sleepRecommendations['65+'].description; }
    
    return { range, description };
  }, [sleepAge]);

  const caloriesResult = useMemo(() => {
    const w = parseFloat(caloriesWeight);
    const h = parseFloat(caloriesHeight);
    const a = parseInt(caloriesAge);
    if (!w || !h || !a) return null;
    
    // Fórmula de Harris-Benedict
    const bmr = caloriesGender === 'male' 
      ? 88.362 + (13.397 * w) + (4.799 * h) - (5.677 * a)
      : 447.593 + (9.247 * w) + (3.098 * h) - (4.330 * a);
    
    const tdee = bmr * activityLevels[caloriesActivity].factor;
    
    return {
      bmr: Math.round(bmr),
      tdee: Math.round(tdee),
      weightLoss: Math.round(tdee - 500),
      weightGain: Math.round(tdee + 500)
    };
  }, [caloriesWeight, caloriesHeight, caloriesAge, caloriesGender, caloriesActivity]);

  const calculators = [
    { id: 'bmi', label: 'IMC', icon: '⚖️', description: 'Índice de Massa Corporal' },
    { id: 'hydration', label: 'Hidratação', icon: '💧', description: 'Necessidade de água' },
    { id: 'sleep', label: 'Sono', icon: '🌙', description: 'Horas de sono ideais' },
    { id: 'calories', label: 'Calorias', icon: '🔥', description: 'Gasto calórico diário' }
  ];

  return (
    <div className={clsx('space-y-6', className)}>
      {/* Header */}
      <div className="text-center space-y-3">
        <div className="flex items-center justify-center gap-3">
          <span className="text-3xl">🧮</span>
          <h2 className="text-2xl font-bold text-white print:text-slate-900 text-balance">
            Calculadoras de Saúde
          </h2>
        </div>
        <p className="text-white/70 print:text-slate-600 max-w-2xl mx-auto text-pretty">
          Ferramentas interativas para calcular seus indicadores de saúde personalizados
        </p>
      </div>

      {/* Calculator Tabs */}
      <div className="flex flex-wrap justify-center gap-2">
        {calculators.map(calc => (
          <button
            key={calc.id}
            onClick={() => setActiveCalculator(calc.id as CalculatorType)}
            className={clsx(
              'px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200',
              activeCalculator === calc.id
                ? 'bg-white/20 text-white border border-white/40'
                : 'bg-white/5 text-white/70 border border-white/10 hover:bg-white/10'
            )}
          >
            <span className="mr-2">{calc.icon}</span>
            {calc.label}
          </button>
        ))}
      </div>

      {/* Calculator Content */}
      <div className="min-h-[400px]">
        <AnimatePresence mode="wait">
          {/* BMI Calculator */}
          {activeCalculator === 'bmi' && (
            <motion.div
              key="bmi"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              <div className="bg-white/5 rounded-2xl border border-white/10 p-6">
                <h3 className="text-lg font-semibold text-white print:text-slate-900 mb-4 text-balance">
                  ⚖️ Calculadora de IMC
                </h3>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block text-white/80 print:text-slate-700 text-sm font-medium mb-2">
                      Peso (kg)
                    </label>
                    <input
                      type="number"
                      value={weight}
                      onChange={(e) => setWeight(e.target.value)}
                      placeholder="Ex: 70"
                      className="w-full rounded-xl bg-white/10 border border-white/20 p-3 text-white placeholder-white/50 focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-400/20"
                    />
                  </div>
                  <div>
                    <label className="block text-white/80 print:text-slate-700 text-sm font-medium mb-2">
                      Altura (cm)
                    </label>
                    <input
                      type="number"
                      value={height}
                      onChange={(e) => setHeight(e.target.value)}
                      placeholder="Ex: 175"
                      className="w-full rounded-xl bg-white/10 border border-white/20 p-3 text-white placeholder-white/50 focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-400/20"
                    />
                  </div>
                </div>
                
                {bmiResult && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="mt-6 bg-gradient-to-r from-emerald-500/20 to-blue-500/20 rounded-xl p-4 border border-emerald-400/30"
                  >
                    <div className="text-center">
                      <div className="text-3xl font-bold text-white print:text-slate-900 mb-2">
                        {bmiResult.bmi}
                      </div>
                      <div className={clsx('text-lg font-semibold mb-2', bmiResult.color)}>
                        {bmiResult.label}
                      </div>
                      <p className="text-white/80 print:text-slate-600 text-sm">
                        {bmiResult.advice}
                      </p>
                    </div>
                  </motion.div>
                )}
              </div>
            </motion.div>
          )}

          {/* Hydration Calculator */}
          {activeCalculator === 'hydration' && (
            <motion.div
              key="hydration"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              <div className="bg-white/5 rounded-2xl border border-white/10 p-6">
                <h3 className="text-lg font-semibold text-white print:text-slate-900 mb-4">
                  💧 Calculadora de Hidratação
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-white/80 print:text-slate-700 text-sm font-medium mb-2">
                      Seu peso (kg)
                    </label>
                    <input
                      type="number"
                      value={hydrationWeight}
                      onChange={(e) => setHydrationWeight(e.target.value)}
                      placeholder="Ex: 70"
                      className="w-full rounded-xl bg-white/10 border border-white/20 p-3 text-white placeholder-white/50 focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-400/20"
                    />
                  </div>
                  <div>
                    <label className="block text-white/80 print:text-slate-700 text-sm font-medium mb-2">
                      Nível de atividade
                    </label>
                    <div className="grid gap-2 sm:grid-cols-3">
                      {[
                        { id: 'low', label: 'Baixa', description: 'Sedentário' },
                        { id: 'moderate', label: 'Moderada', description: 'Exercício regular' },
                        { id: 'high', label: 'Alta', description: 'Atleta/Intenso' }
                      ].map(level => (
                        <button
                          key={level.id}
                          onClick={() => setHydrationActivity(level.id as any)}
                          className={clsx(
                            'p-3 rounded-xl text-sm font-medium transition-all duration-200',
                            hydrationActivity === level.id
                              ? 'bg-emerald-500/20 text-emerald-200 border border-emerald-400/40'
                              : 'bg-white/5 text-white/70 border border-white/10 hover:bg-white/10'
                          )}
                        >
                          <div className="font-semibold">{level.label}</div>
                          <div className="text-xs opacity-80">{level.description}</div>
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  {hydrationResult && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-xl p-4 border border-blue-400/30"
                    >
                      <div className="text-center space-y-3">
                        <div className="text-2xl font-bold text-white print:text-slate-900">
                          {hydrationResult.total}ml
                        </div>
                        <div className="text-blue-200 font-semibold">
                          Água recomendada por dia
                        </div>
                        <div className="grid gap-2 sm:grid-cols-2 text-sm">
                          <div className="bg-white/10 rounded-lg p-2">
                            <div className="font-semibold text-white print:text-slate-900">
                              {hydrationResult.glasses} copos
                            </div>
                            <div className="text-white/70 print:text-slate-600 text-xs">
                              (250ml cada)
                            </div>
                          </div>
                          <div className="bg-white/10 rounded-lg p-2">
                            <div className="font-semibold text-white print:text-slate-900">
                              {hydrationResult.bottles} garrafas
                            </div>
                            <div className="text-white/70 print:text-slate-600 text-xs">
                              (500ml cada)
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </div>
              </div>
            </motion.div>
          )}

          {/* Sleep Calculator */}
          {activeCalculator === 'sleep' && (
            <motion.div
              key="sleep"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              <div className="bg-white/5 rounded-2xl border border-white/10 p-6">
                <h3 className="text-lg font-semibold text-white print:text-slate-900 mb-4">
                  🌙 Calculadora de Sono
                </h3>
                <div>
                  <label className="block text-white/80 print:text-slate-700 text-sm font-medium mb-2">
                    Sua idade
                  </label>
                  <input
                    type="number"
                    value={sleepAge}
                    onChange={(e) => setSleepAge(e.target.value)}
                    placeholder="Ex: 30"
                    className="w-full rounded-xl bg-white/10 border border-white/20 p-3 text-white placeholder-white/50 focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-400/20"
                  />
                </div>
                
                {sleepResult && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="mt-6 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 rounded-xl p-4 border border-indigo-400/30"
                  >
                    <div className="text-center">
                      <div className="text-2xl font-bold text-white print:text-slate-900 mb-2">
                        {sleepResult.range}
                      </div>
                      <div className="text-indigo-200 font-semibold mb-2">
                        Sono recomendado por noite
                      </div>
                      <p className="text-white/80 print:text-slate-600 text-sm">
                        {sleepResult.description}
                      </p>
                    </div>
                  </motion.div>
                )}
              </div>
            </motion.div>
          )}

          {/* Calories Calculator */}
          {activeCalculator === 'calories' && (
            <motion.div
              key="calories"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              <div className="bg-white/5 rounded-2xl border border-white/10 p-6">
                <h3 className="text-lg font-semibold text-white print:text-slate-900 mb-4">
                  🔥 Calculadora de Calorias
                </h3>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block text-white/80 print:text-slate-700 text-sm font-medium mb-2">
                      Peso (kg)
                    </label>
                    <input
                      type="number"
                      value={caloriesWeight}
                      onChange={(e) => setCaloriesWeight(e.target.value)}
                      placeholder="Ex: 70"
                      className="w-full rounded-xl bg-white/10 border border-white/20 p-3 text-white placeholder-white/50 focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-400/20"
                    />
                  </div>
                  <div>
                    <label className="block text-white/80 print:text-slate-700 text-sm font-medium mb-2">
                      Altura (cm)
                    </label>
                    <input
                      type="number"
                      value={caloriesHeight}
                      onChange={(e) => setCaloriesHeight(e.target.value)}
                      placeholder="Ex: 175"
                      className="w-full rounded-xl bg-white/10 border border-white/20 p-3 text-white placeholder-white/50 focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-400/20"
                    />
                  </div>
                  <div>
                    <label className="block text-white/80 print:text-slate-700 text-sm font-medium mb-2">
                      Idade
                    </label>
                    <input
                      type="number"
                      value={caloriesAge}
                      onChange={(e) => setCaloriesAge(e.target.value)}
                      placeholder="Ex: 30"
                      className="w-full rounded-xl bg-white/10 border border-white/20 p-3 text-white placeholder-white/50 focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-400/20"
                    />
                  </div>
                  <div>
                    <label className="block text-white/80 print:text-slate-700 text-sm font-medium mb-2">
                      Gênero
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {[
                        { id: 'male', label: 'Masculino' },
                        { id: 'female', label: 'Feminino' }
                      ].map(gender => (
                        <button
                          key={gender.id}
                          onClick={() => setCaloriesGender(gender.id as any)}
                          className={clsx(
                            'p-2 rounded-xl text-sm font-medium transition-all duration-200',
                            caloriesGender === gender.id
                              ? 'bg-emerald-500/20 text-emerald-200 border border-emerald-400/40'
                              : 'bg-white/5 text-white/70 border border-white/10 hover:bg-white/10'
                          )}
                        >
                          {gender.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
                
                <div className="mt-4">
                  <label className="block text-white/80 print:text-slate-700 text-sm font-medium mb-2">
                    Nível de atividade
                  </label>
                  <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                    {Object.entries(activityLevels).map(([key, level]) => (
                      <button
                        key={key}
                        onClick={() => setCaloriesActivity(key as any)}
                        className={clsx(
                          'p-3 rounded-xl text-sm font-medium transition-all duration-200 text-left',
                          caloriesActivity === key
                            ? 'bg-emerald-500/20 text-emerald-200 border border-emerald-400/40'
                            : 'bg-white/5 text-white/70 border border-white/10 hover:bg-white/10'
                        )}
                      >
                        <div className="font-semibold">{level.label}</div>
                        <div className="text-xs opacity-80">{level.description}</div>
                      </button>
                    ))}
                  </div>
                </div>
                
                {caloriesResult && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="mt-6 bg-gradient-to-r from-orange-500/20 to-red-500/20 rounded-xl p-4 border border-orange-400/30"
                  >
                    <div className="text-center space-y-4">
                      <div>
                        <div className="text-2xl font-bold text-white print:text-slate-900">
                          {caloriesResult.tdee} cal
                        </div>
                        <div className="text-orange-200 font-semibold">
                          Gasto calórico diário
                        </div>
                      </div>
                      <div className="grid gap-3 sm:grid-cols-3 text-sm">
                        <div className="bg-white/10 rounded-lg p-3">
                          <div className="font-semibold text-white print:text-slate-900">
                            {caloriesResult.bmr} cal
                          </div>
                          <div className="text-white/70 print:text-slate-600 text-xs">
                            Metabolismo basal
                          </div>
                        </div>
                        <div className="bg-white/10 rounded-lg p-3">
                          <div className="font-semibold text-emerald-400">
                            {caloriesResult.weightLoss} cal
                          </div>
                          <div className="text-white/70 print:text-slate-600 text-xs">
                            Para perder peso
                          </div>
                        </div>
                        <div className="bg-white/10 rounded-lg p-3">
                          <div className="font-semibold text-blue-400">
                            {caloriesResult.weightGain} cal
                          </div>
                          <div className="text-white/70 print:text-slate-600 text-xs">
                            Para ganhar peso
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
