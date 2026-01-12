import os
import json
import pickle
from typing import Any, Dict, List, Optional, Tuple

import pandas as pd
from django.conf import settings

MODELS_DIR = os.path.join(settings.BASE_DIR, "garage", "ml", "models")
MODEL_PATH = os.path.join(MODELS_DIR, "cost_estimator.pkl")
META_PATH = os.path.join(MODELS_DIR, "cost_estimator_meta.json")

_model: Any = None
_meta: Dict[str, Any] | None = None


def _load_meta() -> Dict[str, Any]:
    """Load model metadata (feature columns, version, etc.). Falls back to legacy defaults."""
    global _meta
    if _meta is not None:
        return _meta

    # Legacy default: earlier versions used only these 2 features.
    legacy = {"feature_columns": ["Vehicle Type", "Service Type"], "version": "legacy"}

    try:
        with open(META_PATH, "r", encoding="utf-8") as f:
            _meta = json.load(f)
            # Basic validation
            if not isinstance(_meta, dict) or "feature_columns" not in _meta:
                _meta = legacy
    except FileNotFoundError:
        _meta = legacy
    except Exception:
        _meta = legacy

    return _meta


def load_model() -> Any:
    global _model
    if _model is None:
        try:
            with open(MODEL_PATH, "rb") as f:
                _model = pickle.load(f)
        except FileNotFoundError:
            print(f"Warning: Model file not found at {MODEL_PATH}")
            return None
        except Exception as e:
            print(f"Warning: Failed to load model at {MODEL_PATH}: {e}")
            return None
    return _model


def _build_input_row(features: Dict[str, Any], feature_columns: List[str]) -> pd.DataFrame:
    """Build a single-row DataFrame with exactly the columns the model expects."""
    row = {}
    for col in feature_columns:
        row[col] = features.get(col)
    return pd.DataFrame([row])


def predict_cost_from_features(features: Dict[str, Any]) -> Optional[float]:
    """Predict cost using a dict of features."""
    model = load_model()
    if not model:
        return None

    meta = _load_meta()
    feature_columns = meta.get("feature_columns", ["Vehicle Type", "Service Type"])

    input_df = _build_input_row(features, feature_columns)

    try:
        prediction = float(model.predict(input_df)[0])
        return round(prediction, 2)
    except Exception as e:
        print(f"Prediction error: {e}")
        return None


def predict_cost(vehicle_type: str, service_type: str) -> Optional[float]:
    """Backward-compatible helper (legacy 2-feature prediction)."""
    return predict_cost_from_features({
        "Vehicle Type": vehicle_type,
        "Service Type": service_type,
    })
