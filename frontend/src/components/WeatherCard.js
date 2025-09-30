import React from "react";
import { useNavigate } from "react-router-dom";
import "./WeatherCard.css";

const sensorIcons = {
  Rain: "🌧️",
  Humidity: "💧",
  Temperature: "🌡️",
  Light: "💡",
};

function WeatherCard({
  location,
  time,
  temperature,
  humidity,
  rain,
  light,
  description, // e.g. "Rainy"/"Clear"
  weatherType = "Sunny"
}) {
  const navigate = useNavigate();

  const handleDetailsClick = () => {
    navigate(`/details/${location.toLowerCase()}`);
  };

  return (
    <div className={`weather-card ${weatherType.toLowerCase()}`}>
      <div className="weather-location-card">
        <h2>{location}</h2>
        <span className="weather-time">{time}</span>
      </div>
      <div className="weather-main-card">
        <span className="weather-icon">
          {description === "Rainy" ? sensorIcons.Rain : (description === "Clear" ? sensorIcons.Light : sensorIcons.Temperature)}
        </span>
        <span className="weather-temp">{temperature}°C</span>
      </div>
      <span className="weather-desc">{description}</span>
      <div className="weather-details">
        <div className="detail">{sensorIcons.Rain} Rain<br /><span>{rain}</span></div>
        <div className="detail">{sensorIcons.Humidity} Humidity<br /><span>{humidity}%</span></div>
        <div className="detail">{sensorIcons.Light} Light<br /><span>{light}</span></div>
        <div className="detail">{sensorIcons.Temperature} Temp<br /><span>{temperature}°C</span></div>
      </div>
      <button className="details-button" onClick={handleDetailsClick}>Details</button>
    </div>
  );
}

export default WeatherCard;
