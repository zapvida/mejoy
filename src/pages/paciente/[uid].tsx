// src/pages/paciente/[uid].tsx
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

import withAuth from '@/components/auth/withAuth';
import { Skeleton, Button } from '@/components/ui';

export async function getServerSideProps() {
  return { props: {} };
}

type Triagem = {
  id: string;
  tipo?: string;
  created_at?: string;
};

function PacientePage() {
  const router = useRouter();
  const { uid } = router.query as { uid?: string };
  const [triagens, setTriagens] = useState<Triagem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!uid) return;

    const fetchData = async () => {
      try {
        const response = await fetch(`/api/triagens?patientId=${uid}`);
        if (response.ok) {
          const data = await response.json();
          setTriagens(data);
        }
      } catch (error) {
        console.error('Erro ao buscar triagens:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [uid]);

  return (
    <>
      <Head>
        <title>Triagens do Paciente - Teodoc</title>
      </Head>
      <main className="min-h-screen bg-background text-white px-4 sm:px-6 md:px-8 pt-28 pb-12">
        <h1 className="text-2xl md:text-3xl font-bold mb-6 text-center">
          🩺 Triagens do Paciente
        </h1>

        {loading ? (
          <div className="flex flex-col gap-4 max-w-xl mx-auto">
            {[...Array(3)].map((_, i) => (
              <Skeleton key={i} className="h-24 rounded-lg" />
            ))}
          </div>
        ) : triagens.length === 0 ? (
          <p className="text-center mt-12 text-lg text-white/70">
            Nenhuma triagem encontrada.
          </p>
        ) : (
          <ul className="space-y-4 max-w-xl mx-auto">
            {triagens.map((triagem) => (
              <li
                key={triagem.id}
                className="bg-white/10 hover:bg-white/20 transition p-4 rounded-xl shadow border border-white/10"
              >
                <p className="text-base">
                  <strong>Tipo:</strong> {triagem.tipo}
                </p>
                <p className="text-sm text-white/70">
                  <strong>Data:</strong>{' '}
                  {triagem.created_at
                    ? new Date(triagem.created_at).toLocaleString('pt-BR')
                    : 'N/A'}
                </p>
                <Button
                  className="mt-3"
                  onClick={() => router.push(`/relatorio/${triagem.id}`)}
                >
                  Ver relatório
                </Button>
              </li>
            ))}
          </ul>
        )}
      </main>
    </>
  );
}

export default withAuth(PacientePage);