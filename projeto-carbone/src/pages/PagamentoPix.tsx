import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useToast } from '../contexts/ToastContext';
import { mercadoPagoService } from '../utils/mercadoPagoService';
import { Button } from '../components/Button';
import './PagamentoPix.css';

export const PagamentoPix: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { showToast } = useToast();
  
  const { pagamentoId, qrCode, qrCodeBase64 } = location.state || {};
  const [status, setStatus] = useState<'pendente' | 'aprovado' | 'expirado'>('pendente');
  const [copiado, setCopiado] = useState(false);
  const [tempoRestante, setTempoRestante] = useState(600); // 10 minutos

  useEffect(() => {
    if (!pagamentoId) {
      showToast('Dados de pagamento não encontrados', 'error');
      navigate('/dashboard');
      return;
    }

    // Verificar status a cada 3 segundos
    const intervaloVerificacao = setInterval(async () => {
      try {
        const resultado = await mercadoPagoService.consultarPagamento(pagamentoId);
        
        if (resultado.status === 'approved') {
          setStatus('aprovado');
          clearInterval(intervaloVerificacao);
          showToast('Pagamento aprovado!', 'success');
          setTimeout(() => {
            navigate('/pagamento/sucesso', { state: { pagamentoId } });
          }, 2000);
        }
      } catch (error) {
        console.error('Erro ao verificar status:', error);
      }
    }, 3000);

    // Contador de tempo
    const intervaloTempo = setInterval(() => {
      setTempoRestante((prev) => {
        if (prev <= 1) {
          setStatus('expirado');
          clearInterval(intervaloVerificacao);
          clearInterval(intervaloTempo);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      clearInterval(intervaloVerificacao);
      clearInterval(intervaloTempo);
    };
  }, [pagamentoId, navigate, showToast]);

  const copiarCodigoPix = () => {
    if (qrCode) {
      navigator.clipboard.writeText(qrCode);
      setCopiado(true);
      showToast('Código PIX copiado!', 'success');
      setTimeout(() => setCopiado(false), 3000);
    }
  };

  const formatarTempo = (segundos: number) => {
    const minutos = Math.floor(segundos / 60);
    const segs = segundos % 60;
    return `${minutos.toString().padStart(2, '0')}:${segs.toString().padStart(2, '0')}`;
  };

  if (status === 'aprovado') {
    return (
      <div className="pagamento-pix-container">
        <div className="pagamento-pix-card success">
          <div className="success-icon">✓</div>
          <h2>Pagamento Aprovado!</h2>
          <p>Seu pagamento foi confirmado com sucesso.</p>
          <p className="redirect-message">Redirecionando...</p>
        </div>
      </div>
    );
  }

  if (status === 'expirado') {
    return (
      <div className="pagamento-pix-container">
        <div className="pagamento-pix-card expired">
          <div className="expired-icon">⏱️</div>
          <h2>Pagamento Expirado</h2>
          <p>O tempo para pagamento expirou.</p>
          <p>Por favor, faça uma nova compra.</p>
          <Button onClick={() => navigate('/dashboard')}>
            Voltar ao Início
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="pagamento-pix-container">
      <div className="pagamento-pix-card">
        <div className="pix-header">
          <div className="pix-icon">🔑</div>
          <h2>Pagamento via PIX</h2>
          <p>Escaneie o QR Code ou copie o código abaixo</p>
        </div>

        <div className="pix-timer">
          <span>Tempo restante:</span>
          <strong>{formatarTempo(tempoRestante)}</strong>
        </div>

        {qrCodeBase64 && (
          <div className="qr-code-container">
            <img src={`data:image/png;base64,${qrCodeBase64}`} alt="QR Code PIX" />
          </div>
        )}

        <div className="pix-code-section">
          <label>Código PIX (Copia e Cola)</label>
          <div className="pix-code-box">
            <code>{qrCode || 'Gerando código...'}</code>
          </div>
          <Button onClick={copiarCodigoPix} disabled={!qrCode}>
            {copiado ? '✓ Copiado!' : 'Copiar Código PIX'}
          </Button>
        </div>

        <div className="pix-instructions">
          <h3>Como pagar com PIX:</h3>
          <ol>
            <li>Abra o app do seu banco</li>
            <li>Escolha a opção "Pagar com PIX"</li>
            <li>Escaneie o QR Code ou cole o código</li>
            <li>Confirme o pagamento</li>
          </ol>
        </div>

        <div className="pix-status">
          <div className="loading-spinner"></div>
          <p>Aguardando pagamento...</p>
        </div>

        <div className="pix-actions">
          <Button variant="secondary" onClick={() => navigate('/dashboard')}>
            Cancelar
          </Button>
        </div>
      </div>
    </div>
  );
};
