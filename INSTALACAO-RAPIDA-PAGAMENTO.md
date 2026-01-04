# 🚀 Instalação Rápida - Sistema de Pagamento

## ⚡ Passo a Passo

### 1. Instalar Dependências

```bash
# Backend
cd "C:\Users\annyb\OneDrive\Documentos\PROJETO CARBONE"
npm install

# Frontend
cd projeto-carbone
npm install
```

### 2. Configurar Variáveis de Ambiente

**Backend** - Crie arquivo `.env` na raiz:
```env
PORT=3000
JWT_SECRET=sua_chave_secreta_aqui

# Mercado Pago (obtenha em: https://www.mercadopago.com.br/developers/panel/app)
MERCADOPAGO_ACCESS_TOKEN=TEST-seu_token_aqui
MERCADOPAGO_PUBLIC_KEY=TEST-sua_public_key_aqui

# Email
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=seu_email@gmail.com
EMAIL_PASS=sua_senha_app_aqui

APP_URL=http://localhost:5173
```

**Frontend** - Crie arquivo `.env` em `projeto-carbone/`:
```env
VITE_API_URL=http://localhost:3000
VITE_MERCADOPAGO_PUBLIC_KEY=TEST-sua_public_key_aqui
```

### 3. Atualizar server.js

Adicione estas linhas no `server.js`:

```javascript
import dotenv from 'dotenv';
import pagamentoRoutes from './routes/pagamento.js';
import { verificarConfiguracao } from './services/emailService.js';

dotenv.config();

// Após configurar CORS e antes de app.listen()
app.use('/api/pagamento', pagamentoRoutes);

// Verificar email ao iniciar
verificarConfiguracao();
```

### 4. Iniciar Servidores

```bash
# Terminal 1 - Backend
npm run dev

# Terminal 2 - Frontend
cd projeto-carbone
npm run dev
```

## 🧪 Testar

1. **Acesse**: http://localhost:5173
2. **Faça login**
3. **Adicione cursos ao carrinho**
4. **Clique em "Finalizar Compra"**
5. **Teste com cupom**: `BEMVINDO10`
6. **Cartão de teste**: `5031 4332 1540 6351` | Nome: `APROVADO` | CVV: `123`

## 📚 Documentação Completa

Ver arquivo: `GUIA-PAGAMENTO-COMPLETO.md`

## ❓ Precisa de Ajuda?

**Erro comum**: Credenciais do Mercado Pago
- Use credenciais de **TEST** para desenvolvimento
- Obtenha em: https://www.mercadopago.com.br/developers/panel/app

**Email não funciona**:
- Use senha de app do Gmail: https://myaccount.google.com/apppasswords
