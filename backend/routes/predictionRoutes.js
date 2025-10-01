const express = require('express');
const router = express.Router();
const SensorData = require('../models/SensorData');
const Location = require('../models/Location');
const predictionService = require('../services/predictionService');

// AI Rainfall prediction for specific location
router.get('/rainfall/:locationName', async (req, res) => {
  try {
    const locationName = req.params.locationName;
    console.log(`🤖 AI Prediction requested for: ${locationName}`);
    
    // Find location in database
    const location = await Location.findOne({ 
      name: new RegExp(locationName, 'i') 
    });
    
    if (!location) {
      return res.status(404).json({
        success: false,
        message: `Location '${locationName}' not found`
      });
    }

    // Get latest sensor reading
    const latestReading = await SensorData.findOne({ 
      location: location._id 
    }).sort({ timestamp: -1 });

    if (!latestReading) {
      return res.status(404).json({
        success: false,
        message: 'No sensor data available for prediction'
      });
    }

    // Get historical data for trend analysis (last 6 hours)
    const historicalData = await SensorData.find({
      location: location._id,
      timestamp: { $gte: new Date(Date.now() - 6 * 60 * 60 * 1000) }
    }).sort({ timestamp: -1 }).limit(12);

    console.log(`📊 Using ${historicalData.length} historical readings for AI analysis`);

    // Generate AI predictions
    const aiPrediction = predictionService.predictRainfall(latestReading, historicalData);

    // Prepare response
    const response = {
      success: true,
      location: {
        name: location.name,
        coordinates: location.coordinates
      },
      currentConditions: {
        temperature: latestReading.readings.temperature.value,
        humidity: latestReading.readings.humidity.value,
        lightIntensity: latestReading.readings.lightIntensity.value,
        timestamp: latestReading.timestamp
      },
      aiPrediction: aiPrediction.success ? aiPrediction : {
        error: aiPrediction.error,
        fallback: aiPrediction.fallbackPredictions
      },
      metadata: {
        generatedAt: new Date().toISOString(),
        dataPoints: historicalData.length,
        predictionModel: 'WeatherPredictor v2.0'
      }
    };

    console.log(`✅ AI prediction generated successfully for ${locationName}`);
    res.json(response);

  } catch (error) {
    console.error('❌ Prediction API error:', error);
    res.status(500).json({
      success: false,
      message: 'Error generating AI rainfall prediction',
      error: error.message
    });
  }
});

// Get AI predictions for all locations
router.get('/rainfall', async (req, res) => {
  try {
    console.log('🤖 AI Predictions requested for all locations');
    
    const locations = await Location.find({ isActive: true });
    const allPredictions = [];

    for (const location of locations) {
      const latestReading = await SensorData.findOne({ 
        location: location._id 
      }).sort({ timestamp: -1 });

      if (latestReading) {
        const historicalData = await SensorData.find({
          location: location._id,
          timestamp: { $gte: new Date(Date.now() - 6 * 60 * 60 * 1000) }
        }).sort({ timestamp: -1 }).limit(12);

        const aiPrediction = predictionService.predictRainfall(latestReading, historicalData);
        
        allPredictions.push({
          location: location.name,
          coordinates: location.coordinates,
          currentTemp: latestReading.readings.temperature.value,
          currentHumidity: latestReading.readings.humidity.value,
          prediction: aiPrediction.success ? aiPrediction.predictions[0] : null, // Next hour prediction
          fullPrediction: aiPrediction
        });
      }
    }

    res.json({
      success: true,
      count: allPredictions.length,
      predictions: allPredictions,
      generatedAt: new Date().toISOString()
    });

  } catch (error) {
    console.error('❌ All predictions error:', error);
    res.status(500).json({
      success: false,
      message: 'Error generating AI predictions for all locations',
      error: error.message
    });
  }
});

module.exports = router;
