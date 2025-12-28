from sqlalchemy.orm import Session
from . import models

def get_course_by_link(db: Session, link: str):
    return db.query(models.Course).filter(models.Course.link == link).first()

def create_course(db: Session, title: str, link: str, provider: str):
    db_course = models.Course(title=title, link=link, provider=provider)
    db.add(db_course)
    db.commit()
    db.refresh(db_course)
    return db_course

def list_courses(db: Session, limit: int = 100):
    return db.query(models.Course).limit(limit).all()

def list_hackathons(db: Session, limit: int = 100):
    return db.query(models.Hackathon).limit(limit).all()

def list_competitions(db: Session, limit: int = 100):
    return db.query(models.Competition).limit(limit).all()
