from fastapi import APIRouter, Query
from typing import Optional
from sqlalchemy.orm import Session
from backend.database.connection import SessionLocal
from backend.database import models
import re

router = APIRouter()


def extract_min_salary(salary_string: str) -> float:
    """Extract minimum salary from salary string"""
    if not salary_string:
        return 0.0
    
    # Look for numbers with optional decimals
    match = re.search(r'\$?(\d+[,.]?\d*)', str(salary_string))
    if match:
        num_str = match.group(1).replace(',', '')
        try:
            return float(num_str)
        except ValueError:
            return 0.0
    return 0.0


@router.get("/internships")
def get_internships(
    job_type: Optional[str] = Query(None, description="Filter by job type"),
    location: Optional[str] = Query(None, description="Filter by location"),
    salary_range: Optional[str] = Query(None, description="Filter by salary: low, medium, high"),
    search: Optional[str] = Query(None, description="Search in position, company, or description"),
    sort_by: Optional[str] = Query("newest", description="Sort by: newest, salary, rating"),
    limit: int = Query(100, description="Maximum number of results")
):
    db = SessionLocal()
    try:
        # Get all internships from database
        internships = db.query(models.Internship).all()
        
        # Convert to dict format
        results = []
        for i in internships:
            results.append({
                "id": i.id,
                "positionName": i.position_name,
                "company": i.company,
                "location": i.location,
                "salary": i.salary,
                "jobType": i.job_type.split(',') if i.job_type else [],  # Convert to array
                "description": i.description,
                "rating": i.rating or 0,
                "reviewsCount": i.reviews_count or 0,
                "postedAt": i.posted_at,
                "postingDateParsed": i.posting_date_parsed.isoformat() if i.posting_date_parsed else None,
                "url": i.url,
                "externalApplyLink": i.external_apply_link,
                "searchInput": {"position": i.search_position} if i.search_position else None,
                "scraped_at": i.scraped_at.isoformat() if i.scraped_at else None,
                "minSalary": extract_min_salary(i.salary)  # Add for filtering/sorting
            })
        
        # Apply filters
        
        # Filter by job type
        if job_type and job_type.lower() != "all":
            results = [r for r in results if job_type in r["jobType"]]
        
        # Filter by location
        if location and location.lower() != "all":
            results = [r for r in results if 
                      location.lower() in r.get("location", "").lower()]
        
        # Filter by search query
        if search:
            search_lower = search.lower()
            results = [r for r in results if 
                      search_lower in r.get("positionName", "").lower() or
                      search_lower in r.get("company", "").lower() or
                      search_lower in r.get("description", "").lower()]
        
        # Filter by salary range
        if salary_range:
            if salary_range == "low":
                results = [r for r in results if r["minSalary"] < 15]
            elif salary_range == "medium":
                results = [r for r in results if 15 <= r["minSalary"] < 25]
            elif salary_range == "high":
                results = [r for r in results if r["minSalary"] >= 25]
        
        # Sort results
        if sort_by == "salary":
            results.sort(key=lambda x: x["minSalary"], reverse=True)
        elif sort_by == "rating":
            results.sort(key=lambda x: x["rating"], reverse=True)
        else:  # newest or default
            # Sort by posting date (most recent first)
            results.sort(
                key=lambda x: x["postingDateParsed"] if x["postingDateParsed"] else "", 
                reverse=True
            )
        
        # Apply limit
        results = results[:limit]
        
        return results
        
    finally:
        db.close()