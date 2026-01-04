/**
 * Serviço de integração com Mercado Pago
 * Documentação: https://www.mercadopago.com.br/developers/pt/docs
 */

export interface DadosCartao {
  numero: string;
  nome: string;
  validade: string;
  cvv: string;
}

export interface DadosPagador {
  email: string;
  cpf: string;
  telefone: string;
  nome?: string;
}

export interface ItemPagamento {
  id: number;
  titulo: string;
  descricao?: string;
  preco: number;
  quantidade: number;
}

export interface PagamentoRequest {
  metodoPagamento: 'pix' | 'cartao';
  itens: ItemPagamento[];
  pagador: DadosPagador;
  dadosCartao?: DadosCartao;
  parcelas?: number;
  valorTotal: number;
  cupom?: string;
}

export interface PagamentoResponse {
  id: string;
  status: 'approved' | 'pending' | 'rejected' | 'cancelled';
  statusDetail: string;
  metodoPagamento: string;
  valorTotal: number;
  qrCode?: string;
  qrCodeBase64?: string;
  pixCopiaECola?: string;
  transacaoId?: string;
  dataExpiracao?: string;
  mensagem: string;
}

class MercadoPagoService {
  private apiUrl = 'http://localhost:3000/api/pagamento';
  private publicKey = import.meta.env.VITE_MERCADOPAGO_PUBLIC_KEY || '';

  /**
   * Processa um pagamento via PIX ou Cartão
   */
  async processarPagamento(dados: PagamentoRequest): Promise<PagamentoResponse> {
    try {
      const token = localStorage.getItem('token');
      
      const response = await fetch(`${this.apiUrl}/processar`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(dados),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Erro ao processar pagamento');
      }

      return await response.json();
    } catch (error) {
      console.error('Erro ao processar pagamento:', error);
      throw error;
    }
  }

  /**
   * Consulta o status de um pagamento
   */
  async consultarPagamento(pagamentoId: string): Promise<PagamentoResponse> {
    try {
      const token = localStorage.getItem('token');
      
      const response = await fetch(`${this.apiUrl}/status/${pagamentoId}`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Erro ao consultar pagamento');
      }

      return await response.json();
    } catch (error) {
      console.error('Erro ao consultar pagamento:', error);
      throw error;
    }
  }

  /**
   * Cancela um pagamento pendente
   */
  async cancelarPagamento(pagamentoId: string): Promise<{ sucesso: boolean; mensagem: string }> {
    try {
      const token = localStorage.getItem('token');
      
      const response = await fetch(`${this.apiUrl}/cancelar/${pagamentoId}`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Erro ao cancelar pagamento');
      }

      return await response.json();
    } catch (error) {
      console.error('Erro ao cancelar pagamento:', error);
      throw error;
    }
  }

  /**
   * Valida os dados de um cartão de crédito
   */
  validarCartao(numero: string): { valido: boolean; bandeira?: string } {
    const limpo = numero.replace(/\s/g, '');
    
    if (!/^\d{16}$/.test(limpo)) {
      return { valido: false };
    }

    // Algoritmo de Luhn para validação
    let soma = 0;
    let alternar = false;
    
    for (let i = limpo.length - 1; i >= 0; i--) {
      let digito = parseInt(limpo.charAt(i));
      
      if (alternar) {
        digito *= 2;
        if (digito > 9) {
          digito -= 9;
        }
      }
      
      soma += digito;
      alternar = !alternar;
    }

    const valido = soma % 10 === 0;
    
    if (!valido) {
      return { valido: false };
    }

    // Identificar bandeira
    const bandeira = this.identificarBandeira(limpo);
    
    return { valido, bandeira };
  }

  /**
   * Identifica a bandeira do cartão pelo número
   */
  private identificarBandeira(numero: string): string {
    const padroes: { [key: string]: RegExp } = {
      visa: /^4[0-9]{12}(?:[0-9]{3})?$/,
      mastercard: /^5[1-5][0-9]{14}$/,
      amex: /^3[47][0-9]{13}$/,
      elo: /^((((636368)|(438935)|(504175)|(451416)|(636297))\d{0,10})|((5067)|(4576)|(4011))\d{0,12})$/,
      hipercard: /^(606282\d{10}(\d{3})?)|(3841\d{15})$/,
    };

    for (const [bandeira, padrao] of Object.entries(padroes)) {
      if (padrao.test(numero)) {
        return bandeira;
      }
    }

    return 'desconhecida';
  }

  /**
   * Formata número do cartão
   */
  formatarNumeroCartao(numero: string): string {
    const limpo = numero.replace(/\s/g, '');
    const grupos = limpo.match(/.{1,4}/g);
    return grupos ? grupos.join(' ') : limpo;
  }

  /**
   * Valida CPF
   */
  validarCPF(cpf: string): boolean {
    const limpo = cpf.replace(/\D/g, '');
    
    if (limpo.length !== 11 || /^(\d)\1{10}$/.test(limpo)) {
      return false;
    }

    let soma = 0;
    let resto;

    for (let i = 1; i <= 9; i++) {
      soma += parseInt(limpo.substring(i - 1, i)) * (11 - i);
    }

    resto = (soma * 10) % 11;
    if (resto === 10 || resto === 11) resto = 0;
    if (resto !== parseInt(limpo.substring(9, 10))) return false;

    soma = 0;
    for (let i = 1; i <= 10; i++) {
      soma += parseInt(limpo.substring(i - 1, i)) * (12 - i);
    }

    resto = (soma * 10) % 11;
    if (resto === 10 || resto === 11) resto = 0;
    if (resto !== parseInt(limpo.substring(10, 11))) return false;

    return true;
  }

  /**
   * Gera um hash do cartão para salvar de forma segura
   */
  async gerarTokenCartao(dadosCartao: DadosCartao): Promise<string> {
    // Em produção, você usaria a API do Mercado Pago para tokenizar
    // Por enquanto, retorna um token simulado
    const encoder = new TextEncoder();
    const data = encoder.encode(JSON.stringify(dadosCartao));
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  }
}

export const mercadoPagoService = new MercadoPagoService();
