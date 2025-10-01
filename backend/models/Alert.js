const mongoose = require('mongoose');

const alertSchema = new mongoose.Schema({
  location: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Location',
    required: true
  },
  type: {
    type: String,
    enum: ['rainfall_prediction', 'temperature_warning', 'humidity_alert', 'system_error'],
    required: true
  },
  severity: {
    type: String,
    enum: ['low', 'medium', 'high', 'critical'],
    required: true
  },
  message: {
    type: String,
    required: true
  },
  prediction: {
    rainProbability: { type: Number, min: 0, max: 100 },
    timeWindow: { type: Number }, // minutes
    confidence: { 
      type: String, 
      enum: ['low', 'medium', 'high'] 
    }
  },
  isActive: {
    type: Boolean,
    default: true
  },
  acknowledgedAt: Date
}, {
  timestamps: true
});

// Indexes for efficient queries
alertSchema.index({ location: 1, isActive: 1 });
alertSchema.index({ type: 1, severity: 1 });

module.exports = mongoose.model('Alert', alertSchema);
