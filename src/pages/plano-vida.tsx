'use client';

import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

import LoggedLayout from '@/components/layout/LoggedLayout';
import { useAuth } from '@/context/AuthContext';
import { useProfile } from '@/hooks/useProfile';
import { useReports } from '@/hooks/useReports';

export default function PlanoVidaPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const { profile, loading: profileLoading } = useProfile();
  const { reports, loading: reportsLoading } = useReports();

  useEffect(() => {
    if (!authLoading && !user) {
      router.replace('/login?redirect=/plano-vida');
    }
  }, [authLoading, user, router]);

  const calculateBMI = (height: number | null, weight: number | null) => {
    if (!height || !weight || height === 0 || weight === 0) return null;
    const heightInMeters = height / 100;
    return (weight / (heightInMeters * heightInMeters)).toFixed(1);
  };

  const getBMICategory = (bmi: number) => {
    if (bmi < 18.5) return { label: 'Abaixo do peso', color: 'text-blue-600', bg: 'bg-blue-50' };
    if (bmi < 25) return { label: 'Peso normal', color: 'text-green-600', bg: 'bg-green-50' };
    if (bmi < 30) return { label: 'Sobrepeso', color: 'text-yellow-600', bg: 'bg-yellow-50' };
    return { label: 'Obesidade', color: 'text-red-600', bg: 'bg-red-50' };
  };

  const getTriageName = (slug: string) => {
    const names: Record<string, string> = {
      emagrecimento: 'Emagrecimento',
      calvicie: 'Calvície',
      sono: 'Sono',
      ansiedade: 'Ansiedade',
      intestino: 'Saúde Intestinal',
      figado: 'Saúde do Fígado',
      'libido-masculina': 'Libido Masculina',
      menopausa: 'Menopausa',
      articulacoes: 'Articulações',
      imunidade: 'Imunidade',
      gastro: 'Saúde Gastrointestinal',
    };
    return names[slug] || slug;
  };

  if (authLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500" />
      </div>
    );
  }

  const height = profile?.height_cm ?? null;
  const weight = profile?.weight_kg ?? null;
  const bmiVal = height && weight ? parseFloat(calculateBMI(height, weight) || '0') : null;
  const bmiCategory = bmiVal ? getBMICategory(bmiVal) : null;
  const completedReports = reports?.filter((r) => r.status === 'completed') ?? [];

  return (
    <>
      <Head>
        <title>Plano de Vida | MeJoy</title>
        <meta
          name="description"
          content="Acompanhe seu plano de saúde e evolução ao longo do tempo"
        />
      </Head>

      <LoggedLayout>
        <main className="min-h-screen bg-gray-50 text-gray-900">
          <div className="max-w-4xl mx-auto px-4 py-8">
            <div className="mb-8">
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
                Plano de Vida
              </h1>
              <p className="text-gray-600">
                Seu resumo de saúde e próximos passos baseados nos seus check-ups
              </p>
            </div>

            <div className="space-y-6">
              {/* Dados atuais */}
              <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <span>📊</span> Seus dados hoje
                </h2>
                {profileLoading ? (
                  <div className="h-24 animate-pulse bg-gray-100 rounded-xl" />
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    {height && (
                      <div>
                        <p className="text-gray-500 text-sm">Altura</p>
                        <p className="font-semibold text-gray-900">{height} cm</p>
                      </div>
                    )}
                    {weight && (
                      <div>
                        <p className="text-gray-500 text-sm">Peso</p>
                        <p className="font-semibold text-gray-900">{weight} kg</p>
                      </div>
                    )}
                    {bmiVal && (
                      <div>
                        <p className="text-gray-500 text-sm">IMC</p>
                        <p className={`font-semibold ${bmiCategory?.color}`}>
                          {bmiVal.toFixed(1)} ({bmiCategory?.label})
                        </p>
                      </div>
                    )}
                    {!height && !weight && (
                      <p className="text-gray-500 col-span-2">
                        Complete seu perfil para ver seus dados de saúde.
                      </p>
                    )}
                  </div>
                )}
                <Link
                  href="/perfil"
                  className="mt-4 inline-block text-brand-600 font-medium hover:underline"
                >
                  Atualizar perfil →
                </Link>
              </div>

              {/* Relatórios e evolução */}
              <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <span>📈</span> Evolução e relatórios
                </h2>
                {reportsLoading ? (
                  <div className="h-24 animate-pulse bg-gray-100 rounded-xl" />
                ) : completedReports.length > 0 ? (
                  <div className="space-y-3">
                    <p className="text-gray-600 text-sm">
                      Você tem {completedReports.length} relatório(s) concluído(s).
                      Acompanhe sua evolução fazendo check-ups periódicos.
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {completedReports.slice(0, 5).map((r) => (
                        <Link
                          key={r.id}
                          href={`/${r.triageSlug}/relatorio?id=${r.triageId}`}
                          className="px-4 py-2 bg-brand-50 text-brand-700 rounded-xl font-medium hover:bg-brand-100 transition"
                        >
                          {getTriageName(r.triageSlug)}
                        </Link>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-600 mb-4">
                      Faça seu primeiro check-up para gerar relatórios e
                      acompanhar sua evolução.
                    </p>
                    <Link
                      href="/protocolos"
                      className="inline-flex items-center gap-2 px-6 py-3 bg-brand-600 text-white font-semibold rounded-xl hover:bg-brand-700 transition"
                    >
                      Fazer check-up gratuito
                    </Link>
                  </div>
                )}
              </div>

              {/* Próximos passos */}
              <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <span>🎯</span> Próximos passos
                </h2>
                <ul className="space-y-3">
                  {!profile?.height_cm || !profile?.weight_kg ? (
                    <li className="flex items-start gap-3 p-3 bg-amber-50 rounded-xl">
                      <span className="text-amber-600 font-bold">1.</span>
                      <span>
                        Complete altura e peso no{' '}
                        <Link href="/perfil" className="text-brand-600 font-medium hover:underline">
                          perfil
                        </Link>{' '}
                        para cálculos precisos.
                      </span>
                    </li>
                  ) : null}
                  {completedReports.length === 0 ? (
                    <li className="flex items-start gap-3 p-3 bg-blue-50 rounded-xl">
                      <span className="text-blue-600 font-bold">
                        {profile?.height_cm && profile?.weight_kg ? '1' : '2'}.
                      </span>
                      <span>
                        Faça um{' '}
                        <Link href="/protocolos" className="text-brand-600 font-medium hover:underline">
                          check-up gratuito
                        </Link>{' '}
                        para receber recomendações personalizadas.
                      </span>
                    </li>
                  ) : (
                    <li className="flex items-start gap-3 p-3 bg-green-50 rounded-xl">
                      <span className="text-green-600 font-bold">✓</span>
                      <span>
                        Revise seus relatórios e siga as recomendações em{' '}
                        <Link href="/relatorios" className="text-brand-600 font-medium hover:underline">
                          Meus Relatórios
                        </Link>
                        .
                      </span>
                    </li>
                  )}
                  <li className="flex items-start gap-3 p-3 bg-gray-50 rounded-xl">
                    <span className="text-gray-600 font-bold">→</span>
                    <span>
                      Considere fazer check-ups periódicos (ex.: a cada 3–6 meses)
                      para acompanhar sua evolução.
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </main>
      </LoggedLayout>
    </>
  );
}
