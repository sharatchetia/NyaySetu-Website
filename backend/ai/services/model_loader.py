from pathlib import Path
import logging
from typing import Tuple, Any, Optional
import warnings
import joblib

logger = logging.getLogger(__name__)

# Base directory for AI module models
AI_BASE_DIR = Path(__file__).resolve().parent.parent
MODEL_DIR = AI_BASE_DIR / "models"


class ModelLoader:
    """
    Singleton loader for machine learning artifacts:
    - best_model.pkl (LinearSVC classifier)
    - tfidf_vectorizer.pkl (TfidfVectorizer)
    - label_encoder.pkl (LabelEncoder)
    """

    _model: Optional[Any] = None
    _vectorizer: Optional[Any] = None
    _encoder: Optional[Any] = None

    @classmethod
    def load(cls) -> Tuple[Any, Any, Any]:
        """
        Load machine learning model artifacts from models directory.

        Returns:
            Tuple[Any, Any, Any]: (classifier_model, tfidf_vectorizer, label_encoder)

        Raises:
            FileNotFoundError: If any required model artifact file is missing.
            RuntimeError: If model deserialization fails.
        """
        if cls._model is None or cls._vectorizer is None or cls._encoder is None:
            model_path = MODEL_DIR / "best_model.pkl"
            vectorizer_path = MODEL_DIR / "tfidf_vectorizer.pkl"
            encoder_path = MODEL_DIR / "label_encoder.pkl"

            for path in [model_path, vectorizer_path, encoder_path]:
                if not path.is_file():
                    raise FileNotFoundError(
                        f"Required model artifact missing at: {path}. "
                        "Ensure best_model.pkl, tfidf_vectorizer.pkl, and label_encoder.pkl exist in backend/ai/models/"
                    )

            try:
                with warnings.catch_warnings():
                    warnings.simplefilter("ignore")
                    cls._model = joblib.load(model_path)
                    cls._vectorizer = joblib.load(vectorizer_path)
                    cls._encoder = joblib.load(encoder_path)
                logger.info(f"Successfully loaded ML models from {MODEL_DIR}")
            except Exception as e:
                logger.error(f"Failed to load model artifacts: {e}")
                raise RuntimeError(f"Error deserializing ML model artifacts: {e}") from e

        return cls._model, cls._vectorizer, cls._encoder
