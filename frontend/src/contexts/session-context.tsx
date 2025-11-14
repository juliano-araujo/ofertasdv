'use client';

import { $fetch } from '@/lib/fetch';
import { clearTokens, getToken, hasToken, saveToken } from '@/lib/jwt-storage';
import {
  PapelType,
  type AuthResponse,
  type UsuarioDto,
} from '@/schemas/usuario.schema';
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';

export interface SessionContextType {
  user: UsuarioDto | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (data: AuthResponse) => Promise<void>;
  logout: () => void;
  updateUser: (user: UsuarioDto) => void;
  getUserPapel: () => string | null;
  hasRole: (role: PapelType) => boolean;
}

const SessionContext = createContext<SessionContextType | undefined>(undefined);

interface SessionProviderProps {
  children: React.ReactNode;
}

export function SessionProvider({ children }: SessionProviderProps) {
  const [user, setUser] = useState<UsuarioDto | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check for existing session on mount
  useEffect(() => {
    const initializeSession = async () => {
      try {
        const token = getToken();
        if (token) {
          // Validate token and fetch user data
          const userData = await $fetch('/usuarios/me');
          setUser(userData);
        }
      } catch (error) {
        console.error('Failed to initialize session:', error);
        clearTokens();
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    initializeSession();
  }, []);

  const login = useCallback(async (data: AuthResponse) => {
    // Save token to storage
    saveToken(data.token);

    // Update user state
    setUser(data.user);
  }, []);

  const logout = useCallback(() => {
    clearTokens();
    setUser(null);
  }, []);

  const updateUser = useCallback((updatedUser: UsuarioDto) => {
    setUser(updatedUser);
  }, []);

  const getUserPapel = useCallback(() => {
    return user?.papel || null;
  }, [user]);

  const hasRole = useCallback(
    (role: PapelType) => {
      return user?.papel === role;
    },
    [user],
  );

  const value: SessionContextType = {
    user,
    isAuthenticated: !!user || hasToken(),
    isLoading,
    login,
    logout,
    updateUser,
    getUserPapel,
    hasRole,
  };

  return <SessionContext value={value}>{children}</SessionContext>;
}

export function useSession(): SessionContextType {
  const context = useContext(SessionContext);
  if (context === undefined) {
    throw new Error('useSession must be used within a SessionProvider');
  }
  return context;
}
