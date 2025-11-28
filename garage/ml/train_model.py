import pandas as pd
import pickle
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestRegressor
from sklearn.preprocessing import OneHotEncoder
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
from sklearn.metrics import mean_absolute_error
import os

def train_model():
    # Load data
    df = pd.read_csv('maintenance_dataset.csv')
    
    # Features and Target
    X = df[['Vehicle Type', 'Service Type']]
    y = df['Total Cost']

    # Preprocessing
    preprocessor = ColumnTransformer(
        transformers=[
            ('cat', OneHotEncoder(handle_unknown='ignore'), ['Vehicle Type', 'Service Type'])
        ]
    )

    # Pipeline
    model = Pipeline(steps=[
        ('preprocessor', preprocessor),
        ('regressor', RandomForestRegressor(n_estimators=100, random_state=42))
    ])

    # Split
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

    # Train
    print("Training model...")
    model.fit(X_train, y_train)

    # Evaluate
    y_pred = model.predict(X_test)
    mae = mean_absolute_error(y_test, y_pred)
    print(f"Model trained. MAE: {mae:.2f}")

    # Save
    os.makedirs('garage/ml/models', exist_ok=True)
    with open('garage/ml/models/cost_estimator.pkl', 'wb') as f:
        pickle.dump(model, f)
    print("Model saved to garage/ml/models/cost_estimator.pkl")

if __name__ == "__main__":
    train_model()
