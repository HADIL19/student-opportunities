from sqlalchemy import Column, Integer, String, DateTime
from sqlalchemy.sql import func
from .connection import Base

class Course(Base):
    __tablename__ = "courses"  # matches your MySQL table
    
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(255), nullable=False)
    link = Column(String(255), nullable=False)
    provider = Column(String(100))
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
