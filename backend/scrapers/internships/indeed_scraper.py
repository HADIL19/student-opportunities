import os
import sys
import json
from datetime import datetime

# ----------------- project imports -----------------

# add backend/ to sys.path
BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
if BASE_DIR not in sys.path:
    sys.path.insert(0, BASE_DIR)

from database.db import SessionLocal
from database.models import Internship


JSON_FILE = "apify_internships.json"


def load_items():
    """Load all items from the local JSON file."""
    path = os.path.join(os.path.dirname(__file__), JSON_FILE)
    with open(path, "r", encoding="utf-8") as f:
        data = json.load(f)
    print(f"Loaded {len(data)} items from {JSON_FILE}")
    return data


def map_item(item: dict) -> dict:
    """
    Map ONE Apify item -> fields for Internship.

    Uses your actual JSON keys:
      positionName -> title
      company      -> company
      location     -> location
      description  -> description
      url          -> link
    """
    title = item.get("positionName") or ""
    company = item.get("company") or ""
    location = item.get("location") or ""
    description = item.get("description") or ""
    link = item.get("url") or ""

    text = (location + " " + description).lower()
    is_remote = "remote" in text or "work from home" in text

    return {
        "title": title.strip(),
        "company": company.strip(),
        "location": location.strip(),
        "description": description.strip(),
        "link": link.strip(),
        "is_remote": is_remote,
    }


def save_to_db(raw_items):
    """Insert/update rows in student_internships."""
    from sqlalchemy.orm import Session
    from sqlalchemy.exc import IntegrityError

    db: Session = SessionLocal()
    created, updated = 0, 0

    try:
        for raw in raw_items:
            data = map_item(raw)

            # skip if no title or link
            if not data["title"] or not data["link"]:
                continue

            try:
                existing = db.query(Internship).filter_by(link=data["link"]).first()

                if existing:
                    # update existing row
                    existing.title = data["title"][:500]
                    existing.company = data["company"][:300]
                    existing.location = data["location"][:200]
                    existing.description = data["description"]
                    existing.is_remote = data["is_remote"]
                    existing.student_focus = True
                    updated += 1
                else:
                    # create new row
                    obj = Internship(
                        title=data["title"][:500],
                        company=data["company"][:300],
                        location=data["location"][:200],
                        is_remote=data["is_remote"],
                        description=data["description"],
                        link=data["link"][:500],
                        student_focus=True,
                        scraped_at=datetime.utcnow(),
                    )
                    db.add(obj)
                    created += 1

                db.commit()
            except IntegrityError:
                db.rollback()
                continue
            except Exception as e:
                db.rollback()
                print("Row error:", e)
                continue
    finally:
        db.close()

    print(f"DB saved. New: {created}, Updated: {updated}")


def main():
    items = load_items()
    save_to_db(items)


if __name__ == "__main__":
    main()
