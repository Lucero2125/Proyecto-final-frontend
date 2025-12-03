import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../services/api';
import '../styles/Login.css';

function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    usuarioEmail: '',
    usuarioPassword: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await login(formData.usuarioEmail, formData.usuarioPassword);
      
      if (response.codigo === 200 && response.data) {
        localStorage.setItem('token', response.data);
        localStorage.setItem('userEmail', formData.usuarioEmail);
        
        // Decodificar rol del token (simplificado)
        try {
          const payload = JSON.parse(atob(response.data.split('.')[1]));
          const rol = payload.roles?.[0] || 'ROLE_USER';
          localStorage.setItem('userRole', rol);
        } catch {
          localStorage.setItem('userRole', 'ROLE_USER');
        }

        navigate('/');
      } else {
        setError(response.mensaje || 'Error al iniciar sesión');
      }
    } catch (error) {
      setError(error.mensaje || 'Credenciales incorrectas. Intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <span className="login-icon">🎬</span>
          <h1>Catálogo de Películas</h1>
          <p>Inicia sesión para continuar</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label>📧 Correo Electrónico</label>
            <input
              type="email"
              name="usuarioEmail"
              value={formData.usuarioEmail}
              onChange={handleChange}
              required
              placeholder="admin@example.com"
            />
          </div>

          <div className="form-group">
            <label>🔒 Contraseña</label>
            <input
              type="password"
              name="usuarioPassword"
              value={formData.usuarioPassword}
              onChange={handleChange}
              required
              placeholder="••••••••"
            />
          </div>

          {error && (
            <div className="login-error">
              ⚠️ {error}
            </div>
          )}

          <button 
            type="submit" 
            className="login-button"
            disabled={loading}
          >
            {loading ? 'Iniciando sesión...' : '🚀 Iniciar Sesión'}
          </button>
        </form>

        <div className="login-footer">
          <p>Usuario de prueba: <strong>admin@example.com</strong></p>
          <p>Contraseña: <strong>admin123</strong></p>
        </div>
      </div>
    </div>
  );
}

export default Login;