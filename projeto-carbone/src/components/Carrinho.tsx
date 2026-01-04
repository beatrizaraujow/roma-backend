import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCarrinho } from '../contexts/CarrinhoContext';
import './Carrinho.css';

export const Carrinho: React.FC = () => {
  const navigate = useNavigate();
  const { itens, removerDoCarrinho, limparCarrinho, valorTotal, totalItens } = useCarrinho();
  const [isOpen, setIsOpen] = useState(false);

  const formatarPreco = (preco: number) => {
    return preco.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  };

  const finalizarCompra = () => {
    if (itens.length === 0) return;
    setIsOpen(false);
    navigate('/checkout');
  };

  return (
    <>
      {/* Botão do Carrinho */}
      <div className="carrinho-button" onClick={() => setIsOpen(!isOpen)}>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M9 2L7.17 4H3C1.9 4 1 4.9 1 6V18C1 19.1 1.9 20 3 20H21C22.1 20 23 19.1 23 18V6C23 4.9 22.1 4 21 4H16.83L15 2H9ZM9 18C7.9 18 7 17.1 7 16C7 14.9 7.9 14 9 14C10.1 14 11 14.9 11 16C11 17.1 10.1 18 9 18ZM20 18C18.9 18 18 17.1 18 16C18 14.9 18.9 14 20 14C21.1 14 22 14.9 22 16C22 17.1 21.1 18 20 18Z" fill="currentColor"/>
        </svg>
        {totalItens > 0 && <span className="carrinho-badge">{totalItens}</span>}
      </div>

      {/* Painel do Carrinho */}
      {isOpen && (
        <>
          <div className="carrinho-overlay" onClick={() => setIsOpen(false)} />
          <div className="carrinho-panel">
            <div className="carrinho-header">
              <h2>Carrinho de Compras</h2>
              <button className="carrinho-close" onClick={() => setIsOpen(false)}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </div>

            <div className="carrinho-content">
              {itens.length === 0 ? (
                <div className="carrinho-vazio">
                  <svg width="64" height="64" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M9 2L7.17 4H3C1.9 4 1 4.9 1 6V18C1 19.1 1.9 20 3 20H21C22.1 20 23 19.1 23 18V6C23 4.9 22.1 4 21 4H16.83L15 2H9Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <p>Seu carrinho está vazio</p>
                  <span>Adicione cursos para começar!</span>
                </div>
              ) : (
                <div className="carrinho-itens">
                  {itens.map((item) => (
                    <div key={item.id} className="carrinho-item">
                      <div className="carrinho-item-info">
                        <div className="carrinho-item-professor">
                          <img src={item.professorFoto} alt={item.professorNome} />
                        </div>
                        <div className="carrinho-item-detalhes">
                          <h4>{item.titulo}</h4>
                          <p className="carrinho-item-professor-nome">Por {item.professorNome}</p>
                          <div className="carrinho-item-meta">
                            <span className={`nivel-badge ${item.nivel.toLowerCase()}`}>{item.nivel}</span>
                            <span className="duracao-badge">{item.duracao}</span>
                          </div>
                        </div>
                      </div>
                      <div className="carrinho-item-acao">
                        <p className="carrinho-item-preco">{formatarPreco(item.preco)}</p>
                        <button 
                          className="carrinho-item-remover"
                          onClick={() => removerDoCarrinho(item.id)}
                        >
                          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M2.5 5H4.16667H17.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                            <path d="M15.8333 5V16.6667C15.8333 17.1087 15.6577 17.5326 15.3452 17.8452C15.0326 18.1577 14.6087 18.3333 14.1667 18.3333H5.83333C5.39131 18.3333 4.96738 18.1577 4.65482 17.8452C4.34226 17.5326 4.16667 17.1087 4.16667 16.6667V5M6.66667 5V3.33333C6.66667 2.89131 6.84226 2.46738 7.15482 2.15482C7.46738 1.84226 7.89131 1.66667 8.33333 1.66667H11.6667C12.1087 1.66667 12.5326 1.84226 12.8452 2.15482C13.1577 2.46738 13.3333 2.89131 13.3333 3.33333V5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {itens.length > 0 && (
              <div className="carrinho-footer">
                <div className="carrinho-resumo">
                  <div className="carrinho-total">
                    <span>Total ({totalItens} {totalItens === 1 ? 'curso' : 'cursos'})</span>
                    <strong>{formatarPreco(valorTotal)}</strong>
                  </div>
                  <button className="carrinho-limpar" onClick={limparCarrinho}>
                    Limpar Carrinho
                  </button>
                </div>
                <button className="carrinho-finalizar" onClick={finalizarCompra}>
                  Finalizar Compra
                </button>
              </div>
            )}
          </div>
        </>
      )}
    </>
  );
};
