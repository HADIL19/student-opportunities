from fastapi import FastAPI
from routers import courses_router, hackathons_router, internships_router
from database.db import Base, engine
from database import models

# Create tables if they don't exist (optional, since you already did it)
Base.metadata.create_all(bind=engine)

app = FastAPI(title="Student Opportunities API")

# Include routers
app.include_router(courses_router.router)
app.include_router(hackathons_router.router)
app.include_router(internships_router.router)

@app.get("/")
def home():
    return {"message": "Welcome to the Student Opportunities API"}
