import os
from pathlib import Path
from dotenv import load_dotenv

# Get the project root directory (parent of backend)
BASE_DIR = Path(__file__).resolve().parent.parent

# Load .env from project root explicitly
load_dotenv(BASE_DIR / '.env')

DATABASE_URL = os.getenv(
    "DATABASE_URL",
    "mysql+pymysql://root:SimplePass123@localhost/student_opportunities",
)

# Debug print
print(f"DEBUG: DATABASE_URL loaded = {DATABASE_URL}")

# Other settings can be added here
DEBUG = os.getenv("DEBUG", "False") == "True"