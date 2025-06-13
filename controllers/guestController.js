const Guest = require('../models/Guest');
const GiftItem = require('../models/GiftItem');
// const QRCode = require('qrcode');
const { nanoid } = require('nanoid');
const { sendRSVPCreationMessage } = require('../services/whatsappService');

exports.registerGuest = async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      attendingStatus,
      guestType,
      groupMembers = [],
      giftSelected,
      giftType,
      giftItems = [],
      moneyAmount = 0,
      message
    } = req.body;

    // const existingGuest = await Guest.findOne({phone});

    // if (existingGuest) {
    //   return res.status(400).json({
    //     message: 'A guest with this phone number already exists.'
    //   });
    // }

    const guestId = `mf${nanoid(5)}`;
    const profileUrl = `${process.env.FRONT_END_URL}/profile/${guestId}`;
    // const qrCodeUrl = await QRCode.toDataURL(profileUrl);

    const guest = new Guest({
      guestId,
      name,
      email,
      phone,
      attendingStatus,
      guestType,
      groupMembers,
      giftSelected,
      giftType,
      giftItems,
      moneyAmount,
      message,
      profileUrl,
      // qrCodeUrl
    });

    console.log('Gift items:', giftItems);

    // Update gift pick count if applicable
    if (giftSelected && giftType === 'gift' && Array.isArray(giftItems)) {
      for (const giftId of giftItems) {
        await GiftItem.findByIdAndUpdate(giftId, { $inc: { pickedCount: 1 } });
      }
    }

    await guest.save();
    // Send WhatsApp message
    await sendRSVPCreationMessage(guest);
    res.status(201).json({ message: 'Registration successful', guestId, profileUrl });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Registration failed', error: err.message });
  }
};

// GET /api/guests (Admin only)
exports.getAllGuests = async (req, res) => {
  try {
    // if (req.user.role !== 'admin') {
    //   return res.status(403).json({ message: 'Access denied. Admins only.' });
    // }

    const guests = await Guest.find()
      .populate('giftItems') // Populates gift item details
      .sort({ createdAt: -1 }); // Optional: show latest first

    res.status(200).json({ guests });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch guests', error: err.message });
  }
};

// GET /api/guests/:guestId
exports.getGuestById = async (req, res) => {
  try {
    const guest = await Guest.findOne({ guestId: req.params.guestId })
      .populate('giftItems');

    if (!guest) {
      return res.status(404).json({ message: 'Guest not found' });
    }

    res.status(200).json({ guest });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch guest', error: err.message });
  }
};

exports.getGuestContributions = async (req, res) => {
  try {
    const contributors = await Guest.find({
      giftType: 'money',
      moneyAmount: { $gt: 0 }
    }).select('guestId name moneyAmount');

    const formatted = contributors.map((guest, index) => ({
      id: index + 1,
      guestName: guest.name,
      guestId: guest.guestId,
      amount: guest.moneyAmount
    }));

    res.status(200).json(formatted);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch contributions', error: err.message });
  }
};

