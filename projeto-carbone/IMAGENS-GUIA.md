# 🎨 Guia de Imagens - Frontend ROMA

## Imagens Necessárias

### 1. Logo ROMA (logo.png)
- **Local:** `projeto-carbone/public/logo.png`
- **Descrição:** Logo da ROMA Fab&Elo com a fênix dourada
- **Formato:** PNG com fundo transparente
- **Tamanho recomendado:** 400x400px (será redimensionada para 128px de altura)

### 2. Imagem da Sala de Aula (imagem.png)
- **Local:** `projeto-carbone/public/imagem.png`
- **Descrição:** Foto de sala de aula com alunos levantando a mão
- **Formato:** PNG ou JPG
- **Tamanho recomendado:** 1920x1080px (aspect ratio 16:9)
- **Orientação:** Landscape (horizontal)

## 📁 Estrutura de Pastas

```
projeto-carbone/
├── public/
│   ├── logo-roma.png          ← Logo aqui
│   ├── classroom.jpg          ← Imagem da sala aqui
│   └── ...
└── src/
    └── ...
```

## ⚙️ Como Adicionar as Imagens

### Passo 1: Salvar as Imagens
1. Salve a logo como `logo.png`
2. Salve a foto da sala de aula como `imagem.png`

### Passo 2: Colocar na Pasta Public
1. Navegue até: `C:\Users\annyb\OneDrive\Documentos\PROJETO CARBONE\projeto-carbone\public`
2. Copie ambos os arquivos para dentro desta pasta

### Passo 3: Verificar
As imagens devem ficar assim:
- `public/logo.png`
- `public/imagem.png`

## 🎨 Especificações Técnicas

### Logo
- Dimensões: Flexível (proporção mantida)
- Peso máximo: 500KB
- Formatos aceitos: PNG, SVG (preferencial)
- Fundo: Transparente

### Imagem de Fundo
- Dimensões: Mínimo 1920x1080px
- Peso máximo: 2MB
- Formatos aceitos: JPG, PNG, WebP
- Aspect ratio: 16:9 ou similar

## ✨ Otimização (Opcional)

### Para melhor performance:

**Logo:**
```bash
# Converter para WebP (mais leve)
# Use: https://squoosh.app/
```

**Imagem de Fundo:**
```bash
# Comprimir JPG mantendo qualidade
# Use: https://tinyjpg.com/
```

## 🚀 Após Adicionar as Imagens

Execute o projeto:
```bash
cd projeto-carbone
npm run dev
```

O servidor abrirá em: `http://localhost:5173`

## 🔧 Troubleshooting

### Imagem não aparece?
1. Verifique se o nome do arquivo está correto
2. Verifique se está na pasta `public/`
3. Limpe o cache do navegador (Ctrl + Shift + R)
4. Reinicie o servidor de desenvolvimento

### Logo muito grande ou pequena?
Ajuste a altura no código `Login.tsx`:
```tsx
<img
  src="/logo.png"
  alt="ROMA Fab&Elo"
  className="h-32 mx-auto mb-6"  // Altere h-32 para h-24, h-40, etc.
/>
```

Classes disponíveis: `h-16` (64px), `h-20` (80px), `h-24` (96px), `h-32` (128px), `h-40` (160px)

---

**Nota:** As imagens na pasta `public/` são servidas diretamente sem processamento pelo Vite.
