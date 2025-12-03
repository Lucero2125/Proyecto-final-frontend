import { useNavigate } from 'react-router-dom';
import { cerrarSesion } from '../services/api';
import '../styles/Navbar.css';

function Navbar() {
  const navigate = useNavigate();
  const userEmail = localStorage.getItem('userEmail');
  const userRole = localStorage.getItem('userRole');

  const handleCerrarSesion = () => {
    cerrarSesion();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-brand">
          <span className="navbar-icon">🎭🎞</span>
          <h1 className="navbar-title">Catálogo de Películas</h1>
        </div>
        
        <div className="navbar-user">
          <span className="navbar-email">👤 {userEmail}</span>
          {userRole === 'ROLE_ADMIN' && (
            <span className="navbar-badge">ADMIN</span>
          )}
          <button className="navbar-logout" onClick={handleCerrarSesion}>
             Cerrar Sesión
          </button>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;