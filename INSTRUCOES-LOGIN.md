# Instruções para Testar o Login

## Passo 1: Iniciar o Backend

Abra um **NOVO terminal PowerShell** e execute:

```powershell
cd "C:\Users\annyb\OneDrive\Documentos\PROJETO CARBONE"
node server.js
```

**IMPORTANTE:** Deixe este terminal ABERTO e RODANDO. Você verá:

```
🚀 Backend ROMA iniciado com sucesso!
📡 Servidor rodando em: http://localhost:3000
```

## Passo 2: Acessar o Frontend

1. Acesse no navegador: **http://localhost:5173/login**

2. Use as credenciais:
   - **Email:** `admin@roma.com`
   - **Senha:** `Admin123!@#`

## Passo 3: Testar o Login

1. Digite as credenciais
2. Clique em "Entrar"
3. Abra o Console do Navegador (F12) para ver os logs
4. Se funcionar, você será redirecionado para `/dashboard`

## Solução de Problemas

### Erro: "Erro ao conectar com o servidor"

✅ **Verifique se o backend está rodando:**
```powershell
netstat -ano | findstr :3000
```

Se não mostrar nada, o backend não está rodando. Execute o Passo 1 novamente.

### Erro: "Email ou senha inválidos"

✅ Certifique-se de usar exatamente:
- Email: `admin@roma.com` (minúsculas)
- Senha: `Admin123!@#` (com letras maiúsculas, minúsculas, números e caracteres especiais)

### Backend não inicia

✅ Verifique se as dependências estão instaladas:
```powershell
cd "C:\Users\annyb\OneDrive\Documentos\PROJETO CARBONE"
npm install
```

## Arquitetura

- **Frontend (React + Vite):** http://localhost:5173
- **Backend (Express):** http://localhost:3000
- **Endpoint de Login:** POST http://localhost:3000/api/auth/login

## Fluxo de Autenticação

1. Usuário preenche email e senha
2. Frontend envia POST para `/api/auth/login`
3. Backend valida credenciais
4. Backend retorna JWT token
5. Frontend salva token no localStorage
6. Frontend redireciona para Dashboard
