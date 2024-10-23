// routes/actionRoutes.js
const express = require('express');
const router = express.Router();
const controlController = require('../controllers/controlController');

// GET /api/history - Get action data history
router.get('/', controlController.getActionData);

module.exports = router;

