export interface LoginFormData {
  email: string;
  senha: string;
  manterConectado?: boolean;
}

export interface CadastroFormData {
  nomeCompleto: string;
  email: string;
  senha: string;
  confirmarSenha: string;
  aceitarTermos: boolean;
  codigoPromocional?: string;
}

export interface ValidationError {
  field: string;
  message: string;
}

export interface FormState {
  isSubmitting: boolean;
  errors: Record<string, string>;
  touched: Record<string, boolean>;
}

export type AuthStatus = 'idle' | 'loading' | 'success' | 'error';

export interface AuthResponse {
  success: boolean;
  message: string;
  error?: string;
}
