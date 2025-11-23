const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');

const app = express();
const PORT = 3000;
const SECRET = 'roma-secret-key-2025';

// Middleware
app.use(cors());
app.use(express.json());

// "Banco de dados" em memória
const users = [
  {
    id: '1',
    nome: 'Admin ROMA',
    email: 'admin@roma.com',
    senha: 'Admin123!@#' // Em produção, use bcrypt!
  }
];

// Middleware de autenticação
const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader) {
    return res.status(401).json({ success: false, message: 'Token não fornecido' });
  }

  const token = authHeader.split(' ')[1];
  
  try {
    const decoded = jwt.verify(token, SECRET);
    req.userId = decoded.userId;
    next();
  } catch (error) {
    return res.status(401).json({ success: false, message: 'Token inválido ou expirado' });
  }
};

// ==================== ROTAS ====================

// POST /auth/login
app.post('/api/auth/login', (req, res) => {
  const { email, senha } = req.body;

  console.log('📥 Login attempt:', { email });

  const user = users.find(u => u.email === email && u.senha === senha);

  if (!user) {
    console.log('❌ Login failed: Invalid credentials');
    return res.status(401).json({
      success: false,
      message: 'Email ou senha inválidos',
      errorCode: 'INVALID_CREDENTIALS'
    });
  }

  const token = jwt.sign({ userId: user.id }, SECRET, { expiresIn: '15m' });

  console.log('✅ Login successful:', user.email);

  res.json({
    success: true,
    token,
    user: {
      id: user.id,
      nome: user.nome,
      email: user.email
    }
  });
});

// POST /auth/cadastro
app.post('/api/auth/cadastro', (req, res) => {
  const { nomeCompleto, email, senha, codigoPromocional } = req.body;

  console.log('📥 Cadastro attempt:', { email, codigoPromocional });

  // Verificar se email já existe
  if (users.find(u => u.email === email)) {
    console.log('❌ Cadastro failed: Email already exists');
    return res.status(400).json({
      success: false,
      message: 'Este email já está em uso',
      errorCode: 'EMAIL_ALREADY_EXISTS'
    });
  }

  // Criar novo usuário
  const newUser = {
    id: String(users.length + 1),
    nome: nomeCompleto,
    email,
    senha // Em produção, use bcrypt!
  };

  users.push(newUser);

  const token = jwt.sign({ userId: newUser.id }, SECRET, { expiresIn: '15m' });

  console.log('✅ Cadastro successful:', newUser.email);

  res.json({
    success: true,
    token,
    user: {
      id: newUser.id,
      nome: newUser.nome,
      email: newUser.email
    },
    message: 'Conta criada com sucesso!'
  });
});

// POST /auth/recuperar-senha
app.post('/api/auth/recuperar-senha', (req, res) => {
  const { email } = req.body;

  console.log('📥 Recuperar senha:', { email });

  const user = users.find(u => u.email === email);

  if (!user) {
    console.log('❌ Email não encontrado');
    return res.status(404).json({
      success: false,
      message: 'Email não encontrado',
      errorCode: 'EMAIL_NOT_FOUND'
    });
  }

  // Em produção, enviar email real
  console.log('✅ Link de recuperação enviado para:', email);
  console.log('🔗 Token de recuperação (mock):', jwt.sign({ userId: user.id }, SECRET, { expiresIn: '1h' }));

  res.json({
    success: true,
    message: 'Link de recuperação enviado para seu email'
  });
});

// POST /auth/refresh-token
app.post('/api/auth/refresh-token', authenticate, (req, res) => {
  console.log('🔄 Refresh token para userId:', req.userId);

  const user = users.find(u => u.id === req.userId);

  if (!user) {
    return res.status(404).json({
      success: false,
      message: 'Usuário não encontrado'
    });
  }

  const newToken = jwt.sign({ userId: user.id }, SECRET, { expiresIn: '15m' });

  console.log('✅ Token renovado com sucesso');

  res.json({
    success: true,
    token: newToken
  });
});

// POST /auth/redefinir-senha
app.post('/api/auth/redefinir-senha', (req, res) => {
  const { token, novaSenha } = req.body;

  console.log('📥 Redefinir senha');

  try {
    const decoded = jwt.verify(token, SECRET);
    const user = users.find(u => u.id === decoded.userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Usuário não encontrado'
      });
    }

    // Atualizar senha
    user.senha = novaSenha;

    console.log('✅ Senha redefinida com sucesso para:', user.email);

    res.json({
      success: true,
      message: 'Senha redefinida com sucesso'
    });
  } catch (error) {
    console.log('❌ Token inválido ou expirado');
    return res.status(401).json({
      success: false,
      message: 'Token inválido ou expirado'
    });
  }
});

// GET /auth/me - Obter dados do usuário autenticado
app.get('/api/auth/me', authenticate, (req, res) => {
  const user = users.find(u => u.id === req.userId);

  if (!user) {
    return res.status(404).json({
      success: false,
      message: 'Usuário não encontrado'
    });
  }

  res.json({
    success: true,
    user: {
      id: user.id,
      nome: user.nome,
      email: user.email
    }
  });
});

// PUT /auth/profile - Atualizar perfil
app.put('/api/auth/profile', authenticate, (req, res) => {
  const { nome, email } = req.body;
  const user = users.find(u => u.id === req.userId);

  if (!user) {
    return res.status(404).json({
      success: false,
      message: 'Usuário não encontrado'
    });
  }

  // Verificar se novo email já existe
  if (email !== user.email && users.find(u => u.email === email)) {
    return res.status(400).json({
      success: false,
      message: 'Este email já está em uso',
      errorCode: 'EMAIL_ALREADY_EXISTS'
    });
  }

  user.nome = nome || user.nome;
  user.email = email || user.email;

  console.log('✅ Perfil atualizado:', user.email);

  res.json({
    success: true,
    user: {
      id: user.id,
      nome: user.nome,
      email: user.email
    },
    message: 'Perfil atualizado com sucesso'
  });
});

// PUT /auth/change-password - Alterar senha
app.put('/api/auth/change-password', authenticate, (req, res) => {
  const { senhaAtual, novaSenha } = req.body;
  const user = users.find(u => u.id === req.userId);

  if (!user) {
    return res.status(404).json({
      success: false,
      message: 'Usuário não encontrado'
    });
  }

  if (user.senha !== senhaAtual) {
    return res.status(401).json({
      success: false,
      message: 'Senha atual incorreta',
      errorCode: 'INVALID_PASSWORD'
    });
  }

  user.senha = novaSenha;

  console.log('✅ Senha alterada para:', user.email);

  res.json({
    success: true,
    message: 'Senha alterada com sucesso'
  });
});

// ==================== INICIAR SERVIDOR ====================

app.listen(PORT, () => {
  console.log('');
  console.log('🚀 ============================================');
  console.log('🚀 Backend ROMA iniciado com sucesso!');
  console.log('🚀 ============================================');
  console.log('');
  console.log(`📡 Servidor rodando em: http://localhost:${PORT}`);
  console.log(`🔗 API Base URL: http://localhost:${PORT}/api`);
  console.log('');
  console.log('👥 Usuários de teste:');
  console.log('   Email: admin@roma.com');
  console.log('   Senha: Admin123!@#');
  console.log('');
  console.log('📋 Endpoints disponíveis:');
  console.log('   POST /api/auth/login');
  console.log('   POST /api/auth/cadastro');
  console.log('   POST /api/auth/recuperar-senha');
  console.log('   POST /api/auth/redefinir-senha');
  console.log('   POST /api/auth/refresh-token');
  console.log('   GET  /api/auth/me');
  console.log('   PUT  /api/auth/profile');
  console.log('   PUT  /api/auth/change-password');
  console.log('');
  console.log('💡 Configure o frontend:');
  console.log('   VITE_API_URL=http://localhost:3000/api');
  console.log('');
  console.log('✅ Pronto para receber requisições!');
  console.log('============================================');
  console.log('');
});

// Tratamento de erros
app.use((err, req, res, next) => {
  console.error('❌ Erro no servidor:', err);
  res.status(500).json({
    success: false,
    message: 'Erro interno do servidor'
  });
});
