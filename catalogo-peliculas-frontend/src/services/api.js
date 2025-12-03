import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

//token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

//AUTENTICACIÓN
export const login = async (usuarioEmail, usuarioPassword) => {
  try {
    const response = await api.post('/auth/login', {
      usuarioEmail,
      usuarioPassword,
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const cerrarSesion = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('userEmail');
  localStorage.removeItem('userRole');
};

//PELICULA
export const obtenerPeliculas = async (params = {}) => {
  try {
    const { nombre, categoriaId, anio, page = 0, size = 12, sort = 'peliculaAnio,desc' } = params;
    const response = await api.get('/pelicula/all', {
      params: { nombre, categoriaId, anio, page, size, sort },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const obtenerPeliculaPorId = async (peliculaId) => {
  try {
    const response = await api.get(`/pelicula/find/${peliculaId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const crearPelicula = async (peliculaData) => {
  try {
    const response = await api.post('/pelicula/save', peliculaData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const actualizarPelicula = async (peliculaId, peliculaData) => {
  try {
    const response = await api.put(`/pelicula/update/${peliculaId}`, peliculaData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const eliminarPelicula = async (peliculaId) => {
  try {
    const response = await api.delete(`/pelicula/delete/${peliculaId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// CALIFICACIONES
export const calificarPelicula = async (peliculaId, calificacionValor) => {
  try {
    const response = await api.post('/calificacion/rate', {
      peliculaId: peliculaId.toString(),
      calificacionValor,
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const obtenerMisCalificaciones = async (page = 0, size = 10) => {
  try {
    const response = await api.get('/calificacion/my-ratings', {
      params: { page, size, sort: 'createdAt,desc' },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const eliminarCalificacion = async (peliculaId) => {
  try {
    const response = await api.delete(`/calificacion/remove/${peliculaId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export default api;