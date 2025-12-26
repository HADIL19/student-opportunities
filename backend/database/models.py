from sqlalchemy import Column, Integer, String, DateTime
from sqlalchemy.sql import func
from db import Base

class Course(Base):
    __tablename__ = "courses"  # matches your MySQL table
    
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(255), nullable=False)
    link = Column(String(255), nullable=False)
    provider = Column(String(100))
    scraped_at = Column(DateTime(timezone=True), server_default=func.now())
