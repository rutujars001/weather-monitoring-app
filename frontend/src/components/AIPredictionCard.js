import React, { useState, useEffect } from 'react';
import { weatherAPI } from '../services/api';
import './AIPredictionCard.css';

function AIPredictionCard({ location }) {
  const [aiPrediction, setAiPrediction] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadAIPrediction();
    // Refresh AI prediction every 5 minutes
    const interval = setInterval(loadAIPrediction, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [location]);

  const loadAIPrediction = async () => {
    try {
      setLoading(true);
      const response = await weatherAPI.getAIPrediction(location.toLowerCase());
      const data = response.data;
      
      if (data.success && data.aiPrediction.success) {
        setAiPrediction(data.aiPrediction);
        setError(null);
      } else {
        setError('AI prediction unavailable');
      }
    } catch (error) {
      console.error('AI prediction error:', error);
      setError('Failed to load AI prediction');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="ai-prediction-card loading">
        <div className="ai-header">
          <h3>🤖 AI Rainfall Prediction</h3>
          <div className="loading-dots">Loading...</div>
        </div>
      </div>
    );
  }

  if (error || !aiPrediction) {
    return (
      <div className="ai-prediction-card error">
        <div className="ai-header">
          <h3>🤖 AI Rainfall Prediction</h3>
          <button onClick={loadAIPrediction} className="retry-btn">🔄 Retry</button>
        </div>
        <p className="error-text">⚠️ {error}</p>
      </div>
    );
  }

  const nextHourPrediction = aiPrediction.predictions[0];

  return (
    <div className="ai-prediction-card">
      <div className="ai-header">
        <h3>🤖 AI Rainfall Prediction</h3>
        <div className="model-badge">
          {aiPrediction.modelInfo.algorithm} v{aiPrediction.modelInfo.version}
        </div>
      </div>

      <div className="prediction-summary">
        <div className="next-hour">
          <h4>Next Hour Forecast</h4>
          <div className="prediction-main">
            <div className="probability">
              <span className="percentage">{nextHourPrediction.probability}%</span>
              <span className="label">Rain Probability</span>
            </div>
            <div className={`confidence ${nextHourPrediction.confidence}`}>
              <span className="confidence-level">{nextHourPrediction.confidence.toUpperCase()}</span>
              <span className="confidence-label">Confidence</span>
            </div>
          </div>
          <div className="intensity-badge">
            Expected: <strong>{nextHourPrediction.intensity}</strong> rainfall
          </div>
        </div>
      </div>

      <div className="hourly-forecast">
        <h4>6-Hour AI Forecast</h4>
        <div className="forecast-timeline">
          {aiPrediction.predictions.slice(0, 6).map((pred, index) => (
            <div key={index} className="forecast-item">
              <div className="hour">{pred.hour}</div>
              <div className={`prob-bar ${pred.confidence}`}>
                <div 
                  className="prob-fill" 
                  style={{ height: `${pred.probability}%` }}
                ></div>
              </div>
              <div className="prob-text">{pred.probability}%</div>
            </div>
          ))}
        </div>
      </div>

      <div className="ai-factors">
        <h4>🧠 AI Analysis Factors</h4>
        <div className="factors-grid">
          {nextHourPrediction.factors && Object.entries(nextHourPrediction.factors).map(([factor, value]) => (
            <div key={factor} className="factor">
              <span className="factor-name">{factor}</span>
              <span className="factor-value">{value}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="ai-footer">
        <div className="accuracy">
          📊 Model Accuracy: {aiPrediction.modelInfo.accuracy}
        </div>
        <div className="last-updated">
          🕐 Updated: {new Date().toLocaleTimeString()}
        </div>
      </div>
    </div>
  );
}

export default AIPredictionCard;
