# 🚀 ROMA Frontend - Novo Design

Frontend moderno do sistema ROMA com design split-screen e layout profissional.

## ✨ Stack Tecnológica

- **React 19** - Biblioteca UI
- **TypeScript** - Tipagem estática
- **Vite** - Build tool e dev server
- **TailwindCSS** - Framework CSS utilitário
- **React Router v6** - Roteamento
- **Lucide React** - Ícones modernos
- **Axios** - Cliente HTTP

## 🎨 Design System

### Cores
- **Primary:** `#2C3E50` (Azul escuro)
- **Gold:** `#D4AF37` (Dourado)
- **Gray Scale:** 50, 100, 200, 400, 500, 600, 700, 900

### Tipografia
- **Font:** Inter (Google Fonts)
- **Weights:** 300, 400, 500, 600, 700

## 📁 Estrutura do Projeto

```
projeto-carbone/
├── public/
│   ├── logo-roma.png          # Logo ROMA (adicionar)
│   ├── classroom.jpg          # Imagem de fundo (adicionar)
│   └── manifest.json
├── src/
│   ├── pages/
│   │   └── Login.tsx          # ✅ Página de login (implementada)
│   ├── App.tsx                # Roteamento principal
│   ├── main.tsx               # Entry point
│   └── index.css              # Estilos globais + Tailwind
├── tailwind.config.js         # Configuração Tailwind
├── postcss.config.js          # Configuração PostCSS
└── package.json
```

## 🚀 Como Executar

### 1. Instalar Dependências
```bash
cd projeto-carbone
npm install --legacy-peer-deps
```

### 2. Adicionar Imagens
Consulte o arquivo `IMAGENS-GUIA.md` para instruções detalhadas.

Você precisa adicionar:
- `public/logo-roma.png` - Logo ROMA Fab&Elo
- `public/classroom.jpg` - Imagem da sala de aula

### 3. Iniciar Servidor
```bash
npm run dev
```

O app estará disponível em: `http://localhost:5173`

## 📄 Páginas Implementadas

### ✅ Login (`/login`)
- Layout split-screen (imagem + formulário)
- Campos: Usuário e Senha
- Toggle para mostrar/ocultar senha
- Links para recuperação e cadastro
- Design fiel ao mockup fornecido

### 🔲 Próximas Páginas
- Cadastro
- Recuperação de Senha
- Dashboard
- Perfil
- Configurações
- Histórico

## 🎨 Componentes do Design

### Input Field
```tsx
<input className="input-field" />
```
- Estilo: Fundo cinza claro, bordas arredondadas
- Focus: Borda azul + anel de foco
- Transições suaves

### Button Primary
```tsx
<button className="btn-primary">Entrar</button>
```
- Estilo: Fundo azul escuro, texto branco
- Hover: Escurece
- Disabled: Opacidade 50%

### Label Text
```tsx
<label className="label-text">Campo</label>
```
- Estilo: Texto médio, cinza 600

## 🔧 Scripts Disponíveis

```bash
# Desenvolvimento
npm run dev

# Build para produção
npm run build

# Preview do build
npm run preview

# Lint
npm run lint

# Testes
npm run test
npm run test:ui
npm run test:coverage
```

## 📱 Responsividade

- **Desktop (lg+):** Layout split 50/50
- **Mobile/Tablet (<lg):** Apenas formulário (imagem oculta)

## 🎯 Próximos Passos

1. **Adicionar as imagens** (logo-roma.png e classroom.jpg)
2. **Testar o layout** no navegador
3. **Implementar API de autenticação**
4. **Criar páginas restantes**
5. **Adicionar Context de autenticação**
6. **Implementar proteção de rotas**

## 🛠️ Dependências Principais

```json
{
  "react": "^19.2.0",
  "react-dom": "^19.2.0",
  "react-router-dom": "^6.x",
  "axios": "^1.x",
  "lucide-react": "^0.x",
  "tailwindcss": "^3.x",
  "@tailwindcss/postcss": "^4.x"
}
```

## 📝 Notas de Desenvolvimento

### Classes Tailwind Customizadas

No `index.css`:
- `.input-field` - Estilo padrão de input
- `.btn-primary` - Botão primário
- `.label-text` - Label de formulário

### Cores Customizadas

No `tailwind.config.js`:
- `primary` / `primary-dark`
- `gold` / `gold-light`

## 🐛 Troubleshooting

### Erro PostCSS/Tailwind
Se encontrar erro com Tailwind, certifique-se de ter:
```bash
npm install -D @tailwindcss/postcss --legacy-peer-deps
```

### Imagens não aparecem
- Verifique se estão em `public/`
- Nomes corretos: `logo-roma.png` e `classroom.jpg`
- Limpe o cache: Ctrl + Shift + R

### Conflito de dependências
Use sempre `--legacy-peer-deps`:
```bash
npm install <pacote> --legacy-peer-deps
```

## 📞 Suporte

- Documentação Tailwind: https://tailwindcss.com/docs
- Documentação React Router: https://reactrouter.com/
- Lucide Icons: https://lucide.dev/

---

**Status:** ✅ Base configurada e funcionando
**Versão:** 1.0.0
**Última atualização:** 22 de Novembro de 2025
