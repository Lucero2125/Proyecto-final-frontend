import { useState, useEffect } from 'react';
import { crearPelicula, actualizarPelicula } from '../services/api';
import '../styles/PeliculaCard.css';

function PeliculaModal({ pelicula, onClose, onGuardar }) {
  const [formData, setFormData] = useState({
    peliculaNombre: '',
    peliculaAnio: new Date().getFullYear(),
    peliculaSinopsis: '',
    categoriaId: '1',
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (pelicula) {
      setFormData({
        peliculaNombre: pelicula.peliculaNombre,
        peliculaAnio: pelicula.peliculaAnio,
        peliculaSinopsis: pelicula.peliculaSinopsis,
        categoriaId: '1', // Ajustar según categoría real
      });
    }
  }, [pelicula]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (pelicula) {
        await actualizarPelicula(pelicula.peliculaId, formData);
        alert('Película actualizada exitosamente');
      } else {
        await crearPelicula(formData);
        alert('Película creada exitosamente');
      }
      onGuardar();
      onClose();
    } catch (error) {
      alert('Error: ' + (error.mensaje || 'Error desconocido'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{pelicula ? '✏️ Editar Película' : '➕ Nueva Película'}</h2>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-group">
            <label>Nombre de la Película *</label>
            <input
              type="text"
              name="peliculaNombre"
              value={formData.peliculaNombre}
              onChange={handleChange}
              required
              maxLength={200}
            />
          </div>

          <div className="form-group">
            <label>Año *</label>
            <input
              type="number"
              name="peliculaAnio"
              value={formData.peliculaAnio}
              onChange={handleChange}
              required
              min={1900}
              max={2100}
            />
          </div>

          <div className="form-group">
            <label>Categoría *</label>
            <select
              name="categoriaId"
              value={formData.categoriaId}
              onChange={handleChange}
              required
            >
              <option value="1">Ciencia Ficción</option>
              <option value="2">Comedia</option>
            </select>
          </div>

          <div className="form-group">
            <label>Sinopsis *</label>
            <textarea
              name="peliculaSinopsis"
              value={formData.peliculaSinopsis}
              onChange={handleChange}
              required
              maxLength={1000}
              rows={4}
            />
          </div>

          <div className="modal-actions">
            <button 
              type="button" 
              className="btn-cancelar" 
              onClick={onClose}
              disabled={loading}
            >
              Cancelar
            </button>
            <button 
              type="submit" 
              className="btn-guardar"
              disabled={loading}
            >
              {loading ? 'Guardando...' : 'Guardar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default PeliculaModal;