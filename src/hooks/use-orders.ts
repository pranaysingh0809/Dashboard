// src/hooks/use-orders.ts

import { useState, useEffect, useCallback } from 'react';
import { FlattenedOrder, StoreOrderGroup, OrderDetails } from '@/types';
import { orderApi, flattenOrdersFromGroups } from '@/services/orderApi';

// ============================================
// Hook for managing orders (flattened list)
// ============================================
interface UseOrdersReturn {
  orders: FlattenedOrder[];
  loading: boolean;
  error: string | null;
  totalOrders: number;
  totalStores: number;
  refetch: () => Promise<void>;
  fetchByStatus: (status?: string) => Promise<void>;
}

export function useOrders(initialStatus?: string): UseOrdersReturn {
  const [orders, setOrders] = useState<FlattenedOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalOrders, setTotalOrders] = useState(0);
  const [totalStores, setTotalStores] = useState(0);

  const fetchOrders = useCallback(async (status?: string) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await orderApi.getGroupedByStore(status);
      
      if (response?.data?.stores) {
        const flattenedOrders = flattenOrdersFromGroups(response.data.stores);
        setOrders(flattenedOrders);
        setTotalOrders(response.data.totalOrders || flattenedOrders.length);
        setTotalStores(response.data.totalStores || response.data.stores.length);
      } else {
        setOrders([]);
        setTotalOrders(0);
        setTotalStores(0);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch orders');
      setOrders([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOrders(initialStatus);
  }, [fetchOrders, initialStatus]);

  const refetch = useCallback(async () => {
    await fetchOrders(initialStatus);
  }, [fetchOrders, initialStatus]);

  const fetchByStatus = useCallback(async (status?: string) => {
    await fetchOrders(status);
  }, [fetchOrders]);

  return {
    orders,
    loading,
    error,
    totalOrders,
    totalStores,
    refetch,
    fetchByStatus,
  };
}

// ============================================
// Hook for managing orders grouped by store
// ============================================
interface UseOrdersGroupedReturn {
  storeGroups: StoreOrderGroup[];
  loading: boolean;
  error: string | null;
  totalOrders: number;
  totalStores: number;
  refetch: () => Promise<void>;
  fetchByStatus: (status?: string) => Promise<void>;
}

export function useOrdersGrouped(initialStatus?: string): UseOrdersGroupedReturn {
  const [storeGroups, setStoreGroups] = useState<StoreOrderGroup[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalOrders, setTotalOrders] = useState(0);
  const [totalStores, setTotalStores] = useState(0);

  const fetchOrders = useCallback(async (status?: string) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await orderApi.getGroupedByStore(status);
      
      if (response?.data?.stores) {
        setStoreGroups(response.data.stores);
        setTotalOrders(response.data.totalOrders || 0);
        setTotalStores(response.data.totalStores || response.data.stores.length);
      } else {
        setStoreGroups([]);
        setTotalOrders(0);
        setTotalStores(0);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch orders');
      setStoreGroups([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOrders(initialStatus);
  }, [fetchOrders, initialStatus]);

  const refetch = useCallback(async () => {
    await fetchOrders(initialStatus);
  }, [fetchOrders, initialStatus]);

  const fetchByStatus = useCallback(async (status?: string) => {
    await fetchOrders(status);
  }, [fetchOrders]);

  return {
    storeGroups,
    loading,
    error,
    totalOrders,
    totalStores,
    refetch,
    fetchByStatus,
  };
}

// ============================================
// Hook for managing single order details
// ============================================
interface UseOrderDetailsReturn {
  order: OrderDetails | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useOrderDetails(orderId: string): UseOrderDetailsReturn {
  const [order, setOrder] = useState<OrderDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchOrder = useCallback(async () => {
    if (!orderId) {
      setError('No order ID provided');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Try to get order directly first
      try {
        const data = await orderApi.getById(orderId);
        if (data) {
          setOrder(data);
          setLoading(false);
          return;
        }
      } catch (err) {
        console.log('Direct order fetch failed, trying fallback...', err);
      }

      // Fallback: Get from grouped data
      const fallbackOrder = await orderApi.getByIdFromGrouped(orderId);
      
      if (fallbackOrder) {
        setOrder(fallbackOrder);
      } else {
        setError('Order not found');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch order');
    } finally {
      setLoading(false);
    }
  }, [orderId]);

  useEffect(() => {
    fetchOrder();
  }, [fetchOrder]);

  return {
    order,
    loading,
    error,
    refetch: fetchOrder,
  };
}