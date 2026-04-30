import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';

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
      // Se não houver usuário autenticado, retornar zeros
      setStats({
        totalTriagens: 0,
        totalRelatorios: 0,
        totalPedidos: 0,
        scoreMedio: null,
        ultimaAtividade: null,
      });
      setLoading(false);
      return;
    }

    const fetchStats = async () => {
      try {
        setLoading(true);
        setError(null);

        // Enviar email do usuário no header
        const response = await fetch('/api/dashboard/stats', {
          headers: {
            'X-User-Email': user.email,
          },
        });

        if (!response.ok) {
          throw new Error('Erro ao buscar estatísticas');
        }

        const data = await response.json();
        setStats(data);
      } catch (err: any) {
        console.error('[useDashboardData] Error:', err);
        setError(err.message || 'Erro ao carregar dados');
        // Em caso de erro, retornar zeros
        setStats({
          totalTriagens: 0,
          totalRelatorios: 0,
          totalPedidos: 0,
          scoreMedio: null,
          ultimaAtividade: null,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [user?.email]);

  return { stats, loading, error };
}

