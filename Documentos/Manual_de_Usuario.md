# Manual de Usuario

**PluriOne V2.1 — Plataforma Predictiva de Recursos Humanos**

## Datos del Documento

* **Sistema:** PluriOne (Motor Predictivo de Rotación)

* **Versión:** 2.1.0

* **Autor:** Pedro Gabriel Ocampo Rojas

* **Perfil del Lector:** Gerentes de RRHH, Analistas de Retención y Administradores.

## 1. Introducción

Bienvenido a **PluriOne**, la plataforma de gestión de talento impulsada por Inteligencia Artificial. Este sistema le permitirá administrar su plantilla laboral y utilizar un motor predictivo avanzado para identificar qué empleados tienen un alto riesgo de renuncia, ayudándole a tomar decisiones proactivas para retener a su mejor talento.

## 2. Acceso al Sistema (Login)

Por motivos de confidencialidad, PluriOne es un sistema cerrado. No existe un botón de registro público; sus credenciales deben ser proporcionadas por el administrador del sistema.

1. Abra su navegador web e ingrese a la dirección de la plataforma.

2. Visualizará la pantalla de **"Acceso Administrativo PluriOne"**.

3. Ingrese su **Correo Electrónico** institucional y su **Contraseña**.

4. Presione el botón azul **"Iniciar Sesión"**. Si los datos son correctos, ingresará automáticamente al Dashboard Analítico.

> *[Espacio reservado para captura de pantalla: Pantalla de Login]*

## 3. Barra de Navegación Principal

En la parte superior de la pantalla encontrará el menú fijo que le permite moverse por los tres módulos principales de la plataforma sin perder su información:

* **Dashboard Analítico:** Pantalla principal de KPIs y simulador de IA.

* **Directorio General:** Gestión operativa de los empleados (altas y bajas).

* **Control de Accesos:** Panel exclusivo para dar de alta a nuevos administradores.

* **Botón "Cerrar Sesión":** Ubicado a la derecha, para salir de forma segura.

## 4. Módulo 1: Dashboard Analítico y Drill-Down

Esta es su pantalla de control gerencial. Está dividida en indicadores clave (KPIs) interactivos y gráficas en tiempo real.

### Tarjetas Interactivas (Drill-down)

En la parte superior verá 4 recuadros estadísticos. Tres de ellos son interactivos (al pasar el cursor sobre ellos, se iluminarán):

* **Muestra Analizada:** Total de registros históricos evaluados por el sistema.

* **Empleados Activos (Verde):** Al hacer clic, se abrirá una ventana mostrando la lista detallada de todo el personal que actualmente labora en la empresa.

* **Bajas Históricas (Rojo):** Al hacer clic, mostrará la lista del personal inactivo.

* **Tasa de Rotación (Morado):** Al hacer clic, desplegará la **"Gráfica de Tendencia"**, que compara cuántas contrataciones hubo en un mes versus cuántas de esas personas ya se han dado de baja.

> *[Espacio reservado para captura de pantalla: Tarjetas de KPIs y Gráfica de Líneas]*

### Gráfica de Impacto de Distancia

En la parte inferior derecha visualizará un gráfico de barras que clasifica a la plantilla por su cercanía a la oficina (*Cerca*, *Medio*, *Lejos*) y compara a los empleados retenidos (verde) contra las renuncias (rojo).

## 5. Simulador de Riesgo de IA y Exportación

Ubicado en la parte inferior izquierda del Dashboard. Esta herramienta le permite evaluar el riesgo de fuga de un perfil antes de tomar decisiones (ej. antes de un aumento salarial o cambio de sede).

### Cómo realizar una predicción

1. **Distancia a la oficina (km):** Ingrese los kilómetros aproximados de traslado.

2. **Salario Mensual (MXN):** Ingrese el sueldo bruto nominal.

3. **Evaluación ($1.0$ - $5.0$):** Ingrese la última calificación de desempeño del empleado.

4. Presione **"Ejecutar Predicción"**.

### Interpretación de Resultados

La IA procesará los datos y generará un recuadro de resultados que incluye:

* **Nivel de Alerta:** Semáforo Verde (*Estable*) o Rojo (*Alto Riesgo*).

* **Probabilidad de Renuncia:** Porcentaje exacto calculado por el algoritmo.

* **Diagnóstico IA (XAI):** Explicación en lenguaje natural detallando por qué el modelo llegó a esa conclusión (ej. *"El salario se encuentra por debajo del umbral competitivo"*).

### Descargar Reporte

Debajo del diagnóstico encontrará el botón **"Descargar Reporte (TXT)"**. Al presionarlo, se descargará un archivo de texto oficial en su equipo con los resultados del diagnóstico, ideal para adjuntarlo al expediente del trabajador.

> *[Espacio reservado para captura de pantalla: Simulador con resultado predictivo y diagnóstico]*

## 6. Módulo 2: Directorio General de Empleados

Esta pantalla es el centro de operaciones de Recursos Humanos para gestionar la plantilla laboral.

### Visualización de la Plantilla

Muestra una tabla con todos los registros. Podrá observar el UUID del empleado, su distancia, salario mensual y un semáforo visual de su desempeño:

* **Verde:** Desempeño sobresaliente.

* **Amarillo:** Desempeño regular.

* **Rojo:** Desempeño deficiente.

### Contratar Nuevo Empleado

1. Presione el botón verde **"Nueva Contratación"** en la esquina superior derecha.

2. Se desplegará una ventana flotante (*Modal*).

3. Seleccione el **Departamento** y **Puesto**.

4. Ingrese la **Distancia**, **Salario Mensual** y **Evaluación Inicial**.

5. Presione **"Registrar Contratación"**. El empleado aparecerá inmediatamente en la cima de la tabla.

### Dar de Baja a un Empleado

En la columna de **"Acciones"**, los empleados activos disponen de un botón con ícono de papelera roja (**"Dar de baja"**):

1. Al presionarlo, el sistema solicitará una confirmación de seguridad.

2. Al confirmar, el empleado cambiará su estado a **"Baja (Histórico)"**.

> **Nota:** El sistema aplica un borrado lógico (*Soft Delete*); el registro no se elimina permanentemente para preservar las métricas históricas del Dashboard.

> *[Espacio reservado para captura de pantalla: Tabla del Directorio y Modal de Contratación]*

## 7. Módulo 3: Control de Accesos

Si cuenta con permisos de acceso a la plataforma, dispone de privilegios para habilitar a nuevos integrantes del equipo directivo o de Recursos Humanos:

1. Ingrese a la pestaña **"Control de Accesos"**.

2. En la tabla de la derecha podrá consultar al personal autorizado actualmente.

3. En el formulario de la izquierda, capture el **Nombre Completo** y **Correo Corporativo** del nuevo usuario.

4. Asigne una **Contraseña Temporal** (mínimo 6 caracteres).

5. Presione **"Conceder Acceso"**. El nuevo usuario quedará habilitado para iniciar sesión inmediatamente.

> *[Espacio reservado para captura de pantalla: Panel de Control de Accesos]*

## 8. Soporte Técnico

Para asistencia técnica, recuperación de bases de datos o mantenimiento del modelo predictivo, contacte al departamento de TI o al responsable de la arquitectura de software:

* **Responsable:** Pedro Gabriel Ocampo Rojas

* **Área:** Ingeniería en Sistemas Computacionales / Arquitectura de Software