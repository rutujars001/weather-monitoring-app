const Location = require('../models/Location');
const SensorData = require('../models/SensorData');

// Get all locations with latest sensor data
const getAllLocations = async (req, res) => {
  try {
    const locations = await Location.find({ isActive: true });
    
    // Get latest sensor data for each location
    const locationsWithData = await Promise.all(
      locations.map(async (location) => {
        const latestData = await SensorData.findOne({ 
          location: location._id 
        })
        .sort({ timestamp: -1 })
        .populate('location');

        return {
          _id: location._id,
          name: location.name,
          coordinates: location.coordinates,
          description: location.description,
          deviceId: location.deviceId,
          isActive: location.isActive,
          latestReading: latestData ? {
            temperature: latestData.readings.temperature.value,
            humidity: latestData.readings.humidity.value,
            rainfall: latestData.readings.rainfall,
            lightIntensity: latestData.readings.lightIntensity.value,
            timestamp: latestData.timestamp,
            dataQuality: latestData.dataQuality
          } : null
        };
      })
    );

    res.json({
      success: true,
      count: locationsWithData.length,
      data: locationsWithData
    });
  } catch (error) {
    console.error('Error fetching locations:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching locations',
      error: error.message
    });
  }
};

// Get specific location by ID
const getLocationById = async (req, res) => {
  try {
    const location = await Location.findById(req.params.id);
    
    if (!location) {
      return res.status(404).json({
        success: false,
        message: 'Location not found'
      });
    }

    // Get latest 10 readings for this location
    const recentReadings = await SensorData.find({ 
      location: location._id 
    })
    .sort({ timestamp: -1 })
    .limit(10);

    res.json({
      success: true,
      data: {
        location,
        recentReadings
      }
    });
  } catch (error) {
    console.error('Error fetching location:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching location',
      error: error.message
    });
  }
};

// Get location by name
const getLocationByName = async (req, res) => {
  try {
    const locationName = req.params.name.toLowerCase();
    const location = await Location.findOne({ 
      name: new RegExp(locationName, 'i')
    });
    
    if (!location) {
      return res.status(404).json({
        success: false,
        message: `Location '${req.params.name}' not found`
      });
    }

    // Get latest reading and historical data (last 24 hours)
    const latestReading = await SensorData.findOne({ 
      location: location._id 
    }).sort({ timestamp: -1 });

    const historicalData = await SensorData.find({ 
      location: location._id,
      timestamp: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) }
    }).sort({ timestamp: -1 });

    res.json({
      success: true,
      data: {
        location,
        latestReading,
        historicalData,
        dataCount: historicalData.length
      }
    });
  } catch (error) {
    console.error('Error fetching location by name:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching location',
      error: error.message
    });
  }
};

// Create new location
const createLocation = async (req, res) => {
  try {
    const { name, coordinates, description, deviceId } = req.body;

    const location = new Location({
      name,
      coordinates,
      description,
      deviceId
    });

    const savedLocation = await location.save();

    res.status(201).json({
      success: true,
      message: 'Location created successfully',
      data: savedLocation
    });
  } catch (error) {
    console.error('Error creating location:', error);
    res.status(400).json({
      success: false,
      message: 'Error creating location',
      error: error.message
    });
  }
};

module.exports = {
  getAllLocations,
  getLocationById,
  getLocationByName,
  createLocation
};
