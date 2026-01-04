import type { ValidationError } from '../types/auth.types';

// Validação de email
export const validarEmail = (email: string): string => {
  if (!email.trim()) {
    return 'Digite seu email.';
  }
  
  const emailRegex = /.+@.+\..+/;
  if (!emailRegex.test(email)) {
    return 'Digite um email válido (ex.: voce@exemplo.com).';
  }
  
  return '';
};

// Validação de senha (para cadastro)
export const validarSenha = (senha: string): string => {
  if (!senha) {
    return 'Crie uma senha.';
  }
  
  if (senha.length < 8) {
    return 'A senha precisa ter pelo menos 8 caracteres.';
  }
  
  const temMaiuscula = /[A-Z]/.test(senha);
  const temMinuscula = /[a-z]/.test(senha);
  const temNumero = /[0-9]/.test(senha);
  
  if (!temMaiuscula || !temMinuscula || !temNumero) {
    return 'A senha deve conter letras maiúsculas, minúsculas e números.';
  }
  
  // Senhas comuns (lista básica)
  const senhasComuns = ['12345678', 'password', 'senha123', 'admin123'];
  if (senhasComuns.includes(senha.toLowerCase())) {
    return 'Essa senha é muito comum. Escolha outra.';
  }
  
  return '';
};

// Validação de senha (para login)
export const validarSenhaLogin = (senha: string): string => {
  if (!senha) {
    return 'Digite sua senha.';
  }
  return '';
};

// Validação de confirmação de senha
export const validarConfirmarSenha = (senha: string, confirmarSenha: string): string => {
  if (!confirmarSenha) {
    return 'Confirme sua senha.';
  }
  
  if (senha !== confirmarSenha) {
    return 'As senhas não coincidem.';
  }
  
  return '';
};

// Validação de nome completo
export const validarNomeCompleto = (nome: string): string => {
  if (!nome.trim()) {
    return 'Digite seu nome completo.';
  }
  
  if (nome.trim().length < 2) {
    return 'Digite seu nome completo.';
  }
  
  return '';
};

// Validação de aceite de termos
export const validarAceiteTermos = (aceito: boolean): string => {
  if (!aceito) {
    return 'Você precisa aceitar os Termos de Uso para continuar.';
  }
  return '';
};

// Calcular força da senha
export const calcularForcaSenha = (senha: string): 'fraca' | 'media' | 'forte' => {
  if (senha.length < 8) return 'fraca';
  
  let pontos = 0;
  
  if (/[A-Z]/.test(senha)) pontos++;
  if (/[a-z]/.test(senha)) pontos++;
  if (/[0-9]/.test(senha)) pontos++;
  if (/[^A-Za-z0-9]/.test(senha)) pontos++;
  if (senha.length >= 12) pontos++;
  
  if (pontos <= 2) return 'fraca';
  if (pontos === 3) return 'media';
  return 'forte';
};

// Validar todos os campos de login
export const validarFormularioLogin = (email: string, senha: string): ValidationError[] => {
  const errors: ValidationError[] = [];
  
  const erroEmail = validarEmail(email);
  if (erroEmail) {
    errors.push({ field: 'email', message: erroEmail });
  }
  
  const erroSenha = validarSenhaLogin(senha);
  if (erroSenha) {
    errors.push({ field: 'senha', message: erroSenha });
  }
  
  return errors;
};

// Validar todos os campos de cadastro
export const validarFormularioCadastro = (
  nomeCompleto: string,
  email: string,
  senha: string,
  confirmarSenha: string,
  aceitarTermos: boolean
): ValidationError[] => {
  const errors: ValidationError[] = [];
  
  const erroNome = validarNomeCompleto(nomeCompleto);
  if (erroNome) {
    errors.push({ field: 'nomeCompleto', message: erroNome });
  }
  
  const erroEmail = validarEmail(email);
  if (erroEmail) {
    errors.push({ field: 'email', message: erroEmail });
  }
  
  const erroSenha = validarSenha(senha);
  if (erroSenha) {
    errors.push({ field: 'senha', message: erroSenha });
  }
  
  const erroConfirmarSenha = validarConfirmarSenha(senha, confirmarSenha);
  if (erroConfirmarSenha) {
    errors.push({ field: 'confirmarSenha', message: erroConfirmarSenha });
  }
  
  const erroTermos = validarAceiteTermos(aceitarTermos);
  if (erroTermos) {
    errors.push({ field: 'aceitarTermos', message: erroTermos });
  }
  
  return errors;
};
