// routes/controlRoutes.js
const express = require('express');
const router = express.Router();
const controlController = require('../controllers/controlController');

// POST /api/control - Điều khiển thiết bị
router.post('/', controlController.controlDevice);

module.exports = router;
