import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar
} from 'recharts';
import './SensorCharts.css';

// Sample historical data for past 24 hours
const historicalData = {
  korti: [
    { hour: '00:00', temp: 26, humidity: 72, light: 0, rain: 0 },
    { hour: '03:00', temp: 24, humidity: 78, light: 0, rain: 0 },
    { hour: '06:00', temp: 25, humidity: 75, light: 20, rain: 0 },
    { hour: '09:00', temp: 28, humidity: 68, light: 150, rain: 0 },
    { hour: '12:00', temp: 32, humidity: 60, light: 280, rain: 0 },
    { hour: '15:00', temp: 35, humidity: 55, light: 320, rain: 0 },
    { hour: '18:00', temp: 31, humidity: 68, light: 180, rain: 5 },
    { hour: '21:00', temp: 29, humidity: 72, light: 50, rain: 15 }
  ],
  pandharpur: [
    { hour: '00:00', temp: 25, humidity: 78, light: 0, rain: 2 },
    { hour: '03:00', temp: 23, humidity: 82, light: 0, rain: 8 },
    { hour: '06:00', temp: 24, humidity: 80, light: 15, rain: 12 },
    { hour: '09:00', temp: 26, humidity: 75, light: 120, rain: 18 },
    { hour: '12:00', temp: 29, humidity: 70, light: 250, rain: 25 },
    { hour: '15:00', temp: 31, humidity: 68, light: 280, rain: 30 },
    { hour: '18:00', temp: 28, humidity: 75, light: 150, rain: 35 },
    { hour: '21:00', temp: 27, humidity: 78, light: 40, rain: 40 }
  ]
};

// Prediction data for next 6 hours
const predictionData = {
  korti: [
    { hour: 'Now', temp: 31, humidity: 68, rainProb: 85, confidence: 'High' },
    { hour: '+1h', temp: 30, humidity: 72, rainProb: 90, confidence: 'High' },
    { hour: '+2h', temp: 29, humidity: 75, rainProb: 75, confidence: 'Medium' },
    { hour: '+3h', temp: 28, humidity: 78, rainProb: 60, confidence: 'Medium' },
    { hour: '+4h', temp: 27, humidity: 80, rainProb: 45, confidence: 'Low' },
    { hour: '+5h', temp: 26, humidity: 82, rainProb: 30, confidence: 'Low' }
  ],
  pandharpur: [
    { hour: 'Now', temp: 28, humidity: 75, rainProb: 95, confidence: 'High' },
    { hour: '+1h', temp: 27, humidity: 78, rainProb: 85, confidence: 'High' },
    { hour: '+2h', temp: 27, humidity: 80, rainProb: 80, confidence: 'High' },
    { hour: '+3h', temp: 26, humidity: 82, rainProb: 70, confidence: 'Medium' },
    { hour: '+4h', temp: 25, humidity: 85, rainProb: 55, confidence: 'Medium' },
    { hour: '+5h', temp: 24, humidity: 87, rainProb: 40, confidence: 'Low' }
  ]
};

function SensorCharts({ location }) {
  const locationKey = location.toLowerCase();
  const historical = historicalData[locationKey] || historicalData.korti;
  const prediction = predictionData[locationKey] || predictionData.korti;

  return (
    <div className="sensor-charts-container">
      
      {/* Temperature & Humidity Trends */}
      <div className="chart-section">
        <h3>📈 Temperature & Humidity Trends (24 Hours)</h3>
        <div className="chart-wrapper">
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={historical}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.2)" />
              <XAxis dataKey="hour" stroke="#fff" fontSize={12} />
              <YAxis stroke="#fff" fontSize={12} />
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'rgba(0,0,0,0.8)',
                  border: 'none',
                  borderRadius: '8px',
                  color: '#fff'
                }}
              />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="temp" 
                stroke="#ff6b35" 
                strokeWidth={3}
                name="Temperature (°C)"
                dot={{ fill: '#ff6b35', strokeWidth: 2, r: 4 }}
              />
              <Line 
                type="monotone" 
                dataKey="humidity" 
                stroke="#4fc3f7" 
                strokeWidth={3}
                name="Humidity (%)"
                dot={{ fill: '#4fc3f7', strokeWidth: 2, r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Light Intensity */}
      <div className="chart-section">
        <h3>💡 Light Intensity Pattern</h3>
        <div className="chart-wrapper">
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={historical}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.2)" />
              <XAxis dataKey="hour" stroke="#fff" fontSize={12} />
              <YAxis stroke="#fff" fontSize={12} />
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'rgba(0,0,0,0.8)',
                  border: 'none',
                  borderRadius: '8px',
                  color: '#fff'
                }}
              />
              <Area 
                type="monotone" 
                dataKey="light" 
                stroke="#fdd835" 
                fill="url(#lightGradient)"
                strokeWidth={2}
              />
              <defs>
                <linearGradient id="lightGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#fdd835" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#fdd835" stopOpacity={0.1}/>
                </linearGradient>
              </defs>
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Rainfall Prediction */}
      <div className="chart-section">
        <h3>🌧️ AI Rainfall Prediction (Next 6 Hours)</h3>
        <div className="chart-wrapper prediction-chart">
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={prediction}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.2)" />
              <XAxis dataKey="hour" stroke="#fff" fontSize={12} />
              <YAxis stroke="#fff" fontSize={12} />
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'rgba(0,0,0,0.8)',
                  border: 'none',
                  borderRadius: '8px',
                  color: '#fff'
                }}
                formatter={(value, name) => [`${value}%`, 'Rain Probability']}
              />
              <Bar 
                dataKey="rainProb" 
                fill="url(#rainGradient)"
                radius={[4, 4, 0, 0]}
                name="Rain Probability"
              />
              <defs>
                <linearGradient id="rainGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#42a5f5" stopOpacity={0.9}/>
                  <stop offset="95%" stopColor="#1976d2" stopOpacity={0.7}/>
                </linearGradient>
              </defs>
            </BarChart>
          </ResponsiveContainer>
        </div>
        
        {/* Prediction Confidence */}
        <div className="prediction-info">
          <h4>🤖 AI Confidence Levels:</h4>
          <div className="confidence-indicators">
            {prediction.slice(0, 3).map((item, index) => (
              <div key={index} className={`confidence-badge ${item.confidence.toLowerCase()}`}>
                <span className="time">{item.hour}</span>
                <span className="confidence">{item.confidence}</span>
                <span className="probability">{item.rainProb}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

    </div>
  );
}

export default SensorCharts;
