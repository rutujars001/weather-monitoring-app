import React from "react";
import "./WeatherCard.css";

const weatherIcons = {
  "Partly Cloudy": "🌤️",
  "Light Rain": "🌧️",
  "Cloudy": "☁️",
  "Rain": "🌧️",
  "Sunny": "☀️"
};

function WeatherCard({
  location,
  time,
  temperature,
  description,
  rainMessage,
  feelsLike,
  humidity,
  wind,
  uvIndex,
  weatherType = "Sunny"
}) {
  // When Details button is clicked, navigate to details page
  const handleDetailsClick = () => {
    window.location.href = `/details/${location.toLowerCase()}`;
  };

  return (
    <div className={`weather-card ${weatherType.toLowerCase()}`}>
      <div className="weather-location-card">
        <h2>{location}</h2>
        <span className="weather-time">{time}</span>
      </div>
      <div className="weather-main-card">
        <span className="weather-icon">{weatherIcons[description] || "❓"}</span>
        <span className="weather-temp">{temperature}°</span>
      </div>
      <span className="weather-desc">{description}</span>
      <div className="weather-status">{rainMessage}</div>
      <div className="weather-details">
        <div className="detail">🌡️ Feels Like<br /><span>{feelsLike}°</span></div>
        <div className="detail">💧 Humidity<br /><span>{humidity}%</span></div>
        <div className="detail">💨 Wind<br /><span>{wind} km/h</span></div>
        <div className="detail">🌞 UV Index<br /><span>{uvIndex}</span></div>
      </div>
      <button className="details-button" onClick={handleDetailsClick}>Details</button>
    </div>
  );
}

export default WeatherCard;
