'use client';

import { useEffect, useState } from 'react';

import LogoUpload from '@/components/b2b/LogoUpload';
import PlanBadge from '@/components/b2b/PlanBadge';
import { useAuth } from '@/context/AuthContext';

export default function B2BDashboardPage() {
  const { user } = useAuth();
  const [cliente, setCliente] = useState<any>(null);

  useEffect(() => {
    if (!user) return;

    const fetchCliente = async () => {
      try {
        const response = await fetch(`/api/clientes/${user.id}`);
        if (response.ok) {
          const data = await response.json();
          setCliente(data);
        }
      } catch (error) {
        console.error('Erro ao buscar cliente:', error);
      }
    };

    fetchCliente();
  }, [user]);

  if (!user) return <p className="text-center py-10">Carregando...</p>;

  return (
    <main className="min-h-screen bg-gradient-to-br from-[#000000] via-[#000000] to-[#000000] text-white px-4 py-12">
      <h1 className="text-3xl font-bold mb-6">Painel da Clínica</h1>

      <section className="bg-white/10 p-6 rounded-xl shadow-lg mb-6">
        <h2 className="text-xl font-semibold mb-4">Informações do Cliente</h2>
        {cliente ? (
          <ul className="text-sm space-y-1">
            <li><strong>Nome:</strong> {cliente.nome || '—'}</li>
            <li><strong>Domínio personalizado:</strong> {cliente.dominio || '—'}</li>
            <li><strong>Plano atual:</strong> <PlanBadge plano={cliente.plano} /></li>
          </ul>
        ) : (
          <p className="text-white/70">Nenhum dado encontrado.</p>
        )}
      </section>

      <section className="bg-white/10 p-6 rounded-xl shadow-lg mb-6">
        <h2 className="text-xl font-semibold mb-4">Logo da Clínica</h2>
        <LogoUpload clienteId={user.id} />
      </section>

      <section className="bg-white/10 p-6 rounded-xl shadow-lg">
        <h2 className="text-xl font-semibold mb-4">Integrações</h2>
        <p className="text-white/70 text-sm">Em breve: WhatsApp IA, campanhas e ROI.</p>
      </section>
    </main>
  );
}