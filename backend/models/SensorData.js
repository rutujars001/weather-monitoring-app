const mongoose = require('mongoose');

const sensorDataSchema = new mongoose.Schema({
  location: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Location',
    required: true
  },
  deviceId: {
    type: String,
    required: true
  },
  readings: {
    temperature: {
      value: { type: Number, required: true },
      unit: { type: String, default: 'C' }
    },
    humidity: {
      value: { type: Number, required: true },
      unit: { type: String, default: '%' }
    },
    rainfall: {
      detected: { type: Boolean, required: true },
      intensity: { 
        type: String, 
        enum: ['none', 'light', 'moderate', 'heavy'],
        default: 'none'
      }
    }
    // Add more fields to readings if needed
  },
  timestamp: {
    type: Date,
    default: Date.now
  },
  dataQuality: {
    type: String,
    enum: ['excellent', 'good', 'fair', 'poor'],
    default: 'good'
  }
}, {
  timestamps: true
});

sensorDataSchema.index({ location: 1, timestamp: -1 });
sensorDataSchema.index({ deviceId: 1 });

// THIS IS CRITICAL!
module.exports = mongoose.model('SensorData', sensorDataSchema);
