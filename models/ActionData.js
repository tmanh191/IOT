// E:\src_tmanh\IOT\models\ActionDatajs

const mongoose = require('mongoose');

const ActionDataSchema = new mongoose.Schema({
  device: {
    type: String,
    required: true,
    trim: true
  },
  status: {
    type: String,
    enum: ['on', 'off'],
    required: true
  },
  time: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('ActionData', ActionDataSchema);
