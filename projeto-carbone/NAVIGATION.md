# Guia de Navegação - ROMA

## Páginas Disponíveis

### 1. Login (`#login`)
**URL:** `http://localhost:5175/#login`

**Funcionalidades:**
- Formulário de login com email e senha
- Validação em tempo real
- Link "Esqueceu sua senha?"
- Toast notifications para feedback
- Redirecionamento automático para dashboard após sucesso

**Componentes usados:**
- `AuthContext` (useAuth hook)
- `ToastContext` (useToast hook)
- `Input`, `Button`

---

### 2. Recuperar Senha (`#recuperar-senha`)
**URL:** `http://localhost:5175/#recuperar-senha`

**Funcionalidades:**
- Formulário com campo de email
- Validação de email
- Envio de link de recuperação
- Mensagem de sucesso
- Link para voltar ao login

**API esperada:**
```typescript
POST /auth/recuperar-senha
Body: { email: string }
Response: { success: boolean, message: string }
```

---

### 3. Redefinir Senha (`#redefinir-senha`)
**URL:** `http://localhost:5175/#redefinir-senha?token=abc123`

**Funcionalidades:**
- Validação de token da URL
- Formulário de nova senha + confirmação
- Indicador visual de força de senha
- Validação em tempo real
- Redirecionamento para login após sucesso

**Componentes especiais:**
- `PasswordStrength` - Barra de progresso e requisitos

**API esperada:**
```typescript
POST /auth/redefinir-senha
Body: { token: string, novaSenha: string }
Response: { success: boolean, message: string }
```

---

### 4. Dashboard (`#dashboard`)
**URL:** `http://localhost:5175/#dashboard`

**Proteção:** ✅ Requer autenticação (PrivateRoute)

**Funcionalidades:**
- Informações do usuário logado
- Cards de atalhos (Perfil, Segurança, Atividades, Configurações)
- Botão de logout
- Informações da conta

**Acesso:**
- Só acessível após login bem-sucedido
- Redireciona para login se não autenticado

---

## Fluxos de Navegação

### Fluxo de Login Completo
```
Login (#login)
  ↓ (sucesso)
Dashboard (#dashboard)
  ↓ (logout)
Login (#login)
```

### Fluxo de Recuperação de Senha
```
Login (#login)
  ↓ (clica "Esqueceu sua senha?")
Recuperar Senha (#recuperar-senha)
  ↓ (envia email)
  ↓ (usuário recebe email com link)
Redefinir Senha (#redefinir-senha?token=...)
  ↓ (define nova senha)
Login (#login)
```

---

## Context Providers

### AuthContext
**Fornece:**
- `user` - Dados do usuário logado
- `isAuthenticated` - Status de autenticação
- `isLoading` - Carregamento inicial
- `login(email, senha)` - Função de login
- `logout()` - Função de logout
- `updateUser(user)` - Atualizar dados do usuário

**Uso:**
```typescript
import { useAuth } from '../contexts/AuthContext';

const { user, login, logout, isAuthenticated } = useAuth();
```

### ToastContext
**Fornece:**
- `showSuccess(message)` - Toast verde de sucesso
- `showError(message)` - Toast vermelho de erro
- `showInfo(message)` - Toast azul de informação
- `showWarning(message)` - Toast laranja de aviso

**Uso:**
```typescript
import { useToast } from '../contexts/ToastContext';

const { showSuccess, showError } = useToast();

// Exibir notificação
showSuccess('Login realizado com sucesso!');
showError('Email ou senha inválidos');
```

---

## Componentes Especiais

### PasswordStrength
Exibe força da senha com:
- Barra de progresso colorida (vermelho/laranja/verde)
- Lista de requisitos (8 chars, maiúscula, minúscula, número, especial)
- Atualização em tempo real

**Uso:**
```typescript
<PasswordStrength 
  senha={formData.senha} 
  showIndicator={formData.senha.length > 0}
/>
```

### PrivateRoute
Protege rotas que requerem autenticação

**Uso:**
```typescript
<PrivateRoute>
  <Dashboard />
</PrivateRoute>
```

---

## Testes Manuais

### Testar Login
1. Acesse `#login`
2. Digite email e senha
3. Clique "Entrar"
4. Verifique toast de sucesso
5. Confirme redirecionamento para dashboard

### Testar Proteção de Rotas
1. Sem estar logado, tente acessar `#dashboard`
2. Deve ser redirecionado para `#login`

### Testar Logout
1. Estando logado no dashboard
2. Clique no botão "Sair"
3. Verifique limpeza do localStorage
4. Confirme redirecionamento para login

### Testar Toast Notifications
1. Faça login com sucesso → Toast verde aparece
2. Tente login com erro → Toast vermelho aparece
3. Toast desaparece automaticamente após 4 segundos
4. Pode clicar no X ou no toast para fechar manualmente

### Testar Força de Senha
1. Acesse página de cadastro ou redefinir senha
2. Digite senha fraca (ex: "abc") → Barra vermelha
3. Digite senha média (ex: "Abc123") → Barra laranja
4. Digite senha forte (ex: "Abc123!@#") → Barra verde
5. Verifique marcação dos requisitos atendidos
