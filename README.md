# 🎓 Sistema ROMA - Plataforma Educacional Completa

<div align="center">

![Node.js](https://img.shields.io/badge/Node.js-18+-green?style=flat-square&logo=node.js)
![React](https://img.shields.io/badge/React-19.2-blue?style=flat-square&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue?style=flat-square&logo=typescript)
![Express](https://img.shields.io/badge/Express-4.21-black?style=flat-square&logo=express)
![Prisma](https://img.shields.io/badge/Prisma-5.22-blueviolet?style=flat-square&logo=prisma)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-14+-blue?style=flat-square&logo=postgresql)
![License](https://img.shields.io/badge/license-MIT-green?style=flat-square)

**Sistema completo de gestão educacional com autenticação avançada, pagamentos integrados e PWA**

[Demo](#) · [Documentação](#-documentação) · [Instalação](#-instalação-rápida) · [API](#-api-endpoints)

</div>

---

## 📋 Índice
- [Sobre o Projeto](#-sobre-o-projeto)
- [Funcionalidades](#-funcionalidades)
- [Tecnologias](#-tecnologias)
- [Instalação Rápida](#-instalação-rápida)
- [Estrutura do Projeto](#-estrutura-do-projeto)
- [Documentação](#-documentação)
- [API Endpoints](#-api-endpoints)
- [Segurança](#-segurança)
- [Deploy](#-deploy)
- [Contribuindo](#-contribuindo)
- [Licença](#-licença)

---

## 🎯 Sobre o Projeto

**ROMA** é uma plataforma educacional full-stack moderna que oferece gestão completa de cursos, usuários, pagamentos e muito mais. Desenvolvida com as melhores práticas de mercado, combina um backend robusto em Node.js com um frontend React responsivo e intuitivo.

### 🌟 Destaques

- 🔐 **Autenticação Completa** - JWT + 2FA + Recuperação de Senha
- 💳 **Pagamentos Integrados** - Mercado Pago (PIX, Cartão, Boleto)
- 📱 **PWA Ready** - Instale como app no celular/desktop
- 🌍 **Multilíngue** - PT-BR, EN-US, ES-ES
- 🎨 **UI Moderna** - Tailwind CSS + Animações suaves
- 📊 **Dashboard Completo** - Analytics e relatórios
- 🧪 **Testado** - Vitest + Testing Library
- 🔄 **Real-time** - Chat integrado
- 📦 **Carrinho de Compras** - Sistema de e-commerce

---

## ✨ Funcionalidades

### Autenticação & Segurança
- ✅ Login/Cadastro com validação
- ✅ JWT com refresh tokens
- ✅ Autenticação de dois fatores (2FA/TOTP)
- ✅ Recuperação de senha via email
- ✅ Upload de avatar com validação
- ✅ Sessões múltiplas gerenciadas

### Gestão Educacional
- ✅ Dashboard com métricas
- ✅ Catálogo de componentes curriculares
- ✅ Gestão de professores
- ✅ Histórico de atividades
- ✅ Perfil completo do usuário

### Pagamentos
- ✅ Integração Mercado Pago
- ✅ Pagamento via PIX (QR Code)
- ✅ Cartão de crédito/débito
- ✅ Boleto bancário
- ✅ Confirmação automática
- ✅ Página de sucesso

### Experiência do Usuário
- ✅ Progressive Web App (PWA)
- ✅ Modo escuro/claro
- ✅ Internacionalização (i18n)
- ✅ Chat de suporte
- ✅ Notificações toast
- ✅ Design responsivo
- ✅ Validações em tempo real

---

## 🚀 Tecnologias

### Backend
```
Node.js 18+          Express.js 4.21       PostgreSQL 14+
Prisma ORM 5.22      JWT + bcrypt          Multer
Speakeasy (2FA)      QRCode                Mercado Pago SDK
Nodemailer           CORS                  dotenv
```

### Frontend
```
React 19.2           TypeScript 5.9        Vite 7.2
React Router 7.9     Tailwind CSS 4.1      Axios
Lucide Icons         Vitest                Testing Library
PWA Support          i18next               Context API
```

### Banco de Dados
```
PostgreSQL           Prisma Migrations     Prisma Studio
```

---

## 🛠️ Estrutura do Projeto

```
PROJETO CARBONE/
├── 📁 Backend (Raiz)
│   ├── server.js                    # Servidor simples (dev)
│   ├── server-prisma.js             # Servidor produção
│   ├── package.json
│   ├── prisma/
│   │   └── schema.prisma           # Schema do banco
│   ├── middleware/
│   │   └── auth.js                 # Middleware JWT
│   ├── routes/
│   │   └── pagamento.js            # Rotas de pagamento
│   ├── services/
│   │   └── emailService.js         # Serviço de email
│   └── uploads/                    # Uploads de usuários
│
├── 📁 Frontend (projeto-carbone/)
│   ├── src/
│   │   ├── components/             # Componentes React
│   │   ├── pages/                  # Páginas
│   │   ├── contexts/               # Context API
│   │   ├── utils/                  # Utilitários
│   │   ├── i18n/                   # Traduções
│   │   ├── tests/                  # Testes
│   │   └── types/                  # TypeScript types
│   ├── public/                     # Assets estáticos
│   ├── vite.config.ts
│   └── package.json
│
└── 📄 Documentação
    ├── README.md
    ├── QUICK-START.md
    ├── DEPLOY-GITHUB.md
    ├── GUIA-PAGAMENTO-COMPLETO.md
    └── GUIA-TESTES-COMPLETO.md
```

---

## ⚡ Instalação Rápida

### 1️⃣ Pré-requisitos

- **Node.js** 18+ ([Download](https://nodejs.org/))
- **PostgreSQL** 14+ ([Download](https://www.postgresql.org/download/))
- **Git** ([Download](https://git-scm.com/))

### 2️⃣ Clone o Repositório

```bash
git clone https://github.com/beatrizaraujow/roma-backend.git
cd roma-backend
```

### 3️⃣ Configurar Backend

```bash
# Instalar dependências
npm install

# Criar arquivo .env
cp .env.example .env
# Edite o .env com suas credenciais

# Configurar banco de dados
npx prisma generate
npx prisma migrate dev

# Iniciar servidor (porta 3000)
npm run dev:prisma
```

**Arquivo `.env` exemplo:**
```env
DATABASE_URL="postgresql://usuario:senha@localhost:5432/roma_db"
JWT_SECRET="sua-chave-super-segura-aqui"
REFRESH_SECRET="sua-chave-refresh-super-segura"
PORT=3000

# Mercado Pago (opcional)
MP_ACCESS_TOKEN="seu-token-aqui"

# Email (opcional)
EMAIL_USER="seu-email@gmail.com"
EMAIL_PASS="sua-senha-app"
```

### 4️⃣ Configurar Frontend

```bash
cd projeto-carbone

# Instalar dependências
npm install

# Criar arquivo .env
cp .env.example .env

# Iniciar aplicação (porta 5173)
npm run dev
```

**Arquivo `projeto-carbone/.env` exemplo:**
```env
VITE_API_URL=http://localhost:3000/api
VITE_MP_PUBLIC_KEY=seu-public-key-mercadopago
```

### 5️⃣ Acessar Aplicação

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:3000/api
- **Prisma Studio**: `npx prisma studio` (porta 5555)

---

## 🎬 Início Rápido

### Scripts Backend
```bash
npm run dev:prisma    # Desenvolvimento com Prisma
npm run start:prisma  # Produção com Prisma
npm run dev           # Desenvolvimento (memória)
npm start             # Produção (memória)
```

### Scripts Frontend
```bash
npm run dev           # Servidor desenvolvimento
npm run build         # Build produção
npm run preview       # Preview build
npm test              # Executar testes
npm run test:ui       # Interface testes
npm run test:coverage # Cobertura testes
```

### Usuário Padrão (Desenvolvimento)
```
Email: admin@roma.com
Senha: admin123
```

---

## � Documentação

Este repositório inclui documentação completa:

- 📖 [**QUICK-START.md**](QUICK-START.md) - Guia de início rápido
- 🔧 [**GUIA-INSTALACAO-PRISMA.md**](GUIA-INSTALACAO-PRISMA.md) - Setup do Prisma
- 💳 [**GUIA-PAGAMENTO-COMPLETO.md**](GUIA-PAGAMENTO-COMPLETO.md) - Integração Mercado Pago
- 🧪 [**GUIA-TESTES-COMPLETO.md**](GUIA-TESTES-COMPLETO.md) - Testes e qualidade
- 🚀 [**DEPLOY-GITHUB.md**](DEPLOY-GITHUB.md) - Deploy e CI/CD
- 🔐 [**INSTRUCOES-LOGIN.md**](INSTRUCOES-LOGIN.md) - Sistema de autenticação
- 📱 [**projeto-carbone/README.md**](projeto-carbone/README.md) - Documentação frontend

---

## 🔌 API Endpoints

### Base URL
```
http://localhost:3000/api
```

### Autenticação

| Método | Endpoint | Descrição | Auth |
|--------|----------|-----------|------|
| POST | `/auth/login` | Login de usuário | ❌ |
| POST | `/auth/cadastro` | Criar nova conta | ❌ |
| POST | `/auth/recuperar-senha` | Solicitar reset | ❌ |
| POST | `/auth/redefinir-senha` | Redefinir senha | ❌ |
| POST | `/auth/refresh-token` | Renovar token | ❌ |
| GET | `/auth/me` | Dados do usuário | ✅ |
| PUT | `/auth/profile` | Atualizar perfil | ✅ |
| POST | `/auth/upload-avatar` | Upload avatar | ✅ |

### 2FA (Two-Factor Authentication)

| Método | Endpoint | Descrição | Auth |
|--------|----------|-----------|------|
| POST | `/auth/2fa/setup` | Configurar 2FA | ✅ |
| POST | `/auth/2fa/verify` | Verificar código | ✅ |
| POST | `/auth/2fa/disable` | Desabilitar 2FA | ✅ |

### Pagamentos

| Método | Endpoint | Descrição | Auth |
|--------|----------|-----------|------|
| POST | `/pagamento/create-preference` | Criar preferência MP | ✅ |
| POST | `/pagamento/create-pix` | Gerar pagamento PIX | ✅ |
| GET | `/pagamento/status/:id` | Status pagamento | ✅ |
| POST | `/pagamento/webhook` | Webhook Mercado Pago | ❌ |

### Exemplos de Requisição

#### Login
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "usuario@email.com",
    "senha": "senha123"
  }'
```

**Resposta:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "uuid",
    "nome": "Nome do Usuário",
    "email": "usuario@email.com",
    "fotoPerfil": null
  }
}
```

#### Cadastro
```bash
curl -X POST http://localhost:3000/api/auth/cadastro \
  -H "Content-Type: application/json" \
  -d '{
    "nome": "João Silva",
    "email": "joao@email.com",
    "senha": "Senha@123",
    "telefone": "(11) 99999-9999"
  }'
```

#### Obter Perfil (Autenticado)
```bash
curl -X GET http://localhost:3000/api/auth/me \
  -H "Authorization: Bearer SEU_TOKEN_JWT"
```

#### Criar Pagamento PIX
```bash
curl -X POST http://localhost:3000/api/pagamento/create-pix \
  -H "Authorization: Bearer SEU_TOKEN_JWT" \
  -H "Content-Type: application/json" \
  -d '{
    "valor": 100.00,
    "descricao": "Pagamento do curso"
  }'
```

---

## �🗄️ Banco de Dados

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

---

## 🔒 Segurança

### Autenticação JWT

- **Access Token**: 15 minutos de validade
- **Refresh Token**: 7 dias (normal) ou 30 dias ("lembrar-me")
- **Algoritmo**: HS256
- **Storage**: Tokens armazenados no banco de dados

### Proteções Implementadas

- ✅ Hash de senhas com bcrypt (10 rounds)
- ✅ Tokens criptograficamente seguros
- ✅ CORS configurado
- ✅ Validação de entrada
- ✅ Rate limiting (em desenvolvimento)
- ✅ HTTPS recomendado em produção
- ✅ Sanitização de uploads
- ✅ Proteção contra SQL Injection (Prisma)

### 2FA (Autenticação de Dois Fatores)

```javascript
// Gerar QR Code para 2FA
POST /api/auth/2fa/setup

// Verificar código TOTP
POST /api/auth/2fa/verify
{
  "token": "123456"
}
```

---

## 🚀 Deploy

### Deploy no Render/Railway/Heroku

1. **Variáveis de Ambiente:**
```env
DATABASE_URL=postgresql://...
JWT_SECRET=...
REFRESH_SECRET=...
MP_ACCESS_TOKEN=...
NODE_ENV=production
```

2. **Build Command:**
```bash
npm install && npx prisma generate && npx prisma migrate deploy
```

3. **Start Command:**
```bash
npm run start:prisma
```

### Deploy Frontend (Vercel/Netlify)

1. **Build Command:**
```bash
cd projeto-carbone && npm install && npm run build
```

2. **Output Directory:**
```
projeto-carbone/dist
```

3. **Environment Variables:**
```env
VITE_API_URL=https://sua-api.com/api
VITE_MP_PUBLIC_KEY=seu-public-key
```

Veja [DEPLOY-GITHUB.md](DEPLOY-GITHUB.md) para instruções completas.

---

## 🧪 Testes

### Backend
```bash
# Testes unitários (em desenvolvimento)
npm test
```

### Frontend
```bash
cd projeto-carbone

# Executar testes
npm test

# Interface visual
npm run test:ui

# Cobertura
npm run test:coverage
```

**Tecnologias:**
- Vitest
- Testing Library
- jsdom

Veja [GUIA-TESTES-COMPLETO.md](GUIA-TESTES-COMPLETO.md) para mais detalhes.

---

## 📊 Banco de Dados Schema

### Modelos Prisma

#### User
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
  
  notificacoes     Boolean        @default(true)
  autenticacao2FA  Boolean        @default(false)
  modoEscuro       Boolean        @default(false)
  
  resetToken       String?
  resetTokenExpiry DateTime?
  
  refreshTokens    RefreshToken[]
  activities       Activity[]
  
  createdAt        DateTime       @default(now())
  updatedAt        DateTime       @updatedAt
}
```

#### RefreshToken
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

#### Activity
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

### Migrations

```bash
# Criar nova migration
npx prisma migrate dev --name nome_da_migration

# Aplicar em produção
npx prisma migrate deploy

# Visualizar dados
npx prisma studio
```

---

## 📁 Estrutura de Arquivos Completa

```
roma-backend/
├── 📄 Backend Files
│   ├── server.js                           # Servidor dev (memória)
│   ├── server-prisma.js                    # Servidor prod (PostgreSQL)
│   ├── upload-config.js                    # Config upload avatares
│   ├── package.json                        # Dependências backend
│   ├── .env.example                        # Exemplo variáveis
│   ├── .gitignore                          # Arquivos ignorados
│   │
│   ├── 📁 prisma/
│   │   └── schema.prisma                   # Schema do banco
│   │
│   ├── 📁 middleware/
│   │   └── auth.js                         # Middleware JWT
│   │
│   ├── 📁 routes/
│   │   └── pagamento.js                    # Rotas pagamento
│   │
│   ├── 📁 services/
│   │   └── emailService.js                 # Serviço email
│   │
│   └── 📁 uploads/
│       └── avatars/                        # Uploads usuários
│
├── 📁 projeto-carbone/                     # Frontend React
│   ├── 📁 src/
│   │   ├── App.tsx                         # Componente raiz
│   │   ├── main.tsx                        # Entry point
│   │   │
│   │   ├── 📁 components/                  # Componentes
│   │   │   ├── AvatarUpload.tsx
│   │   │   ├── Button.tsx
│   │   │   ├── Carrinho.tsx
│   │   │   ├── ChatWidget.tsx
│   │   │   ├── Input.tsx
│   │   │   ├── LanguageSelector.tsx
│   │   │   ├── PasswordStrength.tsx
│   │   │   ├── PrivateRoute.tsx
│   │   │   ├── Sidebar.tsx
│   │   │   └── TwoFactorSetup.tsx
│   │   │
│   │   ├── 📁 pages/                       # Páginas
│   │   │   ├── Login.tsx
│   │   │   ├── Cadastro.tsx
│   │   │   ├── Dashboard.tsx
│   │   │   ├── Checkout.tsx
│   │   │   ├── PagamentoPix.tsx
│   │   │   ├── PagamentoSucesso.tsx
│   │   │   ├── Perfil.tsx
│   │   │   ├── Configuracoes.tsx
│   │   │   ├── ComponentesCurriculares.tsx
│   │   │   ├── Professores.tsx
│   │   │   └── Historico.tsx
│   │   │
│   │   ├── 📁 contexts/                    # React Context
│   │   │   ├── AuthContext.tsx
│   │   │   ├── CarrinhoContext.tsx
│   │   │   ├── I18nContext.tsx
│   │   │   └── ToastContext.tsx
│   │   │
│   │   ├── 📁 utils/                       # Utilitários
│   │   │   ├── authService.ts
│   │   │   ├── mercadoPagoService.ts
│   │   │   ├── validacao.ts
│   │   │   ├── analytics.ts
│   │   │   └── pwa.ts
│   │   │
│   │   ├── 📁 i18n/                        # Traduções
│   │   │   ├── pt-BR.json
│   │   │   ├── en-US.json
│   │   │   └── es-ES.json
│   │   │
│   │   ├── 📁 tests/                       # Testes
│   │   │   ├── Button.test.tsx
│   │   │   ├── validacao.test.ts
│   │   │   └── setup.ts
│   │   │
│   │   └── 📁 types/                       # TypeScript
│   │       └── auth.types.ts
│   │
│   ├── 📁 public/
│   │   ├── manifest.json                   # PWA manifest
│   │   └── sw.js                           # Service Worker
│   │
│   ├── index.html
│   ├── package.json
│   ├── vite.config.ts
│   ├── tailwind.config.js
│   ├── tsconfig.json
│   └── vitest.config.ts
│
└── 📄 Documentação
    ├── README.md                           # Este arquivo
    ├── QUICK-START.md                      # Início rápido
    ├── DEPLOY-GITHUB.md                    # Deploy
    ├── GUIA-INSTALACAO-PRISMA.md          # Setup Prisma
    ├── GUIA-PAGAMENTO-COMPLETO.md         # Pagamentos
    ├── GUIA-TESTES-COMPLETO.md            # Testes
    ├── INSTRUCOES-LOGIN.md                # Login
    └── IMPLEMENTACOES-PRIORIDADE-ALTA.md  # Roadmap
```

---

## 🤝 Contribuindo

Contribuições são bem-vindas! Para contribuir:

1. Fork o projeto
2. Crie uma branch (`git checkout -b feature/MinhaFeature`)
3. Commit suas mudanças (`git commit -m 'Add: Nova feature'`)
4. Push para a branch (`git push origin feature/MinhaFeature`)
5. Abra um Pull Request

### Padrões de Commit

- `feat:` Nova funcionalidade
- `fix:` Correção de bug
- `docs:` Documentação
- `style:` Formatação
- `refactor:` Refatoração
- `test:` Testes
- `chore:` Manutenção

---

## 📝 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

---

## 👥 Autores

- **Beatriz Araújo** - [@beatrizaraujow](https://github.com/beatrizaraujow)

---

## 📞 Suporte

- 📧 Email: suporte@roma.com
- 🐛 Issues: [GitHub Issues](https://github.com/beatrizaraujow/roma-backend/issues)
- 📖 Docs: [Wiki](https://github.com/beatrizaraujow/roma-backend/wiki)

---

## 🎉 Agradecimentos

- Node.js Community
- React Team
- Prisma Team
- Mercado Pago
- Todos os contribuidores

---

<div align="center">

**⭐ Se este projeto foi útil, considere dar uma estrela no GitHub! ⭐**

Made with ❤️ by [Beatriz Araújo](https://github.com/beatrizaraujow)

</div>
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
