// src/hooks/use-users.ts

import { useState, useEffect, useCallback } from 'react';
import { User, CreateUserPayload } from '@/types';
import { userApi } from '@/services/userApi';

// ============================================
// Hook for managing multiple users (list)
// ============================================
interface UseUsersReturn {
  users: User[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  createUser: (user: CreateUserPayload) => Promise<User>;
  updateUser: (id: string, user: Partial<User>) => Promise<User>;
  deleteUser: (id: string) => Promise<void>;
}

export function useUsers(): UseUsersReturn {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await userApi.getAll();
      setUsers(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch users');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const createUser = async (user: CreateUserPayload) => {
    const newUser = await userApi.create(user);
    setUsers((prev) => [...prev, newUser]);
    return newUser;
  };

  const updateUser = async (id: string, user: Partial<User>) => {
    const updatedUser = await userApi.update(id, user);
    setUsers((prev) =>
      prev.map((u) => (u.id === id ? updatedUser : u))
    );
    return updatedUser;
  };

  const deleteUser = async (id: string) => {
    await userApi.delete(id);
    setUsers((prev) => prev.filter((u) => u.id !== id));
  };

  return {
    users,
    loading,
    error,
    refetch: fetchUsers,
    createUser,
    updateUser,
    deleteUser,
  };
}

// ============================================
// Hook for managing a single user (details)
// ============================================
interface UseUserReturn {
  user: User | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  updateUser: (updates: Partial<User>) => Promise<User>;
}

export function useUser(id: string): UseUserReturn {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUser = useCallback(async () => {
    if (!id) {
      setError('No user ID provided');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      console.log('🔍 Fetching user with ID:', id);
      
      // Try to get single user first
      try {
        const data = await userApi.getById(id);
        console.log('✅ Got user from getById:', data);
        if (data) {
          setUser(data);
          setLoading(false);
          return;
        }
      } catch (err) {
        console.log('⚠️ getById failed, trying getAll fallback...', err);
      }
      
      // Fallback: Get all users and find the one we need
      console.log('🔄 Using fallback: fetching all users...');
      const allUsers = await userApi.getAll();
      console.log('📦 All users:', allUsers);
      
      const foundUser = allUsers.find((u) => u.id === id);
      console.log('🔍 Found user:', foundUser);
      
      if (foundUser) {
        setUser(foundUser);
      } else {
        setError('User not found');
      }
    } catch (err) {
      console.error('❌ Error fetching user:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch user');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  const updateUser = async (updates: Partial<User>) => {
    const updatedUser = await userApi.update(id, updates);
    setUser(updatedUser);
    return updatedUser;
  };

  return {
    user,
    loading,
    error,
    refetch: fetchUser,
    updateUser,
  };
}

// ============================================
// Hook for getting pickup users
// ============================================
interface UsePickupUsersReturn {
  pickupUsers: User[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function usePickupUsers(): UsePickupUsersReturn {
  const [pickupUsers, setPickupUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPickupUsers = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await userApi.getPickupUsers();
      setPickupUsers(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch pickup users');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPickupUsers();
  }, [fetchPickupUsers]);

  return {
    pickupUsers,
    loading,
    error,
    refetch: fetchPickupUsers,
  };
}