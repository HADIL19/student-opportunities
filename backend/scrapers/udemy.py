import os
import json
import time
from datetime import datetime

from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from webdriver_manager.chrome import ChromeDriverManager

from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session
from backend.database.connection import SessionLocal, engine, Base
from backend.database.models import UdemyCourse

# Create tables
Base.metadata.create_all(bind=engine)


class UdemyScraper:
    def __init__(self):
        chrome_options = Options()
        chrome_options.add_argument("--headless=new")
        chrome_options.add_argument("--no-sandbox")
        chrome_options.add_argument("--disable-dev-shm-usage")
        chrome_options.add_argument("--window-size=1920,1080")
        chrome_options.add_argument(
            "user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64)"
        )
        service = Service(ChromeDriverManager().install())
        self.driver = webdriver.Chrome(service=service, options=chrome_options)
        self.wait = WebDriverWait(self.driver, 15)

    def scrape_courses(self, category="", max_pages=3, free_only=False):
        all_courses = []
        for page in range(1, max_pages + 1):
            if free_only:
                url = f"https://www.udemy.com/courses/{category}free/?p={page}"
            else:
                url = f"https://www.udemy.com/courses/{category}?p={page}"

            print(f"\nScraping page {page}: {url}")
            self.driver.get(url)

            try:
                self.wait.until(
                    EC.presence_of_all_elements_located(
                        (By.CSS_SELECTOR, "div.popper--popper--2r2To")
                    )
                )
            except:
                print(f"Warning: Courses did not load on page {page}")
                continue

            cards = self.driver.find_elements(
                By.CSS_SELECTOR,
                "div.popper--popper--2r2To a.udlite-custom-focus-visible.browse-course-card--link--3KIkQ"
            )
            print(f"Found {len(cards)} course cards on page {page}")

            for card in cards:
                course = self.extract_course_data(card)
                if course:
                    all_courses.append(course)

            time.sleep(2)

        return all_courses

    def extract_course_data(self, card):
        try:
            link = card.get_attribute("href")
            if not link:
                return None

            try:
                title = card.find_element(
                    By.CSS_SELECTOR, "div.udlite-focus-visible-target.udlite-heading-md"
                ).text.strip()
            except:
                title = "No title available"

            try:
                price = card.find_element(
                    By.CSS_SELECTOR, "div.price-text--price-part--Tu6MH span"
                ).text.strip()
            except:
                price = "Unknown"

            return {
                "title": title[:255],
                "link": link.split("?")[0],
                "price": price,
                "provider": "Udemy",
                "scraped_at": datetime.now().isoformat()
            }

        except Exception as e:
            print(f"Extraction error: {e}")
            return None

    def save_to_database(self, courses):
        db: Session = SessionLocal()
        try:
            for c in courses:
                if not c.get("link"):
                    continue
                existing = db.query(UdemyCourse).filter_by(link=c["link"]).first()
                if existing:
                    existing.title = c["title"]
                    existing.price = c["price"]
                else:
                    db.add(UdemyCourse(**c))
                db.commit()
            print(f"✅ Saved {len(courses)} courses to database")
        except IntegrityError:
            db.rollback()
        finally:
            db.close()

    def save_to_json(self, courses, filename="udemy_courses.json"):
        path = os.path.join(os.path.dirname(__file__), filename)
        with open(path, "w", encoding="utf-8") as f:
            json.dump(courses, f, indent=2, ensure_ascii=False)
        print(f"💾 Saved {len(courses)} courses to {filename}")

    def close(self):
        self.driver.quit()


# ----------- Wrapper functions for scheduler imports -----------
def scrape_udemy():
    scraper = UdemyScraper()
    try:
        return scraper.scrape_courses(max_pages=3, free_only=False)
    finally:
        scraper.close()


def save_courses_to_db(courses):
    scraper = UdemyScraper()
    try:
        scraper.save_to_database(courses)
    finally:
        scraper.close()


# ----------- Main for standalone testing -----------
def main():
    scraper = UdemyScraper()
    try:
        courses = scraper.scrape_courses(max_pages=3, free_only=False)
        if courses:
            scraper.save_to_json(courses, "udemy_courses.json")
            scraper.save_to_database(courses)
            print(f"\nSUCCESS: Scraped {len(courses)} courses")
        else:
            print("No courses found")
    finally:
        scraper.close()


if __name__ == "__main__":
    main()
