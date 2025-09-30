import React from "react";
import Navbar from "./components/Navbar";
import WeatherCard from "./components/WeatherCard";

// Sample data for demonstration
const kortiData = {
  location: "Korti",
  time: "08:49 PM",
  temperature: 31,
  description: "Partly Cloudy",
  rainMessage: "Rain expected in 15 mins!",
  feelsLike: 35,
  humidity: 68,
  wind: 12,
  uvIndex: 7,
  weatherType: "Cloudy"
};

const pandharpurData = {
  location: "Pandharpur",
  time: "08:49 PM",
  temperature: 28,
  description: "Light Rain",
  rainMessage: "Rain will continue for 2 hours",
  feelsLike: 32,
  humidity: 75,
  wind: 8,
  uvIndex: 6,
  weatherType: "Rain"
};

function App() {
  return (
    <div
      className="App"
      style={{
        minHeight: "100vh",
        background: "linear-gradient(120deg, #556080 0%, #6c7b92 100%)"
      }}
    >
      <Navbar />
      <div style={{ display: "flex", gap: "27px", justifyContent: "center", marginTop: 32 }}>
        <WeatherCard {...kortiData} />
        <WeatherCard {...pandharpurData} />
      </div>
    </div>
  );
}

export default App;
