# 🚀 Guia de Deploy no GitHub

## Passos para criar o repositório no GitHub

### 1️⃣ Configurar Git (Se necessário)

```bash
# Configure seu nome e email (uma vez por máquina)
git config --global user.name "Seu Nome"
git config --global user.email "seu-email@example.com"
```

### 2️⃣ Fazer o Commit Inicial

```bash
# Commit dos arquivos
git commit -m "Initial commit: Backend ROMA completo com Prisma e autenticação JWT"
```

### 3️⃣ Criar Repositório no GitHub

1. Acesse: https://github.com/new
2. Nome do repositório: `roma-backend` (ou o nome que preferir)
3. Descrição: `Backend do sistema ROMA - Node.js + Express + Prisma + PostgreSQL`
4. Escolha: **Privado** ou **Público**
5. **NÃO marque** "Add a README file" (já temos um)
6. **NÃO adicione** .gitignore (já temos um)
7. Clique em **"Create repository"**

### 4️⃣ Conectar e Fazer Push

```bash
# Adicionar o remote (substitua SEU-USUARIO pelo seu username do GitHub)
git remote add origin https://github.com/SEU-USUARIO/roma-backend.git

# Renomear branch para main (padrão do GitHub)
git branch -M main

# Fazer push inicial
git push -u origin main
```

### 5️⃣ Adicionar Badge ao README (Opcional)

Após criar o repo, você pode adicionar badges ao README:

```markdown
![Node.js](https://img.shields.io/badge/Node.js-18+-green)
![Express](https://img.shields.io/badge/Express-4.21-blue)
![Prisma](https://img.shields.io/badge/Prisma-5.22-blueviolet)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-14+-blue)
![License](https://img.shields.io/badge/license-MIT-green)
```

---

## 📋 Checklist Antes do Push

- [x] `.gitignore` configurado
- [x] `.env.example` criado (sem dados sensíveis)
- [x] `README.md` completo e atualizado
- [x] Dependências listadas no `package.json`
- [x] Código comentado e documentado
- [ ] `.env` **NÃO** commitado (verificar!)

---

## 🔒 Segurança

### ⚠️ NUNCA commite:
- Arquivo `.env` (com credenciais reais)
- `node_modules/`
- Senhas ou tokens
- Dados sensíveis

### ✅ O que está protegido no `.gitignore`:
- `.env` e variações
- `node_modules/`
- `uploads/` (arquivos de usuários)
- Logs e caches

---

## 🌐 Configurar GitHub Actions (Opcional)

Você pode adicionar CI/CD criando `.github/workflows/test.yml`:

```yaml
name: Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    
    services:
      postgres:
        image: postgres:14
        env:
          POSTGRES_PASSWORD: postgres
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5
    
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - run: npm ci
      - run: npm test
```

---

## 📦 Após o Push

1. **Proteger branch main:**
   - Settings → Branches → Add rule
   - Require pull request before merging

2. **Configurar Secrets:**
   - Settings → Secrets → Actions
   - Adicionar: `DATABASE_URL`, `JWT_SECRET`, etc.

3. **Adicionar colaboradores:**
   - Settings → Collaborators
   - Invite team members

4. **Criar Issues e Projects:**
   - Use Issues para tasks pendentes
   - Projects para organização

---

## 🔄 Comandos Git Úteis

```bash
# Ver status
git status

# Adicionar mudanças
git add .

# Commit
git commit -m "feat: adicionar endpoint de upload"

# Push
git push

# Pull (atualizar)
git pull

# Criar branch
git checkout -b feature/nova-funcionalidade

# Merge branch
git checkout main
git merge feature/nova-funcionalidade

# Ver histórico
git log --oneline

# Ver branches
git branch -a
```

---

## 📝 Convenção de Commits (Recomendado)

Use commits semânticos:

```bash
feat: nova funcionalidade
fix: correção de bug
docs: atualização de documentação
style: formatação de código
refactor: refatoração
test: adição de testes
chore: tarefas de manutenção
```

**Exemplos:**
```bash
git commit -m "feat: adicionar autenticação 2FA"
git commit -m "fix: corrigir validação de email"
git commit -m "docs: atualizar README com novos endpoints"
```

---

## 🎯 Próximos Passos

1. ✅ Criar repositório no GitHub
2. ✅ Fazer push inicial
3. 🔲 Configurar Deploy (Heroku, Railway, Render, etc.)
4. 🔲 Configurar banco de dados em produção
5. 🔲 Adicionar testes automatizados
6. 🔲 Configurar CI/CD
7. 🔲 Documentação da API (Swagger/Postman)

---

## 🆘 Problemas Comuns

### Erro: "remote: Repository not found"
- Verifique se o nome do repositório está correto
- Verifique suas permissões
- Use HTTPS ou configure SSH

### Erro: "failed to push some refs"
```bash
# Forçar push (cuidado!)
git push -f origin main

# Ou pull primeiro
git pull origin main --rebase
git push origin main
```

### Esqueci de adicionar arquivo ao .gitignore
```bash
# Remover do Git mas manter no disco
git rm --cached nome-do-arquivo

# Adicionar ao .gitignore
echo "nome-do-arquivo" >> .gitignore

# Commit
git commit -m "chore: adicionar arquivo ao .gitignore"
```

---

**Criado em:** 22 de Novembro de 2025
