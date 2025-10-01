import React, { useState, useEffect } from 'react';
import './AlertSystem.css';

const sampleAlerts = [
  {
    id: 1,
    type: 'warning',
    location: 'Korti',
    message: 'Rain expected in 15 minutes!',
    severity: 'medium',
    timestamp: new Date(),
    icon: '🌧️'
  },
  {
    id: 2,
    type: 'info',
    location: 'Pandharpur',
    message: 'Heavy rainfall ongoing - Duration: 2 hours',
    severity: 'high',
    timestamp: new Date(Date.now() + 2000), // 2 seconds later
    icon: '⛈️'
  }
];

function AlertSystem() {
  const [alerts, setAlerts] = useState([]);
  const [visibleAlerts, setVisibleAlerts] = useState([]);

  useEffect(() => {
    // Show first alert after 2 seconds
    setTimeout(() => {
      setAlerts([sampleAlerts[0]]);
      setVisibleAlerts([sampleAlerts[0]]);
    }, 2000);

    // Show second alert after 4 seconds
    setTimeout(() => {
      setAlerts(sampleAlerts);
      setVisibleAlerts(sampleAlerts);
    }, 4000);

    // Auto-dismiss first alert after 8 seconds
    setTimeout(() => {
      setVisibleAlerts(prev => prev.filter(alert => alert.id !== 1));
    }, 8000);

    // Auto-dismiss second alert after 12 seconds
    setTimeout(() => {
      setVisibleAlerts(prev => prev.filter(alert => alert.id !== 2));
    }, 12000);

  }, []);

  const dismissAlert = (alertId) => {
    setVisibleAlerts(prev => prev.filter(alert => alert.id !== alertId));
  };

  if (visibleAlerts.length === 0) return null;

  return (
    <div className="alert-system">
      {visibleAlerts.map((alert, index) => (
        <div 
          key={alert.id} 
          className={`alert-notification ${alert.severity} ${alert.type}`}
          style={{ animationDelay: `${index * 0.2}s` }}
        >
          <div className="alert-content">
            <div className="alert-header">
              <span className="alert-icon">{alert.icon}</span>
              <div className="alert-title">
                <span className="alert-location">{alert.location}</span>
                <span className="alert-type-badge">{alert.type.toUpperCase()}</span>
              </div>
            </div>
            <div className="alert-message">{alert.message}</div>
            <div className="alert-time">
              {alert.timestamp.toLocaleTimeString()}
            </div>
          </div>
          <button 
            className="alert-dismiss"
            onClick={() => dismissAlert(alert.id)}
          >
            ×
          </button>
        </div>
      ))}
    </div>
  );
}

export default AlertSystem;
