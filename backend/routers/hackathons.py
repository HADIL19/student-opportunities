from fastapi import APIRouter, Query
from typing import Optional
from sqlalchemy.orm import Session
from backend.database.connection import SessionLocal
from backend.database import models
import re

router = APIRouter()


def extract_prize_amount(prize_string: str) -> float:
    """Extract numeric value from prize string"""
    if not prize_string:
        return 0.0
    
    # Look for numbers with optional decimals
    match = re.search(r'(\d+[,.]?\d*)', str(prize_string))
    if match:
        num_str = match.group(1).replace(',', '')
        try:
            return float(num_str)
        except ValueError:
            return 0.0
    return 0.0


@router.get("/hackathons")
def get_hackathons(
    source: Optional[str] = Query(None, description="Filter by source: devpost or lablab"),
    status: Optional[str] = Query(None, description="Filter by status"),
    search: Optional[str] = Query(None, description="Search in title, themes, or host"),
    prize_range: Optional[str] = Query(None, description="Filter by prize: small, medium, large"),
    sort_by: Optional[str] = Query("newest", description="Sort by: newest, prize, participants"),
    limit: int = Query(100, description="Maximum number of results")
):
    db = SessionLocal()
    try:
        # Get both types of hackathons
        devpost_hackathons = db.query(models.Hackathon).all()
        lablab_hackathons = db.query(models.LablabHackathon).all()
        
        # Combine and normalize data
        results = []
        
        # Add Devpost hackathons
        for h in devpost_hackathons:
            results.append({
                "id": h.id,
                "title": h.title,
                "link": h.link,
                "source": "devpost",
                "status": h.status or "open",
                "location": h.location,
                "submission_period": h.submission_period,
                "prize_amount": h.prize_amount,
                "participants": h.participants or 0,
                "host": h.host or "Unknown",
                "themes": h.themes or "",
                "managed_by_devpost": h.managed_by_devpost,
                "days_left": h.days_left or "N/A",
                "scraped_at": h.scraped_at.isoformat() if h.scraped_at else None,
                "prizeAmount": extract_prize_amount(h.prize_amount)
            })
        
        # Add LabLab hackathons
        for h in lablab_hackathons:
            results.append({
                "id": h.id,
                "title": h.title,
                "link": h.link,
                "source": "lablab",
                "status": h.status or "open",
                "location": h.location or "Online",
                "submission_period": h.submission_period,
                "prize_amount": h.prize_amount,
                "participants": h.participants or 0,
                "host": "LabLab.ai",
                "themes": h.themes or "",
                "days_left": h.days_left or "N/A",
                "start_date": h.start_date.isoformat() if h.start_date else None,
                "end_date": h.end_date.isoformat() if h.end_date else None,
                "image_url": h.image_url,
                "scraped_at": h.scraped_at.isoformat() if h.scraped_at else None,
                "prizeAmount": extract_prize_amount(h.prize_amount)
            })
        
        # Apply filters
        if source:
            results = [r for r in results if r["source"] == source.lower()]
        
        if status:
            results = [r for r in results if r["status"] == status.lower()]
        
        if search:
            search_lower = search.lower()
            results = [r for r in results if 
                      search_lower in r["title"].lower() or
                      search_lower in r.get("themes", "").lower() or
                      search_lower in r.get("host", "").lower()]
        
        if prize_range:
            if prize_range == "small":
                results = [r for r in results if r["prizeAmount"] < 10000]
            elif prize_range == "medium":
                results = [r for r in results if 10000 <= r["prizeAmount"] < 50000]
            elif prize_range == "large":
                results = [r for r in results if r["prizeAmount"] >= 50000]
        
        # Sort results
        if sort_by == "prize":
            results.sort(key=lambda x: x["prizeAmount"], reverse=True)
        elif sort_by == "participants":
            results.sort(key=lambda x: x["participants"], reverse=True)
        else:  # newest or default
            results.sort(key=lambda x: x["title"])
        
        # Apply limit
        results = results[:limit]
        
        return results
        
    finally:
        db.close()