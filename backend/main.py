from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import courses_router, hackathons_router, internships_router
from database.db import Base, engine
from database import models
import uvicorn

# Create tables if they don't exist (optional, since you already did it)
Base.metadata.create_all(bind=engine)

app = FastAPI(title="Student Opportunities API")

# CORS - allow the frontend dev server (Vite) and localhost
origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://localhost:3000",
    "http://127.0.0.1:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins + ["http://localhost", "http://127.0.0.1"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(courses_router.router)
app.include_router(hackathons_router.router)
app.include_router(internships_router.router)


@app.get("/")
def home():
    return {"message": "Welcome to the Student Opportunities API"}


if __name__ == "__main__":
    # When running via `python main.py` pass the app object directly.
    # Do NOT enable `reload` here (uvicorn requires an import string for reload).
    uvicorn.run(app, host="0.0.0.0", port=8000, reload=False)
