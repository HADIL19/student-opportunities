from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from database import models, db

router = APIRouter(prefix="/courses", tags=["Courses"])

@router.get("/coursera")
def get_coursera_courses(skip: int = 0, limit: int = 20, database: Session = Depends(db.get_db)):
    return database.query(models.Course).offset(skip).limit(limit).all()

@router.get("/udemy")
def get_udemy_courses(skip: int = 0, limit: int = 20, database: Session = Depends(db.get_db)):
    return database.query(models.UdemyCourse).offset(skip).limit(limit).all()
