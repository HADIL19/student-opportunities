from datetime import datetime
from dateutil import parser

def parse_deadline(date_str: str):
    try:
        return parser.parse(date_str)
    except Exception:
        try:
            return datetime.fromisoformat(date_str)
        except Exception:
            return None
