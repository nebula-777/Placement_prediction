"""
Placement Prediction Model Training Script
Trains Logistic Regression on placement dataset
"""

import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LogisticRegression
from sklearn.preprocessing import StandardScaler
from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score, confusion_matrix
import json
import os

print("=" * 60)
print("🎓 PLACEMENT PREDICTION MODEL TRAINING")
print("=" * 60)

# Step 1: Load dataset
print("\n📊 Loading dataset...")

# Check if file exists in correct location
dataset_path = '../dataset/placement_data.csv'
if not os.path.exists(dataset_path):
    # Try alternative path
    dataset_path = 'dataset/placement_data.csv'
    
df = pd.read_csv(dataset_path)
print(f"✅ Loaded {len(df)} student records")

# Step 2: Prepare features
features = ['cgpa', 'technical_skills', 'soft_skills', 'internships', 
            'projects', 'aptitude_score', 'backlogs']
X = df[features]
y = df['placed']

print(f"\n📈 Features: {features}")
print(f"🎯 Target: Placement status (1=Placed, 0=Not Placed)")

# Step 3: Split data
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42
)

print(f"\n📊 Training data: {len(X_train)} records")
print(f"📊 Testing data: {len(X_test)} records")

# Step 4: Scale features
scaler = StandardScaler()
X_train_scaled = scaler.fit_transform(X_train)
X_test_scaled = scaler.transform(X_test)

# Step 5: Train Logistic Regression
print("\n🤖 Training Logistic Regression model...")
model = LogisticRegression(max_iter=1000, random_state=42)
model.fit(X_train_scaled, y_train)

# Step 6: Evaluate model
y_pred = model.predict(X_test_scaled)
accuracy = accuracy_score(y_test, y_pred)
precision = precision_score(y_test, y_pred)
recall = recall_score(y_test, y_pred)
f1 = f1_score(y_test, y_pred)

print(f"\n✅ Model Performance:")
print(f"   Accuracy:  {accuracy * 100:.2f}%")
print(f"   Precision: {precision * 100:.2f}%")
print(f"   Recall:    {recall * 100:.2f}%")
print(f"   F1 Score:  {f1 * 100:.2f}%")

# Step 7: Confusion Matrix
cm = confusion_matrix(y_test, y_pred)
print(f"\n📊 Confusion Matrix:")
print(f"   True Positives:  {cm[1][1]}")
print(f"   True Negatives:  {cm[0][0]}")
print(f"   False Positives: {cm[0][1]}")
print(f"   False Negatives: {cm[1][0]}")

# Step 8: Get coefficients
coefficients = model.coef_[0]
intercept = model.intercept_[0]

print(f"\n🔢 Model Coefficients (learned from dataset):")
for feature, coef in zip(features, coefficients):
    print(f"   {feature}: {coef:.4f}")
print(f"   intercept: {intercept:.4f}")

# Step 9: Save coefficients to JSON
coeff_dict = {
    "intercept": float(intercept),
    "cgpa": float(coefficients[0]),
    "technical": float(coefficients[1]),
    "soft": float(coefficients[2]),
    "internships": float(coefficients[3]),
    "projects": float(coefficients[4]),
    "aptitude": float(coefficients[5]),
    "backlogs": float(coefficients[6]),
    "model_accuracy": float(accuracy),
    "total_records": int(len(df)),
    "placement_rate": float(df['placed'].mean())
}

# Save to file
output_path = 'model_coefficients.json'
with open(output_path, 'w') as f:
    json.dump(coeff_dict, f, indent=2)

print(f"\n✅ Coefficients saved to '{output_path}'")

# Step 10: Generate JavaScript code
print("\n📝 JavaScript Code to embed in website:")
print("=" * 60)

js_code = f"""
// ML Model Coefficients (trained on {len(df)} student records)
// Model Accuracy: {accuracy * 100:.1f}%
// Dataset Source: Kaggle + Real Placement Data

const MODEL_COEFFICIENTS = {{
    intercept: {intercept:.4f},
    cgpa: {coefficients[0]:.4f},
    technical: {coefficients[1]:.4f},
    soft: {coefficients[2]:.4f},
    internships: {coefficients[3]:.4f},
    projects: {coefficients[4]:.4f},
    aptitude: {coefficients[5]:.4f},
    backlogs: {coefficients[6]:.4f}
}};

function calculatePlacementChance(studentData) {{
    // Calculate feature scores
    let cgpaScore = (studentData.cgpa / 10) * 100;
    let technicalScore = Math.min(100, (studentData.technicalSkills || []).length * 15);
    let softScore = Math.min(100, (studentData.softSkills || []).length * 12);
    
    // Logistic Regression: z = β₀ + β₁X₁ + β₂X₂ + ...
    let z = MODEL_COEFFICIENTS.intercept;
    z += MODEL_COEFFICIENTS.cgpa * cgpaScore;
    z += MODEL_COEFFICIENTS.technical * technicalScore;
    z += MODEL_COEFFICIENTS.soft * softScore;
    z += MODEL_COEFFICIENTS.internships * (studentData.internships || 0);
    z += MODEL_COEFFICIENTS.projects * (studentData.projects || 0);
    z += MODEL_COEFFICIENTS.aptitude * (studentData.aptitudeScore || 0);
    z += MODEL_COEFFICIENTS.backlogs * (studentData.backlogs || 0);
    
    // Sigmoid function: P = 1 / (1 + e^(-z))
    let probability = 1 / (1 + Math.exp(-z));
    
    // Convert to percentage
    return Math.min(99, Math.max(1, Math.round(probability * 100)));
}}
"""

print(js_code)
print("=" * 60)

print("\n🎉 Training complete!")

# Step 11: Show dataset statistics
print("\n📊 Dataset Statistics:")
print(f"   Total Students: {len(df)}")
print(f"   Placed Students: {df['placed'].sum()}")
print(f"   Placement Rate: {df['placed'].mean() * 100:.1f}%")
print(f"   Average CGPA (Placed): {df[df['placed']==1]['cgpa'].mean():.2f}")
print(f"   Average CGPA (Not Placed): {df[df['placed']==0]['cgpa'].mean():.2f}")