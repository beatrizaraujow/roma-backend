import React from 'react';
import type { ReactNode } from 'react';
import { useAuth } from '../contexts/AuthContext';

interface PrivateRouteProps {
  children: ReactNode;
}

export const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        fontFamily: 'Montserrat, sans-serif',
        color: '#666',
      }}>
        Carregando...
      </div>
    );
  }

  if (!isAuthenticated) {
    window.location.href = '#login';
    return null;
  }

  return <>{children}</>;
};
