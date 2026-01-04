# 📸 Como Adicionar as Imagens

## Passos Rápidos:

### 1️⃣ Localização
Navegue até a pasta:
```
C:\Users\annyb\OneDrive\Documentos\PROJETO CARBONE\projeto-carbone\public
```

### 2️⃣ Adicione Estas Imagens:

**Logo:**
- Nome do arquivo: `logo.png`
- Onde colocar: `projeto-carbone/public/logo.png`
- Aparece: Acima do texto "BEM-VINDO(A)"

**Imagem de Fundo:**
- Nome do arquivo: `imagem.png`
- Onde colocar: `projeto-carbone/public/imagem.png`
- Aparece: Lado esquerdo da tela (split-screen)

### 3️⃣ Estrutura Final:

```
projeto-carbone/
├── public/
│   ├── logo.png          ← Sua logo aqui
│   ├── imagem.png        ← Sua imagem de fundo aqui
│   ├── manifest.json
│   └── sw.js
└── src/
    └── ...
```

### 4️⃣ Após Adicionar:

1. Salve os arquivos na pasta `public/`
2. Volte ao navegador (http://localhost:5173)
3. Pressione **Ctrl + R** para recarregar
4. As imagens aparecerão automaticamente!

---

## ✅ Checklist:

- [ ] `logo.png` salvo em `public/`
- [ ] `imagem.png` salvo em `public/`
- [ ] Navegador recarregado
- [ ] Imagens aparecendo corretamente

---

**Nota:** O servidor já está configurado para servir arquivos da pasta `public/` automaticamente. Não precisa reiniciar nada!
