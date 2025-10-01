import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

// Create axios instance with configuration
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor (for debugging)
api.interceptors.request.use(
  (config) => {
    console.log(`🔄 API Request: ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor (for debugging)
api.interceptors.response.use(
  (response) => {
    console.log(`✅ API Response: ${response.config.url}`, response.data);
    return response;
  },
  (error) => {
    console.error(`❌ API Error: ${error.response?.status} ${error.config?.url}`, 
                  error.response?.data || error.message);
    return Promise.reject(error);
  }
);

// API functions for your weather system
export const weatherAPI = {
  // Location Management
  getLocations: () => api.get('/locations'),
  getLocationById: (id) => api.get(`/locations/${id}`),
  getLocationByName: (name) => api.get(`/locations/name/${name}`),
  createLocation: (data) => api.post('/locations', data),
  
  // Sensor Data
  getLatestReadings: () => api.get('/sensors/latest'),
  getHistoricalData: (locationId, hours = 24) => 
    api.get(`/sensors/history/${locationId}?hours=${hours}&limit=50`),
  sendSensorData: (data) => api.post('/sensors', data),
  
  // Alerts
  getActiveAlerts: () => api.get('/alerts'),
  acknowledgeAlert: (alertId) => api.put(`/alerts/${alertId}/acknowledge`),
  getAlertHistory: (limit = 20) => api.get(`/alerts/history?limit=${limit}`),
  createAlert: (data) => api.post('/alerts', data),
  
  // AI Predictions (NEW)
  getAIPrediction: (locationName) => api.get(`/predictions/rainfall/${locationName}`),
  getAllAIPredictions: () => api.get('/predictions/rainfall'),
  
  // System Health
  testConnection: () => api.get('/test'),
  healthCheck: () => api.get('/health'),
};

// Helper function for error handling
export const handleApiError = (error) => {
  if (error.response) {
    // Server responded with error status
    return {
      type: 'server_error',
      status: error.response.status,
      message: error.response.data?.message || 'Server error occurred',
      details: error.response.data
    };
  } else if (error.request) {
    // Request made but no response received
    return {
      type: 'network_error',
      message: 'Unable to connect to server. Please check if backend is running.',
      details: 'No response received'
    };
  } else {
    // Error in request configuration
    return {
      type: 'client_error',
      message: error.message || 'Request configuration error',
      details: error.message
    };
  }
};

// API status checker
export const checkApiStatus = async () => {
  try {
    const response = await weatherAPI.healthCheck();
    return {
      online: true,
      status: response.data.status,
      services: response.data.services,
      aiEnabled: response.data.aiModel ? true : false,
      message: 'All systems operational'
    };
  } catch (error) {
    const errorInfo = handleApiError(error);
    return {
      online: false,
      error: errorInfo,
      message: 'Backend service unavailable'
    };
  }
};

export default api;
