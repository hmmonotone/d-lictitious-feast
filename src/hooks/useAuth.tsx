import React, { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { apiFetch, clearAuthToken, getAuthToken, setAuthToken } from '@/lib/api';

type AuthUser = {
  id: string;
  email: string;
  role: 'admin' | 'editor';
};

interface AuthContextType {
  user: AuthUser | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<{ error: Error | null }>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = getAuthToken();
    if (!token) {
      setLoading(false);
      return;
    }

    apiFetch('/me')
      .then((data) => {
        const authUser = data.user as AuthUser;
        setUser(authUser);
      })
      .catch(() => {
        clearAuthToken();
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  async function login(email: string, password: string) {
    try {
      const data = await apiFetch('/login', {
        method: 'POST',
        body: JSON.stringify({ email, password })
      });

      setAuthToken(data.token as string);
      const authUser = data.user as AuthUser;
      setUser(authUser);
      return { error: null };
    } catch (error) {
      return { error: error as Error };
    }
  }

  async function logout() {
    clearAuthToken();
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
