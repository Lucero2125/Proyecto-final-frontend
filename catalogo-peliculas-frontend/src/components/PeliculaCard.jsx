import { useState } from 'react';
import { calificarPelicula } from '../services/api';
import '../styles/PeliculaCard.css';

function PeliculaCard({ pelicula, onCalificar, onEditar, onEliminar }) {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [loading, setLoading] = useState(false);
  const userRole = localStorage.getItem('userRole');

  const handleCalificar = async (valor) => {
    if (loading) return;
    
    setLoading(true);
    try {
      await calificarPelicula(pelicula.peliculaId, valor);
      setRating(valor);
      if (onCalificar) {
        onCalificar();
      }
      alert('¡Calificación guardada exitosamente!');
    } catch (error) {
      alert('Error al calificar: ' + (error.mensaje || 'Error desconocido'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pelicula-card">
      <div className="pelicula-header">
        <h3 className="pelicula-nombre">{pelicula.peliculaNombre}</h3>
        <span className="pelicula-anio">{pelicula.peliculaAnio}</span>
      </div>

      <div className="pelicula-info">
        <span className="pelicula-categoria">📁 {pelicula.categoriaNombre}</span>
        <div className="pelicula-rating-promedio">
          ⭐ {pelicula.peliculaRatingPromedio.toFixed(1)}
        </div>
      </div>

      <p className="pelicula-sinopsis">{pelicula.peliculaSinopsis}</p>

      <div className="pelicula-calificar">
        <span className="calificar-label">Calificar:</span>
        <div className="estrellas">
          {[1, 2, 3, 4, 5].map((estrella) => (
            <button
              key={estrella}
              className={`estrella ${
                (hoverRating || rating) >= estrella ? 'activa' : ''
              }`}
              onMouseEnter={() => setHoverRating(estrella)}
              onMouseLeave={() => setHoverRating(0)}
              onClick={() => handleCalificar(estrella)}
              disabled={loading}
            >
              ★
            </button>
          ))}
        </div>
      </div>

      {userRole === 'ROLE_ADMIN' && (
        <div className="pelicula-acciones">
          <button 
            className="btn-editar" 
            onClick={() => onEditar(pelicula)}
          >
            ✏️ Editar
          </button>
          <button 
            className="btn-eliminar" 
            onClick={() => onEliminar(pelicula.peliculaId)}
          >
            🗑️ Eliminar
          </button>
        </div>
      )}
    </div>
  );
}

export default PeliculaCard;