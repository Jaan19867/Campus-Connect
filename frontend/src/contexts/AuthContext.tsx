'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { AuthUser, LoginRequest, SignupRequest } from '@/types';
import { apiClient } from '@/lib/api';

interface AuthContextType {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginRequest) => Promise<void>;
  signup: (credentials: SignupRequest) => Promise<void>;
  logout: () => void;
  updateUser: (userData: Partial<AuthUser>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        if (apiClient.isAuthenticated()) {
          const userInfo = apiClient.getUserInfo();
          if (userInfo) {
            setUser({
              id: userInfo.sub,
              rollNumber: userInfo.rollNumber,
              name: undefined,
              email: undefined,
            });
          }
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
        apiClient.clearToken();
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const login = async (credentials: LoginRequest) => {
    try {
      setIsLoading(true);
      const response = await apiClient.login(credentials.rollNumber, credentials.password);
      
      const userInfo = apiClient.getUserInfo();
      if (userInfo) {
        setUser({
          id: userInfo.sub,
          rollNumber: userInfo.rollNumber,
          name: undefined,
          email: undefined,
        });
      }
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (credentials: SignupRequest) => {
    try {
      setIsLoading(true);
      const response = await apiClient.signup(credentials.rollNumber, credentials.password);
      
      const userInfo = apiClient.getUserInfo();
      if (userInfo) {
        setUser({
          id: userInfo.sub,
          rollNumber: userInfo.rollNumber,
          name: undefined,
          email: undefined,
        });
      }
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    apiClient.logout();
    setUser(null);
  };

  const updateUser = (userData: Partial<AuthUser>) => {
    setUser(prev => prev ? { ...prev, ...userData } : null);
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    signup,
    logout,
    updateUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}; 