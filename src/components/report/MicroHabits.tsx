import clsx from 'clsx';
import { motion, AnimatePresence } from 'framer-motion';
import React, { useState } from 'react';

type MicroHabit = {
  id: string;
  title: string;
  description: string;
  difficulty: 'easy' | 'medium' | 'hard';
  impact: 'high' | 'medium' | 'low';
  category: 'nutrition' | 'exercise' | 'sleep' | 'stress' | 'prevention';
  week: number;
  icon: string;
  evidence: string;
  tip: string;
};

type MicroHabitsProps = {
  className?: string;
};

const microHabits: MicroHabit[] = [
  // Semana 1 - Hábitos Básicos
  {
    id: 'water-morning',
    title: 'Copo d\'água ao acordar',
    description: 'Beba um copo de água assim que acordar',
    difficulty: 'easy',
    impact: 'high',
    category: 'nutrition',
    week: 1,
    icon: '💧',
    evidence: 'Hidratação matinal acelera metabolismo em 30%',
    tip: 'Deixe um copo d\'água na mesa de cabeceira'
  },
  {
    id: 'stairs-elevator',
    title: 'Escadas em vez do elevador',
    description: 'Use escadas sempre que possível',
    difficulty: 'easy',
    impact: 'medium',
    category: 'exercise',
    week: 1,
    icon: '🪜',
    evidence: 'Queima 2x mais calorias que caminhada',
    tip: 'Comece com 1-2 andares e aumente gradualmente'
  },
  {
    id: 'fruit-before-coffee',
    title: 'Fruta antes do café',
    description: 'Coma uma fruta antes de tomar café',
    difficulty: 'easy',
    impact: 'high',
    category: 'nutrition',
    week: 1,
    icon: '🍎',
    evidence: 'Frutas reduzem pico glicêmico do café',
    tip: 'Banana ou maçã são ótimas opções'
  },

  // Semana 2 - Hábitos Intermediários
  {
    id: 'walk-after-lunch',
    title: 'Caminhada após almoço',
    description: 'Caminhe 10 minutos após o almoço',
    difficulty: 'medium',
    impact: 'high',
    category: 'exercise',
    week: 2,
    icon: '🚶',
    evidence: 'Melhora digestão e reduz sonolência',
    tip: 'Mesmo 5 minutos já fazem diferença'
  },
  {
    id: 'phone-bedroom',
    title: 'Sem celular no quarto',
    description: 'Deixe o celular fora do quarto à noite',
    difficulty: 'medium',
    impact: 'high',
    category: 'sleep',
    week: 2,
    icon: '📱',
    evidence: 'Reduz tempo para adormecer em 15 min',
    tip: 'Use despertador tradicional'
  },
  {
    id: 'vegetables-half-plate',
    title: 'Metade do prato com vegetais',
    description: 'Encha metade do prato com vegetais',
    difficulty: 'medium',
    impact: 'high',
    category: 'nutrition',
    week: 2,
    icon: '🥬',
    evidence: 'Aumenta vitaminas e reduz calorias',
    tip: 'Vegetais coloridos são mais nutritivos'
  },

  // Semana 3 - Hábitos Avançados
  {
    id: 'breathing-exercise',
    title: 'Respiração 4-7-8',
    description: 'Pratique respiração 4-7-8 por 5 min',
    difficulty: 'medium',
    impact: 'high',
    category: 'stress',
    week: 3,
    icon: '🫁',
    evidence: 'Reduz cortisol em 5 minutos',
    tip: 'Inspire 4s, segure 7s, expire 8s'
  },
  {
    id: 'protein-breakfast',
    title: 'Proteína no café da manhã',
    description: 'Inclua proteína no café da manhã',
    difficulty: 'medium',
    impact: 'high',
    category: 'nutrition',
    week: 3,
    icon: '🥚',
    evidence: 'Mantém saciedade por 4 horas',
    tip: 'Ovos, iogurte grego ou aveia com chia'
  },
  {
    id: 'micro-breaks',
    title: 'Micro-pausas a cada 2h',
    description: 'Pare 2 minutos a cada 2 horas',
    difficulty: 'medium',
    impact: 'medium',
    category: 'stress',
    week: 3,
    icon: '⏰',
    evidence: 'Melhora foco e reduz tensão',
    tip: 'Respire fundo e estique o corpo'
  },

  // Semana 4 - Hábitos de Prevenção
  {
    id: 'daily-gratitude',
    title: 'Gratidão diária',
    description: 'Anote 3 coisas pelas quais é grato',
    difficulty: 'easy',
    impact: 'high',
    category: 'stress',
    week: 4,
    icon: '🙏',
    evidence: 'Melhora humor e qualidade do sono',
    tip: 'Faça antes de dormir'
  },
  {
    id: 'sun-exposure',
    title: 'Exposição ao sol',
    description: 'Pegue 15 min de sol por dia',
    difficulty: 'easy',
    impact: 'high',
    category: 'prevention',
    week: 4,
    icon: '☀️',
    evidence: 'Síntese de vitamina D essencial',
    tip: 'Melhor horário: 10h-15h'
  },
  {
    id: 'social-connection',
    title: 'Conexão social',
    description: 'Converse com alguém por 10 min',
    difficulty: 'easy',
    impact: 'high',
    category: 'stress',
    week: 4,
    icon: '👥',
    evidence: 'Reduz risco de depressão em 50%',
    tip: 'Pode ser por telefone ou videochamada'
  }
];

const difficultyColors = {
  easy: 'from-green-500/20 to-emerald-500/20 border-green-400/30',
  medium: 'from-amber-500/20 to-yellow-500/20 border-amber-400/30',
  hard: 'from-red-500/20 to-orange-500/20 border-red-400/30'
};

const impactColors = {
  high: 'bg-emerald-500/20 text-emerald-200 border-emerald-400/40',
  medium: 'bg-amber-500/20 text-amber-200 border-amber-400/40',
  low: 'bg-blue-500/20 text-blue-200 border-blue-400/40'
};

const categoryIcons = {
  nutrition: '🥗',
  exercise: '🏃',
  sleep: '🌙',
  stress: '🧘',
  prevention: '🛡️'
};

export function MicroHabits({ className }: MicroHabitsProps) {
  const [selectedWeek, setSelectedWeek] = useState<number>(1);
  const [completedHabits, setCompletedHabits] = useState<Set<string>>(new Set());
  const [activeHabit, setActiveHabit] = useState<MicroHabit | null>(null);

  const weeks = [1, 2, 3, 4];
  const habitsForWeek = microHabits.filter(habit => habit.week === selectedWeek);

  const toggleHabit = (habitId: string) => {
    const newCompleted = new Set(completedHabits);
    if (newCompleted.has(habitId)) {
      newCompleted.delete(habitId);
    } else {
      newCompleted.add(habitId);
    }
    setCompletedHabits(newCompleted);
  };

  const getWeekProgress = (week: number) => {
    const weekHabits = microHabits.filter(h => h.week === week);
    const completedWeekHabits = weekHabits.filter(h => completedHabits.has(h.id));
    return Math.round((completedWeekHabits.length / weekHabits.length) * 100);
  };

  return (
    <div className={clsx('space-y-6', className)}>
      {/* Header */}
      <div className="text-center space-y-3">
        <div className="flex items-center justify-center gap-3">
          <span className="text-3xl">🎯</span>
          <h2 className="text-2xl font-bold text-white print:text-slate-900">
            Micro-Hábitos Progressivos
          </h2>
        </div>
        <p className="text-white/70 print:text-slate-600 max-w-2xl mx-auto">
          Pequenas mudanças diárias que transformam sua saúde em 30 dias
        </p>
      </div>

      {/* Week Selector */}
      <div className="flex justify-center">
        <div className="bg-white/5 rounded-2xl p-1 border border-white/10">
          {weeks.map(week => {
            const progress = getWeekProgress(week);
            return (
              <button
                key={week}
                onClick={() => setSelectedWeek(week)}
                className={clsx(
                  'px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 relative',
                  selectedWeek === week
                    ? 'bg-white/20 text-white'
                    : 'text-white/70 hover:text-white hover:bg-white/10'
                )}
              >
                <span className="mr-2">📅</span>
                Semana {week}
                {progress > 0 && (
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-400 rounded-full flex items-center justify-center">
                    <span className="text-xs text-emerald-900 font-bold">✓</span>
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Week Progress */}
      <div className="text-center">
        <div className="text-white/60 print:text-slate-500 text-sm mb-2">
          Progresso da Semana {selectedWeek}
        </div>
        <div className="w-full bg-white/10 rounded-full h-2">
          <div 
            className="bg-emerald-400 h-2 rounded-full transition-all duration-500"
            style={{ width: `${getWeekProgress(selectedWeek)}%` }}
          />
        </div>
        <div className="text-emerald-200 text-sm mt-1">
          {getWeekProgress(selectedWeek)}% concluído
        </div>
      </div>

      {/* Habits Grid */}
      <div className="space-y-4">
        <AnimatePresence>
          {habitsForWeek.map((habit, index) => (
            <motion.div
              key={habit.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className={clsx(
                'rounded-2xl border bg-gradient-to-br p-4 cursor-pointer transition-all duration-300 hover:scale-105',
                difficultyColors[habit.difficulty],
                completedHabits.has(habit.id) && 'opacity-60 scale-95',
                'print:bg-white print:border-slate-200 print:text-slate-900'
              )}
              onClick={() => setActiveHabit(habit)}
            >
              <div className="flex items-start gap-4">
                <div className="text-2xl flex-shrink-0">{habit.icon}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-white print:text-slate-900 text-base">
                      {habit.title}
                    </h3>
                    <div className="flex items-center gap-2">
                      <span className={clsx(
                        'px-2 py-1 rounded-full text-xs font-bold border',
                        impactColors[habit.impact]
                      )}>
                        {habit.impact === 'high' ? '🔥' : habit.impact === 'medium' ? '⚡' : '💡'}
                      </span>
                      {completedHabits.has(habit.id) && (
                        <span className="text-emerald-400 text-lg">✓</span>
                      )}
                    </div>
                  </div>
                  
                  <p className="text-white/80 print:text-slate-700 text-sm mb-3">
                    {habit.description}
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-white/60 print:text-slate-500">
                        {categoryIcons[habit.category]} {habit.category}
                      </span>
                      <span className={clsx(
                        'px-2 py-1 rounded-full text-xs font-bold',
                        habit.difficulty === 'easy' ? 'bg-green-500/20 text-green-200' :
                        habit.difficulty === 'medium' ? 'bg-amber-500/20 text-amber-200' :
                        'bg-red-500/20 text-red-200'
                      )}>
                        {habit.difficulty === 'easy' ? 'Fácil' : 
                         habit.difficulty === 'medium' ? 'Médio' : 'Difícil'}
                      </span>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleHabit(habit.id);
                      }}
                      className={clsx(
                        'px-3 py-1 rounded-full text-xs font-medium transition-all duration-200',
                        completedHabits.has(habit.id)
                          ? 'bg-emerald-500/20 text-emerald-200 border border-emerald-400/40'
                          : 'bg-white/10 text-white/70 border border-white/20 hover:bg-white/20'
                      )}
                    >
                      {completedHabits.has(habit.id) ? 'Concluído' : 'Marcar'}
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Detailed Modal */}
      <AnimatePresence>
        {activeHabit && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => setActiveHabit(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className={clsx(
                'max-w-md w-full rounded-3xl border bg-gradient-to-br p-6 shadow-2xl',
                difficultyColors[activeHabit.difficulty],
                'print:bg-white print:border-slate-200 print:text-slate-900'
              )}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="text-center space-y-4">
                <div className="text-4xl">{activeHabit.icon}</div>
                <h3 className="text-xl font-bold text-white print:text-slate-900">
                  {activeHabit.title}
                </h3>
                <div className="space-y-3">
                  <p className="text-white/90 print:text-slate-700">
                    {activeHabit.description}
                  </p>
                  <div className="bg-white/10 rounded-xl p-3 border border-white/20">
                    <p className="text-white/90 print:text-slate-700 font-medium text-sm">
                      💡 {activeHabit.tip}
                    </p>
                  </div>
                  <div className="bg-white/10 rounded-xl p-3 border border-white/20">
                    <p className="text-white/80 print:text-slate-600 text-sm">
                      📊 {activeHabit.evidence}
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      toggleHabit(activeHabit.id);
                      setActiveHabit(null);
                    }}
                    className={clsx(
                      'flex-1 py-2 px-4 rounded-xl font-medium transition-colors',
                      completedHabits.has(activeHabit.id)
                        ? 'bg-emerald-500/20 text-emerald-200 border border-emerald-400/40'
                        : 'bg-emerald-500/20 text-emerald-200 border border-emerald-400/40 hover:bg-emerald-500/30'
                    )}
                  >
                    {completedHabits.has(activeHabit.id) ? 'Desmarcar' : 'Marcar como Concluído'}
                  </button>
                  <button
                    onClick={() => setActiveHabit(null)}
                    className="px-4 py-2 bg-white/20 hover:bg-white/30 text-white font-medium rounded-xl transition-colors"
                  >
                    Fechar
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Overall Progress */}
      <div className="bg-white/5 rounded-2xl border border-white/10 p-4">
        <h4 className="text-white print:text-slate-900 font-semibold mb-3 text-center">
          📈 Progresso Geral
        </h4>
        <div className="grid gap-4 sm:grid-cols-4">
          {weeks.map(week => {
            const progress = getWeekProgress(week);
            return (
              <div key={week} className="text-center">
                <div className="text-lg font-bold text-white print:text-slate-900">
                  {progress}%
                </div>
                <div className="text-white/70 print:text-slate-600 text-sm">
                  Semana {week}
                </div>
                <div className="w-full bg-white/10 rounded-full h-1 mt-1">
                  <div 
                    className="bg-emerald-400 h-1 rounded-full transition-all duration-500"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
