const express = require('express');
const router = express.Router();
const {
  postSensorData,
  getLatestReadings,
  getHistoricalData
} = require('../controllers/sensorController');

// POST /api/sensors - ESP32/Arduino sends data here
router.post('/', postSensorData);

// GET /api/sensors/latest - Get latest readings from all locations
router.get('/latest', getLatestReadings);

// GET /api/sensors/history/:locationId - Get historical data
router.get('/history/:locationId', getHistoricalData);

module.exports = router;
