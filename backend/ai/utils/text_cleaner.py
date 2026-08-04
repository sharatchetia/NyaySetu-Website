import re


def clean_text(text: str) -> str:
    """
    Clean input text by replacing multiple whitespace characters with a single space.

    Args:
        text (str): Input text string.

    Returns:
        str: Cleaned text string.
    """
    if not text or not isinstance(text, str):
        return ""
    cleaned = re.sub(r"\s+", " ", text)
    return cleaned.strip()
