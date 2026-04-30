import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';

type Report = {
  id: string;
  triageId: string;
  triageSlug: string;
  status: string;
  createdAt: string;
  completedAt: string | null;
  summary: string | null;
};

export function useReports() {
  const { user } = useAuth();
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user?.email) {
      setReports([]);
      setLoading(false);
      return;
    }

    const fetchReports = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch('/api/reports', {
          headers: {
            'X-User-Email': user.email,
          },
        });

        if (!response.ok) {
          throw new Error('Erro ao buscar relatórios');
        }

        const data = await response.json();
        setReports(data);
      } catch (err: any) {
        console.error('[useReports] Error:', err);
        setError(err.message || 'Erro ao carregar relatórios');
        setReports([]);
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, [user?.email]);

  return { reports, loading, error };
}

