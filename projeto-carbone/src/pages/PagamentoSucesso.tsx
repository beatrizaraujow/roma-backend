import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from '../components/Button';
import './PagamentoSucesso.css';

export const PagamentoSucesso: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { pagamentoId } = location.state || {};
  const [contadorRedirect, setContadorRedirect] = useState(5);

  useEffect(() => {
    if (!pagamentoId) {
      navigate('/dashboard');
      return;
    }

    const intervalo = setInterval(() => {
      setContadorRedirect((prev) => {
        if (prev <= 1) {
          clearInterval(intervalo);
          navigate('/dashboard');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(intervalo);
  }, [pagamentoId, navigate]);

  return (
    <div className="pagamento-sucesso-container">
      <div className="pagamento-sucesso-card">
        <div className="success-animation">
          <div className="checkmark-circle">
            <div className="checkmark"></div>
          </div>
        </div>

        <h1>Pagamento Confirmado!</h1>
        <p className="success-message">
          Parabéns! Sua compra foi realizada com sucesso.
        </p>

        <div className="order-details">
          <div className="detail-item">
            <span className="detail-icon">📧</span>
            <div>
              <strong>Email de confirmação enviado</strong>
              <p>Verifique sua caixa de entrada</p>
            </div>
          </div>
          <div className="detail-item">
            <span className="detail-icon">🎓</span>
            <div>
              <strong>Acesso imediato aos cursos</strong>
              <p>Comece a estudar agora mesmo</p>
            </div>
          </div>
          <div className="detail-item">
            <span className="detail-icon">🛡️</span>
            <div>
              <strong>Garantia de 7 dias</strong>
              <p>100% do seu dinheiro de volta</p>
            </div>
          </div>
        </div>

        <div className="transaction-info">
          <p>ID da Transação: <code>{pagamentoId}</code></p>
        </div>

        <div className="success-actions">
          <Button onClick={() => navigate('/dashboard')}>
            Acessar Meus Cursos
          </Button>
          <Button variant="secondary" onClick={() => navigate('/historico')}>
            Ver Histórico de Compras
          </Button>
        </div>

        <p className="redirect-info">
          Redirecionando em {contadorRedirect} segundos...
        </p>
      </div>
    </div>
  );
};
