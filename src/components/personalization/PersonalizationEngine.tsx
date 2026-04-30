// src/components/personalization/PersonalizationEngine.tsx
// Sistema de personalização avançada baseado em dados do usuário

import React, { useState, useEffect } from 'react';

export interface UserProfile {
  id: string;
  name: string;
  age: number;
  sex: 'M' | 'F' | 'O';
  preferences: {
    theme: 'light' | 'dark' | 'auto';
    language: 'pt-BR' | 'en-US';
    notifications: boolean;
    animations: boolean;
    accessibility: {
      highContrast: boolean;
      largeText: boolean;
      reducedMotion: boolean;
    };
  };
  healthData: {
    bmi: number;
    conditions: string[];
    medications: string[];
    allergies: string[];
  };
  behaviorData: {
    triageHistory: string[];
    completionRate: number;
    averageTime: number;
    preferredTimeOfDay: 'morning' | 'afternoon' | 'evening';
  };
}

interface PersonalizationEngineProps {
  userId: string;
  onProfileUpdate?: (profile: UserProfile) => void;
}

// Configurações personalizadas por perfil
const PERSONALIZATION_CONFIG = {
  themes: {
    light: {
      primary: '#00D084',
      secondary: '#f0f9f6',
      text: '#1a1a1a',
      background: '#ffffff'
    },
    dark: {
      primary: '#00D084',
      secondary: '#1a1a1a',
      text: '#ffffff',
      background: '#0a0a0a'
    }
  },
  
  ageGroups: {
    child: { min: 0, max: 12, emoji: '👶', tone: 'friendly' },
    teen: { min: 13, max: 19, emoji: '🧑‍🎓', tone: 'energetic' },
    young: { min: 20, max: 35, emoji: '👨‍💼', tone: 'professional' },
    middle: { min: 36, max: 55, emoji: '👨‍💻', tone: 'balanced' },
    senior: { min: 56, max: 100, emoji: '👴', tone: 'respectful' }
  },

  healthConditions: {
    diabetes: { priority: 'high', color: 'red', icon: '🍯' },
    hypertension: { priority: 'high', color: 'red', icon: '❤️' },
    depression: { priority: 'high', color: 'orange', icon: '🧠' },
    obesity: { priority: 'medium', color: 'yellow', icon: '⚖️' },
    asthma: { priority: 'medium', color: 'blue', icon: '🫁' }
  }
};

export function PersonalizationEngine({ userId, onProfileUpdate }: PersonalizationEngineProps) {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [personalizedContent, setPersonalizedContent] = useState<any>(null);

  // Carregar perfil do usuário
  useEffect(() => {
    // Simular carregamento do perfil
    const mockProfile: UserProfile = {
      id: userId,
      name: 'Usuário',
      age: 30,
      sex: 'M',
      preferences: {
        theme: 'light',
        language: 'pt-BR',
        notifications: true,
        animations: true,
        accessibility: {
          highContrast: false,
          largeText: false,
          reducedMotion: false
        }
      },
      healthData: {
        bmi: 25.5,
        conditions: [],
        medications: [],
        allergies: []
      },
      behaviorData: {
        triageHistory: [],
        completionRate: 0.85,
        averageTime: 8.5,
        preferredTimeOfDay: 'evening'
      }
    };

    setProfile(mockProfile);
  }, [userId]);

  // Gerar conteúdo personalizado
  useEffect(() => {
    if (!profile) return;

    const personalized = generatePersonalizedContent(profile);
    setPersonalizedContent(personalized);
  }, [profile]);

  const generatePersonalizedContent = (userProfile: UserProfile) => {
    const ageGroup = getAgeGroup(userProfile.age);
    const healthPriority = getHealthPriority(userProfile.healthData);

    return {
      greeting: generateGreeting(userProfile, ageGroup),
      recommendations: generateRecommendations(userProfile, healthPriority),
      ui: generateUIPreferences(userProfile.preferences),
      content: generateContentTone(userProfile, ageGroup),
      timing: generateTimingPreferences(userProfile.behaviorData)
    };
  };

  const getAgeGroup = (age: number) => {
    for (const [key, config] of Object.entries(PERSONALIZATION_CONFIG.ageGroups)) {
      if (age >= config.min && age <= config.max) {
        return { key, ...config };
      }
    }
    return { key: 'senior', ...PERSONALIZATION_CONFIG.ageGroups.senior };
  };

  const getHealthPriority = (healthData: UserProfile['healthData']) => {
    const priorities = healthData.conditions.map(condition => 
      PERSONALIZATION_CONFIG.healthConditions[condition as keyof typeof PERSONALIZATION_CONFIG.healthConditions]
    ).filter(Boolean);

    return {
      level: priorities.some(p => p?.priority === 'high') ? 'high' : 'medium',
      conditions: priorities,
      bmiCategory: getBMICategory(healthData.bmi)
    };
  };

  const getBMICategory = (bmi: number) => {
    if (bmi < 18.5) return 'underweight';
    if (bmi < 25) return 'normal';
    if (bmi < 30) return 'overweight';
    return 'obese';
  };

  const generateGreeting = (profile: UserProfile, ageGroup: any) => {
    const timeOfDay = new Date().getHours() < 12 ? 'Bom dia' : 
                     new Date().getHours() < 18 ? 'Boa tarde' : 'Boa noite';
    
    return {
      text: `${timeOfDay}, ${profile.name}! ${ageGroup.emoji}`,
      tone: ageGroup.tone,
      personalization: `Baseado no seu perfil de ${ageGroup.key}`
    };
  };

  const generateRecommendations = (profile: UserProfile, healthPriority: any) => {
    const recommendations = [];

    // Recomendações baseadas em idade
    if (profile.age > 50) {
      recommendations.push({
        type: 'preventive',
        title: 'Check-up Preventivo',
        description: 'Recomendamos exames regulares para sua faixa etária',
        priority: 'high'
      });
    }

    // Recomendações baseadas em condições
    if (healthPriority.level === 'high') {
      recommendations.push({
        type: 'monitoring',
        title: 'Monitoramento Contínuo',
        description: 'Suas condições requerem acompanhamento regular',
        priority: 'high'
      });
    }

    // Recomendações baseadas em comportamento
    if (profile.behaviorData.completionRate < 0.7) {
      recommendations.push({
        type: 'engagement',
        title: 'Triagens Mais Curtas',
        description: 'Sugerimos triagens mais objetivas para você',
        priority: 'medium'
      });
    }

    return recommendations;
  };

  const generateUIPreferences = (preferences: UserProfile['preferences']) => {
    const themeKey = preferences.theme === 'auto' ? 'light' : preferences.theme;
    return {
      theme: PERSONALIZATION_CONFIG.themes[themeKey as keyof typeof PERSONALIZATION_CONFIG.themes],
      animations: preferences.animations,
      accessibility: preferences.accessibility,
      fontSize: preferences.accessibility.largeText ? 'large' : 'normal',
      contrast: preferences.accessibility.highContrast ? 'high' : 'normal'
    };
  };

  const generateContentTone = (profile: UserProfile, ageGroup: any) => {
    return {
      tone: ageGroup.tone,
      complexity: profile.age > 60 ? 'simple' : 'detailed',
      urgency: profile.healthData.conditions.length > 0 ? 'moderate' : 'low'
    };
  };

  const generateTimingPreferences = (behaviorData: UserProfile['behaviorData']) => {
    return {
      optimalTime: behaviorData.preferredTimeOfDay,
      reminderFrequency: behaviorData.completionRate > 0.8 ? 'weekly' : 'daily',
      sessionLength: behaviorData.averageTime < 10 ? 'short' : 'standard'
    };
  };

  const updateProfile = (updates: Partial<UserProfile>) => {
    if (!profile) return;
    
    const updatedProfile = { ...profile, ...updates };
    setProfile(updatedProfile);
    
    if (onProfileUpdate) {
      onProfileUpdate(updatedProfile);
    }
  };

  return {
    profile,
    personalizedContent,
    updateProfile,
    isLoaded: !!profile && !!personalizedContent
  };
}

// Componente de dashboard personalizado
interface PersonalizedDashboardProps {
  userId: string;
  className?: string;
}

export function PersonalizedDashboard({ userId, className = '' }: PersonalizedDashboardProps) {
  const { profile, personalizedContent, isLoaded } = PersonalizationEngine({ userId });

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
      </div>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Saudação personalizada */}
      <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          {personalizedContent.greeting.text}
        </h1>
        <p className="text-gray-600">
          {personalizedContent.greeting.personalization}
        </p>
      </div>

      {/* Recomendações personalizadas */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {personalizedContent.recommendations.map((rec: any, index: number) => (
          <div
            key={index}
            className={`
              p-4 rounded-lg border-l-4
              ${rec.priority === 'high' 
                ? 'border-red-500 bg-red-50' 
                : 'border-yellow-500 bg-yellow-50'
              }
            `}
          >
            <h3 className="font-semibold text-gray-900">{rec.title}</h3>
            <p className="text-sm text-gray-600 mt-1">{rec.description}</p>
          </div>
        ))}
      </div>

      {/* Estatísticas personalizadas */}
      <div className="grid grid-cols-3 gap-4">
        <div className="text-center p-4 bg-white rounded-lg shadow">
          <div className="text-2xl font-bold text-green-600">
            {profile?.behaviorData.completionRate ? Math.round(profile.behaviorData.completionRate * 100) : 0}%
          </div>
          <div className="text-sm text-gray-600">Taxa de Conclusão</div>
        </div>
        <div className="text-center p-4 bg-white rounded-lg shadow">
          <div className="text-2xl font-bold text-blue-600">
            {profile?.behaviorData.triageHistory.length}
          </div>
          <div className="text-sm text-gray-600">Triagens Realizadas</div>
        </div>
        <div className="text-center p-4 bg-white rounded-lg shadow">
          <div className="text-2xl font-bold text-purple-600">
            {profile?.behaviorData.averageTime}min
          </div>
          <div className="text-sm text-gray-600">Tempo Médio</div>
        </div>
      </div>
    </div>
  );
}

// Hook para personalização de conteúdo
export function usePersonalizedContent(userId: string) {
  const { profile, personalizedContent, updateProfile } = PersonalizationEngine({ userId });

  const getPersonalizedGreeting = () => {
    if (!personalizedContent) return 'Olá!';
    return personalizedContent.greeting.text;
  };

  const getPersonalizedRecommendations = () => {
    if (!personalizedContent) return [];
    return personalizedContent.recommendations;
  };

  const getPersonalizedTheme = () => {
    if (!personalizedContent) return PERSONALIZATION_CONFIG.themes.light;
    return personalizedContent.ui.theme;
  };

  const updateUserPreferences = (preferences: Partial<UserProfile['preferences']>) => {
    if (!profile) return;
    updateProfile({ preferences: { ...profile.preferences, ...preferences } });
  };

  return {
    profile,
    personalizedContent,
    getPersonalizedGreeting,
    getPersonalizedRecommendations,
    getPersonalizedTheme,
    updateUserPreferences,
    isLoaded: !!profile && !!personalizedContent
  };
}
