import bcrypt
import jwt
from datetime import datetime, timedelta

# En un entorno real de producción, esta clave secreta viviría oculta en un archivo .env
CLAVE_SECRETA = "plurione_tese_secreto_2026"
ALGORITMO = "HS256"
TIEMPO_EXPIRACION_MINUTOS = 60 # El gafete virtual durará 1 hora

def verificar_password(password_plana, password_encriptada):
    """Compara la contraseña que escribe el usuario con el hash de PostgreSQL"""
    return bcrypt.checkpw(password_plana.encode('utf-8'), password_encriptada.encode('utf-8'))

def crear_token_acceso(datos: dict):
    """Genera el gafete virtual JWT con una fecha de caducidad"""
    a_codificar = datos.copy()
    expiracion = datetime.utcnow() + timedelta(minutes=TIEMPO_EXPIRACION_MINUTOS)
    a_codificar.update({"exp": expiracion})
    
    token_jwt = jwt.encode(a_codificar, CLAVE_SECRETA, algorithm=ALGORITMO)
    return token_jwt