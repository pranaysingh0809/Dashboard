// src/services/userApi.ts

import { User, CreateUserPayload } from '@/types';

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

// Helper: Extract a single user from any response format
const extractUser = (response: any): User | null => {
  if (!response) return null;
  
  // Format: { data: { user: {...} } }
  if (response?.data?.user?.id) {
    return response.data.user;
  }
  
  // Format: { data: { users: [{...}] } }
  if (response?.data?.users?.[0]?.id) {
    return response.data.users[0];
  }
  
  // Format: { data: { id: ... } } (user directly in data)
  if (response?.data?.id) {
    return response.data;
  }
  
  // Format: { user: {...} }
  if (response?.user?.id) {
    return response.user;
  }
  
  // Format: { id: ... } (user is the response itself)
  if (response?.id) {
    return response;
  }
  
  return null;
};

// User API functions
export const userApi = {
  // Get all users - GET /api/auth/users
  getAll: async (): Promise<User[]> => {
    const response = await fetchApi<any>('/auth/users');
    
    // Try different response formats
    if (response?.data?.users) {
      return response.data.users;
    }
    if (response?.users) {
      return response.users;
    }
    if (Array.isArray(response?.data)) {
      return response.data;
    }
    if (Array.isArray(response)) {
      return response;
    }
    
    return [];
  },

  // Get single user by ID - GET /api/auth/users/{userId}
  getById: async (id: string): Promise<User> => {
    const response = await fetchApi<any>(`/auth/users/${id}`);
    
    const user = extractUser(response);
    
    if (!user) {
      throw new Error('User not found');
    }
    
    return user;
  },

  // Create new user - POST /api/auth/create-user
  create: async (userData: CreateUserPayload): Promise<User> => {
    const response = await fetchApi<any>('/auth/create-user', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
    
    console.log('Create User API Response:', response);
    
    const createdUser = extractUser(response);
    
    if (createdUser) {
      return createdUser;
    }
    
    // If response indicates success but we can't extract user,
    // return input data with a generated ID (will be refreshed on next fetch)
    if (response?.success === true) {
      return {
        ...userData,
        id: response?.data?.id || response?.data?.user?.id || `temp-${Date.now()}`,
        createdAt: new Date().toISOString(),
      } as User;
    }
    
    throw new Error('Failed to create user');
  },

  // Update existing user - PUT /api/auth/update
  update: async (id: string, userData: Partial<User>): Promise<User> => {
    // The update endpoint uses /api/auth/update
    // We need to include the user ID in the body
    const response = await fetchApi<any>('/auth/update', {
      method: 'PUT',
      body: JSON.stringify({ id, ...userData }),
    });
    
    const updatedUser = extractUser(response);
    
    if (updatedUser) {
      return updatedUser;
    }
    
    // If response indicates success, return merged data
    if (response?.success === true) {
      return { id, ...userData } as User;
    }
    
    throw new Error('Failed to update user');
  },

  // Delete user - using update to deactivate (or implement actual delete if available)
  delete: async (id: string): Promise<void> => {
    // If there's no delete endpoint, we can deactivate the user instead
    // Or implement the actual delete endpoint if available
    await fetchApi<void>(`/auth/users/${id}`, {
      method: 'DELETE',
    });
  },

  // Get all pickup users with no subrole - GET /api/orders/pickup-users
  getPickupUsers: async (): Promise<User[]> => {
    const response = await fetchApi<any>('/orders/pickup-users');
    
    if (response?.data?.users) {
      return response.data.users;
    }
    if (response?.users) {
      return response.users;
    }
    if (Array.isArray(response?.data)) {
      return response.data;
    }
    if (Array.isArray(response)) {
      return response;
    }
    
    return [];
  },
};