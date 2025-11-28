import pickle
import pandas as pd
import os
from django.conf import settings

MODEL_PATH = os.path.join(settings.BASE_DIR, 'garage/ml/models/cost_estimator.pkl')
_model = None

def load_model():
    global _model
    if _model is None:
        try:
            with open(MODEL_PATH, 'rb') as f:
                _model = pickle.load(f)
        except FileNotFoundError:
            print(f"Warning: Model file not found at {MODEL_PATH}")
            return None
    return _model

def predict_cost(vehicle_type, service_type):
    model = load_model()
    if not model:
        return None
    
    # Create a DataFrame for prediction
    input_data = pd.DataFrame({
        'Vehicle Type': [vehicle_type],
        'Service Type': [service_type]
    })
    
    try:
        prediction = model.predict(input_data)[0]
        return round(prediction, 2)
    except Exception as e:
        print(f"Prediction error: {e}")
        return None
