from fastapi import FastAPI, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from database import SessionLocal
from models import Empleado

# Inicializamos la aplicación FastAPI
app = FastAPI(
    title="Motor Predictivo de Rotación API",
    description="API REST para la gestión de empleados y predicción de riesgo (PluriOne)",
    version="1.0.0"
)

# Dependencia para abrir y cerrar la conexión a la base de datos en cada petición
async def get_db():
    async with SessionLocal() as session:
        yield session

# Ruta raíz para comprobar que el servidor está vivo
@app.get("/")
async def root():
    return {"mensaje": "El servidor del Motor Predictivo está en línea."}

# Endpoint 3.2: Obtener listado de empleados (limitado a 5 para probar)
@app.get("/api/v1/empleados")
async def obtener_empleados(limite: int = 5, db: AsyncSession = Depends(get_db)):
    # Hacemos una consulta asíncrona a la tabla de Empleados
    resultado = await db.execute(select(Empleado).limit(limite))
    empleados = resultado.scalars().all()
    
    # Formateamos la respuesta a JSON
    datos = []
    for emp in empleados:
        datos.append({
            "id": str(emp.id),
            "departamento_id": emp.departamento_id,
            "puesto_id": emp.puesto_id,
            "fecha_contratacion": emp.fecha_contratacion,
            "distancia_oficina_km": emp.distancia_oficina_km,
            "estado_activo": emp.estado_activo
        })
        
    return {"total_mostrados": len(datos), "datos": datos}