'use client';

import { createContext, use, useCallback, useEffect, useMemo, useState } from 'react';
import * as authApi from './api';
import type { LoginInput, RegisterInput, User } from './types';

type SessionValue = {
  user: User | null;
  isLoading: boolean;
  login: (input: LoginInput) => Promise<void>;
  register: (input: RegisterInput) => Promise<void>;
  logout: () => Promise<void>;
};

const SessionContext = createContext<SessionValue | null>(null);

export function SessionProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    authApi.restoreSession().then((session) => {
      setUser(session?.user ?? null);
      setIsLoading(false);
    });
  }, []);

  const login = useCallback(async (input: LoginInput) => {
    setUser((await authApi.login(input)).user);
  }, []);

  const register = useCallback(async (input: RegisterInput) => {
    setUser((await authApi.register(input)).user);
  }, []);

  const logout = useCallback(async () => {
    await authApi.logout();
    setUser(null);
  }, []);

  const value = useMemo(
    () => ({ user, isLoading, login, register, logout }),
    [user, isLoading, login, register, logout],
  );

  return <SessionContext value={value}>{children}</SessionContext>;
}

// The hook is the seam: swapping Context for Zustand later touches this file only.
export function useSession() {
  const context = use(SessionContext);
  if (!context) throw new Error('useSession must be used inside SessionProvider');
  return context;
}
