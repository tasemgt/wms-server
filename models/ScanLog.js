const mongoose = require('mongoose');

const scanLogSchema = new mongoose.Schema({
  guest: { type: mongoose.Schema.Types.ObjectId, ref: 'Guest' },
  scannedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  scannedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('ScanLog', scanLogSchema);
