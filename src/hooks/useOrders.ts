import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';

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

        const response = await fetch('/api/orders', {
          headers: {
            'X-User-Email': user.email,
          },
        });

        if (!response.ok) {
          throw new Error('Erro ao buscar pedidos');
        }

        const data = await response.json();
        setOrders(data);
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

