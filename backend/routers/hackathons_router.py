from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from database import models, db

router = APIRouter(prefix="/hackathons", tags=["Hackathons"])

@router.get("/devpost")
def get_devpost_hackathons(skip: int = 0, limit: int = 20, database: Session = Depends(db.get_db)):
    return database.query(models.Hackathon).offset(skip).limit(limit).all()

@router.get("/lablab")
def get_lablab_hackathons(skip: int = 0, limit: int = 20, database: Session = Depends(db.get_db)):
    return database.query(models.LablabHackathon).offset(skip).limit(limit).all()
