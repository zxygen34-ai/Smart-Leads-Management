import type { ReactElement } from 'react';
import { Navigate } from 'react-router-dom';

import { useAuth } from '@/context/AuthContext';

type GuardProps = {
  children: ReactElement;
};

export function ProtectedRoute({ children }: GuardProps) {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

export function GuestRoute({ children }: GuardProps) {
  const { isAuthenticated } = useAuth();

  if (isAuthenticated) {
    return <Navigate to="/leads" replace />;
  }

  return children;
}
