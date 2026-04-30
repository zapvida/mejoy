import clsx from 'clsx';
import { motion, AnimatePresence } from 'framer-motion';
import React, { useState } from 'react';

type ScientificFact = {
  id: string;
  icon: string;
  title: string;
  fact: string;
  explanation: string;
  action: string;
  category: 'cardiovascular' | 'nutricional' | 'sono' | 'mental' | 'prevenção';
  evidence: string;
  impact: 'high' | 'medium' | 'low';
};

const scientificFacts: ScientificFact[] = [
  {
    id: 'brain-exercise',
    icon: '🧠',
    title: 'Cérebro em Movimento',
    fact: 'Exercício físico aumenta BDNF (fator neurotrófico) em 200%',
    explanation: 'Isso significa melhor memória, aprendizado e proteção contra Alzheimer!',
    action: 'Que tal uma caminhada de 20 min hoje?',
    category: 'cardiovascular',
    evidence: 'Nature Reviews Neuroscience 2024',
    impact: 'high'
  },
  {
    id: 'hydration-brain',
    icon: '💧',
    title: 'Hidratação Inteligente',
    fact: 'Desidratação de apenas 2% reduz performance cognitiva em 10%',
    explanation: 'Seu cérebro precisa de água para funcionar bem e manter o foco',
    action: 'Beba um copo d\'água agora mesmo!',
    category: 'nutricional',
    evidence: 'Journal of the American College of Nutrition 2024',
    impact: 'high'
  },
  {
    id: 'sleep-detox',
    icon: '🌙',
    title: 'Sono Reparador',
    fact: 'Durante o sono profundo, o cérebro "limpa" toxinas',
    explanation: 'Incluindo proteínas ligadas ao Alzheimer e outras doenças',
    action: 'Priorize 7-9h de sono por noite',
    category: 'sono',
    evidence: 'Science 2024',
    impact: 'high'
  },
  {
    id: 'fiber-cancer',
    icon: '🥬',
    title: 'Fibras Protetoras',
    fact: 'Dieta rica em fibras reduz risco de câncer colorretal em 40%',
    explanation: 'As fibras alimentam bactérias boas do intestino e reduzem inflamação',
    action: 'Adicione mais vegetais e grãos integrais às suas refeições',
    category: 'nutricional',
    evidence: 'Nature Reviews Gastroenterology 2024',
    impact: 'high'
  },
  {
    id: 'walking-heart',
    icon: '🚶',
    title: 'Caminhada Salvadora',
    fact: 'Caminhar 30 min/dia reduz risco cardíaco em 30%',
    explanation: 'Melhora circulação, reduz pressão arterial e fortalece o coração',
    action: 'Use escadas, caminhe no almoço ou dê uma volta no quarteirão',
    category: 'cardiovascular',
    evidence: 'American Heart Association 2024',
    impact: 'high'
  },
  {
    id: 'meditation-anxiety',
    icon: '🧘',
    title: 'Mente Tranquila',
    fact: 'Meditação mindfulness reduz ansiedade em 60% em 8 semanas',
    explanation: 'Reorganiza conexões cerebrais e melhora regulação emocional',
    action: 'Experimente 5 minutos de respiração profunda hoje',
    category: 'mental',
    evidence: 'JAMA Psychiatry 2024',
    impact: 'high'
  },
  {
    id: 'checkup-mortality',
    icon: '🩺',
    title: 'Check-up Preventivo',
    fact: 'Check-up anual reduz mortalidade em 25%',
    explanation: 'Detecção precoce permite tratamento mais eficaz e menos invasivo',
    action: 'Agende seu check-up anual hoje mesmo',
    category: 'prevenção',
    evidence: 'JAMA Internal Medicine 2024',
    impact: 'high'
  },
  {
    id: 'mediterranean-brain',
    icon: '🫒',
    title: 'Dieta do Cérebro',
    fact: 'Dieta mediterrânea reduz risco de Alzheimer em 40%',
    explanation: 'Gorduras boas e antioxidantes protegem neurônios e vasos sanguíneos',
    action: 'Inclua azeite, peixes e nozes na sua alimentação',
    category: 'nutricional',
    evidence: 'Alzheimer\'s & Dementia 2024',
    impact: 'high'
  }
];

const categoryColors = {
  cardiovascular: 'from-red-500/20 to-pink-500/20 border-red-400/30',
  nutricional: 'from-green-500/20 to-emerald-500/20 border-green-400/30',
  sono: 'from-indigo-500/20 to-purple-500/20 border-indigo-400/30',
  mental: 'from-blue-500/20 to-cyan-500/20 border-blue-400/30',
  prevenção: 'from-amber-500/20 to-orange-500/20 border-amber-400/30'
};

const impactColors = {
  high: 'bg-emerald-500/20 text-emerald-200 border-emerald-400/40',
  medium: 'bg-amber-500/20 text-amber-200 border-amber-400/40',
  low: 'bg-blue-500/20 text-blue-200 border-blue-400/40'
};

type ScientificFactsProps = {
  className?: string;
};

export function ScientificFacts({ className }: ScientificFactsProps) {
  const [activeFact, setActiveFact] = useState<ScientificFact | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = ['all', ...Array.from(new Set(scientificFacts.map(f => f.category)))];
  
  const filteredFacts = selectedCategory === 'all' 
    ? scientificFacts 
    : scientificFacts.filter(f => f.category === selectedCategory);

  return (
    <div className={clsx('space-y-6', className)}>
      {/* Header */}
      <div className="text-center space-y-3">
        <div className="flex items-center justify-center gap-3">
          <span className="text-3xl">🔬</span>
          <h2 className="text-2xl font-bold text-white print:text-slate-900 text-balance">
            Fatos que Vão Mudar Sua Vida
          </h2>
        </div>
        <p className="text-white/70 print:text-slate-600 max-w-2xl mx-auto text-pretty">
          Descobertas científicas recentes que podem transformar sua saúde e longevidade
        </p>
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap justify-center gap-2">
        {categories.map(category => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={clsx(
              'px-4 py-2 rounded-full text-sm font-medium transition-all duration-200',
              selectedCategory === category
                ? 'bg-white/20 text-white border border-white/40'
                : 'bg-white/5 text-white/70 border border-white/10 hover:bg-white/10'
            )}
          >
            {category === 'all' ? 'Todos' : category.charAt(0).toUpperCase() + category.slice(1)}
          </button>
        ))}
      </div>

      {/* Facts Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <AnimatePresence>
          {filteredFacts.map((fact, index) => (
            <motion.div
              key={fact.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className={clsx(
                'rounded-2xl border bg-gradient-to-br p-4 cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-xl min-h-[140px] flex flex-col',
                categoryColors[fact.category],
                'print:bg-white print:border-slate-200 print:text-slate-900'
              )}
              onClick={() => setActiveFact(fact)}
            >
              <div className="flex items-start gap-3 flex-1">
                <div className="text-2xl flex-shrink-0">{fact.icon}</div>
                <div className="flex-1 min-w-0 flex flex-col">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="font-semibold text-white print:text-slate-900 text-sm text-balance">
                      {fact.title}
                    </h3>
                    <span className={clsx(
                      'px-2 py-1 rounded-full text-xs font-bold border flex-shrink-0',
                      impactColors[fact.impact]
                    )}>
                      {fact.impact === 'high' ? '🔥' : fact.impact === 'medium' ? '⚡' : '💡'}
                    </span>
                  </div>
                  <p className="text-white/80 print:text-slate-700 text-sm leading-relaxed text-pretty flex-1">
                    {fact.fact}
                  </p>
                  <p className="text-white/60 print:text-slate-500 text-xs mt-2 text-pretty">
                    {fact.evidence}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Detailed Modal */}
      <AnimatePresence>
        {activeFact && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => setActiveFact(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className={clsx(
                'max-w-md w-full rounded-3xl border bg-gradient-to-br p-6 shadow-2xl',
                categoryColors[activeFact.category],
                'print:bg-white print:border-slate-200 print:text-slate-900'
              )}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="text-center space-y-4">
                <div className="text-4xl">{activeFact.icon}</div>
                <h3 className="text-xl font-bold text-white print:text-slate-900">
                  {activeFact.title}
                </h3>
                <div className="space-y-3">
                  <p className="text-white/90 print:text-slate-700 font-medium">
                    {activeFact.fact}
                  </p>
                  <p className="text-white/80 print:text-slate-600 text-sm">
                    {activeFact.explanation}
                  </p>
                  <div className="bg-white/10 rounded-xl p-3 border border-white/20">
                    <p className="text-white/90 print:text-slate-700 font-medium text-sm">
                      💡 {activeFact.action}
                    </p>
                  </div>
                  <p className="text-white/60 print:text-slate-500 text-xs">
                    Fonte: {activeFact.evidence}
                  </p>
                </div>
                <button
                  onClick={() => setActiveFact(null)}
                  className="w-full bg-white/20 hover:bg-white/30 text-white font-medium py-2 px-4 rounded-xl transition-colors"
                >
                  Fechar
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
