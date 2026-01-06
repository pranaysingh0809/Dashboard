// src/hooks/use-stores.ts

import { useState, useEffect, useCallback } from 'react';
import { Store } from '@/types';
import { storeApi } from '@/services/storeApi';

// ============================================
// Hook for managing multiple stores (list)
// ============================================
interface UseStoresReturn {
  stores: Store[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  createStore: (store: Omit<Store, 'id' | 'createdAt' | 'updatedAt'>) => Promise<Store>;
  updateStore: (id: string, store: Partial<Store>) => Promise<Store>;
  deleteStore: (id: string) => Promise<void>;
}

export function useStores(): UseStoresReturn {
  const [stores, setStores] = useState<Store[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStores = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await storeApi.getAll();
      setStores(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch stores');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStores();
  }, [fetchStores]);

  const createStore = async (store: Omit<Store, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newStore = await storeApi.create(store);
    setStores((prev) => [...prev, newStore]);
    return newStore;
  };

  const updateStore = async (id: string, store: Partial<Store>) => {
    const updatedStore = await storeApi.update(id, store);
    setStores((prev) =>
      prev.map((s) => (s.id === id ? updatedStore : s))
    );
    return updatedStore;
  };

  const deleteStore = async (id: string) => {
    await storeApi.delete(id);
    setStores((prev) => prev.filter((s) => s.id !== id));
  };

  return {
    stores,
    loading,
    error,
    refetch: fetchStores,
    createStore,
    updateStore,
    deleteStore,
  };
}

// ============================================
// Hook for managing a single store (details)
// ============================================
interface UseStoreReturn {
  store: Store | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  updateStore: (updates: Partial<Store>) => Promise<Store>;
}

export function useStore(id: string): UseStoreReturn {
  const [store, setStore] = useState<Store | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStore = useCallback(async () => {
    if (!id) {
      setError('No store ID provided');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Try to get single store first
      try {
        const data = await storeApi.getById(id);
        if (data) {
          setStore(data);
          setLoading(false);
          return;
        }
      } catch (err) {
        console.log('getById failed, trying getAll fallback...', err);
      }

      // Fallback: Get all stores and find the one we need
      const allStores = await storeApi.getAll();
      const foundStore = allStores.find((s) => s.id === id);

      if (foundStore) {
        setStore(foundStore);
      } else {
        setError('Store not found');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch store');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchStore();
  }, [fetchStore]);

  const updateStore = async (updates: Partial<Store>) => {
    const updatedStore = await storeApi.update(id, updates);
    setStore(updatedStore);
    return updatedStore;
  };

  return {
    store,
    loading,
    error,
    refetch: fetchStore,
    updateStore,
  };
}