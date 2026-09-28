# Documento de Requerimientos del Producto (PRD)

**Proyecto:** Motor Predictivo de Rotación de Personal  
**Empresa:** PluriOne S.A. de C.V. (Develop Talent & Technology)  
**Autor:** Pedro Gabriel Ocampo Rojas
**Fecha:** .. de Septiembre de 2026  

---

## 1. Propósito y Visión General
El objetivo de este proyecto es desarrollar e implementar una **Prueba de Concepto (PoC)** de un sistema analítico avanzado capaz de estimar el riesgo de que un colaborador abandone la empresa. Al ser un desarrollo del programa académico Dual, el sistema operará en un entorno simulado. Mediante el uso de modelos de Machine Learning, el sistema procesará información histórica generada paramétricamente para generar alertas tempranas, demostrando cómo el departamento de Recursos Humanos de PluriOne podría transitar de un enfoque reactivo a uno proactivo.

## 2. Alcance del Proyecto

**Dentro del alcance (Lo que sí se hará):**
*   Desarrollo de un script automatizado en Python para generar un dataset sintético de 1,000+ perfiles de empleados con patrones lógicos de rotación.
*   Diseño y normalización de una base de datos relacional (PostgreSQL) para almacenar los perfiles generados.
*   Desarrollo de una API REST (FastAPI) para gestionar la comunicación entre los datos y el usuario.
*   Entrenamiento e integración de un modelo predictivo supervisado (Python) para calcular el % de riesgo de fuga.
*   Desarrollo de un Dashboard web (React) para visualizar los niveles de riesgo, métricas clave y generar reportes.

**Fuera del alcance (Lo que NO se hará):**
*   No se utilizarán datos reales de los colaboradores de PluriOne ni se conectará a sus sistemas ERP/Nómina internos por motivos de confidencialidad.
*   El sistema no tomará decisiones automatizadas de despido, contratación o incrementos salariales.

## 3. Historias de Usuario (Casos de Uso)
Para entender cómo interactuarán los usuarios con el sistema, se definen las siguientes historias:
1.  **Como analista de RRHH**, quiero visualizar un panel principal con la lista de empleados ordenados por su nivel de riesgo de rotación (Alto, Medio, Bajo), para enfocar mis esfuerzos de retención en los casos más críticos.
2.  **Como líder de proyecto**, quiero poder ingresar un nuevo perfil o actualizar los datos de un empleado existente (ej. agregar una nueva evaluación de desempeño), para que el sistema recalcule su riesgo de salida en tiempo real.
3.  **Como directivo**, quiero ver métricas globales (ej. tasa de riesgo general de la empresa, departamentos con mayor riesgo) para tomar decisiones estratégicas sobre el clima laboral.

## 4. Requerimientos de Datos y Generación Sintética
El modelo predictivo se entrenará utilizando un dataset ficticio. El script de generación de datos simulará correlaciones estadísticas realistas (ej. bajos salarios y alta distancia al trabajo incrementan el riesgo) sobre las siguientes variables:
*   **Demográficas/Laborales:** Antigüedad en la empresa, departamento, nivel de puesto, salario/rango salarial.
*   **Desempeño y Capacitación:** Calificación de la última evaluación de desempeño, horas de capacitación completadas, desarrollo profesional reciente.
*   **Comportamiento y Clima:** Índice de ausentismo (días faltados en el último semestre), resultados de encuestas de clima laboral, registro de horas extra.

## 5. Requerimientos Técnicos
*   **Backend:** Python 3.x, FastAPI.
*   **Base de Datos:** PostgreSQL (con SQLAlchemy o SQLModel como ORM).
*   **Inteligencia Artificial:** Scikit-learn / XGBoost para el entrenamiento del modelo.
*   **Frontend:** React.js.
*   **Seguridad:** Autenticación de usuarios mediante tokens JWT en la API.

## 6. Criterios de Aceptación (Éxito del Proyecto)
El proyecto se considerará exitoso y listo para la fase de cierre cuando:
1.  El modelo predictivo logre una precisión (Accuracy / F1-Score) aceptable y superior a un modelo aleatorio o base.
2.  El Dashboard web permita hacer el CRUD (Crear, Leer, Actualizar, Eliminar) de los empleados sin errores.
3.  Al actualizar el dato de un empleado en el Dashboard, la predicción de riesgo cambie correctamente respondiendo a los datos ingresados.