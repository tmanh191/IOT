// models/SensorData.js
const mongoose = require('mongoose');

const SensorDataSchema = new mongoose.Schema({
  temperature: {
    type: Number,
    required: true,
  },
  humidity: {
    type: Number,
    required: true,
  },
  light: {
    type: Number,
    required: true,
  },
  gio: {
    type: Number,
    required: true,
  },

  createdAt: {
    type: Date,
    required: Date.now
  },
});

module.exports = mongoose.model('SensorData', SensorDataSchema);
