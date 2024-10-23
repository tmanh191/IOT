const express = require('express');
const router = express.Router();
const { getGioCount } = require('../utils/dataAggregator');

// Tạo route để lấy số lần gió > 60
router.get('/count', getGioCount);

module.exports = router;
