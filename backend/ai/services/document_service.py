import os
import logging
from pathlib import Path
from typing import Union
import fitz  # PyMuPDF
from docx import Document

logger = logging.getLogger(__name__)


def extract_text_from_path(file_path: Union[str, Path]) -> str:
    """
    Extract text content from a given document path (.pdf, .docx, .txt, .png, .jpg, .jpeg).

    Args:
        file_path (str | Path): Path to the target document or image file.

    Returns:
        str: Extracted plain text string.

    Raises:
        FileNotFoundError: If file path does not exist.
        ValueError: If file extension is unsupported or document is empty.
        RuntimeError: If document parsing or OCR fails.
    """
    path = Path(file_path)

    if not path.is_file():
        raise FileNotFoundError(f"File not found: {file_path}")

    suffix = path.suffix.lower()

    try:
        if suffix == ".pdf":
            text = _extract_pdf(path)
        elif suffix == ".docx":
            text = _extract_docx(path)
        elif suffix == ".txt":
            text = _extract_txt(path)
        elif suffix in [".png", ".jpg", ".jpeg"]:
            text = _extract_image(path)
        else:
            raise ValueError(
                f"Unsupported file format '{suffix}'. Supported formats are: .pdf, .docx, .txt, .png, .jpg, .jpeg"
            )
    except ValueError:
        raise
    except Exception as e:
        raise RuntimeError(f"Error parsing document '{path.name}': {str(e)}") from e

    cleaned = text.strip()
    if not cleaned:
        raise ValueError(f"No readable text could be extracted from '{path.name}'.")

    return cleaned


def _extract_pdf(file_path: Path) -> str:
    """Extract text from PDF using PyMuPDF, falling back to OCR for scanned pages."""
    text_chunks = []
    with fitz.open(file_path) as pdf:
        for page in pdf:
            page_text = page.get_text()
            if page_text and page_text.strip():
                text_chunks.append(page_text)
            else:
                # Scanned PDF page OCR fallback
                try:
                    from PIL import Image
                    import pytesseract
                    pix = page.get_pixmap()
                    img = Image.frombytes("RGB", [pix.width, pix.height], pix.samples)
                    ocr_text = pytesseract.image_to_string(img)
                    if ocr_text and ocr_text.strip():
                        text_chunks.append(ocr_text)
                except Exception as ocr_err:
                    logger.debug(f"PDF page OCR fallback failed: {ocr_err}")

    return "\n".join(text_chunks)


def _extract_docx(file_path: Path) -> str:
    """Extract text from DOCX using python-docx."""
    doc = Document(file_path)
    return "\n".join(p.text for p in doc.paragraphs if p.text and p.text.strip())


def _extract_txt(file_path: Path) -> str:
    """Extract text from TXT file."""
    return file_path.read_text(encoding="utf-8", errors="ignore")


def _extract_image(file_path: Path) -> str:
    """Extract text from PNG, JPG, JPEG images using Pillow and pytesseract OCR."""
    try:
        from PIL import Image
        import pytesseract
    except ImportError as err:
        raise RuntimeError("Pillow and pytesseract must be installed to support image OCR.") from err

    try:
        with Image.open(file_path) as img:
            text = pytesseract.image_to_string(img)
            return text
    except Exception as e:
        raise RuntimeError(f"OCR extraction failed for image '{file_path.name}': {str(e)}") from e
