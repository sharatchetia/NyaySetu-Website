import numpy as np
from typing import Dict, Any, List

from .model_loader import ModelLoader
from ..utils.text_cleaner import clean_text


def softmax(values: np.ndarray) -> np.ndarray:
    """
    Compute softmax probabilities for raw decision function scores.

    Args:
        values (np.ndarray): Array of raw scores.

    Returns:
        np.ndarray: Softmax normalized probabilities.
    """
    exp = np.exp(values - np.max(values))
    return exp / exp.sum()


def predict(text: str) -> Dict[str, Any]:
    """
    Classify legal document text using existing pre-trained model pipeline.

    Args:
        text (str): Input text from document.

    Returns:
        Dict[str, Any]: Classification output dictionary:
            - category (str): Predicted class label.
            - confidence (float): Confidence score percentage (0-100 or 0-1).
            - top_predictions (List[Dict]): Top 3 class predictions with confidence.

    Raises:
        ValueError: If text is empty.
    """
    cleaned = clean_text(text)

    if not cleaned:
        raise ValueError("Document text is empty.")

    model, vectorizer, encoder = ModelLoader.load()

    # Transform text to TF-IDF feature matrix
    X = vectorizer.transform([cleaned])

    # Predict class index
    predicted_index = model.predict(X)[0]

    # Calculate probabilities from decision function scores
    scores = model.decision_function(X)[0]
    probabilities = softmax(scores)

    # Top 3 class predictions
    top_indices = np.argsort(probabilities)[::-1][:3]
    top_predictions = [
        {
            "label": str(encoder.inverse_transform([i])[0]),
            "confidence": round(float(probabilities[i] * 100), 2),
        }
        for i in top_indices
    ]

    predicted_category = str(encoder.inverse_transform([predicted_index])[0])
    confidence_score = round(float(probabilities[predicted_index] * 100), 2)

    return {
        "category": predicted_category,
        "confidence": confidence_score,
        "top_predictions": top_predictions,
    }
