from apscheduler.schedulers.background import BackgroundScheduler

from backend.scrapers.coursera import scrape_coursera_selenium, save_courses_to_db
from backend.scrapers.udemy import scrape_udemy, save_courses_to_db as save_udemy_to_db
from backend.scrapers.devpost import DevpostScraper
from backend.scrapers.lablab import LablabScraper


scheduler = BackgroundScheduler()


def scrape_all():
    # Scrape courses
    coursera_data = scrape_coursera_selenium()
    save_courses_to_db(coursera_data)
    
    udemy_data = scrape_udemy()
    save_udemy_to_db(udemy_data)
    
    # Scrape hackathons/competitions
    devpost_scraper = DevpostScraper()
    devpost_scraper.scrape_hackathons()
    devpost_scraper.save_to_database()
    devpost_scraper.close()
    
    lablab_scraper = LablabScraper()
    lablab_scraper.scrape_hackathons()
    lablab_scraper.save_to_database()
    lablab_scraper.close()


scheduler.add_job(scrape_all, 'interval', hours=6)


def start_scheduler():
    scheduler.start()