# 💳 Sistema de Pagamento - Guia de Implementação

## 📋 Índice
1. [Visão Geral](#visão-geral)
2. [Configuração Inicial](#configuração-inicial)
3. [Funcionalidades Implementadas](#funcionalidades-implementadas)
4. [Como Testar](#como-testar)
5. [Integração com Mercado Pago](#integração-com-mercado-pago)
6. [Sistema de Cupons](#sistema-de-cupons)
7. [Email de Confirmação](#email-de-confirmação)
8. [Troubleshooting](#troubleshooting)

---

## 🎯 Visão Geral

Sistema completo de pagamento com:
- ✅ Checkout em 1 página com validação em tempo real
- ✅ PIX e Cartão de Crédito via Mercado Pago
- ✅ Sistema de cupons de desconto
- ✅ Email de confirmação automático
- ✅ Parcelamento em até 12x
- ✅ Garantia de 7 dias

---

## ⚙️ Configuração Inicial

### 1. Instalar Dependências

#### Backend
```bash
cd "PROJETO CARBONE"
npm install mercadopago nodemailer dotenv express
```

#### Frontend
```bash
cd projeto-carbone
npm install
```

### 2. Configurar Variáveis de Ambiente

#### Backend (.env)
```env
# Copiar do .env.example e preencher
MERCADOPAGO_ACCESS_TOKEN=seu_token_aqui
MERCADOPAGO_PUBLIC_KEY=sua_public_key_aqui
EMAIL_USER=seu_email@gmail.com
EMAIL_PASS=sua_senha_app_aqui
JWT_SECRET=sua_chave_secreta
```

#### Frontend (projeto-carbone/.env)
```env
VITE_MERCADOPAGO_PUBLIC_KEY=sua_public_key_aqui
VITE_API_URL=http://localhost:3000
```

### 3. Obter Credenciais do Mercado Pago

1. Acesse: https://www.mercadopago.com.br/developers/panel/app
2. Crie uma aplicação
3. Copie o **Access Token** e a **Public Key**
4. **IMPORTANTE**: Use as credenciais de **TEST** para desenvolvimento

### 4. Configurar Email (Gmail)

1. Acesse: https://myaccount.google.com/apppasswords
2. Crie uma "Senha de App" para o projeto
3. Use essa senha no `EMAIL_PASS` (não use sua senha do Gmail!)

### 5. Atualizar server.js

Adicione no seu `server.js`:

```javascript
import pagamentoRoutes from './routes/pagamento.js';
import { verificarConfiguracao } from './services/emailService.js';

// Após outras configurações
app.use('/api/pagamento', pagamentoRoutes);

// Verificar email ao iniciar
verificarConfiguracao();
```

---

## 🚀 Funcionalidades Implementadas

### 1. Página de Checkout (`/checkout`)
- **3 etapas intuitivas**: Dados → Pagamento → Confirmação
- **Validação em tempo real** de CPF, cartão, CVV
- **Formatação automática** de campos
- **Resumo do pedido** sempre visível
- **Aplicação de cupons** com feedback visual

### 2. Pagamento PIX (`/pagamento/pix`)
- **QR Code** gerado automaticamente
- **Código copia e cola**
- **Timer de 10 minutos**
- **Verificação automática** de pagamento a cada 3s
- **Feedback visual** de status

### 3. Página de Sucesso (`/pagamento/sucesso`)
- **Animação de confirmação**
- **Detalhes da transação**
- **Acesso imediato aos cursos**
- **Informações sobre garantia**

### 4. Sistema de Cupons
Cupons pré-configurados:
- `BEMVINDO10` - 10% de desconto
- `PRIMEIRACOMPRA` - 15% de desconto
- `NATAL50` - R$ 50 fixo
- `BLACK30` - 30% de desconto

### 5. Email de Confirmação
- **Template HTML profissional**
- **Resumo do pedido**
- **Link direto para os cursos**
- **Informações de garantia**

---

## 🧪 Como Testar

### Fluxo Completo

1. **Adicionar Cursos ao Carrinho**
   ```
   Dashboard → Selecionar Curso → Adicionar ao Carrinho
   ```

2. **Abrir Carrinho**
   ```
   Clicar no ícone do carrinho (canto superior)
   ```

3. **Finalizar Compra**
   ```
   Carrinho → Finalizar Compra → Redireciona para /checkout
   ```

4. **Preencher Dados (Etapa 1)**
   ```
   CPF: 123.456.789-00 (qualquer um para teste)
   Telefone: (11) 98765-4321
   ```

5. **Escolher Pagamento (Etapa 2)**

   **Opção A - PIX:**
   ```
   Selecionar PIX → Continuar
   ```
   
   **Opção B - Cartão:**
   ```
   Número: 5031 4332 1540 6351 (Mastercard de teste)
   Nome: APROVADO (usar este nome para aprovação)
   Validade: 12/25
   CVV: 123
   Parcelas: Escolher
   ```

6. **Confirmar (Etapa 3)**
   ```
   Revisar dados → Pagar
   ```

7. **Testar Cupom**
   ```
   Na sidebar: Digite "BEMVINDO10" → Aplicar
   Desconto aparece no total
   ```

### Cartões de Teste Mercado Pago

| Cartão | Número | Nome | Resultado |
|--------|--------|------|-----------|
| **Mastercard** | 5031 4332 1540 6351 | APROVADO | ✅ Aprovado |
| **Visa** | 4235 6477 2802 5682 | APROVADO | ✅ Aprovado |
| **Mastercard** | 5031 4332 1540 6351 | OTROLUGAR | ❌ Recusado |

**CVV**: Qualquer 3 dígitos  
**Validade**: Qualquer data futura

---

## 🔗 Integração com Mercado Pago

### Endpoints Implementados

```javascript
// Backend (http://localhost:3000/api/pagamento)

POST /processar              // Processar pagamento PIX ou Cartão
POST /cupons/validar         // Validar cupom de desconto
GET  /status/:pagamentoId    // Consultar status do pagamento
POST /cancelar/:pagamentoId  // Cancelar pagamento
POST /webhook                // Receber notificações do MP
GET  /cupons                 // Listar cupons disponíveis
```

### Fluxo de Pagamento

```mermaid
Usuário → Checkout → Backend → Mercado Pago
                                    ↓
            Email ← Backend ← Webhook MP
```

---

## 🎟️ Sistema de Cupons

### Tipos de Cupom

1. **PERCENTUAL**: Desconto em % do total
2. **FIXO**: Valor fixo em R$

### Adicionar Novos Cupons

Edite `routes/pagamento.js`:

```javascript
const cuponsValidos = [
  {
    codigo: 'SEUCUPOM',
    tipo: 'PERCENTUAL', // ou 'FIXO'
    valor: 20, // 20% ou R$ 20
    descricao: 'Descrição do cupom',
    ativo: true
  },
];
```

### Validação de Cupom

```javascript
// Frontend
const { aplicarCupom } = useCarrinho();
const resultado = await aplicarCupom('BEMVINDO10');

if (resultado.sucesso) {
  // Cupom válido, desconto aplicado
} else {
  // Cupom inválido
}
```

---

## 📧 Email de Confirmação

### Personalizar Template

Edite `services/emailService.js`:

```javascript
const templateConfirmacao = (dados) => {
  // Modificar HTML aqui
};
```

### Testar Email Localmente

```javascript
import { enviarEmailConfirmacao } from './services/emailService.js';

await enviarEmailConfirmacao('teste@email.com', {
  nome: 'Teste',
  itens: [...],
  valorTotal: 100,
  pagamentoId: '123'
});
```

---

## 🐛 Troubleshooting

### Erro: "Mercado Pago Access Token inválido"
**Solução**: 
- Verifique se copiou o token correto
- Use credenciais de **TEST** para desenvolvimento
- Renicie o servidor após alterar o .env

### Erro: "Email não está sendo enviado"
**Soluções**:
1. Verificar senha de app do Gmail
2. Ativar "Acesso a apps menos seguros" (se necessário)
3. Usar servidor SMTP alternativo (Mailtrap, SendGrid)

```javascript
// Testar configuração
verificarConfiguracao(); // Em emailService.js
```

### Erro: "Pagamento PIX não atualiza status"
**Solução**:
- Verificar se o pagamento foi realmente aprovado no Mercado Pago
- Consultar logs do backend para ver se o webhook está funcionando
- Em teste, o PIX pode demorar alguns minutos

### Erro: "Cupom não está sendo aplicado"
**Solução**:
1. Verificar se o código está correto (case-sensitive)
2. Verificar se `ativo: true` no cuponsValidos
3. Verificar console do navegador para erros

### Erro: "CORS ao fazer requisição"
**Solução**:
Adicione no `server.js`:

```javascript
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));
```

---

## 📱 Próximos Passos Recomendados

### Fase 2 - Otimizações (2-3 semanas)
1. ✅ Salvar pagamentos no banco de dados (Prisma)
2. ✅ Histórico de compras do usuário
3. ✅ Recuperação de carrinho abandonado
4. ✅ Analytics de conversão

### Fase 3 - Avançado (3-4 semanas)
1. ✅ Assinaturas recorrentes
2. ✅ One-click purchase
3. ✅ Boleto bancário
4. ✅ Parcelamento sem juros configurável

---

## 📞 Suporte

### Documentação Oficial
- **Mercado Pago**: https://www.mercadopago.com.br/developers/pt/docs
- **Nodemailer**: https://nodemailer.com/about/
- **React Router**: https://reactrouter.com/

### Links Úteis
- [Dashboard Mercado Pago](https://www.mercadopago.com.br/developers/panel)
- [Teste de Cartões](https://www.mercadopago.com.br/developers/pt/docs/checkout-api/testing)
- [Senha de App Gmail](https://myaccount.google.com/apppasswords)

---

## ✅ Checklist de Produção

Antes de colocar em produção:

- [ ] Trocar credenciais de TEST para PRODUÇÃO
- [ ] Configurar webhook no painel do Mercado Pago
- [ ] Configurar domínio real no APP_URL
- [ ] Adicionar SSL (HTTPS)
- [ ] Configurar email corporativo
- [ ] Testar todos os fluxos de pagamento
- [ ] Implementar logs e monitoramento
- [ ] Configurar backup do banco de dados
- [ ] Adicionar política de privacidade e termos
- [ ] Testar em diferentes navegadores

---

**Desenvolvido para Projeto Carbone** 🚀
*Última atualização: 29/12/2025*
