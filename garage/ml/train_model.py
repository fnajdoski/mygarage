"""Train a simple & safe ML model (RandomForest regression) for maintenance cost estimation.

This script is designed to work with:
- Your current synthetic dataset (maintenance_dataset.csv), OR
- A large external dataset (e.g., "Motor Vehicle Repair & Towing Dataset") exported as CSV.

Usage examples:
    python garage/ml/train_model.py --dataset maintenance_dataset.csv
    python garage/ml/train_model.py --dataset /path/to/motor_vehicle_repair_towing.csv --target "Total Cost"

Notes:
- The model and metadata are saved into garage/ml/models/
- Metadata includes the list of feature columns expected by the model at inference time.
"""

import argparse
import json
import os
import pickle
from typing import List

import pandas as pd
from sklearn.compose import ColumnTransformer
from sklearn.ensemble import RandomForestRegressor
from sklearn.impute import SimpleImputer
from sklearn.metrics import mean_absolute_error
from sklearn.model_selection import train_test_split
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import OneHotEncoder


DEFAULT_FEATURES = [
    "Vehicle Type",
    "Service Type",
    "Make",
    "Model",
    "Year",
    "Odometer KM",
]

DEFAULT_TARGET = "Total Cost"


def _normalize_columns(df: pd.DataFrame) -> pd.DataFrame:
    """Try to normalize common column names to our internal schema.

    If you use an external dataset, you can either:
    - Rename columns in your CSV to match DEFAULT_FEATURES / DEFAULT_TARGET, OR
    - Extend this mapping below.
    """
    mapping = {
        # Internal / current project dataset
        "Mileage at Service": "Odometer KM",
        "mileage_km": "Odometer KM",
        "mileage": "Odometer KM",
        "odometer": "Odometer KM",
        "vehicle_type": "Vehicle Type",
        "service_type": "Service Type",
        "total_cost": "Total Cost",
        "cost": "Total Cost",
        "make": "Make",
        "model": "Model",
        "year": "Year",
    }

    df = df.rename(columns={c: mapping.get(c, c) for c in df.columns})
    return df


def train_model(dataset_path: str, target_col: str, feature_cols: List[str], out_dir: str) -> None:
    df = pd.read_csv(dataset_path)
    df = _normalize_columns(df)

    missing = [c for c in feature_cols + [target_col] if c not in df.columns]
    if missing:
        raise ValueError(
            "Dataset is missing required columns: "
            + ", ".join(missing)
            + "\nExpected features: "
            + ", ".join(feature_cols)
            + f"\nTarget: {target_col}"
        )

    X = df[feature_cols]
    y = df[target_col]

    # Split
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42
    )

    # Identify categorical vs numeric
    categorical = [c for c in feature_cols if X[c].dtype == "object"]
    numeric = [c for c in feature_cols if c not in categorical]

    preprocessor = ColumnTransformer(
        transformers=[
            ("cat", Pipeline(steps=[
                ("imputer", SimpleImputer(strategy="most_frequent")),
                ("onehot", OneHotEncoder(handle_unknown="ignore"))
            ]), categorical),
            ("num", Pipeline(steps=[
                ("imputer", SimpleImputer(strategy="median"))
            ]), numeric),
        ],
        remainder="drop",
    )

    model = Pipeline(
        steps=[
            ("preprocessor", preprocessor),
            ("regressor", RandomForestRegressor(
                n_estimators=200,
                random_state=42,
                n_jobs=-1
            )),
        ]
    )

    print("Training model...")
    model.fit(X_train, y_train)

    y_pred = model.predict(X_test)
    mae = mean_absolute_error(y_test, y_pred)
    print(f"Model trained. MAE: {mae:.2f}")

    os.makedirs(out_dir, exist_ok=True)

    model_path = os.path.join(out_dir, "cost_estimator.pkl")
    meta_path = os.path.join(out_dir, "cost_estimator_meta.json")

    with open(model_path, "wb") as f:
        pickle.dump(model, f)

    with open(meta_path, "w", encoding="utf-8") as f:
        json.dump(
            {
                "version": "rf-v1",
                "feature_columns": feature_cols,
                "target_column": target_col,
                "mae": float(mae),
            },
            f,
            indent=2,
        )

    print(f"Model saved to: {model_path}")
    print(f"Metadata saved to: {meta_path}")


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--dataset", default="maintenance_dataset.csv", help="Path to CSV dataset")
    parser.add_argument("--target", default=DEFAULT_TARGET, help="Target column name")
    parser.add_argument(
        "--features",
        nargs="*",
        default=DEFAULT_FEATURES,
        help="Feature columns to use (space-separated)",
    )
    parser.add_argument(
        "--outdir",
        default=os.path.join("garage", "ml", "models"),
        help="Output directory for model artifacts",
    )
    args = parser.parse_args()

    train_model(args.dataset, args.target, args.features, args.outdir)


if __name__ == "__main__":
    main()
