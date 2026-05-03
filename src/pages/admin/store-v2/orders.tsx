/**
 * Admin: Pedidos Store V2 — listagem, filtros, status, tracking
 */

import Head from 'next/head';
import { useState } from 'react';
import useSWR from 'swr';
import Link from 'next/link';

import { AdminLayout } from '@/components/admin/AdminLayout';
import { adminFetchJson, AdminClientError } from '@/lib/admin/client';

const fetcher = adminFetchJson;

type AdminStoreOrderListItem = {
  id: string;
  customerAccessUrl: string;
  customerEmail: string;
  customerName: string;
  status: string;
  totalCents: number;
};

const STATUS_OPTIONS = [
  { value: '', label: 'Todos' },
  { value: 'PENDING_PAYMENT', label: 'Aguardando pagamento' },
  { value: 'PAID', label: 'Pago' },
  { value: 'PREPARING', label: 'Em preparação' },
  { value: 'SHIPPED', label: 'Enviado' },
  { value: 'DELIVERED', label: 'Entregue' },
];

function formatPrice(cents: number) {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(cents / 100);
}

export default function AdminStoreV2OrdersPage() {
  const [statusFilter, setStatusFilter] = useState('');
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<string | null>(null);
  const [patchLoading, setPatchLoading] = useState(false);

  const params = new URLSearchParams();
  if (statusFilter) params.set('status', statusFilter);
  if (debouncedSearch) params.set('search', debouncedSearch);

  const { data: orders = [], error, mutate } = useSWR<AdminStoreOrderListItem[]>(
    `/api/admin/store-v2/orders?${params}`,
    fetcher,
    { refreshInterval: 30000 }
  );

  const { data: orderDetail, mutate: mutateOrderDetail } = useSWR<any>(
    selectedOrder ? `/api/admin/store-v2/orders/${selectedOrder}` : null,
    fetcher
  );

  const handleSearch = () => setDebouncedSearch(search);

  const handlePatch = async (orderId: string, body: { status?: string; trackingCode?: string; trackingUrl?: string }) => {
    setPatchLoading(true);
    try {
      const res = await fetch(`/api/admin/store-v2/orders/${orderId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'same-origin',
        body: JSON.stringify(body),
      });
      if (!res.ok) throw new Error((await res.json()).error || 'Erro');
      mutate();
      if (selectedOrder === orderId) {
        mutateOrderDetail();
      }
    } catch (e) {
      alert(e instanceof Error ? e.message : 'Erro ao atualizar');
    } finally {
      setPatchLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>Pedidos Loja | MeJoy Admin</title>
      </Head>
      <AdminLayout title="Pedidos Loja (Store V2)" subtitle="Gerencie status e rastreamento">
        <div className="space-y-6">
          {error instanceof AdminClientError && error.status === 401 && (
            <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
              Sessão admin necessária para carregar e editar pedidos.
              <Link href="/admin/login" className="ml-2 font-semibold underline">
                Entrar
              </Link>
            </div>
          )}

          {/* Filtros */}
          <div className="flex flex-col sm:flex-row gap-4">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border rounded-lg"
            >
              {STATUS_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
            <div className="flex gap-2 flex-1">
              <input
                type="text"
                placeholder="Buscar por email, nome ou telefone"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                className="flex-1 px-4 py-2 border rounded-lg"
              />
              <button
                onClick={handleSearch}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Buscar
              </button>
            </div>
          </div>

          {error && (
            <p className="text-red-600">
              {error instanceof Error ? error.message : 'Erro ao carregar pedidos.'}
            </p>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Lista */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-xl border overflow-hidden">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b">
                    <tr>
                      <th className="text-left px-4 py-3 text-sm font-medium text-gray-700">Pedido</th>
                      <th className="text-left px-4 py-3 text-sm font-medium text-gray-700">Cliente</th>
                      <th className="text-left px-4 py-3 text-sm font-medium text-gray-700">Status</th>
                      <th className="text-right px-4 py-3 text-sm font-medium text-gray-700">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map((o: any) => (
                      <tr
                        key={o.id}
                        onClick={() => setSelectedOrder(o.id)}
                        className={`border-b cursor-pointer hover:bg-gray-50 ${
                          selectedOrder === o.id ? 'bg-blue-50' : ''
                        }`}
                      >
                        <td className="px-4 py-3">
                          <Link href={o.customerAccessUrl} target="_blank" className="text-blue-600 hover:underline">
                            #{o.id.slice(-8).toUpperCase()}
                          </Link>
                        </td>
                        <td className="px-4 py-3 text-sm">
                          {o.customerName}
                          <br />
                          <span className="text-gray-500">{o.customerEmail}</span>
                        </td>
                        <td className="px-4 py-3">
                          <span
                            className={`px-2 py-1 rounded text-xs font-medium ${
                              o.status === 'PAID'
                                ? 'bg-green-100 text-green-800'
                                : o.status === 'PENDING_PAYMENT'
                                  ? 'bg-amber-100 text-amber-800'
                                  : o.status === 'SHIPPED' || o.status === 'DELIVERED'
                                    ? 'bg-blue-100 text-blue-800'
                                    : 'bg-gray-100 text-gray-800'
                            }`}
                          >
                            {o.status}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-right font-medium">{formatPrice(o.totalCents)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {orders.length === 0 && (
                  <div className="py-12 text-center text-gray-500">Nenhum pedido encontrado.</div>
                )}
              </div>
            </div>

            {/* Detalhe e ações */}
            <div className="lg:col-span-1">
              {selectedOrder && orderDetail ? (
                <OrderDetailPanel
                  order={orderDetail}
                  onPatch={handlePatch}
                  loading={patchLoading}
                  onClose={() => setSelectedOrder(null)}
                />
              ) : (
                <div className="bg-white rounded-xl border p-6 text-center text-gray-500">
                  Clique em um pedido para ver detalhes e atualizar status.
                </div>
              )}
            </div>
          </div>
        </div>
      </AdminLayout>
    </>
  );
}

function OrderDetailPanel({
  order,
  onPatch,
  loading,
  onClose,
}: {
  order: any;
  onPatch: (id: string, b: object) => Promise<void>;
  loading: boolean;
  onClose: () => void;
}) {
  const [status, setStatus] = useState(order.status);
  const [trackingCode, setTrackingCode] = useState(order.trackingCode || '');
  const [trackingUrl, setTrackingUrl] = useState(order.trackingUrl || '');

  const snap = order.snapshot as { items?: Array<{ name: string; quantity: number; priceCents: number }> } | null;
  const items = snap?.items ?? [];

  return (
    <div className="bg-white rounded-xl border p-6 space-y-4">
      <div className="flex justify-between">
        <h3 className="font-semibold">Pedido #{order.id.slice(-8).toUpperCase()}</h3>
        <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
          ✕
        </button>
      </div>
      <p className="text-sm text-gray-600">
        {order.customerName} — {order.customerEmail}
      </p>
      <p className="text-lg font-semibold">{formatPrice(order.totalCents)}</p>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="w-full px-3 py-2 border rounded-lg"
        >
          {STATUS_OPTIONS.filter((o) => o.value).map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
        <button
          onClick={() => onPatch(order.id, { status })}
          disabled={loading || status === order.status}
          className="mt-2 w-full px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
        >
          Atualizar status
        </button>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Código rastreio</label>
        <input
          type="text"
          value={trackingCode}
          onChange={(e) => setTrackingCode(e.target.value)}
          placeholder="BR123456789..."
          className="w-full px-3 py-2 border rounded-lg"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">URL rastreio</label>
        <input
          type="url"
          value={trackingUrl}
          onChange={(e) => setTrackingUrl(e.target.value)}
          placeholder="https://..."
          className="w-full px-3 py-2 border rounded-lg"
        />
        <button
          onClick={() => onPatch(order.id, { trackingCode: trackingCode || undefined, trackingUrl: trackingUrl || undefined })}
          disabled={loading || (trackingCode === (order.trackingCode || '') && trackingUrl === (order.trackingUrl || ''))}
          className="mt-2 w-full px-3 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-800 disabled:opacity-50"
        >
          Salvar rastreio
        </button>
      </div>

      {items.length > 0 && (
        <div className="pt-2 border-t">
          <p className="text-sm font-medium text-gray-700 mb-2">Itens</p>
          <ul className="text-sm text-gray-600 space-y-1">
            {items.map((i: any, idx: number) => (
              <li key={idx}>
                {i.name} × {i.quantity} — {formatPrice(i.priceCents * i.quantity)}
              </li>
            ))}
          </ul>
        </div>
      )}

      {order.trackingUrl && (
        <a
          href={order.trackingUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="block text-center text-blue-600 hover:underline text-sm"
        >
          Abrir rastreio →
        </a>
      )}
    </div>
  );
}
