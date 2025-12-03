import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import PeliculaCard from '../components/PeliculaCard';
import PeliculaModal from '../components/PeliculaModal';
import { obtenerPeliculas, eliminarPelicula } from '../services/api';
import '../styles/Home.css';

function Home() {
  const navigate = useNavigate();
  const [peliculas, setPeliculas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [mostrarModal, setMostrarModal] = useState(false);
  const [peliculaEditar, setPeliculaEditar] = useState(null);
  const [filtros, setFiltros] = useState({
    nombre: '',
    categoriaId: '',
    anio: '',
  });
  const userRole = localStorage.getItem('userRole');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }
    cargarPeliculas();
  }, [navigate]);

  const cargarPeliculas = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await obtenerPeliculas({
        ...filtros,
        page: 0,
        size: 50,
        sort: 'peliculaAnio,desc',
      });
      
      if (response.codigo === 200 && response.data) {
        setPeliculas(response.data.content || []);
      } else {
        setError(response.mensaje || 'Error al cargar películas');
      }
    } catch (error) {
      setError('Error al cargar películas. Verifica tu conexión.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleFiltroChange = (e) => {
    const { name, value } = e.target;
    setFiltros(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleBuscar = (e) => {
    e.preventDefault();
    cargarPeliculas();
  };

  const handleLimpiarFiltros = () => {
    setFiltros({ nombre: '', categoriaId: '', anio: '' });
    setTimeout(cargarPeliculas, 100);
  };

  const handleCrearPelicula = () => {
    setPeliculaEditar(null);
    setMostrarModal(true);
  };

  const handleEditarPelicula = (pelicula) => {
    setPeliculaEditar(pelicula);
    setMostrarModal(true);
  };

  const handleEliminarPelicula = async (peliculaId) => {
    if (!window.confirm('¿Estás seguro de eliminar esta película?')) {
      return;
    }

    try {
      await eliminarPelicula(peliculaId);
      alert('Película eliminada exitosamente');
      cargarPeliculas();
    } catch (error) {
      alert('Error al eliminar: ' + (error.mensaje || 'Error desconocido'));
    }
  };

  const handleCerrarModal = () => {
    setMostrarModal(false);
    setPeliculaEditar(null);
  };

  return (
    <div className="home-container">
      <Navbar />

      <div className="home-content">
        <div className="home-header">
          <h2>🎬 Películas Disponibles</h2>
          {userRole === 'ROLE_ADMIN' && (
            <button className="btn-crear" onClick={handleCrearPelicula}>
              ➕ Crear Película
            </button>
          )}
        </div>

        <form className="filtros-container" onSubmit={handleBuscar}>
          <input
            type="text"
            name="nombre"
            placeholder="🔍 Buscar por nombre..."
            value={filtros.nombre}
            onChange={handleFiltroChange}
            className="filtro-input"
          />
          
          <select
            name="categoriaId"
            value={filtros.categoriaId}
            onChange={handleFiltroChange}
            className="filtro-select"
          >
            <option value="">Todas las categorías</option>
            <option value="1">Ciencia Ficción</option>
            <option value="2">Comedia</option>
          </select>

          <input
            type="number"
            name="anio"
            placeholder="Año"
            value={filtros.anio}
            onChange={handleFiltroChange}
            className="filtro-input-small"
          />

          <button type="submit" className="btn-buscar">Buscar</button>
          <button 
            type="button" 
            className="btn-limpiar" 
            onClick={handleLimpiarFiltros}
          >
            Limpiar
          </button>
        </form>

        {loading && (
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Cargando películas...</p>
          </div>
        )}

        {error && (
          <div className="error-container">
            <p>⚠️ {error}</p>
            <button onClick={cargarPeliculas}>Reintentar</button>
          </div>
        )}

        {!loading && !error && peliculas.length === 0 && (
          <div className="empty-container">
            <p>📽️ No se encontraron películas</p>
          </div>
        )}

        <div className="peliculas-grid">
          {peliculas.map((pelicula) => (
            <PeliculaCard
              key={pelicula.peliculaId}
              pelicula={pelicula}
              onCalificar={cargarPeliculas}
              onEditar={handleEditarPelicula}
              onEliminar={handleEliminarPelicula}
            />
          ))}
        </div>
      </div>

      {mostrarModal && (
        <PeliculaModal
          pelicula={peliculaEditar}
          onClose={handleCerrarModal}
          onGuardar={cargarPeliculas}
        />
      )}
    </div>
  );
}

export default Home;