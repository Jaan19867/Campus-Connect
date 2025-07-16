'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { adminApi } from '@/lib/adminApi';

interface AdminUser {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  lastLogin?: string;
}

interface AdminLoginRequest {
  email: string;
  password: string;
}

interface AdminAuthContextType {
  admin: AdminUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: AdminLoginRequest) => Promise<void>;
  logout: () => void;
  updateAdmin: (adminData: Partial<AdminUser>) => void;
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

export const useAdminAuth = () => {
  const context = useContext(AdminAuthContext);
  if (context === undefined) {
    throw new Error('useAdminAuth must be used within an AdminAuthProvider');
  }
  return context;
};

interface AdminAuthProviderProps {
  children: ReactNode;
}

export const AdminAuthProvider: React.FC<AdminAuthProviderProps> = ({ children }) => {
  const [admin, setAdmin] = useState<AdminUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        if (adminApi.isAuthenticated()) {
          const adminInfo = adminApi.getAdminInfo();
          if (adminInfo) {
            // Get full admin profile
            const profile = await adminApi.getProfile();
            setAdmin(profile);
          }
        }
      } catch (error) {
        console.error('Error initializing admin auth:', error);
        adminApi.clearToken();
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const login = async (credentials: AdminLoginRequest) => {
    try {
      setIsLoading(true);
      
      const response = await adminApi.login(credentials.email, credentials.password);
      setAdmin(response.admin);
      
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    adminApi.logout();
    setAdmin(null);
  };

  const updateAdmin = (adminData: Partial<AdminUser>) => {
    setAdmin(prev => prev ? { ...prev, ...adminData } : null);
  };

  const value: AdminAuthContextType = {
    admin,
    isAuthenticated: !!admin,
    isLoading,
    login,
    logout,
    updateAdmin,
  };

  return <AdminAuthContext.Provider value={value}>{children}</AdminAuthContext.Provider>;
}; 