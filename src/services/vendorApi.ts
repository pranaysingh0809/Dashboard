// src/services/vendorApi.ts

import { Vendor } from '@/types';

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

// Helper: Extract a single vendor from any response format
const extractVendor = (response: any): Vendor | null => {
  if (!response) return null;
  
  // Format: { data: { vendor: {...} } }
  if (response?.data?.vendor?.id) {
    return response.data.vendor;
  }
  
  // Format: { data: { vendors: [{...}] } }
  if (response?.data?.vendors?.[0]?.id) {
    return response.data.vendors[0];
  }
  
  // Format: { data: { id: ... } } (vendor directly in data)
  if (response?.data?.id) {
    return response.data;
  }
  
  // Format: { vendor: {...} }
  if (response?.vendor?.id) {
    return response.vendor;
  }
  
  // Format: { id: ... } (vendor is the response itself)
  if (response?.id) {
    return response;
  }
  
  return null;
};

// Vendor API functions
export const vendorApi = {
  // Get all vendors
  getAll: async (): Promise<Vendor[]> => {
    const response = await fetchApi<any>('/vendors');
    
    // Try different response formats
    if (response?.data?.vendors) {
      return response.data.vendors;
    }
    if (response?.vendors) {
      return response.vendors;
    }
    if (Array.isArray(response?.data)) {
      return response.data;
    }
    if (Array.isArray(response)) {
      return response;
    }
    
    return [];
  },

  // Get single vendor by ID
  getById: async (id: string): Promise<Vendor> => {
    const response = await fetchApi<any>(`/vendors/${id}`);
    
    const vendor = extractVendor(response);
    
    if (!vendor) {
      throw new Error('Vendor not found');
    }
    
    return vendor;
  },

  // Create new vendor
  create: async (vendor: Omit<Vendor, 'id'>): Promise<Vendor> => {
    const response = await fetchApi<any>('/vendors', {
      method: 'POST',
      body: JSON.stringify(vendor),
    });
    
    console.log('Create API Response:', response);
    
    const createdVendor = extractVendor(response);
    
    if (createdVendor) {
      return createdVendor;
    }
    
    // If response indicates success but we can't extract vendor,
    // return input data with a generated ID (will be refreshed on next fetch)
    if (response?.success === true) {
      return {
        ...vendor,
        id: response?.data?.id || `temp-${Date.now()}`,
      } as Vendor;
    }
    
    throw new Error('Failed to create vendor');
  },

  // Update existing vendor
  update: async (id: string, vendor: Partial<Vendor>): Promise<Vendor> => {
    const response = await fetchApi<any>(`/vendors/${id}`, {
      method: 'PUT',
      body: JSON.stringify(vendor),
    });
    
    const updatedVendor = extractVendor(response);
    
    if (updatedVendor) {
      return updatedVendor;
    }
    
    // If response indicates success, return merged data
    if (response?.success === true) {
      return { id, ...vendor } as Vendor;
    }
    
    throw new Error('Failed to update vendor');
  },

  // Delete vendor
  delete: async (id: string): Promise<void> => {
    await fetchApi<void>(`/vendors/${id}`, {
      method: 'DELETE',
    });
  },
};