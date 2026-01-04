import React from 'react';
import './PasswordStrength.css';

interface PasswordStrengthProps {
  senha: string;
  showIndicator?: boolean;
}

export const PasswordStrength: React.FC<PasswordStrengthProps> = ({ 
  senha, 
  showIndicator = true 
}) => {
  const calcularForca = (password: string): { 
    forca: 'fraca' | 'media' | 'forte'; 
    porcentagem: number;
    mensagem: string;
  } => {
    if (!password) {
      return { forca: 'fraca', porcentagem: 0, mensagem: '' };
    }

    let pontos = 0;
    const requisitos = {
      tamanho: password.length >= 8,
      maiuscula: /[A-Z]/.test(password),
      minuscula: /[a-z]/.test(password),
      numero: /[0-9]/.test(password),
      especial: /[^A-Za-z0-9]/.test(password),
    };

    // Pontuação base por tamanho
    if (password.length >= 8) pontos += 20;
    if (password.length >= 12) pontos += 10;
    if (password.length >= 16) pontos += 10;

    // Pontuação por tipo de caractere
    if (requisitos.maiuscula) pontos += 15;
    if (requisitos.minuscula) pontos += 15;
    if (requisitos.numero) pontos += 15;
    if (requisitos.especial) pontos += 15;

    // Determinar força
    let forca: 'fraca' | 'media' | 'forte';
    let mensagem: string;

    if (pontos <= 30) {
      forca = 'fraca';
      mensagem = 'Senha fraca';
    } else if (pontos <= 60) {
      forca = 'media';
      mensagem = 'Senha média';
    } else {
      forca = 'forte';
      mensagem = 'Senha forte';
    }

    return { forca, porcentagem: Math.min(pontos, 100), mensagem };
  };

  const { forca, porcentagem, mensagem } = calcularForca(senha);

  if (!showIndicator || !senha) {
    return null;
  }

  return (
    <div className="password-strength">
      <div className="strength-bar-container">
        <div 
          className={`strength-bar strength-${forca}`}
          style={{ width: `${porcentagem}%` }}
        />
      </div>
      <div className="strength-text">
        <span className={`strength-label strength-label-${forca}`}>
          {mensagem}
        </span>
      </div>
      <div className="strength-requirements">
        <div className={`requirement ${senha.length >= 8 ? 'met' : ''}`}>
          {senha.length >= 8 ? '✓' : '○'} Mínimo 8 caracteres
        </div>
        <div className={`requirement ${/[A-Z]/.test(senha) ? 'met' : ''}`}>
          {/[A-Z]/.test(senha) ? '✓' : '○'} Letra maiúscula
        </div>
        <div className={`requirement ${/[a-z]/.test(senha) ? 'met' : ''}`}>
          {/[a-z]/.test(senha) ? '✓' : '○'} Letra minúscula
        </div>
        <div className={`requirement ${/[0-9]/.test(senha) ? 'met' : ''}`}>
          {/[0-9]/.test(senha) ? '✓' : '○'} Número
        </div>
        <div className={`requirement ${/[^A-Za-z0-9]/.test(senha) ? 'met' : ''}`}>
          {/[^A-Za-z0-9]/.test(senha) ? '✓' : '○'} Caractere especial
        </div>
      </div>
    </div>
  );
};
