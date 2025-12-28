from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from database import models, db

router = APIRouter(prefix="/internships", tags=["Internships"])

@router.get("/")
def get_internships(skip: int = 0, limit: int | None = None, database: Session = Depends(db.get_db)):
    query = database.query(models.Internship).offset(skip)
    if limit:
        query = query.limit(limit)
    return query.all()
