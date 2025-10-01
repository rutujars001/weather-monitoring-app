const express = require('express');
const router = express.Router();
const {
  getAllLocations,
  getLocationById,
  getLocationByName,
  createLocation
} = require('../controllers/locationController');

// GET /api/locations - Get all locations with latest data
router.get('/', getAllLocations);

// GET /api/locations/:id - Get specific location by ID
router.get('/:id', getLocationById);

// GET /api/locations/name/:name - Get location by name (korti/pandharpur)
router.get('/name/:name', getLocationByName);

// POST /api/locations - Create new location
router.post('/', createLocation);

module.exports = router;
