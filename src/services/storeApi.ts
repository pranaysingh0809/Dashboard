// src/services/storeApi.ts

import { Store } from '@/types';

const API_BASE_URL = 'https://api.sk.andaihub.ai/api';

// Function to get the auth token from localStorage
const getAuthToken = (): string | null => {
  return localStorage.getItem('accessToken');
};

// Generic fetch wrapper with error handling and authentication
async function fetchApi<T>(
  endpoint: string,
  options?: RequestInit
): Promise<T> {
  const token = getAuthToken();

  // Build headers with authentication
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    'accept': 'application/json',
    ...options?.headers,
  };

  // Add Authorization header if token exists
  if (token) {
    (headers as Record<string, string>)['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  // Handle 401 Unauthorized - token expired or invalid
  if (response.status === 401) {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('user');
    window.location.href = '/';
    throw new Error('Session expired. Please log in again.');
  }

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || `HTTP error! status: ${response.status}`);
  }

  // Handle DELETE responses that might not return JSON
  if (response.status === 204) {
    return {} as T;
  }

  return response.json();
}

// Store API functions
export const storeApi = {
  // Get all stores
  getAll: async (): Promise<Store[]> => {
    const response = await fetchApi<{ data: { stores: Store[] } }>('/stores');
    return response?.data?.stores || [];
  },

  // Get single store by ID
  getById: async (id: string): Promise<Store> => {
    const response = await fetchApi<{ data: { stores: Store[] } }>(`/stores/${id}`);
    
    // API returns stores array even for single store, so get first item
    const stores = response?.data?.stores || [];
    
    if (stores.length === 0) {
      throw new Error('Store not found');
    }
    
    return stores[0];
  },

  // Create new store
  create: async (store: Omit<Store, 'id' | 'createdAt' | 'updatedAt'>): Promise<Store> => {
    const response = await fetchApi<{ data: { stores: Store[] } }>('/stores', {
      method: 'POST',
      body: JSON.stringify(store),
    });
    
    const stores = response?.data?.stores || [];
    if (stores.length === 0) {
      throw new Error('Failed to create store');
    }
    
    return stores[0];
  },

  // Update existing store
  update: async (id: string, store: Partial<Store>): Promise<Store> => {
    const response = await fetchApi<{ data: { stores: Store[] } }>(`/stores/${id}`, {
      method: 'PUT',
      body: JSON.stringify(store),
    });
    
    const stores = response?.data?.stores || [];
    if (stores.length === 0) {
      throw new Error('Failed to update store');
    }
    
    return stores[0];
  },

  // Delete store
  delete: async (id: string): Promise<void> => {
    await fetchApi<void>(`/stores/${id}`, {
      method: 'DELETE',
    });
  },
};