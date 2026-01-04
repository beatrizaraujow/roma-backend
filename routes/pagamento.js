// Rotas de Pagamento para Mercado Pago
import express from 'express';
import mercadopago from 'mercadopago';
import { verificarToken } from '../middleware/auth.js';
import { enviarEmailConfirmacao } from '../services/emailService.js';

const router = express.Router();

// Configurar Mercado Pago
mercadopago.configure({
  access_token: process.env.MERCADOPAGO_ACCESS_TOKEN || '',
});

// Modelo de Cupons (simulado - em produção usar banco de dados)
const cuponsValidos = [
  { codigo: 'BEMVINDO10', tipo: 'PERCENTUAL', valor: 10, descricao: '10% de desconto', ativo: true },
  { codigo: 'PRIMEIRACOMPRA', tipo: 'PERCENTUAL', valor: 15, descricao: '15% de desconto na primeira compra', ativo: true },
  { codigo: 'NATAL50', tipo: 'FIXO', valor: 50, descricao: 'R$ 50 de desconto', ativo: true },
  { codigo: 'BLACK30', tipo: 'PERCENTUAL', valor: 30, descricao: '30% de desconto', ativo: true },
];

// Validar cupom
router.post('/cupons/validar', verificarToken, async (req, res) => {
  try {
    const { codigo, valorTotal } = req.body;

    if (!codigo) {
      return res.status(400).json({ valido: false, mensagem: 'Código do cupom é obrigatório' });
    }

    const cupom = cuponsValidos.find(
      (c) => c.codigo.toUpperCase() === codigo.toUpperCase() && c.ativo
    );

    if (!cupom) {
      return res.status(404).json({ valido: false, mensagem: 'Cupom inválido ou expirado' });
    }

    let desconto = 0;
    if (cupom.tipo === 'PERCENTUAL') {
      desconto = (valorTotal * cupom.valor) / 100;
    } else {
      desconto = Math.min(cupom.valor, valorTotal);
    }

    res.json({
      valido: true,
      cupom,
      desconto,
      mensagem: `Cupom aplicado com sucesso! Desconto de R$ ${desconto.toFixed(2)}`,
    });
  } catch (error) {
    console.error('Erro ao validar cupom:', error);
    res.status(500).json({ valido: false, mensagem: 'Erro ao validar cupom' });
  }
});

// Processar pagamento
router.post('/processar', verificarToken, async (req, res) => {
  try {
    const { itens, metodoPagamento, dadosPagamento, cupom, valorTotal } = req.body;
    const userId = req.userId;
    const userEmail = req.userEmail;

    if (!itens || itens.length === 0) {
      return res.status(400).json({ message: 'Nenhum item no carrinho' });
    }

    if (!metodoPagamento || !['pix', 'cartao'].includes(metodoPagamento)) {
      return res.status(400).json({ message: 'Método de pagamento inválido' });
    }

    // Preparar dados do pagamento
    const payment_data = {
      transaction_amount: valorTotal,
      description: `Compra de ${itens.length} curso(s)`,
      payment_method_id: metodoPagamento === 'pix' ? 'pix' : 'credit_card',
      payer: {
        email: userEmail,
        identification: {
          type: 'CPF',
          number: dadosPagamento.cpf,
        },
      },
    };

    // Adicionar dados específicos do método
    if (metodoPagamento === 'cartao') {
      payment_data.token = dadosPagamento.cartao.token; // Token gerado pelo Mercado Pago.js
      payment_data.installments = dadosPagamento.parcelas || 1;
      payment_data.payment_method_id = 'credit_card';
    }

    // Criar pagamento no Mercado Pago
    const payment = await mercadopago.payment.create(payment_data);

    // Salvar no banco de dados (simulado)
    const pagamento = {
      id: payment.body.id,
      userId,
      itens,
      metodoPagamento,
      valorTotal,
      cupom,
      status: payment.body.status,
      statusDetail: payment.body.status_detail,
      transacaoId: payment.body.id,
      dataCriacao: new Date(),
    };

    // Se for PIX, incluir QR Code
    if (metodoPagamento === 'pix') {
      const qrCodeData = payment.body.point_of_interaction?.transaction_data;
      
      return res.json({
        id: payment.body.id,
        status: payment.body.status,
        metodoPagamento: 'pix',
        qrCode: qrCodeData?.qr_code,
        qrCodeBase64: qrCodeData?.qr_code_base64,
        pixCopiaECola: qrCodeData?.qr_code,
        mensagem: 'Pagamento PIX gerado com sucesso',
      });
    }

    // Se for cartão e foi aprovado
    if (payment.body.status === 'approved') {
      // Enviar email de confirmação
      await enviarEmailConfirmacao(userEmail, {
        itens,
        valorTotal,
        pagamentoId: payment.body.id,
      });

      return res.json({
        id: payment.body.id,
        status: 'approved',
        metodoPagamento: 'cartao',
        transacaoId: payment.body.id,
        mensagem: 'Pagamento aprovado com sucesso!',
      });
    }

    // Outros status
    res.json({
      id: payment.body.id,
      status: payment.body.status,
      statusDetail: payment.body.status_detail,
      metodoPagamento,
      mensagem: 'Pagamento processado',
    });
  } catch (error) {
    console.error('Erro ao processar pagamento:', error);
    res.status(500).json({
      message: 'Erro ao processar pagamento',
      error: error.message,
    });
  }
});

// Consultar status do pagamento
router.get('/status/:pagamentoId', verificarToken, async (req, res) => {
  try {
    const { pagamentoId } = req.params;

    const payment = await mercadopago.payment.get(pagamentoId);

    res.json({
      id: payment.body.id,
      status: payment.body.status,
      statusDetail: payment.body.status_detail,
      metodoPagamento: payment.body.payment_type_id,
      valorTotal: payment.body.transaction_amount,
      dataCriacao: payment.body.date_created,
      dataAtualizacao: payment.body.date_last_updated,
    });
  } catch (error) {
    console.error('Erro ao consultar pagamento:', error);
    res.status(500).json({ message: 'Erro ao consultar pagamento' });
  }
});

// Webhook para notificações do Mercado Pago
router.post('/webhook', async (req, res) => {
  try {
    const { type, data } = req.body;

    if (type === 'payment') {
      const paymentId = data.id;
      const payment = await mercadopago.payment.get(paymentId);

      console.log('Pagamento atualizado:', {
        id: payment.body.id,
        status: payment.body.status,
        email: payment.body.payer.email,
      });

      // Se aprovado, enviar email
      if (payment.body.status === 'approved') {
        // Buscar dados do pedido no banco
        // Enviar email de confirmação
        await enviarEmailConfirmacao(payment.body.payer.email, {
          pagamentoId: payment.body.id,
          valorTotal: payment.body.transaction_amount,
        });
      }
    }

    res.sendStatus(200);
  } catch (error) {
    console.error('Erro no webhook:', error);
    res.sendStatus(500);
  }
});

// Cancelar pagamento
router.post('/cancelar/:pagamentoId', verificarToken, async (req, res) => {
  try {
    const { pagamentoId } = req.params;

    await mercadopago.payment.cancel(pagamentoId);

    res.json({
      sucesso: true,
      mensagem: 'Pagamento cancelado com sucesso',
    });
  } catch (error) {
    console.error('Erro ao cancelar pagamento:', error);
    res.status(500).json({
      sucesso: false,
      mensagem: 'Erro ao cancelar pagamento',
    });
  }
});

// Listar cupons disponíveis (apenas admin)
router.get('/cupons', verificarToken, (req, res) => {
  res.json({
    cupons: cuponsValidos.filter((c) => c.ativo),
  });
});

export default router;
