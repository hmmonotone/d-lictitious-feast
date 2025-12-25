import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';

type ProtectedRouteProps = {
  children: ReactNode;
  redirectTo: string;
  requiredRole?: 'admin' | 'editor';
};

export function ProtectedRoute({ children, redirectTo, requiredRole }: ProtectedRouteProps) {
  const { user, loading } = useAuth();

  if (loading) {
    return null;
  }

  if (!user) {
    return <Navigate to={redirectTo} replace />;
  }

  if (requiredRole === 'admin' && user.role !== 'admin') {
    return <Navigate to={redirectTo} replace />;
  }

  if (requiredRole === 'editor' && !(user.role === 'admin' || user.role === 'editor')) {
    return <Navigate to={redirectTo} replace />;
  }

  return <>{children}</>;
}
