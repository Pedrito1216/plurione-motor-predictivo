import asyncio
import random
from faker import Faker
from sqlalchemy import select, text
from database import SessionLocal
from models import Departamento, Puesto, Empleado, HistorialSalario, EvaluacionDesempeno

fake = Faker('es_MX')

async def generar_datos_sinteticos():
    async with SessionLocal() as db:
        print("Limpiando registros anteriores para evitar sesgo cruzado...")
        # TRUNCATE con CASCADE borra a los empleados y sus historiales limpiecito
        await db.execute(text("TRUNCATE TABLE empleados CASCADE"))
        await db.commit()

        print("Iniciando generación de nuevos datos...")

        # 1. Crear Catálogos (Solo si están vacíos)
        deptos_nombres = ["Ventas", "Tecnología", "Operaciones", "Recursos Humanos"]
        puestos_info = [
            {"titulo": "Analista Jr.", "min": 12000, "max": 18000},
            {"titulo": "Desarrollador Mid", "min": 25000, "max": 40000},
            {"titulo": "Gerente", "min": 45000, "max": 80000}
        ]

        # Verificamos si los catálogos ya existen
        deptos_existentes = (await db.execute(select(Departamento))).scalars().all()
        if not deptos_existentes:
            db.add_all([Departamento(nombre=n, presupuesto_anual=random.randint(2, 10)*1000000) for n in deptos_nombres])
            db.add_all([Puesto(titulo=p["titulo"], rango_salarial_min=p["min"], rango_salarial_max=p["max"]) for p in puestos_info])
            await db.commit()

        depto_ids = [row[0] for row in (await db.execute(select(Departamento.id))).all()]
        puesto_ids = [row[0] for row in (await db.execute(select(Puesto.id))).all()]

        # 2. Generar 1,000 Empleados con NUEVA CORRELACIÓN MATEMÁTICA
        print("Generando 1,000 perfiles de empleados con lógica proporcional...")
        
        for _ in range(1000):
            distancia = random.randint(2, 50)
            puesto_seleccionado = random.choice(puestos_info)
            salario = random.randint(puesto_seleccionado["min"], puesto_seleccionado["max"])
            desempeno = round(random.uniform(1.0, 5.0), 1)
            
            probabilidad_renuncia = 0.10 
            
            if distancia > 30: 
                probabilidad_renuncia += 0.35 
            if salario < (puesto_seleccionado["min"] + 2000): 
                probabilidad_renuncia += 0.25
            
            # NUEVA LÓGICA: Penalización proporcional lineal
            # Si tiene 5.0, suma 0. Si tiene 1.0, suma 0.40 (40% más de riesgo)
            penalizacion_desempeno = (5.0 - desempeno) * 0.10
            probabilidad_renuncia += penalizacion_desempeno

            sigue_activo = random.random() > probabilidad_renuncia

            nuevo_empleado = Empleado(
                departamento_id=random.choice(depto_ids),
                puesto_id=puesto_ids[puestos_info.index(puesto_seleccionado)],
                fecha_contratacion=fake.date_between(start_date='-5y', end_date='-1y'),
                distancia_oficina_km=distancia,
                estado_activo=sigue_activo
            )
            db.add(nuevo_empleado)
            await db.flush()

            db.add_all([
                HistorialSalario(empleado_id=nuevo_empleado.id, monto_mensual=salario, fecha_cambio=nuevo_empleado.fecha_contratacion, motivo="Contratación Inicial"),
                EvaluacionDesempeno(empleado_id=nuevo_empleado.id, fecha_evaluacion=fake.date_between(start_date='-1y', end_date='today'), puntuacion_kpi=desempeno, cumplimiento_metas=desempeno * 20)
            ])

        await db.commit()
        print("¡Dataset sintético proporcional inyectado exitosamente!")

if __name__ == "__main__":
    asyncio.run(generar_datos_sinteticos())