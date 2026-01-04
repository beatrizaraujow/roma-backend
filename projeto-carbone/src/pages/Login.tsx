import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../utils/authService';

export default function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    senha: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      console.log('🔄 Tentando login com:', formData.email);
      const response = await authService.login(formData.email, formData.senha);
      console.log('📥 Resposta recebida:', response);
      
      if (response.success && response.token) {
        // Salvar token no localStorage
        localStorage.setItem('token', response.token);
        localStorage.setItem('user', JSON.stringify(response.user));
        console.log('✅ Login bem-sucedido, redirecionando...');
        
        // Redirecionar para dashboard
        navigate('/dashboard');
      } else {
        console.log('❌ Login falhou:', response.message);
        setError(response.message || 'Email ou senha inválidos');
      }
    } catch (err: any) {
      console.error('❌ Erro na requisição:', err);
      const errorMessage = err?.message || 'Erro ao conectar com o servidor. Verifique se o backend está rodando em http://localhost:3000';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>
      {/* Lado Esquerdo - Imagem */}
      <div style={{ 
        width: '46%', 
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 0
      }}>
        <img
          src="/imagem.png"
          alt="Classroom"
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
      </div>

      {/* Lado Direito - Formulário */}
      <div style={{ 
        width: '54%', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        padding: '20px',
        backgroundColor: 'white',
        overflow: 'auto'
      }}>
        <div style={{ width: '100%', maxWidth: '480px' }}>
          {/* Logo e Título */}
          <div style={{ textAlign: 'center', marginBottom: '28px' }}>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '16px' }}>
              <img
                src="/logo.png"
                alt="ROMA Fab&Elo"
                style={{ height: '110px', display: 'block' }}
              />
            </div>
            <h1 style={{ fontSize: '32px', fontWeight: '300', letterSpacing: '0.05em', color: '#2C3E50', marginBottom: '6px' }}>
              BEM-VINDO<span style={{ fontSize: '12px', verticalAlign: 'super' }}>(A)</span>
            </h1>
            <p style={{ color: '#9ca3af', fontSize: '13px' }}>
              Use suas credenciais para acessar
            </p>
          </div>

          {/* Formulário */}
          <form onSubmit={handleSubmit}>
            {/* Alerta de Backend */}
            <div style={{ 
              padding: '10px', 
              marginBottom: '16px', 
              backgroundColor: '#dcfce7', 
              color: '#166534', 
              borderRadius: '8px',
              fontSize: '12px',
              textAlign: 'center',
              border: '1px solid #86efac'
            }}>
              ✅ Backend configurado! Execute em terminal separado: <code style={{backgroundColor: '#fff', padding: '2px 6px', borderRadius: '4px', fontWeight: 'bold'}}>npm run server</code>
            </div>

            {error && (
              <div style={{ 
                padding: '10px', 
                marginBottom: '16px', 
                backgroundColor: '#fee2e2', 
                color: '#dc2626', 
                borderRadius: '8px',
                fontSize: '13px',
                textAlign: 'center'
              }}>
                {error}
              </div>
            )}

            {/* Campo Email */}
            <div style={{ marginBottom: '16px' }}>
              <label htmlFor="email" className="label-text">
                Usuário
              </label>
              <input
                id="email"
                type="email"
                placeholder="Seu usuário"
                className="input-field"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
                disabled={loading}
              />
            </div>

            {/* Campo Senha */}
            <div style={{ marginBottom: '18px' }}>
              <label htmlFor="senha" className="label-text">
                Senha
              </label>
              <input
                id="senha"
                type="password"
                placeholder="Digite sua senha"
                className="input-field"
                value={formData.senha}
                onChange={(e) => setFormData({ ...formData, senha: e.target.value })}
                required
                disabled={loading}
              />
            </div>

            {/* Botão Entrar */}
            <button 
              type="submit" 
              className="btn-primary"
              disabled={loading}
            >
              {loading ? 'Entrando...' : 'Entrar'}
            </button>

            {/* Links */}
            <div style={{ textAlign: 'center', marginTop: '16px' }}>
              <p style={{ fontSize: '13px', color: '#6b7280' }}>
                <a
                  href="/recuperar-senha"
                  style={{ color: '#2C3E50', textDecoration: 'underline', fontWeight: '400' }}
                >
                  Esqueceu sua senha?
                </a>
                {' '}
                <span style={{ fontWeight: '600', color: '#000' }}>Recuperar sua senha</span>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
