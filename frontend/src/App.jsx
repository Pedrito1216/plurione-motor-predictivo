import { useState, useEffect } from 'react'
import api from './api'

function App() {
  const [empleados, setEmpleados] = useState([])
  const [cargando, setCargando] = useState(true)

  useEffect(() => {
    // Llamamos al Endpoint 3.2 de FastAPI
    api.get('/empleados?limite=10')
      .then(respuesta => {
        setEmpleados(respuesta.data.datos)
        setCargando(false)
      })
      .catch(error => {
        console.error("Error conectando con FastAPI:", error)
        setCargando(false)
      })
  }, [])

  return (
    <div style={{ padding: '40px', fontFamily: 'system-ui, sans-serif', maxWidth: '1000px', margin: '0 auto' }}>
      <h1 style={{ color: '#2c3e50' }}>Dashboard Analítico - PluriOne</h1>
      <p>Conectado a PostgreSQL vía FastAPI</p>

      {cargando ? (
        <p>Cargando datos del motor predictivo...</p>
      ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px' }}>
          <thead>
            <tr style={{ backgroundColor: '#f3f4f6', textAlign: 'left' }}>
              <th style={{ padding: '12px', borderBottom: '2px solid #ddd' }}>ID Empleado</th>
              <th style={{ padding: '12px', borderBottom: '2px solid #ddd' }}>Distancia (Km)</th>
              <th style={{ padding: '12px', borderBottom: '2px solid #ddd' }}>Estado de Riesgo</th>
            </tr>
          </thead>
          <tbody>
            {empleados.map((emp) => (
              <tr key={emp.id} style={{ borderBottom: '1px solid #ddd' }}>
                <td style={{ padding: '12px', color: '#555' }}>{emp.id.substring(0, 8)}...</td>
                <td style={{ padding: '12px' }}>{emp.distancia_oficina_km} km</td>
                <td style={{ padding: '12px' }}>
                  <span style={{
                    padding: '4px 8px', 
                    borderRadius: '4px',
                    fontWeight: 'bold',
                    backgroundColor: emp.estado_activo ? '#def7ec' : '#fde8e8',
                    color: emp.estado_activo ? '#03543f' : '#9b1c1c'
                  }}>
                    {emp.estado_activo ? 'Activo' : 'Rotación Histórica'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}

export default App