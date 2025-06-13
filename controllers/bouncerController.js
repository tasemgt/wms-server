const ScanLog = require('../models/ScanLog');
const Guest = require('../models/Guest');

exports.logGuestScan = async (req, res) => {
  try {
    const { guestId } = req.body;

    // Ensure guest exists
    const guest = await Guest.findOne({ guestId });
    if (!guest) {
      return res.status(404).json({ message: 'Guest not found' });
    }

    // Create the scan log
    const scanLog = await ScanLog.create({
      guest: guest._id,
      scannedBy: req.user._id, // assumes bouncer is authenticated
    });

    res.status(201).json({
      message: 'Scan logged successfully',
      scanLog,
    });
  } catch (error) {
    console.error('Error logging scan:', error);
    res.status(500).json({ message: 'Failed to log scan' });
  }
};

exports.grantAccess = async (req, res) => {
  const { guestId } = req.params;
  const bouncerId = req.user._id;

  try {
    const guest = await Guest.findOne({ guestId });

    if (!guest) return res.status(404).json({ error: 'Guest not found' });
    if (guest.status !== 'Approved') {
      return res.status(400).json({ error: 'Guest is not approved' });
    }
    if (guest.hasAccessGranted) {
      return res.status(400).json({ error: 'Access already granted' });
    }

    guest.hasAccessGranted = true;
    guest.accessGrantedAt = new Date();
    guest.accessGrantedBy = bouncerId;
    
    await guest.save();

    res.json({ message: 'Access granted successfully', guest });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

exports.getBouncerStats = async (req, res) => {
  try {
    const bouncerId = req.user._id;

    // Total scans by this bouncer
    const totalScanned = await ScanLog.countDocuments({ scannedBy: bouncerId });

    // Count of unique guests this bouncer has checked in (i.e., guests with accessGrantedBy = this bouncer)
    const guestsAllowed = await Guest.countDocuments({ accessGrantedBy: bouncerId });

    res.status(200).json({
      totalScanned,
      guestsAllowed,
    });
  } catch (error) {
    console.error('Error getting bouncer stats:', error);
    res.status(500).json({ message: 'Failed to retrieve stats' });
  }
};