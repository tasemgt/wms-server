const mongoose = require('mongoose');

const guestSchema = new mongoose.Schema({
  guestId: { type: String, unique: true, required: true },
  name: { type: String, required: true },
  email: { type: String },
  phone: { type: String, required: true },
  attendingStatus: { type: String, enum: ['yes', 'maybe', 'no'], required: true },
  guestType: { type: String, enum: ['single', 'group'], required: true },
  groupMembers: [{ type: String }],
  giftSelected: { type: Boolean, default: false },
  giftType: { type: String, enum: ['gift', 'money', null], default: null },
  giftItems: [{ type: mongoose.Schema.Types.ObjectId, ref: 'GiftItem' }],
  moneyAmount: { type: Number, default: 0 },
  message: { type: String },
  status: { type: String, enum: ['Pending', 'Approved', 'Rejected'], default: 'Pending' },
  // qrCodeUrl: { type: String },
  profileUrl: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  approvedAt: { type: Date },
  approvedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  hasAccessGranted: { type: Boolean, default: false },
  accessGrantedAt: { type: Date },
  accessGrantedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
});

module.exports = mongoose.model('Guest', guestSchema);
