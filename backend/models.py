from sqlalchemy import Column, Integer, String, Float, Boolean, Date, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from database import Base
import uuid

# --- Catálogos ---
class Departamento(Base):
    __tablename__ = "cat_departamentos"
    id = Column(Integer, primary_key=True, index=True)
    nombre = Column(String, unique=True, index=True)
    presupuesto_anual = Column(Float)

class Puesto(Base):
    __tablename__ = "cat_puestos"
    id = Column(Integer, primary_key=True, index=True)
    titulo = Column(String, unique=True, index=True)
    rango_salarial_min = Column(Float)
    rango_salarial_max = Column(Float)

# --- Tabla Núcleo ---
class Empleado(Base):
    __tablename__ = "empleados"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    puesto_id = Column(Integer, ForeignKey("cat_puestos.id"))
    departamento_id = Column(Integer, ForeignKey("cat_departamentos.id"))
    fecha_contratacion = Column(Date)
    distancia_oficina_km = Column(Integer)
    estado_activo = Column(Boolean, default=True)

# --- Tablas Transaccionales ---
class HistorialSalario(Base):
    __tablename__ = "historial_salarios"
    id = Column(Integer, primary_key=True, index=True)
    empleado_id = Column(UUID(as_uuid=True), ForeignKey("empleados.id"))
    monto_mensual = Column(Float)
    fecha_cambio = Column(Date)
    motivo = Column(String)

class EvaluacionDesempeno(Base):
    __tablename__ = "evaluaciones_desempeno"
    id = Column(Integer, primary_key=True, index=True)
    empleado_id = Column(UUID(as_uuid=True), ForeignKey("empleados.id"))
    fecha_evaluacion = Column(Date)
    puntuacion_kpi = Column(Float)
    cumplimiento_metas = Column(Float)

class EncuestaClima(Base):
    __tablename__ = "encuestas_clima"
    id = Column(Integer, primary_key=True, index=True)
    empleado_id = Column(UUID(as_uuid=True), ForeignKey("empleados.id"))
    fecha_encuesta = Column(Date)
    satisfaccion_liderazgo = Column(Integer)
    balance_vida_trabajo = Column(Integer)

class Capacitacion(Base):
    __tablename__ = "capacitaciones"
    id = Column(Integer, primary_key=True, index=True)
    empleado_id = Column(UUID(as_uuid=True), ForeignKey("empleados.id"))
    nombre_curso = Column(String)
    horas_invertidas = Column(Integer)
    fecha_termino = Column(Date)

class RegistroAusentismo(Base):
    __tablename__ = "registro_ausentismos"
    id = Column(Integer, primary_key=True, index=True)
    empleado_id = Column(UUID(as_uuid=True), ForeignKey("empleados.id"))
    fecha_falta = Column(Date)
    motivo_justificado = Column(Boolean, default=False)