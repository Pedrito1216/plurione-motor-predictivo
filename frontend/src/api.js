import axios from 'axios'

const api = axios.create({
  // Asegúrate de que esta URL base coincida con tu backend
  baseURL: 'http://127.0.0.1:8000/api/v1' 
})

// "Interceptor": Antes de que salga cualquier petición, ejecuta esto:
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
}, (error) => {
  return Promise.reject(error)
})

export default api