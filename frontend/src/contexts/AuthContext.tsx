'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { AuthUser, LoginRequest, SignupRequest, Student } from '@/types';
import { apiClient } from '@/lib/api';

interface AuthContextType {
  user: AuthUser | null;
  student: Student | null;
  profilePictureUrl: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginRequest) => Promise<void>;
  signup: (credentials: SignupRequest) => Promise<void>;
  logout: () => void;
  updateUser: (userData: Partial<AuthUser>) => void;
  refreshProfilePicture: () => Promise<void>;
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
  const [student, setStudent] = useState<Student | null>(null);
  const [profilePictureUrl, setProfilePictureUrl] = useState<string | null>(null);
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
            
            // Fetch full student profile
            await fetchStudentProfile(userInfo.sub);
            await fetchProfilePicture();
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

  const fetchStudentProfile = async (studentId: string) => {
    try {
      const studentData = await apiClient.get<Student>('/student/my-information/profile');
      setStudent(studentData);
      
      // Update user with student name
      setUser(prev => prev ? {
        ...prev,
        name: `${studentData.firstName || ''} ${studentData.lastName || ''}`.trim() || undefined,
        email: studentData.email
      } : null);
    } catch (error) {
      console.error('Error fetching student profile:', error);
    }
  };

  const fetchProfilePicture = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3009'}/student/auth/profile-picture`, {
        headers: {
          Authorization: `Bearer ${apiClient.getToken()}`,
        },
      });
      
      if (response.ok) {
        const blob = await response.blob();
        const imageUrl = URL.createObjectURL(blob);
        setProfilePictureUrl(imageUrl);
      }
    } catch (error) {
      // Profile picture doesn't exist, which is fine
      console.log('No profile picture found');
    }
  };

  const refreshProfilePicture = async () => {
    await fetchProfilePicture();
  };

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
        
        // Fetch full student profile
        await fetchStudentProfile(userInfo.sub);
        await fetchProfilePicture();
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
        
        // Fetch full student profile
        await fetchStudentProfile(userInfo.sub);
        await fetchProfilePicture();
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
    setStudent(null);
    setProfilePictureUrl(null);
  };

  const updateUser = (userData: Partial<AuthUser>) => {
    setUser(prev => prev ? { ...prev, ...userData } : null);
  };

  const value: AuthContextType = {
    user,
    student,
    profilePictureUrl,
    isAuthenticated: !!user,
    isLoading,
    login,
    signup,
    logout,
    updateUser,
    refreshProfilePicture,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}; 