from backend.database.connection import Base, engine
from backend.database import models  # Import all your models

print("Creating tables...")
Base.metadata.create_all(bind=engine)
print("✓ All tables created successfully!")