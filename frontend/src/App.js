import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import WeatherCard from "./components/WeatherCard";
import RouteMap from "./components/RouteMap";
import AlertSystem from "./components/AlertSystem";
import LoadingSpinner from "./components/LoadingSpinner";
import ErrorBoundary from "./components/ErrorBoundary";
import LocationDetails from "./pages/LocationDetails";
import "./App.css";

const kortiData = {
  location: "Korti",
  time: "08:49 PM",
  temperature: 31,
  humidity: 68,
  rain: "Expected in 15 mins",
  light: "Low",
  description: "Humid",
  weatherType: "Cloudy"
};

const pandharpurData = {
  location: "Pandharpur",
  time: "08:49 PM",
  temperature: 28,
  humidity: 75,
  rain: "Ongoing",
  light: "Medium",
  description: "Rainy",
  weatherType: "Rain"
};

function App() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  useEffect(() => {
    // Simulate initial data loading
    setTimeout(() => {
      setIsLoaded(true);
      setIsInitialLoad(false);
    }, 1500);
  }, []);

  const handleLocationClick = (location) => {
    console.log('Map location clicked:', location);
  };

  if (isInitialLoad) {
    return (
      <div className="App">
        <div className="initial-loading">
          <LoadingSpinner 
            size="large" 
            message="Initializing Weather Monitoring System..." 
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
          
          {/* Alert System */}
          <AlertSystem />
          
          <Routes>
            <Route
              path="/"
              element={
                <div className="landing-container">
                  {/* Hero Section */}
                  <div className="hero-section">
                    <h1 className="hero-title">Weather Monitoring System</h1>
                    <p className="hero-subtitle">Korti ↔ Pandharpur Environmental Data</p>
                  </div>
                  
                  {/* Weather Cards */}
                  <div className={`cards-container ${isLoaded ? 'loaded' : ''}`}>
                    <WeatherCard {...kortiData} />
                    <WeatherCard {...pandharpurData} />
                  </div>
                  
                  {/* Route Map */}
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
