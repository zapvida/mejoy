import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';

import LoggedLayout from '@/components/layout/LoggedLayout';
import { useAuth } from '@/context/AuthContext';
import { useProfile } from '@/hooks/useProfile';
import { useDashboardData } from '@/hooks/useDashboardData';

export default function PerfilPage() {
  const router = useRouter();
  const { user, loading: authLoading, signOut } = useAuth();
  const { profile, loading: profileLoading, updateProfile, updating } = useProfile();
  const { stats } = useDashboardData();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    whatsapp: '',
    birth_date: '',
    sex: '',
    weight_kg: '',
    height_cm: '',
  });

  useEffect(() => {
    if (!authLoading && !user) {
      router.replace('/login?redirect=/perfil');
    }
  }, [authLoading, user, router]);

  // Inicializar formData quando profile carregar
  useEffect(() => {
    if (profile && !isEditing) {
      setFormData({
        name: profile.name || '',
        whatsapp: profile.whatsapp || '',
        birth_date: profile.birth_date ? new Date(profile.birth_date).toISOString().split('T')[0] : '',
        sex: profile.sex || '',
        weight_kg: profile.weight_kg?.toString() || '',
        height_cm: profile.height_cm?.toString() || '',
      });
    }
  }, [profile, isEditing]);

  if (authLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500" />
      </div>
    );
  }

  const calculateBMI = (height: number | null, weight: number | null) => {
    if (!height || !weight || height === 0 || weight === 0) return 0;
    const heightInMeters = height / 100;
    return (weight / (heightInMeters * heightInMeters)).toFixed(1);
  };

  const getBMICategory = (bmi: number) => {
    if (bmi < 18.5) return { category: 'Abaixo do peso', color: 'text-blue-600', bgColor: 'bg-blue-50', borderColor: 'border-blue-200' };
    if (bmi < 25) return { category: 'Peso normal', color: 'text-green-600', bgColor: 'bg-green-50', borderColor: 'border-green-200' };
    if (bmi < 30) return { category: 'Sobrepeso', color: 'text-yellow-600', bgColor: 'bg-yellow-50', borderColor: 'border-yellow-200' };
    return { category: 'Obesidade', color: 'text-red-600', bgColor: 'bg-red-50', borderColor: 'border-red-200' };
  };

  const formatarData = (data: string | null) => {
    if (!data) return 'Não informado';
    return new Date(data).toLocaleDateString('pt-BR');
  };

  const formatarSexo = (sex: string | null) => {
    if (!sex) return 'Não informado';
    const map: Record<string, string> = {
      'male': 'Masculino',
      'female': 'Feminino',
      'undisclosed': 'Não informado',
    };
    return map[sex] || sex;
  };

  const handleSave = async () => {
    try {
      await updateProfile({
        name: formData.name || undefined,
        whatsapp: formData.whatsapp || undefined,
        birth_date: formData.birth_date || undefined,
        sex: formData.sex || undefined,
        weight_kg: formData.weight_kg ? parseFloat(formData.weight_kg) : undefined,
        height_cm: formData.height_cm ? parseFloat(formData.height_cm) : undefined,
      });
      setIsEditing(false);
    } catch (error) {
      console.error('Erro ao salvar perfil:', error);
    }
  };

  const height = profile?.height_cm || null;
  const weight = profile?.weight_kg || null;
  const bmi = calculateBMI(height, weight);
  const bmiCategory = bmi ? getBMICategory(parseFloat(bmi)) : null;

  return (
    <>
      <Head>
        <title>Meu Perfil | Me Joy</title>
        <meta name="description" content="Gerencie suas informações pessoais e acompanhe seus dados de saúde" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>

      <LoggedLayout>
      <main className="min-h-screen bg-white text-gray-900">
        <div className="max-w-6xl mx-auto px-4 py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl md:text-5xl font-bold text-gray-900 mb-3">
              Meu Perfil
            </h1>
            <p className="text-gray-600 text-lg">
              Gerencie suas informações pessoais e acompanhe seus dados de saúde
            </p>
          </div>

          <div className="grid gap-8 lg:grid-cols-3">
            {/* Informações Pessoais */}
            <div className="lg:col-span-2 space-y-8">
              {/* Dados Básicos */}
              <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                  <div className="h-10 w-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center">
                    <span className="text-xl">👤</span>
                  </div>
                  Informações Pessoais
                </h2>
                
                {profileLoading ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500 mx-auto"></div>
                  </div>
                ) : profile ? (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm text-gray-500 mb-2 font-medium">Nome Completo</label>
                        {isEditing ? (
                          <input
                            type="text"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                          />
                        ) : (
                          <p className="text-gray-900 font-semibold text-lg">{profile.name || 'Não informado'}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm text-gray-500 mb-2 font-medium">Email</label>
                        <p className="text-gray-900 font-semibold text-lg">{profile.email || 'Não informado'}</p>
                      </div>

                      <div>
                        <label className="block text-sm text-gray-500 mb-2 font-medium">WhatsApp</label>
                        {isEditing ? (
                          <input
                            type="text"
                            value={formData.whatsapp}
                            onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                            placeholder="+55 11 99999-9999"
                          />
                        ) : (
                          <p className="text-gray-900 font-semibold text-lg">{profile.whatsapp || 'Não informado'}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm text-gray-500 mb-2 font-medium">Data de Nascimento</label>
                        {isEditing ? (
                          <input
                            type="date"
                            value={formData.birth_date}
                            onChange={(e) => setFormData({ ...formData, birth_date: e.target.value })}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                          />
                        ) : (
                          <p className="text-gray-900 font-semibold text-lg">{formatarData(profile.birth_date)}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm text-gray-500 mb-2 font-medium">Sexo</label>
                        {isEditing ? (
                          <select
                            value={formData.sex}
                            onChange={(e) => setFormData({ ...formData, sex: e.target.value })}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                          >
                            <option value="">Selecione</option>
                            <option value="male">Masculino</option>
                            <option value="female">Feminino</option>
                            <option value="undisclosed">Não informar</option>
                          </select>
                        ) : (
                          <p className="text-gray-900 font-semibold text-lg">{formatarSexo(profile.sex)}</p>
                        )}
                      </div>
                    </div>

                    {!isEditing && (
                      <div className="mt-6">
                        <button
                          onClick={() => setIsEditing(true)}
                          className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all"
                        >
                          ✏️ Editar Perfil
                        </button>
                      </div>
                    )}
                    {isEditing && (
                      <div className="mt-6 flex gap-3">
                        <button
                          onClick={handleSave}
                          disabled={updating}
                          className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all disabled:opacity-50"
                        >
                          {updating ? 'Salvando...' : 'Salvar'}
                        </button>
                        <button
                          onClick={() => {
                            setIsEditing(false);
                            // Resetar formData
                            if (profile) {
                              setFormData({
                                name: profile.name || '',
                                whatsapp: profile.whatsapp || '',
                                birth_date: profile.birth_date ? new Date(profile.birth_date).toISOString().split('T')[0] : '',
                                sex: profile.sex || '',
                                weight_kg: profile.weight_kg?.toString() || '',
                                height_cm: profile.height_cm?.toString() || '',
                              });
                            }
                          }}
                          className="px-6 py-3 bg-gray-200 text-gray-700 rounded-xl font-semibold hover:bg-gray-300 transition-all"
                        >
                          Cancelar
                        </button>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-500 mb-4">Nenhuma informação disponível</p>
                    <p className="text-sm text-gray-400">Complete uma triagem para criar seu perfil</p>
                  </div>
                )}
              </div>

              {/* Dados de Saúde */}
              <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                  <div className="h-10 w-10 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-xl flex items-center justify-center">
                    <span className="text-xl">🏃</span>
                  </div>
                  Dados de Saúde
                </h2>
                
                {profileLoading ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
                  </div>
                ) : profile ? (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                      <div>
                        <label className="block text-sm text-gray-500 mb-2 font-medium">Altura (cm)</label>
                        {isEditing ? (
                          <input
                            type="number"
                            value={formData.height_cm}
                            onChange={(e) => setFormData({ ...formData, height_cm: e.target.value })}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="175"
                          />
                        ) : (
                          <p className="text-gray-900 font-semibold text-lg">{profile.height_cm ? `${profile.height_cm} cm` : 'Não informado'}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm text-gray-500 mb-2 font-medium">Peso (kg)</label>
                        {isEditing ? (
                          <input
                            type="number"
                            step="0.1"
                            value={formData.weight_kg}
                            onChange={(e) => setFormData({ ...formData, weight_kg: e.target.value })}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="70"
                          />
                        ) : (
                          <p className="text-gray-900 font-semibold text-lg">{profile.weight_kg ? `${profile.weight_kg} kg` : 'Não informado'}</p>
                        )}
                      </div>
                    </div>

                    {/* IMC */}
                    {bmi && bmiCategory && (
                      <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200">
                        <div className="flex items-center justify-between mb-4">
                          <span className="text-sm text-gray-600 font-medium">IMC (Índice de Massa Corporal)</span>
                          <span className={`text-3xl font-bold ${bmiCategory.color}`}>{bmi}</span>
                        </div>
                        <div className={`inline-block px-4 py-2 rounded-xl text-sm font-medium ${bmiCategory.bgColor} ${bmiCategory.color} border ${bmiCategory.borderColor}`}>
                          {bmiCategory.category}
                        </div>
                      </div>
                    )}
                  </>
                ) : (
                  <p className="text-gray-500 text-center py-4">Complete uma triagem para preencher seus dados de saúde</p>
                )}
              </div>

              {/* Estatísticas de Saúde */}
              <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                  <div className="h-10 w-10 bg-gradient-to-br from-purple-500 to-violet-600 rounded-xl flex items-center justify-center">
                    <span className="text-xl">❤️</span>
                  </div>
                  Estatísticas de Saúde
                </h2>
                
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
                  <div className="text-center">
                    <div className="h-16 w-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-lg">
                      <span className="text-2xl">📊</span>
                    </div>
                    <p className="text-3xl font-bold text-green-600">{stats?.totalTriagens || 0}</p>
                    <p className="text-sm text-gray-600 font-medium">Triagens</p>
                  </div>
                  <div className="text-center">
                    <div className="h-16 w-16 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-lg">
                      <span className="text-2xl">📄</span>
                    </div>
                    <p className="text-3xl font-bold text-blue-600">{stats?.totalRelatorios || 0}</p>
                    <p className="text-sm text-gray-600 font-medium">Relatórios</p>
                  </div>
                  <div className="text-center">
                    <div className="h-16 w-16 bg-gradient-to-br from-purple-500 to-violet-600 rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-lg">
                      <span className="text-2xl">⭐</span>
                    </div>
                    <p className="text-3xl font-bold text-purple-600">{stats?.scoreMedio || 'N/A'}</p>
                    <p className="text-sm text-gray-600 font-medium">Score Médio</p>
                  </div>
                  <div className="text-center">
                    <div className="h-16 w-16 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-lg">
                      <span className="text-2xl">🛒</span>
                    </div>
                    <p className="text-3xl font-bold text-yellow-600">{stats?.totalPedidos || 0}</p>
                    <p className="text-sm text-gray-600 font-medium">Pedidos</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-8">
              {/* Ações Rápidas */}
              <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300">
                <h3 className="text-xl font-bold text-gray-900 mb-6">Ações Rápidas</h3>
                
                <div className="space-y-4">
                  <Link
                    href="/protocolos"
                    className="w-full flex items-center gap-3 px-4 py-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl transition-all duration-300 font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                  >
                    <span className="text-xl">🏃</span>
                    Fazer Check-up
                  </Link>
                  
                  <Link
                    href="/relatorios"
                    className="w-full flex items-center gap-3 px-4 py-4 bg-gradient-to-r from-blue-500 to-cyan-600 text-white rounded-xl transition-all duration-300 font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                  >
                    <span className="text-xl">📄</span>
                    Ver Relatórios
                  </Link>
                  
                  <Link
                    href="/dashboard"
                    className="w-full flex items-center gap-3 px-4 py-4 bg-gradient-to-r from-purple-500 to-violet-600 text-white rounded-xl transition-all duration-300 font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                  >
                    <span className="text-xl">🏠</span>
                    Dashboard
                  </Link>
                </div>
              </div>

              {/* Metas de Saúde - link para Plano de Vida */}
              <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300">
                <h3 className="text-xl font-bold text-gray-900 mb-6">Metas de Saúde</h3>
                <p className="text-gray-600 mb-4">
                  Acompanhe seu plano de saúde e evolução no Plano de Vida.
                </p>
                <Link
                  href="/plano-vida"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold rounded-xl hover:shadow-lg transition"
                >
                  Ver Plano de Vida
                </Link>
              </div>

              {/* Próximas Consultas - link para Check-up */}
              <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300">
                <h3 className="text-xl font-bold text-gray-900 mb-6">Check-ups</h3>
                <p className="text-gray-600 mb-4">
                  Faça check-ups periódicos para acompanhar sua saúde e receber recomendações personalizadas.
                </p>
                <Link
                  href="/protocolos"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-600 text-white font-semibold rounded-xl hover:shadow-lg transition"
                >
                  Fazer check-up gratuito
                </Link>
              </div>
            </div>
          </div>

          {/* Botão Sair no Final */}
          <div className="mt-12 flex justify-center">
            <button
              type="button"
              onClick={() => signOut()}
              className="flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-red-500 to-pink-600 text-white rounded-xl transition-all duration-300 font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-1 min-w-[140px]"
            >
              <span className="text-lg">🚪</span>
              <span className="whitespace-nowrap">Sair da Conta</span>
            </button>
          </div>
        </div>
      </main>
      </LoggedLayout>
    </>
  );
}