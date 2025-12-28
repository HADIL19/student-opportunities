from fastapi import APIRouter
from backend.database.connection import SessionLocal
from backend.database import crud

router = APIRouter()


@router.get("/competitions")
def get_competitions(limit: int = 100):
    db = SessionLocal()
    try:
        return crud.list_competitions(db, limit=limit)
    finally:
        db.close()
