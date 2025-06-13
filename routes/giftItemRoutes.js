// routes/giftItems.js
const express = require('express');
const router = express.Router();
const {
  createGiftItem,
  getGiftItems,
  updateGiftItem,
  deleteGiftItem,
} = require('../controllers/giftItemController');
const { protect, authorize } = require('../middleware/auth');

// Admin only
router.post('/', protect, authorize('admin'), createGiftItem);
router.put('/:id', protect, authorize('admin'), updateGiftItem);
router.delete('/:id', protect, authorize('admin'), deleteGiftItem);

// Anyone can view
router.get('/', getGiftItems);

module.exports = router;