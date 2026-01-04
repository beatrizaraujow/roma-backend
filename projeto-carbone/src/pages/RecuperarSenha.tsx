import React, { useState } from 'react';
import { Input } from '../components/Input';
import { Button } from '../components/Button';
import { validarEmail } from '../utils/validacao';
import { authService } from '../utils/authService';
import './RecuperarSenha.css';

export const RecuperarSenha: React.FC = () => {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [touched, setTouched] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const erroEmail = validarEmail(email);
    if (erroEmail) {
      setError(erroEmail);
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      const response = await authService.recuperarSenha(email);
      
      if (response.success) {
        setSuccess(true);
      } else {
        setError(response.message);
      }
    } catch (err) {
      setError('Erro ao enviar email de recuperação. Tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="recuperar-container">
      <div className="recuperar-card">
        <div className="recuperar-header">
          <div className="recuperar-logo">
            <h2 className="logo-text">ROMA</h2>
            <p className="logo-subtitle">Fab&Elo</p>
          </div>
          <h1 className="recuperar-title">Recuperar Senha</h1>
          <p className="recuperar-subtitle">
            Digite seu email e enviaremos um link para redefinir sua senha
          </p>
        </div>

        {success ? (
          <div className="recuperar-success">
            <p className="success-message">
              ✓ Link enviado com sucesso!
            </p>
            <p className="success-text">
              Verifique sua caixa de entrada e siga as instruções para redefinir sua senha.
            </p>
            <a href="#login" className="back-link">
              Voltar para login
            </a>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="recuperar-form" noValidate>
            <Input
              label="Email"
              type="email"
              placeholder="seu@exemplo.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onBlur={() => setTouched(true)}
              error={touched ? error : ''}
              disabled={isSubmitting}
            />

            {error && !touched && (
              <div className="error-message">{error}</div>
            )}

            <Button
              type="submit"
              variant="primary"
              isLoading={isSubmitting}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Enviando' : 'Enviar link de recuperação'}
            </Button>

            <div className="recuperar-footer">
              <a href="#login" className="back-link">
                ← Voltar para login
              </a>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
