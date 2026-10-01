import asyncio
import bcrypt
from database import engine, SessionLocal
from models import Base, UsuarioAdmin
from sqlalchemy.future import select

async def instalar_admin():
    # 1. Le decimos a PostgreSQL que cree la nueva tabla si no existe
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

    # 2. Insertamos la cuenta administrativa
    async with SessionLocal() as db:
        # Verificamos que no esté duplicado
        resultado = await db.execute(select(UsuarioAdmin).filter(UsuarioAdmin.email == "admin@plurione.com"))
        if resultado.scalars().first():
            print("El usuario ya existe.")
            return

        # Usamos bcrypt directamente para encriptar
        contrasena_real = "admin123"
        sal_criptografica = bcrypt.gensalt()
        contrasena_encriptada = bcrypt.hashpw(contrasena_real.encode('utf-8'), sal_criptografica).decode('utf-8')

        nuevo_admin = UsuarioAdmin(
            email="admin@plurione.com",
            hashed_password=contrasena_encriptada,
            nombre_completo="Pedro Gabriel Ocampo Rojas"
        )
        
        db.add(nuevo_admin)
        await db.commit()
        print("✅ ¡Usuario Administrador creado exitosamente!")
        print("Correo: admin@plurione.com")
        print("Clave secreta guardada como hash irreconocible en PostgreSQL.")

if __name__ == "__main__":
    asyncio.run(instalar_admin())