// Mensagens de erro personalizadas por código
export const errorMessages: Record<string, string> = {
  // Erros de autenticação
  INVALID_CREDENTIALS: 'Email ou senha incorretos. Verifique e tente novamente.',
  USER_NOT_FOUND: 'Não encontramos uma conta com esse email.',
  WRONG_PASSWORD: 'Email ou senha incorretos. Verifique e tente novamente.',
  ACCOUNT_LOCKED: 'Conta temporariamente bloqueada por segurança. Tente novamente em alguns minutos ou redefina sua senha.',
  ACCOUNT_DISABLED: 'Sua conta foi desativada. Entre em contato com o suporte.',
  EMAIL_NOT_VERIFIED: 'Sua conta ainda não foi verificada. Verifique o email ou solicite um novo código.',
  
  // Erros de rede
  NETWORK_ERROR: 'Erro de conexão. Verifique sua internet e tente novamente.',
  TIMEOUT_ERROR: 'A requisição demorou muito. Tente novamente.',
  SERVER_ERROR: 'Ocorreu um erro. Tente novamente mais tarde.',
  
  // Erros de validação
  INVALID_EMAIL: 'Digite um email válido (ex.: voce@exemplo.com).',
  WEAK_PASSWORD: 'Sua senha é fraca — adicione números e letras maiúsculas para torná-la mais segura.',
  
  // Erro genérico
  UNKNOWN_ERROR: 'Não foi possível entrar. Verifique seu email e senha e tente novamente.',
};

export const getErrorMessage = (errorCode: string): string => {
  return errorMessages[errorCode] || errorMessages.UNKNOWN_ERROR;
};
