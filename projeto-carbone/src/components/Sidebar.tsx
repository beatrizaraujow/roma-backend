import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import './Sidebar.css';

interface SidebarProps {
  onAreaClick?: (area: string) => void;
  selectedArea?: string;
}

export const Sidebar: React.FC<SidebarProps> = ({ onAreaClick, selectedArea }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Get first letter of name or email
  const getInitial = () => {
    if (user?.nome) return user.nome.charAt(0).toUpperCase();
    if (user?.email) return user.email.charAt(0).toUpperCase();
    return 'U';
  };

  const getDisplayName = () => {
    if (user?.nome) return user.nome;
    if (user?.email) return user.email.split('@')[0];
    return 'Usuário';
  };

  return (
    <div className="sidebar">
      {/* User Profile Section */}
      <div className="sidebar-profile">
        <div className="sidebar-avatar">
          {user?.fotoPerfil ? (
            <img src={user.fotoPerfil} alt={getDisplayName()} />
          ) : (
            <div className="sidebar-avatar-placeholder">
              {getInitial()}
            </div>
          )}
        </div>
        <h3 className="sidebar-username">{getDisplayName()}</h3>
        <button className="sidebar-settings-btn">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M10 12.5C11.3807 12.5 12.5 11.3807 12.5 10C12.5 8.61929 11.3807 7.5 10 7.5C8.61929 7.5 7.5 8.61929 7.5 10C7.5 11.3807 8.61929 12.5 10 12.5Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M16.1667 12.5C16.0557 12.7513 16.0226 13.0301 16.0717 13.3006C16.1209 13.5711 16.2501 13.8203 16.4417 14.0167L16.4917 14.0667C16.6461 14.221 16.7687 14.4044 16.8525 14.6061C16.9363 14.8078 16.9797 15.0238 16.9797 15.2417C16.9797 15.4596 16.9363 15.6756 16.8525 15.8773C16.7687 16.079 16.6461 16.2624 16.4917 16.4167C16.3373 16.5711 16.1539 16.6937 15.9522 16.7775C15.7505 16.8613 15.5345 16.9047 15.3167 16.9047C15.0988 16.9047 14.8828 16.8613 14.6811 16.7775C14.4794 16.6937 14.296 16.5711 14.1417 16.4167L14.0917 16.3667C13.8952 16.1751 13.646 16.0459 13.3756 15.9967C13.1051 15.9476 12.8263 15.9807 12.575 16.0917C12.3285 16.1977 12.1174 16.3723 11.9672 16.5951C11.8169 16.8179 11.7338 17.0797 11.7283 17.3483V17.5C11.7283 17.942 11.553 18.3659 11.2404 18.6785C10.9279 18.9911 10.504 19.1667 10.062 19.1667C9.62001 19.1667 9.19608 18.9911 8.88352 18.6785C8.57096 18.3659 8.39565 17.942 8.39565 17.5V17.425C8.38444 17.1478 8.29148 16.8802 8.12821 16.6574C7.96495 16.4346 7.73905 16.2667 7.47865 16.175C7.22733 16.064 6.94853 16.0309 6.67807 16.08C6.40761 16.1292 6.15841 16.2584 5.96198 16.45L5.91198 16.5C5.75765 16.6544 5.57424 16.777 5.37254 16.8608C5.17084 16.9446 4.95479 16.988 4.73698 16.988C4.51916 16.988 4.30311 16.9446 4.10141 16.8608C3.89971 16.777 3.7163 16.6544 3.56198 16.5C3.40761 16.3457 3.28499 16.1623 3.20119 15.9606C3.11739 15.7589 3.07397 15.5428 3.07397 15.325C3.07397 15.1072 3.11739 14.8911 3.20119 14.6894C3.28499 14.4877 3.40761 14.3043 3.56198 14.15L3.61198 14.1C3.80355 13.9036 3.93274 13.6544 3.98189 13.3839C4.03104 13.1134 3.99793 12.8346 3.88698 12.5833C3.78097 12.3369 3.60635 12.1258 3.38354 11.9755C3.16073 11.8253 2.89893 11.7422 2.63031 11.7367H2.47865C2.03661 11.7367 1.61269 11.5613 1.30012 11.2488C0.987563 10.9362 0.81225 10.5123 0.81225 10.0703C0.81225 9.62827 0.987563 9.20435 1.30012 8.89179C1.61269 8.57923 2.03661 8.40391 2.47865 8.40391H2.55365C2.83088 8.3927 3.09846 8.29974 3.32126 8.13648C3.54406 7.97321 3.71198 7.74731 3.80365 7.48691C3.91459 7.23559 3.94771 6.95679 3.89856 6.68633C3.84941 6.41587 3.72021 6.16667 3.52865 5.97024L3.47865 5.92024C3.32427 5.76592 3.20166 5.58251 3.11786 5.38081C3.03406 5.17911 2.99063 4.96306 2.99063 4.74524C2.99063 4.52743 3.03406 4.31138 3.11786 4.10968C3.20166 3.90797 3.32427 3.72456 3.47865 3.57024C3.63297 3.41587 3.81638 3.29325 4.01808 3.20945C4.21978 3.12565 4.43583 3.08223 4.65365 3.08223C4.87146 3.08223 5.08751 3.12565 5.28921 3.20945C5.49091 3.29325 5.67432 3.41587 5.82865 3.57024L5.87865 3.62024C6.07507 3.81181 6.32427 3.941 6.59473 3.99015C6.86519 4.0393 7.14399 4.00619 7.39531 3.89524H7.47865C7.72507 3.78923 7.93618 3.61461 8.08641 3.3918C8.23663 3.16899 8.31976 2.90719 8.32531 2.63857V2.48691C8.32531 2.04487 8.50063 1.62095 8.81319 1.30839C9.12575 0.995827 9.54967 0.820513 9.99171 0.820513C10.4338 0.820513 10.8577 0.995827 11.1702 1.30839C11.4828 1.62095 11.6581 2.04487 11.6581 2.48691V2.56191C11.6636 2.83053 11.7468 3.09233 11.897 3.31514C12.0472 3.53795 12.2583 3.71257 12.5047 3.81857C12.756 3.92952 13.0348 3.96264 13.3053 3.91349C13.5757 3.86434 13.8249 3.73515 14.0214 3.54357L14.0714 3.49357C14.2257 3.3392 14.4091 3.21659 14.6108 3.13279C14.8125 3.04899 15.0286 3.00556 15.2464 3.00556C15.4642 3.00556 15.6802 3.04899 15.8819 3.13279C16.0836 3.21659 16.267 3.3392 16.4214 3.49357C16.5757 3.6479 16.6983 3.83131 16.7821 4.03301C16.8659 4.23471 16.9094 4.45076 16.9094 4.66857C16.9094 4.88639 16.8659 5.10244 16.7821 5.30414C16.6983 5.50584 16.5757 5.68925 16.4214 5.84357L16.3714 5.89357C16.1798 6.09 16.0506 6.3392 16.0014 6.60966C15.9523 6.88012 15.9854 7.15892 16.0964 7.41024V7.49357C16.2024 7.74 16.377 7.95111 16.5998 8.10134C16.8226 8.25156 17.0844 8.33469 17.353 8.34024H17.5047C17.9467 8.34024 18.3707 8.51556 18.6832 8.82812C18.9958 9.14068 19.1711 9.5646 19.1711 10.0066C19.1711 10.4487 18.9958 10.8726 18.6832 11.1852C18.3707 11.4977 17.9467 11.6731 17.5047 11.6731H17.4297C17.1611 11.6786 16.8993 11.7617 16.6765 11.912C16.4536 12.0622 16.279 12.2733 16.173 12.5197V12.5Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </div>

      {/* Menu Section */}
      <nav className="sidebar-menu">
        <div className="sidebar-menu-item" onClick={() => navigate('/dashboard')}>
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M2.5 7.5L10 1.25L17.5 7.5V16.25C17.5 16.5815 17.3683 16.8995 17.1339 17.1339C16.8995 17.3683 16.5815 17.5 16.25 17.5H3.75C3.41848 17.5 3.10054 17.3683 2.86612 17.1339C2.6317 16.8995 2.5 16.5815 2.5 16.25V7.5Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M7.5 17.5V10H12.5V17.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <span>Meus cursos</span>
        </div>

        <div className="sidebar-menu-item" onClick={() => navigate('/componentes-curriculares')}>
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M10 1.66667L2.5 5.83334L10 10L17.5 5.83334L10 1.66667Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M2.5 14.1667L10 18.3333L17.5 14.1667" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M2.5 10L10 14.1667L17.5 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <span>Componentes Curriculares</span>
        </div>

        <div className="sidebar-menu-item" onClick={() => navigate('/professores')}>
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M13.3333 5.83333C13.3333 7.67428 11.8409 9.16667 9.99996 9.16667C8.15901 9.16667 6.66663 7.67428 6.66663 5.83333C6.66663 3.99238 8.15901 2.5 9.99996 2.5C11.8409 2.5 13.3333 3.99238 13.3333 5.83333Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M9.99996 11.6667C6.77829 11.6667 4.16663 14.2783 4.16663 17.5H15.8333C15.8333 14.2783 13.2216 11.6667 9.99996 11.6667Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <span>Professores</span>
        </div>

        <div className="sidebar-menu-item" onClick={handleLogout}>
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M7.5 17.5H4.16667C3.72464 17.5 3.30072 17.3244 2.98816 17.0118C2.67559 16.6993 2.5 16.2754 2.5 15.8333V4.16667C2.5 3.72464 2.67559 3.30072 2.98816 2.98816C3.30072 2.67559 3.72464 2.5 4.16667 2.5H7.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M13.3333 14.1667L17.5 10L13.3333 5.83334" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M17.5 10H7.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <span>Sair</span>
        </div>
      </nav>
    </div>
  );
};
