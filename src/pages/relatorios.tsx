import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

import LoggedLayout from '@/components/layout/LoggedLayout';
import { useAuth } from '@/context/AuthContext';
import { useReports } from '@/hooks/useReports';

export default function RelatoriosPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const { reports, loading } = useReports();

  useEffect(() => {
    if (!authLoading && !user) {
      router.replace('/login?redirect=/relatorios');
    }
  }, [authLoading, user, router]);

  if (authLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500" />
      </div>
    );
  }

  // Mapear triage_slug para categoria/nome amigável (protocolo)
  const getTriageName = (slug: string) => {
    const names: Record<string, string> = {
      'emagrecimento': 'Emagrecimento',
      'calvicie': 'Calvície',
      'sono': 'Sono',
      'ansiedade': 'Ansiedade',
      'intestino': 'Saúde Intestinal',
      'figado': 'Saúde do Fígado',
      'libido-masculina': 'Libido Masculina',
      'menopausa': 'Menopausa',
      'articulacoes': 'Articulações',
      'imunidade': 'Imunidade',
      'gastro': 'Saúde Gastrointestinal',
    };
    return names[slug] || slug;
  };

  const getCategoria = (slug: string) => {
    const categorias: Record<string, string> = {
      'emagrecimento': 'Metabolismo',
      'calvicie': 'Estética',
      'sono': 'Bem-estar',
      'ansiedade': 'Mental',
      'intestino': 'Digestão',
      'figado': 'Digestão',
      'libido-masculina': 'Hormonal',
      'menopausa': 'Hormonal',
      'articulacoes': 'Músculo-esquelético',
      'imunidade': 'Imunológico',
      'gastro': 'Digestão',
    };
    return categorias[slug] || 'Geral';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'text-green-600 bg-green-50 border-green-200';
      case 'pending':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'failed':
        return 'text-red-600 bg-red-50 border-red-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed':
        return 'Concluído';
      case 'pending':
        return 'Processando';
      case 'failed':
        return 'Erro';
      default:
        return 'Desconhecido';
    }
  };

  const getCategoriaColor = (categoria: string) => {
    switch (categoria) {
      case 'Digestão':
        return 'bg-green-100 text-green-800';
      case 'Coração':
        return 'bg-red-100 text-red-800';
      case 'Mental':
        return 'bg-purple-100 text-purple-800';
      case 'Metabolismo':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatarData = (data: string) => {
    return new Date(data).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <>
      <Head>
        <title>Meus Relatórios | Me Joy</title>
        <meta name="description" content="Acompanhe todos os seus relatórios de saúde gerados" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>

      <LoggedLayout>
      <main className="min-h-screen bg-white text-gray-900">
        <div className="max-w-7xl mx-auto px-4 py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl md:text-5xl font-bold text-gray-900 mb-3">
              Meus Relatórios de Saúde
            </h1>
            <p className="text-gray-600 text-lg">
              Acompanhe todos os seus relatórios gerados com base nos seus protocolos
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm font-medium mb-1">Total</p>
                  <p className="text-3xl font-bold text-gray-900">
                    {loading ? '...' : (reports?.length || 0)}
                  </p>
                </div>
                <div className="h-12 w-12 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-xl flex items-center justify-center shadow-lg">
                  <span className="text-2xl">📄</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm font-medium mb-1">Concluídos</p>
                  <p className="text-3xl font-bold text-green-600">
                    {loading ? '...' : (reports?.filter(r => r.status === 'completed').length || 0)}
                  </p>
                </div>
                <div className="h-12 w-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg">
                  <span className="text-2xl">✅</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm font-medium mb-1">Processando</p>
                  <p className="text-3xl font-bold text-yellow-600">
                    {loading ? '...' : (reports?.filter(r => r.status === 'pending' || r.status === 'in_progress').length || 0)}
                  </p>
                </div>
                <div className="h-12 w-12 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-xl flex items-center justify-center shadow-lg">
                  <span className="text-2xl">⏳</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm font-medium mb-1">Score Médio</p>
                  <p className="text-3xl font-bold text-purple-600">
                    {loading ? '...' : 'N/A'}
                  </p>
                </div>
                <div className="h-12 w-12 bg-gradient-to-br from-purple-500 to-violet-600 rounded-xl flex items-center justify-center shadow-lg">
                  <span className="text-2xl">⭐</span>
                </div>
              </div>
            </div>
          </div>

          {/* New Protocol Button */}
          <div className="mb-8">
            <Link
              href="/protocolos"
              className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-2xl transition-all duration-300 font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              <span className="text-xl">➕</span>
              Novo Protocolo
            </Link>
          </div>

          {/* Relatórios List */}
          {loading ? (
            <div className="text-center py-16">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto mb-4"></div>
              <p className="text-gray-600">Carregando relatórios...</p>
            </div>
          ) : (
            <div className="grid gap-6 grid-cols-1">
              {reports && reports.length > 0 ? (
                reports.map((relatorio) => {
                  const categoria = getCategoria(relatorio.triageSlug);
                  const titulo = `Relatório de ${getTriageName(relatorio.triageSlug)}`;
                  const isCompleted = relatorio.status === 'completed';

                  return (
                    <div
                      key={relatorio.id}
                      className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 w-full"
                    >
                      {/* Header */}
                      <div className="flex items-start justify-between mb-6">
                        <div className="flex items-center gap-4 flex-1 min-w-0">
                          <div className="h-12 w-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg flex-shrink-0">
                            <span className="text-2xl">📄</span>
                          </div>
                          <div className="min-w-0 flex-1">
                            <h3 className="font-bold text-gray-900 text-lg mb-1 break-words">
                              {titulo}
                            </h3>
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className={`px-3 py-1 rounded-full text-xs font-medium ${getCategoriaColor(categoria)}`}>
                                {categoria}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(relatorio.status)} flex-shrink-0`}>
                          <span>{getStatusText(relatorio.status)}</span>
                        </div>
                      </div>

                      {/* Summary */}
                      {relatorio.summary && (
                        <div className="mb-6">
                          <p className="text-gray-600 text-sm leading-relaxed break-words">
                            {relatorio.summary}
                          </p>
                        </div>
                      )}

                      {/* Date */}
                      <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
                        <span className="text-lg">📅</span>
                        <span>{formatarData(relatorio.createdAt)}</span>
                      </div>

                      {/* Actions */}
                      <div className="flex gap-3 flex-wrap">
                        <Link
                          href={`/${relatorio.triageSlug}/relatorio?id=${relatorio.triageId}`}
                          className="flex-1 min-w-0 flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl transition-all duration-300 text-sm font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                        >
                          <span className="text-lg">👁️</span>
                          <span className="truncate">Ver Relatório</span>
                        </Link>
                        
                        {isCompleted && (
                          <a
                            href={`/${relatorio.triageSlug}/relatorio?id=${relatorio.triageId}&print=true`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-center px-4 py-3 bg-gradient-to-r from-blue-500 to-cyan-600 text-white rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 flex-shrink-0"
                            title="Download"
                          >
                            <span className="text-lg">⬇️</span>
                          </a>
                        )}
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="text-center py-16">
                  <div className="h-24 w-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <span className="text-4xl">📄</span>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Nenhum relatório encontrado</h3>
                  <p className="text-gray-600 mb-6">Comece escolhendo um protocolo para gerar seu primeiro relatório</p>
                  <Link
                    href="/protocolos"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl transition-all duration-300 font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                  >
                    <span className="text-lg">🚀</span>
                    Ver Protocolos
                  </Link>
                </div>
              )}
            </div>
          )}

        </div>
      </main>
      </LoggedLayout>
    </>
  );
}