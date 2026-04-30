import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';

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

    fetch('/api/store-v2/orders', {
      headers: { 'X-User-Email': user.email },
    })
      .then((r) => r.json())
      .then((data) => (Array.isArray(data) ? setOrders(data) : setOrders([])))
      .catch(() => setOrders([]))
      .finally(() => setLoading(false));
  }, [user?.email]);

  return { orders, loading };
}
