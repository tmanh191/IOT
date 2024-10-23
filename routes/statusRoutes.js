// routes/statusRoutes.js
const express = require('express');
const router = express.Router();
const statusController = require('../controllers/statusController');

// API để lấy trạng thái thiết bị hiện tại
router.get('/', statusController.getStatus);

module.exports = router;
