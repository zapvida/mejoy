import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { fetchWithUserSession } from '@/lib/api/client-auth';

type DashboardStats = {
  totalTriagens: number;
  totalRelatorios: number;
  totalPedidos: number;
  scoreMedio: number | null;
  ultimaAtividade: string | null;
};

export function useDashboardData() {
  const { user } = useAuth();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user?.email) {
      setStats(null);
      setLoading(false);
      return;
    }

    const fetchStats = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetchWithUserSession<DashboardStats>('/api/dashboard/stats');
        if (response.ok === false) {
          throw new Error(response.error || 'Erro ao buscar estatísticas');
        }
        setStats(response.data);
      } catch (err: any) {
        console.error('[useDashboardData] Error:', err);
        setError(err.message || 'Erro ao carregar dados');
        setStats(null);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [user?.email]);

  return { stats, loading, error };
}
