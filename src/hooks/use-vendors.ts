// src/hooks/use-vendors.ts

import { useState, useEffect, useCallback } from 'react';
import { Vendor } from '@/types';
import { vendorApi } from '@/services/vendorApi';

// ============================================
// Hook for managing multiple vendors (list)
// ============================================
interface UseVendorsReturn {
  vendors: Vendor[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  createVendor: (vendor: Omit<Vendor, 'id'>) => Promise<Vendor>;
  updateVendor: (id: string, vendor: Partial<Vendor>) => Promise<Vendor>;
  deleteVendor: (id: string) => Promise<void>;
}

export function useVendors(): UseVendorsReturn {
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchVendors = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await vendorApi.getAll();
      setVendors(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch vendors');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchVendors();
  }, [fetchVendors]);

  const createVendor = async (vendor: Omit<Vendor, 'id'>) => {
    const newVendor = await vendorApi.create(vendor);
    setVendors((prev) => [...prev, newVendor]);
    return newVendor;
  };

  const updateVendor = async (id: string, vendor: Partial<Vendor>) => {
    const updatedVendor = await vendorApi.update(id, vendor);
    setVendors((prev) =>
      prev.map((v) => (v.id === id ? updatedVendor : v))
    );
    return updatedVendor;
  };

  const deleteVendor = async (id: string) => {
    await vendorApi.delete(id);
    setVendors((prev) => prev.filter((v) => v.id !== id));
  };

  return {
    vendors,
    loading,
    error,
    refetch: fetchVendors,
    createVendor,
    updateVendor,
    deleteVendor,
  };
}

// ============================================
// Hook for managing a single vendor (details)
// ============================================
interface UseVendorReturn {
  vendor: Vendor | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  updateVendor: (updates: Partial<Vendor>) => Promise<Vendor>;
}

export function useVendor(id: string): UseVendorReturn {
  const [vendor, setVendor] = useState<Vendor | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchVendor = useCallback(async () => {
    if (!id) {
      setError('No vendor ID provided');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      console.log('🔍 Fetching vendor with ID:', id);
      
      // Try to get single vendor first
      try {
        const data = await vendorApi.getById(id);
        console.log('✅ Got vendor from getById:', data);
        if (data) {
          setVendor(data);
          setLoading(false);
          return;
        }
      } catch (err) {
        console.log('⚠️ getById failed, trying getAll fallback...', err);
      }
      
      // Fallback: Get all vendors and find the one we need
      console.log('🔄 Using fallback: fetching all vendors...');
      const allVendors = await vendorApi.getAll();
      console.log('📦 All vendors:', allVendors);
      
      const foundVendor = allVendors.find((v) => v.id === id);
      console.log('🔍 Found vendor:', foundVendor);
      
      if (foundVendor) {
        setVendor(foundVendor);
      } else {
        setError('Vendor not found');
      }
    } catch (err) {
      console.error('❌ Error fetching vendor:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch vendor');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchVendor();
  }, [fetchVendor]);

  const updateVendor = async (updates: Partial<Vendor>) => {
    const updatedVendor = await vendorApi.update(id, updates);
    setVendor(updatedVendor);
    return updatedVendor;
  };

  return {
    vendor,
    loading,
    error,
    refetch: fetchVendor,
    updateVendor,
  };
}