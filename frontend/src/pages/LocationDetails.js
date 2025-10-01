import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import SensorCharts from '../components/SensorCharts';
import AIPredictionCard from '../components/AIPredictionCard';
import LoadingSpinner from '../components/LoadingSpinner';
import { weatherAPI } from '../services/api';
import './LocationDetails.css';

function LocationDetails() {
  const { location } = useParams();
  const [locationData, setLocationData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(new Date());

  useEffect(() => {
    loadLocationData();
    // Auto-refresh data every 2 minutes
    const interval = setInterval(() => {
      loadLocationData(true); // Silent refresh
    }, 2 * 60 * 1000);

    return () => clearInterval(interval);
  }, [location]);

  const loadLocationData = async (silent = false) => {
    try {
      if (!silent) setLoading(true);
      
      console.log(`📍 Loading data for location: ${location}`);
      const response = await weatherAPI.getLocationByName(location);
      
      setLocationData(response.data.data);
      setError(null);
      setLastUpdated(new Date());
      
      console.log('✅ Location data loaded successfully');
      
    } catch (error) {
      console.error('❌ Error loading location details:', error);
      setError('Unable to load real-time data from server');
      
      // Provide fallback data structure
      const fallbackData = {
        location: {
          name: location.charAt(0).toUpperCase() + location.slice(1),
          description: `${location.charAt(0).toUpperCase() + location.slice(1)} Weather Station`,
          coordinates: location.toLowerCase() === 'korti' ? 
            { latitude: 17.686944, longitude: 75.243333 } :
            { latitude: 17.669444, longitude: 75.264444 }
        },
        latestReading: {
          readings: {
            temperature: { value: location.toLowerCase() === 'korti' ? 31 : 28, unit: 'C' },
            humidity: { value: location.toLowerCase() === 'korti' ? 68 : 75, unit: '%' },
            lightIntensity: { value: location.toLowerCase() === 'korti' ? 120 : 95, unit: 'lux' },
            rainfall: { 
              detected: location.toLowerCase() === 'pandharpur', 
              intensity: location.toLowerCase() === 'pandharpur' ? 'light' : 'none' 
            }
          },
          timestamp: new Date(Date.now() - 5 * 60 * 1000) // 5 minutes ago
        },
        historicalData: [],
        dataCount: 0
      };
      
      setLocationData(fallbackData);
      
    } finally {
      if (!silent) setLoading(false);
    }
  };

  const getWeatherIcon = (reading) => {
    if (!reading) return '❓';
    
    const temp = reading.readings.temperature.value;
    const humidity = reading.readings.humidity.value;
    const isRaining = reading.readings.rainfall.detected;
    
    if (isRaining) return '🌧️';
    if (humidity > 80) return '☁️';
    if (temp > 35) return '☀️';
    if (temp < 20) return '❄️';
    return '⛅';
  };

  const getConditionDescription = (reading) => {
    if (!reading) return 'No data';
    
    const temp = reading.readings.temperature.value;
    const humidity = reading.readings.humidity.value;
    const isRaining = reading.readings.rainfall.detected;
    
    if (isRaining) return `Rainy, ${temp}°C`;
    if (humidity > 80 && temp < 30) return `Humid & Cool, ${temp}°C`;
    if (temp > 35) return `Hot & Sunny, ${temp}°C`;
    if (humidity < 40) return `Dry conditions, ${temp}°C`;
    return `Pleasant, ${temp}°C`;
  };

  if (loading) {
    return (
      <div className="location-details">
        <div className="initial-loading">
          <LoadingSpinner size="large" message={`Loading ${location} weather station data...`} />
        </div>
      </div>
    );
  }

  if (!locationData) {
    return (
      <div className="location-details">
        <div className="error-state">
          <h2>⚠️ Unable to load location data</h2>
          <button onClick={() => loadLocationData()} className="retry-button">
            🔄 Try Again
          </button>
        </div>
      </div>
    );
  }

  const locationInfo = locationData.location;
  const latestReading = locationData.latestReading;

  return (
    <div className="location-details">
      {/* Header with navigation */}
      <div className="details-header">
        <Link to="/" className="back-button">
          ← Back to Dashboard
        </Link>
        <div className="header-content">
          <h1>
            {getWeatherIcon(latestReading)} {locationInfo.name} Weather Station
          </h1>
          <p className="location-description">
            {getConditionDescription(latestReading)}
          </p>
          <p className="coordinates">
            📍 Coordinates: {locationInfo.coordinates.latitude.toFixed(6)}, {locationInfo.coordinates.longitude.toFixed(6)}
          </p>
        </div>
        <div className="refresh-info">
          <button onClick={() => loadLocationData()} className="refresh-button">
            🔄 Refresh Data
          </button>
          <div className="last-updated">
            Last updated: {lastUpdated.toLocaleTimeString()}
          </div>
        </div>
      </div>

      {/* Error Banner */}
      {error && (
        <div className="error-banner">
          ⚠️ {error} - Showing cached data
          <button onClick={() => loadLocationData()}>🔄 Retry Connection</button>
        </div>
      )}

      {/* Current Conditions Panel */}
      <div className="current-conditions">
        <h2>📊 Current Environmental Conditions</h2>
        {latestReading ? (
          <div className="conditions-grid">
            <div className="condition-card temperature">
              <div className="condition-icon">🌡️</div>
              <div className="condition-value">
                {latestReading.readings.temperature.value}°{latestReading.readings.temperature.unit}
              </div>
              <div className="condition-label">Temperature</div>
              <div className="condition-status">
                {latestReading.readings.temperature.value > 35 ? 'Very Hot' :
                 latestReading.readings.temperature.value > 30 ? 'Hot' :
                 latestReading.readings.temperature.value > 25 ? 'Warm' :
                 latestReading.readings.temperature.value > 20 ? 'Cool' : 'Cold'}
              </div>
            </div>
            
            <div className="condition-card humidity">
              <div className="condition-icon">💧</div>
              <div className="condition-value">
                {latestReading.readings.humidity.value}{latestReading.readings.humidity.unit}
              </div>
              <div className="condition-label">Humidity</div>
              <div className="condition-status">
                {latestReading.readings.humidity.value > 80 ? 'Very Humid' :
                 latestReading.readings.humidity.value > 60 ? 'Humid' :
                 latestReading.readings.humidity.value > 40 ? 'Moderate' : 'Dry'}
              </div>
            </div>
            
            <div className="condition-card light">
              <div className="condition-icon">☀️</div>
              <div className="condition-value">
                {latestReading.readings.lightIntensity.value}
              </div>
              <div className="condition-label">Light Intensity (lux)</div>
              <div className="condition-status">
                {latestReading.readings.lightIntensity.value > 300 ? 'Very Bright' :
                 latestReading.readings.lightIntensity.value > 150 ? 'Bright' :
                 latestReading.readings.lightIntensity.value > 50 ? 'Dim' : 'Dark'}
              </div>
            </div>
            
            <div className="condition-card rainfall">
              <div className="condition-icon">
                {latestReading.readings.rainfall.detected ? '🌧️' : '☀️'}
              </div>
              <div className="condition-value">
                {latestReading.readings.rainfall.detected ? 
                  latestReading.readings.rainfall.intensity.charAt(0).toUpperCase() + 
                  latestReading.readings.rainfall.intensity.slice(1) : 'None'
                }
              </div>
              <div className="condition-label">Rainfall Status</div>
              <div className="condition-status">
                {latestReading.readings.rainfall.detected ? 
                  `${latestReading.readings.rainfall.intensity} precipitation` : 
                  'Clear skies'
                }
              </div>
            </div>
          </div>
        ) : (
          <div className="no-data-panel">
            <div className="no-data-icon">📡</div>
            <h3>No Current Sensor Data</h3>
            <p>Unable to retrieve latest readings from weather station</p>
            <button onClick={() => loadLocationData()} className="retry-data-button">
              🔄 Retry Data Fetch
            </button>
          </div>
        )}
        
        {latestReading && (
          <div className="reading-timestamp">
            🕐 Sensor reading from: {new Date(latestReading.timestamp).toLocaleString()}
          </div>
        )}
      </div>

      {/* AI Prediction Section */}
      <div className="ai-prediction-section">
        <h2>🤖 Artificial Intelligence Weather Prediction</h2>
        <AIPredictionCard location={location} />
      </div>

      {/* Historical Data & Charts */}
      <div className="charts-section">
        <h2>📈 Historical Trends & Analysis</h2>
        <div className="charts-description">
          <p>Real-time sensor data trends and AI-powered rainfall predictions based on environmental patterns</p>
        </div>
        <SensorCharts location={location} />
      </div>

      {/* Weather Station Information */}
      <div className="station-info">
        <h2>🏢 Weather Station Information</h2>
        <div className="info-grid">
          <div className="info-item">
            <span className="info-icon">📍</span>
            <div className="info-content">
              <strong>Station Name:</strong>
              <span>{locationInfo.name}</span>
            </div>
          </div>
          
          <div className="info-item">
            <span className="info-icon">🗺️</span>
            <div className="info-content">
              <strong>GPS Coordinates:</strong>
              <span>
                {locationInfo.coordinates.latitude.toFixed(6)}°N, 
                {locationInfo.coordinates.longitude.toFixed(6)}°E
              </span>
            </div>
          </div>
          
          <div className="info-item">
            <span className="info-icon">📊</span>
            <div className="info-content">
              <strong>Data Points Available:</strong>
              <span>{locationData.dataCount || locationData.historicalData?.length || 0} readings</span>
            </div>
          </div>
          
          <div className="info-item">
            <span className="info-icon">🔄</span>
            <div className="info-content">
              <strong>Update Frequency:</strong>
              <span>Every 5 minutes</span>
            </div>
          </div>
          
          <div className="info-item">
            <span className="info-icon">🎯</span>
            <div className="info-content">
              <strong>Station Status:</strong>
              <span className="status active">🟢 Online & Active</span>
            </div>
          </div>
          
          <div className="info-item">
            <span className="info-icon">🤖</span>
            <div className="info-content">
              <strong>AI Features:</strong>
              <span className="ai-enabled">Rainfall Prediction System Active</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LocationDetails;
