# ⚠️ SOLUÇÃO DO ERRO DE CONEXÃO

## O Problema
O frontend não consegue conectar ao backend porque o **backend NÃO ESTÁ RODANDO**.

## A Solução - 2 Terminais Abertos

### ✅ Terminal 1 - BACKEND (OBRIGATÓRIO)
```powershell
cd "C:\Users\annyb\OneDrive\Documentos\PROJETO CARBONE\projeto-carbone"
node server.cjs
```

**DEIXE ESTE TERMINAL ABERTO!** Você verá:
```
🚀 Backend ROMA iniciado com sucesso!
📡 Servidor rodando em: http://localhost:3000
✅ Pronto para receber requisições!
```

### ✅ Terminal 2 - FRONTEND
```powershell
cd "C:\Users\annyb\OneDrive\Documentos\PROJETO CARBONE\projeto-carbone"
npm run dev
```

Acesse: http://localhost:5173/login

## 🎯 Como Testar se Está Funcionando

### 1. Verifique o Backend
Em outro terminal:
```powershell
curl http://localhost:3000
```

Se retornar erro "Cannot GET /", o servidor ESTÁ funcionando! ✅

### 2. Teste o Login
- Email: `admin@roma.com`
- Senha: `Admin123!@#`

### 3. Veja os Logs
No Terminal 1 (backend), você verá:
```
📥 Login attempt: { email: 'admin@roma.com' }
✅ Login successful: admin@roma.com
```

## 🚫 O Que NÃO Fazer

❌ Fechar o Terminal 1 (backend para de funcionar)
❌ Executar só o frontend (sem backend = erro de conexão)
❌ Usar porta 3000 para outra coisa

## 💡 Dica

Use o **Windows Terminal** e abra 2 abas:
- Aba 1: Backend (node server.cjs)
- Aba 2: Frontend (npm run dev)

Ou use os scripts:
- `.\iniciar-backend.ps1` (Aba 1)
- `.\iniciar-frontend.ps1` (Aba 2)
