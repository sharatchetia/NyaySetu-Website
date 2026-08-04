import sys
import json
import tempfile
from pathlib import Path

# Ensure project root directory is in sys.path for backend.ai imports
root_dir = Path(__file__).resolve().parent.parent.parent
if str(root_dir) not in sys.path:
    sys.path.insert(0, str(root_dir))

from backend.ai.analyze import analyze_document


SAMPLE_LEGAL_DOCUMENT = """
NON-DISCLOSURE AND CONFIDENTIALITY AGREEMENT

This Non-Disclosure Agreement ("Agreement") is entered into as of January 1, 2026, by and between TechCorp Solutions Pvt. Ltd. ("Disclosing Party") and InnovateX Analytics ("Receiving Party").

1. Purpose & Scope
The Disclosing Party agrees to share proprietary technical specifications, software architecture designs, and artificial intelligence source code with the Receiving Party solely for evaluating a potential commercial joint venture.

2. Important Clauses & Payment Terms
- All disclosures must be marked as "Confidential" or designated as proprietary within 10 business days.
- The evaluation period shall last for 6 months from the effective date.
- Neither party shall be required to make any financial payment under this evaluation phase.

3. Risks & Liabilities
- In the event of an unauthorized disclosure or breach of confidentiality by the Receiving Party, liquidated damages up to INR 5,00,000 may be claimed along with injunctive relief.
- Disclosing Party provides all information "AS IS" without warranties of accuracy or completeness.

4. Obligations
- The Receiving Party agrees to maintain strict confidentiality using the same standard of care used for its own confidential records.
- The Receiving Party shall not reverse engineer, decompile, or create derivative works from the disclosed proprietary technical materials.
"""


def main():
    """
    Test script to invoke analyze_document with a sample legal document
    and print the resulting JSON response.
    """
    # Check if a custom file path is provided as CLI argument
    if len(sys.argv) > 1 and Path(sys.argv[1]).exists():
        sample_path = Path(sys.argv[1])
        cleanup_needed = False
    else:
        # Create a temporary sample text document
        temp_dir = Path(tempfile.gettempdir())
        sample_path = temp_dir / "sample_legal_document.txt"
        sample_path.write_text(SAMPLE_LEGAL_DOCUMENT, encoding="utf-8")
        cleanup_needed = True

    print(f"Executing analyze_document() on sample document: {sample_path}\n")

    try:
        result = analyze_document(sample_path)
        print("--- JSON Response ---")
        print(json.dumps(result, indent=2))
    finally:
        if cleanup_needed and sample_path.exists():
            try:
                sample_path.unlink()
            except Exception:
                pass


if __name__ == "__main__":
    main()
