import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { fetchWithUserSession } from '@/lib/api/client-auth';

export type StoreV2Order = {
  id: string;
  status: string;
  totalCents: number;
  shippingCents: number;
  createdAt: string;
  customerName: string;
};

export function useStoreV2Orders() {
  const { user } = useAuth();
  const [orders, setOrders] = useState<StoreV2Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.email) {
      setOrders([]);
      setLoading(false);
      return;
    }

    fetchWithUserSession<StoreV2Order[]>('/api/store-v2/orders')
      .then((result) => (result.ok && Array.isArray(result.data) ? setOrders(result.data) : setOrders([])))
      .catch(() => setOrders([]))
      .finally(() => setLoading(false));
  }, [user?.email]);

  return { orders, loading };
}
