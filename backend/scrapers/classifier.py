def classify_event(item):
    """Very small placeholder classifier: returns 'hackathon' or 'competition' based on keywords."""
    title = item.get("title", "").lower()
    if any(k in title for k in ["hackathon", "hack"]):
        return "hackathon"
    if any(k in title for k in ["competition", "contest", "challenge"]):
        return "competition"
    return "unknown"
