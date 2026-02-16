# Context-Aware Card Recommendation Engine (ML)

This is a Python machine learning service that recommends cards based on **User Context & Behavior**.

## 🧠 Model Features
It uses a **Random Forest Classifier** trained on user-centric behavioral data.
*   **Location**: Where is the user? (Home, Office, Travel, Retail, Online)
*   **Time**: What time is it? (Hour of day)
*   **Spending Pattern**: Transaction Amount & Category (Dining, Travel, etc.)
*   **Recent Usage**: What did they use last? (Habitual bias)

## 📦 Setup & Usage

### 1. Install Dependencies
```bash
pip install pandas numpy scikit-learn
```

### 2. Run the Engine
**Important:** Run this from the project root directory.
```bash
python ml/recommendation_engine.py
```

### 3. Example Output
```text
🚀 Generating user-centric behavioral data...
🧠 Training Context-Aware Recommendation Model...
✅ Model Trained! Prediction Accuracy: 98.25%

--- 🔮 User Scenario Tests ---

Scenario: Booking Flight at Airport
Context: Loc: Travel, Time: 10:00, Cat: Travel
Recommended: Platinum Travel Card (Confidence: 95.0%)
Reason: High value travel transaction detected.
```
