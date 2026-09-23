import numpy as np
from sklearn.ensemble import IsolationForest

class BGPAnomalyDetector:
    def __init__(self):
        # Isolation Forest is great for finding outliers in real-time streams
        self.model = IsolationForest(n_estimators=100, contamination=0.05, random_state=42)
        self.is_trained = False
        self.training_data = []

    def add_training_data(self, as_path_length, update_frequency):
        """Accumulate baseline normal traffic data"""
        self.training_data.append([as_path_length, update_frequency])
        
        # Auto-train once we have 50 route samples
        if len(self.training_data) == 50 and not self.is_trained:
            self.train()

    def train(self):
        print("\n[ML ENGINE] Training Isolation Forest on BGP baseline...")
        X = np.array(self.training_data)
        self.model.fit(X)
        self.is_trained = True
        print("[ML ENGINE] Model trained and active.\n")

    def predict(self, as_path_length, update_frequency):
        """Returns True if the route looks like a statistical anomaly"""
        if not self.is_trained:
            return False # Default to safe if model is still learning
            
        X = np.array([[as_path_length, update_frequency]])
        prediction = self.model.predict(X)
        return prediction[0] == -1  # -1 indicates an anomaly in Isolation Forest