from fastapi import FastAPI, Depends
from sqlalchemy.orm import Session
from database import get_db
from models import Course
from scrapers.courses.coursera_scraper import scrape_coursera, save_courses_to_db

app = FastAPI()

@app.get("/courses")
def get_courses(db: Session = Depends(get_db)):
    return db.query(Course).all()

@app.post("/scrape/coursera")
def scrape_and_save_courses():
    data = scrape_coursera()
    save_courses_to_db(data)
    return {"message": f"Scraped and saved {len(data)} courses!"}
