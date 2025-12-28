from fastapi import APIRouter, Query
from typing import Optional
from sqlalchemy.orm import Session
from backend.database.connection import SessionLocal
from backend.database import models

router = APIRouter()


@router.get("/courses")
def get_courses(
    provider: Optional[str] = Query(None, description="Filter by provider"),
    search: Optional[str] = Query(None, description="Search in title or provider"),
    sort_by: Optional[str] = Query("newest", description="Sort by: newest (A-Z title)"),
    limit: int = Query(100, description="Maximum number of results")
):
    db = SessionLocal()
    try:
        # Get both Coursera and Udemy courses
        coursera_courses = db.query(models.Course).all()
        udemy_courses = db.query(models.UdemyCourse).all()
        
        # Combine and normalize data
        results = []
        
        # Add Coursera courses
        for c in coursera_courses:
            results.append({
                "id": c.id,
                "title": c.title,
                "link": c.link,
                "provider": c.provider or "Coursera",
                "price": "Free",
                "scraped_at": c.scraped_at.isoformat() if c.scraped_at else None
            })
        
        # Add Udemy courses
        for c in udemy_courses:
            results.append({
                "id": c.id,
                "title": c.title,
                "link": c.link,
                "provider": c.provider or "Udemy",
                "price": c.price or "Free",
                "scraped_at": c.scraped_at.isoformat() if c.scraped_at else None
            })
        
        # Apply filters
        if provider and provider.lower() != "all":
            results = [r for r in results if r["provider"].lower() == provider.lower()]
        
        if search:
            search_lower = search.lower()
            results = [r for r in results if 
                      search_lower in r["title"].lower() or
                      search_lower in r["provider"].lower()]
        
        # Sort by title (A-Z)
        results.sort(key=lambda x: x["title"].lower())
        
        # Apply limit
        results = results[:limit]
        
        return results
        
    finally:
        db.close()