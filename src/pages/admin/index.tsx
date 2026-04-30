/**
 * Admin Dashboard - Estilo ZapVida: clean, sidebar, KPIs, funil, atividades
 */

import { Analytics } from '@vercel/analytics/react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { FiRefreshCw, FiFilter, FiUsers, FiTrendingUp, FiDollarSign, FiActivity } from 'react-icons/fi';
import useSWR from 'swr';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

import { AdminLayout } from '../../components/admin/AdminLayout';
import { AlertsPanel } from '../../components/admin/AlertsPanel';
import { ExportBar } from '../../components/admin/ExportBar';
import { Funnel } from '../../components/admin/Funnel';
import { ProductFunnels } from '../../components/admin/ProductFunnels';
import { KPIBar } from '../../components/admin/KPIBar';
import { ProductUsage } from '../../components/admin/ProductUsage';
import { Revenue } from '../../components/admin/Revenue';
import { TechHealth } from '../../components/admin/TechHealth';
import {
  getMockKPIs,
  getMockFunnel,
  getMockRevenue,
  getMockProduct,
  getMockTech,
  getMockActivities,
  getMockAlerts,
  getMockFunnelsByProduct,
} from '../../lib/admin-mocks';

export async function getServerSideProps() {
  return { props: {} };
}

const token = () => process.env.NEXT_PUBLIC_ADMIN_SECRET_KEY || 'admin-secret-key';

const fetcherWithMocks = async (url: string): Promise<any> => {
  try {
    const res = await fetch(url, {
      headers: { Authorization: `Bearer ${token()}` },
    });
    if (res.ok) return res.json();
  } catch { /* fetch failed, use mock */ }
  const u = new URL(url, 'http://x');
  const period = u.searchParams.get('period') || '30d';
  const mock = (data: any) => ({ ...data, _mock: true });
  if (url.includes('/kpis')) return mock(getMockKPIs(period));
  if (url.includes('/funnel')) return mock(getMockFunnel(period));
  if (url.includes('/revenue')) return mock(getMockRevenue(period));
  if (url.includes('/product')) return mock(getMockProduct(period));
  if (url.includes('/tech')) return mock(getMockTech());
  if (url.includes('/activities')) return mock({ activities: getMockActivities(8) });
  if (url.includes('/alerts')) return mock(getMockAlerts());
  if (url.includes('/funnel-by-product')) return mock({ funnels: getMockFunnelsByProduct(period) });
  throw new Error('Erro');
};

const HASH_TO_TAB: Record<string, 'visao' | 'funil' | 'produtos' | 'financeiro' | 'tech'> = {
  '': 'visao',
  funil: 'funil',
  financeiro: 'financeiro',
  produtos: 'produtos',
  tech: 'tech',
  config: 'visao',
};

const TAB_TO_HASH: Record<string, string> = {
  visao: '',
  funil: '#funil',
  produtos: '#produtos',
  financeiro: '#financeiro',
  tech: '#tech',
};

export default function AdminPage() {
  const router = useRouter();
  const [period, setPeriod] = useState('30d');
  const [activeTab, setActiveTab] = useState<'visao' | 'funil' | 'produtos' | 'financeiro' | 'tech'>('visao');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const shouldEnableVercelAnalytics =
    process.env.NEXT_PUBLIC_ENABLE_VERCEL_ANALYTICS === '1' ||
    Boolean(process.env.NEXT_PUBLIC_VERCEL_ENV);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const hash = (window.location.hash || '').replace(/^#/, '');
    const tab = HASH_TO_TAB[hash] ?? 'visao';
    setActiveTab(tab);
  }, [router.asPath]);

  const { data: kpis, error: kpisError, mutate: mutateKPIs } = useSWR(
    `/api/admin/kpis?period=${period}`,
    fetcherWithMocks,
    { refreshInterval: 30000 }
  );
  const { data: funnel, error: funnelError, mutate: mutateFunnel } = useSWR(
    `/api/admin/funnel?period=${period}`,
    fetcherWithMocks,
    { refreshInterval: 30000 }
  );
  const { data: revenue, error: revenueError, mutate: mutateRevenue } = useSWR(
    `/api/admin/revenue?period=${period}`,
    fetcherWithMocks,
    { refreshInterval: 30000 }
  );
  const { data: product, error: productError, mutate: mutateProduct } = useSWR(
    `/api/admin/product?period=${period}`,
    fetcherWithMocks,
    { refreshInterval: 30000 }
  );
  const { data: tech, error: techError, mutate: mutateTech } = useSWR(
    `/api/admin/tech?period=${period}`,
    fetcherWithMocks,
    { refreshInterval: 30000 }
  );
  const { data: alerts, mutate: mutateAlerts } = useSWR('/api/admin/alerts', fetcherWithMocks, {
    refreshInterval: 10000,
  });
  const { data: activities } = useSWR('/api/admin/activities?limit=8', fetcherWithMocks, {
    refreshInterval: 30000,
  });
  const { data: funnelByProduct } = useSWR(
    `/api/admin/funnel-by-product?period=${period}`,
    fetcherWithMocks,
    { refreshInterval: 30000 }
  );

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await Promise.all([mutateKPIs(), mutateFunnel(), mutateRevenue(), mutateProduct(), mutateTech(), mutateAlerts()]);
    setIsRefreshing(false);
  };

  const hasError = kpisError || funnelError || revenueError || productError || techError;
  const isLoading = !kpis && !hasError;
  const useMocks = !!(kpis as any)?._mock || !!(funnel as any)?._mock;

  const tabs = [
    { id: 'visao' as const, label: 'Visão Geral', icon: FiTrendingUp },
    { id: 'funil' as const, label: 'Funil', icon: FiUsers },
    { id: 'produtos' as const, label: 'Produtos', icon: FiActivity },
    { id: 'financeiro' as const, label: 'Financeiro', icon: FiDollarSign },
    { id: 'tech' as const, label: 'Saúde Técnica', icon: FiActivity },
  ];

  const funnelData = funnel || null;
  const chartData = funnelData
    ? [
        { name: 'Homepage', value: funnelData.homepageViews },
        { name: 'Triagem', value: funnelData.triageStarts },
        { name: 'Concluída', value: funnelData.triageCompletions },
        { name: 'Relatório', value: funnelData.reportViews },
        { name: 'Pricing', value: funnelData.pricingViews },
        { name: 'Checkout', value: funnelData.checkoutStarts },
        { name: 'Assinatura', value: funnelData.subscriptions },
      ]
    : [];

  return (
    <>
      <Head>
        <title>Admin Dashboard | MeJoy</title>
        <meta name="robots" content="noindex,nofollow" />
        <meta name="description" content="Dashboard administrativo MeJoy" />
      </Head>
      {shouldEnableVercelAnalytics && <Analytics />}

      <AdminLayout
        title="Dashboard Administrativo"
        subtitle="Visão geral das métricas do sistema"
      >
        {/* Tabs */}
        <div className="flex flex-wrap gap-2 mb-4 sm:mb-6 border-b border-gray-200 pb-4 overflow-x-auto -mx-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id);
                const h = TAB_TO_HASH[tab.id];
                if (typeof window !== 'undefined') window.location.hash = h || '';
              }}
              className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-medium transition-colors flex-shrink-0 ${
                activeTab === tab.id
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
              }`}
            >
              <tab.icon size={16} />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-2">
            <FiFilter className="text-gray-500" size={16} />
            <select
              value={period}
              onChange={(e) => setPeriod(e.target.value)}
              className="bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="today">Hoje</option>
              <option value="7d">Últimos 7 dias</option>
              <option value="30d">Últimos 30 dias</option>
            </select>
          </div>
          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
          >
            <FiRefreshCw size={16} className={isRefreshing ? 'animate-spin' : ''} />
            Atualizar
          </button>
        </div>

        {useMocks && (
          <div className="mb-6 p-4 bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200/80 rounded-xl flex items-center gap-3 shadow-sm">
            <div className="h-8 w-8 rounded-lg bg-amber-100 flex items-center justify-center text-amber-600 font-bold text-sm">i</div>
            <div>
              <span className="text-amber-800 text-sm font-semibold">Modo demonstração</span>
              <p className="text-amber-700/90 text-xs mt-0.5">5.000 leads e 10.000 vendas simuladas. Configure ADMIN_SECRET_KEY na Vercel para dados reais.</p>
            </div>
          </div>
        )}

        {isLoading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-2 border-blue-600 border-t-transparent" />
          </div>
        ) : (
          <div className="space-y-8">
            {(activeTab === 'visao' || activeTab === 'funil') && (
              <>
                <KPIBar data={kpis || null} loading={false} variant="light" />
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
                  <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Funil de Conversão</h3>
                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={chartData}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                          <XAxis dataKey="name" stroke="#6b7280" fontSize={11} />
                          <YAxis stroke="#6b7280" fontSize={11} />
                          <Tooltip
                            contentStyle={{
                              backgroundColor: '#fff',
                              border: '1px solid #e5e7eb',
                              borderRadius: '8px',
                            }}
                          />
                          <Line type="monotone" dataKey="value" stroke="#2563eb" strokeWidth={2} dot={{ r: 4 }} />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                  <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Atividades Recentes</h3>
                    <p className="text-xs text-gray-500 mb-4">Últimas atividades na plataforma</p>
                    <div className="space-y-3 max-h-64 overflow-y-auto">
                      {(activities?.activities ?? []).length === 0 ? (
                        <p className="text-gray-500 text-sm">Nenhuma atividade recente</p>
                      ) : (
                        (activities?.activities ?? []).map((a: any) => (
                          <div
                            key={a.id}
                            className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                          >
                            <div>
                              <p className="text-sm font-medium text-gray-900">{a.title}</p>
                              <p className="text-xs text-gray-500">
                                {new Date(a.at).toLocaleString('pt-BR', {
                                  day: '2-digit',
                                  month: '2-digit',
                                  hour: '2-digit',
                                  minute: '2-digit',
                                })}
                              </p>
                            </div>
                            <span
                              className={`px-2 py-1 rounded text-xs font-medium ${
                                a.status === 'completed'
                                  ? 'bg-green-100 text-green-800'
                                  : 'bg-blue-100 text-blue-800'
                              }`}
                            >
                              {a.statusLabel}
                            </span>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </div>
              </>
            )}

            {activeTab === 'funil' && (
              <>
                <Funnel data={funnel || null} loading={false} variant="light" />
                <ProductFunnels
                  data={funnelByProduct?.funnels ?? null}
                  loading={false}
                  variant="light"
                />
              </>
            )}
            {activeTab === 'produtos' && <ProductUsage data={product || null} loading={false} variant="light" />}
            {activeTab === 'financeiro' && <Revenue data={revenue || null} loading={false} variant="light" />}
            {activeTab === 'tech' && <TechHealth data={tech || null} loading={false} variant="light" />}

            <AlertsPanel
              data={Array.isArray(alerts) ? alerts : (alerts?.alerts ?? null)}
              loading={false}
              onRefresh={async () => mutateAlerts()}
              onAcknowledge={async () => mutateAlerts()}
              onClose={async () => mutateAlerts()}
              variant="light"
            />

            <ExportBar
              period={period}
              onExport={async (format, includePII) => {
                const params = new URLSearchParams({
                  format,
                  period,
                  includePII: String(includePII),
                });
                const res = await fetch(`/api/admin/export?${params}`, {
                  headers: {
                    Authorization: `Bearer ${process.env.NEXT_PUBLIC_ADMIN_SECRET_KEY || 'admin-secret-key'}`,
                  },
                });
                if (!res.ok) throw new Error('Erro');
                if (format === 'csv') {
                  const blob = await res.blob();
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = `admin-${new Date().toISOString().split('T')[0]}.csv`;
                  a.click();
                  URL.revokeObjectURL(url);
                } else if (format === 'json') {
                  const data = await res.json();
                  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = `admin-${new Date().toISOString().split('T')[0]}.json`;
                  a.click();
                  URL.revokeObjectURL(url);
                }
              }}
              loading={false}
              variant="light"
            />
          </div>
        )}
      </AdminLayout>
    </>
  );
}
