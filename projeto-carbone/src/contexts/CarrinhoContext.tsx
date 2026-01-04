import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';

export interface CursoCarrinho {
  id: number;
  titulo: string;
  professorNome: string;
  professorFoto: string;
  descricao: string;
  duracao: string;
  nivel: string;
  preco: number;
}

export interface Cupom {
  codigo: string;
  tipo: 'PERCENTUAL' | 'FIXO';
  valor: number;
  descricao?: string;
}

interface CarrinhoContextType {
  itens: CursoCarrinho[];
  adicionarAoCarrinho: (curso: CursoCarrinho) => void;
  removerDoCarrinho: (cursoId: number) => void;
  limparCarrinho: () => void;
  totalItens: number;
  valorTotal: number;
  cursoNoCarrinho: (cursoId: number) => boolean;
  aplicarCupom: (codigo: string) => Promise<{ sucesso: boolean; desconto: number; mensagem?: string }>;
  removerCupom: () => void;
  cupomAplicado: Cupom | null;
  descontoCupom: number;
}

const CarrinhoContext = createContext<CarrinhoContextType | undefined>(undefined);

export const CarrinhoProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [itens, setItens] = useState<CursoCarrinho[]>(() => {
    const carrinhoSalvo = localStorage.getItem('carrinho');
    return carrinhoSalvo ? JSON.parse(carrinhoSalvo) : [];
  });

  const [cupomAplicado, setCupomAplicado] = useState<Cupom | null>(() => {
    const cupomSalvo = localStorage.getItem('cupomAplicado');
    return cupomSalvo ? JSON.parse(cupomSalvo) : null;
  });

  useEffect(() => {
    localStorage.setItem('carrinho', JSON.stringify(itens));
  }, [itens]);

  useEffect(() => {
    if (cupomAplicado) {
      localStorage.setItem('cupomAplicado', JSON.stringify(cupomAplicado));
    } else {
      localStorage.removeItem('cupomAplicado');
    }
  }, [cupomAplicado]);

  const adicionarAoCarrinho = (curso: CursoCarrinho) => {
    setItens((prevItens) => {
      const jaExiste = prevItens.some((item) => item.id === curso.id);
      if (jaExiste) {
        return prevItens;
      }
      return [...prevItens, curso];
    });
  };

  const removerDoCarrinho = (cursoId: number) => {
    setItens((prevItens) => prevItens.filter((item) => item.id !== cursoId));
  };

  const limparCarrinho = () => {
    setItens([]);
  };

  const aplicarCupom = async (codigo: string): Promise<{ sucesso: boolean; desconto: number; mensagem?: string }> => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:3000/api/cupons/validar', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ codigo, valorTotal }),
      });

      const data = await response.json();

      if (response.ok && data.valido) {
        const cupom: Cupom = {
          codigo: data.cupom.codigo,
          tipo: data.cupom.tipo,
          valor: data.cupom.valor,
          descricao: data.cupom.descricao,
        };
        setCupomAplicado(cupom);
        return { sucesso: true, desconto: data.desconto };
      } else {
        return { sucesso: false, desconto: 0, mensagem: data.mensagem || 'Cupom inválido' };
      }
    } catch (error) {
      console.error('Erro ao validar cupom:', error);
      return { sucesso: false, desconto: 0, mensagem: 'Erro ao validar cupom' };
    }
  };

  const removerCupom = () => {
    setCupomAplicado(null);
  };

  const calcularDescontoCupom = (): number => {
    if (!cupomAplicado || valorTotal === 0) return 0;

    if (cupomAplicado.tipo === 'PERCENTUAL') {
      return (valorTotal * cupomAplicado.valor) / 100;
    } else {
      return Math.min(cupomAplicado.valor, valorTotal);
    }
  };

  const descontoCupom = calcularDescontoCupom();

  const cursoNoCarrinho = (cursoId: number) => {
    return itens.some((item) => item.id === cursoId);
  };

  const totalItens = itens.length;
  const valorTotal = itens.reduce((total, item) => total + item.preco, 0);

  const value: CarrinhoContextType = {
    itens,
    adicionarAoCarrinho,
    removerDoCarrinho,
    limparCarrinho,
    totalItens,
    valorTotal,
    cursoNoCarrinho,
    aplicarCupom,
    removerCupom,
    cupomAplicado,
    descontoCupom,
  };

  return <CarrinhoContext.Provider value={value}>{children}</CarrinhoContext.Provider>;
};

export const useCarrinho = (): CarrinhoContextType => {
  const context = useContext(CarrinhoContext);
  if (context === undefined) {
    throw new Error('useCarrinho deve ser usado dentro de um CarrinhoProvider');
  }
  return context;
};
