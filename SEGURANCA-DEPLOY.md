# 🔒 Checklist de Segurança - Deploy GitHub

## ✅ Arquivos Protegidos (Ignorados pelo Git)

### Credenciais e Configurações Sensíveis
- ✅ `.env` (backend) - Contém DATABASE_URL, JWT_SECRET, etc.
- ✅ `.env` (frontend) - Variáveis de ambiente do React
- ✅ `node_modules/` - Dependências (não fazer commit)

### Arquivos de Usuários
- ✅ `uploads/` - Arquivos enviados por usuários
- ✅ `*.jpg, *.png, *.gif` - Imagens diversas
- ✅ `projeto-carbone/public/*.png` - Logos e imagens públicas

### Arquivos do Sistema
- ✅ `.vscode/` - Configurações do editor
- ✅ `logs/` - Arquivos de log
- ✅ `*.log` - Logs de depuração

---

## 📋 O que SERÁ commitado (Seguro)

### Código Fonte
- ✅ Arquivos `.js`, `.ts`, `.tsx`, `.jsx`
- ✅ Arquivos `.css`
- ✅ Configurações do projeto (`package.json`, `tsconfig.json`, etc.)
- ✅ Schema do Prisma (`prisma/schema.prisma`)

### Documentação
- ✅ Arquivos `.md` (README, guias, etc.)
- ✅ `.env.example` (exemplo SEM credenciais reais)

### Configurações
- ✅ `.gitignore` - Lista de arquivos ignorados
- ✅ Arquivos de configuração (ESLint, Tailwind, Vite, etc.)

---

## ⚠️ IMPORTANTE - Antes de fazer Push

### 1. Verificar Arquivo .env
```powershell
# Certifique-se de que .env NÃO aparece aqui:
git status
```

### 2. Verificar .env.example
O arquivo `.env.example` deve ter valores de exemplo:
```env
DATABASE_URL="postgresql://usuario:senha@localhost:5432/roma_db"
JWT_SECRET="sua-chave-secreta-super-segura-aqui"
```

### 3. Nunca Commitar
- ❌ Senhas reais
- ❌ Tokens de API (Mercado Pago, etc.)
- ❌ Chaves JWT reais
- ❌ Credenciais de banco de dados
- ❌ E-mails e senhas SMTP
- ❌ Dados de usuários reais
- ❌ Arquivos de upload de usuários

---

## 🚀 Commandos para Deploy Seguro

```powershell
# 1. Verificar status
git status

# 2. Adicionar apenas arquivos seguros
git add .gitignore
git add projeto-carbone/.gitignore
git add projeto-carbone/src/pages/Login.tsx
git add projeto-carbone/src/pages/Professores.css

# 3. Commit
git commit -m "chore: atualiza gitignore e remove mensagem de backend"

# 4. Push para GitHub
git push origin main
```

---

## 📝 Configuração para Novos Desenvolvedores

Depois que outra pessoa clonar o repositório, ela precisará:

1. **Criar arquivo `.env` na raiz:**
```env
DATABASE_URL="postgresql://usuario:senha@localhost:5432/roma_db"
JWT_SECRET="gerar-nova-chave-aleatoria"
REFRESH_SECRET="gerar-nova-chave-aleatoria"
PORT=3000
NODE_ENV=development
```

2. **Instalar dependências:**
```powershell
npm install
cd projeto-carbone
npm install
```

3. **Configurar banco de dados:**
```powershell
npx prisma generate
npx prisma migrate dev --name init
```

---

## 🔐 Gerando Chaves Secretas Seguras

Para gerar JWT_SECRET e REFRESH_SECRET seguros:

```javascript
// No Node.js:
require('crypto').randomBytes(64).toString('hex')
```

Ou online (use apenas em ambiente seguro):
https://www.random.org/strings/

---

## ✅ Status Atual

- ✅ .gitignore configurado no backend
- ✅ .gitignore configurado no frontend
- ✅ Arquivo .env ignorado
- ✅ Node_modules ignorado
- ✅ Uploads/imagens ignorados
- ✅ .env.example disponível como template

**Projeto SEGURO para deploy público no GitHub!** 🎉
