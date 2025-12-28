from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from database import models, db

router = APIRouter(prefix="/hackathons", tags=["Hackathons"])

@router.get("/devpost")
def get_devpost_hackathons(skip: int = 0, limit: int | None = None, database: Session = Depends(db.get_db)):
    query = database.query(models.Hackathon).offset(skip)
    if limit:
        query = query.limit(limit)
    return query.all()

@router.get("/lablab")
def get_lablab_hackathons(skip: int = 0, limit: int | None = None, database: Session = Depends(db.get_db)):
    query = database.query(models.LablabHackathon).offset(skip)
    if limit:
        query = query.limit(limit)
    return query.all()
