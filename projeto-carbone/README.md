# ROMA - Sistema de Autenticação

Sistema completo de autenticação desenvolvido com React, TypeScript e Vite.

## ✨ Funcionalidades Implementadas

### Autenticação
- ✅ Login com validação de campos em tempo real
- ✅ Integração com backend via API REST
- ✅ Context API para gerenciamento de estado global
- ✅ Proteção de rotas (PrivateRoute)
- ✅ Token JWT armazenado em localStorage
- ✅ Logout com limpeza de sessão

### Recuperação e Redefinição de Senha
- ✅ Página de recuperação de senha por email
- ✅ Página de redefinição de senha com token
- ✅ Validação de token de recuperação
- ✅ Indicador visual de força de senha

### Interface e UX
- ✅ Toast notifications (sucesso/erro flutuantes)
- ✅ Validação visual de força de senha com barra de progresso
- ✅ Mensagens de erro personalizadas por tipo
- ✅ Dashboard pós-login com informações do usuário
- ✅ Design responsivo com tema claro
- ✅ Fonte Montserrat com múltiplos pesos
- ✅ Animações e transições suaves
- ✅ Feedback visual em tempo real

### Componentes Reutilizáveis
- ✅ Input com validação e acessibilidade
- ✅ Button com estados de loading
- ✅ Checkbox customizado
- ✅ PasswordStrength (indicador de força)
- ✅ Toast (notificações flutuantes)
- ✅ PrivateRoute (proteção de rotas)

## Configuração

1. Clone o repositório
2. Instale as dependências:
```bash
npm install
```

3. Configure as variáveis de ambiente:
```bash
cp .env.example .env
```

4. Edite o arquivo `.env` e configure a URL da API:
```env
VITE_API_URL=http://localhost:3000/api
```

## Desenvolvimento

Para iniciar o servidor de desenvolvimento:
```bash
npm run dev
```

## Estrutura da API

O sistema espera os seguintes endpoints:

### POST /auth/login
**Body:**
```json
{
  "email": "usuario@exemplo.com",
  "senha": "senha123"
}
```

**Response (sucesso):**
```json
{
  "success": true,
  "token": "jwt-token-aqui",
  "user": {
    "id": "1",
    "nome": "Nome do Usuário",
    "email": "usuario@exemplo.com"
  }
}
```

**Response (erro):**
```json
{
  "success": false,
  "message": "Mensagem de erro",
  "errorCode": "INVALID_CREDENTIALS"
}
```

### POST /auth/recuperar-senha
**Body:**
```json
{
  "email": "usuario@exemplo.com"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Email enviado com sucesso"
}
```

## Códigos de Erro

O sistema suporta os seguintes códigos de erro:

- `INVALID_CREDENTIALS` - Email ou senha inválidos
- `USER_NOT_FOUND` - Usuário não encontrado
- `USER_INACTIVE` - Conta desativada
- `NETWORK_ERROR` - Erro de conexão
- `SERVER_ERROR` - Erro no servidor
- `EMAIL_NOT_FOUND` - Email não encontrado (recuperação)
- `VALIDATION_ERROR` - Erro de validação

## React Compiler

The React Compiler is currently not compatible with SWC. See [this issue](https://github.com/vitejs/vite-plugin-react/issues/428) for tracking the progress.

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
