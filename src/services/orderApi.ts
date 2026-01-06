// src/services/orderApi.ts

import { OrdersGroupedByStoreResponse, FlattenedOrder, StoreOrderGroup, OrderDetails } from '@/types';

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

  return response.json();
}

// Helper function to flatten orders from grouped data
export function flattenOrdersFromGroups(storeGroups: StoreOrderGroup[]): FlattenedOrder[] {
  const flattenedOrders: FlattenedOrder[] = [];

  for (const group of storeGroups) {
    const { store, orders } = group;
    
    for (const order of orders) {
      flattenedOrders.push({
        id: order.id,
        oId: order.oId,
        status: order.status,
        deviceBrand: order.deviceBrand,
        deviceModel: order.deviceModel,
        devicePrice: order.devicePrice,
        createdAt: order.createdAt,
        storeName: store?.name || 'Unknown Store',
        storeCity: store?.city || '',
        storeAddress: store?.address || '',
        vendorName: store?.vendor?.name || 'Unknown Vendor',
        vendorId: store?.vendor?.id || '',
        storeId: store?.id || group.storeId,
      });
    }
  }

  return flattenedOrders;
}

// Order API functions
export const orderApi = {
  // Get all orders grouped by store
  getGroupedByStore: async (status?: string): Promise<OrdersGroupedByStoreResponse> => {
    const endpoint = status 
      ? `/orders/grouped-by-store?status=${encodeURIComponent(status)}`
      : '/orders/grouped-by-store';
    
    const response = await fetchApi<OrdersGroupedByStoreResponse>(endpoint);
    return response;
  },

  // Get flattened orders for table display
  getAllFlattened: async (status?: string): Promise<FlattenedOrder[]> => {
    const response = await orderApi.getGroupedByStore(status);
    
    if (!response?.data?.stores) {
      return [];
    }
    
    return flattenOrdersFromGroups(response.data.stores);
  },

  // Get single order by ID
  getById: async (orderId: string): Promise<OrderDetails> => {
    const response = await fetchApi<{ success: boolean; data: OrderDetails }>(`/orders/${orderId}`);
    
    if (!response?.data) {
      throw new Error('Order not found');
    }
    
    return response.data;
  },

  // Get order details from grouped data (fallback method)
  getByIdFromGrouped: async (orderId: string): Promise<OrderDetails | null> => {
    const response = await orderApi.getGroupedByStore();
    
    if (!response?.data?.stores) {
      return null;
    }

    for (const group of response.data.stores) {
      const order = group.orders.find(o => o.id === orderId);
      if (order) {
        return {
          ...order,
          store: {
            id: group.store?.id || group.storeId,
            name: group.store?.name || 'Unknown Store',
            address: group.store?.address || '',
            city: group.store?.city || '',
            state: group.store?.state || '',
            pincode: group.store?.pincode || '',
            phone: group.store?.phone || '',
          },
          vendor: {
            id: group.store?.vendor?.id || '',
            name: group.store?.vendor?.name || 'Unknown Vendor',
            contactEmail: group.store?.vendor?.contactEmail || '',
            contactPhone: group.store?.vendor?.contactPhone || '',
            paymentType: group.store?.vendor?.paymentType || '',
          },
        };
      }
    }
    
    return null;
  },

  // Get summary statistics
  getSummary: async (): Promise<{ totalStores: number; totalOrders: number }> => {
    const response = await orderApi.getGroupedByStore();
    
    return {
      totalStores: response?.data?.totalStores || 0,
      totalOrders: response?.data?.totalOrders || 0,
    };
  },
};