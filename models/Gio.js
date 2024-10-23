const mongoose = require('mongoose');

const gioSchema = new mongoose.Schema({
  createdAt: { type: Date, default: Date.now }
});

const Gio = mongoose.model('Gio', gioSchema);

module.exports = Gio;
