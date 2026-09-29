import asyncio
from database import engine
from models import Base

async def init_models():
    # Inicia la conexión con la base de datos
    async with engine.begin() as conn:
        # Crea todas las tablas definidas en models.py
        await conn.run_sync(Base.metadata.create_all)
    print("¡Tablas creadas exitosamente en PostgreSQL!")

if __name__ == "__main__":
    asyncio.run(init_models())