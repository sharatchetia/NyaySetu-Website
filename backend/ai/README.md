# NyaySetu AI Production Module

Production-ready, reusable AI pipeline for automated legal document extraction, classification, and summarization.

---

## 🏛️ Architecture Overview

```text
backend/
└── ai/
    ├── models/
    │   ├── best_model.pkl         # Trained LinearSVC Classifier
    │   ├── label_encoder.pkl      # Saved LabelEncoder
    │   ├── tfidf_vectorizer.pkl   # Saved TfidfVectorizer
    │   └── README.md
    ├── services/
    │   ├── __init__.py
    │   ├── document_service.py    # Text extraction (.pdf via PyMuPDF, .docx via python-docx)
    │   ├── model_loader.py        # Singleton model loader
    │   ├── prediction_service.py  # Inference & confidence scoring pipeline
    │   └── summarization_service.py # Legal summarization via Gemini API
    ├── utils/
    │   ├── __init__.py
    │   └── text_cleaner.py        # Text cleaning preprocessor
    ├── __init__.py
    ├── analyze.py                 # Primary entry point (analyze_document)
    ├── requirements.txt
    └── README.md
```

---

## 🚀 Setup & Installation

### 1. Requirements
Ensure Python 3.11 is installed. Install dependencies:

```bash
pip install -r backend/ai/requirements.txt
```

### 2. Environment Variables
Set your Gemini API key in `.env` or system environment:

```bash
export GEMINI_API_KEY="your-gemini-api-key"
```

---

## 💡 Usage

Exposes exactly one public function: `analyze_document(file_path)`

```python
from backend.ai.analyze import analyze_document

# Analyze document
result = analyze_document("/path/to/contract.pdf")

print(result)
```

### Response Schema

```json
{
  "category": "employment",
  "confidence": 98.45,
  "summary": "1. Purpose: ...\n2. Important Clauses: ...\n3. Risks: ...\n4. Obligations: ...",
  "textLength": 3410
}
```

---

## 🔧 Integration Notes

- No Express routes, React, MongoDB, or Firebase code is included.
- This module is pure Python inference code, designed to be called by backend Node.js / Express or Python API wrappers.
- Training scripts remain separated from this inference module.
