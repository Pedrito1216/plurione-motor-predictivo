import asyncio
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score, classification_report
import joblib
import os
import sys

# Agregamos la carpeta 'backend' al path para poder importar nuestra base de datos
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from database import SessionLocal
from models import Empleado, HistorialSalario, EvaluacionDesempeno
from sqlalchemy.future import select

async def extraer_datos():
    async with SessionLocal() as db:
        # Extraemos las tablas a memoria
        empleados = (await db.execute(select(Empleado))).scalars().all()
        salarios = (await db.execute(select(HistorialSalario))).scalars().all()
        evaluaciones = (await db.execute(select(EvaluacionDesempeno))).scalars().all()
        return empleados, salarios, evaluaciones

def entrenar_modelo():
    print("1. Extrayendo datos históricos de PostgreSQL...")
    empleados, salarios, evaluaciones = asyncio.run(extraer_datos())
    
    # Convertimos los datos de SQLAlchemy a DataFrames de Pandas
    df_emp = pd.DataFrame([{
        "id": e.id, 
        "distancia_km": e.distancia_oficina_km, 
        # La IA necesita números, así que: 1 = Renunció (Riesgo), 0 = Activo
        "renuncio": 0 if e.estado_activo else 1 
    } for e in empleados])
    
    df_sal = pd.DataFrame([{"id": s.empleado_id, "salario": s.monto_mensual} for s in salarios])
    df_eval = pd.DataFrame([{"id": ev.empleado_id, "desempeno": ev.puntuacion_kpi} for ev in evaluaciones])
    
    print("2. Construyendo el Vector de Características...")
    # Unimos las 3 tablas usando el ID del empleado
    df_completo = df_emp.merge(df_sal, on="id").merge(df_eval, on="id")
    
    # Definimos nuestras variables predictoras (X) y lo que queremos predecir (y)
    X = df_completo[["distancia_km", "salario", "desempeno"]]
    y = df_completo["renuncio"]
    
    # Dividimos los datos: 80% para entrenar, 20% para poner a prueba al modelo a ciegas
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
    
    print("3. Entrenando el algoritmo Random Forest...")
    # Creamos un bosque de 100 árboles de decisión
    modelo = RandomForestClassifier(n_estimators=100, max_depth=5, random_state=42)
    modelo.fit(X_train, y_train)
    
    print("4. Evaluando el modelo...")
    predicciones = modelo.predict(X_test)
    precision = accuracy_score(y_test, predicciones)
    
    print(f"\n>>> ¡Entrenamiento Exitoso! Precisión del modelo: {precision * 100:.2f}% <<<")
    print("\nReporte de Clasificación:")
    print(classification_report(y_test, predicciones))
    
    # Guardamos el modelo como un archivo binario (.pkl)
    ruta_guardado = os.path.join(os.path.dirname(__file__), "modelo_rotacion.pkl")
    joblib.dump(modelo, ruta_guardado)
    print(f"\n[OK] Cerebro de IA guardado en: {ruta_guardado}")

if __name__ == "__main__":
    entrenar_modelo()