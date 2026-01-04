import React, { useState, useEffect } from 'react';
import './TwoFactorSetup.css';

interface TwoFactorSetupProps {
  onComplete: (backupCodes: string[]) => void;
  onCancel: () => void;
}

export const TwoFactorSetup: React.FC<TwoFactorSetupProps> = ({ onComplete, onCancel }) => {
  const [step, setStep] = useState<'qr' | 'verify' | 'backup'>('qr');
  const [qrCode, setQrCode] = useState<string>('');
  const [secret, setSecret] = useState<string>('');
  const [verificationCode, setVerificationCode] = useState('');
  const [backupCodes, setBackupCodes] = useState<string[]>([]);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    generateQRCode();
  }, []);

  const generateQRCode = async () => {
    try {
      const token = localStorage.getItem('auth_token');
      const response = await fetch('http://localhost:3000/api/auth/2fa/generate', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setQrCode(data.qrCode);
        setSecret(data.secret);
      } else {
        setError('Erro ao gerar QR Code');
      }
    } catch (error) {
      setError('Erro ao conectar com servidor');
    }
  };

  const verifyCode = async () => {
    if (verificationCode.length !== 6) {
      setError('Código deve ter 6 dígitos');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('auth_token');
      const response = await fetch('http://localhost:3000/api/auth/2fa/verify', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token: verificationCode,
          secret,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setBackupCodes(data.backupCodes);
        setStep('backup');
      } else {
        setError(data.error || 'Código inválido');
      }
    } catch (error) {
      setError('Erro ao verificar código');
    } finally {
      setIsLoading(false);
    }
  };

  const downloadBackupCodes = () => {
    const text = `ROMA - Códigos de Backup 2FA\nData: ${new Date().toLocaleDateString()}\n\n${backupCodes.join('\n')}`;
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'roma-backup-codes.txt';
    a.click();
    URL.revokeObjectURL(url);
  };

  const copyBackupCodes = () => {
    navigator.clipboard.writeText(backupCodes.join('\n'));
    alert('Códigos copiados!');
  };

  return (
    <div className="two-factor-modal">
      <div className="two-factor-content">
        {step === 'qr' && (
          <>
            <h2>Configurar Autenticação de Dois Fatores</h2>
            <p className="two-factor-subtitle">
              Escaneie o QR Code com seu aplicativo autenticador
            </p>

            <div className="two-factor-apps">
              <span>📱 Google Authenticator</span>
              <span>🔐 Microsoft Authenticator</span>
              <span>🛡️ Authy</span>
            </div>

            {qrCode ? (
              <div className="qr-container">
                <img src={qrCode} alt="QR Code 2FA" className="qr-image" />
                <div className="secret-key">
                  <p>Ou digite manualmente:</p>
                  <code>{secret}</code>
                </div>
              </div>
            ) : (
              <div className="loading-qr">
                <div className="spinner"></div>
                <p>Gerando QR Code...</p>
              </div>
            )}

            <div className="two-factor-buttons">
              <button onClick={onCancel} className="btn-cancel">
                Cancelar
              </button>
              <button
                onClick={() => setStep('verify')}
                className="btn-primary"
                disabled={!qrCode}
              >
                Avançar
              </button>
            </div>
          </>
        )}

        {step === 'verify' && (
          <>
            <h2>Verificar Código</h2>
            <p className="two-factor-subtitle">
              Digite o código de 6 dígitos do seu aplicativo
            </p>

            <div className="verification-input">
              <input
                type="text"
                inputMode="numeric"
                maxLength={6}
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, ''))}
                placeholder="000000"
                className="code-input"
                autoFocus
              />
            </div>

            {error && <div className="error-message">{error}</div>}

            <div className="two-factor-buttons">
              <button onClick={() => setStep('qr')} className="btn-cancel">
                Voltar
              </button>
              <button
                onClick={verifyCode}
                className="btn-primary"
                disabled={isLoading || verificationCode.length !== 6}
              >
                {isLoading ? 'Verificando...' : 'Verificar'}
              </button>
            </div>
          </>
        )}

        {step === 'backup' && (
          <>
            <h2>Códigos de Backup</h2>
            <p className="two-factor-subtitle">
              Salve estes códigos em local seguro. Cada código pode ser usado apenas uma vez.
            </p>

            <div className="backup-codes">
              {backupCodes.map((code, index) => (
                <div key={index} className="backup-code">
                  {code}
                </div>
              ))}
            </div>

            <div className="backup-actions">
              <button onClick={downloadBackupCodes} className="btn-download">
                📥 Baixar Códigos
              </button>
              <button onClick={copyBackupCodes} className="btn-copy">
                📋 Copiar
              </button>
            </div>

            <div className="two-factor-buttons">
              <button
                onClick={() => onComplete(backupCodes)}
                className="btn-primary"
              >
                Concluir
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
