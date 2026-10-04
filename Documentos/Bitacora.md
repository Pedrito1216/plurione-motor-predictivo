# Bitácora de Desarrollo y Seguimiento Técnico

**Proyecto:** PluriOne V2.1 — Motor Predictivo de Rotación

## Datos del Documento

* **Autor:** Pedro Gabriel Ocampo Rojas
* **Institución:** Tecnológico de Estudios Superiores de Ecatepec (TESE) / TODO Academy
* **Fecha de Emisión:** Octubre 2026

---

## Fase 1: Configuración de Arquitectura y Base de Datos

* **Objetivo:** Establecer la infraestructura base y la capa de persistencia.
* **Actividades Realizadas:**
  * Configuración de entorno virtual en Python (`venv`) e instalación de dependencias (`requirements.txt`).
  * Diseño del modelo Entidad-Relación para RRHH (Empleados, Salarios, Evaluaciones, Administradores).
  * Implementación de la conexión asíncrona a PostgreSQL mediante SQLAlchemy (`database.py`).
  * Ejecución de migraciones y script de aprovisionamiento inicial (`crear_admin.py`) con encriptación Bcrypt.
* **Estado:** Completado.

---

## Fase 2: Desarrollo del Backend y API REST (FastAPI)

* **Objetivo:** Construir los endpoints transaccionales y de seguridad.
* **Actividades Realizadas:**
  * Implementación de autenticación basada en JSON Web Tokens (JWT) con el esquema `OAuth2PasswordBearer`.
  * Desarrollo del endpoint público de Login (`/api/v1/login`) con validación de credenciales.
  * Construcción del CRUD de Empleados protegido por token, implementando la estrategia de Soft Delete (Borrado Lógico) para no alterar métricas históricas.
  * Creación del endpoint de Control de Accesos para registrar nuevos administradores de forma segura.
* **Estado:** Completado.

---

## Fase 3: Integración de Machine Learning e Inteligencia Artificial (XAI)

* **Objetivo:** Acoplar el modelo de Random Forest y dotarlo de explicabilidad.
* **Actividades Realizadas:**
  * Carga en memoria RAM del modelo pre-entrenado (`.pkl`) utilizando `joblib`.
  * Creación del endpoint `/api/v1/predicciones/simulador` para recibir variables operativas (Salario, Distancia, Desempeño).
  * Programación del motor de Inteligencia Artificial Explicable (XAI) mediante reglas heurísticas para traducir la predicción matemática a un diagnóstico en lenguaje natural (ej. *"Riesgo de fuga por subvaloración"*).
* **Estado:** Completado.

---

## Fase 4: Construcción del Frontend (React + Vite)

* **Objetivo:** Desarrollar la Interfaz de Usuario (SPA) y el enrutamiento protegido.
* **Actividades Realizadas:**
  * Configuración del proyecto con Vite e instalación de librerías (`axios`, `react-router-dom`, `lucide-react`, `recharts`).
  * Implementación de Axios Interceptor para inyectar automáticamente el token JWT en las cabeceras de cada petición.
  * Construcción de los componentes de navegación superior (Barra de menús) y guardias de rutas privadas (`LayoutProtegido`).
  * Desarrollo del módulo Directorio General: Tabla interactiva de empleados con semáforos de desempeño y botón de baja lógica.
  * Desarrollo del módulo Control de Accesos: Formulario de alta para personal de RRHH y tabla de lectura.
* **Estado:** Completado.

---

## Fase 5: Dashboard Analítico y Reporteo

* **Objetivo:** Visualizar métricas en tiempo real y exportar resultados.
* **Actividades Realizadas:**
  * Eliminación de límites artificiales en las consultas de base de datos para que la "Muestra Analizada" refleje el 100% de la plantilla histórica.
  * Implementación de interactividad Drill-down: Creación de ventanas modales dinámicas al hacer clic en las tarjetas de "Empleados Activos" y "Bajas".
  * Integración de Recharts para generar la gráfica de barras de retención por distancia y la gráfica de líneas para el análisis de cohortes temporales.
  * Desarrollo de la función nativa en JavaScript (Blob API) para compilar y descargar reportes predictivos de la IA en formato `.txt`.
* **Estado:** Completado.

---

## Fase 6: Documentación Técnica y Cierre

* **Objetivo:** Cumplir con los entregables administrativos del Modelo Dual.
* **Actividades Realizadas:**
  * Redacción del archivo `README.md` maestro en la raíz del repositorio.
  * Elaboración del Product Requirements Document (PRD) detallando alcance, público objetivo y requisitos funcionales.
  * Creación del Manual Técnico con la arquitectura del sistema, diccionario de base de datos y flujos de endpoints.
  * Creación del Manual de Usuario con las instrucciones operativas para el cliente final.
  * Ejecución de micro-commits en Git y despliegue final del código fuente en el repositorio principal de GitHub.
* **Estado:** Completado.