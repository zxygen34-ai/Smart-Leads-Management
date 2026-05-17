import type { ReactNode } from 'react';
import { createContext, useContext, useMemo, useState } from 'react';

import type { AuthResponse, User } from '@/types/auth';

const TOKEN_KEY = 'auth_token';
const USER_KEY = 'auth_user';

type AuthContextValue = {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  setAuth: (auth: AuthResponse | null) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

function readStoredAuth() {
  if (typeof window === 'undefined') {
    return { token: null, user: null } as const;
  }

  const token = localStorage.getItem(TOKEN_KEY);
  const rawUser = localStorage.getItem(USER_KEY);

  if (!token || !rawUser) {
    return { token: null, user: null } as const;
  }

  try {
    const user = JSON.parse(rawUser) as User;
    return { token, user } as const;
  } catch (_error) {
    return { token: null, user: null } as const;
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const stored = readStoredAuth();
  const [user, setUser] = useState<User | null>(stored.user);
  const [token, setToken] = useState<string | null>(stored.token);

  const setAuth = (auth: AuthResponse | null) => {
    if (!auth) {
      setUser(null);
      setToken(null);
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(USER_KEY);
      return;
    }

    setUser(auth.user);
    setToken(auth.token);
    localStorage.setItem(TOKEN_KEY, auth.token);
    localStorage.setItem(USER_KEY, JSON.stringify(auth.user));
  };

  const logout = () => setAuth(null);

  const value = useMemo(
    () => ({
      user,
      token,
      isAuthenticated: Boolean(user && token),
      setAuth,
      logout
    }),
    [user, token]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }

  return context;
}
