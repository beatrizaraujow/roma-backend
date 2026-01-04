import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Sidebar } from '../components/Sidebar';
import { Carrinho } from '../components/Carrinho';
import { useCarrinho } from '../contexts/CarrinhoContext';
import './Professores.css';

interface Professor {
  id: number;
  nome: string;
  foto: string;
  especialidade: string;
  area: string;
  bio: string;
  cursos: Curso[];
}

interface Curso {
  id: number;
  titulo: string;
  descricao: string;
  duracao: string;
  nivel: string;
  preco: number;
}

// Dados mockados de professores
const professores: Professor[] = [
  {
    id: 1,
    nome: 'Lethycia Silva',
    foto: '/transferir.png',
    especialidade: 'Linguagens e Literatura',
    area: 'Linguagens',
    bio: 'Professora especializada em Língua Portuguesa e Literatura Brasileira com mais de 10 anos de experiência em ensino.',
    cursos: [
      {
        id: 101,
        titulo: 'Gramática Avançada',
        descricao: 'Curso completo de gramática da língua portuguesa',
        duracao: '40 horas',
        nivel: 'Avançado',
        preco: 299.90
      },
      {
        id: 102,
        titulo: 'Literatura Brasileira',
        descricao: 'Análise das principais obras da literatura nacional',
        duracao: '30 horas',
        nivel: 'Intermediário',
        preco: 249.90
      },
      {
        id: 103,
        titulo: 'Redação para ENEM',
        descricao: 'Técnicas e práticas para redação dissertativa',
        duracao: '25 horas',
        nivel: 'Básico',
        preco: 199.90
      }
    ]
  },
  {
    id: 2,
    nome: 'Carlos Santos',
    foto: '/Retrato Corporativo _ Foto para LinkedIn _ Perfil Profissional _ São Paulo_BR.png',
    especialidade: 'Matemática',
    area: 'Matemática',
    bio: 'Professor de Matemática com doutorado em Educação Matemática e experiência em preparação para vestibulares.',
    cursos: [
      {
        id: 201,
        titulo: 'Cálculo I',
        descricao: 'Fundamentos de cálculo diferencial e integral',
        duracao: '50 horas',
        nivel: 'Avançado',
        preco: 349.90
      },
      {
        id: 202,
        titulo: 'Álgebra Linear',
        descricao: 'Vetores, matrizes e sistemas lineares',
        duracao: '45 horas',
        nivel: 'Intermediário',
        preco: 299.90
      }
    ]
  },
  {
    id: 3,
    nome: 'Marina Costa',
    foto: '/Teacher.png',
    especialidade: 'Ciências Humanas',
    area: 'Ciências Humanas',
    bio: 'Historiadora e pedagoga com mestrado em História Social. Apaixonada por ensinar e compartilhar conhecimento.',
    cursos: [
      {
        id: 301,
        titulo: 'História do Brasil',
        descricao: 'Da colonização aos dias atuais',
        duracao: '35 horas',
        nivel: 'Intermediário',
        preco: 249.90
      },
      {
        id: 302,
        titulo: 'Geografia Política',
        descricao: 'Geopolítica mundial contemporânea',
        duracao: '30 horas',
        nivel: 'Intermediário',
        preco: 229.90
      }
    ]
  },
  {
    id: 4,
    nome: 'admin ROMA',
    foto: '/Sublogo.png',
    especialidade: 'Administração da Plataforma',
    area: 'Administração',
    bio: 'Equipe administrativa da plataforma ROMA, responsável pela gestão e suporte aos alunos e professores.',
    cursos: []
  }
];

export const Professores: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [areaSelecionada, setAreaSelecionada] = useState<string | null>(searchParams.get('area'));
  const [professorSelecionado, setProfessorSelecionado] = useState<Professor | null>(null);

  // Filtrar professores por área
  const professoresFiltrados = areaSelecionada
    ? professores.filter((prof) => prof.area === areaSelecionada)
    : professores;

  // Atualizar área quando os parâmetros da URL mudarem
  useEffect(() => {
    const area = searchParams.get('area');
    setAreaSelecionada(area);
    if (area) {
      const primeiroProfessor = professores.find((prof) => prof.area === area);
      setProfessorSelecionado(primeiroProfessor || null);
    } else {
      setProfessorSelecionado(professores[0]);
    }
  }, [searchParams]);

  // Inicializar com o primeiro professor
  useEffect(() => {
    if (!professorSelecionado && professoresFiltrados.length > 0) {
      setProfessorSelecionado(professoresFiltrados[0]);
    }
  }, [professoresFiltrados]);

  const handleAreaClick = (area: string) => {
    setAreaSelecionada(area);
    setSearchParams({ area });
    const primeiroProfessor = professores.find((prof) => prof.area === area);
    setProfessorSelecionado(primeiroProfessor || null);
  };

  const getInitials = (nome: string) => {
    const names = nome.split(' ');
    return names[0].charAt(0).toUpperCase() + (names[1]?.charAt(0).toUpperCase() || '');
  };

  const formatarPreco = (preco: number) => {
    return preco.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  };

  const { adicionarAoCarrinho, cursoNoCarrinho } = useCarrinho();

  const handleAdicionarCarrinho = (curso: Curso, professor: Professor) => {
    adicionarAoCarrinho({
      id: curso.id,
      titulo: curso.titulo,
      professorNome: professor.nome,
      professorFoto: professor.foto,
      descricao: curso.descricao,
      duracao: curso.duracao,
      nivel: curso.nivel,
      preco: curso.preco,
    });
  };

  return (
    <div className="professores-wrapper">
      <Sidebar onAreaClick={handleAreaClick} selectedArea={areaSelecionada || undefined} />
      <Carrinho />
      
      <div className="professores-main">
        {/* Header */}
        <div className="professores-header">
          <div className="professores-logo">
            <img src="/Sublogo.png" alt="ROMA" className="logo-image" />
          </div>
          <nav className="professores-nav">
            <a href="#" className="nav-link">Como Funciona</a>
            <a href="#" className="nav-link">Recursos</a>
            <a href="#" className="nav-link">Suporte</a>
          </nav>
        </div>

        {/* Content */}
        <div className="professores-content">
          {/* Lista de Professores */}
          <div className="professores-lista">
            <h2 className="professores-titulo">
              {areaSelecionada ? `Professores - ${areaSelecionada}` : 'Professores'}
            </h2>
            {professoresFiltrados.length > 0 ? (
              <div className="professores-cards">
                {professoresFiltrados.map((prof) => (
                <div
                  key={prof.id}
                  className={`professor-card ${professorSelecionado?.id === prof.id ? 'active' : ''}`}
                  onClick={() => setProfessorSelecionado(prof)}
                >
                  <div className="professor-card-avatar">
                    {prof.foto ? (
                      <img src={prof.foto} alt={prof.nome} />
                    ) : (
                      <div className="professor-card-avatar-placeholder">
                        {getInitials(prof.nome)}
                      </div>
                    )}
                  </div>
                  <div className="professor-card-info">
                    <h3>{prof.nome}</h3>
                    <p>{prof.especialidade}</p>
                  </div>
                </div>
                ))}
              </div>
            ) : (
              <div className="professores-empty">
                <p>Nenhum professor encontrado para esta área.</p>
              </div>
            )}
          </div>

          {/* Detalhes do Professor */}
          {professorSelecionado && (
            <div className="professor-detalhes">
              <div className="professor-detalhes-header">
                <div className="professor-detalhes-avatar">
                  {professorSelecionado.foto ? (
                    <img src={professorSelecionado.foto} alt={professorSelecionado.nome} />
                  ) : (
                    <div className="professor-detalhes-avatar-placeholder">
                      {getInitials(professorSelecionado.nome)}
                    </div>
                  )}
                </div>
                <div className="professor-detalhes-info">
                  <h2>{professorSelecionado.nome}</h2>
                  <p className="professor-especialidade">{professorSelecionado.especialidade}</p>
                  <p className="professor-bio">{professorSelecionado.bio}</p>
                </div>
              </div>

              <div className="professor-cursos">
                <h3 className="cursos-titulo">Cursos Ministrados</h3>
                <div className="cursos-grid">
                  {professorSelecionado.cursos.map((curso) => {
                    const jaNoCarrinho = cursoNoCarrinho(curso.id);
                    return (
                      <div key={curso.id} className="curso-card">
                        <div className="curso-card-header">
                          <h4>{curso.titulo}</h4>
                          <span className={`curso-nivel ${curso.nivel.toLowerCase()}`}>
                            {curso.nivel}
                          </span>
                        </div>
                        <p className="curso-descricao">{curso.descricao}</p>
                        <div className="curso-preco-info">
                          <span className="curso-preco">{formatarPreco(curso.preco)}</span>
                        </div>
                        <div className="curso-footer">
                          <span className="curso-duracao">
                            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M8 14C11.3137 14 14 11.3137 14 8C14 4.68629 11.3137 2 8 2C4.68629 2 2 4.68629 2 8C2 11.3137 4.68629 14 8 14Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                              <path d="M8 4V8L10.5 9.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                            {curso.duracao}
                          </span>
                          <button 
                            className={`curso-btn ${jaNoCarrinho ? 'no-carrinho' : ''}`}
                            onClick={() => !jaNoCarrinho && handleAdicionarCarrinho(curso, professorSelecionado)}
                            disabled={jaNoCarrinho}
                          >
                            {jaNoCarrinho ? (
                              <>
                                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                  <path d="M13.3333 4L6 11.3333L2.66667 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                                No Carrinho
                              </>
                            ) : (
                              <>
                                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                  <path d="M3 3L5.17 5.17H13C13.5304 5.17 14.0391 5.38071 14.4142 5.75579C14.7893 6.13086 15 6.63957 15 7.17V13.17C15 13.7004 14.7893 14.2091 14.4142 14.5842C14.0391 14.9593 13.5304 15.17 13 15.17H3C2.46957 15.17 1.96086 14.9593 1.58579 14.5842C1.21071 14.2091 1 13.7004 1 13.17V4.17C1 3.63957 1.21071 3.13086 1.58579 2.75579C1.96086 2.38071 2.46957 2.17 3 2.17H5.17L3 3Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                  <path d="M8 9V12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                  <path d="M6.5 10.5H9.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                                Adicionar ao Carrinho
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
