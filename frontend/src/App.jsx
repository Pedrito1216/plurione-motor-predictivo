import { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate, useNavigate, Link, Outlet, useLocation } from 'react-router-dom'
import api from './api'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { Users, UserCheck, UserMinus, Activity, LogOut, Lock, PlusCircle, Trash2, X, List } from 'lucide-react'

// ==========================================
// 1. PANTALLA DE INICIO DE SESIÓN
// ==========================================
function Login() {
  const [email, setEmail] = useState('admin@plurione.com')
  const [password, setPassword] = useState('admin123')
  const [error, setError] = useState('')
  const [cargando, setCargando] = useState(false)
  const navigate = useNavigate()

  const manejarLogin = async (e) => {
    e.preventDefault()
    setError('')
    setCargando(true)
    try {
      const params = new URLSearchParams()
      params.append('username', email)
      params.append('password', password)
      const respuesta = await api.post('/login', params)
      localStorage.setItem('token', respuesta.data.access_token)
      navigate('/dashboard')
    } catch (err) {
      setError('Credenciales incorrectas. Intenta de nuevo.')
    }
    setCargando(false)
  }

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: '#f1f5f9' }}>
      <div style={{ backgroundColor: 'white', padding: '40px', borderRadius: '10px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', width: '100%', maxWidth: '400px' }}>
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <div style={{ backgroundColor: '#eff6ff', display: 'inline-block', padding: '15px', borderRadius: '50%', color: '#3b82f6', marginBottom: '10px' }}>
            <Lock size={32} />
          </div>
          <h2 style={{ margin: 0, color: '#1e293b' }}>Motor Predictivo</h2>
          <p style={{ color: '#64748b', margin: '5px 0 0 0', fontSize: '0.9rem' }}>Acceso Administrativo PluriOne</p>
        </div>
        {error && <div style={{ backgroundColor: '#fef2f2', color: '#991b1b', padding: '10px', borderRadius: '5px', marginBottom: '20px', fontSize: '0.9rem', textAlign: 'center' }}>{error}</div>}
        <form onSubmit={manejarLogin} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 'bold', marginBottom: '5px', color: '#334155' }}>Correo Electrónico</label>
            <input type="email" required style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #cbd5e1', boxSizing: 'border-box' }} value={email} onChange={e => setEmail(e.target.value)} />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 'bold', marginBottom: '5px', color: '#334155' }}>Contraseña</label>
            <input type="password" required style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #cbd5e1', boxSizing: 'border-box' }} value={password} onChange={e => setPassword(e.target.value)} />
          </div>
          <button type="submit" disabled={cargando} style={{ padding: '12px', backgroundColor: '#2563eb', color: 'white', border: 'none', borderRadius: '5px', fontWeight: 'bold', cursor: 'pointer', fontSize: '1rem', marginTop: '10px' }}>
            {cargando ? 'Verificando...' : 'Iniciar Sesión'}
          </button>
        </form>
      </div>
    </div>
  )
}

// ==========================================
// 2. LAYOUT PROTEGIDO (Menú Superior)
// ==========================================
function LayoutProtegido() {
  const token = localStorage.getItem('token')
  const navigate = useNavigate()
  const location = useLocation()

  if (!token) return <Navigate to="/login" replace />

  const cerrarSesion = () => {
    localStorage.removeItem('token')
    navigate('/login')
  }

  const linkStyle = (path) => ({
    textDecoration: 'none',
    fontWeight: 'bold',
    padding: '8px 12px',
    borderRadius: '5px',
    color: location.pathname === path ? '#2563eb' : '#64748b',
    backgroundColor: location.pathname === path ? '#eff6ff' : 'transparent',
    transition: 'all 0.2s'
  })

  return (
    <div style={{ backgroundColor: '#f8fafc', minHeight: '100vh', fontFamily: 'system-ui, sans-serif' }}>
      <nav style={{ backgroundColor: 'white', padding: '15px 30px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #e2e8f0', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '30px' }}>
          <h2 style={{ margin: 0, color: '#1e293b', borderRight: '2px solid #e2e8f0', paddingRight: '20px' }}>PluriOne</h2>
          <Link to="/dashboard" style={linkStyle('/dashboard')}>📊 Dashboard Analítico</Link>
          <Link to="/directorio" style={linkStyle('/directorio')}><List size={18} style={{ display: 'inline', verticalAlign: 'text-bottom' }}/> Directorio General</Link>
        </div>
        <button onClick={cerrarSesion} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 15px', backgroundColor: '#f1f5f9', border: 'none', borderRadius: '5px', color: '#475569', cursor: 'pointer', fontWeight: 'bold' }}>
          <LogOut size={18} /> Cerrar Sesión
        </button>
      </nav>
      <div style={{ padding: '30px', maxWidth: '1280px', margin: '0 auto' }}>
        <Outlet />
      </div>
    </div>
  )
}

// ==========================================
// 3. PANTALLA: DASHBOARD ANALÍTICO
// ==========================================
function Dashboard() {
  const [empleados, setEmpleados] = useState([])
  const [cargando, setCargando] = useState(true)
  const [formSimulador, setFormSimulador] = useState({ distancia_km: 10, salario: 25000, desempeno: 3.5 })
  const [resultadoSimulacion, setResultadoSimulacion] = useState(null)
  const [simulando, setSimulando] = useState(false)

  useEffect(() => {
    api.get('/empleados?limite=100')
      .then(respuesta => { setEmpleados(respuesta.data.datos); setCargando(false) })
      .catch(() => setCargando(false))
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
    } catch (error) { console.error(error) }
    setSimulando(false)
  }

  const totalEmpleados = empleados.length;
  const activos = empleados.filter(e => e.estado_activo).length;
  const bajas = totalEmpleados - activos;
  const tasaRotacion = totalEmpleados > 0 ? ((bajas / totalEmpleados) * 100).toFixed(1) : 0;

  const datosGrafica = [
    { rango: 'Cerca (0-15 km)', Retenidos: empleados.filter(e => e.distancia_oficina_km <= 15 && e.estado_activo).length, Renuncias: empleados.filter(e => e.distancia_oficina_km <= 15 && !e.estado_activo).length },
    { rango: 'Medio (16-30 km)', Retenidos: empleados.filter(e => e.distancia_oficina_km > 15 && e.distancia_oficina_km <= 30 && e.estado_activo).length, Renuncias: empleados.filter(e => e.distancia_oficina_km > 15 && e.distancia_oficina_km <= 30 && !e.estado_activo).length },
    { rango: 'Lejos (> 30 km)', Retenidos: empleados.filter(e => e.distancia_oficina_km > 30 && e.estado_activo).length, Renuncias: empleados.filter(e => e.distancia_oficina_km > 30 && !e.estado_activo).length }
  ];

  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px', marginBottom: '30px' }}>
        <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '10px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)', display: 'flex', alignItems: 'center', gap: '15px' }}>
          <div style={{ backgroundColor: '#eff6ff', padding: '15px', borderRadius: '50%', color: '#3b82f6' }}><Users size={28} /></div>
          <div><p style={{ margin: 0, color: '#64748b', fontSize: '0.9rem', fontWeight: 'bold' }}>Muestra Analizada</p><h2 style={{ margin: 0, color: '#0f172a', fontSize: '1.8rem' }}>{totalEmpleados}</h2></div>
        </div>
        <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '10px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)', display: 'flex', alignItems: 'center', gap: '15px' }}>
          <div style={{ backgroundColor: '#f0fdf4', padding: '15px', borderRadius: '50%', color: '#22c55e' }}><UserCheck size={28} /></div>
          <div><p style={{ margin: 0, color: '#64748b', fontSize: '0.9rem', fontWeight: 'bold' }}>Empleados Activos</p><h2 style={{ margin: 0, color: '#0f172a', fontSize: '1.8rem' }}>{activos}</h2></div>
        </div>
        <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '10px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)', display: 'flex', alignItems: 'center', gap: '15px' }}>
          <div style={{ backgroundColor: '#fef2f2', padding: '15px', borderRadius: '50%', color: '#ef4444' }}><UserMinus size={28} /></div>
          <div><p style={{ margin: 0, color: '#64748b', fontSize: '0.9rem', fontWeight: 'bold' }}>Bajas Históricas</p><h2 style={{ margin: 0, color: '#0f172a', fontSize: '1.8rem' }}>{bajas}</h2></div>
        </div>
        <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '10px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)', display: 'flex', alignItems: 'center', gap: '15px' }}>
          <div style={{ backgroundColor: '#f5f3ff', padding: '15px', borderRadius: '50%', color: '#8b5cf6' }}><Activity size={28} /></div>
          <div><p style={{ margin: 0, color: '#64748b', fontSize: '0.9rem', fontWeight: 'bold' }}>Tasa de Rotación</p><h2 style={{ margin: 0, color: '#0f172a', fontSize: '1.8rem' }}>{tasaRotacion}%</h2></div>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '30px', flexWrap: 'wrap' }}>
        <div style={{ flex: '1', minWidth: '350px', backgroundColor: 'white', padding: '25px', borderRadius: '10px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
          <h2 style={{ fontSize: '1.2rem', color: '#334155', marginTop: 0 }}>Simulador de Riesgo (IA)</h2>
          <form onSubmit={ejecutarSimulacion} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            <div>
              <label style={{ display: 'block', fontWeight: 'bold', fontSize: '0.9rem', marginBottom: '5px' }}>Distancia a la oficina (km)</label>
              <input type="number" step="0.1" required style={{ width: '100%', padding: '8px', borderRadius: '5px', border: '1px solid #cbd5e1' }} value={formSimulador.distancia_km} onChange={e => setFormSimulador({...formSimulador, distancia_km: e.target.value})} />
            </div>
            <div>
              <label style={{ display: 'block', fontWeight: 'bold', fontSize: '0.9rem', marginBottom: '5px' }}>Salario Mensual (MXN)</label>
              <input type="number" required style={{ width: '100%', padding: '8px', borderRadius: '5px', border: '1px solid #cbd5e1' }} value={formSimulador.salario} onChange={e => setFormSimulador({...formSimulador, salario: e.target.value})} />
            </div>
            <div>
              <label style={{ display: 'block', fontWeight: 'bold', fontSize: '0.9rem', marginBottom: '5px' }}>Evaluación (1.0 - 5.0)</label>
              <input type="number" step="0.1" min="1" max="5" required style={{ width: '100%', padding: '8px', borderRadius: '5px', border: '1px solid #cbd5e1' }} value={formSimulador.desempeno} onChange={e => setFormSimulador({...formSimulador, desempeno: e.target.value})} />
            </div>
            <button type="submit" disabled={simulando} style={{ padding: '10px', backgroundColor: '#2563eb', color: 'white', border: 'none', borderRadius: '5px', fontWeight: 'bold', cursor: 'pointer' }}>
              {simulando ? 'Analizando...' : 'Ejecutar Predicción'}
            </button>
          </form>
          {resultadoSimulacion && (
            <div style={{ marginTop: '25px', padding: '15px', borderRadius: '8px', backgroundColor: resultadoSimulacion.alerta.includes('ALTO') ? '#fef2f2' : '#f0fdf4', border: `1px solid ${resultadoSimulacion.alerta.includes('ALTO') ? '#fca5a5' : '#86efac'}` }}>
              <h3 style={{ margin: '0 0 10px 0', fontSize: '1.1rem', color: resultadoSimulacion.alerta.includes('ALTO') ? '#991b1b' : '#166534' }}>{resultadoSimulacion.alerta}</h3>
              <p style={{ margin: 0, fontWeight: 'bold', fontSize: '1.2rem', color: '#0f172a' }}>Probabilidad: {resultadoSimulacion.probabilidad_renuncia}</p>
            </div>
          )}
        </div>

        <div style={{ flex: '1', minWidth: '400px', backgroundColor: 'white', padding: '25px', borderRadius: '10px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
          <h2 style={{ fontSize: '1.2rem', color: '#334155', marginTop: 0 }}>Impacto de la Distancia en la Rotación</h2>
          <div style={{ height: '320px', width: '100%', marginTop: '20px' }}>
            {cargando ? <p>Procesando gráfica...</p> : (
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
    </div>
  )
}

// ==========================================
// 4. PANTALLA: DIRECTORIO COMPLETO Y CRUD
// ==========================================
function Directorio() {
  const [empleados, setEmpleados] = useState([])
  const [cargando, setCargando] = useState(true)
  const [modalAbierto, setModalAbierto] = useState(false)
  const [procesandoCrud, setProcesandoCrud] = useState(false)
  const [formNuevo, setFormNuevo] = useState({
    departamento_id: 1,
    puesto_id: 1,
    distancia_oficina_km: 10,
    salario: 25000,
    desempeno: 3.5
  })

  const cargarDatos = () => {
    api.get('/empleados?limite=1000')
      .then(respuesta => { setEmpleados(respuesta.data.datos); setCargando(false) })
      .catch(() => setCargando(false))
  }

  useEffect(() => { cargarDatos() }, [])

  const manejarContratacion = async (e) => {
    e.preventDefault()
    setProcesandoCrud(true)
    try {
      await api.post('/empleados', formNuevo)
      setModalAbierto(false)
      cargarDatos()
    } catch (error) { alert("Error al registrar contratación.") }
    setProcesandoCrud(false)
  }

  const manejarBaja = async (id) => {
    if(!window.confirm(`¿Estás seguro de procesar la baja del empleado ${id.substring(0,8)}...?`)) return;
    try {
      await api.delete(`/empleados/${id}`)
      cargarDatos()
    } catch (error) { alert("Error al procesar la baja.") }
  }

  return (
    <div style={{ backgroundColor: 'white', padding: '30px', borderRadius: '10px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
      
      {/* MODAL DE CONTRATACIÓN CON SALARIO Y DESEMPEÑO */}
      {modalAbierto && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 50 }}>
          <div style={{ backgroundColor: 'white', padding: '30px', borderRadius: '10px', width: '420px', maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
              <h3 style={{ margin: 0, color: '#1e293b' }}>Contratar Nuevo Empleado</h3>
              <button onClick={() => setModalAbierto(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' }}><X size={20}/></button>
            </div>
            <form onSubmit={manejarContratacion} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 'bold', marginBottom: '5px' }}>Departamento</label>
                <select style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #cbd5e1' }} value={formNuevo.departamento_id} onChange={e => setFormNuevo({...formNuevo, departamento_id: parseInt(e.target.value)})}>
                  <option value={1}>Ventas</option>
                  <option value={2}>Tecnología</option>
                  <option value={3}>Operaciones</option>
                  <option value={4}>Recursos Humanos</option>
                </select>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 'bold', marginBottom: '5px' }}>Puesto</label>
                <select style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #cbd5e1' }} value={formNuevo.puesto_id} onChange={e => setFormNuevo({...formNuevo, puesto_id: parseInt(e.target.value)})}>
                  <option value={1}>Analista Jr.</option>
                  <option value={2}>Desarrollador Mid</option>
                  <option value={3}>Gerente</option>
                </select>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 'bold', marginBottom: '5px' }}>Distancia a la Oficina (km)</label>
                <input type="number" required min="1" style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #cbd5e1', boxSizing: 'border-box' }} value={formNuevo.distancia_oficina_km} onChange={e => setFormNuevo({...formNuevo, distancia_oficina_km: parseInt(e.target.value)})} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 'bold', marginBottom: '5px' }}>Salario Mensual (MXN)</label>
                <input type="number" required min="1000" step="500" style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #cbd5e1', boxSizing: 'border-box' }} value={formNuevo.salario} onChange={e => setFormNuevo({...formNuevo, salario: parseFloat(e.target.value)})} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 'bold', marginBottom: '5px' }}>Evaluación Inicial (1.0 - 5.0)</label>
                <input type="number" required min="1" max="5" step="0.1" style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #cbd5e1', boxSizing: 'border-box' }} value={formNuevo.desempeno} onChange={e => setFormNuevo({...formNuevo, desempeno: parseFloat(e.target.value)})} />
              </div>
              <button type="submit" disabled={procesandoCrud} style={{ padding: '12px', backgroundColor: '#10b981', color: 'white', border: 'none', borderRadius: '5px', fontWeight: 'bold', cursor: 'pointer', marginTop: '10px' }}>
                {procesandoCrud ? 'Procesando...' : 'Registrar Contratación'}
              </button>
            </form>
          </div>
        </div>
      )}

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px' }}>
        <div>
          <h2 style={{ fontSize: '1.5rem', color: '#334155', margin: 0 }}>Directorio General de Empleados</h2>
          <p style={{ color: '#64748b', margin: '5px 0 0 0' }}>Mostrando plantilla con métricas predictivas (Distancia, Salario, Desempeño)</p>
        </div>
        <button onClick={() => setModalAbierto(true)} style={{ display: 'flex', alignItems: 'center', gap: '5px', padding: '10px 15px', backgroundColor: '#10b981', color: 'white', border: 'none', borderRadius: '5px', fontWeight: 'bold', cursor: 'pointer' }}>
          <PlusCircle size={18} /> Nueva Contratación
        </button>
      </div>
      
      {cargando ? <p>Cargando registros con métricas...</p> : (
        <div style={{ maxHeight: '600px', overflowY: 'auto', border: '1px solid #e2e8f0', borderRadius: '8px' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead style={{ position: 'sticky', top: 0, zIndex: 10 }}>
              <tr style={{ backgroundColor: '#f8fafc', textAlign: 'left', fontSize: '0.95rem' }}>
                <th style={{ padding: '15px', borderBottom: '2px solid #cbd5e1', color: '#475569' }}>UUID Completo</th>
                <th style={{ padding: '15px', borderBottom: '2px solid #cbd5e1', color: '#475569' }}>Fecha Ingreso</th>
                <th style={{ padding: '15px', borderBottom: '2px solid #cbd5e1', color: '#475569' }}>Distancia</th>
                <th style={{ padding: '15px', borderBottom: '2px solid #cbd5e1', color: '#475569' }}>Salario Mensual</th>
                <th style={{ padding: '15px', borderBottom: '2px solid #cbd5e1', color: '#475569' }}>Desempeño</th>
                <th style={{ padding: '15px', borderBottom: '2px solid #cbd5e1', color: '#475569' }}>Estado</th>
                <th style={{ padding: '15px', borderBottom: '2px solid #cbd5e1', color: '#475569', textAlign: 'center' }}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {empleados.map((emp) => (
                <tr key={emp.id} style={{ borderBottom: '1px solid #f1f5f9', fontSize: '0.9rem', backgroundColor: emp.estado_activo ? 'white' : '#f8fafc' }}>
                  <td style={{ padding: '15px', color: '#64748b', fontFamily: 'monospace' }}>{emp.id}</td>
                  <td style={{ padding: '15px', color: '#334155' }}>{emp.fecha_contratacion}</td>
                  <td style={{ padding: '15px', color: '#334155' }}>{emp.distancia_oficina_km} km</td>
                  <td style={{ padding: '15px', color: '#0f172a', fontWeight: 'bold' }}>
                    ${emp.salario?.toLocaleString('es-MX')} MXN
                  </td>
                  <td style={{ padding: '15px' }}>
                    <span style={{ 
                      padding: '4px 8px', 
                      borderRadius: '6px', 
                      fontWeight: 'bold', 
                      fontSize: '0.85rem',
                      backgroundColor: emp.desempeno >= 3.5 ? '#f0fdf4' : (emp.desempeno >= 2.5 ? '#fefce8' : '#fef2f2'),
                      color: emp.desempeno >= 3.5 ? '#166534' : (emp.desempeno >= 2.5 ? '#854d0e' : '#991b1b')
                    }}>
                      ⭐ {Number(emp.desempeno).toFixed(1)} / 5.0
                    </span>
                  </td>
                  <td style={{ padding: '15px' }}>
                    <span style={{ padding: '5px 10px', borderRadius: '15px', fontSize: '0.8rem', fontWeight: 'bold', backgroundColor: emp.estado_activo ? '#dcfce7' : '#fee2e2', color: emp.estado_activo ? '#166534' : '#991b1b' }}>
                      {emp.estado_activo ? 'Activo' : 'Baja (Histórico)'}
                    </span>
                  </td>
                  <td style={{ padding: '15px', textAlign: 'center' }}>
                    {emp.estado_activo ? (
                      <button onClick={() => manejarBaja(emp.id)} style={{ background: 'none', border: '1px solid #fca5a5', padding: '5px 10px', borderRadius: '5px', color: '#ef4444', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px', margin: '0 auto' }} title="Procesar Baja">
                        <Trash2 size={16} /> Dar de baja
                      </button>
                    ) : <span style={{ color: '#cbd5e1' }}>Sin acciones</span>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

// ==========================================
// 5. ENRUTADOR PRINCIPAL (App)
// ==========================================
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route element={<LayoutProtegido />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/directorio" element={<Directorio />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App