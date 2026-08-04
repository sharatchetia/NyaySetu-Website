import os
import logging
from typing import Dict

logger = logging.getLogger(__name__)


def generate_summary(text: str) -> str:
    """
    Generate a legal document summary using the Gemini API.
    Covers: Purpose, Important Clauses, Risks, Obligations.

    Args:
        text (str): Document text to summarize.

    Returns:
        str: Summarized document text.
    """
    if not text or not isinstance(text, str) or not text.strip():
        return "Unable to generate summary: Extracted document text is empty."

    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key:
        logger.warning("GEMINI_API_KEY environment variable is not configured.")
        return "Summary unavailable: GEMINI_API_KEY environment variable is not set."

    prompt = (
        "You are an expert legal assistant. Analyze the provided legal document and generate "
        "a concise legal summary covering the following four specific sections:\n\n"
        "1. Purpose: The overall goal and nature of the contract/document.\n"
        "2. Important Clauses: Key terms, key dates, payment terms, or critical conditions.\n"
        "3. Risks: Key legal liabilities, penalties, indemnity, or risk exposure.\n"
        "4. Obligations: Core duties and legal obligations assigned to the parties.\n\n"
        "Format the output clearly under headers for each section.\n\n"
        f"--- Document Content ---\n{text}"
    )

    try:
        return _call_gemini_api(prompt, api_key)
    except Exception as e:
        logger.error(f"Gemini API summarization failed: {e}")
        return f"Summary generation failed due to error: {str(e)}"


def _call_gemini_api(prompt: str, api_key: str) -> str:
    """Helper method to invoke Gemini API supporting official SDKs."""
    # Modern google-genai SDK
    try:
        from google import genai
        client = genai.Client(api_key=api_key)
        response = client.models.generate_content(
            model="gemini-2.5-flash",
            contents=prompt,
        )
        if response and response.text:
            return response.text.strip()
    except Exception as genai_err:
        logger.debug(f"google-genai client attempt failed/unavailable: {genai_err}")

    # Fallback to google.generativeai SDK
    try:
        import google.generativeai as legacy_genai
        legacy_genai.configure(api_key=api_key)
        model = legacy_genai.GenerativeModel("gemini-1.5-flash")
        response = model.generate_content(prompt)
        if response and response.text:
            return response.text.strip()
    except Exception as legacy_err:
        logger.error(f"google.generativeai client error: {legacy_err}")
        raise RuntimeError(f"Gemini API error: {legacy_err}") from legacy_err

    raise RuntimeError("Empty response received from Gemini API.")
