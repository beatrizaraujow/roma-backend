# 🚀 Como Executar o Projeto ROMA

## Pré-requisitos
- Node.js instalado
- Duas janelas de terminal abertas

## 📝 Passo a Passo

### Terminal 1: Backend (Servidor)
```powershell
cd "C:\Users\annyb\OneDrive\Documentos\PROJETO CARBONE\projeto-carbone"
npm run server
```

**Deixe este terminal ABERTO**. Você verá:
```
🚀 Backend ROMA iniciado com sucesso!
📡 Servidor rodando em: http://localhost:3000
```

### Terminal 2: Frontend (React)
```powershell
cd "C:\Users\annyb\OneDrive\Documentos\PROJETO CARBONE\projeto-carbone"
npm run dev
```

Acesse: **http://localhost:5173/login**

## 🔑 Credenciais de Teste

- **Email:** `admin@roma.com`
- **Senha:** `Admin123!@#`

## ✅ Como Saber se Está Funcionando

1. Terminal do backend deve mostrar logs quando você fizer login
2. Se login bem-sucedido, verá: `✅ Login successful: admin@roma.com`
3. Você será redirecionado para `/dashboard`

## 🐛 Solução de Problemas

### "Erro de conexão com o servidor"
- Verifique se o Terminal 1 (backend) está rodando
- Execute: `netstat -ano | findstr :3000`
- Se não aparecer nada, reinicie o Terminal 1

### Backend não inicia
```powershell
cd "C:\Users\annyb\OneDrive\Documentos\PROJETO CARBONE\projeto-carbone"
npm install
npm run server
```

## 📂 Estrutura do Projeto

```
projeto-carbone/
├── server.cjs          # Backend Express
├── src/
│   ├── pages/
│   │   └── Login.tsx  # Página de login
│   └── utils/
│       └── authService.ts  # Serviço de autenticação
└── package.json
```

## 🔄 Scripts Disponíveis

- `npm run dev` - Inicia frontend (Vite)
- `npm run server` - Inicia backend (Express)
- `npm run build` - Build de produção
- `npm run preview` - Preview do build

---

**Importante:** Sempre mantenha AMBOS os terminais abertos enquanto desenvolve!
