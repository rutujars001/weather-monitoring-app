const SensorData = require('../models/SensorData');
const Location = require('../models/Location');
const Alert = require('../models/Alert');

// Receive sensor data from IoT devices
const postSensorData = async (req, res) => {
  try {
    const { deviceId, temperature, humidity, rainfall, lightIntensity } = req.body;
    const io = req.app.get('io');

    // Find location by device ID
    const location = await Location.findOne({ deviceId, isActive: true });
    
    if (!location) {
      return res.status(404).json({
        success: false,
        message: `Location not found for device ID: ${deviceId}`
      });
    }

    // Create sensor data entry
    const sensorData = new SensorData({
      location: location._id,
      deviceId,
      readings: {
        temperature: {
          value: temperature,
          unit: 'C'
        },
        humidity: {
          value: humidity,
          unit: '%'
        },
        rainfall: {
          detected: rainfall > 0,
          intensity: rainfall > 20 ? 'heavy' : rainfall > 10 ? 'moderate' : rainfall > 0 ? 'light' : 'none'
        },
        lightIntensity: {
          value: lightIntensity,
          unit: 'lux'
        }
      },
      timestamp: new Date(),
      dataQuality: 'good'
    });

    const savedData = await sensorData.save();
    await savedData.populate('location');

    // Emit real-time data to connected clients
    io.emit('sensor-update', {
      locationName: location.name,
      deviceId,
      readings: savedData.readings,
      timestamp: savedData.timestamp
    });

    // Check for alert conditions (simple rainfall prediction)
    await checkAlertConditions(location, savedData, io);

    res.status(201).json({
      success: true,
      message: 'Sensor data received successfully',
      data: savedData
    });
  } catch (error) {
    console.error('Error posting sensor data:', error);
    res.status(500).json({
      success: false,
      message: 'Error processing sensor data',
      error: error.message
    });
  }
};

// Get latest readings from all locations
const getLatestReadings = async (req, res) => {
  try {
    const locations = await Location.find({ isActive: true });
    
    const latestReadings = await Promise.all(
      locations.map(async (location) => {
        const latestData = await SensorData.findOne({ 
          location: location._id 
        })
        .sort({ timestamp: -1 })
        .populate('location');

        return latestData;
      })
    );

    // Filter out null values
    const validReadings = latestReadings.filter(reading => reading !== null);

    res.json({
      success: true,
      count: validReadings.length,
      data: validReadings
    });
  } catch (error) {
    console.error('Error fetching latest readings:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching latest readings',
      error: error.message
    });
  }
};

// Get historical data for specific location
const getHistoricalData = async (req, res) => {
  try {
    const { locationId } = req.params;
    const { hours = 24, limit = 100 } = req.query;

    const startTime = new Date(Date.now() - (hours * 60 * 60 * 1000));
    
    const historicalData = await SensorData.find({
      location: locationId,
      timestamp: { $gte: startTime }
    })
    .sort({ timestamp: -1 })
    .limit(parseInt(limit))
    .populate('location');

    // Group data by hour for charting
    const groupedData = groupDataByHour(historicalData);

    res.json({
      success: true,
      count: historicalData.length,
      timeRange: `${hours} hours`,
      data: historicalData,
      chartData: groupedData
    });
  } catch (error) {
    console.error('Error fetching historical data:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching historical data',
      error: error.message
    });
  }
};

// Simple alert condition checker
const checkAlertConditions = async (location, sensorData, io) => {
  try {
    const { temperature, humidity, rainfall } = sensorData.readings;
    
    // Simple rainfall prediction logic
    if (humidity.value > 80 && temperature.value < 30 && !rainfall.detected) {
      const alert = new Alert({
        location: location._id,
        type: 'rainfall_prediction',
        severity: 'medium',
        message: `Rain expected at ${location.name} - High humidity (${humidity.value}%) detected`,
        prediction: {
          rainProbability: 75,
          timeWindow: 30,
          confidence: 'medium'
        },
        isActive: true
      });

      await alert.save();
      
      // Emit alert to frontend
      io.emit('new-alert', {
        locationName: location.name,
        type: alert.type,
        message: alert.message,
        severity: alert.severity,
        timestamp: alert.createdAt
      });
    }
  } catch (error) {
    console.error('Error checking alert conditions:', error);
  }
};

// Helper function to group data by hour
const groupDataByHour = (data) => {
  const grouped = {};
  
  data.forEach(reading => {
    const hour = new Date(reading.timestamp).toISOString().slice(0, 14) + '00:00.000Z';
    
    if (!grouped[hour]) {
      grouped[hour] = {
        hour: new Date(hour).toLocaleTimeString('en-US', { 
          hour: '2-digit', 
          minute: '2-digit',
          hour12: false 
        }),
        temperature: [],
        humidity: [],
        lightIntensity: []
      };
    }
    
    grouped[hour].temperature.push(reading.readings.temperature.value);
    grouped[hour].humidity.push(reading.readings.humidity.value);
    grouped[hour].lightIntensity.push(reading.readings.lightIntensity.value);
  });

  // Calculate averages
  return Object.values(grouped).map(group => ({
    hour: group.hour,
    temperature: Math.round(group.temperature.reduce((a, b) => a + b, 0) / group.temperature.length),
    humidity: Math.round(group.humidity.reduce((a, b) => a + b, 0) / group.humidity.length),
    lightIntensity: Math.round(group.lightIntensity.reduce((a, b) => a + b, 0) / group.lightIntensity.length)
  })).reverse(); // Most recent first
};

module.exports = {
  postSensorData,
  getLatestReadings,
  getHistoricalData
};
