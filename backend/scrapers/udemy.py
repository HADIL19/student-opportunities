from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.chrome.options import Options
from webdriver_manager.chrome import ChromeDriverManager
from bs4 import BeautifulSoup
import time
import json
from datetime import datetime

from backend.scrapers.base import get_driver
from backend.database.connection import SessionLocal
from backend.database.models import Course

def scrape_udemy(search_query="python"):
    print(f"🚀 Starting Udemy scrape for '{search_query}'")
    driver = get_driver()
    base_url = f"https://www.udemy.com/courses/search/?q={search_query}&price=price-free-paid"
    driver.get(base_url)
    time.sleep(3)

    # Scroll to load courses
    SCROLL_PAUSE_TIME = 2
    last_height = driver.execute_script("return document.body.scrollHeight")

    for _ in range(20):  # scroll 20 times to load more courses
        driver.execute_script("window.scrollTo(0, document.body.scrollHeight);")
        time.sleep(SCROLL_PAUSE_TIME)
        new_height = driver.execute_script("return document.body.scrollHeight")
        if new_height == last_height:
            break
        last_height = new_height

    # Parse page
    soup = BeautifulSoup(driver.page_source, "lxml")
    course_links = soup.find_all("a", href=True)
    courses = []
    added_links = set()

    for a in course_links:
        href = a['href']
        if href.startswith("/course/") and href not in added_links:
            added_links.add(href)
            # title
            title_tag = a.find("div")
            title = title_tag.text.strip() if title_tag else "N/A"
            link = "https://www.udemy.com" + href

            # price & provider
            parent = a.parent
            price_tag = parent.find("div", string=lambda s: s and ("$" in s or "Free" in s))
            price = price_tag.text.strip() if price_tag else "N/A"

            provider_tag = parent.find("div", class_=lambda x: x and "instructor" in x.lower())
            provider = provider_tag.text.strip() if provider_tag else "N/A"

            courses.append({
                "id": len(courses)+1,
                "title": title,
                "link": link,
                "provider": provider,
                "price": price,
                "scraped_at": datetime.now().strftime("%Y-%m-%d %H:%M:%S")
            })

    driver.quit()
    print(f"🎉 Scraped {len(courses)} Udemy courses for '{search_query}'")
    return courses

def save_courses_to_json(courses, filename=None):
    if not courses:
        print("No courses to save to JSON.")
        return
    if filename is None:
        search_query = "python"  # default
        filename = f"udemy_{search_query}_courses.json"
    with open(filename, "w", encoding="utf-8") as f:
        json.dump(courses, f, ensure_ascii=False, indent=4)
    print(f"💾 Saved {len(courses)} courses to {filename}!")

def save_courses_to_db(courses):
    if not courses:
        print("No courses to save to DB.")
        return
    db = SessionLocal()
    saved = 0
    for c in courses:
        # Skip duplicates
        if not db.query(Course).filter(Course.link == c["link"]).first():
            db.add(Course(title=c["title"], link=c["link"], provider=c["provider"]))
            saved += 1
    db.commit()
    db.close()
    print(f"✅ Saved {saved} NEW courses to MySQL!")

if __name__ == "__main__":
    search_query = "python"
    data = scrape_udemy(search_query=search_query)
    print(f"\n📊 Total courses scraped: {len(data)}")
    save_courses_to_json(data, f"udemy_{search_query}_courses.json")
    save_courses_to_db(data)
    print("\n✨ Done!")
