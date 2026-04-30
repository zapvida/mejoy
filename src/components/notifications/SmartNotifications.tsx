// src/components/notifications/SmartNotifications.tsx
// Sistema de notificações inteligentes e personalizadas

import React, { useState } from 'react';

export interface Notification {
  id: string;
  type: 'reminder' | 'achievement' | 'health' | 'promotion' | 'system';
  title: string;
  message: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  scheduledFor?: Date;
  conditions?: NotificationCondition[];
  actions?: NotificationAction[];
  read: boolean;
  createdAt: Date;
}

interface NotificationCondition {
  type: 'time' | 'location' | 'behavior' | 'health';
  operator: 'equals' | 'greater_than' | 'less_than' | 'contains';
  value: any;
}

interface NotificationAction {
  type: 'open_triage' | 'schedule_appointment' | 'view_results' | 'share';
  label: string;
  url?: string;
}

interface SmartNotificationsProps {
  userId: string;
  onNotificationClick?: (notification: Notification) => void;
}

// Configurações de notificações inteligentes
const NOTIFICATION_TEMPLATES = {
  triage_reminder: {
    type: 'reminder' as const,
    priority: 'medium' as const,
    conditions: [
      { type: 'time', operator: 'equals', value: 'weekly' },
      { type: 'behavior', operator: 'less_than', value: 'last_triage_days_7' }
    ],
    generateContent: (_user: any) => ({
      title: 'Lembrete de Triagem',
      message: `Olá! É hora de fazer sua triagem semanal de saúde.`
    })
  },
  
  achievement_unlock: {
    type: 'achievement' as const,
    priority: 'high' as const,
    conditions: [
      { type: 'behavior', operator: 'equals', value: 'achievement_unlocked' }
    ],
    generateContent: (_user: any, achievement: any) => ({
      title: '🏆 Conquista Desbloqueada!',
      message: `Parabéns! Você conquistou: ${achievement.title}`
    })
  },
  
  health_alert: {
    type: 'health' as const,
    priority: 'urgent' as const,
    conditions: [
      { type: 'health', operator: 'greater_than', value: 'risk_threshold' }
    ],
    generateContent: (_user: any, _healthData: any) => ({
      title: '⚠️ Alerta de Saúde',
      message: 'Detectamos sinais que requerem atenção médica.'
    })
  },
  
  improvement_tip: {
    type: 'health' as const,
    priority: 'low' as const,
    conditions: [
      { type: 'time', operator: 'equals', value: 'daily' },
      { type: 'behavior', operator: 'greater_than', value: 'engagement_score_0.7' }
    ],
    generateContent: (_user: any) => ({
      title: '💡 Dica de Saúde',
      message: 'Dica personalizada para melhorar sua saúde hoje!'
    })
  }
};

export function SmartNotifications({ userId: _userId, onNotificationClick: _onNotificationClick }: SmartNotificationsProps) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [settings, setSettings] = useState({
    enabled: true,
    frequency: 'daily',
    quietHours: { start: 22, end: 8 },
    types: {
      reminders: true,
      achievements: true,
      health: true,
      promotions: false,
      system: true
    }
  });

  // Gerar notificações inteligentes
  const generateSmartNotifications = async (userProfile: any) => {
    const newNotifications: Notification[] = [];

    // Verificar condições para cada template
    for (const [, template] of Object.entries(NOTIFICATION_TEMPLATES)) {
      const shouldSend = await checkNotificationConditions(template.conditions as NotificationCondition[], userProfile);
      
      if (shouldSend) {
        const content = template.generateContent(userProfile, {});
        const notification: Notification = {
          id: Math.random().toString(36).substr(2, 9),
          type: template.type,
          title: content.title,
          message: content.message,
          priority: template.priority,
          conditions: template.conditions as NotificationCondition[],
          read: false,
          createdAt: new Date()
        };
        
        newNotifications.push(notification);
      }
    }

    setNotifications(prev => [...prev, ...newNotifications]);
  };

  // Verificar condições de notificação
  const checkNotificationConditions = async (conditions: NotificationCondition[], userProfile: any) => {
    for (const condition of conditions) {
      const result = await evaluateCondition(condition, userProfile);
      if (!result) return false;
    }
    return true;
  };

  // Avaliar condição individual
  const evaluateCondition = async (condition: NotificationCondition, userProfile: any) => {
    switch (condition.type) {
      case 'time':
        return checkTimeCondition(condition, userProfile);
      case 'behavior':
        return checkBehaviorCondition(condition, userProfile);
      case 'health':
        return checkHealthCondition(condition, userProfile);
      default:
        return false;
    }
  };

  const checkTimeCondition = (_condition: NotificationCondition, _userProfile: any) => {
    const now = new Date();
    const hour = now.getHours();
    
    // Verificar horário silencioso
    if (hour >= settings.quietHours.start || hour < settings.quietHours.end) {
      return false;
    }
    
    // Verificar frequência
    if (_condition.value === 'daily') {
      return true; // Simplificado para demo
    }
    
    return true;
  };

  const checkBehaviorCondition = (_condition: NotificationCondition, _userProfile: any) => {
    // Simular verificação de comportamento
    return Math.random() > 0.5; // Simplificado para demo
  };

  const checkHealthCondition = (_condition: NotificationCondition, _userProfile: any) => {
    // Simular verificação de saúde
    return Math.random() > 0.8; // Simplificado para demo
  };

  // Marcar notificação como lida
  const markAsRead = (notificationId: string) => {
    setNotifications(prev =>
      prev.map(notif =>
        notif.id === notificationId ? { ...notif, read: true } : notif
      )
    );
  };

  // Remover notificação
  const removeNotification = (notificationId: string) => {
    setNotifications(prev => prev.filter(notif => notif.id !== notificationId));
  };

  // Agendar notificação
  const scheduleNotification = (notification: Omit<Notification, 'id' | 'createdAt'>) => {
    const newNotification: Notification = {
      ...notification,
      id: Math.random().toString(36).substr(2, 9),
      createdAt: new Date()
    };
    
    setNotifications(prev => [...prev, newNotification]);
  };

  return {
    notifications,
    settings,
    generateSmartNotifications,
    markAsRead,
    removeNotification,
    scheduleNotification,
    updateSettings: setSettings
  };
}

// Componente de lista de notificações
interface NotificationListProps {
  notifications: Notification[];
  onNotificationClick?: (notification: Notification) => void;
  onMarkAsRead?: (id: string) => void;
  onRemove?: (id: string) => void;
  className?: string;
}

export function NotificationList({ 
  notifications, 
  onNotificationClick, 
  onMarkAsRead, 
  onRemove,
  className = '' 
}: NotificationListProps) {
  const unreadCount = notifications.filter(n => !n.read).length;

  const getPriorityColor = (priority: Notification['priority']) => {
    switch (priority) {
      case 'urgent': return 'border-red-500 bg-red-50';
      case 'high': return 'border-orange-500 bg-orange-50';
      case 'medium': return 'border-yellow-500 bg-yellow-50';
      case 'low': return 'border-blue-500 bg-blue-50';
      default: return 'border-gray-500 bg-gray-50';
    }
  };

  const getTypeIcon = (type: Notification['type']) => {
    switch (type) {
      case 'reminder': return '⏰';
      case 'achievement': return '🏆';
      case 'health': return '🏥';
      case 'promotion': return '🎁';
      case 'system': return '⚙️';
      default: return '📢';
    }
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {unreadCount > 0 && (
        <div className="text-center">
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800">
            {unreadCount} não lidas
          </span>
        </div>
      )}
      
      {notifications.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <div className="text-4xl mb-2">📭</div>
          <p>Nenhuma notificação</p>
        </div>
      ) : (
        <div className="space-y-3">
          {notifications.map(notification => (
            <div
              key={notification.id}
              className={`
                p-4 rounded-lg border-l-4 cursor-pointer transition-all duration-200
                ${getPriorityColor(notification.priority)}
                ${!notification.read ? 'shadow-md' : 'opacity-75'}
                hover:shadow-lg
              `}
              onClick={() => {
                if (onNotificationClick) onNotificationClick(notification);
                if (onMarkAsRead && !notification.read) onMarkAsRead(notification.id);
              }}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <span className="text-lg">
                      {getTypeIcon(notification.type)}
                    </span>
                    <h3 className={`font-medium ${!notification.read ? 'font-semibold' : ''}`}>
                      {notification.title}
                    </h3>
                    {!notification.read && (
                      <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 mb-2">
                    {notification.message}
                  </p>
                  <div className="flex items-center space-x-4 text-xs text-gray-500">
                    <span>
                      {notification.createdAt.toLocaleDateString('pt-BR')}
                    </span>
                    <span className="capitalize">
                      {notification.priority}
                    </span>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  {!notification.read && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (onMarkAsRead) onMarkAsRead(notification.id);
                      }}
                      className="text-xs text-blue-600 hover:text-blue-800"
                    >
                      Marcar como lida
                    </button>
                  )}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (onRemove) onRemove(notification.id);
                    }}
                    className="text-xs text-gray-400 hover:text-gray-600"
                  >
                    ✕
                  </button>
                </div>
              </div>
              
              {notification.actions && notification.actions.length > 0 && (
                <div className="mt-3 flex space-x-2">
                  {notification.actions.map((action, index) => (
                    <button
                      key={index}
                      onClick={(e) => {
                        e.stopPropagation();
                        // Implementar ação
                      }}
                      className="px-3 py-1 text-xs bg-white rounded-md border border-gray-300 hover:bg-gray-50"
                    >
                      {action.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// Componente de configurações de notificação
interface NotificationSettingsProps {
  settings: any;
  onUpdateSettings: (settings: any) => void;
  className?: string;
}

export function NotificationSettings({ settings, onUpdateSettings, className = '' }: NotificationSettingsProps) {
  const updateSetting = (key: string, value: any) => {
    onUpdateSettings({
      ...settings,
      [key]: value
    });
  };

  const updateTypeSetting = (type: string, enabled: boolean) => {
    onUpdateSettings({
      ...settings,
      types: {
        ...settings.types,
        [type]: enabled
      }
    });
  };

  return (
    <div className={`bg-white rounded-lg shadow-md p-6 ${className}`}>
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        🔔 Configurações de Notificação
      </h3>
      
      <div className="space-y-6">
        {/* Habilitar/Desabilitar */}
        <div className="flex items-center justify-between">
          <div>
            <h4 className="font-medium text-gray-900">Notificações Ativas</h4>
            <p className="text-sm text-gray-600">Receber notificações do app</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={settings.enabled}
              onChange={(e) => updateSetting('enabled', e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
          </label>
        </div>

        {/* Tipos de notificação */}
        <div>
          <h4 className="font-medium text-gray-900 mb-3">Tipos de Notificação</h4>
          <div className="space-y-3">
            {Object.entries(settings.types).map(([type, enabled]) => (
              <div key={type} className="flex items-center justify-between">
                <span className="text-sm text-gray-700 capitalize">
                  {type === 'reminders' ? 'Lembretes' :
                   type === 'achievements' ? 'Conquistas' :
                   type === 'health' ? 'Saúde' :
                   type === 'promotions' ? 'Promoções' :
                   type === 'system' ? 'Sistema' : type}
                </span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={enabled as boolean}
                    onChange={(e) => updateTypeSetting(type, e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
                </label>
              </div>
            ))}
          </div>
        </div>

        {/* Frequência */}
        <div>
          <h4 className="font-medium text-gray-900 mb-2">Frequência</h4>
          <select
            value={settings.frequency}
            onChange={(e) => updateSetting('frequency', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            <option value="daily">Diária</option>
            <option value="weekly">Semanal</option>
            <option value="monthly">Mensal</option>
          </select>
        </div>

        {/* Horário silencioso */}
        <div>
          <h4 className="font-medium text-gray-900 mb-2">Horário Silencioso</h4>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-600 mb-1">Início</label>
              <input
                type="time"
                value={`${settings.quietHours.start.toString().padStart(2, '0')}:00`}
                onChange={(e) => {
                  const hour = parseInt(e.target.value.split(':')[0] || '0');
                  updateSetting('quietHours', { ...settings.quietHours, start: hour });
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">Fim</label>
              <input
                type="time"
                value={`${settings.quietHours.end.toString().padStart(2, '0')}:00`}
                onChange={(e) => {
                  const hour = parseInt(e.target.value.split(':')[0] || '0');
                  updateSetting('quietHours', { ...settings.quietHours, end: hour });
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
