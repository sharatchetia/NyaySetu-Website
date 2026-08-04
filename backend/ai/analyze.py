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
        1. Extract text from document (.pdf or .docx)
        2. Run ML text classification pipeline
        3. Generate legal summary via Gemini API
        4. Return structured JSON outcome

    Args:
        file_path (Union[str, Path]): Path to target .pdf, .docx, or .txt file.

    Returns:
        Dict[str, Any]: Consolidated dictionary:
            - category (str): Predicted document category.
            - confidence (float): Classification confidence score.
            - summary (str): Generated legal summary (Purpose, Clauses, Risks, Obligations).
            - textLength (int): Character count of extracted plain text.

    Raises:
        FileNotFoundError: If the document file does not exist.
        ValueError: If file type is unsupported or text extraction produces empty text.
        RuntimeError: If critical failures occur during document processing.
    """
    logger.info(f"Initiating analyze_document pipeline for: {file_path}")

    # 1. Extract Text
    text = extract_text_from_path(file_path)
    text_length = len(text)

    # 2. Classify Document using existing ML pipeline
    classification = predict(text)
    category = classification.get("category", "Unknown")
    confidence = classification.get("confidence", 0.0)

    # 3. Gemini Summarization
    summary = generate_summary(text)

    # 4. Construct Final Payload
    payload = {
        "category": category,
        "confidence": confidence,
        "summary": summary,
        "textLength": text_length,
    }

    logger.info(f"Successfully analyzed document '{file_path}'. Category: {category}, Length: {text_length}")
    return payload


if __name__ == "__main__":
    import sys
    if len(sys.argv) > 1:
        target_path = sys.argv[1]
        print(f"Analyzing document: {target_path}")
        print(analyze_document(target_path))
    else:
        print("Usage: python -m backend.ai.analyze <file_path>")
