import React, { useState } from 'react';
import { Input } from '../components/Input';
import { Button } from '../components/Button';
import { Checkbox } from '../components/Checkbox';
import { PasswordStrength } from '../components/PasswordStrength';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import { getErrorMessage } from '../utils/errorMessages';
import {
  validarNomeCompleto,
  validarEmail,
  validarSenha,
  validarConfirmarSenha,
  validarAceiteTermos,
} from '../utils/validacao';
import type { CadastroFormData, FormState } from '../types/auth.types';
import './Cadastro.css';

export const Cadastro: React.FC = () => {
  const { cadastrar } = useAuth();
  const { showSuccess, showError } = useToast();

  const [formData, setFormData] = useState<CadastroFormData>({
    nomeCompleto: '',
    email: '',
    senha: '',
    confirmarSenha: '',
    aceitarTermos: false,
    codigoPromocional: '',
  });

  const [formState, setFormState] = useState<FormState>({
    isSubmitting: false,
    errors: {},
    touched: {},
  });

  const [statusMessage, setStatusMessage] = useState<{
    type: 'success' | 'error' | null;
    message: string;
  }>({ type: null, message: '' });

  const handleBlur = (field: keyof CadastroFormData) => {
    setFormState(prev => ({
      ...prev,
      touched: { ...prev.touched, [field]: true },
    }));

    // Validar campo ao sair
    let error = '';
    switch (field) {
      case 'nomeCompleto':
        error = validarNomeCompleto(formData.nomeCompleto);
        break;
      case 'email':
        error = validarEmail(formData.email);
        break;
      case 'senha':
        error = validarSenha(formData.senha);
        break;
      case 'confirmarSenha':
        error = validarConfirmarSenha(formData.senha, formData.confirmarSenha);
        break;
      case 'aceitarTermos':
        error = validarAceiteTermos(formData.aceitarTermos);
        break;
    }

    setFormState(prev => ({
      ...prev,
      errors: { ...prev.errors, [field]: error },
    }));
  };

  const handleChange = (field: keyof CadastroFormData, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));

    // Revalidar confirmação de senha se a senha foi alterada
    if (field === 'senha' && formState.touched.confirmarSenha) {
      const erroConfirmar = validarConfirmarSenha(value as string, formData.confirmarSenha);
      setFormState(prev => ({
        ...prev,
        errors: { ...prev.errors, confirmarSenha: erroConfirmar },
      }));
    }

    // Limpar mensagem de erro global ao alterar campos
    if (statusMessage.type === 'error') {
      setStatusMessage({ type: null, message: '' });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Marcar todos os campos como touched
    const allFields = ['nomeCompleto', 'email', 'senha', 'confirmarSenha', 'aceitarTermos'];
    const touched: Record<string, boolean> = {};
    allFields.forEach(field => {
      touched[field] = true;
    });
    setFormState(prev => ({ ...prev, touched }));

    // Validar todos os campos
    const errors: Record<string, string> = {};
    
    const erroNome = validarNomeCompleto(formData.nomeCompleto);
    if (erroNome) errors.nomeCompleto = erroNome;

    const erroEmail = validarEmail(formData.email);
    if (erroEmail) errors.email = erroEmail;

    const erroSenha = validarSenha(formData.senha);
    if (erroSenha) errors.senha = erroSenha;

    const erroConfirmarSenha = validarConfirmarSenha(formData.senha, formData.confirmarSenha);
    if (erroConfirmarSenha) errors.confirmarSenha = erroConfirmarSenha;

    const erroTermos = validarAceiteTermos(formData.aceitarTermos);
    if (erroTermos) errors.aceitarTermos = erroTermos;

    setFormState(prev => ({ ...prev, errors }));

    if (Object.keys(errors).length > 0) {
      return;
    }

    // Cadastro com backend
    setFormState(prev => ({ ...prev, isSubmitting: true }));
    setStatusMessage({ type: null, message: '' });

    try {
      const response = await cadastrar(
        formData.nomeCompleto,
        formData.email,
        formData.senha,
        formData.codigoPromocional
      );

      if (response.success) {
        const successMsg = response.message || 'Conta criada com sucesso!';
        showSuccess(successMsg);
        setStatusMessage({
          type: 'success',
          message: successMsg,
        });

        // Redirecionar para dashboard após sucesso
        setTimeout(() => {
          window.location.href = '#dashboard';
        }, 1500);
      } else {
        const errorMsg = response.errorCode 
          ? getErrorMessage(response.errorCode)
          : (response.message || 'Erro ao criar conta');
        
        showError(errorMsg);
        setStatusMessage({
          type: 'error',
          message: errorMsg,
        });

        // Se for erro de email duplicado, marcar campo
        if (response.errorCode === 'EMAIL_ALREADY_EXISTS') {
          setFormState(prev => ({
            ...prev,
            errors: { ...prev.errors, email: 'Este email já está cadastrado.' },
          }));
        }
      }
    } catch (error) {
      const errorMsg = getErrorMessage('NETWORK_ERROR');
      showError(errorMsg);
      setStatusMessage({
        type: 'error',
        message: errorMsg,
      });
    } finally {
      setFormState(prev => ({ ...prev, isSubmitting: false }));
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h1 className="auth-title">Crie sua conta</h1>
          <p className="auth-subtitle">Bastam alguns passos para começar</p>
        </div>

        {statusMessage.type && (
          <div className={`auth-message auth-message-${statusMessage.type}`} role="alert">
            {statusMessage.message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="auth-form" noValidate>
          <Input
            label="Nome completo"
            type="text"
            placeholder="Nome Sobrenome"
            value={formData.nomeCompleto}
            onChange={(e) => handleChange('nomeCompleto', e.target.value)}
            onBlur={() => handleBlur('nomeCompleto')}
            error={formState.touched.nomeCompleto ? formState.errors.nomeCompleto : ''}
            disabled={formState.isSubmitting}
          />

          <Input
            label="Email"
            type="email"
            placeholder="seu@exemplo.com"
            value={formData.email}
            onChange={(e) => handleChange('email', e.target.value)}
            onBlur={() => handleBlur('email')}
            error={formState.touched.email ? formState.errors.email : ''}
            helperText={!formState.errors.email ? 'Usaremos este email para notificações e recuperação de senha.' : undefined}
            disabled={formState.isSubmitting}
          />

          <div className="password-field-wrapper">
            <Input
              label="Senha"
              type="password"
              placeholder="Crie uma senha segura"
              value={formData.senha}
              onChange={(e) => handleChange('senha', e.target.value)}
              onBlur={() => handleBlur('senha')}
              error={formState.touched.senha ? formState.errors.senha : ''}
              disabled={formState.isSubmitting}
            />
            <PasswordStrength 
              senha={formData.senha} 
              showIndicator={formData.senha.length > 0}
            />
          </div>

          <Input
            label="Confirmar senha"
            type="password"
            placeholder="Repita sua senha"
            value={formData.confirmarSenha}
            onChange={(e) => handleChange('confirmarSenha', e.target.value)}
            onBlur={() => handleBlur('confirmarSenha')}
            error={formState.touched.confirmarSenha ? formState.errors.confirmarSenha : ''}
            disabled={formState.isSubmitting}
          />

          <Input
            label="Código promocional (opcional)"
            type="text"
            placeholder="Digite o código"
            value={formData.codigoPromocional}
            onChange={(e) => handleChange('codigoPromocional', e.target.value)}
            disabled={formState.isSubmitting}
          />

          <Checkbox
            label={
              <>
                Li e concordo com os{' '}
                <a href="#termos" target="_blank" rel="noopener noreferrer">
                  Termos de Uso
                </a>{' '}
                e a{' '}
                <a href="#privacidade" target="_blank" rel="noopener noreferrer">
                  Política de Privacidade
                </a>
              </>
            }
            checked={formData.aceitarTermos}
            onChange={(e) => handleChange('aceitarTermos', e.target.checked)}
            onBlur={() => handleBlur('aceitarTermos')}
            error={formState.touched.aceitarTermos ? formState.errors.aceitarTermos : ''}
            disabled={formState.isSubmitting}
          />

          <Button
            type="submit"
            variant="primary"
            isLoading={formState.isSubmitting}
            disabled={formState.isSubmitting}
          >
            {formState.isSubmitting ? 'Criando sua conta' : 'Criar conta'}
          </Button>

          <div className="auth-footer">
            <span>Já tenho conta — </span>
            <a href="#login" className="auth-link">
              Entrar
            </a>
          </div>
        </form>
      </div>
    </div>
  );
};
