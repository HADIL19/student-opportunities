from fastapi import APIRouter
from backend.database.connection import SessionLocal
from backend.database import crud

router = APIRouter()


@router.get("/courses")
def get_courses(limit: int = 100):
    try:
        db = SessionLocal()
        try:
            return crud.list_courses(db, limit=limit)
        finally:
            db.close()
    except Exception as e:
        return {"error": str(e)}
