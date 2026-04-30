// src/components/gamification/AchievementSystem.tsx
// Sistema de conquistas e gamificação

import React, { useState, useEffect } from 'react';

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  points: number;
  category: 'triage' | 'health' | 'engagement' | 'milestone';
  unlocked: boolean;
  unlockedAt?: Date;
  progress?: number;
  maxProgress?: number;
}

interface AchievementSystemProps {
  userId?: string;
  onAchievementUnlocked?: (achievement: Achievement) => void;
}

// Conquistas pré-definidas
const ACHIEVEMENTS: Achievement[] = [
  {
    id: 'first_triage',
    title: 'Primeira Triagem',
    description: 'Complete sua primeira triagem de saúde',
    icon: '🎯',
    points: 10,
    category: 'triage',
    unlocked: false
  },
  {
    id: 'triple_triage',
    title: 'Triple Crown',
    description: 'Complete 3 triagens diferentes',
    icon: '👑',
    points: 25,
    category: 'triage',
    unlocked: false,
    progress: 0,
    maxProgress: 3
  },
  {
    id: 'health_explorer',
    title: 'Explorador da Saúde',
    description: 'Complete 5 triagens diferentes',
    icon: '🧭',
    points: 50,
    category: 'triage',
    unlocked: false,
    progress: 0,
    maxProgress: 5
  },
  {
    id: 'perfect_score',
    title: 'Perfeição',
    description: 'Alcance score 10/10 em qualquer triagem',
    icon: '💯',
    points: 30,
    category: 'health',
    unlocked: false
  },
  {
    id: 'improvement_master',
    title: 'Mestre da Melhoria',
    description: 'Melhore seu score em 3 pontos ou mais',
    icon: '📈',
    points: 40,
    category: 'health',
    unlocked: false
  },
  {
    id: 'weekly_warrior',
    title: 'Guerreiro Semanal',
    description: 'Use o app por 7 dias consecutivos',
    icon: '🗓️',
    points: 35,
    category: 'engagement',
    unlocked: false,
    progress: 0,
    maxProgress: 7
  },
  {
    id: 'health_champion',
    title: 'Campeão da Saúde',
    description: 'Complete todas as triagens disponíveis',
    icon: '🏆',
    points: 100,
    category: 'milestone',
    unlocked: false
  }
];

export function AchievementSystem({ userId: _userId, onAchievementUnlocked }: AchievementSystemProps) {
  const [achievements, setAchievements] = useState<Achievement[]>(ACHIEVEMENTS);
  const [totalPoints, setTotalPoints] = useState(0);
  const [level, setLevel] = useState(1);

  // Calcular pontos totais e nível
  useEffect(() => {
    const unlockedAchievements = achievements.filter(a => a.unlocked);
    const points = unlockedAchievements.reduce((sum, a) => sum + a.points, 0);
    const newLevel = Math.floor(points / 100) + 1;
    
    setTotalPoints(points);
    setLevel(newLevel);
  }, [achievements]);

  // Desbloquear conquista
  const unlockAchievement = (achievementId: string) => {
    setAchievements(prev => 
      prev.map(achievement => {
        if (achievement.id === achievementId && !achievement.unlocked) {
          const unlockedAchievement = {
            ...achievement,
            unlocked: true,
            unlockedAt: new Date()
          };
          
          // Notificar callback
          if (onAchievementUnlocked) {
            onAchievementUnlocked(unlockedAchievement);
          }
          
          return unlockedAchievement;
        }
        return achievement;
      })
    );
  };

  // Atualizar progresso de conquista
  const updateProgress = (achievementId: string, progress: number) => {
    setAchievements(prev => 
      prev.map(achievement => {
        if (achievement.id === achievementId && achievement.maxProgress) {
          const newProgress = Math.min(progress, achievement.maxProgress);
          const updatedAchievement = {
            ...achievement,
            progress: newProgress
          };
          
          // Auto-desbloquear se progresso completo
          if (newProgress >= achievement.maxProgress && !achievement.unlocked) {
            unlockAchievement(achievementId);
          }
          
          return updatedAchievement;
        }
        return achievement;
      })
    );
  };

  return {
    achievements,
    totalPoints,
    level,
    unlockAchievement,
    updateProgress
  };
}

// Componente de notificação de conquista
interface AchievementNotificationProps {
  achievement: Achievement;
  onClose: () => void;
}

export function AchievementNotification({ achievement, onClose }: AchievementNotificationProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onClose, 300);
    }, 4000);

    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className={`
      fixed top-4 right-4 z-50 max-w-sm w-full
      transform transition-all duration-500 ease-out
      ${isVisible ? 'translate-x-0 opacity-100 scale-100' : 'translate-x-full opacity-0 scale-95'}
    `}>
      <div className="bg-gradient-to-r from-yellow-400 to-orange-500 rounded-lg shadow-xl p-4 text-white">
        <div className="flex items-center space-x-3">
          <div className="text-3xl animate-bounce">
            {achievement.icon}
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-lg">
              Conquista Desbloqueada!
            </h3>
            <p className="text-sm font-medium">
              {achievement.title}
            </p>
            <p className="text-xs opacity-90">
              +{achievement.points} pontos
            </p>
          </div>
          <button
            onClick={() => {
              setIsVisible(false);
              setTimeout(onClose, 300);
            }}
            className="text-white hover:text-gray-200"
          >
            ✕
          </button>
        </div>
      </div>
    </div>
  );
}

// Componente de perfil do usuário com gamificação
interface UserProfileProps {
  name: string;
  level: number;
  totalPoints: number;
  achievements: Achievement[];
  className?: string;
}

export function UserProfile({ name, level, totalPoints, achievements, className = '' }: UserProfileProps) {
  const unlockedAchievements = achievements.filter(a => a.unlocked);
  const currentLevelPoints = totalPoints - ((level - 1) * 100);
  const progressToNextLevel = (currentLevelPoints / 100) * 100;

  return (
    <div className={`bg-white rounded-lg shadow-md p-6 ${className}`}>
      <div className="text-center mb-6">
        <div className="w-20 h-20 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
          <span className="text-2xl font-bold text-white">
            {level}
          </span>
        </div>
        <h2 className="text-xl font-bold text-gray-900">{name}</h2>
        <p className="text-gray-600">Nível {level} • {totalPoints} pontos</p>
      </div>

      {/* Barra de progresso para próximo nível */}
      <div className="mb-6">
        <div className="flex justify-between text-sm text-gray-600 mb-2">
          <span>Progresso para nível {level + 1}</span>
          <span>{currentLevelPoints}/100</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-gradient-to-r from-green-400 to-blue-500 h-2 rounded-full transition-all duration-500"
            style={{ width: `${progressToNextLevel}%` }}
          />
        </div>
      </div>

      {/* Conquistas */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Conquistas ({unlockedAchievements.length}/{achievements.length})
        </h3>
        <div className="grid grid-cols-2 gap-3">
          {achievements.map(achievement => (
            <div
              key={achievement.id}
              className={`
                p-3 rounded-lg border-2 transition-all duration-200
                ${achievement.unlocked 
                  ? 'bg-green-50 border-green-200' 
                  : 'bg-gray-50 border-gray-200 opacity-60'
                }
              `}
            >
              <div className="flex items-center space-x-2">
                <span className="text-lg">
                  {achievement.unlocked ? achievement.icon : '🔒'}
                </span>
                <div className="flex-1 min-w-0">
                  <p className={`text-sm font-medium ${
                    achievement.unlocked ? 'text-gray-900' : 'text-gray-500'
                  }`}>
                    {achievement.title}
                  </p>
                  <p className="text-xs text-gray-500">
                    +{achievement.points} pts
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
