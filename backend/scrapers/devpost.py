import sys
import os

# Add the backend directory to Python path
backend_path = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
sys.path.insert(0, backend_path)

from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.chrome.options import Options
from webdriver_manager.chrome import ChromeDriverManager
import time
import json
from datetime import datetime
from sqlalchemy.exc import IntegrityError

# Import from database folder
from database.connection import SessionLocal
from database.models import Hackathon, Competition
from scrapers.classifier import classify_event

class DevpostScraper:
    def __init__(self, headless=True):
        """Initialize the Selenium WebDriver"""
        chrome_options = Options()
        if headless:
            chrome_options.add_argument("--headless")
        chrome_options.add_argument("--no-sandbox")
        chrome_options.add_argument("--disable-dev-shm-usage")
        chrome_options.add_argument("--disable-gpu")
        chrome_options.add_argument("--window-size=1920,1080")
        chrome_options.add_argument("user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36")
        
        self.driver = webdriver.Chrome(
            service=Service(ChromeDriverManager().install()),
            options=chrome_options
        )
        self.wait = WebDriverWait(self.driver, 10)
        self.hackathons = []
        self.competitions = []
    
    def scrape_hackathons(self, url="https://devpost.com/hackathons", max_pages=1):
        """Scrape hackathons from Devpost"""
        try:
            print(f"🚀 Navigating to {url}...")
            self.driver.get(url)
            
            # Wait for hackathons to load
            time.sleep(5)
            
            for page in range(max_pages):
                print(f"\n📄 Scraping page {page + 1}...")
                
                # Scroll to load all content
                self.driver.execute_script("window.scrollTo(0, document.body.scrollHeight);")
                time.sleep(2)
                
                # Find all hackathon tiles
                hackathon_tiles = self.driver.find_elements(
                    By.CSS_SELECTOR, 
                    ".hackathon-tile"
                )
                
                print(f"Found {len(hackathon_tiles)} hackathons on this page")
                
                for tile in hackathon_tiles:
                    try:
                        hackathon_data = self.extract_hackathon_data(tile)
                        if hackathon_data:
                            event_type = classify_event(hackathon_data)
                            if event_type == "hackathon":
                                self.hackathons.append(hackathon_data)
                            elif event_type == "competition":
                                self.competitions.append(hackathon_data)
                            print(f"✅ Scraped ({event_type}): {hackathon_data['title'][:50]}...")
                    except Exception as e:
                        print(f"❌ Error scraping tile: {e}")
                        continue
                
                # Try to go to next page
                if page < max_pages - 1:
                    try:
                        next_button = self.driver.find_element(By.CSS_SELECTOR, "a.next_page")
                        if "disabled" not in next_button.get_attribute("class"):
                            next_button.click()
                            time.sleep(3)
                        else:
                            print("No more pages available")
                            break
                    except:
                        print("No next page button found")
                        break
            
            print(f"\n🎉 Total hackathons scraped: {len(self.hackathons)}")
            print(f"🎉 Total competitions scraped: {len(self.competitions)}")
            return self.hackathons + self.competitions
            
        except Exception as e:
            print(f"❌ Error during scraping: {e}")
            return []
        
    def extract_hackathon_data(self, tile):
        """Extract data from a single hackathon tile"""
        try:
            # Title
            title_elem = tile.find_element(By.CSS_SELECTOR, "h3")
            title = title_elem.text.strip()
            
            # Link
            link_elem = tile.find_element(By.CSS_SELECTOR, "a.tile-anchor")
            link = link_elem.get_attribute("href")
            
            # Status and days left
            try:
                status_elem = tile.find_element(By.CSS_SELECTOR, ".status-label")
                days_left = status_elem.text.strip()
                
                if "left" in days_left.lower():
                    status = "open"
                elif "upcoming" in days_left.lower():
                    status = "upcoming"
                else:
                    status = "ended"
            except:
                status = "unknown"
                days_left = "N/A"
            
            # Location
            try:
                location_elem = tile.find_element(By.CSS_SELECTOR, ".info-with-icon span")
                location = location_elem.text.strip()
            except:
                location = "N/A"
            
            # Submission period
            try:
                period_elem = tile.find_element(By.CSS_SELECTOR, ".submission-period")
                submission_period = period_elem.text.strip()
            except:
                submission_period = "N/A"
            
            # Prize amount
            try:
                prize_elem = tile.find_element(By.CSS_SELECTOR, ".prize-amount")
                prize_amount = prize_elem.text.strip()
            except:
                prize_amount = "N/A"
            
            # Participants
            try:
                participants_elem = tile.find_element(By.CSS_SELECTOR, ".participants strong")
                participants = int(participants_elem.text.strip().replace(",", ""))
            except:
                participants = 0
            
            # Host
            try:
                host_elem = tile.find_element(By.CSS_SELECTOR, ".host-label")
                host = host_elem.get_attribute("title")
            except:
                host = "N/A"
            
            # Themes
            try:
                theme_elems = tile.find_elements(By.CSS_SELECTOR, ".theme-label")
                themes = ", ".join([theme.get_attribute("title") for theme in theme_elems])
            except:
                themes = "N/A"
            
            # Managed by Devpost
            try:
                managed_elem = tile.find_element(By.CSS_SELECTOR, ".managed-by-devpost")
                managed_by_devpost = "Yes"
            except:
                managed_by_devpost = "No"
            
            return {
                "title": title,
                "link": link,
                "status": status,
                "location": location,
                "submission_period": submission_period,
                "prize_amount": prize_amount,
                "participants": participants,
                "host": host,
                "themes": themes,
                "managed_by_devpost": managed_by_devpost,
                "days_left": days_left,
                "scraped_at": datetime.now().isoformat()
            }
            
        except Exception as e:
            print(f"Error extracting hackathon data: {e}")
            return None
    
    def save_to_json(self, filename="devpost_events.json"):
        """Save scraped data to JSON file"""
        try:
            all_events = {"hackathons": self.hackathons, "competitions": self.competitions}
            with open(filename, 'w', encoding='utf-8') as f:
                json.dump(all_events, f, indent=2, ensure_ascii=False)
            print(f"\n💾 Data saved to {filename}")
            return True
        except Exception as e:
            print(f"❌ Error saving to JSON: {e}")
            return False
    
    def save_to_database(self):
        """Save scraped data to MySQL database"""
        db = SessionLocal()
        saved_hack = 0
        saved_comp = 0
        skipped_count = 0
        
        try:
            # Save hackathons
            for hackathon_data in self.hackathons:
                try:
                    hackathon = Hackathon(
                        title=hackathon_data["title"],
                        link=hackathon_data["link"],
                        status=hackathon_data["status"],
                        location=hackathon_data["location"],
                        submission_period=hackathon_data["submission_period"],
                        prize_amount=hackathon_data["prize_amount"],
                        participants=hackathon_data["participants"],
                        host=hackathon_data["host"],
                        themes=hackathon_data["themes"],
                        managed_by_devpost=hackathon_data["managed_by_devpost"],
                        days_left=hackathon_data["days_left"]
                    )
                    
                    db.add(hackathon)
                    db.commit()
                    saved_hack += 1
                    
                except IntegrityError:
                    db.rollback()
                    skipped_count += 1
                except Exception as e:
                    db.rollback()
                    print(f"❌ Error saving hackathon {hackathon_data['title'][:50]}: {e}")
            
            # Save competitions
            for comp_data in self.competitions:
                try:
                    competition = Competition(
                        title=comp_data["title"],
                        link=comp_data["link"],
                        status=comp_data["status"],
                        location=comp_data["location"],
                        submission_period=comp_data["submission_period"],
                        prize_amount=comp_data["prize_amount"],
                        participants=comp_data["participants"],
                        host=comp_data["host"],
                        themes=comp_data["themes"],
                        managed_by_devpost=comp_data["managed_by_devpost"],
                        days_left=comp_data["days_left"]
                    )
                    
                    db.add(competition)
                    db.commit()
                    saved_comp += 1
                    
                except IntegrityError:
                    db.rollback()
                    skipped_count += 1
                except Exception as e:
                    db.rollback()
                    print(f"❌ Error saving competition {comp_data['title'][:50]}: {e}")
            
            print(f"\n✅ Database saved: {saved_hack} new hackathons, {saved_comp} new competitions")
            print(f"⚠️  Skipped: {skipped_count} duplicates")
            
        finally:
            db.close()
    
    def close(self):
        """Close the browser"""
        self.driver.quit()
        print("\n🔒 Browser closed")


def main():
    """Main execution function"""
    print("=" * 60)
    print("🎯 DEVPOST HACKATHON SCRAPER")
    print("=" * 60)
    
    scraper = DevpostScraper(headless=False)  # Set to True for headless mode
    
    try:
        # Scrape hackathons (adjust max_pages as needed)
        scraper.scrape_hackathons(max_pages=2)
        
        # Save to JSON
        scraper.save_to_json("devpost_hackathons.json")
        
        # Save to database
        scraper.save_to_database()
        
    finally:
        scraper.close()
    
    print("\n" + "=" * 60)
    print("✨ SCRAPING COMPLETE!")
    print("=" * 60)


if __name__ == "__main__":
    main()
