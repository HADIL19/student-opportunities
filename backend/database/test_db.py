import sys
import os

# Add the parent folder to sys.path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

# Now you can import database.py
from db import DATABASE_URL

# SQLAlchemy import
from sqlalchemy import create_engine

# Test connection
try:
    engine = create_engine(DATABASE_URL)
    connection = engine.connect()
    print("✅ Connected to MySQL successfully!")
    connection.close()
except Exception as e:
    print("❌ Connection failed:", e)
