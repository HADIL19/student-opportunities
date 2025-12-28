from apscheduler.schedulers.background import BackgroundScheduler
from datetime import datetime
from backend.scrapers.courses.udemy_scraper import scrape_udemy, save_courses_to_db as save_udemy_to_db
from backend.scrapers.courses.coursera_scraper import scrape_coursera_selenium, save_courses_to_db as save_coursera_to_db
from backend.scrapers.hackathons.devpost_scraper import DevpostScraper
from backend.scrapers.hackathons.lablab_scraper import LablabScraper

scheduler = BackgroundScheduler()

def scrape_all():
    print(f"🚀 Scraping started at {datetime.now()}")

    # Udemy
    try:
        print("📚 Scraping Udemy...")
        udemy_courses = scrape_udemy(max_pages=2, free_only=False)
        save_udemy_to_db(udemy_courses)
        print(f"✅ Udemy finished ({len(udemy_courses)} courses)")
    except Exception as e:
        print(f"❌ Udemy scraper failed: {e}")

    # Coursera
    try:
        print("📚 Scraping Coursera...")
        coursera_courses = scrape_coursera_selenium(query="free", max_courses=50)
        save_coursera_to_db(coursera_courses)
        print(f"✅ Coursera finished ({len(coursera_courses)} courses)")
    except Exception as e:
        print(f"❌ Coursera scraper failed: {e}")

    # Devpost
    try:
        print("🎯 Scraping Devpost...")
        devpost_scraper = DevpostScraper(headless=True)
        hackathons_devpost = devpost_scraper.scrape_hackathons(max_pages=2)
        devpost_scraper.save_to_json(hackathons_devpost)
        devpost_scraper.save_to_database()
        devpost_scraper.close()
        print(f"✅ Devpost finished ({len(hackathons_devpost)} hackathons)")
    except Exception as e:
        print(f"❌ Devpost scraper failed: {e}")

    # LabLab.ai
    try:
        print("🎯 Scraping LabLab.ai...")
        lablab_scraper = LablabScraper()
        hackathons_lablab = lablab_scraper.scrape_hackathons()
        lablab_scraper.save_to_json(hackathons_lablab)
        lablab_scraper.save_to_database(hackathons_lablab)
        lablab_scraper.close()
        print(f"✅ LabLab.ai finished ({len(hackathons_lablab)} hackathons)")
    except Exception as e:
        print(f"❌ LabLab.ai scraper failed: {e}")

    print(f"🎉 All scrapers finished at {datetime.now()}")

def start_scheduler():
    """Call this from main.py to start the scheduler"""
    scheduler.add_job(scrape_all, 'cron', hour=2, minute=0)
    scheduler.start()
    print("📅 Scheduler started. Scrapers will run daily at 2 AM.")
