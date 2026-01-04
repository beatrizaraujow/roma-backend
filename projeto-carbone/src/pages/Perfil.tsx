import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import { Input } from '../components/Input';
import { Button } from '../components/Button';
import { validarNomeCompleto, validarEmail } from '../utils/validacao';
import './Perfil.css';

export const Perfil: React.FC = () => {
  const { user, updateUser, logout } = useAuth();
  const { showSuccess, showError } = useToast();
  
  const [isEditing, setIsEditing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    nome: user?.nome || '',
    email: user?.email || '',
  });
  const [errors, setErrors] = useState({ nome: '', email: '' });

  const handleSave = async () => {
    const erroNome = validarNomeCompleto(formData.nome);
    const erroEmail = validarEmail(formData.email);

    setErrors({ nome: erroNome, email: erroEmail });

    if (erroNome || erroEmail) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Simular chamada à API
      await new Promise(resolve => setTimeout(resolve, 1000));

      updateUser({
        id: user!.id,
        nome: formData.nome,
        email: formData.email,
      });

      showSuccess('Perfil atualizado com sucesso!');
      setIsEditing(false);
    } catch (error) {
      showError('Erro ao atualizar perfil. Tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      nome: user?.nome || '',
      email: user?.email || '',
    });
    setErrors({ nome: '', email: '' });
    setIsEditing(false);
  };

  return (
    <div className="perfil-container">
      <div className="perfil-header">
        <button className="back-button" onClick={() => window.location.href = '#dashboard'}>
          ← Voltar
        </button>
        <h1>Meu Perfil</h1>
      </div>

      <div className="perfil-content">
        <div className="perfil-card">
          <div className="perfil-avatar">
            <div className="avatar-circle">
              {user?.nome.charAt(0).toUpperCase()}
            </div>
            <button className="avatar-change-btn">Alterar foto</button>
          </div>

          <div className="perfil-info">
            <h2>Informações Pessoais</h2>
            
            <div className="info-field">
              <Input
                label="Nome Completo"
                value={formData.nome}
                onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                error={errors.nome}
                disabled={!isEditing || isSubmitting}
              />
            </div>

            <div className="info-field">
              <Input
                label="Email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                error={errors.email}
                disabled={!isEditing || isSubmitting}
              />
            </div>

            <div className="info-field">
              <label className="field-label">ID do Usuário</label>
              <div className="field-value readonly">{user?.id}</div>
            </div>

            <div className="perfil-actions">
              {!isEditing ? (
                <Button onClick={() => setIsEditing(true)}>
                  Editar Perfil
                </Button>
              ) : (
                <div className="edit-actions">
                  <Button 
                    variant="primary" 
                    onClick={handleSave}
                    isLoading={isSubmitting}
                    disabled={isSubmitting}
                  >
                    Salvar Alterações
                  </Button>
                  <Button 
                    variant="secondary" 
                    onClick={handleCancel}
                    disabled={isSubmitting}
                  >
                    Cancelar
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="perfil-danger-zone">
          <h3>Zona de Perigo</h3>
          <p>Ações irreversíveis que afetam sua conta</p>
          <button className="danger-button" onClick={logout}>
            Sair da Conta
          </button>
        </div>
      </div>
    </div>
  );
};
