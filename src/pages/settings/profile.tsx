'use client';

import { 
  UserIcon, 
  ShieldCheckIcon,
  BellIcon,
  ArrowLeftIcon,
  CheckIcon
} from '@heroicons/react/24/outline';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';

import LogoWithName from '@/components/ui/LogoWithName';
import { useGA4 } from '@/hooks/useGA4';
import { buildCanonical } from '@/lib/seo';

const ProfileSettingsPage = () => {
  const router = useRouter();
  const { trackEvent } = useGA4();
  const [isLoading, setIsLoading] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    birthDate: '',
    notifications: {
      email: true,
      sms: false,
      push: true
    },
    privacy: {
      dataSharing: false,
      analytics: true,
      marketing: false
    }
  });

  useEffect(() => {
    trackEvent('page_view', {
      page_title: 'Profile Settings - MeJoy Plus',
      page_location: window.location.href
    });

    // Simular carregamento de dados do usuário
    setTimeout(() => {
      setFormData({
        name: 'João Silva',
        email: 'joao@example.com',
        phone: '+55 11 99999-9999',
        birthDate: '1990-01-01',
        notifications: {
          email: true,
          sms: false,
          push: true
        },
        privacy: {
          dataSharing: false,
          analytics: true,
          marketing: false
        }
      });
    }, 500);
  }, [trackEvent]);

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleNestedChange = (parent: string, field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [parent]: {
        ...(prev[parent as keyof typeof prev] as any),
        [field]: value
      }
    }));
  };

  const handleSave = async () => {
    setIsLoading(true);
    
    try {
      trackEvent('profile_save_click', {
        page: 'profile_settings'
      });

      // Simular salvamento
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 3000);
    } catch (error) {
      console.error('Save error:', error);
      alert('Erro ao salvar configurações. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteAccount = () => {
    trackEvent('delete_account_click', {
      page: 'profile_settings'
    });
    
    if (confirm('Tem certeza que deseja excluir sua conta? Esta ação não pode ser desfeita.')) {
      // Implementar exclusão da conta
      console.log('Delete account');
    }
  };

  return (
    <>
      <Head>
        <title>Configurações do Perfil - MeJoy Plus</title>
        <meta name="description" content="Gerencie suas informações pessoais e configurações de privacidade." />
        <meta property="og:title" content="Configurações do Perfil - MeJoy Plus" />
        <meta property="og:description" content="Gerencie suas informações pessoais e configurações de privacidade." />
        <link rel="canonical" href={buildCanonical('/settings/profile')} />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-900">
        {/* Header */}
        <div className="bg-zinc-900/50 backdrop-blur-sm border-b border-zinc-700">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => router.push('/dashboard')}
                  className="text-zinc-300 hover:text-white transition-colors"
                >
                  <ArrowLeftIcon className="h-6 w-6" />
                </button>
                <LogoWithName size="small" variant="inverse" priority />
                <span className="text-xl font-bold text-white">MeJoy Plus</span>
              </div>
              <button
                onClick={() => router.push('/dashboard')}
                className="text-zinc-300 hover:text-white transition-colors"
              >
                Voltar ao Dashboard
              </button>
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">
              Configurações do Perfil
            </h1>
            <p className="text-zinc-300">
              Gerencie suas informações pessoais e configurações de privacidade
            </p>
          </div>

          {/* Personal Information */}
          <div className="bg-zinc-800 rounded-2xl p-6 mb-8 border border-zinc-700">
            <h2 className="text-xl font-semibold text-white mb-6 flex items-center space-x-2">
              <UserIcon className="h-6 w-6" />
              <span>Informações Pessoais</span>
            </h2>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-2">
                  Nome Completo
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className="w-full bg-zinc-700 border border-zinc-600 rounded-xl px-4 py-3 text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Seu nome completo"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-2">
                  E-mail
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className="w-full bg-zinc-700 border border-zinc-600 rounded-xl px-4 py-3 text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="seu@email.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-2">
                  Telefone
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  className="w-full bg-zinc-700 border border-zinc-600 rounded-xl px-4 py-3 text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="+55 11 99999-9999"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-2">
                  Data de Nascimento
                </label>
                <input
                  type="date"
                  value={formData.birthDate}
                  onChange={(e) => handleInputChange('birthDate', e.target.value)}
                  className="w-full bg-zinc-700 border border-zinc-600 rounded-xl px-4 py-3 text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Notifications */}
          <div className="bg-zinc-800 rounded-2xl p-6 mb-8 border border-zinc-700">
            <h2 className="text-xl font-semibold text-white mb-6 flex items-center space-x-2">
              <BellIcon className="h-6 w-6" />
              <span>Notificações</span>
            </h2>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-medium text-white">E-mail</h3>
                  <p className="text-zinc-400">Receber notificações por e-mail</p>
                </div>
                <button
                  onClick={() => handleNestedChange('notifications', 'email', !formData.notifications.email)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    formData.notifications.email ? 'bg-blue-600' : 'bg-zinc-600'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      formData.notifications.email ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-medium text-white">SMS</h3>
                  <p className="text-zinc-400">Receber notificações por SMS</p>
                </div>
                <button
                  onClick={() => handleNestedChange('notifications', 'sms', !formData.notifications.sms)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    formData.notifications.sms ? 'bg-blue-600' : 'bg-zinc-600'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      formData.notifications.sms ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-medium text-white">Push</h3>
                  <p className="text-zinc-400">Receber notificações push no navegador</p>
                </div>
                <button
                  onClick={() => handleNestedChange('notifications', 'push', !formData.notifications.push)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    formData.notifications.push ? 'bg-blue-600' : 'bg-zinc-600'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      formData.notifications.push ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>

          {/* Privacy */}
          <div className="bg-zinc-800 rounded-2xl p-6 mb-8 border border-zinc-700">
            <h2 className="text-xl font-semibold text-white mb-6 flex items-center space-x-2">
              <ShieldCheckIcon className="h-6 w-6" />
              <span>Privacidade</span>
            </h2>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-medium text-white">Compartilhamento de Dados</h3>
                  <p className="text-zinc-400">Permitir compartilhamento de dados para pesquisa</p>
                </div>
                <button
                  onClick={() => handleNestedChange('privacy', 'dataSharing', !formData.privacy.dataSharing)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    formData.privacy.dataSharing ? 'bg-blue-600' : 'bg-zinc-600'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      formData.privacy.dataSharing ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-medium text-white">Analytics</h3>
                  <p className="text-zinc-400">Permitir coleta de dados para melhorar o serviço</p>
                </div>
                <button
                  onClick={() => handleNestedChange('privacy', 'analytics', !formData.privacy.analytics)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    formData.privacy.analytics ? 'bg-blue-600' : 'bg-zinc-600'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      formData.privacy.analytics ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-medium text-white">Marketing</h3>
                  <p className="text-zinc-400">Receber comunicações de marketing</p>
                </div>
                <button
                  onClick={() => handleNestedChange('privacy', 'marketing', !formData.privacy.marketing)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    formData.privacy.marketing ? 'bg-blue-600' : 'bg-zinc-600'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      formData.privacy.marketing ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between">
            <button
              onClick={handleDeleteAccount}
              className="text-red-400 hover:text-red-300 transition-colors"
            >
              Excluir Conta
            </button>

            <div className="flex items-center space-x-4">
              {isSaved && (
                <div className="flex items-center space-x-2 text-green-400">
                  <CheckIcon className="h-5 w-5" />
                  <span>Salvo!</span>
                </div>
              )}
              <button
                onClick={handleSave}
                disabled={isLoading}
                className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white px-8 py-3 rounded-xl font-semibold transition-colors"
              >
                {isLoading ? 'Salvando...' : 'Salvar Alterações'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProfileSettingsPage;
