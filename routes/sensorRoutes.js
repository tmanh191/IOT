// routes/sensorRoutes.js
const express = require('express');
const router = express.Router();
const sensorController = require('../controllers/sensorController');

// GET /api/sensor-data - Get sensor data history
router.get('/', sensorController.getSensorData);

module.exports = router;
