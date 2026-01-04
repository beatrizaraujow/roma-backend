# 🗄️ Guia de Instalação - PostgreSQL + Prisma

## 📋 Pré-requisitos

### 1. Instalar PostgreSQL

#### Windows:
1. Baixe o instalador: https://www.postgresql.org/download/windows/
2. Execute o instalador (versão 15 ou superior)
3. Durante a instalação:
   - Defina uma senha para o usuário `postgres`
   - Porta padrão: `5432`
   - Mantenha as configurações padrão

#### Verificar instalação:
```powershell
psql --version
```

---

## 🚀 Setup do Projeto

### 1. Instalar Dependências

```powershell
cd "C:\Users\annyb\OneDrive\Documentos\PROJETO CARBONE"

# Instalar dependências do backend
npm install

# As novas dependências incluem:
# - @prisma/client: Cliente Prisma
# - bcrypt: Hash de senhas
# - prisma: CLI do Prisma (dev)
```

### 2. Configurar Banco de Dados

#### Criar o banco de dados:

```powershell
# Conectar ao PostgreSQL
psql -U postgres

# No terminal do PostgreSQL:
CREATE DATABASE roma_db;
\q
```

#### Atualizar `.env`:

Edite o arquivo `.env` na raiz do projeto:

```env
DATABASE_URL="postgresql://postgres:SUA_SENHA@localhost:5432/roma_db?schema=public"
```

Substitua `SUA_SENHA` pela senha que você definiu na instalação do PostgreSQL.

### 3. Executar Migrations

```powershell
# Gerar o cliente Prisma
npx prisma generate

# Criar as tabelas no banco
npx prisma migrate dev --name init

# Abrir Prisma Studio (interface visual)
npx prisma studio
```

O Prisma Studio abre em `http://localhost:5555` e permite visualizar/editar dados.

---

## 🎯 Executar o Projeto

### Opção A: Servidor com Prisma (Banco Real)

```powershell
# Terminal 1 - Backend com Prisma
npm run dev:prisma

# Terminal 2 - Frontend
cd projeto-carbone
npm run dev
```

### Opção B: Servidor em Memória (Testes Rápidos)

```powershell
# Terminal 1 - Backend em memória
npm run dev

# Terminal 2 - Frontend
cd projeto-carbone
npm run dev
```

---

## 📊 Estrutura do Banco de Dados

### Tabelas Criadas:

1. **users** - Dados dos usuários
   - id, nome, email, senha (hash), telefone, empresa, cargo
   - fotoPerfil, notificacoes, autenticacao2FA, modoEscuro
   - resetToken, resetTokenExpiry
   - createdAt, updatedAt

2. **refresh_tokens** - Tokens de renovação
   - id, token, userId, expiresAt, createdAt

3. **activities** - Histórico de atividades
   - id, userId, action, description
   - ipAddress, userAgent, createdAt

### Relacionamentos:
- User → RefreshTokens (1:N)
- User → Activities (1:N)

---

## 🔐 Criar Usuário de Teste

```sql
-- Abrir psql
psql -U postgres -d roma_db

-- Inserir usuário (senha: Admin123!@#)
INSERT INTO users (id, nome, email, senha, "createdAt", "updatedAt")
VALUES (
  gen_random_uuid(),
  'Administrador',
  'admin@roma.com',
  '$2b$10$YourHashedPasswordHere',
  NOW(),
  NOW()
);
```

Ou use o endpoint de cadastro pela API! 🎉

---

## 🛠️ Comandos Úteis

### Prisma:

```powershell
# Resetar banco (CUIDADO: apaga tudo!)
npx prisma migrate reset

# Ver status das migrations
npx prisma migrate status

# Criar nova migration
npx prisma migrate dev --name nome_da_migration

# Formatar schema.prisma
npx prisma format

# Abrir Prisma Studio
npx prisma studio
```

### PostgreSQL:

```powershell
# Conectar ao banco
psql -U postgres -d roma_db

# Listar tabelas
\dt

# Descrever tabela
\d users

# Ver todos os usuários
SELECT id, nome, email FROM users;

# Contar registros
SELECT COUNT(*) FROM users;
```

---

## ✅ Checklist de Verificação

- [ ] PostgreSQL instalado e rodando
- [ ] Banco `roma_db` criado
- [ ] `.env` configurado com `DATABASE_URL` correta
- [ ] `npx prisma generate` executado
- [ ] `npx prisma migrate dev` executado
- [ ] Servidor rodando: `npm run dev:prisma`
- [ ] Frontend rodando: `cd projeto-carbone && npm run dev`
- [ ] Prisma Studio acessível: `http://localhost:5555`

---

## 🐛 Troubleshooting

### Erro: "Can't reach database server"
- Verifique se o PostgreSQL está rodando
- Confirme a senha no `.env`
- Teste a conexão: `psql -U postgres`

### Erro: "Prisma Client not generated"
```powershell
npx prisma generate
```

### Erro: "Port 3000 already in use"
```powershell
# Mudar porta no .env:
PORT=3001
```

### Reset completo:
```powershell
npx prisma migrate reset
npx prisma generate
npm run dev:prisma
```

---

## 📝 Próximos Passos

Após configurar:

1. ✅ Testar cadastro de novo usuário
2. ✅ Testar login
3. ✅ Ver dados no Prisma Studio
4. ✅ Verificar histórico de atividades
5. ✅ Testar todas as funcionalidades

**Backend com Prisma está pronto! 🚀**
