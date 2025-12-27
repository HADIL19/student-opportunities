import os
import json
from apify_client import ApifyClient

APIFY_TOKEN = os.getenv("APIFY_TOKEN")
DATASET_ID = "Nv22CcCkUeJsMA4Kr"  # your dataset id
OUTPUT_FILE = "apify_internships.json"


def fetch_internships():
    if not APIFY_TOKEN:
        raise RuntimeError(
            "APIFY_TOKEN is not set. In PowerShell run:\n"
            '$env:APIFY_TOKEN = "apify_api_...your_token..."'
        )

    client = ApifyClient(APIFY_TOKEN)
    dataset = client.dataset(DATASET_ID)

    items = list(dataset.iterate_items())
    print(f"Fetched {len(items)} items from dataset {DATASET_ID}")
    return items


def save_to_json(items):
    """Save list of dicts to a local JSON file."""
    with open(OUTPUT_FILE, "w", encoding="utf-8") as f:
        json.dump(items, f, ensure_ascii=False, indent=2)
    print(f"Saved {len(items)} items to {OUTPUT_FILE}")


if __name__ == "__main__":
    data = fetch_internships()
    save_to_json(data)
