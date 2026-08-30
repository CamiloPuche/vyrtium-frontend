'use client';

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react';
import { User, LoginDTO, RegisterDTO } from '../types/auth';
import { authService } from '../services/auth.service';
import { tokenStorage } from '../services/api';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginDTO) => Promise<void>;
  register: (data: RegisterDTO) => Promise<User>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    let isMounted = true;

    const verifySession = async () => {
      const storedUser = tokenStorage.getUser();
      const accessToken = tokenStorage.getAccessToken();

      if (storedUser && isMounted) {
        setUser(storedUser);
      }

      if (!accessToken) {
        if (isMounted) {
          setIsLoading(false);
          setUser(null);
        }
        return;
      }

      try {
        const freshUser = await authService.getProfile();
        if (isMounted) {
          setUser(freshUser);
        }
      } catch {
        if (isMounted) {
          tokenStorage.clearSession();
          setUser(null);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    const handleSessionExpired = () => {
      setUser(null);
      setIsLoading(false);
    };

    window.addEventListener('auth:session-expired', handleSessionExpired);
    verifySession();

    return () => {
      isMounted = false;
      window.removeEventListener('auth:session-expired', handleSessionExpired);
    };
  }, []);

  const login = async (credentials: LoginDTO): Promise<void> => {
    setIsLoading(true);
    try {
      const authData = await authService.login(credentials);
      setUser(authData.user);
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (data: RegisterDTO): Promise<User> => {
    return await authService.register(data);
  };

  const logout = async (): Promise<void> => {
    setIsLoading(true);
    try {
      await authService.logout();
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  const refreshUser = async (): Promise<void> => {
    try {
      const freshUser = await authService.getProfile();
      setUser(freshUser);
    } catch {
      // User might be unauthenticated
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
