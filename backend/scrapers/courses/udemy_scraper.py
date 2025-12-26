import requests

def scrape_udemy(query="python"):
    url = f"https://www.udemy-small-api.p.rapidapi.com/course/search?query={query}"
    headers = {
        "x-rapidapi-key": "YOUR_API_KEY",  # replace with your key
        "x-rapidapi-host": "udemy-small-api.p.rapidapi.com"
    }

    r = requests.get(url, headers=headers)
    courses = []

    if r.status_code == 200:
        for c in r.json().get("courses", []):
            courses.append({
                "title": c.get("title"),
                "price": c.get("price"),
                "link": c.get("url"),
                "source": "udemy"
            })
    return courses
