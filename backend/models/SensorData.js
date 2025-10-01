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
    },
    lightIntensity: {
      value: { type: Number, required: true },
      unit: { type: String, default: 'lux' }
    }
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

// Indexes for efficient queries
sensorDataSchema.index({ location: 1, timestamp: -1 });
sensorDataSchema.index({ deviceId: 1 });

module.exports = mongoose.model('SensorData', sensorDataSchema);
