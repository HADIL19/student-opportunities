from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.chrome.options import Options
from webdriver_manager.chrome import ChromeDriverManager
from bs4 import BeautifulSoup
import time
import json
from datetime import datetime

# ----------------------------
# Selenium setup
# ----------------------------
options = Options()
options.add_argument("--headless")
options.add_argument("--disable-gpu")
options.add_argument("--no-sandbox")
options.add_argument("start-maximized")
options.add_argument("user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0 Safari/537.36")

driver = webdriver.Chrome(service=Service(ChromeDriverManager().install()), options=options)

# ----------------------------
# Target URL
# ----------------------------
search_query = "python"  # change topic
base_url = f"https://www.udemy.com/courses/search/?q={search_query}&price=price-free-paid"
driver.get(base_url)
time.sleep(3)

# ----------------------------
# Scroll to load courses
# ----------------------------
SCROLL_PAUSE_TIME = 2
last_height = driver.execute_script("return document.body.scrollHeight")

for _ in range(20):  # scroll 20 times to load more courses
    driver.execute_script("window.scrollTo(0, document.body.scrollHeight);")
    time.sleep(SCROLL_PAUSE_TIME)
    new_height = driver.execute_script("return document.body.scrollHeight")
    if new_height == last_height:
        break
    last_height = new_height

# ----------------------------
# Parse page
# ----------------------------
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

# ----------------------------
# Save to JSON
# ----------------------------
with open(f"udemy_{search_query}_courses.json", "w", encoding="utf-8") as f:
    json.dump(courses, f, ensure_ascii=False, indent=4)

print(f"Scraped {len(courses)} courses. Saved to udemy_{search_query}_courses.json")
