const Guest = require('../models/Guest');
const User = require('../models/User');
const { sendApprovalMessage } = require('../services/whatsappService');

// Dashboard summary
exports.getDashboardStats = async (req, res) => {
  try {
    const totalGuests = await Guest.countDocuments();
    const totalApproved = await Guest.countDocuments({ status: 'Approved' });
    const totalPending = await Guest.countDocuments({ status: 'Pending' });

    // Sum of all moneyAmount where giftType is 'money'
    const totalMoney = await Guest.aggregate([
      { $match: { giftType: 'money' } },
      { $group: { _id: null, total: { $sum: '$moneyAmount' } } }
    ]);
    const moneyValue = totalMoney[0]?.total || 0;

    // Sum total number of gifts picked (assuming gifts is an array)
    const giftAggregation = await Guest.aggregate([
      {
        $project: {
          giftCount: { $size: { $ifNull: ['$giftItems', []] } }
        }
      },
      {
        $group: {
          _id: null,
          totalGifts: { $sum: '$giftCount' }
        }
      }
    ]);
    const totalGifts = giftAggregation[0]?.totalGifts || 0;

    res.json({
      totalGuests,
      totalApproved,
      totalPending,
      totalGifts,
      totalMoneyPledged: moneyValue
    });
  } catch (err) {
    res.status(500).json({ message: 'Error fetching dashboard stats', error: err.message });
  }
};


// List guests
exports.getAllGuests = async (req, res) => {
  try {
    const guests = await Guest.find().populate('giftItems');
    res.json(guests);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching guests', error: err.message });
  }
};

// Approve guest
exports.approveGuest = async (req, res) => {
  try {
    const { guestId } = req.params;

    const guest = await Guest.findOne({ guestId });
    if (!guest) return res.status(404).json({ message: 'Guest not found' });

    guest.status = 'Approved';
    guest.approvedAt = new Date();
    guest.approvedBy = req.user.id;
    await guest.save();

    guest.phone = guest.phone.split('+')[1]; // Remove '+' from phone number for WhatsApp API

    // Send WhatsApp message with profile URL
    await sendApprovalMessage(guest);

    res.json({ message: 'Guest approved', guest });
  } catch (err) {
    res.status(500).json({ message: 'Error approving guest', error: err.message });
  }
};

// Reject guest
exports.rejectGuest = async (req, res) => {
  try {
    const { guestId } = req.params;
    const guest = await Guest.findOneAndUpdate({ guestId }, { status: 'Rejected' });
    if (!guest) return res.status(404).json({ message: 'Guest not found' });

    res.json({ message: 'Guest rejected' });
  } catch (err) {
    res.status(500).json({ message: 'Error rejecting guest', error: err.message });
  }
};

// GET /api/admin/users - Get all users (admin only)
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password'); // exclude password
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch users', error: err.message });
  }
};

// GET /api/admin/users/:id - Get one user by ID (admin only)
exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });

    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch user', error: err.message });
  }
};