import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./LocationDetails.css";

const sampleWeather = {
  korti: {
    location: "Korti",
    time: "08:49 PM",
    temperature: 31,
    humidity: 68,
    rain: "Expected in 15 mins",
    light: "Low (120 lux)",
    temperatureDetails: {
      current: 31,
      min: 28,
      max: 35,
      trend: "Rising",
      history: [28, 29, 30, 31, 32]
    },
    humidityDetails: {
      current: 68,
      comfort: "Moderate",
      trend: "Stable",
      history: [65, 67, 68, 68, 70]
    },
    rainDetails: {
      status: "Expected in 15 mins",
      probability: "85%",
      intensity: "Light",
      duration: "30 mins"
    },
    lightDetails: {
      current: "120 lux",
      condition: "Low Light",
      uvIndex: "2 (Low)",
      sunrise: "06:30 AM",
      sunset: "06:45 PM"
    }
  },
  pandharpur: {
    location: "Pandharpur",
    time: "08:49 PM",
    temperature: 28,
    humidity: 75,
    rain: "Ongoing",
    light: "Medium (250 lux)",
    temperatureDetails: {
      current: 28,
      min: 25,
      max: 30,
      trend: "Steady",
      history: [26, 27, 28, 28, 27]
    },
    humidityDetails: {
      current: 75,
      comfort: "High",
      trend: "Rising",
      history: [70, 72, 74, 75, 76]
    },
    rainDetails: {
      status: "Ongoing",
      probability: "95%",
      intensity: "Moderate",
      duration: "2 hours"
    },
    lightDetails: {
      current: "250 lux",
      condition: "Medium Light",
      uvIndex: "1 (Very Low)",
      sunrise: "06:28 AM",
      sunset: "06:47 PM"
    }
  }
};

function LocationDetails() {
  const { location } = useParams();
  const navigate = useNavigate();
  const data = sampleWeather[location] || sampleWeather["korti"];

  const handleGoBack = () => {
    navigate('/');
  };

  return (
    <div className="details-page">
      <div className="page-header">
        <h1>{data.location} Weather Station</h1>
        <p>Last updated: {data.time}</p>
      </div>

      <div className="sensor-grid">
        {/* Temperature Section */}
        <div className="sensor-section temperature-section">
          <div className="section-header">
            <span className="sensor-icon">🌡️</span>
            <h2>Temperature</h2>
          </div>
          <div className="main-value">{data.temperatureDetails.current}°C</div>
          <div className="detail-grid">
            <div className="detail-item">
              <span className="label">Min Today</span>
              <span className="value">{data.temperatureDetails.min}°C</span>
            </div>
            <div className="detail-item">
              <span className="label">Max Today</span>
              <span className="value">{data.temperatureDetails.max}°C</span>
            </div>
            <div className="detail-item">
              <span className="label">Trend</span>
              <span className="value">{data.temperatureDetails.trend}</span>
            </div>
            <div className="detail-item">
              <span className="label">History</span>
              <span className="value">{data.temperatureDetails.history.join("°, ")}°C</span>
            </div>
          </div>
        </div>

        {/* Humidity Section */}
        <div className="sensor-section humidity-section">
          <div className="section-header">
            <span className="sensor-icon">💧</span>
            <h2>Humidity</h2>
          </div>
          <div className="main-value">{data.humidityDetails.current}%</div>
          <div className="detail-grid">
            <div className="detail-item">
              <span className="label">Comfort Level</span>
              <span className="value">{data.humidityDetails.comfort}</span>
            </div>
            <div className="detail-item">
              <span className="label">Trend</span>
              <span className="value">{data.humidityDetails.trend}</span>
            </div>
            <div className="detail-item">
              <span className="label">History</span>
              <span className="value">{data.humidityDetails.history.join("%, ")}%</span>
            </div>
          </div>
        </div>

        {/* Rain Section */}
        <div className="sensor-section rain-section">
          <div className="section-header">
            <span className="sensor-icon">🌧️</span>
            <h2>Rain Sensor</h2>
          </div>
          <div className="main-value">{data.rainDetails.status}</div>
          <div className="detail-grid">
            <div className="detail-item">
              <span className="label">Probability</span>
              <span className="value">{data.rainDetails.probability}</span>
            </div>
            <div className="detail-item">
              <span className="label">Intensity</span>
              <span className="value">{data.rainDetails.intensity}</span>
            </div>
            <div className="detail-item">
              <span className="label">Duration</span>
              <span className="value">{data.rainDetails.duration}</span>
            </div>
          </div>
        </div>

        {/* Light Section */}
        <div className="sensor-section light-section">
          <div className="section-header">
            <span className="sensor-icon">💡</span>
            <h2>Light Sensor</h2>
          </div>
          <div className="main-value">{data.lightDetails.current}</div>
          <div className="detail-grid">
            <div className="detail-item">
              <span className="label">Condition</span>
              <span className="value">{data.lightDetails.condition}</span>
            </div>
            <div className="detail-item">
              <span className="label">UV Index</span>
              <span className="value">{data.lightDetails.uvIndex}</span>
            </div>
            <div className="detail-item">
              <span className="label">Sunrise</span>
              <span className="value">{data.lightDetails.sunrise}</span>
            </div>
            <div className="detail-item">
              <span className="label">Sunset</span>
              <span className="value">{data.lightDetails.sunset}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Go Back Button */}
      <button className="go-back-button" onClick={handleGoBack}>
        <span className="back-arrow">←</span>
        Go Back
      </button>
    </div>
  );
}

export default LocationDetails;
