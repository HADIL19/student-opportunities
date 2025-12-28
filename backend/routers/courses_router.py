from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from database import models, db

router = APIRouter(prefix="/courses", tags=["Courses"])

@router.get("/coursera")
def get_coursera_courses(skip: int = 0, limit: int | None = None, database: Session = Depends(db.get_db)):
    query = database.query(models.Course).offset(skip)
    if limit:
        query = query.limit(limit)
    return query.all()

@router.get("/udemy")
def get_udemy_courses(skip: int = 0, limit: int | None = None, database: Session = Depends(db.get_db)):
    query = database.query(models.UdemyCourse).offset(skip)
    if limit:
        query = query.limit(limit)
    return query.all()


@router.get("/counts")
def get_course_counts(database: Session = Depends(db.get_db)):
    coursera_count = database.query(models.Course).count()
    udemy_count = database.query(models.UdemyCourse).count()
    return {"coursera": coursera_count, "udemy": udemy_count, "total": coursera_count + udemy_count}
