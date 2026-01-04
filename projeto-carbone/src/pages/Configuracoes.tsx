import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import { Input } from '../components/Input';
import { Button } from '../components/Button';
import { PasswordStrength } from '../components/PasswordStrength';
import { TwoFactorSetup } from '../components/TwoFactorSetup';
import { validarSenha, validarConfirmarSenha } from '../utils/validacao';
import './Configuracoes.css';

export const Configuracoes: React.FC = () => {
  const { user, updateUser } = useAuth();
  const { showSuccess, showError } = useToast();
  
  const [senhaAtual, setSenhaAtual] = useState('');
  const [novaSenha, setNovaSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({ senhaAtual: '', novaSenha: '', confirmarSenha: '' });
  const [touched, setTouched] = useState({ senhaAtual: false, novaSenha: false, confirmarSenha: false });
  const [show2FASetup, setShow2FASetup] = useState(false);

  const handleBlur = (field: 'senhaAtual' | 'novaSenha' | 'confirmarSenha') => {
    setTouched(prev => ({ ...prev, [field]: true }));

    let error = '';
    if (field === 'senhaAtual' && !senhaAtual) {
      error = 'Senha atual é obrigatória';
    } else if (field === 'novaSenha') {
      error = validarSenha(novaSenha);
    } else if (field === 'confirmarSenha') {
      error = validarConfirmarSenha(novaSenha, confirmarSenha);
    }

    setErrors(prev => ({ ...prev, [field]: error }));
  };

  const handleAlterarSenha = async (e: React.FormEvent) => {
    e.preventDefault();

    setTouched({ senhaAtual: true, novaSenha: true, confirmarSenha: true });

    const erros = {
      senhaAtual: !senhaAtual ? 'Senha atual é obrigatória' : '',
      novaSenha: validarSenha(novaSenha),
      confirmarSenha: validarConfirmarSenha(novaSenha, confirmarSenha),
    };

    setErrors(erros);

    if (Object.values(erros).some(erro => erro)) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Simular chamada à API
      await new Promise(resolve => setTimeout(resolve, 1500));

      showSuccess('Senha alterada com sucesso!');
      setSenhaAtual('');
      setNovaSenha('');
      setConfirmarSenha('');
      setTouched({ senhaAtual: false, novaSenha: false, confirmarSenha: false });
    } catch (error) {
      showError('Erro ao alterar senha. Verifique sua senha atual.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="configuracoes-container">
      <div className="configuracoes-header">
        <button className="back-button" onClick={() => window.location.href = '#dashboard'}>
          ← Voltar
        </button>
        <h1>Configurações</h1>
      </div>

      <div className="configuracoes-content">
        {/* Seção de Conta */}
        <div className="config-section">
          <h2>Informações da Conta</h2>
          <div className="info-grid">
            <div className="info-item">
              <span className="info-label">Email</span>
              <span className="info-value">{user?.email}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Nome</span>
              <span className="info-value">{user?.nome}</span>
            </div>
            <div className="info-item">
              <span className="info-label">ID</span>
              <span className="info-value">{user?.id}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Status</span>
              <span className="info-value status-active">Ativo</span>
            </div>
          </div>
        </div>

        {/* Seção de Segurança */}
        <div className="config-section">
          <h2>Segurança</h2>
          <form onSubmit={handleAlterarSenha} className="security-form">
            <Input
              label="Senha Atual"
              type="password"
              placeholder="Digite sua senha atual"
              value={senhaAtual}
              onChange={(e) => setSenhaAtual(e.target.value)}
              onBlur={() => handleBlur('senhaAtual')}
              error={touched.senhaAtual ? errors.senhaAtual : ''}
              disabled={isSubmitting}
            />

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
              {isSubmitting ? 'Alterando...' : 'Alterar Senha'}
            </Button>
          </form>
        </div>

        {/* Seção de Autenticação 2FA */}
        <div className="config-section">
          <h2>Autenticação de Dois Fatores</h2>
          <div className="preference-item">
            <div className="preference-info">
              <h3>Autenticação de Dois Fatores (2FA)</h3>
              <p>Adicione uma camada extra de segurança à sua conta</p>
              {user?.autenticacao2FA && (
                <span className="badge-active">✓ Ativado</span>
              )}
            </div>
            <label className="toggle-switch">
              <input 
                type="checkbox" 
                checked={user?.autenticacao2FA || false}
                onChange={(e) => {
                  if (e.target.checked) {
                    setShow2FASetup(true);
                  } else {
                    // Desativar 2FA
                    if (confirm('Deseja realmente desativar a autenticação de dois fatores?')) {
                      updateUser({ ...user!, autenticacao2FA: false });
                      showSuccess('2FA desativado com sucesso');
                    }
                  }
                }}
              />
              <span className="toggle-slider"></span>
            </label>
          </div>
        </div>

        {/* Seção de Preferências */}
        <div className="config-section">
          <h2>Preferências</h2>
          <div className="preference-item">
            <div className="preference-info">
              <h3>Notificações por Email</h3>
              <p>Receba atualizações e novidades por email</p>
            </div>
            <label className="toggle-switch">
              <input type="checkbox" defaultChecked />
              <span className="toggle-slider"></span>
            </label>
          </div>

          <div className="preference-item">
            <div className="preference-info">
              <h3>Autenticação de Dois Fatores</h3>
              <p>Adicione uma camada extra de segurança à sua conta</p>
            </div>
            <label className="toggle-switch">
              <input type="checkbox" />
              <span className="toggle-slider"></span>
            </label>
          </div>

        </div>
      </div>

      {show2FASetup && (
        <TwoFactorSetup
          onComplete={(backupCodes) => {
            updateUser({ ...user!, autenticacao2FA: true });
            setShow2FASetup(false);
            showSuccess('Autenticação de dois fatores ativada com sucesso!');
            console.log('Backup codes:', backupCodes);
          }}
          onCancel={() => setShow2FASetup(false)}
        />
      )}
    </div>
  );
};
