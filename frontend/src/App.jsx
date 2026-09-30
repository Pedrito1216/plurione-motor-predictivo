import { useState, useEffect } from 'react'
import api from './api'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { Users, UserCheck, UserMinus, Activity } from 'lucide-react' // Íconos profesionales

function App() {
  const [empleados, setEmpleados] = useState([])
  const [cargando, setCargando] = useState(true)

  const [formSimulador, setFormSimulador] = useState({
    distancia_km: 10,
    salario: 25000,
    desempeno: 3.5
  })
  const [resultadoSimulacion, setResultadoSimulacion] = useState(null)
  const [simulando, setSimulando] = useState(false)

  useEffect(() => {
    // Extraemos una muestra representativa para alimentar el Dashboard
    api.get('/empleados?limite=100')
      .then(respuesta => {
        setEmpleados(respuesta.data.datos)
        setCargando(false)
      })
      .catch(error => {
        console.error("Error conectando con FastAPI:", error)
        setCargando(false)
      })
  }, [])

  const ejecutarSimulacion = async (e) => {
    e.preventDefault()
    setSimulando(true)
    try {
      const respuesta = await api.post('/predicciones/simulador', {
        distancia_km: parseFloat(formSimulador.distancia_km),
        salario: parseFloat(formSimulador.salario),
        desempeno: parseFloat(formSimulador.desempeno)
      })
      setResultadoSimulacion(respuesta.data)
    } catch (error) {
      console.error("Error en simulación:", error)
    }
    setSimulando(false)
  }

  // --- CÁLCULOS PARA LOS KPIs GLOBALES ---
  const totalEmpleados = empleados.length;
  const activos = empleados.filter(e => e.estado_activo).length;
  const bajas = totalEmpleados - activos;
  const tasaRotacion = totalEmpleados > 0 ? ((bajas / totalEmpleados) * 100).toFixed(1) : 0;

  // --- DATOS PARA LA GRÁFICA ---
  const datosGrafica = [
    { rango: 'Cerca (0-15 km)', Retenidos: empleados.filter(e => e.distancia_oficina_km <= 15 && e.estado_activo).length, Renuncias: empleados.filter(e => e.distancia_oficina_km <= 15 && !e.estado_activo).length },
    { rango: 'Medio (16-30 km)', Retenidos: empleados.filter(e => e.distancia_oficina_km > 15 && e.distancia_oficina_km <= 30 && e.estado_activo).length, Renuncias: empleados.filter(e => e.distancia_oficina_km > 15 && e.distancia_oficina_km <= 30 && !e.estado_activo).length },
    { rango: 'Lejos (Más de 30 km)', Retenidos: empleados.filter(e => e.distancia_oficina_km > 30 && e.estado_activo).length, Renuncias: empleados.filter(e => e.distancia_oficina_km > 30 && !e.estado_activo).length }
  ];

  return (
    <div style={{ padding: '30px', fontFamily: 'system-ui, sans-serif', maxWidth: '1200px', margin: '0 auto', backgroundColor: '#f8fafc', minHeight: '100vh' }}>
      <h1 style={{ color: '#1e293b', borderBottom: '2px solid #e2e8f0', paddingBottom: '10px', marginBottom: '25px' }}>Dashboard Analítico - PluriOne</h1>
      
      {/* --- NUEVA SECCIÓN: TARJETAS KPI --- */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px', marginBottom: '30px' }}>
        
        <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '10px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)', display: 'flex', alignItems: 'center', gap: '15px' }}>
          <div style={{ backgroundColor: '#eff6ff', padding: '15px', borderRadius: '50%', color: '#3b82f6' }}><Users size={28} /></div>
          <div>
            <p style={{ margin: 0, color: '#64748b', fontSize: '0.9rem', fontWeight: 'bold' }}>Muestra Analizada</p>
            <h2 style={{ margin: 0, color: '#0f172a', fontSize: '1.8rem' }}>{totalEmpleados}</h2>
          </div>
        </div>

        <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '10px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)', display: 'flex', alignItems: 'center', gap: '15px' }}>
          <div style={{ backgroundColor: '#f0fdf4', padding: '15px', borderRadius: '50%', color: '#22c55e' }}><UserCheck size={28} /></div>
          <div>
            <p style={{ margin: 0, color: '#64748b', fontSize: '0.9rem', fontWeight: 'bold' }}>Empleados Activos</p>
            <h2 style={{ margin: 0, color: '#0f172a', fontSize: '1.8rem' }}>{activos}</h2>
          </div>
        </div>

        <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '10px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)', display: 'flex', alignItems: 'center', gap: '15px' }}>
          <div style={{ backgroundColor: '#fef2f2', padding: '15px', borderRadius: '50%', color: '#ef4444' }}><UserMinus size={28} /></div>
          <div>
            <p style={{ margin: 0, color: '#64748b', fontSize: '0.9rem', fontWeight: 'bold' }}>Bajas Históricas</p>
            <h2 style={{ margin: 0, color: '#0f172a', fontSize: '1.8rem' }}>{bajas}</h2>
          </div>
        </div>

        <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '10px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)', display: 'flex', alignItems: 'center', gap: '15px' }}>
          <div style={{ backgroundColor: '#f5f3ff', padding: '15px', borderRadius: '50%', color: '#8b5cf6' }}><Activity size={28} /></div>
          <div>
            <p style={{ margin: 0, color: '#64748b', fontSize: '0.9rem', fontWeight: 'bold' }}>Tasa de Rotación</p>
            <h2 style={{ margin: 0, color: '#0f172a', fontSize: '1.8rem' }}>{tasaRotacion}%</h2>
          </div>
        </div>

      </div>
      {/* ---------------------------------- */}

      {/* COLUMNAS CENTRALES: Simulador e Historial */}
      <div style={{ display: 'flex', gap: '30px', flexWrap: 'wrap' }}>
        <div style={{ flex: '1', minWidth: '350px', backgroundColor: 'white', padding: '25px', borderRadius: '10px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
          <h2 style={{ fontSize: '1.2rem', color: '#334155', marginTop: 0 }}>Simulador de Riesgo (IA)</h2>
          <p style={{ color: '#64748b', fontSize: '0.9rem', marginBottom: '20px' }}>Modifica los valores para probar el modelo Random Forest.</p>
          
          <form onSubmit={ejecutarSimulacion} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            <div>
              <label style={{ display: 'block', fontWeight: 'bold', fontSize: '0.9rem', marginBottom: '5px' }}>Distancia a la oficina (km)</label>
              <input type="number" step="0.1" required style={{ width: '100%', padding: '8px', borderRadius: '5px', border: '1px solid #cbd5e1' }}
                value={formSimulador.distancia_km}
                onChange={e => setFormSimulador({...formSimulador, distancia_km: e.target.value})} />
            </div>
            <div>
              <label style={{ display: 'block', fontWeight: 'bold', fontSize: '0.9rem', marginBottom: '5px' }}>Salario Mensual (MXN)</label>
              <input type="number" required style={{ width: '100%', padding: '8px', borderRadius: '5px', border: '1px solid #cbd5e1' }}
                value={formSimulador.salario}
                onChange={e => setFormSimulador({...formSimulador, salario: e.target.value})} />
            </div>
            <div>
              <label style={{ display: 'block', fontWeight: 'bold', fontSize: '0.9rem', marginBottom: '5px' }}>Evaluación de Desempeño (1.0 - 5.0)</label>
              <input type="number" step="0.1" min="1" max="5" required style={{ width: '100%', padding: '8px', borderRadius: '5px', border: '1px solid #cbd5e1' }}
                value={formSimulador.desempeno}
                onChange={e => setFormSimulador({...formSimulador, desempeno: e.target.value})} />
            </div>
            <button type="submit" disabled={simulando} style={{ padding: '10px', backgroundColor: '#2563eb', color: 'white', border: 'none', borderRadius: '5px', fontWeight: 'bold', cursor: 'pointer', marginTop: '10px' }}>
              {simulando ? 'Analizando...' : 'Ejecutar Predicción'}
            </button>
          </form>

          {resultadoSimulacion && (
            <div style={{ marginTop: '25px', padding: '15px', borderRadius: '8px', backgroundColor: resultadoSimulacion.alerta.includes('ALTO') ? '#fef2f2' : '#f0fdf4', border: `1px solid ${resultadoSimulacion.alerta.includes('ALTO') ? '#fca5a5' : '#86efac'}` }}>
              <h3 style={{ margin: '0 0 10px 0', fontSize: '1.1rem', color: resultadoSimulacion.alerta.includes('ALTO') ? '#991b1b' : '#166534' }}>
                {resultadoSimulacion.alerta}
              </h3>
              <p style={{ margin: 0, fontWeight: 'bold', fontSize: '1.2rem', color: '#0f172a' }}>
                Probabilidad: {resultadoSimulacion.probabilidad_renuncia}
              </p>
            </div>
          )}
        </div>

        <div style={{ flex: '2', minWidth: '400px', backgroundColor: 'white', padding: '25px', borderRadius: '10px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
          <h2 style={{ fontSize: '1.2rem', color: '#334155', marginTop: 0 }}>Historial Reciente</h2>
          {cargando ? (
            <p>Cargando datos de PostgreSQL...</p>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '15px' }}>
              <thead>
                <tr style={{ backgroundColor: '#f1f5f9', textAlign: 'left', fontSize: '0.9rem' }}>
                  <th style={{ padding: '10px', borderBottom: '2px solid #e2e8f0' }}>ID</th>
                  <th style={{ padding: '10px', borderBottom: '2px solid #e2e8f0' }}>Distancia</th>
                  <th style={{ padding: '10px', borderBottom: '2px solid #e2e8f0' }}>Estado</th>
                </tr>
              </thead>
              <tbody>
                {empleados.slice(0, 6).map((emp) => (
                  <tr key={emp.id} style={{ borderBottom: '1px solid #f1f5f9', fontSize: '0.9rem' }}>
                    <td style={{ padding: '10px', color: '#64748b' }}>{emp.id.substring(0, 8)}</td>
                    <td style={{ padding: '10px' }}>{emp.distancia_oficina_km} km</td>
                    <td style={{ padding: '10px' }}>
                      <span style={{ padding: '3px 8px', borderRadius: '12px', fontSize: '0.8rem', fontWeight: 'bold', backgroundColor: emp.estado_activo ? '#dcfce7' : '#fee2e2', color: emp.estado_activo ? '#166534' : '#991b1b' }}>
                        {emp.estado_activo ? 'Activo' : 'Baja'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* GRÁFICA INFERIOR */}
      <div style={{ marginTop: '30px', backgroundColor: 'white', padding: '25px', borderRadius: '10px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
        <h2 style={{ fontSize: '1.2rem', color: '#334155', marginTop: 0 }}>Impacto de la Distancia en la Rotación</h2>
        <p style={{ color: '#64748b', fontSize: '0.9rem', marginBottom: '20px' }}>Visualización de la proporción de retención frente al riesgo geográfico.</p>
        
        <div style={{ height: '320px', width: '100%' }}>
          {cargando ? (
            <p>Procesando gráfica...</p>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={datosGrafica} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="rango" />
                <YAxis />
                <Tooltip cursor={{ fill: '#f1f5f9' }} />
                <Legend />
                <Bar dataKey="Retenidos" fill="#22c55e" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Renuncias" fill="#ef4444" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

    </div>
  )
}

export default App