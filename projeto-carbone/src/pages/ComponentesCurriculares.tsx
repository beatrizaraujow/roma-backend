import React, { useState, useMemo } from 'react';
import { Sidebar } from '../components/Sidebar';
import { Carrinho } from '../components/Carrinho';
import { useCarrinho } from '../contexts/CarrinhoContext';
import './ComponentesCurriculares.css';

interface Curso {
  id: number;
  titulo: string;
  descricao: string;
  duracao: string;
  nivel: string;
  preco: number;
  professorId: number;
  professorNome: string;
  professorFoto: string;
  area: string;
  professorBio?: string;
  conteudoDetalhado?: string;
  topicosAprendizado?: string[];
  cargaHoraria?: number;
  prerequisitos?: string[];
  certificado?: boolean;
  professorRating?: number;
  totalAlunos?: number;
  professorRedesSociais?: {
    linkedin?: string;
    github?: string;
    portfolio?: string;
  };
  professorEspecialidades?: string[];
  videoPreview?: string;
  imagensCurso?: string[];
  depoimentos?: Array<{
    aluno: string;
    foto: string;
    comentario: string;
    rating: number;
  }>;
  proximaTurma?: string;
  vagasDisponiveis?: number;
  modalidade?: 'Online' | 'Presencial' | 'Híbrido';
  materiaisInclusos?: string[];
}

export const ComponentesCurriculares: React.FC = () => {
  const { adicionarAoCarrinho, cursoNoCarrinho } = useCarrinho();
  
  const [filtroArea, setFiltroArea] = useState<string>('');
  const [filtroDuracao, setFiltroDuracao] = useState<string>('');
  const [filtroProfessor, setFiltroProfessor] = useState<string>('');

  // Todos os cursos de todos os professores
  const todosCursos: Curso[] = [
    // Linguagens - Lethycia Silva
    {
      id: 101,
      titulo: 'Gramática Avançada',
      descricao: 'Curso completo de gramática da língua portuguesa',
      duracao: '40 horas',
      nivel: 'Avançado',
      preco: 299.90,
      professorId: 1,
      professorNome: 'Lethycia Silva',
      professorFoto: '/transferir.png',
      area: 'Linguagens',
      professorBio: 'Mestre em Letras com 15 anos de experiência no ensino de língua portuguesa e literatura.',
      conteudoDetalhado: 'Aprofunde-se na gramática portuguesa com análise sintática, morfologia, semântica e estilística. Inclui exercícios práticos e análise de textos literários.',
      topicosAprendizado: [
        'Análise sintática completa',
        'Morfologia e classes gramaticais',
        'Semântica e interpretação textual',
        'Estilística e figuras de linguagem',
        'Regência e concordância avançadas'
      ],
      cargaHoraria: 40,
      prerequisitos: ['Conhecimento básico de gramática'],
      certificado: true,
      professorRating: 4.8,
      totalAlunos: 1250,
      professorRedesSociais: {
        linkedin: 'https://linkedin.com/in/lethyciasilva',
        portfolio: 'https://lethyciasilva.com'
      },
      professorEspecialidades: ['Gramática', 'Literatura', 'Redação'],
      proximaTurma: '15/01/2026',
      vagasDisponiveis: 25,
      modalidade: 'Online',
      materiaisInclusos: ['Apostila digital', 'Exercícios práticos', 'Material de apoio em PDF', 'Acesso vitalício']
    },
    {
      id: 102,
      titulo: 'Literatura Brasileira',
      descricao: 'Análise das principais obras da literatura nacional',
      duracao: '30 horas',
      nivel: 'Intermediário',
      preco: 249.90,
      professorId: 1,
      professorNome: 'Lethycia Silva',
      professorFoto: '/transferir.png',
      area: 'Linguagens',
      professorBio: 'Mestre em Letras com 15 anos de experiência no ensino de língua portuguesa e literatura.',
      conteudoDetalhado: 'Explore os movimentos literários brasileiros, desde o Barroco até a literatura contemporânea. Análise crítica de obras de Machado de Assis, Clarice Lispector, e outros grandes autores.',
      topicosAprendizado: [
        'Barroco e Arcadismo no Brasil',
        'Romantismo e suas gerações',
        'Realismo e Naturalismo',
        'Modernismo brasileiro',
        'Literatura contemporânea'
      ],
      cargaHoraria: 30,
      prerequisitos: [],
      certificado: true,
      professorRating: 4.8,
      totalAlunos: 1250,
      professorRedesSociais: {
        linkedin: 'https://linkedin.com/in/lethyciasilva',
        portfolio: 'https://lethyciasilva.com'
      },
      professorEspecialidades: ['Gramática', 'Literatura', 'Redação'],
      proximaTurma: '20/01/2026',
      vagasDisponiveis: 30,
      modalidade: 'Online',
      materiaisInclusos: ['E-books das obras', 'Resumos literários', 'Videoaulas', 'Fórum de discussão']
    },
    {
      id: 103,
      titulo: 'Redação para ENEM',
      descricao: 'Técnicas e práticas para redação dissertativa',
      duracao: '25 horas',
      nivel: 'Básico',
      preco: 199.90,
      professorId: 1,
      professorNome: 'Lethycia Silva',
      professorFoto: '/transferir.png',
      area: 'Linguagens',
      professorBio: 'Mestre em Letras com 15 anos de experiência no ensino de língua portuguesa e literatura.',
      conteudoDetalhado: 'Domine a estrutura da redação dissertativa-argumentativa do ENEM. Aprenda técnicas de argumentação, coesão e coerência textual, com correções personalizadas.',
      topicosAprendizado: [
        'Estrutura da dissertação-argumentativa',
        'Técnicas de argumentação',
        'Coesão e coerência textual',
        'Repertório sociocultural',
        'Proposta de intervenção'
      ],
      cargaHoraria: 25,
      prerequisitos: [],
      certificado: true,
      professorRating: 4.8,
      totalAlunos: 1250,
      professorRedesSociais: {
        linkedin: 'https://linkedin.com/in/lethyciasilva',
        portfolio: 'https://lethyciasilva.com'
      },
      professorEspecialidades: ['Gramática', 'Literatura', 'Redação'],
      proximaTurma: '10/01/2026',
      vagasDisponiveis: 15,
      modalidade: 'Online',
      materiaisInclusos: ['Correções personalizadas', 'Banco de temas', 'Modelos de redação nota 1000', 'Plantão de dúvidas']
    },
    // Matemática - Carlos Santos
    {
      id: 201,
      titulo: 'Cálculo I',
      descricao: 'Fundamentos do cálculo diferencial e integral',
      duracao: '60 horas',
      nivel: 'Avançado',
      preco: 349.90,
      professorId: 2,
      professorNome: 'Carlos Santos',
      professorFoto: '/Ahhh.png',
      area: 'Matemática',
      professorBio: 'Doutor em Matemática Aplicada, especialista em ensino de cálculo e álgebra para cursos de exatas.',
      conteudoDetalhado: 'Estude limites, derivadas, integrais e suas aplicações. Resolva problemas práticos de otimização, taxa de variação e cálculo de áreas. Ideal para estudantes de engenharia e ciências exatas.',
      topicosAprendizado: [
        'Limites e continuidade',
        'Derivadas e regras de derivação',
        'Aplicações de derivadas',
        'Integrais definidas e indefinidas',
        'Técnicas de integração',
        'Aplicações de integrais'
      ],
      cargaHoraria: 60,
      prerequisitos: ['Matemática básica', 'Álgebra'],
      certificado: true,
      professorRating: 4.9,
      totalAlunos: 890,
      professorRedesSociais: {
        linkedin: 'https://linkedin.com/in/carlossantos',
        github: 'https://github.com/carlossantos'
      },
      professorEspecialidades: ['Cálculo', 'Álgebra Linear', 'Matemática Aplicada'],
      proximaTurma: '05/02/2026',
      vagasDisponiveis: 20,
      modalidade: 'Híbrido',
      materiaisInclusos: ['Livro digital', 'Lista de exercícios', 'Software de cálculo', 'Monitoria online']
    },
    {
      id: 202,
      titulo: 'Álgebra Linear',
      descricao: 'Estudo de vetores, matrizes e transformações lineares',
      duracao: '45 horas',
      nivel: 'Intermediário',
      preco: 299.90,
      professorId: 2,
      professorNome: 'Carlos Santos',
      professorFoto: '/Ahhh.png',
      area: 'Matemática',
      professorBio: 'Doutor em Matemática Aplicada, especialista em ensino de cálculo e álgebra para cursos de exatas.',
      conteudoDetalhado: 'Aprenda sobre espaços vetoriais, transformações lineares, autovalores e autovetores. Aplicações em computação gráfica, ciência de dados e engenharia.',
      topicosAprendizado: [
        'Vetores e espaços vetoriais',
        'Matrizes e determinantes',
        'Sistemas lineares',
        'Transformações lineares',
        'Autovalores e autovetores',
        'Aplicações práticas'
      ],
      cargaHoraria: 45,
      prerequisitos: ['Matemática básica'],
      certificado: true,
      professorRating: 4.9,
      totalAlunos: 890,
      professorRedesSociais: {
        linkedin: 'https://linkedin.com/in/carlossantos',
        github: 'https://github.com/carlossantos'
      },
      professorEspecialidades: ['Cálculo', 'Álgebra Linear', 'Matemática Aplicada'],
      proximaTurma: '12/02/2026',
      vagasDisponiveis: 18,
      modalidade: 'Online',
      materiaisInclusos: ['Apostila completa', 'Exercícios resolvidos', 'Simulados', 'Grupo de estudos']
    },
    // Ciências da Computação - Marina Costa
    {
      id: 301,
      titulo: 'Algoritmos e Estruturas de Dados',
      descricao: 'Fundamentos de programação e estruturas de dados',
      duracao: '50 horas',
      nivel: 'Intermediário',
      preco: 319.90,
      professorId: 3,
      professorNome: 'Marina Costa',
      professorFoto: '/sipit.png',
      area: 'Ciências da Computação',
      professorBio: 'Engenheira de Software com MBA em Desenvolvimento de Sistemas, 10 anos atuando em grandes empresas de tecnologia.',
      conteudoDetalhado: 'Domine algoritmos de ordenação, busca, árvores, grafos e estruturas de dados fundamentais. Aprenda análise de complexidade e otimização de código com exemplos práticos.',
      topicosAprendizado: [
        'Complexidade de algoritmos (Big O)',
        'Estruturas lineares (arrays, listas, pilhas, filas)',
        'Algoritmos de ordenação e busca',
        'Árvores e suas variações',
        'Grafos e algoritmos de grafos',
        'Técnicas de otimização'
      ],
      cargaHoraria: 50,
      prerequisitos: ['Lógica de programação', 'Conhecimento básico em alguma linguagem'],
      certificado: true,
      professorRating: 5.0,
      totalAlunos: 2150,
      professorRedesSociais: {
        linkedin: 'https://linkedin.com/in/marinacosta',
        github: 'https://github.com/marinacosta',
        portfolio: 'https://marinacosta.dev'
      },
      professorEspecialidades: ['Algoritmos', 'Estruturas de Dados', 'Web Development'],
      proximaTurma: '01/02/2026',
      vagasDisponiveis: 12,
      modalidade: 'Online',
      materiaisInclusos: ['Código-fonte dos projetos', 'Desafios de programação', 'Certificado internacional', 'Mentoria individual']
    },
    {
      id: 302,
      titulo: 'Desenvolvimento Web',
      descricao: 'HTML, CSS, JavaScript e frameworks modernos',
      duracao: '40 horas',
      nivel: 'Básico',
      preco: 279.90,
      professorId: 3,
      professorNome: 'Marina Costa',
      professorFoto: '/sipit.png',
      area: 'Ciências da Computação',
      professorBio: 'Engenheira de Software com MBA em Desenvolvimento de Sistemas, 10 anos atuando em grandes empresas de tecnologia.',
      conteudoDetalhado: 'Crie sites e aplicações web modernas com HTML5, CSS3, JavaScript ES6+ e React. Aprenda responsividade, APIs REST e deploy de aplicações.',
      topicosAprendizado: [
        'HTML5 semântico',
        'CSS3 e design responsivo',
        'JavaScript ES6+ moderno',
        'Introdução ao React',
        'Consumo de APIs REST',
        'Deploy e hospedagem'
      ],
      cargaHoraria: 40,
      prerequisitos: [],
      certificado: true,
      professorRating: 5.0,
      totalAlunos: 2150,
      professorRedesSociais: {
        linkedin: 'https://linkedin.com/in/marinacosta',
        github: 'https://github.com/marinacosta',
        portfolio: 'https://marinacosta.dev'
      },
      professorEspecialidades: ['Algoritmos', 'Estruturas de Dados', 'Web Development'],
      proximaTurma: '18/01/2026',
      vagasDisponiveis: 8,
      modalidade: 'Online',
      materiaisInclusos: ['Projetos práticos', 'Template de portfólio', 'Checklist de estudos', 'Comunidade exclusiva']
    }
  ];

  // Filtrar cursos
  const cursosFiltrados = useMemo(() => {
    return todosCursos.filter(curso => {
      const matchArea = !filtroArea || curso.area === filtroArea;
      const matchDuracao = !filtroDuracao || curso.duracao === filtroDuracao;
      const matchProfessor = !filtroProfessor || curso.professorNome === filtroProfessor;
      return matchArea && matchDuracao && matchProfessor;
    });
  }, [filtroArea, filtroDuracao, filtroProfessor]);

  const areasUnicas = [...new Set(todosCursos.map(c => c.area))];
  const duracoesUnicas = [...new Set(todosCursos.map(c => c.duracao))];
  const professoresUnicos = [...new Set(todosCursos.map(c => c.professorNome))];

  const limparFiltros = () => {
    setFiltroArea('');
    setFiltroDuracao('');
    setFiltroProfessor('');
  };

  return (
    <div className="componentes-curriculares-container">
      <Sidebar />
      <Carrinho />
      
      <main className="componentes-curriculares-content">
        <div className="componentes-header">
          <h1>Componentes Curriculares</h1>
          <p className="componentes-subtitle">Explore todos os cursos disponíveis</p>
        </div>

        <div className="filter-container">
          <div className="filter-grid">
            <div className="filter-group">
              <label>Área</label>
              <select value={filtroArea} onChange={(e) => setFiltroArea(e.target.value)}>
                <option value="">Todas as áreas</option>
                {areasUnicas.map(area => (
                  <option key={area} value={area}>{area}</option>
                ))}
              </select>
            </div>

            <div className="filter-group">
              <label>Duração</label>
              <select value={filtroDuracao} onChange={(e) => setFiltroDuracao(e.target.value)}>
                <option value="">Todas as durações</option>
                {duracoesUnicas.map(duracao => (
                  <option key={duracao} value={duracao}>{duracao}</option>
                ))}
              </select>
            </div>

            <div className="filter-group">
              <label>Professor(a)</label>
              <select value={filtroProfessor} onChange={(e) => setFiltroProfessor(e.target.value)}>
                <option value="">Todos os professores</option>
                {professoresUnicos.map(professor => (
                  <option key={professor} value={professor}>{professor}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="filter-actions">
            <span className="filter-results">
              {cursosFiltrados.length} {cursosFiltrados.length === 1 ? 'curso encontrado' : 'cursos encontrados'}
            </span>
            {(filtroArea || filtroDuracao || filtroProfessor) && (
              <button onClick={limparFiltros} className="clear-filters-btn">
                Limpar Filtros
              </button>
            )}
          </div>
        </div>

        <div className="componentes-grid">
          {cursosFiltrados.map((curso) => (
            <div key={curso.id} className="curso-card">
              <div className="curso-header">
                <span className={`nivel-badge ${curso.nivel.toLowerCase()}`}>
                  {curso.nivel}
                </span>
                <span className="area-tag">{curso.area}</span>
              </div>

              <h3 className="curso-title">{curso.titulo}</h3>
              <p className="curso-description">{curso.descricao}</p>

              <div className="professor-info">
                <img src={curso.professorFoto} alt={curso.professorNome} className="professor-avatar" />
                <span className="professor-name">{curso.professorNome}</span>
              </div>

              <div className="curso-footer">
                <div className="curso-duration">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10"/>
                    <path d="M12 6v6l4 2"/>
                  </svg>
                  {curso.duracao}
                </div>
                <span className="curso-price">R$ {curso.preco.toFixed(2)}</span>
              </div>

              <button 
                className={`add-to-cart-btn ${cursoNoCarrinho(curso.id) ? 'in-cart' : ''}`}
                onClick={() => !cursoNoCarrinho(curso.id) && adicionarAoCarrinho({
                  id: curso.id,
                  titulo: curso.titulo,
                  descricao: curso.descricao,
                  duracao: curso.duracao,
                  nivel: curso.nivel,
                  preco: curso.preco,
                  professorNome: curso.professorNome,
                  professorFoto: curso.professorFoto
                })}
                disabled={cursoNoCarrinho(curso.id)}
              >
                {cursoNoCarrinho(curso.id) ? (
                  <>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                      <path d="M20 6L9 17l-5-5"/>
                    </svg>
                    Adicionado ao Carrinho
                  </>
                ) : (
                  <>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="9" cy="21" r="1"/>
                      <circle cx="20" cy="21" r="1"/>
                      <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
                    </svg>
                    Adicionar ao Carrinho
                  </>
                )}
              </button>
            </div>
          ))}
        </div>

        {cursosFiltrados.length === 0 && (
          <div className="no-results">
            <p>Nenhum curso encontrado com os filtros selecionados.</p>
            <button onClick={limparFiltros} className="clear-filters-btn">
              Limpar Filtros
            </button>
          </div>
        )}
      </main>
    </div>
  );
};
