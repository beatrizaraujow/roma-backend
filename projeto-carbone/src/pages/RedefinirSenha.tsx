import React, { useState, useEffect } from 'react';
import { Input } from '../components/Input';
import { Button } from '../components/Button';
import { PasswordStrength } from '../components/PasswordStrength';
import { useToast } from '../contexts/ToastContext';
import { validarSenha, validarConfirmarSenha } from '../utils/validacao';
import './RedefinirSenha.css';

export const RedefinirSenha: React.FC = () => {
  const { showSuccess, showError } = useToast();
  const [_token, setToken] = useState('');
  const [novaSenha, setNovaSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [touched, setTouched] = useState({ novaSenha: false, confirmarSenha: false });
  const [errors, setErrors] = useState({ novaSenha: '', confirmarSenha: '' });
  const [tokenValido, setTokenValido] = useState<boolean | null>(null);

  useEffect(() => {
    // Extrair token da URL
    const params = new URLSearchParams(window.location.search);
    const urlToken = params.get('token');

    if (urlToken) {
      setToken(urlToken);
      // Aqui você validaria o token com a API
      // Por enquanto, vamos simular
      setTimeout(() => {
        setTokenValido(true);
      }, 1000);
    } else {
      setTokenValido(false);
    }
  }, []);

  const handleBlur = (field: 'novaSenha' | 'confirmarSenha') => {
    setTouched(prev => ({ ...prev, [field]: true }));

    let error = '';
    if (field === 'novaSenha') {
      error = validarSenha(novaSenha);
    } else if (field === 'confirmarSenha') {
      error = validarConfirmarSenha(novaSenha, confirmarSenha);
    }

    setErrors(prev => ({ ...prev, [field]: error }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setTouched({ novaSenha: true, confirmarSenha: true });

    const erroNovaSenha = validarSenha(novaSenha);
    const erroConfirmar = validarConfirmarSenha(novaSenha, confirmarSenha);

    setErrors({ novaSenha: erroNovaSenha, confirmarSenha: erroConfirmar });

    if (erroNovaSenha || erroConfirmar) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Aqui você enviaria a requisição para a API
      // const response = await fetch(`${API_URL}/auth/redefinir-senha`, {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ token, novaSenha }),
      // });

      // Simular chamada à API
      await new Promise(resolve => setTimeout(resolve, 1500));

      showSuccess('Senha redefinida com sucesso!');
      
      setTimeout(() => {
        window.location.href = '#login';
      }, 1500);

    } catch (error) {
      showError('Erro ao redefinir senha. Tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (tokenValido === null) {
    return (
      <div className="redefinir-container">
        <div className="redefinir-loading">Validando token...</div>
      </div>
    );
  }

  if (tokenValido === false) {
    return (
      <div className="redefinir-container">
        <div className="redefinir-card">
          <div className="redefinir-header">
            <div className="redefinir-logo">
              <h2 className="logo-text">ROMA</h2>
              <p className="logo-subtitle">Fab&Elo</p>
            </div>
            <h1 className="redefinir-title">Token Inválido</h1>
          </div>
          <div className="redefinir-error">
            <p>O link de redefinição de senha é inválido ou expirou.</p>
            <a href="#recuperar-senha" className="back-link">
              Solicitar novo link
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="redefinir-container">
      <div className="redefinir-card">
        <div className="redefinir-header">
          <div className="redefinir-logo">
            <h2 className="logo-text">ROMA</h2>
            <p className="logo-subtitle">Fab&Elo</p>
          </div>
          <h1 className="redefinir-title">Redefinir Senha</h1>
          <p className="redefinir-subtitle">
            Crie uma nova senha segura para sua conta
          </p>
        </div>

        <form onSubmit={handleSubmit} className="redefinir-form" noValidate>
          <div className="password-field-wrapper">
            <Input
              label="Nova Senha"
              type="password"
              placeholder="Digite sua nova senha"
              value={novaSenha}
              onChange={(e) => setNovaSenha(e.target.value)}
              onBlur={() => handleBlur('novaSenha')}
              error={touched.novaSenha ? errors.novaSenha : ''}
              disabled={isSubmitting}
            />
            <PasswordStrength 
              senha={novaSenha} 
              showIndicator={novaSenha.length > 0}
            />
          </div>

          <Input
            label="Confirmar Nova Senha"
            type="password"
            placeholder="Confirme sua nova senha"
            value={confirmarSenha}
            onChange={(e) => setConfirmarSenha(e.target.value)}
            onBlur={() => handleBlur('confirmarSenha')}
            error={touched.confirmarSenha ? errors.confirmarSenha : ''}
            disabled={isSubmitting}
          />

          <Button
            type="submit"
            variant="primary"
            isLoading={isSubmitting}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Redefinindo' : 'Redefinir Senha'}
          </Button>

          <div className="redefinir-footer">
            <a href="#login" className="back-link">
              ← Voltar para login
            </a>
          </div>
        </form>
      </div>
    </div>
  );
};
