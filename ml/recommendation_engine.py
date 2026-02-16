import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestClassifier
from sklearn.preprocessing import LabelEncoder
from sklearn.model_selection import train_test_split
from datetime import datetime

class ContextAwareCardRecommender:
    def __init__(self):
        self.model = RandomForestClassifier(n_estimators=100, random_state=42)
        self.label_encoders = {}
        self.feature_columns = [
            'location_type',      # Home, Office, Travel, Retail
            'time_of_day',        # Hour (0-23)
            'transaction_amount', # Spending Pattern
            'merchant_category',  # Spending Pattern
            'last_card_used'      # Recent Usage Bias
        ]

    def generate_mock_data(self, n_samples=2000):
        """
        Generates synthetic data strictly follows user behavior patterns:
        Location, Time, Recent Usage, and Spending.
        """
        np.random.seed(42)
        
        data = {
            'location_type': np.random.choice(['Home', 'Office', 'Travel', 'Retail Store', 'Online'], n_samples),
            'time_of_day': np.random.randint(0, 24, n_samples),
            'transaction_amount': np.random.exponential(scale=4000, size=n_samples),
            'merchant_category': np.random.choice(['Groceries', 'Dining', 'Travel', 'Electronics', 'Fuel'], n_samples),
            'last_card_used': np.random.choice(['Debit Card', 'Credit Card', 'Travel Card', 'Shopping Card'], n_samples),
            'recommended_card': [] # Target
        }

        for i in range(n_samples):
            loc = data['location_type'][i]
            time = data['time_of_day'][i]
            amt = data['transaction_amount'][i]
            cat = data['merchant_category'][i]
            last = data['last_card_used'][i]
            
            # Logic: "User-Centric Rules"
            
            # Rule 1: Travel Context (Location + Category)
            if loc == 'Travel' or cat == 'Travel':
                if amt > 5000:
                    data['recommended_card'].append('Platinum Travel Card') # High value travel
                else:
                    data['recommended_card'].append('Forex Card') # Low value/standard travel
            
            # Rule 2: Office/Work Hours (Time + Location)
            elif loc == 'Office' and (9 <= time <= 18):
                data['recommended_card'].append('Corporate Expense Card')
            
            # Rule 3: Groceries/Fuel (Category + Amount)
            elif cat in ['Groceries', 'Fuel']:
                data['recommended_card'].append('Everyday Cashback Card')
                
            # Rule 4: High Value Electronics (Amount + Category)
            elif cat == 'Electronics' and amt > 20000:
                data['recommended_card'].append('Gold Credit Card') # EMI/Protection
                
            # Rule 5: Habit/Recency (If no strong rule matches, default to last used if appropriate)
            elif last == 'Debit Card' and amt < 2000:
                 data['recommended_card'].append('Debit Card')
                 
            # Default
            else:
                data['recommended_card'].append('Standard Credit Card')

        return pd.DataFrame(data)

    def preprocess_data(self, df):
        """Encodes categorical features."""
        df_encoded = df.copy()
        
        # Enforce consistent ordering for encoding if possible, or just fit
        for col in ['location_type', 'merchant_category', 'last_card_used']:
            le = LabelEncoder()
            df_encoded[col] = le.fit_transform(df[col])
            self.label_encoders[col] = le
            
        return df_encoded

    def train(self):
        print("🚀 Generating user-centric behavioral data...")
        df = self.generate_mock_data()
        
        print("⚙️ Processing location, time, and spending patterns...")
        df_processed = self.preprocess_data(df)
        
        X = df_processed[self.feature_columns]
        y = df_processed['recommended_card']
        
        X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
        
        print("🧠 Training Context-Aware Recommendation Model...")
        self.model.fit(X_train, y_train)
        
        accuracy = self.model.score(X_test, y_test)
        print(f"✅ Model Trained! Prediction Accuracy: {accuracy:.2%}")
        return accuracy

    def get_recommendation(self, location, time_hour, amount, category, last_card):
        try:
            # Safe transform with fallback for unseen labels in a real app (simplified here)
            loc_enc = self.label_encoders['location_type'].transform([location])[0]
            cat_enc = self.label_encoders['merchant_category'].transform([category])[0]
            last_enc = self.label_encoders['last_card_used'].transform([last_card])[0]
        except ValueError as e:
            return f"Error: Input value not seen in training data. {e}"

        features = pd.DataFrame([{
            'location_type': loc_enc,
            'time_of_day': time_hour,
            'transaction_amount': amount,
            'merchant_category': cat_enc,
            'last_card_used': last_enc
        }])

        prediction = self.model.predict(features)[0]
        probs = self.model.predict_proba(features)[0]
        confidence = max(probs)
        
        return {
            'card': prediction,
            'confidence': f"{confidence:.1%}",
            'context': f"Loc: {location}, Time: {time_hour}:00, Cat: {category}"
        }

# Example Usage
if __name__ == "__main__":
    recommender = ContextAwareCardRecommender()
    recommender.train()
    
    print("\n--- 🔮 User Scenario Tests ---")
    
    # Scenario 1: User is at the Airport (Travel Location)
    rec1 = recommender.get_recommendation(
        location='Travel', 
        time_hour=10, 
        amount=12000, 
        category='Travel', 
        last_card='Debit Card'
    )
    print(f"\nScenario: Booking Flight at Airport")
    print(f"Context: {rec1['context']}")
    print(f"Recommended: {rec1['card']} (Confidence: {rec1['confidence']})")
    print("Reason: High value travel transaction detected.")

    # Scenario 2: Lunch at Office (Work Location + Time)
    rec2 = recommender.get_recommendation(
        location='Office', 
        time_hour=13, 
        amount=850, 
        category='Dining', 
        last_card='Corporate Expense Card'
    )
    print(f"\nScenario: Team Lunch at Work")
    print(f"Context: {rec2['context']}")
    print(f"Recommended: {rec2['card']} (Confidence: {rec2['confidence']})")
    print("Reason: Office location during work hours suggests corporate expense.")
    
    # Scenario 3: Grocery Shopping (Spending Pattern)
    rec3 = recommender.get_recommendation(
        location='Retail Store', 
        time_hour=18, 
        amount=4500, 
        category='Groceries', 
        last_card='Standard Credit Card'
    )
    print(f"\nScenario: Evening Grocery Run")
    print(f"Context: {rec3['context']}")
    print(f"Recommended: {rec3['card']} (Confidence: {rec3['confidence']})")
    print("Reason: Category 'Groceries' maps to cashback card.")
