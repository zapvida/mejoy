import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { fetchWithUserSession } from '@/lib/api/client-auth';

type Order = {
  id: string;
  productSlug: string;
  planSlug: string;
  status: string;
  amount: number;
  currency: string;
  createdAt: string;
  paidAt: string | null;
  customerName: string;
  customerEmail: string;
};

export function useOrders() {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user?.email) {
      setOrders([]);
      setLoading(false);
      return;
    }

    const fetchOrders = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetchWithUserSession<Order[]>('/api/orders');
        if (response.ok === false) {
          throw new Error(response.error || 'Erro ao buscar pedidos');
        }
        setOrders(response.data);
      } catch (err: any) {
        console.error('[useOrders] Error:', err);
        setError(err.message || 'Erro ao carregar pedidos');
        setOrders([]);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [user?.email]);

  return { orders, loading, error };
}
