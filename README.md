# Backend ROMA - Documentação Completa

## 📋 Índice
- [Sobre o Projeto](#sobre-o-projeto)
- [Tecnologias Utilizadas](#tecnologias-utilizadas)
- [Estrutura do Projeto](#estrutura-do-projeto)
- [Instalação e Configuração](#instalação-e-configuração)
- [Banco de Dados](#banco-de-dados)
- [Endpoints da API](#endpoints-da-api)
- [Autenticação e Segurança](#autenticação-e-segurança)
- [Upload de Arquivos](#upload-de-arquivos)
- [Logs e Monitoramento](#logs-e-monitoramento)

---

## 🎯 Sobre o Projeto

Backend completo para o sistema ROMA, desenvolvido em Node.js com Express. O projeto possui duas implementações:

1. **server.js** - Versão simples com dados em memória (desenvolvimento/testes)
2. **server-prisma.js** - Versão completa com PostgreSQL + Prisma ORM (produção)

---

## 🚀 Tecnologias Utilizadas

### Core
- **Node.js** - Runtime JavaScript
- **Express.js** - Framework web minimalista
- **PostgreSQL** - Banco de dados relacional
- **Prisma ORM** - Object-Relational Mapping

### Segurança
- **JWT (jsonwebtoken)** - Autenticação via tokens
- **bcrypt** - Hash de senhas
- **crypto** - Geração de tokens seguros

### Upload e Armazenamento
- **Multer** - Upload de arquivos (avatares)
- **fs** - Sistema de arquivos

### 2FA (Two-Factor Authentication)
- **speakeasy** - Geração de códigos TOTP
- **qrcode** - Geração de QR Codes

### Desenvolvimento
- **nodemon** - Auto-reload em desenvolvimento
- **cors** - Cross-Origin Resource Sharing

---

## 📁 Estrutura do Projeto

```
PROJETO CARBONE/
├── server.js                 # Servidor simples (em memória)
├── server-prisma.js          # Servidor com banco de dados
├── upload-config.js          # Configuração de upload de avatares
├── package.json              # Dependências do projeto
│
├── prisma/
│   └── schema.prisma        # Schema do banco de dados
│
├── uploads/                 # Diretório de uploads
│   └── avatars/            # Avatares dos usuários
│
└── projeto-carbone/        # Frontend (React + Vite)
```

---

## ⚙️ Instalação e Configuração

### 1. Pré-requisitos
```bash
Node.js >= 18.x
PostgreSQL >= 14.x
npm ou yarn
```

### 2. Instalar Dependências
```bash
npm install
```

### 3. Configurar Variáveis de Ambiente
Crie um arquivo `.env` na raiz do projeto:

```env
# Banco de Dados
DATABASE_URL="postgresql://usuario:senha@localhost:5432/roma_db"

# JWT
JWT_SECRET="sua-chave-secreta-super-segura-aqui"
REFRESH_SECRET="sua-chave-refresh-super-segura-aqui"

# Servidor
PORT=3000
NODE_ENV=development
```

### 4. Configurar Banco de Dados
```bash
# Gerar Prisma Client
npx prisma generate

# Executar migrations
npx prisma migrate dev

# (Opcional) Abrir Prisma Studio
npx prisma studio
```

### 5. Iniciar o Servidor

**Servidor Simples (em memória):**
```bash
npm start
# ou
npm run dev
```

**Servidor com Prisma (produção):**
```bash
npm run start:prisma
# ou
npm run dev:prisma
```

---

## 🗄️ Banco de Dados

### Schema Prisma

#### Modelo User
```prisma
model User {
  id               String         @id @default(uuid())
  nome             String
  email            String         @unique
  senha            String
  telefone         String?
  empresa          String?
  cargo            String?
  fotoPerfil       String?
  
  // Configurações
  notificacoes     Boolean        @default(true)
  autenticacao2FA  Boolean        @default(false)
  modoEscuro       Boolean        @default(false)
  
  // Tokens de recuperação
  resetToken       String?
  resetTokenExpiry DateTime?
  
  // Relações
  refreshTokens    RefreshToken[]
  activities       Activity[]
  
  createdAt        DateTime       @default(now())
  updatedAt        DateTime       @updatedAt
}
```

#### Modelo RefreshToken
```prisma
model RefreshToken {
  id        String   @id @default(uuid())
  token     String   @unique
  userId    String
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  expiresAt DateTime
  createdAt DateTime @default(now())
}
```

#### Modelo Activity
```prisma
model Activity {
  id          String   @id @default(uuid())
  userId      String
  user        User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  action      String
  description String?
  ipAddress   String?
  userAgent   String?
  createdAt   DateTime @default(now())
}
```

---

## 🔌 Endpoints da API

### Base URL
```
http://localhost:3000/api
```

---

### 🔐 Autenticação

#### 1. Login
**POST** `/api/auth/login`

**Request Body:**
```json
{
  "email": "usuario@email.com",
  "senha": "senha123",
  "lembrar": false
}
```

**Response (200):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "uuid",
    "nome": "Nome do Usuário",
    "email": "usuario@email.com",
    "telefone": null,
    "empresa": null,
    "cargo": null,
    "fotoPerfil": null,
    "notificacoes": true,
    "autenticacao2FA": false,
    "modoEscuro": false,
    "createdAt": "2025-01-01T00:00:00.000Z",
    "updatedAt": "2025-01-01T00:00:00.000Z"
  }
}
```

**Errors:**
- `400` - Email e senha obrigatórios
- `401` - Credenciais inválidas
- `500` - Erro interno

---

#### 2. Cadastro
**POST** `/api/auth/cadastro`

**Request Body:**
```json
{
  "nome": "Nome Completo",
  "email": "novo@email.com",
  "senha": "Senha@123",
  "telefone": "(11) 99999-9999",
  "empresa": "Empresa LTDA",
  "cargo": "Desenvolvedor"
}
```

**Response (201):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "uuid",
    "nome": "Nome Completo",
    "email": "novo@email.com",
    ...
  }
}
```

**Errors:**
- `400` - Campos obrigatórios faltando
- `400` - Email já cadastrado
- `500` - Erro interno

---

#### 3. Recuperar Senha
**POST** `/api/auth/recuperar-senha`

**Request Body:**
```json
{
  "email": "usuario@email.com"
}
```

**Response (200):**
```json
{
  "message": "Se o email existir, um link de recuperação será enviado",
  "_dev": {
    "resetToken": "a1b2c3d4e5f6..."
  }
}
```

---

#### 4. Redefinir Senha
**POST** `/api/auth/redefinir-senha`

**Request Body:**
```json
{
  "token": "a1b2c3d4e5f6...",
  "novaSenha": "NovaSenha@123"
}
```

**Response (200):**
```json
{
  "message": "Senha redefinida com sucesso"
}
```

**Errors:**
- `400` - Token e nova senha obrigatórios
- `400` - Token inválido ou expirado
- `500` - Erro interno

---

#### 5. Refresh Token
**POST** `/api/auth/refresh-token`

**Request Body:**
```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIs..."
}
```

**Response (200):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIs..."
}
```

**Errors:**
- `401` - Refresh token não fornecido
- `403` - Refresh token inválido ou expirado
- `500` - Erro interno

---

#### 6. Obter Dados do Usuário
**GET** `/api/auth/me`

**Headers:**
```
Authorization: Bearer {token}
```

**Response (200):**
```json
{
  "id": "uuid",
  "nome": "Nome do Usuário",
  "email": "usuario@email.com",
  "telefone": "(11) 99999-9999",
  "empresa": "Empresa LTDA",
  "cargo": "Desenvolvedor",
  "fotoPerfil": "/uploads/avatars/foto.jpg",
  "notificacoes": true,
  "autenticacao2FA": false,
  "modoEscuro": false,
  "createdAt": "2025-01-01T00:00:00.000Z",
  "updatedAt": "2025-01-01T00:00:00.000Z"
}
```

**Errors:**
- `401` - Token não fornecido
- `403` - Token inválido
- `404` - Usuário não encontrado
- `500` - Erro interno

---

#### 7. Atualizar Perfil
**PUT** `/api/auth/profile`

**Headers:**
```
Authorization: Bearer {token}
```

**Request Body:**
```json
{
  "nome": "Novo Nome",
  "telefone": "(11) 88888-8888",
  "empresa": "Nova Empresa",
  "cargo": "Novo Cargo"
}
```

**Response (200):**
```json
{
  "id": "uuid",
  "nome": "Novo Nome",
  "email": "usuario@email.com",
  ...
}
```

**Errors:**
- `401` - Não autenticado
- `403` - Token inválido
- `500` - Erro interno

---

#### 8. Alterar Senha
**PUT** `/api/auth/change-password`

**Headers:**
```
Authorization: Bearer {token}
```

**Request Body:**
```json
{
  "senhaAtual": "SenhaAntiga@123",
  "novaSenha": "NovaSenha@456"
}
```

**Response (200):**
```json
{
  "message": "Senha alterada com sucesso"
}
```

**Errors:**
- `400` - Campos obrigatórios faltando
- `400` - Senha atual incorreta
- `401` - Não autenticado
- `403` - Token inválido
- `500` - Erro interno

---

#### 9. Atualizar Configurações
**PUT** `/api/auth/settings`

**Headers:**
```
Authorization: Bearer {token}
```

**Request Body:**
```json
{
  "notificacoes": false,
  "autenticacao2FA": true,
  "modoEscuro": true
}
```

**Response (200):**
```json
{
  "id": "uuid",
  "nome": "Nome do Usuário",
  "email": "usuario@email.com",
  "notificacoes": false,
  "autenticacao2FA": true,
  "modoEscuro": true,
  ...
}
```

---

#### 10. Histórico de Atividades
**GET** `/api/auth/activities?page=1&limit=10`

**Headers:**
```
Authorization: Bearer {token}
```

**Response (200):**
```json
{
  "activities": [
    {
      "id": "uuid",
      "userId": "uuid",
      "action": "LOGIN",
      "description": "Login realizado com sucesso",
      "ipAddress": "192.168.1.1",
      "userAgent": "Mozilla/5.0...",
      "createdAt": "2025-01-01T10:30:00.000Z"
    },
    ...
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 45,
    "pages": 5
  }
}
```

---

#### 11. Logout
**POST** `/api/auth/logout`

**Headers:**
```
Authorization: Bearer {token}
```

**Request Body:**
```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIs..."
}
```

**Response (200):**
```json
{
  "message": "Logout realizado com sucesso"
}
```

---

## 🔒 Autenticação e Segurança

### JWT (JSON Web Tokens)

#### Access Token
- **Duração:** 15 minutos
- **Uso:** Autenticação em requisições
- **Header:** `Authorization: Bearer {token}`

#### Refresh Token
- **Duração:** 7 dias (padrão) ou 30 dias ("lembrar-me")
- **Uso:** Renovar access token expirado
- **Armazenamento:** Banco de dados + localStorage

### Hash de Senhas
- **Algoritmo:** bcrypt
- **Salt Rounds:** 10
- **Nunca retornado:** Senhas são omitidas em respostas

### Tokens de Recuperação
- **Algoritmo:** crypto.randomBytes(32)
- **Validade:** 1 hora
- **Uso único:** Token é invalidado após uso

---

## 📤 Upload de Arquivos

### Configuração (upload-config.js)

#### Diretório
```
/uploads/avatars/
```

#### Tipos Permitidos
- `image/jpeg`
- `image/jpg`
- `image/png`
- `image/webp`

#### Tamanho Máximo
- **5MB** por arquivo

#### Nomenclatura
```
{userId}_{timestamp}-{random}.{ext}
Exemplo: uuid_1234567890-987654321.jpg
```

#### Funcionalidades
- ✅ Validação de tipo de arquivo
- ✅ Limite de tamanho
- ✅ Nome único por usuário
- ✅ Deleção de avatar antigo
- ✅ Criação automática de diretórios

---

## 📊 Logs e Monitoramento

### Atividades Registradas

#### Eventos Logados
- `LOGIN` - Login realizado
- `CADASTRO` - Nova conta criada
- `RECUPERAR_SENHA` - Solicitação de recuperação
- `REDEFINIR_SENHA` - Senha redefinida
- `ATUALIZAR_PERFIL` - Perfil atualizado
- `TROCAR_SENHA` - Senha alterada
- `ATUALIZAR_CONFIGURACOES` - Configurações alteradas
- `LOGOUT` - Logout realizado

#### Dados Capturados
- **userId** - ID do usuário
- **action** - Tipo de ação
- **description** - Descrição da ação
- **ipAddress** - IP de origem
- **userAgent** - Browser/Device
- **createdAt** - Data/hora

### Logs do Console

```javascript
// Login
📥 Login attempt: { email }
✅ Login bem-sucedido: email
❌ Login failed: Invalid credentials

// Cadastro
📥 Requisição de cadastro recebida: { email }
✅ Cadastro realizado: email
❌ Email já cadastrado: email

// Recuperação
📥 Requisição de recuperação de senha: email
✅ Token de recuperação gerado: email
🔑 Token: resetToken

// Token Refresh
🔄 Refresh token para userId: id
✅ Token renovado: email
```

---

## 🛠️ Scripts Disponíveis

```json
{
  "start": "node server.js",
  "start:prisma": "node server-prisma.js",
  "dev": "nodemon server.js",
  "dev:prisma": "nodemon server-prisma.js"
}
```

### Comandos do Prisma

```bash
# Gerar Prisma Client
npx prisma generate

# Criar migration
npx prisma migrate dev --name nome_da_migration

# Aplicar migrations em produção
npx prisma migrate deploy

# Resetar banco de dados (desenvolvimento)
npx prisma migrate reset

# Abrir Prisma Studio (GUI)
npx prisma studio

# Formatar schema
npx prisma format

# Validar schema
npx prisma validate
```

---

## 🎯 Usuário de Teste (server.js)

Para testes rápidos com o servidor em memória:

```
Email: admin@roma.com
Senha: Admin123!@#
```

---

## 🚨 Tratamento de Erros

### Estrutura de Erro Padrão
```json
{
  "error": "Mensagem de erro descritiva"
}
```

### Códigos HTTP
- `200` - Sucesso
- `201` - Criado com sucesso
- `400` - Requisição inválida
- `401` - Não autenticado
- `403` - Não autorizado/Token inválido
- `404` - Recurso não encontrado
- `500` - Erro interno do servidor

---

## 📝 Notas de Desenvolvimento

### Middleware de Autenticação
```javascript
// server.js
const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader?.split(' ')[1];
  
  jwt.verify(token, SECRET, (err, decoded) => {
    if (err) return res.status(401).json({ error: 'Token inválido' });
    req.userId = decoded.userId;
    next();
  });
};

// server-prisma.js
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader?.split(' ')[1];
  
  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: 'Token inválido' });
    req.user = user;
    next();
  });
};
```

### Função de Log de Atividades
```javascript
async function logActivity(userId, action, description, req) {
  await prisma.activity.create({
    data: {
      userId,
      action,
      description,
      ipAddress: req.ip || req.connection.remoteAddress,
      userAgent: req.headers['user-agent']
    }
  });
}
```

---

## 🔮 Próximas Implementações

### Planejado
- [ ] Upload de avatar (endpoint + integração)
- [ ] Autenticação 2FA (setup + verificação)
- [ ] Envio de emails real (recuperação de senha)
- [ ] Rate limiting (prevenção de spam)
- [ ] Validação de entrada com Zod/Joi
- [ ] Testes automatizados (Jest/Supertest)
- [ ] Documentação Swagger/OpenAPI
- [ ] WebSockets para notificações em tempo real
- [ ] Logs estruturados (Winston/Pino)
- [ ] Health check endpoint

### Melhorias de Segurança
- [ ] HTTPS obrigatório em produção
- [ ] Helmet.js para headers de segurança
- [ ] CSRF protection
- [ ] XSS protection
- [ ] SQL injection protection (Prisma já protege)
- [ ] Auditoria de segurança

---

## 📞 Suporte

Para dúvidas ou problemas:
1. Verifique os logs do console
2. Consulte a documentação do Prisma
3. Revise as configurações do `.env`

---

## 📄 Licença

Este projeto é parte do sistema ROMA.

---

**Última atualização:** 22 de Novembro de 2025
