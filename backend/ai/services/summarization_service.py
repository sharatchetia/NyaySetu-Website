import os
import logging
from typing import Dict, Any, Optional

logger = logging.getLogger(__name__)

# Intelligent truncation limit (~2500-3000 words) to avoid Gemini token limits
MAX_TEXT_CHARACTERS = 12000


def generate_summary(text: str) -> Dict[str, Optional[str]]:
    """
    Generate a legal document summary using the Gemini API.
    Covers: Purpose, Important Clauses, Risks, Obligations.

    Handles size checking, intelligent truncation, and structured error responses.

    Args:
        text (str): Document text to summarize.

    Returns:
        Dict[str, Optional[str]]: Dictionary with structure:
            - summary: Summarized text or None if failed.
            - summaryError: Error reason string if failed, or None if successful.
    """
    # 1. Load environment variables securely via python-dotenv before reading GEMINI_API_KEY
    try:
        from dotenv import load_dotenv, find_dotenv
        load_dotenv(find_dotenv(), override=True)
    except Exception as env_err:
        logger.debug(f"python-dotenv load warning: {env_err}")

    if not text or not isinstance(text, str) or not text.strip():
        return {
            "summary": None,
            "summaryError": "Extracted document text is empty."
        }

    raw_api_key = os.getenv("GEMINI_API_KEY")
    if not raw_api_key or not raw_api_key.strip():
        logger.warning("GEMINI_API_KEY environment variable is not configured.")
        return {
            "summary": None,
            "summaryError": "GEMINI_API_KEY environment variable is not configured."
        }

    # Sanitize API key if enclosed in angle brackets or quotes
    api_key = raw_api_key.strip().strip("<>").strip('"').strip("'")

    # 2. Intelligently truncate large documents while preserving the beginning
    if len(text) > MAX_TEXT_CHARACTERS:
        logger.info(
            f"Extracted text length ({len(text)} chars) exceeds limit ({MAX_TEXT_CHARACTERS} chars). "
            "Intelligently truncating text before summarization."
        )
        truncated_text = (
            text[:MAX_TEXT_CHARACTERS]
            + "\n\n[Note: Document text truncated for summarization due to size limit.]"
        )
    else:
        truncated_text = text

    prompt = (
        "You are an expert legal assistant. Analyze the provided legal document and generate "
        "a simple-English summary (maximum 300 words total) using clear, plain, non-jargon language "
        "that non-lawyers can easily understand.\n\n"
        "Cover the following four specific sections:\n"
        "1. Purpose: The overall goal and nature of the contract/document.\n"
        "2. Important Clauses: Key terms, key dates, payment terms, or critical conditions.\n"
        "3. Risks: Key legal liabilities, penalties, indemnity, or risk exposure.\n"
        "4. Obligations: Core duties and legal obligations assigned to the parties.\n\n"
        "Ensure the summary is easy to understand and does not exceed 300 words. Format the output clearly under headers for each section.\n\n"
        f"--- Document Content ---\n{truncated_text}"
    )

    try:
        summary_text = _call_gemini_api(prompt, api_key)
        return {
            "summary": summary_text,
            "summaryError": None
        }
    except Exception as e:
        logger.error(f"Gemini API summarization failed: {e}")
        return {
            "summary": None,
            "summaryError": f"Gemini API summarization failed: {str(e)}"
        }


def _call_gemini_api(prompt: str, api_key: str) -> str:
    """Helper method to invoke Gemini API supporting official google-genai and legacy SDKs."""
    candidate_models = ["gemini-3.5-flash", "gemini-3.6-flash", "gemini-2.0-flash", "gemini-flash-latest"]
    genai_errors = []

    # 1. Modern google-genai SDK
    try:
        from google import genai
        client = genai.Client(api_key=api_key)
        for model_name in candidate_models:
            try:
                response = client.models.generate_content(
                    model=model_name,
                    contents=prompt,
                )
                if response and response.text:
                    return response.text.strip()
            except Exception as m_err:
                genai_errors.append(f"{model_name}: {m_err}")
                logger.debug(f"google-genai model '{model_name}' attempt failed: {m_err}")
    except Exception as genai_err:
        logger.debug(f"google-genai client initialization failed/unavailable: {genai_err}")

    # 2. Fallback to google.generativeai SDK if available
    try:
        import google.generativeai as legacy_genai
        legacy_genai.configure(api_key=api_key)
        for model_name in candidate_models:
            try:
                model = legacy_genai.GenerativeModel(model_name)
                response = model.generate_content(prompt)
                if response and response.text:
                    return response.text.strip()
            except Exception as m_err:
                logger.debug(f"legacy google.generativeai model '{model_name}' failed: {m_err}")
    except Exception as legacy_err:
        logger.debug(f"google.generativeai client error: {legacy_err}")

    error_detail = "; ".join(genai_errors) if genai_errors else "Unable to communicate with Gemini models."
    raise RuntimeError(f"Gemini API error: {error_detail}")
