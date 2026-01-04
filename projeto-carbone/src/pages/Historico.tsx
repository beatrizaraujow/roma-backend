import React, { useEffect, useState } from 'react';
import './Historico.css';

interface Activity {
  id: string;
  action: string;
  description: string | null;
  ipAddress: string | null;
  userAgent: string | null;
  createdAt: string;
}

interface Pagination {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

export const Historico: React.FC = () => {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [pagination, setPagination] = useState<Pagination>({
    page: 1,
    limit: 10,
    total: 0,
    pages: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    carregarAtividades();
  }, [pagination.page]);

  const carregarAtividades = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem('auth_token');
      const response = await fetch(
        `http://localhost:3000/api/auth/activities?page=${pagination.page}&limit=${pagination.limit}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setActivities(data.activities);
        setPagination(data.pagination);
      }
    } catch (error) {
      console.error('Erro ao carregar atividades:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatarData = (dataISO: string) => {
    const data = new Date(dataISO);
    return data.toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getActionIcon = (action: string) => {
    const icons: Record<string, string> = {
      LOGIN: '🔐',
      LOGOUT: '🚪',
      CADASTRO: '✨',
      ATUALIZAR_PERFIL: '✏️',
      TROCAR_SENHA: '🔑',
      RECUPERAR_SENHA: '📧',
      REDEFINIR_SENHA: '🔓',
      ATUALIZAR_CONFIGURACOES: '⚙️',
      UPLOAD_AVATAR: '📸',
    };
    return icons[action] || '📋';
  };

  const getActionLabel = (action: string) => {
    const labels: Record<string, string> = {
      LOGIN: 'Login realizado',
      LOGOUT: 'Logout',
      CADASTRO: 'Conta criada',
      ATUALIZAR_PERFIL: 'Perfil atualizado',
      TROCAR_SENHA: 'Senha alterada',
      RECUPERAR_SENHA: 'Recuperação de senha',
      REDEFINIR_SENHA: 'Senha redefinida',
      ATUALIZAR_CONFIGURACOES: 'Configurações alteradas',
      UPLOAD_AVATAR: 'Foto de perfil atualizada',
    };
    return labels[action] || action;
  };

  return (
    <div className="historico-page">
      <div className="historico-header">
        <button onClick={() => window.history.back()} className="back-button">
          ← Voltar
        </button>
        <h1 className="historico-title">Histórico de Atividades</h1>
        <p className="historico-subtitle">
          Registro de todas as ações realizadas na sua conta
        </p>
      </div>

      {isLoading ? (
        <div className="loading-container">
          <div className="spinner-large"></div>
          <p>Carregando histórico...</p>
        </div>
      ) : (
        <>
          <div className="activities-list">
            {activities.length === 0 ? (
              <div className="empty-state">
                <p>📋</p>
                <p>Nenhuma atividade registrada</p>
              </div>
            ) : (
              activities.map((activity) => (
                <div key={activity.id} className="activity-item">
                  <div className="activity-icon">
                    {getActionIcon(activity.action)}
                  </div>
                  <div className="activity-content">
                    <div className="activity-header">
                      <h3 className="activity-title">
                        {getActionLabel(activity.action)}
                      </h3>
                      <span className="activity-date">
                        {formatarData(activity.createdAt)}
                      </span>
                    </div>
                    {activity.description && (
                      <p className="activity-description">
                        {activity.description}
                      </p>
                    )}
                    <div className="activity-meta">
                      {activity.ipAddress && (
                        <span className="activity-ip">
                          📍 {activity.ipAddress}
                        </span>
                      )}
                      {activity.userAgent && (
                        <span className="activity-device">
                          💻 {activity.userAgent.substring(0, 50)}...
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {pagination.pages > 1 && (
            <div className="pagination">
              <button
                onClick={() =>
                  setPagination((prev) => ({ ...prev, page: prev.page - 1 }))
                }
                disabled={pagination.page === 1}
                className="pagination-button"
              >
                ← Anterior
              </button>
              <span className="pagination-info">
                Página {pagination.page} de {pagination.pages}
              </span>
              <button
                onClick={() =>
                  setPagination((prev) => ({ ...prev, page: prev.page + 1 }))
                }
                disabled={pagination.page === pagination.pages}
                className="pagination-button"
              >
                Próxima →
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};
