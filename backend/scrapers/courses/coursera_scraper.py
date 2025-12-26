import json
import sys
import os
import time

from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from webdriver_manager.chrome import ChromeDriverManager

# Add database folder to path
sys.path.append(os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))), 'database'))
from db import SessionLocal
from models import Course
from sqlalchemy.orm import Session

# -------- Selenium driver setup --------
def get_driver():
    options = Options()
    options.add_argument("--headless")  # comment if you want to see the browser
    options.add_argument("--no-sandbox")
    options.add_argument("--disable-dev-shm-usage")
    driver = webdriver.Chrome(service=Service(ChromeDriverManager().install()), options=options)
    return driver

# -------- Scraper --------
def scrape_coursera_selenium(query="free", max_courses=100):
    url = f"https://www.coursera.org/search?query={query}"
    driver = get_driver()
    driver.get(url)

    courses = []
    SCROLL_PAUSE_TIME = 3  # Slightly increased

    while len(courses) < max_courses:
        try:
            # FIXED: New selector from your HTML[file:1]
            WebDriverWait(driver, 10).until(
                EC.presence_of_all_elements_located((By.CSS_SELECTOR, "div[data-testid='product-card-cds']"))
            )
        except:
            break

        # FIXED: Updated selectors[file:1]
        course_cards = driver.find_elements(By.CSS_SELECTOR, "div[data-testid='product-card-cds']")
        for card in course_cards:
            try:
                # FIXED: Title in h3, not h2[file:1]
                title = card.find_element(By.CSS_SELECTOR, "h3.cds-CommonCard-title").text
                # FIXED: Link from a tag containing title[file:1]
                link_elem = card.find_element(By.CSS_SELECTOR, "h3.cds-CommonCard-title").find_element(By.XPATH, "./ancestor::a[1]")
                link = link_elem.get_attribute("href") or "https://www.coursera.org" + link_elem.get_attribute("to")
                # FIXED: Provider selector[file:1]
                provider_elem = card.find_elements(By.CSS_SELECTOR, ".cds-ProductCard-partnerNames")
                provider = provider_elem[0].text if provider_elem else "Coursera"
                
                course_data = {"title": title, "link": link, "provider": provider}
                if course_data not in courses:
                    courses.append(course_data)
            except:
                continue

        if len(courses) >= max_courses:
            break

        driver.execute_script("window.scrollTo(0, document.body.scrollHeight);")
        time.sleep(SCROLL_PAUSE_TIME)

    driver.quit()
    return courses[:max_courses]

# -------- Save to DB --------
def save_courses_to_db(courses):
    if not courses:
        print("No courses to save to DB.")
        return
    db: Session = SessionLocal()
    for c in courses:
        db.add(Course(title=c["title"], link=c["link"], provider=c["provider"]))
    db.commit()
    db.close()
    print(f"✅ Saved {len(courses)} courses to MySQL!")

# -------- Save to JSON --------
def save_courses_to_json(courses, filename="courses.json"):
    if not courses:
        print("No courses to save to JSON.")
        return
    with open(filename, "w", encoding="utf-8") as f:
        json.dump(courses, f, ensure_ascii=False, indent=4)
    print(f"✅ Saved {len(courses)} courses to {filename}!")

# -------- Main --------
if __name__ == "__main__":
    query = "free"  # search topic
    max_courses = 50  # total courses to scrape
    data = scrape_coursera_selenium(query=query, max_courses=max_courses)
    print(f"Total courses scraped: {len(data)}")
    save_courses_to_db(data)
    save_courses_to_json(data)
