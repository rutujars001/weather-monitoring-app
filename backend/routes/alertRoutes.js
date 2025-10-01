const express = require('express');
const router = express.Router();
const {
  getActiveAlerts,
  createAlert,
  acknowledgeAlert,
  getAlertHistory
} = require('../controllers/alertController');

// GET /api/alerts - Get all active alerts
router.get('/', getActiveAlerts);

// POST /api/alerts - Create new alert
router.post('/', createAlert);

// PUT /api/alerts/:id/acknowledge - Acknowledge/dismiss alert
router.put('/:id/acknowledge', acknowledgeAlert);

// GET /api/alerts/history - Get alert history
router.get('/history', getAlertHistory);

module.exports = router;
