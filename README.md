# Motor Predictivo de Rotación - Plurione (v2.1)

Sistema integral Full-Stack diseñado para la gestión de recursos humanos y el análisis predictivo de rotación de personal (*Churn Rate*). Este proyecto combina un panel administrativo seguro con un modelo de Inteligencia Artificial capaz de predecir el riesgo de fuga de los empleados con base en métricas operativas.

> **Nota:** Desarrollado como Prueba de Concepto (PoC) para el Modelo Dual - Tecnológico de Estudios Superiores de Ecatepec (TESE).

---

## 1. Arquitectura y Stack Tecnológico

El proyecto está dividido en dos servicios principales:

### Frontend (Client-Side)
- **React.js (Vite)**
- **React Router DOM:** Navegación protegida y enrutamiento.
- **Recharts:** Visualización de datos y análisis de cohortes.
- **Axios:** Consumo de API e intercepción de tokens.
- **Lucide React:** Sistema de iconografía UI/UX.

### Backend (Server-Side & ML)
- **FastAPI:** API REST asíncrona.
- **PostgreSQL + SQLAlchemy:** Base de datos relacional y ORM.
- **Scikit-Learn + Pandas + Joblib:** Entrenamiento e inferencia del modelo Random Forest.
- **JWT + Bcrypt:** Autenticación y encriptación de credenciales.

---

## 2. Características Principales

- **Inteligencia Artificial Explicable (XAI):** Simulador predictivo que evalúa distancia, salario y desempeño, detallando en lenguaje humano el motivo exacto del riesgo de fuga.
- **Seguridad JWT:** Sistema perimetral cerrado con autenticación basada en JSON Web Tokens.
- **Control de Accesos (Multi-Admin):** Módulo interno para dar de alta a nuevos miembros del equipo de Recursos Humanos.
- **Directorio General y CRUD:** Gestión ininterrumpida de la plantilla con borrado lógico para preservar la integridad del histórico analítico.
- **Dashboard Analítico con Drill-Down:** Exploración de datos interactiva, modales de visualización y análisis de tendencias de retención.
- **Exportación de Datos:** Generación en tiempo real de reportes de diagnóstico en formato TXT.

---

## 3. Instrucciones de Instalación y Despliegue

### Configuración del Servidor (Backend)

1. Desde la terminal, ingresa a la carpeta `backend`:
   ```bash
   cd backend
   ```

2. Crea y activa el entorno virtual:
   - **En Windows (PowerShell):**
     ```powershell
     python -m venv venv
     .\venv\Scripts\Activate.ps1
     ```
   - **En Linux/macOS:**
     ```bash
     python3 -m venv venv
     source venv/bin/activate
     ```

3. Instala las dependencias:
   ```bash
   pip install -r requirements.txt
   ```

4. Asegúrate de tener PostgreSQL corriendo con la base de datos `plurione_db` (o ajusta la URL de conexión en tu archivo `database.py`).

5. Inicia el servidor:
   ```bash
   uvicorn main:app --reload
   ```
   > El servidor estará disponible en: [http://127.0.0.1:8000](http://127.0.0.1:8000)

---

### Configuración de la Interfaz (Frontend)

1. Abre una nueva terminal e ingresa a la carpeta `frontend`:
   ```bash
   cd frontend
   ```

2. Instala los módulos de Node:
   ```bash
   npm install
   ```

3. Inicia el servidor de desarrollo:
   ```bash
   npm run dev
   ```
   > La aplicación web estará disponible en: [http://localhost:5173](http://localhost:5173)

---

### Primer Acceso

Para generar el usuario maestro inicial de la plataforma, ejecuta el siguiente script desde la carpeta `backend` con el servidor apagado:

```bash
python crear_admin.py
```

---

## Autor

- **Pedro Gabriel Ocampo Rojas**  
  *Ingeniería en Sistemas Computacionales*