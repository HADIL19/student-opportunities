from fastapi import APIRouter, Query
from typing import Optional
from sqlalchemy.orm import Session
from backend.database.connection import SessionLocal
from backend.database import models

router = APIRouter()


@router.get("/competitions")
def get_competitions(
    search: Optional[str] = Query(None, description="Search in title"),
    sort_by: Optional[str] = Query("newest", description="Sort by: newest (A-Z title)"),
    limit: int = Query(100, description="Maximum number of results")
):
    db = SessionLocal()
    try:
        # Get all competitions
        competitions = db.query(models.Competition).all()
        
        # Convert to dict format
        results = []
        for c in competitions:
            results.append({
                "id": c.id,
                "title": c.title,
                "link": c.link,
                "status": c.status,
                "location": c.location,
                "submission_period": c.submission_period,
                "prize_amount": c.prize_amount,
                "participants": c.participants or 0,
                "host": c.host or "Unknown",
                "themes": c.themes or "",
                "managed_by_devpost": c.managed_by_devpost,
                "days_left": c.days_left or "N/A",
                "scraped_at": c.scraped_at.isoformat() if c.scraped_at else None,
                "description": f"International competition - {c.title}"  # Add description
            })
        
        # Apply search filter
        if search:
            search_lower = search.lower()
            results = [r for r in results if 
                      search_lower in r["title"].lower()]
        
        # Sort by title (A-Z)
        results.sort(key=lambda x: x["title"].lower())
        
        # Apply limit
        results = results[:limit]
        
        return results
        
    finally:
        db.close()