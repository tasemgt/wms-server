const express = require('express');
const router = express.Router();
const { registerGuest, getGuestById, getGuestContributions } = require('../controllers/guestController');
const { getAllGuests } = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/auth');



router.post('/register', registerGuest);

router.get('/contributions', protect, authorize('admin'), getGuestContributions); // Uncomment if needed
router.get('/:guestId', getGuestById);
router.get('/', protect, authorize('admin'), getAllGuests);

module.exports = router;