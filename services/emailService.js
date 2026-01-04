// Serviço de Email usando Nodemailer
import nodemailer from 'nodemailer';

// Configurar transporte de email
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.EMAIL_PORT || '587'),
  secure: false, // true para 465, false para outras portas
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Template de email de confirmação
const templateConfirmacao = (dados) => {
  const { nome, itens, valorTotal, pagamentoId } = dados;
  
  const listaItens = itens
    .map(
      (item) =>
        `<tr>
          <td style="padding: 12px; border-bottom: 1px solid #e5e7eb;">${item.titulo}</td>
          <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; text-align: right;">R$ ${item.preco.toFixed(2)}</td>
        </tr>`
    )
    .join('');

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Confirmação de Compra</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f3f4f6;">
      <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f3f4f6; padding: 40px 0;">
        <tr>
          <td align="center">
            <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 12px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
              <!-- Header -->
              <tr>
                <td style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px; text-align: center; border-radius: 12px 12px 0 0;">
                  <h1 style="color: #ffffff; margin: 0; font-size: 28px;">✓ Compra Confirmada!</h1>
                </td>
              </tr>
              
              <!-- Content -->
              <tr>
                <td style="padding: 40px;">
                  <p style="color: #333; font-size: 16px; line-height: 1.6; margin: 0 0 20px;">
                    Olá${nome ? ' ' + nome : ''},
                  </p>
                  <p style="color: #333; font-size: 16px; line-height: 1.6; margin: 0 0 30px;">
                    Sua compra foi confirmada com sucesso! Você já pode acessar seus cursos na plataforma.
                  </p>
                  
                  <!-- Resumo do Pedido -->
                  <h2 style="color: #333; font-size: 20px; margin: 0 0 20px;">Resumo do Pedido</h2>
                  <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 30px;">
                    <thead>
                      <tr>
                        <th style="padding: 12px; background-color: #f9fafb; text-align: left; border-bottom: 2px solid #e5e7eb;">Curso</th>
                        <th style="padding: 12px; background-color: #f9fafb; text-align: right; border-bottom: 2px solid #e5e7eb;">Valor</th>
                      </tr>
                    </thead>
                    <tbody>
                      ${listaItens}
                      <tr>
                        <td style="padding: 16px 12px; font-weight: bold; font-size: 18px;">Total</td>
                        <td style="padding: 16px 12px; font-weight: bold; font-size: 18px; text-align: right; color: #667eea;">
                          R$ ${valorTotal.toFixed(2)}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                  
                  <!-- Informações da Transação -->
                  <div style="background-color: #f0f9ff; border: 1px solid #bae6fd; border-radius: 8px; padding: 20px; margin-bottom: 30px;">
                    <p style="margin: 0; color: #0c4a6e; font-size: 14px;">
                      <strong>ID da Transação:</strong> ${pagamentoId}
                    </p>
                  </div>
                  
                  <!-- Botão CTA -->
                  <div style="text-align: center; margin: 30px 0;">
                    <a href="${process.env.APP_URL || 'http://localhost:5173'}/dashboard" 
                       style="display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
                              color: #ffffff; text-decoration: none; padding: 16px 40px; border-radius: 8px; 
                              font-size: 16px; font-weight: 600;">
                      Acessar Meus Cursos
                    </a>
                  </div>
                  
                  <!-- Garantia -->
                  <div style="background-color: #f0fdf4; border: 2px solid #86efac; border-radius: 12px; padding: 20px; margin-top: 30px;">
                    <h3 style="color: #166534; margin: 0 0 10px; font-size: 16px;">🛡️ Garantia de 7 dias</h3>
                    <p style="color: #15803d; margin: 0; font-size: 14px; line-height: 1.6;">
                      Não ficou satisfeito? Você tem 7 dias para solicitar o reembolso completo, sem perguntas!
                    </p>
                  </div>
                </td>
              </tr>
              
              <!-- Footer -->
              <tr>
                <td style="background-color: #f9fafb; padding: 30px; text-align: center; border-radius: 0 0 12px 12px; border-top: 1px solid #e5e7eb;">
                  <p style="color: #6b7280; font-size: 14px; margin: 0 0 10px;">
                    Precisa de ajuda? Entre em contato conosco.
                  </p>
                  <p style="color: #9ca3af; font-size: 12px; margin: 0;">
                    © ${new Date().getFullYear()} Projeto Carbone. Todos os direitos reservados.
                  </p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;
};

// Enviar email de confirmação
export const enviarEmailConfirmacao = async (email, dados) => {
  try {
    const info = await transporter.sendMail({
      from: `"Projeto Carbone" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: '✓ Compra Confirmada - Seus Cursos Estão Disponíveis!',
      html: templateConfirmacao(dados),
    });

    console.log('Email enviado:', info.messageId);
    return { sucesso: true, messageId: info.messageId };
  } catch (error) {
    console.error('Erro ao enviar email:', error);
    return { sucesso: false, erro: error.message };
  }
};

// Verificar configuração do email
export const verificarConfiguracao = async () => {
  try {
    await transporter.verify();
    console.log('✓ Servidor de email configurado corretamente');
    return true;
  } catch (error) {
    console.error('✗ Erro na configuração do email:', error);
    return false;
  }
};

export default {
  enviarEmailConfirmacao,
  verificarConfiguracao,
};
