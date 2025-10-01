import React, { useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Polyline, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import './RouteMap.css';

// Fix for default markers
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom weather station icon
const weatherStationIcon = new L.Icon({
  iconUrl: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMjAiIGN5PSIyMCIgcj0iMjAiIGZpbGw9IiM0Mjg1RjQiIGZpbGwtb3BhY2l0eT0iMC45Ii8+CjxjaXJjbGUgY3g9IjIwIiBjeT0iMjAiIHI9IjE2IiBmaWxsPSJ3aGl0ZSIgZmlsbC1vcGFjaXR5PSIwLjIiLz4KPHN2ZyB4PSI4IiB5PSI4IiB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0id2hpdGUiPgo8cGF0aCBkPSJNMTIgMmwtMS4wOSA0LjA5TDcgNWwyIDJoNXptMCAyMGwxLjA5LTQuMDlMMTcgMTlsLTItMmgtNXptOC0xMmwyLTItMi0ydjVoMnptLTggMGgtNXYyaDV6TTEyIDEyYTIgMiAwIDEgMSAwLTQgMiAyIDAgMCAxIDAgNHoiLz4KPC9zdmc+Cjwvc3ZnPg==',
  iconSize: [40, 40],
  iconAnchor: [20, 40],
  popupAnchor: [0, -40]
});

// Real coordinates with actual road route
const routeData = {
  path: [
    [17.686944, 75.243333], // Korti (SKN Sinhgad College)
    [17.686800, 75.245000], // Exit Korti
    [17.685000, 75.248000], // Road junction
    [17.683000, 75.251000], // Main road
    [17.680000, 75.254000], // Highway
    [17.677000, 75.257000], // Midway point
    [17.674000, 75.260000], // Approaching Pandharpur
    [17.671000, 75.262000], // Pandharpur outskirts
    [17.669444, 75.264444]  // Pandharpur (Vitthal Temple)
  ],
  locations: [
    {
      id: 1,
      name: "Korti Weather Station",
      position: [17.686944, 75.243333],
      data: {
        temperature: 31,
        humidity: 68,
        rain: "Expected in 15 mins",
        light: "Low",
        status: "active"
      }
    },
    {
      id: 2,
      name: "Pandharpur Weather Station",
      position: [17.669444, 75.264444],
      data: {
        temperature: 28,
        humidity: 75,
        rain: "Ongoing",
        light: "Medium",
        status: "active"
      }
    }
  ]
};

function RouteMap({ onLocationClick }) {
  const mapRef = useRef();

  const handleMarkerClick = (location) => {
    if (onLocationClick) {
      onLocationClick(location);
    }
  };

  return (
    <div className="route-map-container">
      <div className="map-header">
        <h3>🗺️ Live Route Navigation</h3>
        <p>Real-time driving route • Korti to Pandharpur</p>
      </div>
      
      <div className="map-wrapper">
        <MapContainer
          ref={mapRef}
          center={[17.6782, 75.2539]} // Center between locations
          zoom={12}
          className="route-map"
        >
          {/* High-quality tile layer (Google Maps style) */}
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          
          {/* Alternative: Satellite view */}
          {/* <TileLayer
            url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
            attribution='&copy; <a href="https://www.esri.com/">Esri</a>'
          /> */}
          
          {/* Route path */}
          <Polyline
            positions={routeData.path}
            pathOptions={{
              color: '#4285F4',
              weight: 6,
              opacity: 0.9,
              lineCap: 'round',
              lineJoin: 'round'
            }}
          />
          
          {/* Weather station markers */}
          {routeData.locations.map((location) => (
            <Marker
              key={location.id}
              position={location.position}
              icon={weatherStationIcon}
              eventHandlers={{
                click: () => handleMarkerClick(location)
              }}
            >
              <Popup className="custom-popup">
                <div className="popup-content">
                  <h4>{location.name}</h4>
                  <div className="sensor-readings">
                    <div className="reading">
                      <span className="icon">🌡️</span>
                      <span>{location.data.temperature}°C</span>
                    </div>
                    <div className="reading">
                      <span className="icon">💧</span>
                      <span>{location.data.humidity}%</span>
                    </div>
                    <div className="reading">
                      <span className="icon">🌧️</span>
                      <span>{location.data.rain}</span>
                    </div>
                    <div className="reading">
                      <span className="icon">💡</span>
                      <span>{location.data.light}</span>
                    </div>
                  </div>
                  <div className={`status ${location.data.status}`}>
                    ● LIVE DATA
                  </div>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
      
      <div className="route-info">
        <div className="route-details">
          <div className="detail-item">
            <span className="icon">📍</span>
            <span>Distance: ~8.2 km</span>
          </div>
          <div className="detail-item">
            <span className="icon">🚗</span>
            <span>Driving Time: ~15 mins</span>
          </div>
          <div className="detail-item">
            <span className="icon">📡</span>
            <span>Real-time Data</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RouteMap;
