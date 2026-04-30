// src/components/index.ts
// Exportações centralizadas de todos os componentes

// UI Components
export { LoadingSpinner, PageLoader, ButtonLoader } from './ui/LoadingSpinner';
export { Toast, useToast, ToastContainer } from './ui/Toast';
export { ProgressBar, CircularProgress, StepProgress } from './ui/ProgressBar';
export { Card, TriageCard, ResultCard, StatCard } from './ui/Card';

// Micro Interactions
export { 
  InteractiveButton, 
  InteractiveInput, 
  InteractiveCard, 
  AnimatedProgress, 
  Confetti, 
  useFadeIn 
} from './interactions/MicroInteractions';

// Gamification
export { 
  AchievementSystem, 
  AchievementNotification, 
  UserProfile 
} from './gamification/AchievementSystem';

// Personalization
export { 
  PersonalizationEngine, 
  PersonalizedDashboard, 
  usePersonalizedContent 
} from './personalization/PersonalizationEngine';

// Calculators
export { 
  BMICalculator, 
  CalorieCalculator, 
  WaterCalculator, 
  HealthCalculators 
} from './calculators/HealthCalculators';

// Notifications
export { 
  SmartNotifications, 
  NotificationList, 
  NotificationSettings 
} from './notifications/SmartNotifications';

// Types
export type { Notification } from './notifications/SmartNotifications';
export type { Achievement } from './gamification/AchievementSystem';
export type { UserProfile as PersonalizationUserProfile } from './personalization/PersonalizationEngine';
