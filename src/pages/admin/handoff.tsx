import Head from 'next/head';
import Link from 'next/link';
import { useMemo, useState } from 'react';
import useSWR from 'swr';
import { FiRefreshCw } from 'react-icons/fi';

import { AdminLayout } from '../../components/admin/AdminLayout';
import { adminFetchJson, AdminClientError } from '@/lib/admin/client';

type HandoffMetricsResponse = {
  ok: boolean;
  periodDays: number;
  totals: {
    created: number;
    opened: number;
    completed: number;
    clinicalPaymentStarted: number;
    clinicalPaymentSuccess: number;
    consultCompleted: number;
    pharmacyOrderStarted: number;
    pharmacyOrderCreated: number;
    followupStarted: number;
  };
  rates: {
    openRate: number;
    completionRate: number;
    clinicalPaymentRate: number;
  };
  byStatus: Record<string, number>;
  error?: string;
  _mock?: boolean;
};

export async function getServerSideProps() {
  return { props: {} };
}

const statusLabels: Record<string, string> = {
  created: 'Handoff criado',
  opened: 'Handoff aberto',
  accepted: 'Handoff aceito',
  completed: 'Handoff concluído',
  clinical_payment_started: 'Pagamento clínico iniciado',
  clinical_payment_success: 'Pagamento clínico confirmado',
  consult_completed: 'Consulta concluída',
  pharmacy_order_started: 'Pedido farmácia iniciado',
  pharmacy_order_created: 'Pedido farmácia criado',
  followup_started: 'Follow-up iniciado',
  failed: 'Falha',
  expired: 'Expirado'
};

export default function AdminHandoffPage() {
  const [days, setDays] = useState(7);
  const { data, error, isLoading, mutate } = useSWR<HandoffMetricsResponse>(
    `/api/admin/handoff?days=${days}`,
    adminFetchJson,
    { refreshInterval: 30000 }
  );

  const rows = useMemo(() => {
    const byStatus = data?.byStatus || {};
    return Object.entries(byStatus)
      .sort((a, b) => b[1] - a[1])
      .map(([status, total]) => ({
        status,
        label: statusLabels[status] || status,
        total
      }));
  }, [data?.byStatus]);

  return (
    <>
      <Head>
        <title>Handoff Clínico | Admin MeJoy</title>
        <meta name="robots" content="noindex,nofollow" />
      </Head>
      <AdminLayout
        title="Handoff Clínico MeJoy → ZapVida"
        subtitle="Rastreabilidade de ponta a ponta do funil clínico"
      >
        <div className="space-y-6">
          {error instanceof AdminClientError && error.status === 401 && (
            <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
              Sessão admin necessária para carregar o handoff clínico.
              <Link href="/admin/login" className="ml-2 font-semibold underline">
                Entrar
              </Link>
            </div>
          )}

          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <label htmlFor="period" className="text-sm font-medium text-gray-700">
                Janela
              </label>
              <select
                id="period"
                value={days}
                onChange={(e) => setDays(Number(e.target.value))}
                className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700"
              >
                <option value={7}>Últimos 7 dias</option>
                <option value={14}>Últimos 14 dias</option>
                <option value={30}>Últimos 30 dias</option>
                <option value={60}>Últimos 60 dias</option>
              </select>
            </div>
            <button
              type="button"
              onClick={() => mutate()}
              className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              <FiRefreshCw size={16} />
              Atualizar
            </button>
          </div>

          {isLoading && (
            <div className="flex justify-center py-12">
              <div className="h-10 w-10 animate-spin rounded-full border-2 border-blue-600 border-t-transparent" />
            </div>
          )}

          {!isLoading && data && (
            <>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
                  <p className="text-sm text-gray-500">Open rate</p>
                  <p className="mt-2 text-3xl font-bold text-gray-900">{data.rates.openRate}%</p>
                  <p className="mt-1 text-xs text-gray-500">
                    {data.totals.opened} de {data.totals.created} handoffs abertos
                  </p>
                </div>
                <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
                  <p className="text-sm text-gray-500">Completion rate</p>
                  <p className="mt-2 text-3xl font-bold text-gray-900">{data.rates.completionRate}%</p>
                  <p className="mt-1 text-xs text-gray-500">
                    {data.totals.completed} de {data.totals.created} handoffs concluídos
                  </p>
                </div>
                <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
                  <p className="text-sm text-gray-500">Clinical payment rate</p>
                  <p className="mt-2 text-3xl font-bold text-gray-900">{data.rates.clinicalPaymentRate}%</p>
                  <p className="mt-1 text-xs text-gray-500">
                    {data.totals.clinicalPaymentStarted} de {data.totals.opened} abriram pagamento clínico
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
                  <h3 className="text-lg font-semibold text-gray-900">Eventos por etapa</h3>
                  <div className="mt-4 space-y-2">
                    {rows.length === 0 && <p className="text-sm text-gray-500">Sem dados no período.</p>}
                    {rows.map((row) => (
                      <div key={row.status} className="flex items-center justify-between rounded-lg bg-gray-50 px-3 py-2">
                        <span className="text-sm text-gray-700">{row.label}</span>
                        <span className="rounded-md bg-white px-2 py-1 text-sm font-semibold text-gray-900">
                          {row.total}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
                  <h3 className="text-lg font-semibold text-gray-900">Totais operacionais</h3>
                  <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                    <div className="rounded-lg border border-gray-100 p-3">
                      <p className="text-gray-500">Criados</p>
                      <p className="mt-1 text-xl font-bold text-gray-900">{data.totals.created}</p>
                    </div>
                    <div className="rounded-lg border border-gray-100 p-3">
                      <p className="text-gray-500">Abertos</p>
                      <p className="mt-1 text-xl font-bold text-gray-900">{data.totals.opened}</p>
                    </div>
                    <div className="rounded-lg border border-gray-100 p-3">
                      <p className="text-gray-500">Pagto clínico</p>
                      <p className="mt-1 text-xl font-bold text-gray-900">{data.totals.clinicalPaymentSuccess}</p>
                    </div>
                    <div className="rounded-lg border border-gray-100 p-3">
                      <p className="text-gray-500">Consultas concluídas</p>
                      <p className="mt-1 text-xl font-bold text-gray-900">{data.totals.consultCompleted}</p>
                    </div>
                    <div className="rounded-lg border border-gray-100 p-3">
                      <p className="text-gray-500">Pedidos farmácia</p>
                      <p className="mt-1 text-xl font-bold text-gray-900">{data.totals.pharmacyOrderCreated}</p>
                    </div>
                    <div className="rounded-lg border border-gray-100 p-3">
                      <p className="text-gray-500">Follow-up</p>
                      <p className="mt-1 text-xl font-bold text-gray-900">{data.totals.followupStarted}</p>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </AdminLayout>
    </>
  );
}
