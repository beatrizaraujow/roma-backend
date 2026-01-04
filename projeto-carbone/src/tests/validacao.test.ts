import { describe, it, expect } from 'vitest';
import { validarEmail, validarSenha, validarNomeCompleto } from '../utils/validacao';

describe('Validações', () => {
  describe('validarEmail', () => {
    it('deve aceitar email válido', () => {
      expect(validarEmail('usuario@exemplo.com')).toBe('');
      expect(validarEmail('nome.sobrenome@dominio.com.br')).toBe('');
    });

    it('deve rejeitar email inválido', () => {
      expect(validarEmail('email-invalido')).toBeTruthy();
      expect(validarEmail('@dominio.com')).toBeTruthy();
      expect(validarEmail('usuario@')).toBeTruthy();
      expect(validarEmail('')).toBeTruthy();
    });
  });

  describe('validarSenha', () => {
    it('deve aceitar senha forte', () => {
      expect(validarSenha('Senha123!@#')).toBe('');
      expect(validarSenha('MyP@ssw0rd')).toBe('');
    });

    it('deve rejeitar senha curta', () => {
      expect(validarSenha('Sen1@')).toBeTruthy();
    });

    it('deve rejeitar senha sem letra maiúscula', () => {
      expect(validarSenha('senha123!@#')).toBeTruthy();
    });

    it('deve rejeitar senha sem letra minúscula', () => {
      expect(validarSenha('SENHA123!@#')).toBeTruthy();
    });

    it('deve rejeitar senha sem número', () => {
      expect(validarSenha('Senha!@#$%')).toBeTruthy();
    });

    it('deve rejeitar senha sem caractere especial', () => {
      expect(validarSenha('Senha123456')).toBeTruthy();
    });
  });

  describe('validarNomeCompleto', () => {
    it('deve aceitar nome completo válido', () => {
      expect(validarNomeCompleto('João Silva')).toBe('');
      expect(validarNomeCompleto('Maria de Souza')).toBe('');
    });

    it('deve rejeitar nome sem sobrenome', () => {
      expect(validarNomeCompleto('João')).toBeTruthy();
    });

    it('deve rejeitar nome vazio', () => {
      expect(validarNomeCompleto('')).toBeTruthy();
    });

    it('deve rejeitar nome com números', () => {
      expect(validarNomeCompleto('João Silva 123')).toBeTruthy();
    });
  });
});
