from sqlalchemy import create_engine, text
from .connection import engine, Base

def init_db():
    # For SQLite, no need to create database
    if 'sqlite' not in str(engine.url):
        db_url = str(engine.url).replace(engine.url.database, '')
        temp_engine = create_engine(db_url)
        with temp_engine.connect() as conn:
            conn.execute(text("CREATE DATABASE IF NOT EXISTS student_opportunities"))
            conn.commit()
        temp_engine.dispose()
    
    Base.metadata.create_all(bind=engine)

if __name__ == "__main__":
    init_db()
    print("Database initialized (tables created)")
