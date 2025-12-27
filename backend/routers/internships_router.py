from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from database import models, db

router = APIRouter(prefix="/internships", tags=["Internships"])

@router.get("/")
def get_internships(skip: int = 0, limit: int = 20, database: Session = Depends(db.get_db)):
    return database.query(models.Internship).offset(skip).limit(limit).all()
