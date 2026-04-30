/**
 * Admin Leads - Estilo ZapVida, todos os produtos, funil por etapa
 */

import Head from 'next/head';

export async function getServerSideProps() {
  return { props: {} };
}
import { useCallback, useState } from 'react';
import useSWR from 'swr';
import { FiDownload } from 'react-icons/fi';

import { AdminLayout } from '../../components/admin/AdminLayout';
import { getMockLeads } from '../../lib/admin-mocks';

const PRODUCTS = [
  { slug: '', label: 'Todos os produtos' },
  { slug: 'emagrecimento', label: 'Emagrecimento' },
  { slug: 'calvicie', label: 'Calvície' },
  { slug: 'sono', label: 'Sono' },
  { slug: 'ansiedade', label: 'Ansiedade' },
  { slug: 'intestino', label: 'Intestino' },
  { slug: 'figado', label: 'Fígado' },
  { slug: 'libido-masculina', label: 'Libido Masculina' },
  { slug: 'menopausa', label: 'Menopausa' },
  { slug: 'articulacoes', label: 'Articulações' },
  { slug: 'imunidade', label: 'Imunidade' },
  { slug: 'geral', label: 'Geral' },
];

const STEPS = [
  { slug: '', label: 'Todas as etapas' },
  { slug: 'triage_started', label: 'Triagem iniciada' },
  { slug: 'triage_completed', label: 'Triagem concluída' },
  { slug: 'report_ready', label: 'Relatório pronto' },
  { slug: 'checkout_started', label: 'Checkout iniciado' },
  { slug: 'paid', label: 'Pago' },
];

const token = () => process.env.NEXT_PUBLIC_ADMIN_SECRET_KEY || 'admin-secret-key';

const fetcherWithMocks = async (url: string) => {
  try {
    const res = await fetch(url, {
      headers: { Authorization: `Bearer ${token()}` },
    });
    if (res.ok) return res.json();
  } catch { /* fetch failed, use mock */ }
  const leads = getMockLeads(200);
  return {
    leads,
    total: 5000,
    page: 1,
    pageSize: 20,
    totalPages: 250,
    generatedAt: new Date().toISOString(),
    _mock: true,
  };
};

export default function AdminLeadsPage() {
  const [productSlug, setProductSlug] = useState('');
  const [currentStep, setCurrentStep] = useState('');
  const [page, setPage] = useState(1);

  const params = new URLSearchParams();
  if (productSlug) params.set('productSlug', productSlug);
  if (currentStep) params.set('currentStep', currentStep);
  params.set('page', String(page));
  params.set('pageSize', '20');

  const { data, error } = useSWR(`/api/admin/leads?${params}`, fetcherWithMocks, {
    refreshInterval: 30000,
  });

  const handleExport = useCallback(
    async (includePII: boolean) => {
      const p = new URLSearchParams();
      if (productSlug) p.set('productSlug', productSlug);
      if (currentStep) p.set('currentStep', currentStep);
      if (includePII) p.set('includePII', 'true');
      const res = await fetch(`/api/admin/leads/export?${p}`, {
        headers: {
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_ADMIN_SECRET_KEY || 'admin-secret-key'}`,
        },
      });
      if (!res.ok) throw new Error('Erro na exportação');
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `leads-mejoy-${new Date().toISOString().split('T')[0]}.csv`;
      a.click();
      URL.revokeObjectURL(url);
    },
    [productSlug, currentStep]
  );

  return (
    <>
      <Head>
        <title>Leads | Admin MeJoy</title>
        <meta name="robots" content="noindex,nofollow" />
      </Head>
      <AdminLayout title="Leads Unificados" subtitle="Funil por produto e etapa em que cada pessoa parou">
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-3 sm:gap-4">
            <div className="flex flex-wrap gap-3">
              <select
                value={productSlug}
                onChange={(e) => setProductSlug(e.target.value)}
                className="bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                {PRODUCTS.map((p) => (
                  <option key={p.slug || 'all'} value={p.slug}>
                    {p.label}
                  </option>
                ))}
              </select>
              <select
                value={currentStep}
                onChange={(e) => setCurrentStep(e.target.value)}
                className="bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                {STEPS.map((s) => (
                  <option key={s.slug || 'all'} value={s.slug}>
                    {s.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => handleExport(false)}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-medium transition-colors"
              >
                <FiDownload size={16} />
                Exportar CSV
              </button>
              <button
                onClick={() => handleExport(true)}
                className="flex items-center gap-2 px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-sm font-medium transition-colors"
              >
                <FiDownload size={16} />
                Exportar com PII
              </button>
            </div>
          </div>

          {(data as any)?._mock && (
            <div className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-xl flex items-center gap-2">
              <span className="text-amber-600 text-sm font-medium">Modo demonstração</span>
              <span className="text-amber-600/80 text-xs">5000 leads simulados. Configure ADMIN_SECRET_KEY na Vercel para dados reais.</span>
            </div>
          )}

          {data && (
            <>
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden -mx-2 sm:mx-0">
                <div className="overflow-x-auto overscroll-x-contain">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-gray-50 border-b border-gray-200">
                        <th className="text-left p-4 text-sm font-semibold text-gray-700">Nome</th>
                        <th className="text-left p-4 text-sm font-semibold text-gray-700">Email</th>
                        <th className="text-left p-4 text-sm font-semibold text-gray-700">WhatsApp</th>
                        <th className="text-left p-4 text-sm font-semibold text-gray-700">Produto</th>
                        <th className="text-left p-4 text-sm font-semibold text-gray-700">Etapa</th>
                        <th className="text-left p-4 text-sm font-semibold text-gray-700">Atualizado</th>
                      </tr>
                    </thead>
                    <tbody>
                      {(data.leads ?? []).map((lead: any, i: number) => (
                        <tr key={lead.profileId || i} className="border-b border-gray-100 hover:bg-gray-50">
                          <td className="p-4 text-sm text-gray-900">{lead.name}</td>
                          <td className="p-4 text-sm text-gray-600">{lead.email}</td>
                          <td className="p-4 text-sm text-gray-600">{lead.whatsapp}</td>
                          <td className="p-4">
                            <span className="inline-flex px-2 py-1 rounded-md bg-blue-50 text-blue-700 text-xs font-medium">
                              {lead.productLabel || lead.productSlug}
                            </span>
                          </td>
                          <td className="p-4">
                            <span
                              className={`inline-flex px-2 py-1 rounded-md text-xs font-medium ${
                                lead.currentStep === 'paid'
                                  ? 'bg-green-100 text-green-800'
                                  : lead.currentStep === 'report_ready'
                                  ? 'bg-blue-100 text-blue-800'
                                  : 'bg-gray-100 text-gray-700'
                              }`}
                            >
                              {lead.currentStepLabel || lead.currentStep}
                            </span>
                          </td>
                          <td className="p-4 text-sm text-gray-500">
                            {lead.updatedAt ? new Date(lead.updatedAt).toLocaleString('pt-BR') : '-'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {data.totalPages > 1 && (
                <div className="flex justify-center items-center gap-4">
                  <button
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page <= 1}
                    className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Anterior
                  </button>
                  <span className="text-sm text-gray-600">
                    Página {page} de {data.totalPages} • {data.total} leads
                  </span>
                  <button
                    onClick={() => setPage((p) => Math.min(data.totalPages, p + 1))}
                    disabled={page >= data.totalPages}
                    className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Próxima
                  </button>
                </div>
              )}
            </>
          )}

          {!data && !error && (
            <div className="flex justify-center py-16">
              <div className="animate-spin rounded-full h-10 w-10 border-2 border-blue-600 border-t-transparent" />
            </div>
          )}
        </div>
      </AdminLayout>
    </>
  );
}
