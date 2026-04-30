import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

import LoggedLayout from '@/components/layout/LoggedLayout';
import { useAuth } from '@/context/AuthContext';
import { useDashboardData } from '@/hooks/useDashboardData';
import { useOrders } from '@/hooks/useOrders';
import { useStoreV2Orders } from '@/hooks/useStoreV2Orders';
import { useReports } from '@/hooks/useReports';
import { useProfile } from '@/hooks/useProfile';

export default function DashboardPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();

  useEffect(() => {
    if (!authLoading && !user) {
      router.replace('/login?redirect=/dashboard');
    }
  }, [authLoading, user, router]);

  if (authLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500 mx-auto mb-4" />
          <p className="text-gray-600">Carregando...</p>
        </div>
      </div>
    );
  }
  const { stats, loading: statsLoading } = useDashboardData();
  const { orders, loading: ordersLoading } = useOrders();
  const { orders: storeV2Orders, loading: storeV2OrdersLoading } = useStoreV2Orders();
  const { reports, loading: reportsLoading } = useReports();
  const { profile, loading: profileLoading } = useProfile();

  // Calcular triagens hoje (simplificado - pode ser melhorado na API)
  // const triagensHoje = stats?.ultimaAtividade 
  //   ? new Date(stats.ultimaAtividade).toDateString() === new Date().toDateString() ? 1 : 0
  //   : 0;

  // Formatar última atividade
  const formatarUltimaAtividade = (data: string | null) => {
    if (!data) return null;
    const date = new Date(data);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);

    if (diffHours < 1) return 'Há menos de 1 hora';
    if (diffHours < 24) return `Há ${diffHours} hora${diffHours > 1 ? 's' : ''}`;
    if (diffDays === 1) return 'Ontem';
    return `Há ${diffDays} dias`;
  };

  // Comparação temporal: hoje vs período anterior
  const hoje = new Date().toDateString();
  const isToday = (d: string) => new Date(d).toDateString() === hoje;
  const isThisWeek = (d: string) => {
    const date = new Date(d);
    const now = new Date();
    const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
    return diffDays <= 7;
  };
  const triagensHoje = reports?.filter((r) => isToday(r.createdAt)).length ?? 0;
  const relatoriosHoje = reports?.filter((r) => isToday(r.completedAt || r.createdAt) && r.status === 'completed').length ?? 0;
  const pedidosHoje =
    (orders?.filter((o) => isToday(o.createdAt)).length ?? 0) +
    (storeV2Orders?.filter((o) => isToday(o.createdAt)).length ?? 0);
  const atividadesEstaSemana =
    (reports?.filter((r) => isThisWeek(r.createdAt)).length ?? 0) +
    (orders?.filter((o) => isThisWeek(o.createdAt)).length ?? 0) +
    (storeV2Orders?.filter((o) => isThisWeek(o.createdAt)).length ?? 0);

  // Obter atividade recente (últimos relatórios e pedidos)
  const atividadesRecentes = [
    ...(reports?.slice(0, 2).map(r => ({
      tipo: 'relatorio' as const,
      titulo: `Relatório ${r.triageSlug}`,
      data: r.completedAt || r.createdAt,
      status: r.status === 'completed' ? 'completed' : 'pending',
      score: null as number | null,
    })) || []),
    ...(orders?.slice(0, 2).map(o => ({
      tipo: 'pedido' as const,
      titulo: `Pedido ${o.productSlug}`,
      data: o.createdAt,
      status: o.status === 'PAID' ? 'completed' : o.status.toLowerCase(),
      score: null as number | null,
    })) || []),
    ...(storeV2Orders?.slice(0, 2).map(o => ({
      tipo: 'pedido' as const,
      titulo: `Pedido Loja #${o.id.slice(-8).toUpperCase()}`,
      data: o.createdAt,
      status: o.status === 'PAID' ? 'completed' : o.status === 'PENDING_PAYMENT' ? 'pending' : o.status.toLowerCase(),
      score: null as number | null,
    })) || []),
  ].sort((a, b) => new Date(b.data).getTime() - new Date(a.data).getTime()).slice(0, 4);

  return (
    <>
      <Head>
        <title>Dashboard | Me Joy</title>
        <meta name="description" content="Seu painel de controle de saúde personalizado" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>

      <LoggedLayout>
      <main className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-emerald-50/50 text-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-10">
          {/* Header */}
          <div className="mb-8 rounded-3xl border border-emerald-100 bg-gradient-to-r from-slate-900 via-slate-900 to-emerald-900 p-6 sm:p-8 text-white shadow-[0_30px_80px_rgba(15,23,42,0.22)]">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.12em] text-emerald-200">Painel Me Joy</p>
                <h1 className="mt-2 text-2xl sm:text-3xl md:text-4xl font-bold">
                  Seu acompanhamento em um só lugar
                </h1>
                <p className="mt-3 text-sm sm:text-base text-slate-200 max-w-2xl">
                  Veja sua evolução, acompanhe pedidos, revise relatórios e mantenha sua jornada organizada.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-3">
                <Link
                  href="/protocolos"
                  className="inline-flex items-center justify-center rounded-full bg-emerald-500 px-5 py-3 text-sm font-bold text-slate-950 transition hover:bg-emerald-400"
                >
                  Nova triagem
                </Link>
                <Link
                  href="/relatorios"
                  className="inline-flex items-center justify-center rounded-full border border-white/30 bg-white/10 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/20"
                >
                  Ver relatórios
                </Link>
              </div>
            </div>
          </div>

          {/* Metrics Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
            <div className="bg-white rounded-xl sm:rounded-2xl p-5 sm:p-6 shadow-sm border border-emerald-100 hover:shadow-md hover:border-emerald-200 transition-all duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm font-medium mb-1">Total de Triagens</p>
                  <p className="text-3xl font-bold text-gray-900">
                    {statsLoading ? '...' : (stats?.totalTriagens || 0)}
                  </p>
                  {stats?.ultimaAtividade && (
                    <p className="text-green-600 text-sm font-medium">
                      {formatarUltimaAtividade(stats.ultimaAtividade)}
                    </p>
                  )}
                </div>
                <div className="h-12 w-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg">
                  <span className="text-2xl">📊</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl sm:rounded-2xl p-5 sm:p-6 shadow-sm border border-emerald-100 hover:shadow-md hover:border-emerald-200 transition-all duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm font-medium mb-1">Relatórios Gerados</p>
                  <p className="text-3xl font-bold text-gray-900">
                    {reportsLoading ? '...' : (stats?.totalRelatorios || 0)}
                  </p>
                  {stats?.totalRelatorios && stats.totalRelatorios > 0 && (
                    <p className="text-emerald-700 text-sm font-medium">
                      {Math.round((stats.totalRelatorios / (stats.totalTriagens || 1)) * 100)}% completos
                    </p>
                  )}
                </div>
                <div className="h-12 w-12 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center shadow-lg">
                  <span className="text-2xl">📄</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl sm:rounded-2xl p-5 sm:p-6 shadow-sm border border-emerald-100 hover:shadow-md hover:border-emerald-200 transition-all duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm font-medium mb-1">Pedidos</p>
                  <p className="text-3xl font-bold text-gray-900">
                    {ordersLoading ? '...' : (stats?.totalPedidos || 0)}
                  </p>
                  {stats?.totalPedidos && stats.totalPedidos > 0 && (
                    <p className="text-slate-700 text-sm font-medium">Total de compras</p>
                  )}
                </div>
                <div className="h-12 w-12 bg-gradient-to-br from-slate-700 to-slate-900 rounded-xl flex items-center justify-center shadow-lg">
                  <span className="text-2xl">🛒</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl sm:rounded-2xl p-5 sm:p-6 shadow-sm border border-emerald-100 hover:shadow-md hover:border-emerald-200 transition-all duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm font-medium mb-1">Score Médio</p>
                  <p className="text-3xl font-bold text-gray-900">
                    {statsLoading ? '...' : (stats?.scoreMedio || 'N/A')}
                  </p>
                  {stats?.scoreMedio && (
                    <p className="text-amber-700 text-sm font-medium">
                      {stats.scoreMedio >= 80 ? 'Excelente' : stats.scoreMedio >= 60 ? 'Bom' : 'Regular'}
                    </p>
                  )}
                </div>
                <div className="h-12 w-12 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl flex items-center justify-center shadow-lg">
                  <span className="text-2xl">⭐</span>
                </div>
              </div>
            </div>
          </div>

          {/* Comparação temporal: Hoje vs Evolução */}
          <div className="bg-white rounded-xl sm:rounded-2xl p-5 sm:p-6 shadow-sm border border-emerald-100 mb-8">
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <span>📅</span> Resumo do dia e evolução
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="p-4 bg-emerald-50/60 rounded-xl border border-emerald-100">
                <p className="text-gray-500 text-sm">Hoje</p>
                <p className="text-2xl font-bold text-gray-900">
                  {triagensHoje + relatoriosHoje + pedidosHoje} atividade(s)
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {triagensHoje} triagem(ns) · {relatoriosHoje} relatório(s) · {pedidosHoje} pedido(s)
                </p>
              </div>
              <div className="p-4 bg-emerald-50/60 rounded-xl border border-emerald-100">
                <p className="text-gray-500 text-sm">Esta semana</p>
                <p className="text-2xl font-bold text-gray-900">{atividadesEstaSemana}</p>
                <p className="text-xs text-gray-500 mt-1">triagens + pedidos</p>
              </div>
              <div className="p-4 bg-emerald-50/60 rounded-xl border border-emerald-100">
                <p className="text-gray-500 text-sm">Total</p>
                <p className="text-2xl font-bold text-gray-900">
                  {(stats?.totalTriagens || 0) + (stats?.totalPedidos || 0)}
                </p>
                <p className="text-xs text-gray-500 mt-1">triagens + pedidos</p>
              </div>
              <div className="p-4 bg-emerald-50/60 rounded-xl border border-emerald-100">
                <p className="text-gray-500 text-sm">Última atividade</p>
                <p className="text-lg font-bold text-gray-900">
                  {stats?.ultimaAtividade ? formatarUltimaAtividade(stats.ultimaAtividade) : '—'}
                </p>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* Start New Triage */}
            <div className="bg-gradient-to-br from-emerald-600 to-emerald-800 rounded-2xl p-8 shadow-xl text-white">
              <div className="flex items-center gap-4 mb-6">
                <div className="h-16 w-16 bg-white/20 rounded-2xl flex items-center justify-center">
                  <span className="text-3xl">➕</span>
                </div>
                <div>
                  <h3 className="text-2xl font-bold">Nova Triagem</h3>
                  <p className="text-emerald-100">Inicie uma nova avaliação de saúde</p>
                </div>
              </div>
              <Link
                href="/protocolos"
                className="inline-flex items-center gap-2 bg-white text-emerald-700 font-semibold py-4 px-6 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
              >
                <span className="text-lg">🚀</span>
                Fazer triagem
              </Link>
            </div>

            {/* View Reports */}
            <div className="bg-gradient-to-br from-slate-800 to-slate-950 rounded-2xl p-8 shadow-xl text-white">
              <div className="flex items-center gap-4 mb-6">
                <div className="h-16 w-16 bg-white/20 rounded-2xl flex items-center justify-center">
                  <span className="text-3xl">📊</span>
                </div>
                <div>
                  <h3 className="text-2xl font-bold">Meus Relatórios</h3>
                  <p className="text-slate-200">Visualize seus relatórios de saúde</p>
                </div>
              </div>
              <Link
                href="/relatorios"
                className="inline-flex items-center gap-2 bg-white text-slate-800 font-semibold py-4 px-6 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
              >
                <span className="text-lg">👁️</span>
                Ver Relatórios
              </Link>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white rounded-2xl p-8 shadow-lg border border-emerald-100">
            <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <span className="text-green-500">📈</span>
              Atividade Recente
            </h3>
            
            {reportsLoading || ordersLoading || storeV2OrdersLoading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500 mx-auto"></div>
                <p className="text-gray-500 mt-2">Carregando...</p>
              </div>
            ) : atividadesRecentes.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500">Nenhuma atividade recente</p>
              </div>
            ) : (
              <div className="space-y-4">
                {atividadesRecentes.map((atividade, index) => {
                  const statusColor = atividade.status === 'completed' || atividade.status === 'PAID'
                    ? 'text-green-600'
                    : atividade.status === 'pending' || atividade.status === 'PENDING'
                    ? 'text-amber-600'
                    : 'text-slate-700';
                  
                  const statusText = atividade.status === 'completed' || atividade.status === 'PAID'
                    ? 'Concluído'
                    : atividade.status === 'pending' || atividade.status === 'PENDING'
                    ? 'Pendente'
                    : 'Em andamento';

                  const icon = atividade.tipo === 'relatorio' ? '📄' : '🛒';
                  const bgColor = atividade.tipo === 'relatorio' ? 'bg-emerald-100' : 'bg-slate-100';

                  return (
                    <div key={index} className="flex items-center gap-4 p-4 bg-emerald-50/60 rounded-xl border border-emerald-100">
                      <div className={`h-10 w-10 ${bgColor} rounded-lg flex items-center justify-center`}>
                        <span className="text-lg">{icon}</span>
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-gray-900">{atividade.titulo}</p>
                        <p className="text-gray-600 text-sm">
                          {formatarUltimaAtividade(atividade.data)}
                          {atividade.score && ` • Score: ${atividade.score}`}
                        </p>
                      </div>
                      <div className={`${statusColor} font-semibold`}>{statusText}</div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Pedidos da Loja (Store V2) */}
          <div className="mt-8 bg-white rounded-2xl p-8 shadow-lg border border-emerald-100">
            <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <span className="text-emerald-500">🛒</span>
              Pedidos da Loja
            </h3>
            {storeV2OrdersLoading ? (
              <div className="text-center py-6">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500 mx-auto" />
                <p className="text-gray-500 mt-2">Carregando...</p>
              </div>
            ) : storeV2Orders.length === 0 ? (
              <p className="text-gray-500 text-center py-6">Nenhum pedido da loja ainda.</p>
            ) : (
              <div className="space-y-4">
                {storeV2Orders.map((o) => (
                  <Link
                    key={o.id}
                    href={`/pedidos/${o.id}`}
                    className="flex items-center justify-between p-4 bg-emerald-50/60 rounded-xl border border-emerald-100 hover:bg-emerald-50 transition-colors"
                  >
                    <div>
                      <p className="font-semibold text-gray-900">
                        Pedido #{o.id.slice(-8).toUpperCase()}
                      </p>
                      <p className="text-gray-500 text-sm">
                        {new Intl.NumberFormat('pt-BR', {
                          style: 'currency',
                          currency: 'BRL',
                        }).format(o.totalCents / 100)}{' '}
                        · {new Date(o.createdAt).toLocaleDateString('pt-BR')}
                      </p>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        o.status === 'PAID'
                          ? 'bg-green-100 text-green-800'
                          : o.status === 'PENDING_PAYMENT'
                            ? 'bg-amber-100 text-amber-800'
                            : o.status === 'SHIPPED' || o.status === 'DELIVERED'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {o.status === 'PAID'
                        ? 'Pago'
                        : o.status === 'PENDING_PAYMENT'
                          ? 'Aguardando pagamento'
                          : o.status === 'PREPARING'
                            ? 'Em preparação'
                            : o.status === 'SHIPPED'
                              ? 'Enviado'
                              : o.status === 'DELIVERED'
                                ? 'Entregue'
                                : o.status}
                    </span>
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* User Info */}
          <div className="mt-8 bg-white rounded-2xl p-8 shadow-lg border border-emerald-100">
            <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <span className="text-emerald-600">👤</span>
              Informações do Usuário
            </h3>
            {profileLoading ? (
              <div className="text-center py-4">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-emerald-500 mx-auto"></div>
              </div>
            ) : profile ? (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <p className="text-gray-500 text-sm font-medium mb-2">Nome Completo</p>
                    <p className="text-gray-900 font-semibold text-lg">{profile.name || 'Não informado'}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 text-sm font-medium mb-2">Email</p>
                    <p className="text-gray-900 font-semibold text-lg">{profile.email || 'Não informado'}</p>
                  </div>
                </div>
                <div className="mt-6">
                  <Link
                    href="/perfil"
                    className="inline-flex items-center gap-2 bg-gradient-to-r from-emerald-600 to-emerald-800 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                  >
                    <span className="text-lg">✏️</span>
                    Editar Perfil
                  </Link>
                </div>
              </>
            ) : (
              <div className="text-center py-4">
                <p className="text-gray-500 mb-4">Nenhuma informação disponível</p>
                <Link
                  href="/perfil"
                  className="inline-flex items-center gap-2 bg-gradient-to-r from-emerald-600 to-emerald-800 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                >
                  <span className="text-lg">✏️</span>
                  Criar Perfil
                </Link>
              </div>
            )}
          </div>
        </div>
      </main>
      </LoggedLayout>
    </>
  );
}
