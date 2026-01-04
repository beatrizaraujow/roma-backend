import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCarrinho } from '../contexts/CarrinhoContext';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import './Checkout.css';

interface DadosPagamento {
  metodoPagamento: 'pix' | 'cartao' | '';
  // Dados do cartão
  numeroCartao: string;
  nomeCartao: string;
  validadeCartao: string;
  cvv: string;
  parcelas: number;
  // Dados de cobrança
  cpf: string;
  telefone: string;
  // Cupom
  cupom: string;
}

export const Checkout: React.FC = () => {
  const navigate = useNavigate();
  const { itens, valorTotal, limparCarrinho, aplicarCupom, removerCupom, cupomAplicado, descontoCupom } = useCarrinho();
  const { user } = useAuth();
  const { showToast } = useToast();

  const [etapa, setEtapa] = useState<1 | 2 | 3>(1);
  const [loading, setLoading] = useState(false);
  const [cupomInput, setCupomInput] = useState('');
  const [validandoCupom, setValidandoCupom] = useState(false);
  const [inicializando, setInicializando] = useState(true);

  const [dadosPagamento, setDadosPagamento] = useState<DadosPagamento>({
    metodoPagamento: '',
    numeroCartao: '',
    nomeCartao: '',
    validadeCartao: '',
    cvv: '',
    parcelas: 1,
    cpf: '',
    telefone: '',
    cupom: '',
  });

  useEffect(() => {
    // Dar tempo para o contexto carregar
    const timer = setTimeout(() => {
      setInicializando(false);
      if (itens.length === 0) {
        showToast('Seu carrinho está vazio', 'warning');
        navigate('/dashboard');
      }
    }, 100);
    
    return () => clearTimeout(timer);
  }, [itens, navigate, showToast]);

  const formatarPreco = (preco: number) => {
    return preco.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  };

  const valorFinal = valorTotal - descontoCupom;
  const valorParcela = valorFinal / dadosPagamento.parcelas;

  const handleAplicarCupom = async () => {
    if (!cupomInput.trim()) return;
    
    setValidandoCupom(true);
    try {
      const resultado = await aplicarCupom(cupomInput);
      if (resultado.sucesso) {
        showToast(`Cupom aplicado! Desconto de ${formatarPreco(resultado.desconto)}`, 'success');
        setCupomInput('');
      } else {
        showToast(resultado.mensagem || 'Cupom inválido', 'error');
      }
    } catch (error) {
      showToast('Erro ao validar cupom', 'error');
    } finally {
      setValidandoCupom(false);
    }
  };

  const handleRemoverCupom = () => {
    removerCupom();
    showToast('Cupom removido', 'info');
  };

  const validarCartao = (numero: string) => {
    const limpo = numero.replace(/\s/g, '');
    return limpo.length === 16 && /^\d+$/.test(limpo);
  };

  const validarCVV = (cvv: string) => {
    return cvv.length === 3 && /^\d+$/.test(cvv);
  };

  const validarValidade = (validade: string) => {
    const regex = /^(0[1-9]|1[0-2])\/\d{2}$/;
    if (!regex.test(validade)) return false;
    
    const [mes, ano] = validade.split('/');
    const dataValidade = new Date(2000 + parseInt(ano), parseInt(mes) - 1);
    return dataValidade > new Date();
  };

  const formatarCartao = (valor: string) => {
    const limpo = valor.replace(/\s/g, '');
    const grupos = limpo.match(/.{1,4}/g);
    return grupos ? grupos.join(' ') : limpo;
  };

  const handleCartaoChange = (valor: string) => {
    const limpo = valor.replace(/\s/g, '');
    if (limpo.length <= 16 && /^\d*$/.test(limpo)) {
      setDadosPagamento({ ...dadosPagamento, numeroCartao: formatarCartao(limpo) });
    }
  };

  const handleValidadeChange = (valor: string) => {
    let limpo = valor.replace(/\D/g, '');
    if (limpo.length >= 2) {
      limpo = limpo.slice(0, 2) + '/' + limpo.slice(2, 4);
    }
    if (limpo.length <= 5) {
      setDadosPagamento({ ...dadosPagamento, validadeCartao: limpo });
    }
  };

  const handleCVVChange = (valor: string) => {
    if (valor.length <= 3 && /^\d*$/.test(valor)) {
      setDadosPagamento({ ...dadosPagamento, cvv: valor });
    }
  };

  const handleCPFChange = (valor: string) => {
    let limpo = valor.replace(/\D/g, '');
    if (limpo.length <= 11) {
      if (limpo.length > 9) {
        limpo = limpo.slice(0, 3) + '.' + limpo.slice(3, 6) + '.' + limpo.slice(6, 9) + '-' + limpo.slice(9);
      } else if (limpo.length > 6) {
        limpo = limpo.slice(0, 3) + '.' + limpo.slice(3, 6) + '.' + limpo.slice(6);
      } else if (limpo.length > 3) {
        limpo = limpo.slice(0, 3) + '.' + limpo.slice(3);
      }
      setDadosPagamento({ ...dadosPagamento, cpf: limpo });
    }
  };

  const handleTelefoneChange = (valor: string) => {
    let limpo = valor.replace(/\D/g, '');
    if (limpo.length <= 11) {
      if (limpo.length > 6) {
        limpo = '(' + limpo.slice(0, 2) + ') ' + limpo.slice(2, 7) + '-' + limpo.slice(7);
      } else if (limpo.length > 2) {
        limpo = '(' + limpo.slice(0, 2) + ') ' + limpo.slice(2);
      }
      setDadosPagamento({ ...dadosPagamento, telefone: limpo });
    }
  };

  const validarEtapa1 = () => {
    return dadosPagamento.cpf.length >= 14 && dadosPagamento.telefone.length >= 14;
  };

  const validarEtapa2 = () => {
    if (!dadosPagamento.metodoPagamento) return false;
    
    if (dadosPagamento.metodoPagamento === 'cartao') {
      return (
        validarCartao(dadosPagamento.numeroCartao) &&
        dadosPagamento.nomeCartao.length > 3 &&
        validarValidade(dadosPagamento.validadeCartao) &&
        validarCVV(dadosPagamento.cvv)
      );
    }
    
    return true; // PIX não precisa validação adicional
  };

  const proximaEtapa = () => {
    if (etapa === 1 && !validarEtapa1()) {
      showToast('Preencha todos os dados corretamente', 'warning');
      return;
    }
    if (etapa === 2 && !validarEtapa2()) {
      showToast('Preencha todos os dados de pagamento', 'warning');
      return;
    }
    setEtapa((prev) => Math.min(prev + 1, 3) as 1 | 2 | 3);
  };

  const voltarEtapa = () => {
    setEtapa((prev) => Math.max(prev - 1, 1) as 1 | 2 | 3);
  };

  const finalizarCompra = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:3000/api/pagamento/processar', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          itens: itens.map(item => ({ id: item.id, preco: item.preco })),
          metodoPagamento: dadosPagamento.metodoPagamento,
          dadosPagamento: {
            cpf: dadosPagamento.cpf.replace(/\D/g, ''),
            telefone: dadosPagamento.telefone.replace(/\D/g, ''),
            ...(dadosPagamento.metodoPagamento === 'cartao' && {
              cartao: {
                numero: dadosPagamento.numeroCartao.replace(/\s/g, ''),
                nome: dadosPagamento.nomeCartao,
                validade: dadosPagamento.validadeCartao,
                cvv: dadosPagamento.cvv,
              },
              parcelas: dadosPagamento.parcelas,
            }),
          },
          cupom: cupomAplicado?.codigo,
          valorTotal: valorFinal,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        limparCarrinho();
        
        if (dadosPagamento.metodoPagamento === 'pix') {
          // Redirecionar para página de pagamento PIX
          navigate('/pagamento/pix', { state: { pagamentoId: data.id, qrCode: data.qrCode, qrCodeBase64: data.qrCodeBase64 } });
        } else {
          // Redirecionar para página de sucesso
          navigate('/pagamento/sucesso', { state: { pagamentoId: data.id } });
        }
        
        showToast('Pagamento processado com sucesso!', 'success');
      } else {
        showToast(data.message || 'Erro ao processar pagamento', 'error');
      }
    } catch (error) {
      console.error('Erro ao processar pagamento:', error);
      showToast('Erro ao processar pagamento. Tente novamente.', 'error');
    } finally {
      setLoading(false);
    }
  };

  if (inicializando) {
    return (
      <div className="checkout-container">
        <div className="checkout-content">
          <div className="checkout-main">
            <div style={{ textAlign: 'center', padding: '3rem' }}>
              <div className="loading-spinner" style={{ margin: '0 auto 1rem' }}></div>
              <p>Carregando checkout...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="checkout-container">
      <div className="checkout-content">
        <div className="checkout-main">
          {/* Header com Etapas */}
          <div className="checkout-header">
            <h1>Finalizar Compra</h1>
            <div className="checkout-steps">
              <div className={`step ${etapa >= 1 ? 'active' : ''} ${etapa > 1 ? 'completed' : ''}`}>
                <div className="step-number">1</div>
                <span>Dados Pessoais</span>
              </div>
              <div className="step-divider"></div>
              <div className={`step ${etapa >= 2 ? 'active' : ''} ${etapa > 2 ? 'completed' : ''}`}>
                <div className="step-number">2</div>
                <span>Pagamento</span>
              </div>
              <div className="step-divider"></div>
              <div className={`step ${etapa >= 3 ? 'active' : ''}`}>
                <div className="step-number">3</div>
                <span>Confirmação</span>
              </div>
            </div>
          </div>

          {/* Etapa 1: Dados Pessoais */}
          {etapa === 1 && (
            <div className="checkout-step">
              <h2>Dados de Cobrança</h2>
              <div className="form-group">
                <Input label="Email" type="email" value={user?.email || ''} disabled />
              </div>
              <div className="form-group">
                <Input
                  label="CPF *"
                  type="text"
                  placeholder="000.000.000-00"
                  value={dadosPagamento.cpf}
                  onChange={(e) => handleCPFChange(e.target.value)}
                />
              </div>
              <div className="form-group">
                <Input
                  label="Telefone *"
                  type="text"
                  placeholder="(00) 00000-0000"
                  value={dadosPagamento.telefone}
                  onChange={(e) => handleTelefoneChange(e.target.value)}
                />
              </div>
              <div className="checkout-actions">
                <Button variant="secondary" onClick={() => navigate('/dashboard')}>
                  Voltar ao Carrinho
                </Button>
                <Button onClick={proximaEtapa} disabled={!validarEtapa1()}>
                  Continuar
                </Button>
              </div>
            </div>
          )}

          {/* Etapa 2: Pagamento */}
          {etapa === 2 && (
            <div className="checkout-step">
              <h2>Método de Pagamento</h2>
              
              <div className="payment-methods">
                <div
                  className={`payment-method ${dadosPagamento.metodoPagamento === 'pix' ? 'selected' : ''}`}
                  onClick={() => setDadosPagamento({ ...dadosPagamento, metodoPagamento: 'pix' })}
                >
                  <div className="payment-method-icon">🔑</div>
                  <div className="payment-method-info">
                    <h3>PIX</h3>
                    <p>Aprovação imediata</p>
                  </div>
                  {dadosPagamento.metodoPagamento === 'pix' && (
                    <div className="payment-method-check">✓</div>
                  )}
                </div>

                <div
                  className={`payment-method ${dadosPagamento.metodoPagamento === 'cartao' ? 'selected' : ''}`}
                  onClick={() => setDadosPagamento({ ...dadosPagamento, metodoPagamento: 'cartao' })}
                >
                  <div className="payment-method-icon">💳</div>
                  <div className="payment-method-info">
                    <h3>Cartão de Crédito</h3>
                    <p>Parcele em até 12x</p>
                  </div>
                  {dadosPagamento.metodoPagamento === 'cartao' && (
                    <div className="payment-method-check">✓</div>
                  )}
                </div>
              </div>

              {dadosPagamento.metodoPagamento === 'cartao' && (
                <div className="payment-form">
                  <div className="form-group">
                    <Input
                      label="Número do Cartão *"
                      type="text"
                      placeholder="0000 0000 0000 0000"
                      value={dadosPagamento.numeroCartao}
                      onChange={(e) => handleCartaoChange(e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <Input
                      label="Nome no Cartão *"
                      type="text"
                      placeholder="Nome como está no cartão"
                      value={dadosPagamento.nomeCartao}
                      onChange={(e) => setDadosPagamento({ ...dadosPagamento, nomeCartao: e.target.value.toUpperCase() })}
                    />
                  </div>
                  <div className="form-row">
                    <div className="form-group">
                      <Input
                        label="Validade *"
                        type="text"
                        placeholder="MM/AA"
                        value={dadosPagamento.validadeCartao}
                        onChange={(e) => handleValidadeChange(e.target.value)}
                      />
                    </div>
                    <div className="form-group">
                      <Input
                        label="CVV *"
                        type="text"
                        placeholder="000"
                        value={dadosPagamento.cvv}
                        onChange={(e) => handleCVVChange(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="form-group">
                    <label>Parcelas</label>
                    <select
                      className="checkout-select"
                      value={dadosPagamento.parcelas}
                      onChange={(e) => setDadosPagamento({ ...dadosPagamento, parcelas: parseInt(e.target.value) })}
                    >
                      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((p) => (
                        <option key={p} value={p}>
                          {p}x de {formatarPreco(valorParcela)} {p === 1 ? 'sem juros' : ''}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              )}

              <div className="checkout-actions">
                <Button variant="secondary" onClick={voltarEtapa}>
                  Voltar
                </Button>
                <Button onClick={proximaEtapa} disabled={!validarEtapa2()}>
                  Continuar
                </Button>
              </div>
            </div>
          )}

          {/* Etapa 3: Confirmação */}
          {etapa === 3 && (
            <div className="checkout-step">
              <h2>Confirme seus Dados</h2>
              
              <div className="confirmation-section">
                <h3>Dados de Cobrança</h3>
                <div className="confirmation-data">
                  <p><strong>Email:</strong> {user?.email}</p>
                  <p><strong>CPF:</strong> {dadosPagamento.cpf}</p>
                  <p><strong>Telefone:</strong> {dadosPagamento.telefone}</p>
                </div>
              </div>

              <div className="confirmation-section">
                <h3>Método de Pagamento</h3>
                <div className="confirmation-data">
                  {dadosPagamento.metodoPagamento === 'pix' ? (
                    <p><strong>PIX</strong> - Pagamento instantâneo</p>
                  ) : (
                    <>
                      <p><strong>Cartão de Crédito</strong></p>
                      <p>Final: **** **** **** {dadosPagamento.numeroCartao.slice(-4)}</p>
                      <p>{dadosPagamento.parcelas}x de {formatarPreco(valorParcela)}</p>
                    </>
                  )}
                </div>
              </div>

              <div className="guarantee-box">
                <div className="guarantee-icon">🛡️</div>
                <div>
                  <h4>Garantia de 7 dias</h4>
                  <p>Se não gostar dos cursos, devolvemos 100% do seu dinheiro</p>
                </div>
              </div>

              <div className="checkout-actions">
                <Button variant="secondary" onClick={voltarEtapa}>
                  Voltar
                </Button>
                <Button onClick={finalizarCompra} disabled={loading}>
                  {loading ? 'Processando...' : `Pagar ${formatarPreco(valorFinal)}`}
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Sidebar - Resumo do Pedido */}
        <div className="checkout-sidebar">
          <div className="order-summary">
            <h3>Resumo do Pedido</h3>
            
            <div className="order-items">
              {itens.map((item) => (
                <div key={item.id} className="order-item">
                  <div className="order-item-info">
                    <h4>{item.titulo}</h4>
                    <p>{item.professorNome}</p>
                  </div>
                  <span className="order-item-price">{formatarPreco(item.preco)}</span>
                </div>
              ))}
            </div>

            <div className="order-coupon">
              <div className="coupon-input-group">
                <Input
                  label=""
                  type="text"
                  placeholder="Código do cupom"
                  value={cupomInput}
                  onChange={(e) => setCupomInput(e.target.value.toUpperCase())}
                  disabled={validandoCupom || !!cupomAplicado}
                />
                {!cupomAplicado ? (
                  <Button
                    onClick={handleAplicarCupom}
                    disabled={!cupomInput.trim() || validandoCupom}
                    variant="secondary"
                  >
                    {validandoCupom ? '...' : 'Aplicar'}
                  </Button>
                ) : (
                  <Button onClick={handleRemoverCupom} variant="secondary">
                    Remover
                  </Button>
                )}
              </div>
              {cupomAplicado && (
                <div className="coupon-applied">
                  ✓ Cupom <strong>{cupomAplicado.codigo}</strong> aplicado
                </div>
              )}
            </div>

            <div className="order-totals">
              <div className="order-subtotal">
                <span>Subtotal</span>
                <span>{formatarPreco(valorTotal)}</span>
              </div>
              {descontoCupom > 0 && (
                <div className="order-discount">
                  <span>Desconto</span>
                  <span className="discount-value">-{formatarPreco(descontoCupom)}</span>
                </div>
              )}
              <div className="order-total">
                <span>Total</span>
                <span>{formatarPreco(valorFinal)}</span>
              </div>
            </div>

            <div className="security-badges">
              <div className="security-badge">
                <span>🔒</span>
                <small>Pagamento seguro</small>
              </div>
              <div className="security-badge">
                <span>✓</span>
                <small>Acesso imediato</small>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
