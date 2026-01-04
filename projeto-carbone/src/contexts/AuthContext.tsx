import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { authService } from '../utils/authService';

interface User {
  id: string;
  nome: string;
  email: string;
  telefone?: string;
  empresa?: string;
  cargo?: string;
  fotoPerfil?: string;
  autenticacao2FA?: boolean;
  modoEscuro?: boolean;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, senha: string) => Promise<{ success: boolean; message?: string; errorCode?: string }>;
  cadastrar: (nomeCompleto: string, email: string, senha: string, codigoPromocional?: string) => Promise<{ success: boolean; message?: string; errorCode?: string }>;
  logout: () => void;
  updateUser: (user: User) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Verificar se há um usuário logado ao carregar a aplicação
    const loadUser = () => {
      const storedUser = localStorage.getItem('user');
      const token = authService.getToken();

      if (storedUser && token) {
        try {
          setUser(JSON.parse(storedUser));
        } catch (error) {
          console.error('Erro ao carregar usuário:', error);
          localStorage.removeItem('user');
          localStorage.removeItem('auth_token');
        }
      }
      setIsLoading(false);
    };

    loadUser();

    // Configurar refresh token automático
    const refreshInterval = parseInt(import.meta.env.VITE_TOKEN_REFRESH_INTERVAL || '840000'); // 14 minutos
    
    const intervalId = setInterval(async () => {
      if (authService.isAuthenticated()) {
        const response = await authService.refreshToken();
        if (!response.success) {
          console.warn('Falha ao renovar token automaticamente');
        }
      }
    }, refreshInterval);

    return () => clearInterval(intervalId);
  }, []);

  const login = async (email: string, senha: string) => {
    try {
      const response = await authService.login(email, senha);

      if (response.success && response.user) {
        setUser(response.user);
        return { success: true };
      }

      return {
        success: false,
        message: response.message,
        errorCode: response.errorCode,
      };
    } catch (error) {
      console.error('Erro no login:', error);
      return {
        success: false,
        message: 'Erro ao fazer login',
        errorCode: 'NETWORK_ERROR',
      };
    }
  };

  const cadastrar = async (
    nomeCompleto: string,
    email: string,
    senha: string,
    codigoPromocional?: string
  ) => {
    try {
      const response = await authService.cadastrar(nomeCompleto, email, senha, codigoPromocional);

      if (response.success && response.user) {
        setUser(response.user);
        return { success: true, message: response.message };
      }

      return {
        success: false,
        message: response.message,
        errorCode: response.errorCode,
      };
    } catch (error) {
      console.error('Erro no cadastro:', error);
      return {
        success: false,
        message: 'Erro ao criar conta',
        errorCode: 'NETWORK_ERROR',
      };
    }
  };

  const logout = () => {
    authService.logout();
    setUser(null);
  };

  const updateUser = (updatedUser: User) => {
    setUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    cadastrar,
    logout,
    updateUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
};
