from sqlalchemy import Column, Integer, String, DateTime,Text
from sqlalchemy.sql import func
from .connection import Base

# Coursera Courses (existing)
class Course(Base):
    __tablename__ = "courses"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(500), nullable=False)
    link = Column(String(500), nullable=False, unique=True)
    provider = Column(String(200))
    scraped_at = Column(DateTime(timezone=True), server_default=func.now())


# Udemy Courses (existing)
class UdemyCourse(Base):
    __tablename__ = "udemy_courses"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(255), nullable=False)
    link = Column(String(255), nullable=False, unique=True)
    provider = Column(String(100), default="Udemy")
    price = Column(String(50), default="Free")
    scraped_at = Column(DateTime(timezone=True), server_default=func.now())


class Hackathon(Base):
    __tablename__ = "hackathons"
    
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(255), nullable=False)
    link = Column(String(255), nullable=False)
    status = Column(String(50))
    location = Column(String(100))
    submission_period = Column(String(100))
    prize_amount = Column(String(50))
    participants = Column(Integer, default=0)
    host = Column(String(100))
    themes = Column(String(255))
    managed_by_devpost = Column(String(10))
    days_left = Column(String(50))
    scraped_at = Column(DateTime(timezone=True), server_default=func.now())

class LablabHackathon(Base):
    __tablename__ = "lablab_hackathons"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(500), nullable=False)
    link = Column(String(500), nullable=False, unique=True)
    status = Column(String(50), default="Unknown")
    location = Column(String(200), default="Online")
    submission_period = Column(String(200))
    prize_amount = Column(String(100))
    participants = Column(Integer, default=0)
    themes = Column(Text)
    days_left = Column(String(50))
    start_date = Column(DateTime(timezone=True))
    end_date = Column(DateTime(timezone=True))
    image_url = Column(String(500))
    scraped_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(
        DateTime(timezone=True),
        server_default=func.now(),
        onupdate=func.now(),
    )
    
class Competition(Base):
    __tablename__ = "competitions"
    
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(255), nullable=False)
    link = Column(String(255), nullable=False)
    status = Column(String(50))
    location = Column(String(100))
    submission_period = Column(String(100))
    prize_amount = Column(String(50))
    participants = Column(Integer, default=0)
    host = Column(String(100))
    themes = Column(String(255))
    managed_by_devpost = Column(String(10))
    days_left = Column(String(50))
    scraped_at = Column(DateTime(timezone=True), server_default=func.now())
