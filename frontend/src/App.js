import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import WeatherCard from "./components/WeatherCard";
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

  useEffect(() => {
    setTimeout(() => setIsLoaded(true), 200);
  }, []);

  return (
    <Router>
      <div className="App">
        <Navbar />
        <Routes>
          <Route
            path="/"
            element={
              <div className="landing-container">
                <div className="hero-section">
                  <h1 className="hero-title">Weather Monitoring System</h1>
                  <p className="hero-subtitle">Korti ↔ Pandharpur Environmental Data</p>
                </div>
                <div className={`cards-container ${isLoaded ? 'loaded' : ''}`}>
                  <WeatherCard {...kortiData} />
                  <WeatherCard {...pandharpurData} />
                </div>
              </div>
            }
          />
          <Route path="/details/:location" element={<LocationDetails />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
