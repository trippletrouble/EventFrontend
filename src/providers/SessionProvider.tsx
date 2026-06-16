'use client';

import { createContext, useContext, useEffect, useState, useCallback, type ReactNode } from 'react';
import type { UserDto } from '@/types/api.types';
import { getSession, logout as logoutApi } from '@/services/auth.service';

interface SessionContextType {
  user: UserDto | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  logout: () => Promise<void>;
  refreshSession: () => Promise<void>;
}

const SessionContext = createContext<SessionContextType>({
  user: null,
  isLoading: true,
  isAuthenticated: false,
  logout: async () => {},
  refreshSession: async () => {},
});

export const useSessionContext = () => useContext(SessionContext);

export function SessionProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserDto | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const refreshSession = useCallback(async () => {
    try {
      const userData = await getSession();
      setUser(userData);
    } catch {
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await logoutApi();
    } finally {
      setUser(null);
      window.location.href = '/';
    }
  }, []);

  useEffect(() => {
    let isMounted = true;
    
    async function initSession() {
      try {
        const userData = await getSession();
        if (isMounted) {
          setUser(userData);
        }
      } catch {
        if (isMounted) {
          setUser(null);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    initSession();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <SessionContext.Provider value={{
      user,
      isLoading,
      isAuthenticated: !!user,
      logout,
      refreshSession,
    }}>
      {children}
    </SessionContext.Provider>
  );
}
