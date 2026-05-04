import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useMemo, useState } from 'react';
import { FiActivity, FiAlertTriangle, FiRefreshCw, FiShield, FiTrendingUp, FiTruck, FiUsers } from 'react-icons/fi';
import useSWR from 'swr';

import { AdminLayout } from '@/components/admin/AdminLayout';
import { adminFetchJson, AdminClientError } from '@/lib/admin/client';
import type { AdminAlert, AdminDashboardResponse, AdminMetricValue, AdminQueueItem } from '@/lib/dashboard/types';

const HASH_TO_TAB: Record<string, 'visao' | 'operacao' | 'comercial' | 'clinico' | 'tech'> = {
  '': 'visao',
  operacao: 'operacao',
  comercial: 'comercial',
  clinico: 'clinico',
  tech: 'tech',
};

const TAB_TO_HASH: Record<string, string> = {
  visao: '',
  operacao: '#operacao',
  comercial: '#comercial',
  clinico: '#clinico',
  tech: '#tech',
};

const fetcher = (url: string) => adminFetchJson<AdminDashboardResponse>(url);

function formatMetric(metric: AdminMetricValue) {
  if (metric.value == null) return 'Indisponível';
  if (metric.unit === 'brl') {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(metric.value);
  }
  if (metric.unit === 'percent') {
    return `${metric.value}%`;
  }
  return new Intl.NumberFormat('pt-BR').format(metric.value);
}

function queueTone(status: string) {
  if (status === 'PENDING_PAYMENT' || status === 'pending') return 'bg-amber-50 border-amber-200 text-amber-800';
  if (status === 'failed' || status === 'expired' || status === 'rejected') return 'bg-rose-50 border-rose-200 text-rose-800';
  if (status === 'SHIPPED' || status === 'opened') return 'bg-blue-50 border-blue-200 text-blue-800';
  return 'bg-slate-50 border-slate-200 text-slate-800';
}

function alertTone(alert: AdminAlert) {
  if (alert.level === 'critical') return 'border-rose-200 bg-rose-50';
  if (alert.level === 'warning') return 'border-amber-200 bg-amber-50';
  if (alert.level === 'success') return 'border-emerald-200 bg-emerald-50';
  return 'border-slate-200 bg-slate-50';
}

function QueueList({ title, items, emptyLabel }: { title: string; items: AdminQueueItem[]; emptyLabel: string }) {
  return (
    <section className="rounded-[1.5rem] border border-gray-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between gap-3">
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700">
          {items.length}
        </span>
      </div>
      <div className="mt-4 space-y-3">
        {items.map((item) => (
          <div key={item.id} className={`rounded-2xl border p-4 ${queueTone(item.status)}`}>
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-sm font-semibold">{item.title}</p>
                <p className="mt-1 text-sm">{item.subtitle}</p>
              </div>
              <div className="text-right text-xs">
                <p className="font-semibold uppercase tracking-[0.12em]">{item.status}</p>
                {item.ageHours != null && <p className="mt-1">{item.ageHours}h</p>}
              </div>
            </div>
            {(item.href || item.meta) && (
              <div className="mt-3 flex items-center justify-between gap-3 text-xs text-slate-600">
                <span>{item.meta || 'Fila operacional'}</span>
                {item.href && (
                  <Link href={item.href} className="font-semibold text-emerald-700 hover:text-emerald-800">
                    {item.ctaLabel || 'Abrir'} →
                  </Link>
                )}
              </div>
            )}
          </div>
        ))}
        {items.length === 0 && (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-4 text-sm text-slate-600">
            {emptyLabel}
          </div>
        )}
      </div>
    </section>
  );
}

export async function getServerSideProps() {
  return { props: {} };
}

export default function AdminPage() {
  const router = useRouter();
  const [period, setPeriod] = useState<'today' | '7d' | '30d'>('30d');
  const [activeTab, setActiveTab] = useState<'visao' | 'operacao' | 'comercial' | 'clinico' | 'tech'>('visao');
  const [loggingOut, setLoggingOut] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const hash = (window.location.hash || '').replace(/^#/, '');
    setActiveTab(HASH_TO_TAB[hash] || 'visao');
  }, [router.asPath]);

  const { data, error, isLoading, mutate } = useSWR(
    `/api/admin/dashboard?period=${period}`,
    fetcher,
    { refreshInterval: 30000 }
  );

  const isUnauthorized = error instanceof AdminClientError && error.status === 401;

  const tabs = [
    { id: 'visao' as const, label: 'Visão Geral', icon: FiTrendingUp },
    { id: 'operacao' as const, label: 'Operação', icon: FiTruck },
    { id: 'comercial' as const, label: 'Comercial', icon: FiUsers },
    { id: 'clinico' as const, label: 'Clínico', icon: FiActivity },
    { id: 'tech' as const, label: 'Saúde Técnica', icon: FiShield },
  ];

  const topAlerts = useMemo(() => data?.alerts.slice(0, 3) || [], [data?.alerts]);

  const logout = async () => {
    setLoggingOut(true);
    try {
      await fetch('/api/admin/auth/session', {
        method: 'DELETE',
        credentials: 'same-origin',
      });
      router.replace('/admin/login');
    } finally {
      setLoggingOut(false);
    }
  };

  return (
    <>
      <Head>
        <title>Admin Dashboard | MeJoy</title>
        <meta name="robots" content="noindex,nofollow" />
        <meta name="description" content="Cockpit operacional e executivo do lançamento MeJoy." />
      </Head>

      <AdminLayout
        title="Cockpit MeJoy"
        subtitle="Operação, comercial, clínico e saúde técnica em dados reais"
      >
        <div className="space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-[1.5rem] border border-gray-200 bg-white p-4 shadow-sm">
            <div className="flex flex-wrap items-center gap-3">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id);
                    if (typeof window !== 'undefined') {
                      window.location.hash = TAB_TO_HASH[tab.id] || '';
                    }
                  }}
                  className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition ${
                    activeTab === tab.id
                      ? 'bg-slate-950 text-white'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  <tab.icon size={16} />
                  {tab.label}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2">
              <select
                value={period}
                onChange={(event) => setPeriod(event.target.value as 'today' | '7d' | '30d')}
                className="rounded-full border border-gray-200 bg-white px-4 py-2 text-sm text-gray-700"
              >
                <option value="today">Hoje</option>
                <option value="7d">Últimos 7 dias</option>
                <option value="30d">Últimos 30 dias</option>
              </select>
              <button
                onClick={() => mutate()}
                className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                <FiRefreshCw size={16} />
                Atualizar
              </button>
              <button
                onClick={logout}
                disabled={loggingOut}
                className="inline-flex items-center gap-2 rounded-full bg-slate-950 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800 disabled:opacity-60"
              >
                {loggingOut ? 'Saindo...' : 'Sair'}
              </button>
            </div>
          </div>

          {isUnauthorized && (
            <div className="rounded-[1.5rem] border border-amber-200 bg-amber-50 p-5 shadow-sm">
              <p className="text-sm font-semibold text-amber-900">Sessão admin necessária</p>
              <p className="mt-2 text-sm text-amber-800">
                Este cockpit usa sessão server-only. Entre novamente para carregar os dados operacionais.
              </p>
              <Link href="/admin/login" className="mt-4 inline-flex text-sm font-semibold text-amber-900">
                Ir para login →
              </Link>
            </div>
          )}

          {data?.degraded && (
            <div className="rounded-[1.5rem] border border-amber-200 bg-amber-50 p-5 shadow-sm">
              <div className="flex items-start gap-3">
                <FiAlertTriangle className="mt-0.5 text-amber-700" />
                <div>
                  <p className="text-sm font-semibold text-amber-900">Dashboard degradado, sem dados inventados</p>
                  <p className="mt-1 text-sm text-amber-800">
                    Pelo menos uma fonte crítica está indisponível. Os números abaixo continuam reais, mas podem estar parciais.
                  </p>
                </div>
              </div>
              <div className="mt-4 grid gap-3 md:grid-cols-2">
                {data.degradedReasons.map((reason) => (
                  <div key={`${reason.source}-${reason.message}`} className="rounded-2xl border border-amber-200 bg-white p-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.12em] text-amber-700">{reason.source}</p>
                    <p className="mt-2 text-sm text-slate-700">{reason.message}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {topAlerts.length > 0 && (
            <div className="grid gap-4 lg:grid-cols-3">
              {topAlerts.map((alert) => (
                <div key={alert.id} className={`rounded-[1.5rem] border p-5 shadow-sm ${alertTone(alert)}`}>
                  <p className="text-sm font-semibold text-slate-900">{alert.title}</p>
                  <p className="mt-2 text-sm text-slate-700">{alert.body}</p>
                  {alert.href && (
                    <Link href={alert.href} className="mt-4 inline-flex text-sm font-semibold text-slate-900">
                      Abrir fila →
                    </Link>
                  )}
                </div>
              ))}
            </div>
          )}

          {isLoading && (
            <div className="flex justify-center py-20">
              <div className="h-12 w-12 animate-spin rounded-full border-2 border-slate-900 border-t-transparent" />
            </div>
          )}

          {data && (
            <>
              {activeTab === 'visao' && (
                <div className="space-y-6">
                  <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                    {data.overview.map((metric) => (
                      <div key={metric.label} className="rounded-[1.5rem] border border-gray-200 bg-white p-5 shadow-sm">
                        <p className="text-sm text-slate-500">{metric.label}</p>
                        <p className="mt-3 text-3xl font-semibold text-slate-900">{formatMetric(metric)}</p>
                        {metric.detail && <p className="mt-2 text-xs text-slate-500">{metric.detail}</p>}
                      </div>
                    ))}
                  </section>

                  <section className="grid gap-6 lg:grid-cols-2">
                    <QueueList
                      title="Foco operacional imediato"
                      items={[
                        ...data.operation.queues.pendingPix.slice(0, 3),
                        ...data.operation.queues.paidWithoutNextAction.slice(0, 3),
                        ...data.operation.queues.handoffsStuck.slice(0, 2),
                      ]}
                      emptyLabel="Nenhuma fila crítica aberta neste momento."
                    />
                    <section className="rounded-[1.5rem] border border-gray-200 bg-white p-5 shadow-sm">
                      <h3 className="text-lg font-semibold text-gray-900">Saúde do lançamento</h3>
                      <div className="mt-4 space-y-3">
                        {data.technical.checks.slice(0, 6).map((check) => (
                          <div key={check.id} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                            <div className="flex items-center justify-between gap-3">
                              <p className="text-sm font-semibold text-slate-900">{check.label}</p>
                              <span className="rounded-full bg-white px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-600">
                                {check.status}
                              </span>
                            </div>
                            <p className="mt-2 text-sm text-slate-600">{check.detail}</p>
                          </div>
                        ))}
                      </div>
                    </section>
                  </section>
                </div>
              )}

              {activeTab === 'operacao' && (
                <div className="space-y-6">
                  <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                    {data.operation.stats.map((metric) => (
                      <div key={metric.label} className="rounded-[1.5rem] border border-gray-200 bg-white p-5 shadow-sm">
                        <p className="text-sm text-slate-500">{metric.label}</p>
                        <p className="mt-3 text-3xl font-semibold text-slate-900">{formatMetric(metric)}</p>
                      </div>
                    ))}
                  </section>

                  <section className="rounded-[1.5rem] border border-gray-200 bg-white p-5 shadow-sm">
                    <h3 className="text-lg font-semibold text-gray-900">SLAs operacionais</h3>
                    <div className="mt-4 grid gap-4 md:grid-cols-3">
                      {data.operation.slas.map((sla) => (
                        <div key={sla.id} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                          <p className="text-sm font-semibold text-slate-900">{sla.label}</p>
                          <p className="mt-3 text-2xl font-semibold text-slate-900">
                            {sla.current == null ? 'Indisponível' : sla.current}
                          </p>
                          <p className="mt-1 text-xs uppercase tracking-[0.12em] text-slate-500">
                            status: {sla.status}
                          </p>
                        </div>
                      ))}
                    </div>
                  </section>

                  <div className="grid gap-6 xl:grid-cols-2">
                    <QueueList title="PIX pendente" items={data.operation.queues.pendingPix} emptyLabel="Nenhum PIX pendente no período." />
                    <QueueList title="Pago sem próxima ação" items={data.operation.queues.paidWithoutNextAction} emptyLabel="Nenhum pedido pago aguardando ação." />
                    <QueueList title="Receita / RX pendente" items={data.operation.queues.rxPending} emptyLabel="Nenhum pedido aguardando validação clínica." />
                    <QueueList title="Handoff travado" items={data.operation.queues.handoffsStuck} emptyLabel="Nenhum handoff travado além do SLA." />
                    <QueueList title="Envio / rastreamento" items={data.operation.queues.shipmentsAtRisk} emptyLabel="Nenhum envio em risco." />
                    <QueueList title="Risco de suporte" items={data.operation.queues.supportRisk} emptyLabel="Nenhum caso com risco alto de suporte." />
                  </div>
                </div>
              )}

              {activeTab === 'comercial' && (
                <div className="space-y-6">
                  <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                    {data.commercial.metrics.map((metric) => (
                      <div key={metric.label} className="rounded-[1.5rem] border border-gray-200 bg-white p-5 shadow-sm">
                        <p className="text-sm text-slate-500">{metric.label}</p>
                        <p className="mt-3 text-3xl font-semibold text-slate-900">{formatMetric(metric)}</p>
                        {metric.detail && <p className="mt-2 text-xs text-slate-500">{metric.detail}</p>}
                      </div>
                    ))}
                  </section>

                  <section className="grid gap-6 lg:grid-cols-2">
                    <div className="rounded-[1.5rem] border border-gray-200 bg-white p-5 shadow-sm">
                      <h3 className="text-lg font-semibold text-gray-900">Receita por produto</h3>
                      <div className="mt-4 space-y-3">
                        {data.commercial.revenueByProduct.map((item) => (
                          <div key={item.label} className="flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 p-4">
                            <span className="text-sm font-medium text-slate-900">{item.label}</span>
                            <span className="text-sm font-semibold text-slate-900">
                              {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(item.value / 100)}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="rounded-[1.5rem] border border-gray-200 bg-white p-5 shadow-sm">
                      <h3 className="text-lg font-semibold text-gray-900">Receita por origem</h3>
                      <div className="mt-4 space-y-3">
                        {data.commercial.revenueBySource.map((item) => (
                          <div key={item.label} className="flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 p-4">
                            <span className="text-sm font-medium text-slate-900">{item.label}</span>
                            <span className="text-sm font-semibold text-slate-900">
                              {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(item.value / 100)}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </section>

                  <section className="rounded-[1.5rem] border border-gray-200 bg-white p-5 shadow-sm">
                    <h3 className="text-lg font-semibold text-gray-900">Cohort simples de pagamentos</h3>
                    <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
                      {data.commercial.cohort.map((datum) => (
                        <div key={datum.label} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                          <p className="text-xs uppercase tracking-[0.12em] text-slate-500">{datum.label}</p>
                          <p className="mt-2 text-2xl font-semibold text-slate-900">{datum.value}</p>
                        </div>
                      ))}
                    </div>
                  </section>
                </div>
              )}

              {activeTab === 'clinico' && (
                <div className="space-y-6">
                  <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                    {data.clinical.metrics.map((metric) => (
                      <div key={metric.label} className="rounded-[1.5rem] border border-gray-200 bg-white p-5 shadow-sm">
                        <p className="text-sm text-slate-500">{metric.label}</p>
                        <p className="mt-3 text-3xl font-semibold text-slate-900">{formatMetric(metric)}</p>
                      </div>
                    ))}
                  </section>

                  <section className="rounded-[1.5rem] border border-gray-200 bg-white p-5 shadow-sm">
                    <h3 className="text-lg font-semibold text-gray-900">Pacientes / jornadas recentes</h3>
                    <div className="mt-4 space-y-3">
                      {data.clinical.recentPatients.map((patient) => (
                        <div key={patient.id} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                          <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                            <div>
                              <p className="text-sm font-semibold text-slate-900">{patient.name}</p>
                              <p className="mt-1 text-sm text-slate-600">{patient.latestStatus}</p>
                            </div>
                            <div className="text-xs text-slate-500">
                              {patient.reference}
                            </div>
                          </div>
                          <p className="mt-3 text-xs text-slate-500">Atualizado em {patient.updatedAt ? new Date(patient.updatedAt).toLocaleString('pt-BR') : 'sem data'}</p>
                        </div>
                      ))}
                      {data.clinical.recentPatients.length === 0 && (
                        <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-4 text-sm text-slate-600">
                          Nenhuma jornada clínica recente no período selecionado.
                        </div>
                      )}
                    </div>
                  </section>
                </div>
              )}

              {activeTab === 'tech' && (
                <div className="space-y-6">
                  <section className="rounded-[1.5rem] border border-gray-200 bg-white p-5 shadow-sm">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">Health checks reais</h3>
                        <p className="mt-1 text-sm text-slate-500">
                          Build SHA: {data.technical.buildSha || 'não informado'}
                        </p>
                      </div>
                    </div>
                    <div className="mt-4 grid gap-4 md:grid-cols-2">
                      {data.technical.checks.map((check) => (
                        <div key={check.id} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                          <div className="flex items-center justify-between gap-3">
                            <p className="text-sm font-semibold text-slate-900">{check.label}</p>
                            <span className="rounded-full bg-white px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-600">
                              {check.status}
                            </span>
                          </div>
                          <p className="mt-2 text-sm text-slate-600">{check.detail}</p>
                          {check.updatedAt && (
                            <p className="mt-3 text-xs text-slate-500">
                              Atualizado em {new Date(check.updatedAt).toLocaleString('pt-BR')}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  </section>
                </div>
              )}
            </>
          )}
        </div>
      </AdminLayout>
    </>
  );
}
