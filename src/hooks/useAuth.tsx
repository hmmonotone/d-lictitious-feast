import React, { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { apiFetch, clearAuthToken, getAuthToken, setAuthToken } from '@/lib/api';

type AuthUser = {
  id: string;
  email: string;
  role: 'admin' | 'editor';
};

interface AuthContextType {
  user: AuthUser | null;
  isEditor: boolean;
  isAdmin: boolean;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isEditor, setIsEditor] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = getAuthToken();
    if (!token) {
      setIsLoading(false);
      return;
    }

    apiFetch('/me')
      .then((data) => {
        const authUser = data.user as AuthUser;
        setUser(authUser);
        setIsAdmin(authUser.role === 'admin');
        setIsEditor(authUser.role === 'admin' || authUser.role === 'editor');
      })
      .catch(() => {
        clearAuthToken();
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  async function signIn(email: string, password: string) {
    try {
      const data = await apiFetch('/login', {
        method: 'POST',
        body: JSON.stringify({ email, password })
      });

      setAuthToken(data.token as string);
      const authUser = data.user as AuthUser;
      setUser(authUser);
      setIsAdmin(authUser.role === 'admin');
      setIsEditor(authUser.role === 'admin' || authUser.role === 'editor');
      return { error: null };
    } catch (error) {
      return { error: error as Error };
    }
  }

  async function signOut() {
    clearAuthToken();
    setUser(null);
    setIsEditor(false);
    setIsAdmin(false);
  }

  return (
    <AuthContext.Provider value={{ user, isEditor, isAdmin, isLoading, signIn, signOut }}>
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
