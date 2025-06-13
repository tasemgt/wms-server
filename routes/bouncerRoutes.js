// routes/bouncer.js
const express = require('express');
const router = express.Router();
const { grantAccess, logGuestScan, getBouncerStats } = require('../controllers/bouncerController');
const { protect, authorize } = require('../middleware/auth');

// Only logged-in bouncers can grant access
router.post('/grant-access/:guestId', protect, authorize('bouncer'), grantAccess);
router.post('/log', protect, authorize('bouncer'), logGuestScan);
router.get('/stats', protect, authorize('bouncer'), getBouncerStats);

module.exports = router;