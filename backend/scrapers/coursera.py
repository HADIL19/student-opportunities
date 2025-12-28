import json
import time
from pathlib import Path

from selenium.webdriver.common.by import By

from backend.scrapers.base import get_driver
from backend.database.connection import SessionLocal, engine
from backend.database.models import Course

def scrape_coursera_selenium(query="free", max_courses=50):
    print(f"🚀 Starting scrape for '{query}' (max {max_courses})")
    url = f"https://www.coursera.org/search?query={query}"
    driver = get_driver()
    driver.get(url)
    
    print("⏳ Waiting for page to load...")
    time.sleep(3)
    
    courses = []
    SCROLL_PAUSE_TIME = 2
    scroll_count = 0
    max_scrolls = 15

    while len(courses) < max_courses and scroll_count < max_scrolls:
        print(f"\n📜 Scroll #{scroll_count + 1} - Found {len(courses)} courses so far")
        
        # Multiple selectors for robustness
        selectors = [
            "div[data-testid='product-card-cds']",
            "[data-testid*='product-card']",
            "li[class*='cds-ProductCard']",
            ".cds-ProductCard-base",
            "[data-e2e='CourseCard']"
        ]
        
        course_cards = []
        for selector in selectors:
            course_cards = driver.find_elements(By.CSS_SELECTOR, selector)
            if course_cards:
                print(f"✅ Found {len(course_cards)} cards with selector: {selector}")
                break
        
        new_courses_this_scroll = 0
        for card in course_cards:
            try:
                # Title
                title_selectors = ["h3.cds-CommonCard-title", "h2.cds-CommonCard-title", ".cds-CommonCard-title"]
                title = None
                for ts in title_selectors:
                    try:
                        title = card.find_element(By.CSS_SELECTOR, ts).text.strip()
                        if title:
                            break
                    except:
                        continue
                
                if not title:
                    continue
                
                # Link
                link_elem = card.find_element(By.XPATH, ".//a[contains(@href,'/learn') or contains(@to,'/learn')] | .//h3//ancestor::a[1]")
                link_attr = link_elem.get_attribute("href") or link_elem.get_attribute("to")
                link = link_attr if link_attr and link_attr.startswith("http") else f"https://www.coursera.org{link_attr}"
                
                # Provider
                provider_selectors = [".cds-ProductCard-partnerNames", ".partner-name", "[class*='partner'] p"]
                provider = "Coursera"
                for ps in provider_selectors:
                    provider_elems = card.find_elements(By.CSS_SELECTOR, ps)
                    if provider_elems:
                        provider = provider_elems[0].text.strip()
                        break
                
                course_data = {"title": title[:250], "link": link, "provider": provider[:100]}
                
                if course_data not in courses:
                    courses.append(course_data)
                    new_courses_this_scroll += 1
                    print(f"   ➕ {title[:60]}... ({provider})")
                    
            except Exception as e:
                continue
        
        print(f"   📈 New courses this scroll: {new_courses_this_scroll}")
        
        if new_courses_this_scroll == 0 or len(courses) >= max_courses:
            print("🏁 No new courses, stopping")
            break
            
        # Scroll
        driver.execute_script("window.scrollTo(0, document.body.scrollHeight);")
        time.sleep(SCROLL_PAUSE_TIME)
        scroll_count += 1
    
    driver.quit()
    print(f"\n🎉 Scraping complete! Total courses: {len(courses)}")
    return courses[:max_courses]

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

def save_courses_to_json(courses, filename="coursera_courses.json"):
    if not courses:
        print("No courses to save to JSON.")
        return
    with open(filename, "w", encoding="utf-8") as f:
        json.dump(courses, f, ensure_ascii=False, indent=2)
    print(f"💾 Saved {len(courses)} courses to {filename}!")

if __name__ == "__main__":
    query = "free"
    max_courses = 50
    data = scrape_coursera_selenium(query=query, max_courses=max_courses)
    print(f"\n📊 Total courses scraped: {len(data)}")
    save_courses_to_db(data)
    save_courses_to_json(data)
    print("\n✨ Done!")
