import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import WeatherCard from "./components/WeatherCard";
import RouteMap from "./components/RouteMap";
import AlertSystem from "./components/AlertSystem";
import LoadingSpinner from "./components/LoadingSpinner";
import ErrorBoundary from "./components/ErrorBoundary";
import LocationDetails from "./pages/LocationDetails";
import { weatherAPI } from "./services/api";
import useWebSocket from "./hooks/useWebSocket";
import "./App.css";

function App() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [locations, setLocations] = useState([]);
  const [apiError, setApiError] = useState(null);
  const [backendConnected, setBackendConnected] = useState(false);

  // WebSocket connection for real-time updates
  const { isConnected, liveData, liveAlerts, connectionError } = useWebSocket();

  // Load initial data when app starts
  useEffect(() => {
    loadInitialData();
  }, []);

  // Update UI when live data is received
  useEffect(() => {
    if (liveData) {
      console.log('🔄 Updating UI with live data:', liveData);
      // Update the specific location with new data
      setLocations(prev => prev.map(loc => 
        loc.location === liveData.locationName ? {
          ...loc,
          temperature: liveData.readings.temperature.value,
          humidity: liveData.readings.humidity.value,
          time: new Date(liveData.timestamp).toLocaleTimeString()
        } : loc
      ));
    }
  }, [liveData]);

  const loadInitialData = async () => {
    try {
      console.log('🔄 Loading initial data from backend...');
      
      // Test backend connection first
      const healthResponse = await weatherAPI.testConnection();
      console.log('✅ Backend health check passed:', healthResponse.data);
      setBackendConnected(true);

      // Load locations with latest sensor data
      const locationsResponse = await weatherAPI.getLocations();
      const locationsData = locationsResponse.data.data;
      
      console.log('📊 Raw locations data:', locationsData);

      // Transform API data to match your WeatherCard component format
      const transformedLocations = locationsData.map(location => {
        const reading = location.latestReading;
        return {
          location: location.name,
          time: reading ? 
            new Date(reading.timestamp).toLocaleTimeString('en-US', { 
              hour: '2-digit', 
              minute: '2-digit' 
            }) : 'No data',
          temperature: reading?.temperature || 0,
          humidity: reading?.humidity || 0,
          rain: reading?.rainfall?.detected ? 
            `${reading.rainfall.intensity} rainfall detected` : 
            'No rain detected',
          light: reading?.lightIntensity ? 
            reading.lightIntensity < 50 ? 'Low' :
            reading.lightIntensity < 200 ? 'Medium' : 'High'
            : 'No data',
          description: reading?.rainfall?.detected ? 'Rainy' : 
                      reading?.humidity > 70 ? 'Humid' : 'Clear',
          weatherType: reading?.rainfall?.detected ? 'Rain' : 'Cloudy'
        };
      });

      console.log('✨ Transformed locations for UI:', transformedLocations);
      setLocations(transformedLocations);
      setApiError(null);
      
    } catch (error) {
      console.error('❌ Error loading initial data:', error);
      setApiError(error.message);
      setBackendConnected(false);
      
      // Fallback to mock data when backend is offline
      console.log('🔄 Using fallback mock data');
      setLocations([
        {
          location: "Korti",
          time: "Backend Offline",
          temperature: 31,
          humidity: 68,
          rain: "Backend Offline - Mock Data",
          light: "Mock",
          description: "Offline",
          weatherType: "Cloudy"
        },
        {
          location: "Pandharpur",
          time: "Backend Offline", 
          temperature: 28,
          humidity: 75,
          rain: "Backend Offline - Mock Data",
          light: "Mock",
          description: "Offline",
          weatherType: "Rain"
        }
      ]);
    } finally {
      setIsLoaded(true);
      setTimeout(() => setIsInitialLoad(false), 1000);
    }
  };

  const handleLocationClick = (location) => {
    console.log('🗺️ Map location clicked:', location);
  };

  // Show loading screen initially
  if (isInitialLoad) {
    return (
      <div className="App">
        <div className="initial-loading">
          <LoadingSpinner 
            size="large" 
            message={backendConnected ? 
              "Loading weather data from database..." : 
              "Connecting to weather monitoring system..."
            } 
          />
        </div>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <Router>
        <div className="App">
          <Navbar />
          
          {/* Connection Status Indicators */}
          <div className="connection-status">
            <div className={`status-indicator ${backendConnected ? 'connected' : 'disconnected'}`}>
              {backendConnected ? '🟢 Backend Connected' : '🔴 Backend Offline'}
            </div>
            <div className={`status-indicator ${isConnected ? 'connected' : 'disconnected'}`}>
              {isConnected ? '📡 Live Updates Active' : '📡 Live Updates Offline'}
            </div>
          </div>

          {/* API Error Banner */}
          {apiError && (
            <div className="api-error-banner">
              ⚠️ Backend Error: {apiError} - Using cached/mock data
              <button 
                onClick={loadInitialData}
                style={{marginLeft: '10px', padding: '2px 8px', borderRadius: '4px'}}
              >
                Retry
              </button>
            </div>
          )}
          
          {/* Real-time Alert System */}
          <AlertSystem liveAlerts={liveAlerts} />
          
          <Routes>
            <Route
              path="/"
              element={
                <div className="landing-container">
                  {/* Hero Section */}
                  <div className="hero-section">
                    <h1 className="hero-title">Weather Monitoring System</h1>
                    <p className="hero-subtitle">
                      Korti ↔ Pandharpur Environmental Data
                      {backendConnected && ' • Live Data Connected'}
                    </p>
                  </div>
                  
                  {/* Weather Cards with Real/Mock Data */}
                  <div className={`cards-container ${isLoaded ? 'loaded' : ''}`}>
                    {locations.map((locationData, index) => (
                      <WeatherCard 
                        key={`${locationData.location}-${index}`} 
                        {...locationData} 
                      />
                    ))}
                  </div>
                  
                  {/* Interactive Route Map */}
                  <RouteMap onLocationClick={handleLocationClick} />
                </div>
              }
            />
            <Route path="/details/:location" element={<LocationDetails />} />
          </Routes>
        </div>
      </Router>
    </ErrorBoundary>
  );
}

export default App;
