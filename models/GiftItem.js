// models/GiftItem.js
const mongoose = require('mongoose');

const giftItemSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  description: String,
  pickedCount: { type: Number, default: 0 },
});

module.exports = mongoose.model('GiftItem', giftItemSchema);