import sys
import os
import json
import time
import re
from datetime import datetime

from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.chrome.options import Options
from webdriver_manager.chrome import ChromeDriverManager
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session
from backend.scrapers.classifier import classify_event
# Import from database folder
from backend.database.connection import SessionLocal, engine, Base
from backend.database.models import LablabHackathon, Competition
# Create tables if they don't exist
Base.metadata.create_all(bind=engine)


class LablabScraper:
    def __init__(self):
        """Initialize the scraper with Chrome options"""
        chrome_options = Options()
        chrome_options.add_argument('--headless')
        chrome_options.add_argument('--no-sandbox')
        chrome_options.add_argument('--disable-dev-shm-usage')
        chrome_options.add_argument('--disable-blink-features=AutomationControlled')
        chrome_options.add_argument('user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36')
        
        # Use webdriver_manager to handle ChromeDriver automatically
        service = Service(ChromeDriverManager().install())
        self.driver = webdriver.Chrome(service=service, options=chrome_options)
        self.wait = WebDriverWait(self.driver, 10)
        self.hackathons = []
        self.competitions = []
        
    def scrape_hackathons(self):
        """Scrape hackathon data from lablab.ai"""
        url = "https://lablab.ai/event"
        print(f"Accessing {url}...")
        
        self.driver.get(url)
        time.sleep(3)
        
        try:
            self.wait.until(EC.presence_of_element_located((By.CLASS_NAME, "card-animation")))
            cards = self.driver.find_elements(By.CSS_SELECTOR, ".card-animation.card-border")
            
            print(f"Found {len(cards)} hackathons")
            
            for index, card in enumerate(cards, 1):
                try:
                    hackathon_data = self.extract_hackathon_data(card)
                    if hackathon_data:
                        # Classify the event
                        event_type = classify_event(hackathon_data)
                        
                        # Add to appropriate list
                        if event_type == "hackathon":
                            self.hackathons.append(hackathon_data)
                        elif event_type == "competition":
                            self.competitions.append(hackathon_data)
                        
                        print(f"✓ Scraped ({event_type}): {hackathon_data['title']}")
                
                except Exception as e:
                    print(f"✗ Error scraping card {index}: {str(e)}")
                    continue
                    
        except Exception as e:
            print(f"Error loading page: {str(e)}")
        
        print(f"\n🎉 Total hackathons scraped: {len(self.hackathons)}")
        print(f"🎉 Total competitions scraped: {len(self.competitions)}")
        
        return self.hackathons, self.competitions
    
    def extract_hackathon_data(self, card):
        """Extract data from a single hackathon card"""
        data = {}
        
        try:
            # Title
            title_elem = card.find_element(By.CSS_SELECTOR, "h2.line-clamp-1")
            data['title'] = title_elem.text.strip()
            
            # Link
            link_elem = card.find_element(By.CSS_SELECTOR, "a")
            data['link'] = link_elem.get_attribute('href')
            
            # Status (Register/Finished)
            try:
                status_elem = card.find_element(By.CSS_SELECTOR, ".absolute.top-4.-left-8")
                data['status'] = status_elem.text.strip()
            except:
                data['status'] = "Unknown"
            
            # Location (HACKATHON type badge)
            try:
                location_elem = card.find_element(By.CSS_SELECTOR, "span[title]")
                data['location'] = location_elem.get_attribute('title')
            except:
                data['location'] = "Online"
            
            # Dates
            try:
                date_elem = card.find_element(By.CSS_SELECTOR, "time")
                date_text = date_elem.text.strip()
                data['submission_period'] = date_text
                
                # Parse dates
                parsed_dates = self.parse_dates(date_text)
                data['start_date'] = parsed_dates['start']
                data['end_date'] = parsed_dates['end']
            except:
                data['submission_period'] = "TBA"
                data['start_date'] = None
                data['end_date'] = None
            
            # Participants count
            try:
                participants_elem = card.find_element(By.CSS_SELECTOR, "p.text-xs.font-semibold")
                data['participants'] = int(participants_elem.text.strip())
            except:
                data['participants'] = 0
            
            # Description (includes prize info)
            try:
                desc_elem = card.find_element(By.CSS_SELECTOR, "p.line-clamp-2")
                data['description'] = desc_elem.text.strip()
            except:
                data['description'] = ""
            
            # Image URL
            try:
                img_elem = card.find_element(By.CSS_SELECTOR, "img")
                data['image_url'] = img_elem.get_attribute('src')
            except:
                data['image_url'] = None
            
            # Extract prize amount from description
            data['prize_amount'] = self.extract_prize(data.get('description', ''))
            
            # Extract themes from description
            data['themes'] = self.extract_themes(data.get('description', ''))
            
            # Calculate days left
            data['days_left'] = self.calculate_days_left(data['status'], data['end_date'])
            
            return data
            
        except Exception as e:
            print(f"Error extracting data: {str(e)}")
            return None
    
    def parse_dates(self, date_string):
        """Parse date string like 'NOV 14 - 19' to datetime objects"""
        result = {'start': None, 'end': None}
        
        try:
            # Pattern: "NOV 14 - 19" or "DEC 5 - 7"
            pattern = r'([A-Z]{3})\s+(\d{1,2})\s*-\s*(\d{1,2})'
            match = re.search(pattern, date_string.upper())
            
            if match:
                month_str = match.group(1)
                start_day = int(match.group(2))
                end_day = int(match.group(3))
                
                # Convert month abbreviation to number
                months = {
                    'JAN': 1, 'FEB': 2, 'MAR': 3, 'APR': 4, 'MAY': 5, 'JUN': 6,
                    'JUL': 7, 'AUG': 8, 'SEP': 9, 'OCT': 10, 'NOV': 11, 'DEC': 12
                }
                month = months.get(month_str)
                
                if month:
                    current_year = datetime.now().year
                    # If month has passed, assume next year
                    if month < datetime.now().month:
                        current_year += 1
                    
                    result['start'] = datetime(current_year, month, start_day)
                    result['end'] = datetime(current_year, month, end_day)
        except Exception as e:
            print(f"Date parsing error: {str(e)}")
        
        return result
    
    def extract_prize(self, description):
        """Extract prize amount from description"""
        patterns = [
            r'\$[\d,]+(?:\s*(?:in|of|total))?\s*(?:prizes?|rewards?)?',
            r'[\d,]+\s*USD',
            r'[\d,]+\s*dollars?'
        ]
        
        for pattern in patterns:
            match = re.search(pattern, description, re.IGNORECASE)
            if match:
                return match.group(0)
        return None
    
    def extract_themes(self, description):
        """Extract themes/keywords from description"""
        themes_keywords = [
            'AI', 'Machine Learning', 'Deep Learning', 'NLP', 'Computer Vision',
            'Blockchain', 'Web3', 'Healthcare', 'Education', 'Finance', 
            'Gaming', 'Robotics', 'IoT', 'Cloud', 'DevOps', 'Quantum',
            'Cybersecurity', 'Data Science', 'Analytics'
        ]
        
        found_themes = []
        desc_upper = description.upper()
        
        for theme in themes_keywords:
            if theme.upper() in desc_upper:
                found_themes.append(theme)
        
        return ', '.join(found_themes) if found_themes else None
    
    def calculate_days_left(self, status, end_date):
        """Calculate days left until deadline"""
        if status == "Finished":
            return "Ended"
        
        if not end_date:
            return "TBA"
        
        try:
            today = datetime.now()
            delta = end_date - today
            
            if delta.days < 0:
                return "Ended"
            elif delta.days == 0:
                return "Today"
            elif delta.days == 1:
                return "1 day"
            else:
                return f"{delta.days} days"
        except:
            return "Unknown"
    
    def save_to_json(self, filename='lablab_hackathons.json'):
        """Save scraped data to JSON file"""
        # Convert datetime objects to strings for JSON serialization
        all_data = {
            "hackathons": [],
            "competitions": []
        }
        
        # Process hackathons
        for hack in self.hackathons:
            hack_copy = hack.copy()
            if hack_copy.get('start_date'):
                hack_copy['start_date'] = hack_copy['start_date'].isoformat()
            if hack_copy.get('end_date'):
                hack_copy['end_date'] = hack_copy['end_date'].isoformat()
            all_data["hackathons"].append(hack_copy)
        
        # Process competitions
        for comp in self.competitions:
            comp_copy = comp.copy()
            if comp_copy.get('start_date'):
                comp_copy['start_date'] = comp_copy['start_date'].isoformat()
            if comp_copy.get('end_date'):
                comp_copy['end_date'] = comp_copy['end_date'].isoformat()
            all_data["competitions"].append(comp_copy)
        
        # Save to file
        filepath = os.path.join(os.path.dirname(__file__), filename)
        with open(filepath, 'w', encoding='utf-8') as f:
            json.dump(all_data, f, indent=2, ensure_ascii=False)
        
        print(f"\n💾 Saved {len(self.hackathons)} hackathons and {len(self.competitions)} competitions to {filename}")
    
    def save_to_database(self):
        """Save hackathons and competitions to MySQL database"""
        db: Session = SessionLocal()
        saved_hack = 0
        saved_comp = 0
        updated_hack = 0
        updated_comp = 0
        skipped_count = 0
        
        try:
            # Save hackathons to LablabHackathon table
            for hack_data in self.hackathons:
                try:
                    # Check if hackathon already exists
                    existing = db.query(LablabHackathon).filter(
                        LablabHackathon.link == hack_data['link']
                    ).first()
                    
                    if existing:
                        # Update existing record
                        existing.title = hack_data.get('title', '')[:500]
                        existing.status = hack_data.get('status', '')[:50]
                        existing.location = hack_data.get('location', '')[:200]
                        existing.submission_period = hack_data.get('submission_period', '')[:200]
                        existing.prize_amount = hack_data.get('prize_amount', '')[:100] if hack_data.get('prize_amount') else None
                        existing.participants = hack_data.get('participants', 0)
                        existing.themes = hack_data.get('themes', '')
                        existing.days_left = hack_data.get('days_left', '')[:50]
                        existing.start_date = hack_data.get('start_date')
                        existing.end_date = hack_data.get('end_date')
                        existing.image_url = hack_data.get('image_url', '')[:500] if hack_data.get('image_url') else None
                        
                        db.commit()
                        updated_hack += 1
                        print(f"↻ Updated hackathon: {hack_data['title']}")
                    else:
                        # Create new hackathon entry
                        hackathon = LablabHackathon(
                            title=hack_data.get('title', '')[:500],
                            link=hack_data.get('link', '')[:500],
                            status=hack_data.get('status', '')[:50],
                            location=hack_data.get('location', '')[:200],
                            submission_period=hack_data.get('submission_period', '')[:200],
                            prize_amount=hack_data.get('prize_amount', '')[:100] if hack_data.get('prize_amount') else None,
                            participants=hack_data.get('participants', 0),
                            themes=hack_data.get('themes', ''),
                            days_left=hack_data.get('days_left', '')[:50],
                            start_date=hack_data.get('start_date'),
                            end_date=hack_data.get('end_date'),
                            image_url=hack_data.get('image_url', '')[:500] if hack_data.get('image_url') else None
                        )
                        
                        db.add(hackathon)
                        db.commit()
                        saved_hack += 1
                        print(f"✓ Saved hackathon: {hack_data['title']}")
                    
                except IntegrityError:
                    db.rollback()
                    skipped_count += 1
                    print(f"⚠ Duplicate hackathon skipped: {hack_data['title']}")
                except Exception as e:
                    db.rollback()
                    print(f"✗ Error saving hackathon: {str(e)}")
                    continue
            
            # Save competitions to Competition table
            for comp_data in self.competitions:
                try:
                    # Check if competition already exists
                    existing = db.query(Competition).filter(
                        Competition.link == comp_data['link']
                    ).first()
                    
                    if existing:
                        # Update existing record
                        existing.title = comp_data.get('title', '')[:500]
                        existing.status = comp_data.get('status', '')[:50]
                        existing.location = comp_data.get('location', '')[:200]
                        existing.submission_period = comp_data.get('submission_period', '')[:200]
                        existing.prize_amount = comp_data.get('prize_amount', '')[:100] if comp_data.get('prize_amount') else None
                        existing.participants = comp_data.get('participants', 0)
                        existing.themes = comp_data.get('themes', '')
                        existing.days_left = comp_data.get('days_left', '')[:50]
                        existing.managed_by_devpost = "No"
                        
                        db.commit()
                        updated_comp += 1
                        print(f"↻ Updated competition: {comp_data['title']}")
                    else:
                        # Create new competition entry
                        competition = Competition(
                            title=comp_data.get('title', '')[:500],
                            link=comp_data.get('link', '')[:500],
                            status=comp_data.get('status', '')[:50],
                            location=comp_data.get('location', '')[:200],
                            submission_period=comp_data.get('submission_period', '')[:200],
                            prize_amount=comp_data.get('prize_amount', '')[:100] if comp_data.get('prize_amount') else None,
                            participants=comp_data.get('participants', 0),
                            themes=comp_data.get('themes', ''),
                            days_left=comp_data.get('days_left', '')[:50],
                            managed_by_devpost="No",
                            host=comp_data.get('location', 'LabLab')  # Use location as host fallback
                        )
                        
                        db.add(competition)
                        db.commit()
                        saved_comp += 1
                        print(f"✓ Saved competition: {comp_data['title']}")
                    
                except IntegrityError:
                    db.rollback()
                    skipped_count += 1
                    print(f"⚠ Duplicate competition skipped: {comp_data['title']}")
                except Exception as e:
                    db.rollback()
                    print(f"✗ Error saving competition: {str(e)}")
                    continue
            
            print(f"\n✅ Database saved: {saved_hack} new hackathons, {saved_comp} new competitions")
            print(f"↻ Updated: {updated_hack} hackathons, {updated_comp} competitions")
            print(f"⚠️  Skipped: {skipped_count} duplicates")
            
        finally:
            db.close()
    
    def close(self):
        """Close the browser"""
        self.driver.quit()


def main():
    """Main execution function"""
    print("=" * 60)
    print("🎯 LABLAB HACKATHON SCRAPER")
    print("=" * 60)
    
    scraper = LablabScraper()
    
    try:
        # Scrape hackathons
        scraper.scrape_hackathons()
        
        if scraper.hackathons or scraper.competitions:
            # Save to JSON
            scraper.save_to_json()
            
            # Save to database
            scraper.save_to_database()
            
            print("\n" + "=" * 60)
            print(f"✅ Scraping completed successfully!")
            print(f"📊 Total hackathons: {len(scraper.hackathons)}")
            print(f"📊 Total competitions: {len(scraper.competitions)}")
            print("=" * 60)
        else:
            print("\n⚠ No events found")
            
    except Exception as e:
        print(f"\n✗ Fatal error: {str(e)}")
        import traceback
        traceback.print_exc()
        
    finally:
        scraper.close()


if __name__ == "__main__":
    main()