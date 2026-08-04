import time
import logging
from typing import Dict, Any, Union
from pathlib import Path

from .services.document_service import extract_text_from_path
from .services.prediction_service import predict
from .services.summarization_service import generate_summary

logger = logging.getLogger(__name__)


def analyze_document(file_path: Union[str, Path]) -> Dict[str, Any]:
    """
    Primary public entrypoint for the AI Document Analysis Module.

    Workflow:
        1. Measure pipeline execution start time
        2. Extract text from document (.pdf, .docx, .txt, .png, .jpg, .jpeg)
        3. Run ML text classification pipeline
        4. Generate legal summary via Gemini API (or return structured summary error)
        5. Return consolidated JSON payload with processing metadata

    Args:
        file_path (Union[str, Path]): Path to target document or image file.

    Returns:
        Dict[str, Any]: Consolidated payload dictionary containing:
            - category (str): Predicted document category.
            - confidence (float): Classification confidence score percentage.
            - summary (Optional[str]): Generated simple-English summary or None if failed.
            - summaryError (Optional[str]): Error reason string if summarization failed, or None.
            - textLength (int): Character count of extracted plain text.
            - processingTime (str): Total execution time string (e.g. '0.45s').
            - modelVersion (str): Model version identifier ('v1').

    Raises:
        FileNotFoundError: If the document file does not exist.
        ValueError: If file type is unsupported or text extraction produces empty text.
        RuntimeError: If critical failures occur during document text extraction or parsing.
    """
    start_time = time.perf_counter()
    logger.info(f"Initiating analyze_document pipeline for: {file_path}")

    # 1. Extract Text
    text = extract_text_from_path(file_path)
    text_length = len(text)

    # 2. Classify Document using existing ML pipeline
    classification = predict(text)
    category = classification.get("category", "Unknown")
    confidence = classification.get("confidence", 0.0)

    # 3. Gemini Summarization (Fault-Tolerant)
    try:
        summarization_res = generate_summary(text)
        if isinstance(summarization_res, dict):
            summary = summarization_res.get("summary")
            summary_error = summarization_res.get("summaryError")
        else:
            summary = str(summarization_res) if summarization_res else None
            summary_error = None
    except Exception as e:
        logger.error(f"Gemini summarization failed in analyze_document: {e}")
        summary = None
        summary_error = f"Summarization failed due to unexpected error: {str(e)}"

    # 4. Processing Time Metadata
    elapsed = time.perf_counter() - start_time
    processing_time_str = f"{elapsed:.2f}s"

    # 5. Construct Final Payload
    payload = {
        "category": category,
        "confidence": confidence,
        "summary": summary,
        "summaryError": summary_error,
        "textLength": text_length,
        "processingTime": processing_time_str,
        "modelVersion": "v1",
    }

    logger.info(
        f"Successfully analyzed document '{file_path}'. Category: {category}, "
        f"Length: {text_length}, Time: {processing_time_str}"
    )
    return payload


if __name__ == "__main__":
    import sys
    if len(sys.argv) > 1:
        target_path = sys.argv[1]
        print(f"Analyzing document: {target_path}")
        print(analyze_document(target_path))
    else:
        print("Usage: python -m backend.ai.analyze <file_path>")
