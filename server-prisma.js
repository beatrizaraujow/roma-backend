import express from 'express';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { PrismaClient } from '@prisma/client';
import crypto from 'crypto';

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET || 'sua-chave-secreta-super-segura-aqui';
const REFRESH_SECRET = process.env.REFRESH_SECRET || 'sua-chave-refresh-super-segura-aqui';

// Middlewares
app.use(cors());
app.use(express.json());

// Middleware de autenticação
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Token não fornecido' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Token inválido ou expirado' });
    }
    req.user = user;
    next();
  });
};

// Função para registrar atividade
async function logActivity(userId, action, description, req) {
  try {
    await prisma.activity.create({
      data: {
        userId,
        action,
        description,
        ipAddress: req.ip || req.connection.remoteAddress,
        userAgent: req.headers['user-agent']
      }
    });
  } catch (error) {
    console.error('Erro ao registrar atividade:', error);
  }
}

// ========== ROTAS DE AUTENTICAÇÃO ==========

// 1. Login
app.post('/api/auth/login', async (req, res) => {
  try {
    console.log('📥 Requisição de login recebida:', { email: req.body.email });
    
    const { email, senha, lembrar } = req.body;

    if (!email || !senha) {
      return res.status(400).json({ error: 'Email e senha são obrigatórios' });
    }

    // Buscar usuário
    const user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user) {
      console.log('❌ Usuário não encontrado:', email);
      return res.status(401).json({ error: 'Credenciais inválidas' });
    }

    // Verificar senha
    const senhaValida = await bcrypt.compare(senha, user.senha);
    
    if (!senhaValida) {
      console.log('❌ Senha inválida para:', email);
      return res.status(401).json({ error: 'Credenciais inválidas' });
    }

    // Gerar tokens
    const accessToken = jwt.sign(
      { id: user.id, email: user.email },
      JWT_SECRET,
      { expiresIn: '15m' }
    );

    const refreshToken = jwt.sign(
      { id: user.id, email: user.email },
      REFRESH_SECRET,
      { expiresIn: lembrar ? '30d' : '7d' }
    );

    // Salvar refresh token no banco
    await prisma.refreshToken.create({
      data: {
        token: refreshToken,
        userId: user.id,
        expiresAt: new Date(Date.now() + (lembrar ? 30 : 7) * 24 * 60 * 60 * 1000)
      }
    });

    // Registrar atividade
    await logActivity(user.id, 'LOGIN', 'Login realizado com sucesso', req);

    console.log('✅ Login bem-sucedido:', email);

    // Retornar dados do usuário (sem senha)
    const { senha: _, ...userData } = user;

    res.json({
      token: accessToken,
      refreshToken,
      user: userData
    });
  } catch (error) {
    console.error('❌ Erro no login:', error);
    res.status(500).json({ error: 'Erro ao fazer login' });
  }
});

// 2. Cadastro
app.post('/api/auth/cadastro', async (req, res) => {
  try {
    console.log('📥 Requisição de cadastro recebida:', { email: req.body.email });
    
    const { nome, email, senha, telefone, empresa, cargo } = req.body;

    // Validações
    if (!nome || !email || !senha) {
      return res.status(400).json({ error: 'Nome, email e senha são obrigatórios' });
    }

    // Verificar se email já existe
    const userExiste = await prisma.user.findUnique({
      where: { email }
    });

    if (userExiste) {
      console.log('❌ Email já cadastrado:', email);
      return res.status(400).json({ error: 'Este email já está cadastrado' });
    }

    // Hash da senha
    const senhaHash = await bcrypt.hash(senha, 10);

    // Criar usuário
    const novoUser = await prisma.user.create({
      data: {
        nome,
        email,
        senha: senhaHash,
        telefone,
        empresa,
        cargo
      }
    });

    // Registrar atividade
    await logActivity(novoUser.id, 'CADASTRO', 'Nova conta criada', req);

    console.log('✅ Cadastro realizado:', email);

    // Gerar tokens
    const accessToken = jwt.sign(
      { id: novoUser.id, email: novoUser.email },
      JWT_SECRET,
      { expiresIn: '15m' }
    );

    const refreshToken = jwt.sign(
      { id: novoUser.id, email: novoUser.email },
      REFRESH_SECRET,
      { expiresIn: '7d' }
    );

    // Salvar refresh token
    await prisma.refreshToken.create({
      data: {
        token: refreshToken,
        userId: novoUser.id,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
      }
    });

    const { senha: _, ...userData } = novoUser;

    res.status(201).json({
      token: accessToken,
      refreshToken,
      user: userData
    });
  } catch (error) {
    console.error('❌ Erro no cadastro:', error);
    res.status(500).json({ error: 'Erro ao criar conta' });
  }
});

// 3. Recuperar senha
app.post('/api/auth/recuperar-senha', async (req, res) => {
  try {
    console.log('📥 Requisição de recuperação de senha:', req.body.email);
    
    const { email } = req.body;

    const user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user) {
      // Por segurança, não revelar se o email existe
      return res.json({ message: 'Se o email existir, um link de recuperação será enviado' });
    }

    // Gerar token de recuperação
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenExpiry = new Date(Date.now() + 3600000); // 1 hora

    await prisma.user.update({
      where: { id: user.id },
      data: {
        resetToken,
        resetTokenExpiry
      }
    });

    // Registrar atividade
    await logActivity(user.id, 'RECUPERAR_SENHA', 'Solicitação de recuperação de senha', req);

    console.log('✅ Token de recuperação gerado:', email);
    console.log('🔑 Token:', resetToken);

    // TODO: Enviar email real
    // await sendEmail(email, resetToken);

    res.json({ 
      message: 'Se o email existir, um link de recuperação será enviado',
      // Apenas para desenvolvimento:
      _dev: { resetToken }
    });
  } catch (error) {
    console.error('❌ Erro ao recuperar senha:', error);
    res.status(500).json({ error: 'Erro ao processar recuperação de senha' });
  }
});

// 4. Redefinir senha
app.post('/api/auth/redefinir-senha', async (req, res) => {
  try {
    console.log('📥 Requisição de redefinição de senha');
    
    const { token, novaSenha } = req.body;

    if (!token || !novaSenha) {
      return res.status(400).json({ error: 'Token e nova senha são obrigatórios' });
    }

    // Buscar usuário pelo token
    const user = await prisma.user.findFirst({
      where: {
        resetToken: token,
        resetTokenExpiry: {
          gt: new Date()
        }
      }
    });

    if (!user) {
      console.log('❌ Token inválido ou expirado');
      return res.status(400).json({ error: 'Token inválido ou expirado' });
    }

    // Hash da nova senha
    const senhaHash = await bcrypt.hash(novaSenha, 10);

    // Atualizar senha e limpar token
    await prisma.user.update({
      where: { id: user.id },
      data: {
        senha: senhaHash,
        resetToken: null,
        resetTokenExpiry: null
      }
    });

    // Registrar atividade
    await logActivity(user.id, 'REDEFINIR_SENHA', 'Senha redefinida com sucesso', req);

    console.log('✅ Senha redefinida:', user.email);

    res.json({ message: 'Senha redefinida com sucesso' });
  } catch (error) {
    console.error('❌ Erro ao redefinir senha:', error);
    res.status(500).json({ error: 'Erro ao redefinir senha' });
  }
});

// 5. Refresh token
app.post('/api/auth/refresh-token', async (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(401).json({ error: 'Refresh token não fornecido' });
    }

    // Verificar se o token existe no banco
    const storedToken = await prisma.refreshToken.findUnique({
      where: { token: refreshToken },
      include: { user: true }
    });

    if (!storedToken || storedToken.expiresAt < new Date()) {
      return res.status(403).json({ error: 'Refresh token inválido ou expirado' });
    }

    // Verificar assinatura do token
    jwt.verify(refreshToken, REFRESH_SECRET, async (err, decoded) => {
      if (err) {
        return res.status(403).json({ error: 'Refresh token inválido' });
      }

      // Gerar novo access token
      const newAccessToken = jwt.sign(
        { id: decoded.id, email: decoded.email },
        JWT_SECRET,
        { expiresIn: '15m' }
      );

      console.log('✅ Token renovado:', decoded.email);

      res.json({ token: newAccessToken });
    });
  } catch (error) {
    console.error('❌ Erro ao renovar token:', error);
    res.status(500).json({ error: 'Erro ao renovar token' });
  }
});

// 6. Obter dados do usuário
app.get('/api/auth/me', authenticateToken, async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: {
        id: true,
        nome: true,
        email: true,
        telefone: true,
        empresa: true,
        cargo: true,
        fotoPerfil: true,
        notificacoes: true,
        autenticacao2FA: true,
        modoEscuro: true,
        createdAt: true,
        updatedAt: true
      }
    });

    if (!user) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }

    res.json(user);
  } catch (error) {
    console.error('❌ Erro ao buscar usuário:', error);
    res.status(500).json({ error: 'Erro ao buscar dados do usuário' });
  }
});

// 7. Atualizar perfil
app.put('/api/auth/profile', authenticateToken, async (req, res) => {
  try {
    console.log('📥 Atualização de perfil:', req.user.email);
    
    const { nome, telefone, empresa, cargo } = req.body;

    const userAtualizado = await prisma.user.update({
      where: { id: req.user.id },
      data: { nome, telefone, empresa, cargo },
      select: {
        id: true,
        nome: true,
        email: true,
        telefone: true,
        empresa: true,
        cargo: true,
        fotoPerfil: true,
        notificacoes: true,
        autenticacao2FA: true,
        modoEscuro: true,
        createdAt: true,
        updatedAt: true
      }
    });

    // Registrar atividade
    await logActivity(req.user.id, 'ATUALIZAR_PERFIL', 'Perfil atualizado', req);

    console.log('✅ Perfil atualizado:', req.user.email);

    res.json(userAtualizado);
  } catch (error) {
    console.error('❌ Erro ao atualizar perfil:', error);
    res.status(500).json({ error: 'Erro ao atualizar perfil' });
  }
});

// 8. Trocar senha
app.put('/api/auth/change-password', authenticateToken, async (req, res) => {
  try {
    console.log('📥 Troca de senha:', req.user.email);
    
    const { senhaAtual, novaSenha } = req.body;

    if (!senhaAtual || !novaSenha) {
      return res.status(400).json({ error: 'Senha atual e nova senha são obrigatórias' });
    }

    // Buscar usuário
    const user = await prisma.user.findUnique({
      where: { id: req.user.id }
    });

    // Verificar senha atual
    const senhaValida = await bcrypt.compare(senhaAtual, user.senha);
    
    if (!senhaValida) {
      return res.status(400).json({ error: 'Senha atual incorreta' });
    }

    // Hash da nova senha
    const senhaHash = await bcrypt.hash(novaSenha, 10);

    // Atualizar senha
    await prisma.user.update({
      where: { id: req.user.id },
      data: { senha: senhaHash }
    });

    // Registrar atividade
    await logActivity(req.user.id, 'TROCAR_SENHA', 'Senha alterada', req);

    console.log('✅ Senha alterada:', req.user.email);

    res.json({ message: 'Senha alterada com sucesso' });
  } catch (error) {
    console.error('❌ Erro ao trocar senha:', error);
    res.status(500).json({ error: 'Erro ao trocar senha' });
  }
});

// 9. Atualizar configurações
app.put('/api/auth/settings', authenticateToken, async (req, res) => {
  try {
    console.log('📥 Atualização de configurações:', req.user.email);
    
    const { notificacoes, autenticacao2FA, modoEscuro } = req.body;

    const userAtualizado = await prisma.user.update({
      where: { id: req.user.id },
      data: {
        notificacoes,
        autenticacao2FA,
        modoEscuro
      },
      select: {
        id: true,
        nome: true,
        email: true,
        telefone: true,
        empresa: true,
        cargo: true,
        fotoPerfil: true,
        notificacoes: true,
        autenticacao2FA: true,
        modoEscuro: true,
        createdAt: true,
        updatedAt: true
      }
    });

    // Registrar atividade
    await logActivity(req.user.id, 'ATUALIZAR_CONFIGURACOES', 'Configurações atualizadas', req);

    console.log('✅ Configurações atualizadas:', req.user.email);

    res.json(userAtualizado);
  } catch (error) {
    console.error('❌ Erro ao atualizar configurações:', error);
    res.status(500).json({ error: 'Erro ao atualizar configurações' });
  }
});

// 10. Buscar histórico de atividades
app.get('/api/auth/activities', authenticateToken, async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;

    const activities = await prisma.activity.findMany({
      where: { userId: req.user.id },
      orderBy: { createdAt: 'desc' },
      skip: parseInt(skip),
      take: parseInt(limit)
    });

    const total = await prisma.activity.count({
      where: { userId: req.user.id }
    });

    res.json({
      activities,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('❌ Erro ao buscar atividades:', error);
    res.status(500).json({ error: 'Erro ao buscar histórico' });
  }
});

// 11. Logout (invalidar refresh token)
app.post('/api/auth/logout', authenticateToken, async (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (refreshToken) {
      await prisma.refreshToken.deleteMany({
        where: { token: refreshToken }
      });
    }

    // Registrar atividade
    await logActivity(req.user.id, 'LOGOUT', 'Logout realizado', req);

    console.log('✅ Logout:', req.user.email);

    res.json({ message: 'Logout realizado com sucesso' });
  } catch (error) {
    console.error('❌ Erro no logout:', error);
    res.status(500).json({ error: 'Erro ao fazer logout' });
  }
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log('\n🚀 ========================================');
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
  console.log('🚀 ========================================\n');
  console.log('📋 Endpoints disponíveis:');
  console.log('   POST   /api/auth/login');
  console.log('   POST   /api/auth/cadastro');
  console.log('   POST   /api/auth/recuperar-senha');
  console.log('   POST   /api/auth/redefinir-senha');
  console.log('   POST   /api/auth/refresh-token');
  console.log('   GET    /api/auth/me');
  console.log('   PUT    /api/auth/profile');
  console.log('   PUT    /api/auth/change-password');
  console.log('   PUT    /api/auth/settings');
  console.log('   GET    /api/auth/activities');
  console.log('   POST   /api/auth/logout');
  console.log('\n🗄️  Banco de dados: PostgreSQL + Prisma');
  console.log('🔐 Autenticação: JWT + Refresh Token');
  console.log('📊 Logs: Histórico de atividades\n');
});

// Tratamento de erros não capturados
process.on('unhandledRejection', (err) => {
  console.error('❌ Erro não tratado:', err);
});
