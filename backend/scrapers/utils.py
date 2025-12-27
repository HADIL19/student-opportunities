from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from bs4 import BeautifulSoup
import time

def get_driver(headless=True):
    options = Options()
    if headless:
        options.add_argument("--headless")
    driver = webdriver.Chrome(options=options)
    return driver

def get_soup(driver, url):
    driver.get(url)
    time.sleep(3)  # wait for page to load
    html = driver.page_source
    return BeautifulSoup(html, "html.parser")
