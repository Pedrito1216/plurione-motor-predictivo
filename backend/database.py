from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker, declarative_base

# Reemplaza 'tu_password' con la contraseña de tu instalación local de PostgreSQL
# Asegúrate de crear una base de datos vacía llamada 'plurione_db' en pgAdmin o psql
SQLALCHEMY_DATABASE_URL = "postgresql+asyncpg://postgres:Patitas1@localhost/PluriOne_db"

engine = create_async_engine(SQLALCHEMY_DATABASE_URL, echo=True)
SessionLocal = sessionmaker(engine, class_=AsyncSession, expire_on_commit=False)
Base = declarative_base()