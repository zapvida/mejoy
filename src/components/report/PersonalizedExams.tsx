import clsx from 'clsx';
import { motion, AnimatePresence } from 'framer-motion';
import React, { useState, useMemo } from 'react';

import type { PatientProfile } from '@/lib/report/types';

type ExamItem = {
  name: string;
  frequency: string;
  preparation: string;
  why: string;
  priority: 'high' | 'medium' | 'low';
  ageRange: string;
  gender?: 'male' | 'female' | 'both';
  bmiCondition?: 'normal' | 'overweight' | 'obese' | 'all';
  icon: string;
};

type PersonalizedExamsProps = {
  patient: PatientProfile;
  className?: string;
};

const allExams: ExamItem[] = [
  // Exames básicos para todas as idades
  {
    name: 'Hemograma completo',
    frequency: 'Anual',
    preparation: 'Jejum de 8 horas',
    why: 'Avalia saúde geral, detecta anemia, infecções e distúrbios sanguíneos',
    priority: 'high',
    ageRange: 'Todas as idades',
    gender: 'both',
    bmiCondition: 'all',
    icon: '🩸'
  },
  {
    name: 'Glicemia de jejum',
    frequency: 'A cada 3 anos (normal) / Anual (risco)',
    preparation: 'Jejum de 12 horas',
    why: 'Detecta diabetes e pré-diabetes precocemente',
    priority: 'high',
    ageRange: '20+ anos',
    gender: 'both',
    bmiCondition: 'all',
    icon: '🍯'
  },
  {
    name: 'Perfil lipídico',
    frequency: 'A cada 5 anos (normal) / Anual (risco)',
    preparation: 'Jejum de 12 horas',
    why: 'Avalia colesterol total, HDL, LDL e triglicerídeos',
    priority: 'high',
    ageRange: '20+ anos',
    gender: 'both',
    bmiCondition: 'all',
    icon: '🫀'
  },
  {
    name: 'Pressão arterial',
    frequency: 'A cada 2 anos (normal) / Anual (risco)',
    preparation: 'Sem jejum, evitar café 1h antes',
    why: 'Detecta hipertensão, principal fator de risco cardiovascular',
    priority: 'high',
    ageRange: 'Todas as idades',
    gender: 'both',
    bmiCondition: 'all',
    icon: '🩺'
  },
  {
    name: 'Exame de urina',
    frequency: 'Anual',
    preparation: 'Primeira urina da manhã',
    why: 'Detecta infecções, problemas renais e diabetes',
    priority: 'medium',
    ageRange: 'Todas as idades',
    gender: 'both',
    bmiCondition: 'all',
    icon: '🧪'
  },
  {
    name: 'TSH (Tireoide)',
    frequency: 'A cada 5 anos',
    preparation: 'Sem jejum',
    why: 'Avalia função da tireoide, essencial para metabolismo',
    priority: 'medium',
    ageRange: '30+ anos',
    gender: 'both',
    bmiCondition: 'all',
    icon: '🦋'
  },

  // Exames específicos por idade e gênero
  {
    name: 'Papanicolau',
    frequency: 'A cada 3 anos',
    preparation: 'Evitar relações 2 dias antes',
    why: 'Detecta câncer de colo do útero e HPV',
    priority: 'high',
    ageRange: '21-65 anos',
    gender: 'female',
    bmiCondition: 'all',
    icon: '🔬'
  },
  {
    name: 'Exame clínico das mamas',
    frequency: 'Anual',
    preparation: 'Sem preparo especial',
    why: 'Detecta nódulos e alterações nas mamas',
    priority: 'high',
    ageRange: '20+ anos',
    gender: 'female',
    bmiCondition: 'all',
    icon: '👩'
  },
  {
    name: 'Mamografia',
    frequency: 'Anual',
    preparation: 'Evitar desodorante no dia',
    why: 'Detecta câncer de mama precocemente',
    priority: 'high',
    ageRange: '40+ anos',
    gender: 'female',
    bmiCondition: 'all',
    icon: '📷'
  },
  {
    name: 'PSA + Toque retal',
    frequency: 'Anual',
    preparation: 'Evitar ejaculação 48h antes',
    why: 'Detecta câncer de próstata precocemente',
    priority: 'high',
    ageRange: '50+ anos',
    gender: 'male',
    bmiCondition: 'all',
    icon: '👨'
  },
  {
    name: 'Colonoscopia',
    frequency: 'A cada 10 anos',
    preparation: 'Dieta líquida + laxante',
    why: 'Detecta pólipos e câncer colorretal',
    priority: 'high',
    ageRange: '45+ anos',
    gender: 'both',
    bmiCondition: 'all',
    icon: '🔍'
  },
  {
    name: 'Densitometria óssea',
    frequency: 'A cada 2 anos',
    preparation: 'Sem jejum, evitar cálcio 24h antes',
    why: 'Detecta osteoporose e osteopenia',
    priority: 'medium',
    ageRange: '65+ anos (mulheres) / 70+ anos (homens)',
    gender: 'both',
    bmiCondition: 'all',
    icon: '🦴'
  },
  {
    name: 'Avaliação auditiva',
    frequency: 'A cada 3 anos',
    preparation: 'Sem preparo especial',
    why: 'Detecta perda auditiva relacionada à idade',
    priority: 'medium',
    ageRange: '60+ anos',
    gender: 'both',
    bmiCondition: 'all',
    icon: '👂'
  },
  {
    name: 'Exame oftalmológico',
    frequency: 'A cada 2 anos',
    preparation: 'Colírio para dilatar pupila',
    why: 'Detecta glaucoma, catarata e problemas de visão',
    priority: 'medium',
    ageRange: '40+ anos',
    gender: 'both',
    bmiCondition: 'all',
    icon: '👁️'
  },

  // Exames específicos por IMC
  {
    name: 'Glicemia pós-prandial',
    frequency: 'Anual',
    preparation: 'Jejum + refeição teste',
    why: 'Avalia resposta glicêmica após refeição',
    priority: 'high',
    ageRange: '30+ anos',
    gender: 'both',
    bmiCondition: 'overweight',
    icon: '🍽️'
  },
  {
    name: 'Hemoglobina glicada (HbA1c)',
    frequency: 'A cada 6 meses',
    preparation: 'Sem jejum',
    why: 'Avalia controle glicêmico dos últimos 3 meses',
    priority: 'high',
    ageRange: '30+ anos',
    gender: 'both',
    bmiCondition: 'obese',
    icon: '📊'
  },
  {
    name: 'Teste de tolerância à glicose',
    frequency: 'Anual',
    preparation: 'Jejum + bebida açucarada',
    why: 'Detecta diabetes tipo 2 e resistência à insulina',
    priority: 'high',
    ageRange: '25+ anos',
    gender: 'both',
    bmiCondition: 'obese',
    icon: '🧃'
  }
];

const priorityColors = {
  high: 'from-red-500/20 to-orange-500/20 border-red-400/30',
  medium: 'from-amber-500/20 to-yellow-500/20 border-amber-400/30',
  low: 'from-blue-500/20 to-cyan-500/20 border-blue-400/30'
};

const priorityLabels = {
  high: '🔥 Prioridade Alta',
  medium: '⚡ Prioridade Média',
  low: '💡 Prioridade Baixa'
};

export function PersonalizedExams({ patient, className }: PersonalizedExamsProps) {
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'high' | 'medium' | 'low'>('all');
  const [completedExams, setCompletedExams] = useState<Set<string>>(new Set());

  const patientAge = patient.age || 30;
  const patientGender = patient.sex === 'male' ? 'male' : patient.sex === 'female' ? 'female' : 'both';
  // TODO(backcompat-2025-10-23) - Guard para BMI flexível
  const patientBMI = typeof patient.bmi === 'object' ? patient.bmi?.bmi : patient.bmi || 22.5;
  // TODO(backcompat-2025-10-23) - BMI pode ser undefined
  const bmiCategory = (patientBMI ?? 22.5) < 25 ? 'normal' : (patientBMI ?? 22.5) < 30 ? 'overweight' : 'obese';

  const personalizedExams = useMemo(() => {
    return allExams.filter(exam => {
      // Filtro por idade
      const ageMatch = exam.ageRange === 'Todas as idades' || 
        (exam.ageRange.includes('+') && patientAge >= parseInt(exam.ageRange.split('+')[0] || '0')) ||
        (exam.ageRange.includes('-') && 
         patientAge >= parseInt(exam.ageRange.split('-')[0] || '0') && 
         patientAge <= parseInt(exam.ageRange.split('-')[1]?.split(' ')[0] || '0'));

      // Filtro por gênero
      const genderMatch = !exam.gender || exam.gender === 'both' || exam.gender === patientGender;

      // Filtro por IMC
      const bmiMatch = !exam.bmiCondition || exam.bmiCondition === 'all' || exam.bmiCondition === bmiCategory;

      return ageMatch && genderMatch && bmiMatch;
    });
  }, [patientAge, patientGender, bmiCategory]);

  const filteredExams = selectedCategory === 'all' 
    ? personalizedExams 
    : personalizedExams.filter(exam => exam.priority === selectedCategory);

  const toggleExam = (examName: string) => {
    const newCompleted = new Set(completedExams);
    if (newCompleted.has(examName)) {
      newCompleted.delete(examName);
    } else {
      newCompleted.add(examName);
    }
    setCompletedExams(newCompleted);
  };

  const getAgeRecommendation = (age: number) => {
    if (age < 20) return 'Foco em exames básicos e vacinação';
    if (age < 40) return 'Exames preventivos básicos + exames específicos por gênero';
    if (age < 60) return 'Exames de rastreamento de câncer + monitoramento cardiovascular';
    return 'Exames geriátricos + monitoramento de doenças crônicas';
  };

  return (
    <div className={clsx('space-y-6', className)}>
      {/* Header */}
      <div className="text-center space-y-3">
        <div className="flex items-center justify-center gap-3">
          <span className="text-3xl">🩺</span>
          <h2 className="text-2xl font-bold text-white print:text-slate-900">
            Exames Preventivos Personalizados
          </h2>
        </div>
        <p className="text-white/70 print:text-slate-600 max-w-2xl mx-auto">
          Recomendações baseadas na sua idade ({patientAge} anos), gênero ({patientGender === 'male' ? 'masculino' : 'feminino'}) e IMC ({bmiCategory})
        </p>
        <div className="bg-blue-500/20 border border-blue-400/30 rounded-xl p-3 max-w-md mx-auto">
          <p className="text-blue-200 text-sm font-medium">
            💡 {getAgeRecommendation(patientAge)}
          </p>
        </div>
      </div>

      {/* Priority Filter */}
      <div className="flex flex-wrap justify-center gap-2">
        {[
          { id: 'all', label: 'Todos', icon: '📋' },
          { id: 'high', label: 'Alta', icon: '🔥' },
          { id: 'medium', label: 'Média', icon: '⚡' },
          { id: 'low', label: 'Baixa', icon: '💡' }
        ].map(category => (
          <button
            key={category.id}
            onClick={() => setSelectedCategory(category.id as any)}
            className={clsx(
              'px-4 py-2 rounded-full text-sm font-medium transition-all duration-200',
              selectedCategory === category.id
                ? 'bg-white/20 text-white border border-white/40'
                : 'bg-white/5 text-white/70 border border-white/10 hover:bg-white/10'
            )}
          >
            <span className="mr-2">{category.icon}</span>
            {category.label}
          </button>
        ))}
      </div>

      {/* Exams Grid */}
      <div className="space-y-4">
        <AnimatePresence>
          {filteredExams.map((exam, index) => (
            <motion.div
              key={exam.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className={clsx(
                'rounded-2xl border bg-gradient-to-br p-4 cursor-pointer transition-all duration-300 hover:scale-105',
                priorityColors[exam.priority],
                completedExams.has(exam.name) && 'opacity-60 scale-95',
                'print:bg-white print:border-slate-200 print:text-slate-900'
              )}
              onClick={() => toggleExam(exam.name)}
            >
              <div className="flex items-start gap-4">
                <div className="text-2xl flex-shrink-0">{exam.icon}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-white print:text-slate-900 text-base">
                      {exam.name}
                    </h3>
                    <div className="flex items-center gap-2">
                      <span className={clsx(
                        'px-2 py-1 rounded-full text-xs font-bold border',
                        exam.priority === 'high' ? 'bg-red-500/20 text-red-200 border-red-400/40' :
                        exam.priority === 'medium' ? 'bg-amber-500/20 text-amber-200 border-amber-400/40' :
                        'bg-blue-500/20 text-blue-200 border-blue-400/40'
                      )}>
                        {priorityLabels[exam.priority].split(' ')[1]}
                      </span>
                      {completedExams.has(exam.name) && (
                        <span className="text-emerald-400 text-lg">✓</span>
                      )}
                    </div>
                  </div>
                  
                  <div className="grid gap-2 sm:grid-cols-3 text-sm">
                    <div>
                      <p className="text-white/60 print:text-slate-500 text-xs uppercase tracking-wide">
                        Frequência
                      </p>
                      <p className="text-white/90 print:text-slate-700 font-medium">
                        {exam.frequency}
                      </p>
                    </div>
                    <div>
                      <p className="text-white/60 print:text-slate-500 text-xs uppercase tracking-wide">
                        Preparo
                      </p>
                      <p className="text-white/90 print:text-slate-700 font-medium">
                        {exam.preparation}
                      </p>
                    </div>
                    <div className="sm:col-span-1 col-span-3">
                      <p className="text-white/60 print:text-slate-500 text-xs uppercase tracking-wide">
                        Por que fazer
                      </p>
                      <p className="text-white/80 print:text-slate-600 text-sm leading-relaxed">
                        {exam.why}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Summary */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="bg-white/5 rounded-xl p-4 border border-white/10 text-center">
          <div className="text-2xl font-bold text-white print:text-slate-900">
            {personalizedExams.length}
          </div>
          <div className="text-white/70 print:text-slate-600 text-sm">
            Exames Recomendados
          </div>
        </div>
        <div className="bg-white/5 rounded-xl p-4 border border-white/10 text-center">
          <div className="text-2xl font-bold text-emerald-400">
            {completedExams.size}
          </div>
          <div className="text-white/70 print:text-slate-600 text-sm">
            Concluídos
          </div>
        </div>
        <div className="bg-white/5 rounded-xl p-4 border border-white/10 text-center">
          <div className="text-2xl font-bold text-blue-400">
            {personalizedExams.length - completedExams.size}
          </div>
          <div className="text-white/70 print:text-slate-600 text-sm">
            Pendentes
          </div>
        </div>
      </div>

      {/* Completed Exams List */}
      {completedExams.size > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl border border-emerald-400/30 bg-emerald-500/10 p-4"
        >
          <h4 className="text-emerald-200 font-semibold mb-3">
            ✅ Exames Concluídos ({completedExams.size})
          </h4>
          <div className="flex flex-wrap gap-2">
            {Array.from(completedExams).map(exam => (
              <span
                key={exam}
                className="bg-emerald-500/20 text-emerald-200 px-3 py-1 rounded-full text-sm"
              >
                {exam}
              </span>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
}
