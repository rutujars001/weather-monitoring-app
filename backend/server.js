const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const http = require('http');
const socketIo = require('socket.io');
require('dotenv').config();

// Import routes
const locationRoutes = require('./routes/locationRoutes');
const sensorRoutes = require('./routes/sensorRoutes');
const alertRoutes = require('./routes/alertRoutes');

const app = express();
const server = http.createServer(app);

// Socket.io setup
const io = socketIo(server, {
  cors: {
    origin: process.env.CLIENT_URL || "http://localhost:3000",
    methods: ["GET", "POST", "PUT", "DELETE"]
  }
});

// Middleware
app.use(cors({
  origin: process.env.CLIENT_URL || "http://localhost:3000",
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API Routes
app.use('/api/locations', locationRoutes);
app.use('/api/sensors', sensorRoutes);
app.use('/api/alerts', alertRoutes);

// Basic health check route
app.get('/', (req, res) => {
  res.json({ 
    message: 'Weather Monitoring System API',
    status: 'Running',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    endpoints: {
      locations: 'GET /api/locations',
      sensors: 'POST /api/sensors',
      latest: 'GET /api/sensors/latest',
      alerts: 'GET /api/alerts',
      health: 'GET /api/health'
    }
  });
});

// Test route for frontend connection
app.get('/api/test', (req, res) => {
  res.json({
    message: 'Backend connection successful!',
    data: {
      korti: { temp: 31, humidity: 68, status: 'active' },
      pandharpur: { temp: 28, humidity: 75, status: 'active' }
    }
  });
});

// Health check route
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    database: mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected'
  });
});

// Test controllers route (temporary)
app.get('/api/test-controllers', async (req, res) => {
  try {
    const Location = require('./models/Location');
    const SensorData = require('./models/SensorData');
    const Alert = require('./models/Alert');
    
    const locationCount = await Location.countDocuments();
    const sensorCount = await SensorData.countDocuments();
    const alertCount = await Alert.countDocuments();
    
    const sampleLocation = await Location.findOne();
    const sampleSensor = await SensorData.findOne().populate('location');
    
    res.json({
      success: true,
      message: "Controllers and Models working!",
      database: {
        locations: locationCount,
        sensorData: sensorCount,
        alerts: alertCount
      },
      sampleData: {
        location: sampleLocation ? sampleLocation.name : 'No data',
        lastSensorReading: sampleSensor ? {
          location: sampleSensor.location.name,
          temperature: sampleSensor.readings.temperature.value,
          timestamp: sampleSensor.timestamp
        } : 'No data'
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Make io available to other modules
app.set('io', io);

// Socket.io connection handling
io.on('connection', (socket) => {
  console.log(`✅ Client connected: ${socket.id}`);
  
  // Send welcome message
  socket.emit('welcome', {
    message: 'Connected to Weather Monitoring System',
    socketId: socket.id
  });
  
  socket.on('disconnect', () => {
    console.log(`❌ Client disconnected: ${socket.id}`);
  });
  
  // Test real-time data
  socket.on('request-data', () => {
    socket.emit('sensor-data', {
      location: 'Korti',
      temperature: 31,
      humidity: 68,
      timestamp: new Date().toISOString()
    });
  });
});

// MongoDB Connection
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(
      process.env.MONGODB_URI || 'mongodb://localhost:27017/weather-monitoring',
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }
    );
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    console.log('⚠️  Continuing without MongoDB...');
  }
};

// Connect to database
connectDB();

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Server Error:', err.stack);
  res.status(500).json({
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    message: `API route not found: ${req.method} ${req.path}`,
    availableRoutes: [
      'GET /',
      'GET /api/locations',
      'GET /api/sensors/latest',
      'GET /api/alerts',
      'POST /api/sensors'
    ]
  });
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log('🚀=============================================');
  console.log(`   Weather Monitoring API Server Started`);
  console.log(`   Port: ${PORT}`);
  console.log(`   Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`   Time: ${new Date().toLocaleString()}`);
  console.log(`   URL: http://localhost:${PORT}`);
  console.log('   Available APIs:');
  console.log('   📍 GET /api/locations');
  console.log('   📊 GET /api/sensors/latest');
  console.log('   🚨 GET /api/alerts');
  console.log('   📤 POST /api/sensors');
  console.log('=============================================🚀');
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received. Shutting down gracefully...');
  server.close(() => {
    console.log('Process terminated');
  });
});

module.exports = { app, io };
