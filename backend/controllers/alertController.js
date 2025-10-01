const Alert = require('../models/Alert');
const Location = require('../models/Location');

// Get all active alerts
const getActiveAlerts = async (req, res) => {
  try {
    const alerts = await Alert.find({ isActive: true })
      .populate('location')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: alerts.length,
      data: alerts
    });
  } catch (error) {
    console.error('Error fetching active alerts:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching alerts',
      error: error.message
    });
  }
};

// Create new alert
const createAlert = async (req, res) => {
  try {
    const { locationId, type, severity, message, prediction } = req.body;
    const io = req.app.get('io');

    const alert = new Alert({
      location: locationId,
      type,
      severity,
      message,
      prediction,
      isActive: true
    });

    const savedAlert = await alert.save();
    await savedAlert.populate('location');

    // Emit to connected clients
    io.emit('new-alert', {
      _id: savedAlert._id,
      locationName: savedAlert.location.name,
      type: savedAlert.type,
      severity: savedAlert.severity,
      message: savedAlert.message,
      prediction: savedAlert.prediction,
      timestamp: savedAlert.createdAt
    });

    res.status(201).json({
      success: true,
      message: 'Alert created successfully',
      data: savedAlert
    });
  } catch (error) {
    console.error('Error creating alert:', error);
    res.status(400).json({
      success: false,
      message: 'Error creating alert',
      error: error.message
    });
  }
};

// Acknowledge/dismiss alert
const acknowledgeAlert = async (req, res) => {
  try {
    const alertId = req.params.id;
    
    const alert = await Alert.findByIdAndUpdate(
      alertId,
      { 
        isActive: false,
        acknowledgedAt: new Date()
      },
      { new: true }
    ).populate('location');

    if (!alert) {
      return res.status(404).json({
        success: false,
        message: 'Alert not found'
      });
    }

    res.json({
      success: true,
      message: 'Alert acknowledged',
      data: alert
    });
  } catch (error) {
    console.error('Error acknowledging alert:', error);
    res.status(500).json({
      success: false,
      message: 'Error acknowledging alert',
      error: error.message
    });
  }
};

// Get alert history
const getAlertHistory = async (req, res) => {
  try {
    const { limit = 50, locationId } = req.query;
    
    let query = {};
    if (locationId) {
      query.location = locationId;
    }

    const alerts = await Alert.find(query)
      .populate('location')
      .sort({ createdAt: -1 })
      .limit(parseInt(limit));

    res.json({
      success: true,
      count: alerts.length,
      data: alerts
    });
  } catch (error) {
    console.error('Error fetching alert history:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching alert history',
      error: error.message
    });
  }
};

module.exports = {
  getActiveAlerts,
  createAlert,
  acknowledgeAlert,
  getAlertHistory
};
