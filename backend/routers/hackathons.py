from fastapi import APIRouter
from backend.database.connection import SessionLocal
from backend.database import crud

router = APIRouter()


@router.get("/hackathons")
def get_hackathons(limit: int = 100):
    db = SessionLocal()
    try:
        return crud.list_hackathons(db, limit=limit)
    finally:
        db.close()
