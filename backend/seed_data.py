import asyncio
import random
from faker import Faker
from sqlalchemy import select
from database import SessionLocal
from models import Departamento, Puesto, Empleado, HistorialSalario, EvaluacionDesempeno

# Inicializamos Faker configurado para México
fake = Faker('es_MX')

async def generar_datos_sinteticos():
    async with SessionLocal() as db:
        print("Iniciando generación de datos...")

        # 1. Crear Catálogos (Solo si están vacíos)
        deptos_nombres = ["Ventas", "Tecnología", "Operaciones", "Recursos Humanos"]
        puestos_info = [
            {"titulo": "Analista Jr.", "min": 12000, "max": 18000},
            {"titulo": "Desarrollador Mid", "min": 25000, "max": 40000},
            {"titulo": "Gerente", "min": 45000, "max": 80000}
        ]

        deptos = [Departamento(nombre=n, presupuesto_anual=random.randint(2, 10)*1000000) for n in deptos_nombres]
        puestos = [Puesto(titulo=p["titulo"], rango_salarial_min=p["min"], rango_salarial_max=p["max"]) for p in puestos_info]
        
        db.add_all(deptos)
        db.add_all(puestos)
        await db.commit()

        # Recuperar los IDs generados por PostgreSQL
        depto_ids = [row[0] for row in (await db.execute(select(Departamento.id))).all()]
        puesto_ids = [row[0] for row in (await db.execute(select(Puesto.id))).all()]

        # 2. Generar 1,000 Empleados con Patrones para Machine Learning
        print("Generando 1,000 perfiles de empleados...")
        
        for _ in range(1000):
            # Variables base
            distancia = random.randint(2, 50)  # Kilómetros de casa a la oficina
            puesto_seleccionado = random.choice(puestos_info)
            salario = random.randint(puesto_seleccionado["min"], puesto_seleccionado["max"])
            desempeno = round(random.uniform(2.0, 5.0), 1) # Escala del 1 al 5
            
            # --- CORRELACIÓN MATEMÁTICA PARA EL MODELO ---
            # Partimos de un 10% de probabilidad base de que el empleado haya renunciado
            probabilidad_renuncia = 0.10 
            
            # Si vive a más de 30 km, aumenta el riesgo de fuga drásticamente
            if distancia > 30: 
                probabilidad_renuncia += 0.35 
            # Si su salario está muy cerca del mínimo de su puesto, aumenta el riesgo
            if salario < (puesto_seleccionado["min"] + 2000): 
                probabilidad_renuncia += 0.25
            # Si su desempeño cayó por debajo de 3.0, es probable que se haya ido o lo hayan despedido
            if desempeno < 3.0:
                probabilidad_renuncia += 0.20

            # Determinamos si el empleado sigue activo o ya rotó
            sigue_activo = random.random() > probabilidad_renuncia

            # Insertamos al Empleado
            nuevo_empleado = Empleado(
                departamento_id=random.choice(depto_ids),
                puesto_id=puesto_ids[puestos_info.index(puesto_seleccionado)],
                fecha_contratacion=fake.date_between(start_date='-5y', end_date='-1y'),
                distancia_oficina_km=distancia,
                estado_activo=sigue_activo
            )
            db.add(nuevo_empleado)
            await db.flush() # Flush nos permite obtener el ID del empleado sin hacer commit global aún

            # Agregamos su historial base
            historial = HistorialSalario(
                empleado_id=nuevo_empleado.id,
                monto_mensual=salario,
                fecha_cambio=nuevo_empleado.fecha_contratacion,
                motivo="Contratación Inicial"
            )
            evaluacion = EvaluacionDesempeno(
                empleado_id=nuevo_empleado.id,
                fecha_evaluacion=fake.date_between(start_date='-1y', end_date='today'),
                puntuacion_kpi=desempeno,
                cumplimiento_metas=desempeno * 20 # Lo convertimos a porcentaje (ej. 4.0 -> 80%)
            )
            db.add_all([historial, evaluacion])

        await db.commit()
        print("¡Dataset sintético inyectado exitosamente! La base de datos está lista para el modelo.")

if __name__ == "__main__":
    asyncio.run(generar_datos_sinteticos())