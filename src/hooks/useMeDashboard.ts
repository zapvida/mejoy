import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { fetchWithUserSession } from '@/lib/api/client-auth';
import type { MeDashboardResponse } from '@/lib/dashboard/types';

type DashboardError = {
  message: string;
  status?: number;
};

export function useMeDashboard() {
  const { user } = useAuth();
  const [dashboard, setDashboard] = useState<MeDashboardResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<DashboardError | null>(null);

  useEffect(() => {
    if (!user?.email) {
      setDashboard(null);
      setLoading(false);
      return;
    }

    let active = true;

    const run = async () => {
      setLoading(true);
      setError(null);

      const result = await fetchWithUserSession<MeDashboardResponse>('/api/me/dashboard');
      if (!active) return;

      if (result.ok === false) {
        setDashboard(null);
        setError({ message: result.error, status: result.status });
        setLoading(false);
        return;
      }

      setDashboard(result.data);
      setLoading(false);
    };

    run().catch((err) => {
      if (!active) return;
      setDashboard(null);
      setError({ message: err instanceof Error ? err.message : 'Erro ao carregar dashboard' });
      setLoading(false);
    });

    return () => {
      active = false;
    };
  }, [user?.email]);

  return { dashboard, loading, error };
}
