// Configuração da API
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

// Tipos de resposta da API
export interface LoginResponse {
  success: boolean;
  token?: string;
  user?: {
    id: string;
    nome: string;
    email: string;
  };
  message?: string;
  errorCode?: string;
}

export interface RecuperarSenhaResponse {
  success: boolean;
  message: string;
}

export interface CadastroResponse {
  success: boolean;
  token?: string;
  user?: {
    id: string;
    nome: string;
    email: string;
  };
  message?: string;
  errorCode?: string;
}

export interface RefreshTokenResponse {
  success: boolean;
  token?: string;
  message?: string;
}

// Serviço de autenticação
export const authService = {
  // Login
  async login(email: string, senha: string): Promise<LoginResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, senha }),
      });

      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          message: data.message || 'Erro ao fazer login',
          errorCode: data.errorCode || 'UNKNOWN_ERROR',
        };
      }

      // Salvar token no localStorage
      if (data.token) {
        localStorage.setItem('auth_token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
      }

      return {
        success: true,
        token: data.token,
        user: data.user,
      };
    } catch (error) {
      return {
        success: false,
        message: 'Erro de conexão com o servidor',
        errorCode: 'NETWORK_ERROR',
      };
    }
  },

  // Cadastro
  async cadastrar(
    nomeCompleto: string,
    email: string,
    senha: string,
    codigoPromocional?: string
  ): Promise<CadastroResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/cadastro`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ nomeCompleto, email, senha, codigoPromocional }),
      });

      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          message: data.message || 'Erro ao criar conta',
          errorCode: data.errorCode || 'UNKNOWN_ERROR',
        };
      }

      // Salvar token no localStorage se cadastro for bem-sucedido
      if (data.token) {
        localStorage.setItem('auth_token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
      }

      return {
        success: true,
        token: data.token,
        user: data.user,
        message: data.message || 'Conta criada com sucesso',
      };
    } catch (error) {
      return {
        success: false,
        message: 'Erro de conexão com o servidor',
        errorCode: 'NETWORK_ERROR',
      };
    }
  },

  // Recuperar senha
  async recuperarSenha(email: string): Promise<RecuperarSenhaResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/recuperar-senha`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      return {
        success: response.ok,
        message: data.message || 'Link de recuperação enviado para seu email',
      };
    } catch (error) {
      return {
        success: false,
        message: 'Erro ao enviar email de recuperação',
      };
    }
  },

  // Refresh Token
  async refreshToken(): Promise<RefreshTokenResponse> {
    try {
      const token = this.getToken();
      if (!token) {
        return { success: false, message: 'Token não encontrado' };
      }

      const response = await fetch(`${API_BASE_URL}/auth/refresh-token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          message: data.message || 'Erro ao renovar sessão',
        };
      }

      // Atualizar token
      if (data.token) {
        localStorage.setItem('auth_token', data.token);
      }

      return {
        success: true,
        token: data.token,
      };
    } catch (error) {
      return {
        success: false,
        message: 'Erro ao renovar sessão',
      };
    }
  },

  // Logout
  logout() {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user');
    window.location.href = '/';
  },

  // Verificar se está autenticado
  isAuthenticated(): boolean {
    return !!localStorage.getItem('auth_token');
  },

  // Obter token
  getToken(): string | null {
    return localStorage.getItem('auth_token');
  },

  // Upload de avatar
  async uploadAvatar(file: File): Promise<{ success: boolean; url?: string; message?: string }> {
    try {
      const token = this.getToken();
      if (!token) {
        throw new Error('Não autenticado');
      }

      const formData = new FormData();
      formData.append('avatar', file);

      const response = await fetch(`${API_BASE_URL}/auth/upload-avatar`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Erro no upload');
      }

      return {
        success: true,
        url: data.fotoPerfil,
      };
    } catch (error) {
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Erro ao fazer upload',
      };
    }
  },
};
