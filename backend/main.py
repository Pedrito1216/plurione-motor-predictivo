from fastapi import FastAPI, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from database import SessionLocal
from models import Empleado
import joblib
import os
import pandas as pd

# Inicializamos la aplicación FastAPI
app = FastAPI(
    title="Motor Predictivo de Rotación API",
    description="API REST para la gestión de empleados y predicción de riesgo (PluriOne)",
    version="1.0.0"
)

# 1. CARGAMOS EL MODELO DE IA AL INICIAR EL SERVIDOR
RUTA_MODELO = os.path.join(os.path.dirname(__file__), "ml", "modelo_rotacion.pkl")
try:
    modelo_ia = joblib.load(RUTA_MODELO)
    print("Cerebro de IA cargado correctamente.")
except Exception as e:
    modelo_ia = None
    print(f"Advertencia: No se pudo cargar el modelo de IA. Verifica la ruta: {RUTA_MODELO}")

# 2. ESQUEMA DE DATOS PARA EL SIMULADOR
class SimulacionRiesgo(BaseModel):
    distancia_km: float
    salario: float
    desempeno: float

# --- Dependencia de Base de Datos ---
async def get_db():
    async with SessionLocal() as session:
        yield session

# --- RUTAS ORIGINALES ---
@app.get("/")
async def root():
    return {"mensaje": "El servidor del Motor Predictivo está en línea."}

@app.get("/api/v1/empleados")
async def obtener_empleados(limite: int = 5, db: AsyncSession = Depends(get_db)):
    resultado = await db.execute(select(Empleado).limit(limite))
    empleados = resultado.scalars().all()
    
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

# --- NUEVO ENDPOINT 3.4: EL SIMULADOR DE IA ---
@app.post("/api/v1/predicciones/simulador")
async def simular_riesgo(datos: SimulacionRiesgo):
    if modelo_ia is None:
        raise HTTPException(status_code=500, detail="El modelo predictivo no está disponible.")
    
    # Transformamos el JSON recibido a un DataFrame idéntico al que usamos para entrenar
    df_entrada = pd.DataFrame([{
        "distancia_km": datos.distancia_km,
        "salario": datos.salario,
        "desempeno": datos.desempeno
    }])
    
    # La Inferencia (La IA piensa y decide)
    prediccion = modelo_ia.predict(df_entrada)[0] # 0 = Se queda, 1 = Renuncia
    probabilidad = modelo_ia.predict_proba(df_entrada)[0][1] # Qué tan seguro está del 0 al 1
    
    # Formateamos el resultado
    return {
        "alerta": "🔴 ALTO RIESGO DE FUGA" if prediccion == 1 else "🟢 EMPLEADO ESTABLE",
        "probabilidad_renuncia": f"{probabilidad * 100:.2f}%",
        "parametros_analizados": datos.model_dump()
    }